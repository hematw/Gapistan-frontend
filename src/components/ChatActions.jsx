import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tooltip } from "@heroui/tooltip";
import { PhoneCall, Pin, Users, Video } from "lucide-react";
import getFileURL from "../utils/getFileURL";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import getTimeAgo from "../utils/getTimeAgo";
import { Badge } from "@heroui/badge";

function ChatActions({ selectedChat, handleCall }) {
  return (
    <Card className="bg-white dark:bg-dark shadow-lg">
      <CardHeader>
        <div className="w-full">
          <div className="flex items-center gap-4 mb-4">
            <Badge
              color="success"
              content=""
              placement="bottom-right"
              shape="circle"
              isInvisible={!selectedChat?.isOnline}
            >
              <Avatar
                size="lg"
                src={getFileURL(selectedChat?.profile)}
                fallback={selectedChat.chatName[0].toUpperCase()}
                showFallback={true}
                color="success"
              />
            </Badge>
            <div>
              <h3 className="font-medium">{selectedChat?.chatName}</h3>
              <p className="flex items-center gap-2 text-default-400 mt-2">
                {selectedChat?.isOnline ? (
                  <span>Online</span>
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
      {/* <CardBody className="flex flex-row justify-between">
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
      </CardBody> */}
    </Card>
  );
}

export default ChatActions;
