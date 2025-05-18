import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import { ArrowLeft } from "lucide-react";
import React from "react";
import getFileURL from "../utils/setFileURL";

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
          src: selectedChat.profile? getFileURL(selectedChat.profile): "",
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
