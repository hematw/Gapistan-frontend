import { Button } from "@heroui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useSocket } from "../contexts/SocketContext";
import { LayoutDashboard, X } from "lucide-react";
import ChatListPanel from "../components/ChatListPanel";
import RightSidebar from "../components/RightSidebar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosIns from "../utils/axios";
import { useAuth } from "../contexts/AuthContext";
import { addToast } from "@heroui/toast";
import ChatHeader from "../components/ChatHeader";
import SelectedFilesDrawer from "../components/SelectedFilesDrawer";
import NoChat from "../components/NoChat";
import MessageForm from "../components/MessageForm";
import ChatTimeline from "../components/ChatTimeline";
import useChatSocket from "../hooks/useChatSocket";
import useSeenHandler from "../hooks/useSeenHandler";
import {
  importPublicKey,
  deriveSharedAESKey,
  encryptMessage,
  decryptMessage,
  decryptGroupAESKey,
} from "../utils/crypto";
import { getPrivateKey } from "../services/keyManager";
import CallingModal from "../components/calls/CallingModal";
import IncomingCallModal from "../components/calls/IncomingCallModal";
import { useCallHandler } from "../hooks/useCallHandler";
import getSenderName from "../utils/getSenderName";
import { Drawer, DrawerContent } from "@heroui/drawer";
import { useDisclosure } from "@heroui/use-disclosure";
import { useIsMobile } from "../hooks/useIsMobile";
import { Link } from "react-router-dom";

