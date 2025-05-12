import { Image } from "@heroui/image";
import React from "react";

function NoChat() {
  return (
    <div className="flex flex-1 items-center justify-center text-center text-gray-500 dark:text-gray-400 p-6">
      <div className="flex items-center justify-center flex-col">
        <Image src="/empty.png" width={100} />
        <p className="text-lg font-semibold mb-1 mt-6">No chat selected</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Select a conversation to start chatting with someone.
        </p>
      </div>
    </div>
  );
}

export default NoChat;
