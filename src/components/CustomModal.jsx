import { Button } from '@heroui/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal'

function CustomModal({isOpen, onClose, onConfirm, message, confirmMessage, children}) {
  return (
      <Modal isOpen={isOpen} onClose={onClose} aria-label='Custom Modal'>
        <ModalContent>
          <ModalBody>
            <div className="py-4">
              {message || children}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>Cancel</Button>
            <Button color="danger" onPress={onConfirm}>
              {confirmMessage}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  )
}

export default CustomModal;