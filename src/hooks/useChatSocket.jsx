import { useEffect } from "react";

const useChatSocket = ({
  socket,
  user,
  selectedChat,
  chatTimeline,
  queryClient,
  playSound,
  scrollToBottom,
  setTypingUser,
}) => {
  useEffect(() => {
    if (!socket) return;

    socket.emit("user-online", {
      userId: user._id,
      isOnline: true,
    });

    const handleMessageReceived = (data) => {
      console.log("📩 New message:", data);
      console.log(selectedChat, data);

      const messageId = data?._id;

      socket.emit("message-delivered", { messageId });
      console.log("deliver event fired");
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
    };

    const handleStatusUpdate = ({ userId, isOnline }) => {
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
    };

    const handleTyping = ({ chatId, userId, isTyping }) => {
      if (chatId === selectedChat?._id && userId !== user._id) {
        setTypingUser(isTyping ? userId : null);
      }
    };

    const handleAnyEvent = (eventName, args) => {
      console.log(eventName, args);
      if (["message-received"].includes(eventName)) {
        playSound();
      }
    };

    socket.on("message-received", handleMessageReceived);
    socket.on("update-status", handleStatusUpdate);
    socket.on("typing", handleTyping);
    socket.onAny(handleAnyEvent);

    if (selectedChat) {
      socket.emit("mark-as-seen", { chatId: selectedChat._id });
    }

    return () => {
      socket.off("message-received", handleMessageReceived);
      socket.off("update-status", handleStatusUpdate);
      socket.off("typing", handleTyping);
      socket.offAny(handleAnyEvent);
    };
  }, [playSound, queryClient, selectedChat, chatTimeline, socket, user._id, scrollToBottom, setTypingUser]);
};

export default useChatSocket;
