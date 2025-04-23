import React from "react";
import { Avatar } from "@heroui/avatar";

function MessageBubble({ chat }) {
  return (
    <div
      className={`flex rounded-lg px-2 py-1 max-w-[70%] w-fit gap-2 ${
        chat.isYou
          ? "bg-limegreen text-black flex-row-reverse ml-auto  rounded-tr-none"
          : "bg-gray-300 dark:bg-dark-2 dark:text-gray-100 shadow-sm text-black rounded-tl-none"
      }`}
    >
      <Avatar
        name="Conner Garcia"
        size="sm"
        src="https://100k-faces.glitch.me/random-image"
        className="min-w-8"
      />
      <div className="">
        <div className="flex items-center text-nowrap">
          <span className="font-medium text-xs">{chat.sender}</span>
          <span className="ml-2 text-gray-500 text-xs">{chat.time}</span>
        </div>
        <p className="mt-1">{chat.text}</p>
      </div>
    </div>
  );
}

export default MessageBubble;
