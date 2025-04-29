import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import { ArrowLeft } from "lucide-react";
import React from "react";

function ChatHeader({ selectedChat, setSelectedChat }) {
  return (
    <div className="flex items-center p-2 border-b border-default-200">
      <Button
        startContent={<ArrowLeft />}
        isIconOnly
        variant="fade"
        onPress={() => setSelectedChat(null)}
      />
      <User
        name={selectedChat.chatName}
        description={`@${selectedChat.username}`}
        avatarProps={{
          src: selectedChat.profileImage,
          fallback: selectedChat?.chatName[0]?.toUpperCase(),
        }}
        classNames={{
          name: "capitalize"
        }}
      />
    </div>
  );
}

export default ChatHeader;
