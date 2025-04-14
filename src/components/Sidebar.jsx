import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Plus } from "lucide-react";
import React from "react";

function Sidebar() {
  return (
    <div className="bg-dark p-4 rounded-2xl flex flex-col gap-4">
      <div className="rounded-full bg-limegreen w-10 h-10">
        <img src="/logo.png" alt="" className="w-10 h-10" />
      </div>
      <div className="flex flex-col gap-2">
        <Avatar size="md" name="Conner Garcia" fallback="GG" color="danger" />
        <Avatar
          size="md"
          name="Conner Garcia"
          fallback="AH"
          color="primary"
          className="whitespace-nowrap"
        />
        <Avatar
          size="md"
          name="Conner Garcia"
          fallback="Z"
          color="success"
          className="whitespace-nowrap"
        />
        <Avatar
          size="md"
          name="Conner Garcia"
          fallback="HW"
          color="light"
          className="whitespace-nowrap"
        />
        <Avatar
          size="md"
          name="Conner Garcia"
          fallback="BH"
          color="warning"
          className="whitespace-nowrap"
        />
        <Avatar
          size="md"
          name="Conner Garcia"
          fallback="T"
          color="secondary"
          className="whitespace-nowrap"
        />
        <Avatar
          size="md"
          name="Conner Garcia"
          fallback="K👑"
          color="default"
          className="whitespace-nowrap"
        />
      </div>
      <div className="mt-auto">
        <Button
          startContent={<Plus />}
          isIconOnly
          radius="full"
          className="bg-limegreen"
        />
      </div>
    </div>
  );
}

export default Sidebar;
