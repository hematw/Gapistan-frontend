import React from "react";
import { Modal, ModalBody, ModalContent } from "@heroui/modal";
import Profile from "./Profile";

function ProfileModal({ isOpen, onOpenChange }) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalBody>
          <Profile />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ProfileModal;
