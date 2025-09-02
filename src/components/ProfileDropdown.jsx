import React from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { LogOut, Settings } from "lucide-react";
import ThemeSwitch from "./ThemeSwitch";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@heroui/button";

function ProfileDropdown() {
  const { logout } = useAuth();
  return (
    <Dropdown size="xl">
      <DropdownTrigger>
        <Button startContent={<Settings />} isIconOnly radius="full" />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Dropdown">
        <DropdownItem key="theme-switch" textValue={"theme-switch"}>
          <ThemeSwitch />
        </DropdownItem>
        {/* <DropdownItem
          key="profile"
          startContent={<User size={16} />}
          onPress={onProfileClick}
        >
          Profile
        </DropdownItem> */}
        <DropdownItem
          textValue={"logout"}
          key="logout"
          startContent={<LogOut size={16} />}
          color="danger"
          className="text-danger"
          onPress={logout}
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default ProfileDropdown;
