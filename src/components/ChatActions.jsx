import React from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Tooltip } from "@heroui/tooltip";
import { PhoneCall, Pin, Users, Video } from "lucide-react";

function ChatActions() {
  return (
    <Card className="bg-white dark:bg-dark shadow-lg">
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
