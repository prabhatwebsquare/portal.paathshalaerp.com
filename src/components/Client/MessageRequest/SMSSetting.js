import { useState } from "react";
import {
  Button,
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
  Stack,
  useToast,
} from "@chakra-ui/react";
import CustomInput from "@/common/CustomInput";
import { useAppStore } from "@/store/App";

export const SMSGatewaySettings = ({ data, closeModal, themeColor }) => {
  const [inputValue, setInputValue] = useState({
    websitePanel: "blukSMS",
    status: 2,
    userId: "",
    messagePassword: "",
    senderId: "",
    instituteName: "",
    pid: "",
    list_id: data?.id || "",
  });

  const handleChange = (name, value) => {
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const {
    acceptBulkRequestAction,
    acceptBulkRequestStatus,
    getBulkRequestMessageAction
  } = useAppStore((s) => ({
    acceptBulkRequestAction :s.acceptBulkRequestAction,
    acceptBulkRequestStatus: s.acceptBulkRequestStatus,
    getBulkRequestMessageAction : s.getBulkRequestMessageAction
  }));


  const sendRequest = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...inputValue,
      };
     await acceptBulkRequestAction(payload);
     getBulkRequestMessageAction({ page: 1, limit: 10 ,status: 1  });
      closeModal();
    } catch (error) {}
  };

  return (
    <Modal isOpen={!!data} onClose={closeModal} size={"2xl"}>
      <ModalOverlay />
      <form onSubmit={sendRequest}>
        <ModalContent>
          <ModalHeader>SMS Gateway Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup
              onChange={(e) => handleChange("websitePanel", e)}
              value={inputValue.websitePanel}
              my={5}
              name="websitePanel"
            >
              <Stack direction="row" spacing={3}>
                <Radio value="TSMS">Transactional SMS</Radio>
                <Radio value="blukSMS">Bulk SMS</Radio>
              </Stack>
            </RadioGroup>
            <Flex w="100%" gap={3} flexWrap="wrap">
              <CustomInput
                w="48%"
                type="text"
                name="userId"
                label="Username"
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                w="48%"
                type="password"
                name="messagePassword"
                label="Password"
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                w="48%"
                type="text"
                name="senderId"
                label="Sender Name"
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                w="48%"
                type="text"
                name="instituteName"
                label="Institute Name"
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                w="48%"
                type="text"
                name="pid"
                label="PID"
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              size="sm"
              mr={3}
              onClick={closeModal}
              variant="outline"
              colorScheme="red"
            >
              Close
            </Button>
            <Button
              size="sm"
              type="submit"
              colorScheme={themeColor}
              isLoading={false}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
