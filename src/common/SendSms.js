import CustomArrayInput from "@/common/CustomArrayInput";
import CustomInput from "@/common/CustomInput";
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
import dayjs from "dayjs";
import { map } from "lodash";
import { useState } from "react";
import CustomTextarea from "./CustomTextarea";

export const SendSms = ({ data, themeColor }) => {
  const [toggleConfirm, setToggleConfirm] = useState(null);

  // useEffect(() => {
  //     if (status === STATUS.SUCCESS) {
  //         reset()
  //         setToggleConfirm(null)
  //     }
  // }, [reset, status])

  return (
    <>
      <Button
        size={"md"}
        colorScheme={themeColor || "blue"}
        onClick={() => setToggleConfirm([])}
      >
        Send SMS
      </Button>
      {toggleConfirm && (
        <SmsDrawer
          data={toggleConfirm}
          themeColor={themeColor}
          closeAlert={() => setToggleConfirm(null)}
        />
      )}
    </>
  );
};
export const SmsDrawer = ({ closeAlert, data, themeColor }) => {
  const [inputValue, setInputValue] = useState({ type: "Message" });
  const [value, setValue] = useState({});

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };
  return (
    <Modal size={"md"} isOpen={data} placement="right" onClose={closeAlert}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Send Sms</ModalHeader>

        <ModalBody>
          <VStack spacing={3}>
            <RadioGroup
              mb={3}
              w={"100%"}
              colorScheme={themeColor}
              onChange={(e) => inputHandler("type", e)}
              value={inputValue?.type}
            >
              <Stack direction="row" justify={"space-between"}>
                <Radio value="Message">Message</Radio>
                <Radio value="Email">Email</Radio>
                <Radio value="App Notification">App Notification</Radio>
              </Stack>
            </RadioGroup>
            {/* {inputValue?.type === "Message" ? (
              <Text>
                {
                  "Dear Parent, Your child {#var#} is {#var} in class today, Regards Mzone School"
                }
              </Text>
            ) : null} */}
            <CustomTextarea
              w={"100%"}
              type={"text"}
              name="message"
              label={"Message"}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            size={"sm"}
            variant="outline"
            mr={3}
            colorScheme={"red"}
            onClick={closeAlert}
          >
            Cancel
          </Button>
          <Button size={"sm"} colorScheme={themeColor}>
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
