import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import {
  CircleFadingPlus,
  Image,
  Plus,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";
import { Card } from "@heroui/card";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { useRef, useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosIns from "../utils/axios";
import getFileURL from "../utils/setFileURL";
import { addToast } from "@heroui/toast";

function Sidebar() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [profilePreview, setProfilePreview] = useState();
  const fileInputRef = useRef();
  const queryClient = useQueryClient();

  const createGroup = async (formData) => {
    const { data } = await axiosIns.post("/chats/group", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: createGroup,
    onSuccess: (data) => {
      queryClient.setQueryData(["chats"], (prev) => {
        if (!prev || !Array.isArray(prev.chats)) return prev;

        const updatedChats = [...prev.chats];
        updatedChats.unshift(data);
        onClose();
        return { ...prev, chats: updatedChats };
      });
    },
    onError: (error) => {
      console.log(error);
      addToast({
        title: "Error creating group",
        description: error.response?.data?.message,
        color: "danger",
      });
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axiosIns.get("/users");
      return data.users;
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Card className="p-4 rounded-2xl flex flex-col gap-4 shadow-lg dark:bg-dark">
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
        <Dropdown aria-label="dropdown for plus button">
          <DropdownTrigger>
            <Button
              startContent={<Plus />}
              isIconOnly
              radius="full"
              className="bg-limegreen text-black"
            />
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem className="p-2" startContent={<CircleFadingPlus />}>
              Add Story
            </DropdownItem>
            <DropdownItem
              className="p-2"
              startContent={<Users />}
              onPress={onOpen}
            >
              Create Group
            </DropdownItem>
            <DropdownItem className="p-2" startContent={<UserPlus />}>
              New Contact
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent className="rounded-2xl shadow-2xl">
            {(onClose) => (
              <>
                <form className="space-y-6" action={mutate}>
                  <ModalBody className="p-6">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                          <Avatar
                            fallback={<Image size={36} />}
                            src={profilePreview}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          isIconOnly
                          size="sm"
                          radius="full"
                          startContent={<Upload />}
                          onPress={() => fileInputRef.current.click()}
                          className="absolute bottom-0 right-0 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        />
                        <input
                          aria-hidden="true"
                          aria-label="Profile"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          name="profile"
                          ref={fileInputRef}
                        />
                      </div>
                      <Input
                        name="chatName"
                        label="Group Name"
                        className="w-full"
                        variant="faded"
                      />
                      <Select
                        aria-label="members select"
                        size="lg"
                        isMultiline={true}
                        items={users}
                        label="Group members"
                        placeholder="Select a user"
                        selectionMode="multiple"
                        variant="faded"
                        name="members"
                        renderValue={(items) => (
                          <div className="flex flex-row gap-2 max-w-72">
                            {items.map((item) => (
                              <Chip
                                classNames={{
                                  content: "flex gap-2 h-auto py-1 px-2",
                                  base: "h-auto rounded-lg",
                                }}
                              >
                                <Avatar
                                  alt={item.data.firstName}
                                  className="flex-shrink-0 shadow-sm"
                                  size="sm"
                                  src={getFileURL(item.data.profile)}
                                />
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">
                                    {item.data.firstName}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {item.data.email}
                                  </span>
                                </div>
                              </Chip>
                            ))}
                          </div>
                        )}
                      >
                        {(user) => (
                          <SelectItem key={user._id} textValue={user.username}>
                            <div className="flex gap-3 items-center">
                              <Avatar
                                alt={user.firstName}
                                className="flex-shrink-0 shadow-sm"
                                size="sm"
                                src={getFileURL(user.profile)}
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                  {user.firstName}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        )}
                      </Select>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onPress={onClose}>
                      Cancel
                    </Button>
                    <Button color="success" type="submit" isLoading={isLoading}>
                      Create
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </Card>
  );
}

export default Sidebar;
