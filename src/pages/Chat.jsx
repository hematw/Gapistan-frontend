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
import useChatSocket from "../hooks/useChatSocket";
import ProfileModal from "../components/ProfileModal";
import useSeenHandler from "../hooks/useSeenHandler";

function Chat() {
  const { socket, playSound } = useSocket();
  const [selectedChat, setSelectedChat] = useState(null);
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [files, setFiles] = useState([]);
  const [typingMessage, setTypingMessage] = useState(null);

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

  const chatEndRef = useRef(null);
  const fileRef = useRef(null);

  useSeenHandler({
    messagesEndRef: chatEndRef,
    socket,
    userId: user._id,
    selectedChat,
  });

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
      "video/mp4",
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
          `/chats/${selectedChat?._id}/upload?receiver=${selectedUser?._id}`,
          formdata,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        // Emit message with file
        socket.emit(
          "send-message",
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
        "send-message",
        {
          text,
          senderId: user._id,
          chatId: selectedChat?._id,
          receiverId: selectedUser?._id,
        },
        handleSocketResponse
      );
    }
    handleTypingEvent(false);
    setFiles([]);
  };

  const handleSocketResponse = ({ message, error, data }) => {
    console.log(message);

    if (!error) {
      // Update chat timeline
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

      // Update chats list and move this chat to the top
      queryClient.setQueryData(["chats"], (prev) => {
        if (!prev || !Array.isArray(prev.chats)) return prev;

        const chatIndex = prev.chats.findIndex(
          (chat) => chat._id === data.chat
        );
        if (chatIndex === -1) return prev;

        const updatedChat = {
          ...prev.chats[chatIndex],
          lastMessage: data,
        };

        const newChats = [
          updatedChat,
          ...prev.chats.filter((chat) => chat._id !== data.chat),
        ];

        return { ...prev, chats: newChats };
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
        content: `${user.firstName || user.username} is typing...}`,
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

  useChatSocket({
    socket,
    user,
    selectedChat,
    chatTimeline,
    queryClient,
    playSound,
    scrollToBottom,
    setTypingMessage,
  });

  if ((chatsErr, chatTimelineErr)) {
    return <p>{chatTimeline.message || chatsErr.message}</p>;
  }
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

        <ProfileModal isOpen={isOpen} onOpenChange={onOpenChange} />

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

                    {typingMessage && (
                      <div className="text-sm text-gray-500 italic mb-2">
                        {typingMessage.chatName}
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

            {!!selectedChat && (
              <RightSidebar
                selectedChat={selectedChat}
                // members={members}
                // files={chatFiles}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
