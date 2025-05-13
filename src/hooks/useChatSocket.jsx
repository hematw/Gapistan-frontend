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
      const messageId = data?._id;
      // const isSameChat = selectedChat?._id === data.chat;

      socket.emit("message-delivered", { messageId });

      // if (isSameChat) {
      queryClient.setQueryData(["chats", data.chat, "timeline"], (oldData) => {
        if (!oldData || !Array.isArray(oldData.messages)) return oldData;

        const messages = [...oldData.messages];
        const lastGroup = messages[messages.length - 1];
        const isTodayGroup =
          lastGroup?.label?.toLowerCase() === "today" &&
          Array.isArray(lastGroup.items);

        if (isTodayGroup) {
          const updatedGroup = {
            ...lastGroup,
            items: [...lastGroup.items, { ...data, contentType: "message" }],
          };
          messages[messages.length - 1] = updatedGroup;
        } else {
          messages.push({
            label: "Today",
            items: [{ ...data, contentType: "message" }],
          });
        }

        return { ...oldData, messages };
      });
      // }
      //  else {
      //   queryClient.invalidateQueries(["chats", data.chat, "timeline"]);
      // }

      queryClient.setQueryData(["chats"], (prev) => {
        if (!prev || !Array.isArray(prev.chats)) return prev;

        const updatedChats = prev.chats.map((chat) =>
          chat._id === data.chat ? { ...chat, lastMessage: data } : chat
        );

        return { ...prev, chats: updatedChats };
      });

      scrollToBottom?.();
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

    const handleMessageDelivery = ({ chatId, messageIds }) => {
      console.log("💠 Delivered messages:", messageIds, chatId);

      queryClient.setQueryData(["chats", chatId, "timeline"], (oldData) => {
        if (!oldData || !Array.isArray(oldData.messages)) return oldData;

        const updatedMessages = oldData.messages.map((group) => {
          if (!Array.isArray(group.items)) return group;

          const updatedItems = group.items.map((msg) => {
            if (messageIds.includes(msg._id)) {
              return { ...msg, status: "delivered" };
            }
            return msg;
          });

          return { ...group, items: updatedItems };
        });

        return { ...oldData, messages: updatedMessages };
      });
    };

    socket.on("message-seen", ({ chatId, messageIds }) => {
      queryClient.setQueryData(["chats", chatId, "timeline"], (oldData) => {
        if (!oldData || !Array.isArray(oldData.messages)) return oldData;

        const updatedMessages = oldData.messages.map((group) => {
          if (!Array.isArray(group.items)) return group;

          const updatedItems = group.items.map((msg) => {
            if (messageIds.includes(msg._id)) {
              return { ...msg, status: "seen" };
            }
            return msg;
          });

          return { ...group, items: updatedItems };
        });

        return { ...oldData, messages: updatedMessages };
      });
    });

    socket.on("messages-delivered", handleMessageDelivery);
    socket.on("message-received", handleMessageReceived);
    socket.on("update-status", handleStatusUpdate);
    socket.on("typing", handleTyping);
    socket.onAny(handleAnyEvent);

    return () => {
      socket.off("message-received", handleMessageReceived);
      socket.off("update-status", handleStatusUpdate);
      socket.off("typing", handleTyping);
      socket.offAny(handleAnyEvent);
    };
  }, [
    playSound,
    queryClient,
    selectedChat,
    chatTimeline,
    socket,
    user._id,
    scrollToBottom,
    setTypingUser,
  ]);
};

export default useChatSocket;
