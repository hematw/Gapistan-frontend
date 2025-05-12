import { Button } from "@heroui/button";
import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useSocket } from "../contexts/SocketContext";
import { Bell, Settings } from "lucide-react";
import ChatListPanel from "../components/ChatListPanel";
import RightSidebar from "../components/RightSidebar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosIns from "../utils/axios";
import { useAuth } from "../contexts/AuthContext";
import { addToast } from "@heroui/toast";
import ChatHeader from "../components/ChatHeader";
import ProfileDropdown from "../components/ProfileDropdown";
import { useDisclosure } from "@heroui/use-disclosure";
import { Modal, ModalBody, ModalContent } from "@heroui/modal";
import Profile from "../components/Profile";
import SelectedFilesDrawer from "../components/SelectedFilesDrawer";
import VoiceRecorder from "../components/VoiceRecorder";
import NoChat from "../components/NoChat";
import MessageForm from "../components/MessageForm";
import ChatTimeline from "../components/ChatTimeline";

const members = [
  { id: 1, name: "Richard Wilson", status: "online" },
  { id: 2, name: "Aamn", status: "offline" },
  { id: 3, name: "You", status: "online" },
  { id: 4, name: "Jaden Parker", status: "online" },
  { id: 5, name: "Conner Garcia", status: "away" },
  { id: 6, name: "Lawrence Patterson", status: "offline" },
];

const chatFiles = [
  { type: "photos", count: 115 },
  { type: "files", count: 200 },
  { type: "shared links", count: 47 },
];