function Chat() {
  const { socket, playSound } = useSocket();
  const [selectedChat, setSelectedChat] = useState(null);
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const queryClient = useQueryClient();
  const [files, setFiles] = useState([]);
  const [typingMessage, setTypingMessage] = useState(null);
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isRightSidebarOpen,
    onOpenChange: onRightSidebarOpenChange,
    onOpen: onRightSidebarOpen,
  } = useDisclosure();

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

  console.log("chat component re-rendered");

  const chatEndRef = useRef(null);
  const fileRef = useRef(null);

  const [privateKey, setPrivateKey] = useState(null);
  const [chatPublicKeys, setChatPublicKeys] = useState({});
  const [groupChatKeys, setGroupChatKeys] = useState({});
  const [replyToMessage, setReplyToMessage] = useState(null);

  const {
    isCalling,
    incomingCall,
    handleCall,
    cancelCall,
    acceptCall,
    rejectCall,
  } = useCallHandler({ socket, selectedChat });

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
    async function setupKey() {
      if (!privateKey) {
        const key = await getPrivateKey(user._id);
        setPrivateKey(key);
      }
    }
    setupKey();
  }, [privateKey]);

  // Helper: get or fetch other user's public key for this chat
  const getOtherUserPublicKey = useCallback(async (chatId, receiverId) => {
    try {
      if (chatPublicKeys[chatId]) {
        delete chatPublicKeys[receiverId];
        return await importPublicKey(chatPublicKeys[chatId]);
      }

      const { data } = await axiosIns.get(`/users/${receiverId}/public-key`);   
      if (chatId) {
        setChatPublicKeys((prev) => ({ ...prev, [chatId]: data.publicKey }));
        // Remove old key if exists
        delete chatPublicKeys[receiverId];
      } else {
        setChatPublicKeys((prev) => ({
          ...prev,
          [receiverId]: data.publicKey,
        }));
      }
      return await importPublicKey(data.publicKey);
    } catch (error) {
      console.error("Failed to get other user's public key:", error);
      addToast({
        title: "Public Key Error",
        description: "Could not retrieve the other user's public key.",
        color: "danger",
      });
    }
  }, []);

  const sendMessage = useCallback(
    async (formdata) => {
      console.log(socket);
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

      if (selectedChat?.isGroup) {
        console.log("this is a group chat");
        const groupChatKey = groupChatKeys[selectedChat._id];
        if (groupChatKey) {
          const { ciphertext, iv: textIv } = await encryptMessage(
            groupChatKey,
            text
          );
          encryptedText = btoa(
            String.fromCharCode(...new Uint8Array(ciphertext))
          );
          iv = Array.from(textIv);
        } else {
          console.error("Group chat key not found");
        }
      } else {
        if (!isTextEmpty && privateKey && selectedChat) {
          let otherUser;
          try {
            if (selectedChat.members) {
              otherUser = selectedChat.members.find((m) => m._id !== user._id);
            } else {
              otherUser = selectedUser;
            }

            const otherPubKey = await getOtherUserPublicKey(
              selectedChat?._id,
              selectedUser?._id || otherUser?._id
            );

            const aesKey = await deriveSharedAESKey(privateKey, otherPubKey);

            console.log("Aes key", aesKey);
            const { ciphertext, iv: textIv } = await encryptMessage(
              aesKey,
              text
            );
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

      console.log("repley ", replyToMessage);
      const payload = {
        text: encryptedText,
        iv,
        senderId: user?._id,
        chatId: selectedChat?._id,
        replyTo: replyToMessage?._id,
        receiverId:
          selectedUser?._id ||
          selectedChat?.members.find((m) => m._id !== user._id)?._id,
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
      setReplyToMessage(null);
      setFiles([]);
    },
    [
      socket,
      selectedChat,
      replyToMessage,
      user._id,
      selectedUser,
      groupChatKeys,
      privateKey,
      getOtherUserPublicKey,
    ]
  );

  const handleSocketResponse = async ({ message, error, data }) => {
    console.log(message, error, data);

    if (!error) {
      let decryptedOutgoingText = null;
      if (data.text && data.iv && privateKey && selectedChat) {
        try {
          let aesKey;

          if (selectedChat.isGroup) {
            aesKey = groupChatKeys[selectedChat._id];
            if (!aesKey) {
              console.warn("Missing group AES key for decryption");
              throw new Error("Group AES key not loaded yet");
            }
          } else {
            let otherUser;
            if (selectedChat.members) {
              otherUser = selectedChat.members.find((m) => m._id !== user._id);
            } else {
              otherUser = selectedUser;
            }

            const otherPubKey = await getOtherUserPublicKey(
              selectedChat._id,
              otherUser._id
            );
            aesKey = await deriveSharedAESKey(privateKey, otherPubKey);
          }

          const iv = new Uint8Array(data.iv);
          decryptedOutgoingText = await decryptMessage(aesKey, data.text, iv);
        } catch (err) {
          console.error("Error decrypting sent message:", err);
          decryptedOutgoingText = "[Decryption Failed for Sent Message]";
        }
      }

      // Your code to update chat timeline remains unchanged...
      queryClient.setQueryData(
        ["chats", selectedChat._id, "timeline"],
        (oldData) => {
          if (!oldData) return;

          const newMessages = [...oldData.messages];
          const length = newMessages.length;

          const messageToAdd = {
            ...data,
            contentType: data.file ? "file" : "message",
            decryptedText: decryptedOutgoingText,
          };

          if (
            length > 0 &&
            newMessages[length - 1].label.toLowerCase() === "today"
          ) {
            newMessages[length - 1].items.push(messageToAdd);
          } else {
            newMessages.push({
              label: "Today",
              items: [messageToAdd],
            });
          }

          return { ...oldData, messages: newMessages };
        }
      );

      // Update chat list last message
      queryClient.setQueryData(["chats"], (prev) => {
        if (!prev || !Array.isArray(prev.chats)) return prev;

        const chatIndex = prev.chats.findIndex(
          (chat) => chat._id === data.chat
        );
        if (chatIndex === -1) return prev;

        const updatedChat = {
          ...prev.chats[chatIndex],
          lastMessage: { ...data, decryptedText: decryptedOutgoingText },
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

  const handleFileChange = useCallback(
    (e) => {
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
    },
    [files]
  );

  const handleRemoveFile = useCallback(
    (index) => {
      setFiles((prevFiles) => {
        const newFiles = Array.from(prevFiles);
        newFiles.splice(index, 1);
        return newFiles;
      });
    },
    [files]
  );

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

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    handleTypingEvent(value.length > 0);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatTimeline?.messages]);

  useChatSocket({
    socket,
    user,
    selectedChat,
    setSelectedChat,
    chatTimeline,
    queryClient,
    playSound,
    scrollToBottom,
    setTypingMessage,
  });

  useEffect(() => {
    let isMounted = true;

    const setupGroupKey = async () => {
      if (!selectedChat?.isGroup || groupChatKeys[selectedChat._id]) return;
      try {
        const { data } = await axiosIns.get(
          `/keys/aes-key/${selectedChat._id}`
        );

        if (!data?.key) throw new Error("Encrypted key not received");

        const aesCryptoKey = await decryptGroupAESKey(user._id, data.key);

        if (isMounted) {
          setGroupChatKeys((prevKeys) => ({
            ...prevKeys,
            [selectedChat._id]: aesCryptoKey,
          }));

          // ✅ Force re-decryption if needed
          queryClient.invalidateQueries([
            "chats",
            selectedChat._id,
            "timeline",
          ]);
        }
      } catch (error) {
        console.error("Failed to set up group key:", error);
      }
    };

    setupGroupKey();

    return () => {
      isMounted = false;
    };
  }, [queryClient, selectedChat]);

  // E2EE: Decrypt incoming messages
  useEffect(() => {
    async function decryptAndSetTimeline() {
      if (!chatTimeline?.messages || !privateKey || !selectedChat) return;

      if (selectedChat.isGroup && !groupChatKeys[selectedChat._id]) return;
      console.log("Selected Chat", selectedChat);
      let receiver;
      if (selectedChat.members) {
        receiver = selectedChat.members.find((m) => m._id !== user._id);
      } else {
        receiver = selectedUser;
      }

      const updatedChatTimeline = { ...chatTimeline };

      updatedChatTimeline.messages = await Promise.all(
        chatTimeline.messages.map(async (group) => {
          const newItems = await Promise.all(
            group.items.map(async (msg) => {
              if (
                msg.text &&
                msg.iv &&
                msg.sender !== user._id &&
                !msg.decryptedText
              ) {
                try {
                  let aesKey;
                  if (selectedChat.isGroup) {
                    aesKey = groupChatKeys[selectedChat._id];
                  } else {
                    const otherPubKey = await getOtherUserPublicKey(
                      selectedChat._id,
                      receiver?._id
                    );
                    aesKey = await deriveSharedAESKey(privateKey, otherPubKey);
                  }

                  const decryptedText = await decryptMessage(
                    aesKey,
                    msg.text,
                    msg.iv
                  );

                  let decryptedReplyToText = null;
                  if (msg.replyTo?.text && msg.replyTo?.iv) {
                    try {
                      decryptedReplyToText = await decryptMessage(
                        aesKey,
                        msg.replyTo.text,
                        msg.replyTo.iv
                      );
                    } catch (e) {
                      console.warn("Failed to decrypt replyTo", e);
                      decryptedReplyToText = "[Reply Decryption Failed]";
                    }
                  }

                  return {
                    ...msg,
                    decryptedText,
                    replyTo: msg.replyTo
                      ? { ...msg.replyTo, decryptedText: decryptedReplyToText }
                      : undefined,
                  };
                } catch (error) {
                  console.error("error decrypting message", error);
                  return { ...msg, decryptedText: "[Decryption Failed]" };
                }
              }

              return msg;
            })
          );
          return { ...group, items: newItems };
        })
      );

      queryClient.setQueryData(
        ["chats", selectedChat._id, "timeline"],
        updatedChatTimeline
      );
    }

    decryptAndSetTimeline();
  }, [
    chatTimeline,
    privateKey,
    selectedChat,
    groupChatKeys,
    queryClient,
    user._id,
    getOtherUserPublicKey,
    selectedUser,
  ]);

  const isMobile = useIsMobile();

  if ((chatsErr, chatTimelineErr)) {
    return <p>{chatTimeline?.message || chatsErr?.message}</p>;
  }
  if (chatsLoading) {
    return <p className="text-2xl">Loading...</p>;
  }

  return (
    <>
      <div className="flex gap-4 p-4 w-full h-screen overflow-auto">
        <div className="flex gap-4">
          <Sidebar onOpen={onOpen} />
          {isMobile ? (
            <Drawer
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              placement="left"
              size="sm"
            >
              <DrawerContent>
                <div className="p-6">
                  <ChatListPanel
                    chats={chatsData?.chats}
                    isLoading={chatsLoading}
                    setSelectedUser={setSelectedUser}
                    setSelectedChat={setSelectedChat}
                    onClose={onClose}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <ChatListPanel
              chats={chatsData?.chats}
              isLoading={chatsLoading}
              setSelectedUser={setSelectedUser}
              setSelectedChat={setSelectedChat}
            />
          )}
        </div>

        {selectedChat && (
          <CallingModal
            isOpen={isCalling}
            onCancel={cancelCall}
            targetName={selectedChat.chatName}
          />
        )}

        <IncomingCallModal
          isOpen={!!incomingCall}
          callerId={incomingCall?.fromUserId || ""}
          onAccept={acceptCall}
          onReject={rejectCall}
          from={incomingCall?.from}
        />

        <div className="w-screen flex flex-col gap-2">
          <div className="flex justify-between items-center h-[40px]">
            <h1 className="text-2xl fond-semibold">Gapistan</h1>
          </div>
          <div
            className="flex gap-4 flex-1"
            style={{ maxHeight: "calc(100vh - 72px)" }}
          >
            <div className="flex flex-col flex-1 bg-white dark:bg-dark shadow-lg rounded-2xl">
              {selectedChat || selectedUser ? (
                <>
                  <ChatHeader
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                    setSelectedUser={setSelectedUser}
                    handleCall={handleCall}
                    onRightSidebarOpen={onRightSidebarOpen}
                  />
                  <ChatTimeline
                    chatEndRef={chatEndRef}
                    chatTimeline={chatTimeline}
                    chatTimelineLoading={chatTimelineLoading}
                    onReply={setReplyToMessage}
                  />

                  <div className="p-4 border-t relative">
                    {replyToMessage && (
                      <div className="bg-gray-100 dark:bg-dark-2 p-2 rounded-lg mb-2 flex items-center justify-between">
                        <div className="flex-1 text-default-500">
                          <p className="text-sm text-lime-800 dark:text-lime-300">
                            {getSenderName(replyToMessage)}
                          </p>
                          <p className="text-default-500">
                            {replyToMessage.decryptedText}
                          </p>
                        </div>
                        <Button
                          isIconOnly
                          onPress={() => setReplyToMessage(null)}
                          size="sm"
                          startContent={<X />}
                        />
                      </div>
                    )}
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
                  </div>
                </>
              ) : (
                <NoChat />
              )}
            </div>

            {!!selectedChat &&
              (isMobile ? (
                <Drawer
                  isOpen={isRightSidebarOpen}
                  onOpenChange={onRightSidebarOpenChange}
                  placement="right"
                  size="sm"
                >
                  <DrawerContent>
                    <div className="p-6 pt-10">
                      <RightSidebar
                        selectedChat={selectedChat}
                        handleCall={handleCall}
                        // members={members}
                        // files={chatFiles}
                      />
                    </div>
                  </DrawerContent>
                </Drawer>
              ) : (
                <RightSidebar
                  selectedChat={selectedChat}
                  handleCall={handleCall}
                  // members={members}
                  // files={chatFiles}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
