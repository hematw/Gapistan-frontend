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
import {
  generateECDHKeyPair,
  exportPublicKey,
  importPublicKey,
  deriveSharedAESKey,
  encryptMessage,
  decryptMessage,
} from "../utils/crypto";

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

  // E2EE: Store key pairs and public keys in state (or context for real app)
  const [ecdhKeyPair, setEcdhKeyPair] = useState(null);
  const [chatPublicKeys, setChatPublicKeys] = useState({}); // {chatId: publicKeyJwk}

  useSeenHandler({
    messagesEndRef: chatEndRef,
    socket,
    userId: user._id,
    selectedChat,
  });

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // On mount, generate ECDH key pair if not present
  useEffect(() => {
    async function setupKeys() {
      if (!ecdhKeyPair) {
        const keyPair = await generateECDHKeyPair();
        setEcdhKeyPair(keyPair);
        // Optionally: send public key to server for sharing with other users
      }
    }
    setupKeys();
  }, []);

  // Helper: get or fetch other user's public key for this chat
  async function getOtherUserPublicKey(chatId, receiverId) {
    try {
      if (chatPublicKeys[chatId]) {
        return await importPublicKey(chatPublicKeys[chatId]);
      }
      // Fetch from server (implement endpoint to get user's public key)
      const { data } = await axiosIns.get(`/users/${receiverId}/public-key`);
      setChatPublicKeys((prev) => ({ ...prev, [chatId]: data.publicKey }));
      return await importPublicKey(data.publicKey);
    } catch (error) {
      console.error("Failed to get other user's public key:", error);
      addToast({
        title: "Public Key Error",
        description: "Could not retrieve the other user's public key.",
        color: "danger",
      });
      2;
    }
  }

  const sendMessage = async (formdata) => {
    if (!socket) {
      console.log("Socket not initialized");
      return;
    }

    const rawText = formdata.get("text");
    const text = rawText ? rawText.trim() : "";
    const file = formdata.get("files");

    // === Validate empty submission ===
    const isTextEmpty = text === "";
    const isFileEmpty = !file || file.size === 0;

    if (isTextEmpty && isFileEmpty) {
      return addToast({
        title: "Empty Message",
        description: "Cannot send an empty message without text or file",
        color: "danger",
      });
    }

    let encryptedText = null;
    let iv = null;

    // === Encrypt text if present ===
    if (!isTextEmpty && ecdhKeyPair && selectedChat) {
      let otherUser;
      try {
        if (!selectedChat.isGroup) {
          console.log("first time sending message to user");
          otherUser = selectedChat.members.find((m) => m._id !== user._id);
        }
        console.log(selectedChat, selectedUser, otherUser);
        const otherPubKey = await getOtherUserPublicKey(
          selectedChat?._id,
          selectedUser?._id || otherUser?._id
        );

        const aesKey = await deriveSharedAESKey(
          ecdhKeyPair.privateKey,
          otherPubKey
        );

        const { ciphertext, iv: textIv } = await encryptMessage(aesKey, text);

        if (!ciphertext || ciphertext.byteLength === 0) {
          throw new Error("Encryption returned empty ciphertext");
        }

        encryptedText = btoa(
          String.fromCharCode(...new Uint8Array(ciphertext))
        );

        iv = Array.from(textIv); // Convert to array for socket transport
      } catch (error) {
        console.error("Encryption failed:", error);
        return addToast({
          title: "Encryption Error",
          description: "Could not encrypt message.",
          color: "danger",
        });
      }
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

    const payload = {
      text: encryptedText,
      iv,
      senderId: user?._id,
      chatId: selectedChat?._id,
      receiverId: selectedUser?._id || selectedChat?.members.find(m => m._id !== user._id)?._id,
    };

    if (!isFileEmpty) {
      if (!allowedTypes.includes(file.type)) {
        return addToast({
          title: "Unsupported file type",
          description:
            "Only MP3, WebM, PNG, MP4, PDF and JPEG files are allowed.",
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

      try {
        const { data: uploadRes } = await axiosIns.post(
          `/chats/${selectedChat?._id}/upload?receiver=${selectedUser?._id}`,
          formdata,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        payload.files = uploadRes.files || [];
      } catch (err) {
        console.error("File upload failed:", err);
        return addToast({
          title: "Upload failed",
          description: "Could not upload file. Try again later.",
          color: "danger",
        });
      }
    }

    // === Final Emit ===
    console.log("Sending message payload:", payload);
    socket.emit("send-message", payload, handleSocketResponse);

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

  // E2EE: Decrypt incoming messages
  useEffect(() => {
    async function decryptTimeline() {
      if (!chatTimeline?.messages || !ecdhKeyPair) return;
      for (const group of chatTimeline.messages) {
        for (const msg of group.items) {
          if (msg.text && msg.iv && msg.sender !== user._id) {
            const otherPubKey = await getOtherUserPublicKey(
              selectedChat._id,
              msg.sender._id
            );
            const aesKey = await deriveSharedAESKey(
              ecdhKeyPair.privateKey,
              otherPubKey
            );
            const ciphertext = new Uint8Array(
              atob(msg.text)
                .split("")
                .map((c) => c.charCodeAt(0))
            );
            const iv = new Uint8Array(msg.iv);
            msg.text = await decryptMessage(aesKey, ciphertext, iv);
          }
        }
      }
    }
    decryptTimeline();
  }, [chatTimeline, ecdhKeyPair, selectedChat]);

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
