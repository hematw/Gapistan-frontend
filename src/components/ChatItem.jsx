import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import React from "react";

function ChatItem({
  chatName,
  isYou,
  lastMessage,
  unread,
  profile,
  onClick,
  isOnline
}) {
  console.log("inside chat item", chatName, isYou, lastMessage, unread, profile);
  return (
    <div
      className="w-full bg-white hover:bg-gray-100 dark:hover:bg-dark-2 dark:bg-dark shadow-lg rounded-2xl transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center px-4 py-2">
        <Badge
          color="success"
          content=""
          placement="bottom-right"
          shape="circle"
          isInvisible={!isOnline}
        >
          <Avatar
            src={profile}
            name={chatName}
            size="md"
            fallback={chatName[0].toUpperCase()}
            showFallback={true}
            color="success"
          />
        </Badge>
        <div className="ml-3">
          <p className="line-clamp-1">{chatName}</p>
          <p className="text-gray-500 text-xs line-clamp-1">
            {lastMessage?.isYou ? "You: " : ""}
            {lastMessage?.text}
          </p>
        </div>
        {unread && <Badge color="primary" size="xs" className="ml-auto" />}
      </div>
    </div>
  );
}

export default ChatItem;
