import React from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { LogOut, User } from "lucide-react";
import ThemeSwitch from "./ThemeSwitch";

function ProfileDropdown({ user }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Avatar
          name={`${user?.firstName} ${user?.lastName}`}
          description={`@${user?.username}`}
          src={user?.profile}
          color="success"
          fallback={
            user?.firstName
              ? `${user?.firstName[0]} ${user?.lastName[0]}`
              : `${user?.username[0]}`
          }
          className="ml-2 min-w-10"
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="User Dropdown"
        onAction={(key) => {
          if (key === "profile") {
            console.log("Profile clicked");
          } else if (key === "logout") {
            console.log("Logout clicked");
          }
        }}
      >
        <DropdownItem key="theme-switch">
          <ThemeSwitch />
        </DropdownItem>
        <DropdownItem key="profile" startContent={<User size={16} />}>
          Profile
        </DropdownItem>
        <DropdownItem
          key="logout"
          startContent={<LogOut size={16} />}
          color="danger"
          className="text-danger"
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default ProfileDropdown;
