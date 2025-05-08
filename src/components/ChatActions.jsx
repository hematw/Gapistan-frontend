import React from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tooltip } from "@heroui/tooltip";
import { PhoneCall, Pin, Users, Video } from "lucide-react";
import getFileURL from "../utils/setFileURL";
import { Avatar } from "@heroui/avatar";

function ChatActions({selectedChat}) {
  return (
    <Card className="bg-white dark:bg-dark shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar size="lg" src={getFileURL(selectedChat?.chatProfile)} />
          <div>
            <h3 className="font-medium">{selectedChat?.chatName}</h3>
            <p>
              {selectedChat?.isOnline ? (
                <span className="flex items-center gap-2 text-default-400">
                  <span className="text-xs">🟢</span> Online
                </span>
              ) : (
                // new Date(selectedChat.lastSeen).toLocaleString()
                selectedChat?.lastSeen
              )}
            </p>
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
