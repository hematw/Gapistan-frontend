import { useEffect } from "react";

const useSeenHandler = ({ messagesEndRef, socket, userId, selectedChat }) => {
  useEffect(() => {
    if (!selectedChat || !socket || !messagesEndRef?.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          socket.emit("mark-as-seen", {
            chatId: selectedChat._id,
            userId,
          });
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(messagesEndRef.current);

    return () => {
      if (messagesEndRef.current) observer.unobserve(messagesEndRef.current);
    };
  }, [selectedChat, socket, userId, messagesEndRef]);
};

export default useSeenHandler;
