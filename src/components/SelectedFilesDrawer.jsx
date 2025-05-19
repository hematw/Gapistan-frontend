import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { XCircle } from "lucide-react";
import React from "react";

function SelectedFilesDrawer({files, onRemove}) {
  return (
    <Card className="flex flex-col gap-2 absolute p-2 left-0 bottom-full max-w-full overflow-auto z-50">
      <p className="text-sm text-gray-500">Files:</p>
      <div className="flex gap-2 overflow-x-auto max-w-full">
        {Array.from(files).map((file, index) => {
          const fileURL = URL.createObjectURL(file);
          const fileType = file.type;

          return (
            <Card
              key={index}
              className="flex flex-col items-center gap-2 p-2 rounded-lg shadow-sm w-24 min-w-24 relative"
            >
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                type="button"
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 z-50"
                onPress={() => onRemove(index)}
                startContent={<XCircle size={20} />}
              />

              {/* 🖼️ Image */}
              <div className="h-20">
                {fileType.startsWith("image/") && (
                  <img
                    src={fileURL}
                    alt="image"
                    className="w-18 max-h-18 aspect-square object-cover rounded-lg"
                  />
                )}

                {/* 🎥 Video */}
                {fileType.startsWith("video/") && (
                  <video
                    src={fileURL}
                    className="w-18 h-18 object-cover rounded-lg"
                    muted
                    playsInline
                  />
                )}

                {/* 🎧 Audio */}
                {fileType.startsWith("audio/") && (
                  <div className="w-20">
                    <audio controls src={fileURL} className="w-full" />
                  </div>
                )}

                {/* 📄 PDF */}
                {fileType === "application/pdf" && (
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-gray-100 text-red-600">
                    <span className="text-lg font-bold">PDF</span>
                  </div>
                )}

                {/* ❓ Fallback */}
                {!["image", "video", "audio"].some((t) =>
                  fileType.startsWith(t)
                ) &&
                  fileType !== "application/pdf" && (
                    <FaCircleUser size={50} color="#C9416F" />
                  )}
              </div>

              {/* 📦 File Info */}
              <div className="flex flex-col items-center">
                <p className="text-sm font-semibold text-center break-words">
                  {file.name.length > 12
                    ? file.name.slice(0, 10) + "..."
                    : file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
}

export default SelectedFilesDrawer;
