import React, { useState } from "react";
import { Avatar } from "@heroui/avatar";
import getFileURL from "../utils/getFileURL";
import {
  File as FileIcon,
  X,
  Download,
  ExternalLink,
  Check,
  CheckCheck,
  ReplyIcon,
} from "lucide-react";
import { Modal, ModalContent, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import getSenderName from "../utils/getSenderName";
import AudioPlayer from "./AudioPlayer";

function MessageBubble({ message, onReply }) {
  const [previewMedia, setPreviewMedia] = useState(null); // { type: 'image' | 'video', url: string }

  const isYou = message.isYou;

  const handleMediaClick = (type, url) => {
    setPreviewMedia({ type, url });
  };

  const closeModal = () => {
    setPreviewMedia(null);
  };

  const renderFile = (file, index) => {
    const fileURL = getFileURL(file.path);

    switch (file.mediaType) {
      case "image":
        return (
          <img
            onClick={() => handleMediaClick("image", fileURL)}
            key={index}
            src={fileURL}
            alt="uploaded"
            className="max-w-[200px] max-h-[200px] rounded-md object-cover mt-2 cursor-pointer"
          />
        );
      case "video":
        return (
          <video
            key={index}
            onClick={() => handleMediaClick("video", fileURL)}
            src={fileURL}
            className="max-w-[250px] rounded-md mt-2 cursor-pointer"
            muted
          />
        );
      case "audio":
        return <AudioPlayer key={index} src={fileURL} controls className="mt-2" />;
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

  const saveMedia = async () => {
    try {
      const response = await fetch(previewMedia.url, { mode: "cors" });
      const blob = await response.blob();
      const blobURL = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobURL;
      link.download = previewMedia.type === "video" ? "video.mp4" : "image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobURL);
    } catch (err) {
      console.error("Download failed", err);
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
          className={`flex gap-2 items-center ${
            isYou
              ? "flex-row-reverse ml-auto message-you"
              : "rounded-tl-none message-them"
          }`}
        >
          <Avatar
            size="sm"
            src={getFileURL(message.sender.profile)}
            className="w-6 h-6"
            fallback={message.sender.firstName?.[0].toUpperCase()}
            showFallback={true}
            color="success"
          />
          <div className="flex items-center text-nowrap">
            <span className="font-semibold text-xs">
              {getSenderName(message)}
            </span>
          </div>
        </div>

        {message.replyTo && (
          <div
            className={`mb-2 rounded-md px-3 py-2 text-xs
            ${
              isYou
                ? "bg-lime-100 dark:bg-lime-800/20"
                : "bg-gray-100 dark:bg-zinc-800"
            } 
            border-l-4 
            ${
              isYou
                ? "border-lime-500 dark:border-lime-400"
                : "border-gray-400 dark:border-zinc-600"
            }`}
          >
            <p
              className={`font-semibold mb-1 ${
                isYou
                  ? "text-lime-800 dark:text-slate-700"
                  : "text-gray-800 dark:text-white"
              }`}
            >
              {getSenderName(message.replyTo)}
            </p>

            {message.replyTo.decryptedText ? (
              <p
                className={`truncate ${
                  isYou
                    ? "text-lime-900 dark:text-slate-700"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                {message.replyTo.decryptedText}
              </p>
            ) : message.replyTo.files?.length > 0 ? (
              <p
                className={`italic ${
                  isYou
                    ? "text-lime-700 dark:text-lime-300"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                📎 File Attachment
              </p>
            ) : (
              <p
                className={`italic ${
                  isYou
                    ? "text-lime-600 dark:text-lime-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Unknown message
              </p>
            )}
          </div>
        )}

        {message.decryptedText && (
          <p className="mt-1">
            {message.decryptedText.startsWith("http") ? (
              <a
                href={message.decryptedText}
                className="text-sky-600 hover:underline"
              >
                {message.decryptedText}
              </a>
            ) : (
              message.decryptedText
            )}
          </p>
        )}

        {Array.isArray(message.files) && message.files.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            {message.files.map((file, index) => renderFile(file, index))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="text-xs flex items-center">
            {message.isYou && (
              <span>
                {message.status === "seen" ? (
                  <CheckCheck size={20} color="#018dff" />
                ) : message.status === "delivered" ? (
                  <CheckCheck size={20} />
                ) : (
                  <Check size={20} />
                )}
              </span>
            )}
            <span className="ml-2 text-gray-500 text-xs">
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <Button
            startContent={<ReplyIcon size={18} />}
            size="sm"
            isIconOnly
            variant="light"
            onPress={onReply}
            className="h-6 w-6 ml-1"
          />
        </div>
      </div>

      <Modal
        isOpen={!!previewMedia}
        onOpenChange={closeModal}
        size="full"
        classNames={{
          closeButton: "text-2xl",
        }}
      >
        <ModalContent>
          <ModalBody>
            <div className="relative min-h-full grid place-content-center bg-opacity-80 p-4">
              {previewMedia?.type === "image" ? (
                <img
                  src={previewMedia.url}
                  alt="Preview"
                  className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
                />
              ) : previewMedia?.type === "video" ? (
                <video
                  src={previewMedia.url}
                  controls
                  autoPlay
                  className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
                />
              ) : null}
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-end gap-2">
            <Button
              variant="ghost"
              className="flex items-center gap-1"
              onPress={saveMedia}
            >
              <Download size={16} /> Save
            </Button>

            <Button
              variant="ghost"
              className="flex items-center gap-1"
              onPress={() => window.open(previewMedia.url, "_blank")}
            >
              <ExternalLink size={16} /> Open in New Tab
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default MessageBubble;