function Chat() {
  const { socket, playSound } = useSocket();
  const [selectedChat, setSelectedChat] = useState(null);
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [files, setFiles] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  const {
    data: chatsData,
    isLoading: chatsLoading,
    error: chatsErr,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const { data } = await axiosIns.get("/chats");
      return data;
    },
  });

  const {
    data: chatTimeline,
    isLoading: chatTimelineLoading,
    error: chatTimelineErr,
  } = useQuery({
    queryKey: ["chats", selectedChat?._id, "timeline"],
    queryFn: async () => {
      const { data } = await axiosIns.get(`/chats/${selectedChat?._id}`);
      return data;
    },
    enabled: !!selectedChat?._id,
  });

  console.log(chatTimeline);

  const chatEndRef = useRef(null);
  const fileRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (formdata) => {
    if (!socket) {
      console.log("Socket not initialized");
      return;
    }

    const text = formdata.get("text")?.trim();
    const file = formdata.get("files");

    // === Validate empty submission ===
    if (!text && (!file || file.size === 0)) {
      return addToast({
        title: "Empty Message",
        description: "Cannot send an empty message without text or file",
        color: "danger",
      });
    }

    // === File Validation ===
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "audio/mpeg",
      "audio/webm",
      "video/webm",
      "image/png",
      "image/jpeg",
      "application/pdf",
    ];

    console.log(file.type);
    if (file && file.size > 0) {
      if (!allowedTypes.includes(file.type)) {
        return addToast({
          title: "Unsupported file type",
          description: "Only MP3, WebM, PNG, PDF and JPEG files are allowed.",
          color: "danger",
        });
      }

      if (file.size > maxSize) {
        return addToast({
          title: "File too large",
          description: "Maximum file size is 5MB.",
          color: "danger",
        });
      }

      // === Upload file via HTTP ===
      try {
        // const uploadForm = new FormData();
        // uploadForm.append("file", file);

        const { data: uploadRes } = await axiosIns.post(
          `/chats/${selectedChat?._id}/upload?receiver=${selectedUser._id}`,
          formdata,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        // Emit message with file
        socket.emit(
          "send_message",
          {
            text,
            files: uploadRes.files, // URL from backend
            senderId: user._id,
            chatId: selectedChat?._id,
            receiverId: selectedUser?._id,
          },
          handleSocketResponse
        );
      } catch (err) {
        console.error("File upload failed:", err);
        return addToast({
          title: "Upload failed",
          description: "Could not upload file. Try again later.",
          color: "danger",
        });
      }
    } else {
      // === Text only ===
      socket.emit(
        "send_message",
        {
          text,
          senderId: user._id,
          chatId: selectedChat?._id,
          receiverId: selectedUser?._id,
        },
        handleSocketResponse
      );
    }
    setFiles([]);
  };

  // Reuse your update cache logic
  const handleSocketResponse = ({ message, error, data }) => {
    if (!error) {
      queryClient.setQueryData(
        ["chats", selectedChat._id, "timeline"],
        (oldData) => {
          if (!oldData) return;

          const newMessages = [...oldData.messages];
          const length = newMessages.length;

          if (
            length > 0 &&
            newMessages[length - 1].label.toLowerCase() === "today"
          ) {
            newMessages[length - 1].items.push({
              ...data,
              contentType: data.file ? "file" : "message",
            });
          } else {
            newMessages.push({
              label: "Today",
              items: [{ ...data, contentType: data.file ? "file" : "message" }],
            });
          }

          return { ...oldData, messages: newMessages };
        }
      );

      queryClient.setQueryData(["chats"], (prev) => {
        if (!prev || !Array.isArray(prev.chats)) return prev;

        return {
          ...prev,
          chats: prev.chats.map((chat) =>
            chat._id === data.chat ? { ...chat, lastMessage: data } : chat
          ),
        };
      });

      scrollToBottom();
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((file) => {
      const isImageOrVideo =
        file.type === "application/pdf" ||
        file.type.startsWith("image/") ||
        file.type.startsWith("audio/") ||
        file.type.startsWith("video/");
      if (isImageOrVideo && file.size / 1024 < 1024 * 5) {
        return true; // 5MB
      } else {
        addToast({
          color: "danger",
          title: "File size exceeds 5MB or invalid file type",
        });
        return false;
      }
    });

    setFiles(selectedFiles);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => {
      const newFiles = Array.from(prevFiles);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleTypingEvent = (isTyping) => {
    if (socket && selectedChat) {
      socket.emit("typing", {
        chatId: selectedChat._id,
        userId: user._id,
        isTyping,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    handleTypingEvent(value.length > 0);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatTimeline?.messages]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("user_online", {
      userId: user._id,
      isOnline: true,
    });

    socket.on("receive_message", (data) => {
      console.log("📩 New message:", data);
      console.log(selectedChat, data);

      const isSameChat = selectedChat?._id === data.chat;

      if (isSameChat) {
        console.log("was same chat 🆗");
        queryClient.setQueryData(
          ["chats", selectedChat._id, "timeline"],
          (oldData) => {
            if (!oldData || !Array.isArray(oldData.messages)) return oldData;

            const messages = [...oldData.messages];
            const lastGroup = messages[messages.length - 1];

            const isTodayGroup =
              lastGroup?.label?.toLowerCase() === "today" &&
              Array.isArray(lastGroup.items);

            if (isTodayGroup) {
              const updatedGroup = {
                ...lastGroup,
                items: [
                  ...lastGroup.items,
                  { ...data, contentType: "message" },
                ],
              };

              messages[messages.length - 1] = updatedGroup;
            } else {
              messages.push({
                label: "Today",
                items: [{ ...data, contentType: "message" }],
              });
            }

            return {
              ...oldData,
              messages,
            };
          }
        );
      }

      console.log("was not same chat ❌");

      queryClient.setQueryData(["chats"], (prev) => {
        if (!prev || !Array.isArray(prev.chats)) return prev;

        const updatedChats = prev.chats.map((chat) => {
          if (chat._id === data.chat) {
            return {
              ...chat,
              lastMessage: data,
            };
          }
          return chat;
        });

        return {
          ...prev,
          chats: updatedChats,
        };
      });

      scrollToBottom();
    });

    socket.on("update_status", ({ userId, isOnline }) => {
      console.log("🟢 Status update for user:", userId);

      queryClient.setQueryData(["chats"], (prev) => {
        if (!prev?.chats) return prev;

        const updatedChats = prev.chats.map((chat) => {
          const updatedParticipants = chat.participants.map((participant) =>
            participant._id === userId
              ? {
                  ...participant,
                  isOnline,
                  lastSeen: isOnline ? null : new Date().toISOString(),
                }
              : participant
          );

          const isUserInChat = chat.participants.some((p) => p._id === userId);
          const newChatStatus =
            !chat.isGroup && isUserInChat ? isOnline : chat.isOnline;

          return {
            ...chat,
            participants: updatedParticipants,
            isOnline: newChatStatus,
          };
        });

        return { ...prev, chats: updatedChats };
      });
    });

    socket.on("typing", ({ chatId, userId, isTyping }) => {
      if (chatId === selectedChat?._id && userId !== user._id) {
        setTypingUser(isTyping ? userId : null);
      }
    });

    socket.onAny((eventName, args) => {
      console.log(eventName, args);
      if (["receive_message"].includes(eventName)) {
        playSound();
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("typing");
    };
  }, [queryClient, selectedChat, socket, user._id]);

  if (chatsLoading) {
    return <p className="text-2xl">Loading...</p>;
  }

  return (
    <>
      <div className="flex gap-4 p-4 w-full h-screen overflow-auto">
        <div className="flex w-96 gap-4">
          <Sidebar />
          <ChatListPanel
            chats={chatsData?.chats}
            isLoading={chatsLoading}
            setSelectedUser={setSelectedUser}
            setSelectedChat={setSelectedChat}
          />
        </div>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody>
                  <Profile />
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>

        <div className="w-screen">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl fond-semibold">Gapistan</h1>
            <div className="flex items-center gap-2">
              <Button startContent={<Settings />} isIconOnly radius="full" />
              <Button startContent={<Bell />} isIconOnly radius="full" />
              <ProfileDropdown user={user} onProfileClick={onOpen} />
            </div>
          </div>
          <div className="flex gap-4 h-[86vh]">
            <div className="flex flex-col flex-1 bg-white dark:bg-dark shadow-lg rounded-2xl">
              {selectedChat || selectedUser ? (
                <>
                  <ChatHeader
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                  />
                  <ChatTimeline
                    chatEndRef={chatEndRef}
                    chatTimeline={chatTimeline}
                    chatTimelineLoading={chatTimelineLoading}
                  />

                  <div className="p-4 border-t relative">
                    {files.length > 0 && (
                      <SelectedFilesDrawer
                        files={files}
                        onRemove={handleRemoveFile}
                      />
                    )}

                    <MessageForm
                      sendMessage={sendMessage}
                      handleFileChange={handleFileChange}
                      handleInputChange={handleInputChange}
                      fileRef={fileRef}
                    />

                    {typingUser && (
                      <div className="text-sm text-gray-500 italic mb-2">
                        {selectedChat.chatName} is typing...
                      </div>
                    )}

                    <VoiceRecorder
                      onSend={(audioBlob) => {
                        const formData = new FormData();
                        formData.append("files", audioBlob);
                        sendMessage(formData);
                      }}
                    />
                  </div>
                </>
              ) : (
                <NoChat />
              )}
            </div>

            <RightSidebar
              selectedChat={selectedChat}
              members={members}
              files={chatFiles}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
