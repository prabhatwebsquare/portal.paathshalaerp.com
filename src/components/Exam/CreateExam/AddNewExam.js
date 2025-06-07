import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useExamStore } from "@/store/Exam";
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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export const AddExam = ({ type, data, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          type,
          name: data.name,
          orderNo: data.orderNo,
          id: data.id,
        }
      : { type }
  );

  const {
    addExamAction,
    addExamStatus,
    updateExamAction,
    updateExamStatus,
    resetStatus,
    allExams
  } = useExamStore((s) => ({
    addExamAction: s.addExamAction,
    addExamStatus: s.addExamStatus,
    updateExamAction: s.updateExamAction,
    updateExamStatus: s.updateExamStatus,
    resetStatus: s.resetStatus,
    allExams :s.allExams
  }));
  useEffect(() => {
    if (allExams?.length > 0 && !data?.id) {
      const maxOrderNo = Math.max(...allExams.map((c) => c.orderNo));
      setInputValue((prev) => ({...prev, orderNo: maxOrderNo + 1 }));
    }
  
    return () => {
      
    }
  }, [allExams])
  const addExam = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateExamAction(inputValue);
    } else {
      addExamAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addExamStatus === STATUS.SUCCESS ||
      updateExamStatus === STATUS.SUCCESS
    ) {
      resetStatus();
      closeDrawer();
    }
  }, [addExamStatus, closeDrawer, resetStatus, updateExamStatus]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addExam}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id
              ? `Edit ${type === "exam" ? "Exam" : "Test"}`
              : `Add New ${type === "exam" ? "Exam" : "Test"}`}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={type === "exam" ? "Exam" : "Test"}
                autofocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                type={"number"}
                name="orderNo"
                label={"Order"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
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
                addExamStatus === STATUS.FETCHING ||
                updateExamStatus === STATUS.FETCHING
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
