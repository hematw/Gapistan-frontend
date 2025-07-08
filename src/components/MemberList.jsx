import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { User } from "@heroui/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosIns from "../utils/axios";
import getFileURL from "../utils/getFileURL";
import { useAuth } from "../contexts/AuthContext";
import { CircleCheck, Search, UserPlus } from "lucide-react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { Avatar } from "@heroui/avatar";
import { Input } from "@heroui/input";
import MemberOptions from "./MemberOptions";

function MemberList({ selectedChat }) {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["chats", selectedChat?._id, "members"],
    queryFn: async () => {
      const { data } = await axiosIns.get(
        `/chats/${selectedChat?._id}/members`
      );
      return data;
    },
    enabled: !!selectedChat?._id,
  });

  const addToGroup = async () => {
    const { data } = await axiosIns.post(`/chats/${selectedChat._id}/members`, {
      newMembers: selectedUserIds,
    });
    return data;
  };

  const { mutate, isLoading: mutationLoading } = useMutation({
    mutationFn: addToGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(["chats", selectedChat?._id, "members"]);
      queryClient.invalidateQueries(["chats", selectedChat?._id, "timeline"]);
      onClose();
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

  const users = queryClient.getQueryData(["users"]);

  const [selectedUserIds, setSelectedUserIds] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");

  const toggleUserSelect = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers =
    users?.filter((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }) || [];

  if (error) {
    console.log(error);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <form action={mutate}>
              <ModalHeader>Add members</ModalHeader>
              <ModalBody>
                <div className="space-y-3">
                  <Input
                    label="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startContent={<Search />}
                  />

                  <div className="max-h-96 overflow-y-auto space-y-1">
                    {filteredUsers.map((user) => {
                      const isSelected = selectedUserIds.includes(user._id);
                      const isAlreadyMember = data?.members.some(
                        (m) => m._id === user._id
                      );

                      return (
                        <div
                          key={user._id}
                          onClick={() => {
                            if (!isAlreadyMember) toggleUserSelect(user._id);
                          }}
                          className={`flex gap-3 items-center p-2 rounded-md cursor-pointer transition-all ${
                            isAlreadyMember
                              ? " bg-white text-black dark:bg-dark dark:text-white cursor-not-allowed opacity-50"
                              : isSelected
                              ? "bg-limegreen text-black"
                              : " hover:bg-dark-3"
                          }`}
                        >
                          <Avatar
                            alt={user.firstName}
                            className="flex-shrink-0 shadow-sm"
                            size="sm"
                            src={getFileURL(user.profile)}
                            fallback={user?.firstName?.[0].toUpperCase()}
                            showFallback={true}
                            color="success"
                          />
                          <div className="flex justify-between items-center w-full">
                            <div>
                              <p className="text-sm font-medium capitalize">
                                {user.firstName
                                  ? `${user.firstName} ${user.lastName}`
                                  : user.username}
                              </p>
                              <p className="text-xs text-default-500">
                                {user.username}
                              </p>
                            </div>

                            {isAlreadyMember ? (
                              <span className="text-xs">Already member</span>
                            ) : (
                              isSelected && <CircleCheck />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="success"
                  type="submit"
                  isLoading={mutationLoading}
                >
                  Add
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
      <Card className="bg-white text-black dark:bg-dark dark:text-white shadow-lg">
        <CardHeader>
          <div className="w-full flex items-center gap-2">
            <p>{data?.members.length} Members</p>
            <Tooltip content="Add Member">
              <Button
                onPress={onOpen}
                className="ml-auto"
                startContent={<UserPlus />}
                isIconOnly
                variant="fade"
              />
            </Tooltip>
          </div>
        </CardHeader>

        <CardBody>
          {data?.members.map((member, index) => (
            <div className="flex justify-between items-center" key={member._id}>
              <User
                key={index}
                className="justify-stretch py-1 flex-1"
                avatarProps={{
                  src: getFileURL(member.profile),
                }}
                name={
                  user._id === member._id
                    ? "You"
                    : member.firstName
                    ? member.firstName + " " + member.lastName
                    : member.username
                }
                description={data.groupAdmins.includes(member._id) && "Admin"}
                classNames={{
                  base: "hover:bg-gray-100 dark:hover:bg-dark-2 transition-all duration-200 flex",
                }}
              />
              {user._id !== member._id &&
                data.groupAdmins.includes(user._id) && (
                  <MemberOptions
                    member={member}
                    isAdmin={data.groupAdmins.includes(member._id)}
                    chatId={selectedChat._id}
                  />
                )}
            </div>
          ))}
        </CardBody>
      </Card>
    </>
  );
}

export default MemberList;
