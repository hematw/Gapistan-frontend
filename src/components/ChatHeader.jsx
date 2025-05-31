import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import {
  ArrowLeft,
  EllipsisVertical,
  LogOut,
  Pen,
  SquarePen,
} from "lucide-react";
import React, { useRef, useState } from "react";
import getFileURL from "../utils/setFileURL";
import { useDisclosure } from "@heroui/use-disclosure";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import CustomModal from "./CustomModal";
import { Input, Textarea } from "@heroui/input";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosIns from "../utils/axios";

function ChatHeader({ selectedChat, setSelectedChat }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const queryClient = useQueryClient();

  const [profilePreview, setProfilePreview] = useState(() => {
    return getFileURL(selectedChat.profile) || null;
  });

  const fileInputRef = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      name: selectedChat.chatName || "",
      bio: selectedChat.bio || "",
      profile: getFileURL(selectedChat.profile) || null,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosIns.put(`/chats/${selectedChat._id}`, data);
      return response.json();
    },
    onSuccess: (data) => {
      onEditClose();
      queryClient.setQueryData(["chats"], (oldChats) => {
        return oldChats.map((chat) =>
          chat._id === selectedChat._id ? { ...chat, ...data } : chat
        );
      });
    },
    onError: (error) => {
      console.error("Error updating chat:", error);
    },
  })

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
      setValue("profile", e.target.files);
    }
  };

  console.log("Selected Chat:", selectedChat);

  return (
    <div className="flex items-center justify-between p-2 border-b border-default-200">
      <div>
        <Button
          startContent={<ArrowLeft />}
          isIconOnly
          variant="fade"
          onPress={() => setSelectedChat(null)}
        />
        <User
          name={selectedChat.chatName}
          description={`@${selectedChat.username}`}
          avatarProps={{
            src: selectedChat.profile ? getFileURL(selectedChat.profile) : "",
            fallback: selectedChat?.chatName[0],
          }}
          classNames={{
            name: "capitalize",
          }}
        />
      </div>
      {selectedChat.isGroup &&
        <>
          <Dropdown aria-label="Dropdown for chat options">
            <DropdownTrigger>
              <Button
                startContent={<EllipsisVertical />}
                variant="fade"
                isIconOnly
                radius="full"
              />
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                className="p-2"
                startContent={<SquarePen />}
                onPress={onEditOpen}
              >
                Edit Group
              </DropdownItem>
              <DropdownItem
                className="p-2"
                startContent={<LogOut />}
                onPress={onOpen}
              >
                Leave Group
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            message={`Are you sure to leave "${selectedChat.chatName}"?`}
            confirmMessage="Leave Group"
            onConfirm={() => {
              console.log("Leaving group:", selectedChat._id);
              onClose();
            }}
          />
          <CustomModal
            isOpen={isEditOpen}
            onClose={onEditClose}
            confirmMessage={"Save Changes"}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              encType="multipart/form-data"
            >
              <div className="relative max-w-fit">
                <div className="w-24 h-24 rounded-full overflow-hidden border">
                  <img
                    src={profilePreview || "/default-avatar.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  isIconOnly
                  size="sm"
                  radius="full"
                  startContent={<Pen />}
                  onPress={() => fileInputRef.current.click()}
                  className="absolute top-0 left-0 w-24 h-24 opacity-50"
                />
                <input
                  type="file"
                  accept="image/*"
                  {...register("profile")}
                  onChange={handleImageChange}
                  className="hidden"
                  ref={fileInputRef}
                />
              </div>
              <Input
                {...register("name")}
                label="Group Name"
                className="w-full"
                errorMessage={errors?.email?.message}
                isInvalid={!!errors?.email}
              />

              <Textarea
                {...register("bio")}
                label="Group Bio"
                className="w-full"
                rows={3}
                errorMessage={errors?.bio?.message}
                isInvalid={!!errors?.bio}
              />
            </form>
          </CustomModal>
        </>
      }
    </div>
  );
}

export default ChatHeader;
