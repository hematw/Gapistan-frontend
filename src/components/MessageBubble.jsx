import React from "react";
import { Avatar } from "@heroui/avatar";
import getFileURL from "../utils/setFileURL";
import { File as FileIcon } from "lucide-react";

function MessageBubble({ message }) {
  const isYou = message.isYou;

  const renderFile = (file, index) => {
    const fileURL = getFileURL(file.path);

    switch (file.mediaType) {
      case "image":
        return (
          <img
            key={index}
            src={fileURL}
            alt="uploaded"
            className="max-w-[200px] max-h-[200px] rounded-md object-cover mt-2"
          />
        );
      case "video":
        return (
          <video
            key={index}
            src={fileURL}
            controls
            className="max-w-[250px] rounded-md mt-2"
          />
        );
      case "audio":
        return <audio key={index} src={fileURL} controls className="mt-2" />;
      case "file":
      default:
        return (
          <a
            key={index}
            href={fileURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline mt-2 block"
          >
            <span className="w-32 h-32 rounded-lg flex items-center justify-center bg-default-400">
              <FileIcon size={54} className="text-default-600" />
            </span>
            {file.path.split("/").pop()}
          </a>
        );
    }
  };

  return (
    <div
      className={`relative flex rounded-lg px-2 py-1 max-w-[70%] w-fit gap-2 ${
        isYou
          ? "bg-limegreen text-black flex-row-reverse ml-auto rounded-tr-none"
          : "bg-gray-300 dark:bg-dark-2 dark:text-gray-100 shadow-sm text-black rounded-tl-none"
      } ${isYou ? "message-you" : "message-them"}`}
    >
      <div>
        <div
          className={`flex gap-2 justify-between items-center ${
            isYou
              ? "flex-row-reverse ml-auto message-you"
              : "rounded-tl-none message-them"
          }`}
        >
          <Avatar
            size="sm"
            src={getFileURL(message.sender.profile)}
            className="w-6 h-6"
          />
          <div className="flex items-center text-nowrap">
            <span className="font-medium text-xs">
              {message.sender.firstName
                ? `${message.sender.firstName} ${message.sender.lastName}`
                : message.sender.username}
            </span>
            <span className="ml-2 text-gray-500 text-xs">
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        {/* 💬 TEXT MESSAGE */}
        {message.text && <p className="mt-1">{message.text}</p>}

        {/* 📎 ATTACHMENTS */}
        {Array.isArray(message.files) && message.files.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            {message.files.map((file, index) => renderFile(file, index))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
