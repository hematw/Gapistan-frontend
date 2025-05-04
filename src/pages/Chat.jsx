import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useSocket } from "../contexts/SocketContext";
import { Chip } from "@heroui/chip";
import { Bell, Send, Settings } from "lucide-react";
import ChatListPanel from "../components/ChatListPanel";
import RightSidebar from "../components/RightSidebar";
import MessageBubble from "../components/MessageBubble";
import ChatEvent from "../components/ChatEvent";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosIns from "../utils/axios";
import { useAuth } from "../contexts/AuthContext";
import { addToast } from "@heroui/toast";
import ChatHeader from "../components/ChatHeader";
import ProfileDropdown from "../components/ProfileDropdown";
import { Image } from "@heroui/image";
import { Spinner } from "@heroui/spinner";
import { useDisclosure } from "@heroui/use-disclosure";
import {
  Modal,
  ModalBody,
  ModalContent,
} from "@heroui/modal";
import Profile from "../components/Profile";

const members = [
  { id: 1, name: "Richard Wilson", status: "online" },
  { id: 2, name: "Aamn", status: "offline" },
  { id: 3, name: "You", status: "online" },
  { id: 4, name: "Jaden Parker", status: "online" },
  { id: 5, name: "Conner Garcia", status: "away" },
  { id: 6, name: "Lawrence Patterson", status: "offline" },
];

const files = [
  { type: "photos", count: 115 },
  { type: "files", count: 200 },
  { type: "shared links", count: 47 },
];

function Chat() {
  const { socket } = useSocket();
  const [selectedChat, setSelectedChat] = useState(null);
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (formdata) => {
    console.log(socket);
    if (!socket) {
      console.log("Socket not initialized");
      return;
    }

    const text = formdata.get("text");
    if (!text.trim()) {
      console.log("Message is empty");
      return addToast({
        title: "Message is empty",
        description: "Cannot send empty messages",
        color: "danger",
      });
    }

    console.log("Sending message", text);
    socket.emit(
      "send_message",
      {
        text,
        senderId: user._id,
        chatId: selectedChat?._id,
        receiverId: selectedUser?._id,
      },
      ({ message, error, data }) => {
        console.log(message, error, data);
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
                const updatedItems = [
                  ...newMessages[length - 1].items,
                  { ...data, contentType: "message" },
                ];
                newMessages[length - 1] = {
                  ...newMessages[length - 1],
                  items: updatedItems,
                };
              } else {
                newMessages.push({
                  label: "Today",
                  items: [{ ...data, contentType: "message" }],
                });
              }

              return {
                ...oldData,
                messages: newMessages,
              };
            }
          );

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
        }
      }
    );
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

    return () => {
      socket.off("receive_message");
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
                  <Profile/>
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
                  <div className="flex-1 px-4 pb-6 overflow-y-auto">
                    {chatTimelineLoading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Spinner size="lg" color="success" className="block" />
                      </div>
                    ) : (
                      chatTimeline.messages.map((activity, index) => (
                        <div key={index} className="space-y-1.5">
                          <div className="w-full text-center my-4">
                            <Chip className="m-auto">{activity.label}</Chip>
                          </div>
                          {activity.items.map((item, index) => {
                            if (item.contentType !== "message") {
                              return <ChatEvent event={item} key={index} />;
                            } else {
                              return <MessageBubble chat={item} key={index} />;
                            }
                          })}
                        </div>
                      ))
                    )}
                    <div ref={chatEndRef}></div>
                  </div>

                  <div className="p-4 border-t">
                    <form action={sendMessage}>
                      <div className="flex">
                        <Input
                          placeholder="Write a message..."
                          variant="bordered"
                          name="text"
                          autoComplete="off"
                        />
                        <Button
                          className="bg-limegreen ml-2 text-black"
                          startContent={<Send />}
                          isIconOnly
                          type="submit"
                        />
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center text-center text-gray-500 dark:text-gray-400 p-6">
                  <div className="flex items-center justify-center flex-col">
                    <Image src="/empty.png" width={100} />
                    <p className="text-lg font-semibold mb-1 mt-6">
                      No chat selected
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Select a conversation to start chatting with someone.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <RightSidebar members={members} files={files} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
