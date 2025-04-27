import React from "react";
import ChatItem from "./ChatItem";
import { MessageCircleMore } from "lucide-react";

function ChatListPanel({ chats }) {
  return (
    <div className="space-y-3 px-4 pb-4 w-80 max-h-full overflow-auto">
      {chats.length ? (
        chats.map((chat, index) => (
          <ChatItem
            key={index}
            name={chat.name}
            isYou={chat.isYou}
            unread={chat.unread}
            lastMessage={chat.lastMessage}
          />
        ))
      ) : (
        <div className="bg-white hover:bg-gray-100 dark:hover:bg-dark-2 dark:bg-dark min-h-full flex flex-col gap-4 items-center justify-center shadow-lg rounded-2xl transition-all duration-200 cursor-pointer">
          <div>
            <MessageCircleMore size={48} />
          </div>
          <p className="flex items-center px-4 py-2 text-center text-sm text-default-400">
            No chats yet... The universe is waiting for you to say something! 🚀
          </p>
        </div>
      )}
    </div>
  );
}

export default ChatListPanel;
