import {
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

export const MarkAllModal = ({ confirmMark, closeModal, data, themeColor }) => {
  const [inputValue, setInputValue] = useState({});

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };
  return (
    <Modal size={"md"} isOpen={data} placement="right" onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Mark All Attendance</ModalHeader>

        <ModalBody>
          <VStack spacing={3}>
            <RadioGroup
              mb={3}
              w={"100%"}
              onChange={(e) => inputHandler("type", e)}
              value={inputValue?.type}
            >
              <Box ml={5} fontSize={20} fontWeight={"semibold"}>
                <Radio w={"100%"} mt={3} colorScheme={"green"} value="present">
                  Mark All Present
                </Radio>
                <Radio w={"100%"} mt={3} colorScheme={"red"} value="absent">
                  Mark All Absent
                </Radio>
                <Radio w={"100%"} mt={3} colorScheme={"red"} value="remaining">
                  Mark Remaining Absent
                </Radio>
              </Box>
            </RadioGroup>
            {/* {inputValue?.type === "Message" ?
                            <Text>{"Dear Parent, Your child {#var#} is {#var} in class today, Regards Mzone School"}</Text>
                            :
                            null
                        } */}
            {/* <CustomTextarea w={"100%"} type={"text"} name="message" label={"Message"} inputValue={inputValue} setInputValue={setInputValue} /> */}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            size={"sm"}
            variant="outline"
            mr={3}
            colorScheme={"red"}
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            size={"sm"}
            colorScheme={themeColor}
            onClick={() => confirmMark(inputValue?.type)}
          >
            Mark
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
