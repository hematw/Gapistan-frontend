import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import { ArrowLeft } from "lucide-react";
import React from "react";

function ChatHeader() {
  return (
    <div className="flex items-center p-2 border-b border-default-200">
      <Button startContent={<ArrowLeft />} isIconOnly variant="fade" />
      <User
        name="Ahmad Joya"
        description="@ahmadjoya"
        avatarProps={{
          src: "/f4e3c5691d056e2a19be7228c2e719a5.png",
          fallback: "AJ",
        }}
      />
    </div>
  );
}

export default ChatHeader;
