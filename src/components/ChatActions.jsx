import React from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tooltip } from "@heroui/tooltip";
import { PhoneCall, Pin, Users, Video } from "lucide-react";
import getFileURL from "../utils/setFileURL";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import getTimeAgo from "../utils/getTimeAgo";

function ChatActions({ selectedChat }) {
  return (
    <Card className="bg-white dark:bg-dark shadow-lg">
      <CardHeader>
        <div>
          <div className="flex items-center gap-4 mb-4">
            <Avatar size="lg" src={getFileURL(selectedChat?.chatProfile)} />
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
