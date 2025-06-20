import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import {
  ArrowLeft,
  EllipsisVertical,
  LogOut,
  Pen,
  SquarePen,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import getFileURL from "../utils/setFileURL";
import { useDisclosure } from "@heroui/use-disclosure";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import CustomModal from "./CustomModal";
import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosIns from "../utils/axios";

function ChatHeader({ selectedChat, setSelectedChat, setSelectedUser }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const queryClient = useQueryClient();
  const fileInputRef = useRef();

  const [profilePreview, setProfilePreview] = useState(() => {
    return getFileURL(selectedChat.profile) || null;
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      chatName: selectedChat?.chatName || "",
      profile: getFileURL(selectedChat?.profile) || null,
    },
  });

  useEffect(() => {
    reset({
      chatName: selectedChat.chatName || "",
      profile: getFileURL(selectedChat?.profile) || null,
    });
  }, [selectedChat, reset]);

  const editMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosIns.put(`/chats/${selectedChat._id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      onEditClose();
      queryClient.setQueryData(["chats"], (oldChats) =>
        oldChats.map((chat) =>
          chat._id === selectedChat._id ? { ...chat, ...data } : chat
        )
      );
    },
    onError: (error) => {
      console.error("Error updating chat:", error);
    },
  });

  const leaveMutation = useMutation({
    mutationFn: async ({ chatId }) => {
      const { data } = await axiosIns.put(`/chats/${chatId}/leave`);
      return data;
    },
    onSuccess: () => {
      onEditClose();
      queryClient.setQueryData(["chats"], (oldChats) => ({
        chats: oldChats.chats?.filter((chat) => chat._id !== selectedChat._id),
      }));
    },
    onError: (error) => {
      console.error("Error leaving chat:", error);
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
      setValue("profile", e.target.files);
    }
  };

  const handleEditSubmit = handleSubmit((formData) => {
    const formPayload = new FormData();
    formPayload.append("chatName", formData.chatName);
    if (formData.profile?.[0]) {
      formPayload.append("profile", formData.profile[0]);
    }

    editMutation.mutate(formPayload);
  });

  return (
    <div className="flex items-center justify-between p-2 border-b border-default-200">
      <div>
        <Button
          startContent={<ArrowLeft />}
          isIconOnly
          variant="fade"
          onPress={() => {
            setSelectedChat(null)
            setSelectedUser(null)
          }}
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

      {selectedChat.isGroup && (
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

          {/* Leave Group Modal */}
          <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            message={`Are you sure to leave "${selectedChat.chatName}"?`}
            confirmMessage="Leave Group"
            onConfirm={() => {
              leaveMutation.mutate({ chatId: selectedChat._id });
              onClose();
            }}
          />

          {/* Edit Group Modal */}
          <CustomModal
            isOpen={isEditOpen}
            onClose={onEditClose}
            confirmMessage={"Save Changes"}
            onConfirm={handleEditSubmit}
          >
            <form
              onSubmit={handleEditSubmit}
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
                {...register("chatName", {
                  required: "Group name is required",
                })}
                label="Group Name"
                className="w-full"
                errorMessage={errors?.chatName?.message}
                isInvalid={!!errors?.chatName}
              />
            </form>
          </CustomModal>
        </>
      )}
    </div>
  );
}

export default ChatHeader;
