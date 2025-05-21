import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Crown, EllipsisVertical, UserX } from "lucide-react";
import React from "react";

function MemberOptions({ userId }) {
  return (
    <Dropdown aria-label="dropdown for plus button">
      <DropdownTrigger>
        <Button
          startContent={<EllipsisVertical />}
          variant="fade"
          isIconOnly
          radius="full"
        />
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem className="p-2" startContent={<Crown />}>
          Make Admin
        </DropdownItem>
        <DropdownItem className="p-2" startContent={<UserX />}>
          Remove from chat
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default MemberOptions;
