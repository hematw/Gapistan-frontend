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
import { useAuth } from "../contexts/AuthContext";
import getFileURL from "../utils/getFileURL";

function ProfileDropdown({ user, onProfileClick }) {
  const { logout } = useAuth();
  return (
    <Dropdown size="xl">
      <DropdownTrigger>
        <Avatar
          name={`${user?.firstName} ${user?.lastName}`}
          description={`@${user?.username}`}
          src={user?.profile ? getFileURL(user.profile) : ""}
          color="success"
          fallback={
            user?.firstName
              ? `${user?.firstName[0]} ${user?.lastName[0]}`
              : `${user?.username[0]}`
          }
          className="ml-2 min-w-10"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Dropdown">
        <DropdownItem key="theme-switch">
          <ThemeSwitch />
        </DropdownItem>
        <DropdownItem
          key="profile"
          startContent={<User size={16} />}
          onPress={onProfileClick}
        >
          Profile
        </DropdownItem>
        <DropdownItem
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
