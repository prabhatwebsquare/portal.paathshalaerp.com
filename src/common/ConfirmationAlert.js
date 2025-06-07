import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";

export const ConfirmAlert = ({
  heading,
  description,
  closeAlert,
  button,
  color,
  confirm,
  loading,
}) => {
  return (
    <Modal isOpen={true} onClose={closeAlert} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{heading || "Delete Confirmation"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{description || "Are you sure? Do you want delete?"}</Text>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            variant={"outline"}
            colorScheme={"blue"}
            mr={3}
            onClick={closeAlert}
          >
            Close
          </Button>
          <Button
            size="sm"
            colorScheme={color || "red"}
            isLoading={loading || false}
            onClick={confirm}
          >
            {button || "Delete"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
