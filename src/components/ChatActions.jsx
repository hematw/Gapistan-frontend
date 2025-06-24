import React, { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tooltip } from "@heroui/tooltip";
import { PhoneCall, Pin, Users, Video } from "lucide-react";
import getFileURL from "../utils/setFileURL";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import getTimeAgo from "../utils/getTimeAgo";
import { useSocket } from "../contexts/SocketContext";
import { useAuth } from "../contexts/AuthContext";
import { addToast } from "@heroui/toast";
import CallingModal from "./calls/CallingModal";

function ChatActions({ selectedChat }) {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [callTimeoutId, setCallTimeoutId] = useState(null);
  const [isCalling, setIsCalling] = useState(false);

  const myUser = selectedChat.members?.find((m) => m._id === user._id);
  const targetUser = selectedChat.members?.find((m) => m._id !== user._id);

  const handleCall = () => {
    const roomName = `${myUser._id}-${targetUser._id}-room`;

    socket.emit("start-call", {
      toUserId: targetUser._id,
      fromUserId: myUser._id,
      roomName,
    });
    console.log("Call initiated to:", targetUser._id, "from:", myUser._id);
    setIsCalling(true);
    // 🧨 Start 20s timeout
    const timeoutId = setTimeout(() => {
      setIsCalling(false);
      addToast({
        title: "Call Timeout",
        description: "The call was not answered in time.",
        color: "warning",
      });
      socket.emit("call-timeout", {
        toUserId: targetUser._id,
        roomName,
      });
    }, 200000);

    setCallTimeoutId(timeoutId);
  };

  const cancelCall = () => {
    clearTimeout(callTimeoutId);
    setIsCalling(false);
    socket.emit("call-timeout", {
      toUserId: targetUser._id,
      roomName: `${myUser._id}-${targetUser._id}-room`,
    });
  };

  // Clean up on accept/reject
  useEffect(() => {
    socket.on("call-accepted", () => {
      clearTimeout(callTimeoutId);
    });

    return () => {
      socket.off("call-accepted");
      if (callTimeoutId) {
        clearTimeout(callTimeoutId);
      }
    };
  }, [callTimeoutId, socket]);

  return (
    <Card className="bg-white dark:bg-dark shadow-lg">
      <CardHeader>
        <div className="w-full">
          <CallingModal
            isOpen={isCalling}
            targetName={"X man"}
            onCancel={cancelCall}
          />
          <div className="flex items-center gap-4 mb-4">
            <Avatar
              size="lg"
              src={getFileURL(selectedChat?.profile)}
              fallback={selectedChat.chatName[0].toUpperCase()}
            />
            <div>
              <h3 className="font-medium">{selectedChat?.chatName}</h3>
              <p className="flex items-center gap-2 text-default-400 mt-2">
                {selectedChat?.isOnline ? (
                  <span>
                    <span className="text-xs">🟢</span> Online
                  </span>
                ) : (
                  <span className="text-xs">
                    <span className="font-semibold text-default-500">
                      Last seen:{" "}
                    </span>
                    {selectedChat?.lastSeen &&
                      " " + getTimeAgo(selectedChat.lastSeen)}
                  </span>
                )}
              </p>
            </div>
          </div>
          <Divider />
          <div className="px-2 py-4 text-center">
            <p className="text-default-400 text-sm">{selectedChat?.bio}</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="flex flex-row justify-between">
        <Tooltip content="Call" placement="top">
          <Button
            isIconOnly
            radius="full"
            startContent={<PhoneCall />}
            className="bg-limegreen text-black"
            onPress={handleCall}
          />
        </Tooltip>
        <Tooltip content="Video Call" placement="top">
          <Button isIconOnly radius="full" startContent={<Video />} />
        </Tooltip>
        <Tooltip content="Pin" placement="top">
          <Button isIconOnly radius="full" startContent={<Pin />} />
        </Tooltip>
        <Tooltip content="Add to group" placement="top">
          <Button isIconOnly radius="full" startContent={<Users />} />
        </Tooltip>
      </CardBody>
    </Card>
  );
}

export default ChatActions;
