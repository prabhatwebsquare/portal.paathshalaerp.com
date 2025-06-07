import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { STATUS } from "@/constant";
import { useAdminStore } from "@/store/AdminStore";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  VStack,
  Box,
  Input,
} from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";

export const AddMessage = ({ data, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,
          templateName: data.templateName,
          moduleName: data.moduleName,
          userType: data.userType,
          smsTemplate: data.smsTemplate || "",
          notificationTemplate: data.notificationTemplate || "",
        }
      : { 
          templateName: "", 
          moduleName: "", 
          userType: "", 
          smsTemplate: "",
          notificationTemplate: "",
        }
  );

  const [showVariables, setShowVariables] = useState({
    smsTemplate: false,
    notificationTemplate: false
  });
  const [cursorPositions, setCursorPositions] = useState({
    smsTemplate: 0,
    notificationTemplate: 0
  });
  const [variableCount, setVariableCount] = useState({
    smsTemplate: 0,
    notificationTemplate: 0
  });
  const messageInputRef = useRef(null);

  const dynamicVariables = [
    { name: "Student Name", value: "<name>" },
    { name: "Email", value: "<email>" },
    { name: "Admission Number", value: "<admission_no>" },
    { name: "Class", value: "<class>" },
    { name: "Section", value: "<section>" },
    { name: "Roll Number", value: "<roll_no>" },
    { name: "Fee Amount", value: "<fee_amount>" },
    { name: "Due Date", value: "<due_date>" },
    { name: "Payment Status", value: "<payment_status>" },
    { name: "Exam Name", value: "<exam_name>" },
    { name: "Exam Date", value: "<exam_date>" },
    { name: "Exam Result", value: "<exam_result>" },
    { name: "Admission Date", value: "<admission_date>" },
    { name: "Admission Status", value: "<admission_status>" },
    { name: "Parent Name", value: "<parent_name>" },
    { name: "Parent Contact", value: "<parent_contact>" }
  ];

  const handleMessageChange = (e) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    const fieldName = e.target.name;
    
    if (value[cursorPos - 1] === "@") {
      if (fieldName === "smsTemplate" && variableCount[fieldName] >= 2) {
        return;
      }
      setShowVariables(prev => ({
        ...prev,
        [fieldName]: true
      }));
      setCursorPositions(prev => ({
        ...prev,
        [fieldName]: cursorPos
      }));
    } else {
      setShowVariables(prev => ({
        ...prev,
        [fieldName]: false
      }));
    }

    setInputValue(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const insertVariable = (variable, fieldName) => {
    if (fieldName === "smsTemplate" && variableCount[fieldName] >= 2) {
      return;
    }

    const beforeCursor = inputValue[fieldName].substring(0, cursorPositions[fieldName] - 1);
    const afterCursor = inputValue[fieldName].substring(cursorPositions[fieldName]);
    const newMessage = beforeCursor + variable + afterCursor;
    
    setInputValue(prev => ({
      ...prev,
      [fieldName]: newMessage
    }));
    setShowVariables(prev => ({
      ...prev,
      [fieldName]: false
    }));
    setVariableCount(prev => ({
      ...prev,
      [fieldName]: prev[fieldName] + 1
    }));
  };

  const {
    addMessageTemplateAction,
    addMessageTemplateStatus,
    updateMessageTemplateAction,
    updateMessageTemplateStatus,
    resetMessageTemplateStatus,
  } = useAdminStore((s) => ({
    addMessageTemplateAction: s.addMessageTemplateAction,
    addMessageTemplateStatus: s.addMessageTemplateStatus,
    updateMessageTemplateAction: s.updateMessageTemplateAction,
    updateMessageTemplateStatus: s.updateMessageTemplateStatus,
    resetMessageTemplateStatus: s.resetMessageTemplateStatus,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateMessageTemplateAction(inputValue);
    } else {
      addMessageTemplateAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addMessageTemplateStatus === STATUS.SUCCESS ||
      updateMessageTemplateStatus === STATUS.SUCCESS
    ) {
      resetMessageTemplateStatus();
      closeDrawer();
    }
  }, [addMessageTemplateStatus, closeDrawer, resetMessageTemplateStatus, updateMessageTemplateStatus]);

  return (
    <Drawer isOpen={data} placement="right" size={"lg"} onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={handleSubmit}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{data?.id ? "Edit Message Template" : "Add New Message Template"}</DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <Flex flexWrap={"wrap"} gap={3}>
                <CustomInput
                  type={"text"}
                  name="templateName"
                  label={"Template Name"}
                  autoFocus={true}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomInput
                  type={"text"}
                  name="moduleName"
                  label={"Module Name"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomSelect
                  size={"md"}
                  name={"userType"}
                  label={"User Type"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={[
                    { name: "Student", value: "student" },
                    { name: "Staff", value: "staff" },
                    { name: "Both", value: "both" }
                  ]}
                />
                <Box width="100%" position="relative">
                  <Box>
                    <Box 
                      mb={2} 
                      fontWeight="bold"
                      fontSize="md"
                      color="blue.600"
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <Box as="span" fontSize="lg">📱</Box>
                      SMS Template
                    </Box>
                    <Input
                      as="textarea"
                      name="smsTemplate"
                      placeholder="Type your SMS template here. Use @ to insert variables (max 2 variables)"
                      value={inputValue.smsTemplate}
                      onChange={handleMessageChange}
                      ref={messageInputRef}
                      minH="100px"
                      resize="vertical"
                    />
                    <Box mt={1} fontSize="sm" color="gray.500">
                      Variables used: {variableCount.smsTemplate}/2
                    </Box>
                  </Box>
                  {showVariables.smsTemplate && variableCount.smsTemplate < 2 && (
                    <Box
                      position="absolute"
                      top="100%"
                      left="0"
                      bg="white"
                      boxShadow="md"
                      borderRadius="md"
                      zIndex="dropdown"
                      width="200px"
                    >
                      {dynamicVariables.map((variable) => (
                        <Box
                          key={variable.value}
                          p={2}
                          cursor="pointer"
                          _hover={{ bg: "gray.100" }}
                          onClick={() => insertVariable(variable.value, "smsTemplate")}
                        >
                          {variable.name}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
                <Box width="100%" position="relative">
                <Box 
                      mb={2} 
                      fontWeight="bold"
                      fontSize="md"
                      color="blue.600"
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <Box as="span" fontSize="lg">📱</Box>
                      notification Template
                    </Box>
                  <Input
                    as="textarea"
                    name="notificationTemplate"
                    placeholder="Type your notification template here. Use @ to insert variables"
                    value={inputValue.notificationTemplate}
                    onChange={handleMessageChange}
                    ref={messageInputRef}
                    minH="100px"
                    resize="vertical"
                  />
                  <Box mt={1} fontSize="sm" color="gray.500">
                    Variables used: {variableCount.notificationTemplate}
                  </Box>
                  {showVariables.notificationTemplate && (
                    <Box
                      position="absolute"
                      top="100%"
                      left="0"
                      bg="white"
                      boxShadow="md"
                      borderRadius="md"
                      zIndex="dropdown"
                      width="200px"
                    >
                      {dynamicVariables.map((variable) => (
                        <Box
                          key={variable.value}
                          p={2}
                          cursor="pointer"
                          _hover={{ bg: "gray.100" }}
                          onClick={() => insertVariable(variable.value, "notificationTemplate")}
                        >
                          {variable.name}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Flex>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              size={"sm"}
              variant="outline"
              mr={3}
              colorScheme={"red"}
              onClick={closeDrawer}
            >
              Cancel
            </Button>
            <Button
              size={"sm"}
              type={"submit"}
              isLoading={
                addMessageTemplateStatus === STATUS.FETCHING ||
                updateMessageTemplateStatus === STATUS.FETCHING
              }
              colorScheme={themeColor}
            >
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
