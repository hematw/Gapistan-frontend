import React, { useState } from "react";
import { Avatar } from "@heroui/avatar";
import getFileURL from "../utils/setFileURL";
import {
  File as FileIcon,
  X,
  Download,
  ExternalLink,
  Check,
  CheckCheck,
} from "lucide-react";
import { Modal, ModalContent, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";

function MessageBubble({ message }) {
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
          </div>
        </div>

        {message.text && <p className="mt-1">{message.text}</p>}

        {Array.isArray(message.files) && message.files.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            {message.files.map((file, index) => renderFile(file, index))}
          </div>
        )}
        {message.isYou && (
          <p className="text-xs flex items-center">
            <span>
              {message.status === "seen" ? (
                <CheckCheck size={20} color="#018dff" />
              ) : message.status === "delivered" ? (
                <CheckCheck size={20} />
              ) : (
                <Check size={20} />
              )}
            </span>
            <span className="ml-2 text-gray-500 text-xs">
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </p>
        )}
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
