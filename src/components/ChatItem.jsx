import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import React from "react";

function ChatItem({ name, isYou, lastMessage, unread }) {
  return (
    <div className="bg-white hover:bg-gray-100 dark:hover:bg-dark-2 dark:bg-dark shadow-lg rounded-2xl transition-all duration-200 cursor-pointer">
      <div className="flex items-center px-4 py-2">
        <Badge
          color="success"
          content=""
          placement="bottom-right"
          shape="circle"
        >
          <Avatar
            src="https://100k-faces.glitch.me/random-image"
            name={name}
            size="md"
          />
        </Badge>
        <div className="ml-3">
          <p className="line-clamp-1">{name}</p>
          <p className="text-gray-500 text-xs line-clamp-1">
            {isYou ? "You: " : ""}
            {lastMessage}
          </p>
        </div>
        {unread && <Badge color="primary" size="xs" className="ml-auto" />}
      </div>
    </div>
  );
}

export default ChatItem;
