import React from "react";
import ChatItem  from "./ChatItem";

function ChatListPanel({ chats }) {
  return (
    <div className="space-y-3 px-4 pb-4 w-80 max-h-full overflow-auto">
      {chats.map((chats, index) => (
        <ChatItem 
          key={index}
          name={chats.name}
          isYou={chats.isYou}
          unread={chats.unread}
          lastMessage={chats.lastMessage}
        />
      ))}
    </div>
  );
}

export default ChatListPanel;
