import { useEffect } from "react";

const useChatSocket = ({
  socket,
  user,
  selectedChat,
  chatTimeline,
  queryClient,
  playSound,
  scrollToBottom,
  setTypingMessage,
}) => {
  useEffect(() => {
    if (!socket) return;

    socket.emit("user-online", {
      userId: user._id,
      isOnline: true,
    });

    const handleMessageReceived = (data) => {
  const messageId = data?._id;

  socket.emit("message-delivered", { messageId });

  // Update chat timeline
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

  // Update chats list and move this chat to the top
  queryClient.setQueryData(["chats"], (prev) => {
    if (!prev || !Array.isArray(prev.chats)) return prev;

    const chatIndex = prev.chats.findIndex((chat) => chat._id === data.chat);
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

  scrollToBottom?.();
};
console.log

    const handleStatusUpdate = ({ userId, isOnline }) => {
      console.log("🟢 Status update for user:", userId);

      queryClient.setQueryData(["chats"], (prev) => {
        if (!prev?.chats) return prev;

        const updatedChats = prev.chats.map((chat) => {
          const updatedMembers = chat.members.map((member) =>
            member._id === userId
              ? {
                  ...member,
                  isOnline,
                  lastSeen: isOnline ? null : new Date().toISOString(),
                }
              : member
          );

          const isUserInChat = chat.members.some((p) => p._id === userId);
          const newChatStatus =
            !chat.isGroup && isUserInChat ? isOnline : chat.isOnline;

          return {
            ...chat,
            members: updatedMembers,
            isOnline: newChatStatus,
          };
        });

        return { ...prev, chats: updatedChats };
      });
    };

    const handleTyping = ({ chatId, userId, isTyping, content }) => {
      console.log("🖋️ Typing event:", chatId, userId, isTyping, content);
      if (chatId === selectedChat?._id && userId !== user._id) {
        setTypingMessage(isTyping ? content : "Typing...");
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

    const handleNewChat = (chat) => {
      console.log("📦🎁", chat);
      queryClient.setQueryData(["chats"], (prev) => {
        if (!prev || !Array.isArray(prev.chats)) {
          return {
            chats: [chat],
          };
        }

        // Optional: check for duplication before adding
        const alreadyExists = prev.chats.some((c) => c._id === chat._id);
        if (alreadyExists) return prev;

        const updatedChats = [chat, ...prev.chats];

        return {
          ...prev,
          chats: updatedChats,
          total: prev.total + 1,
        };
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
    socket.on("new-chat", handleNewChat);
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
    setTypingMessage,
  ]);
};

export default useChatSocket;
