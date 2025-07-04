import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Paperclip, Send } from "lucide-react";
import React, { useState } from "react";
import VoiceRecorder from "./VoiceRecorder";

function MessageForm({
  sendMessage,
  handleFileChange,
  fileRef,
  handleInputChange,
}) {
  const [isRecording, setIsRecording] = useState(false);
  return (
    <form action={sendMessage}>
      <div className="flex gap-2">
        {!isRecording && (
          <>
            <Input
              placeholder="Write a message..."
              variant="bordered"
              name="text"
              autoComplete="off"
              classNames={{
                inputWrapper: "pr-0",
              }}
              endContent={
                <Button
                  isIconOnly
                  startContent={<Paperclip />}
                  onPress={() => fileRef.current.click()}
                />
              }
              onChange={handleInputChange}
            />
            <Input
              className="hidden"
              type="file"
              multiple={true}
              ref={fileRef}
              placeholder="Write a message..."
              variant="bordered"
              name="files"
              accept="audio/*,image/*,video/*,application/pdf"
              onChange={handleFileChange}
            />
            <Button
              className="bg-limegreen  text-black"
              startContent={<Send />}
              isIconOnly
              type="submit"
            />
          </>
        )}
        <VoiceRecorder
          setIsRecording={setIsRecording}
          onSend={(audioBlob) => {
            const formData = new FormData();
            formData.append("files", audioBlob);
            sendMessage(formData);
          }}
        />
      </div>
    </form>
  );
}

export default MessageForm;
