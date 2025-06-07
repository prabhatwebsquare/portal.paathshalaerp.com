import { ErrorAlert } from "@/utils/Helper";
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
  Input,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export const RestrictStudentModal = ({
  heading,
  description,
  closeAlert,
  button,
  color,
  confirm,
  loading,
}) => {
  const [date, setDate] = useState("");
  const [remark, setRemark] = useState("");

  // Handle form submission
  const handleSubmit = () => {
    if (date && remark) {
      confirm({ date, remark }); // Pass date and remark when confirming
    } else {
      ErrorAlert("Please fill out both fields.");
    }
  };

  useEffect(() => {
    return () => {
      setDate("");
      setRemark("");
    };
  }, []);

  return (
    <Modal isOpen={true} onClose={closeAlert} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{heading || "Restrict Student"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            {description || "Please specify the restriction details."}
          </Text>

          {/* Date Field */}
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Select Date"
            mt={4}
            required
          />

          {/* Remark Field */}
          <Textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Add Remark"
            mt={4}
            required
          />
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
            onClick={handleSubmit}
          >
            {button || "Restrict"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
