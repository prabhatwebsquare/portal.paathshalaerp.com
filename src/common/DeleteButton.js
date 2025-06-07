import { STATUS } from "@/constant";
import { DeleteIcon } from "@chakra-ui/icons";
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
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const DeleteButton = ({
  icon,
  heading,
  description,
  confirm,
  label,
  status,
  reset,
  size,
  button,
  variant,
  isButton,
}) => {
  const [toggleConfirm, setToggleConfirm] = useState(null);

  useEffect(() => {
    if (status === STATUS.SUCCESS || status === STATUS.FAILED) {
      reset();
      setToggleConfirm(null);
    }
  }, [reset, status]);

  return (
    <>
      {isButton ? (
        <Button
          size={size || "sm"}
          colorScheme="red"
          variant={variant || "solid"}
          leftIcon={icon || <DeleteIcon />}
          onClick={() => setToggleConfirm([])}
        >
          {button || "Delete"}
        </Button>
      ) : (
        <Tooltip placement="top" label={label || "Delete"}>
          <IconButton
            size={size || "xs"}
            variant="solid"
            bg="red.500"
            color="white"
            icon={icon || <DeleteIcon />}
            _hover={{ bg: "red.600" }}
            _active={{ bg: "red.700" }}
            onClick={() => setToggleConfirm([])}
          />
        </Tooltip>
      )}

      {toggleConfirm && (
        <ConfirmAlert
          heading={heading}
          description={description}
          confirm={confirm}
          closeAlert={() => setToggleConfirm(null)}
          status={status}
          button={button}
        />
      )}
    </>
  );
};

const ConfirmAlert = ({
  heading,
  description,
  closeAlert,
  confirm,
  status,
  button,
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
            colorScheme={"red"}
            isLoading={status === STATUS.FETCHING}
            onClick={confirm}
          >
            {button || "Delete"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
