import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Crown, EllipsisVertical, UserX } from "lucide-react";
import React from "react";
import axiosIns from "../utils/axios";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";

function MemberOptions({ memberToRemove, chatId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async () => {
      const { data } = await axiosIns.delete(
        `/chats/${chatId}/members/${memberToRemove._id}`
      );
      return data;
    },
    onSuccess: (data) => {
      console.log("User removed successfully", data);
      queryClient.setQueryData(["chats", chatId, "members"], data);
      // queryClient.invalidateQueries(["chats", chatId, "timeline"]);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  return (
    <>
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
          <DropdownItem
            className="p-2"
            startContent={<UserX />}
            onPress={onOpen}
          >
            Remove from chat
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            <p className="py-4">
              {`Remove ${
                memberToRemove.firstName
                  ? memberToRemove.firstName + " " + memberToRemove.lastName
                  : memberToRemove.username
              } from this chat?`}
            </p>
          </ModalHeader>
          <ModalFooter>
            <Button onPress={onClose}>Cancel</Button>
            <Button color="danger" onPress={mutate}>
              Remove
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default MemberOptions;
