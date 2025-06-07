import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
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

export const AddClass = ({ themeColor, classData, closeDrawer }) => {
  const [inputValue, setInputValue] = useState(
    classData?.id
      ? {
          name: classData.name,
          orderNo: classData.orderNo,
          id: classData.id,
        }
      : {}
  );

  const {
    addClassAction,
    addClassStatus,
    updateClassAction,
    updateClassStatus,
    resetStatus,
    allClasses
  } = useClassSetupStore((s) => ({
    addClassAction: s.addClassAction,
    addClassStatus: s.addClassStatus,
    updateClassAction: s.updateClassAction,
    updateClassStatus: s.updateClassStatus,
    resetStatus: s.resetStatus,
    allClasses :s.allClasses
  }));
  useEffect(() => {
    if (allClasses?.length > 0 && !classData?.id) {
      const maxOrderNo = Math.max(...allClasses.map((c) => c.orderNo));
      setInputValue((prev) => ({...prev, orderNo: maxOrderNo + 1 }));
    }
  
    return () => {
      
    }
  }, [allClasses])
  

  const addClass = (e) => {
    e.preventDefault();
    if (classData?.id) {
      updateClassAction(inputValue);
    } else {
      addClassAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addClassStatus === STATUS.SUCCESS ||
      updateClassStatus === STATUS.SUCCESS
    ) {
      resetStatus();
      closeDrawer();
    }
  }, [addClassStatus, closeDrawer, resetStatus, updateClassStatus]);

  return (
    <Drawer isOpen={classData} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addClass}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {classData?.id ? "Edit Class" : "Add New Class"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"Class"}
                autoFocus={true}
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
                addClassStatus === STATUS.FETCHING ||
                updateClassStatus === STATUS.FETCHING
              }
              colorScheme={themeColor}
            >
              {classData?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
