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

export const AddSubject = ({ data, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          id: data.id,
        }
      : {}
  );

  const {
    addSubjectAction,
    addSubjectStatus,
    updateSubjectAction,
    updateSubjectStatus,
    resetSubjectStatus,
  } = useClassSetupStore((s) => ({
    addSubjectAction: s.addSubjectAction,
    addSubjectStatus: s.addSubjectStatus,
    updateSubjectAction: s.updateSubjectAction,
    updateSubjectStatus: s.updateSubjectStatus,
    resetSubjectStatus: s.resetSubjectStatus,
  }));

  const submitSubject = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateSubjectAction(inputValue);
    } else {
      addSubjectAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addSubjectStatus === STATUS.SUCCESS ||
      updateSubjectStatus === STATUS.SUCCESS
    ) {
      resetSubjectStatus();
      closeDrawer();
    }
  }, [addSubjectStatus, closeDrawer, resetSubjectStatus, updateSubjectStatus]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitSubject}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Subject" : "Add New Subject"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"Subject"}
                autoFocus={true}
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
                addSubjectStatus === STATUS.FETCHING ||
                updateSubjectStatus === STATUS.FETCHING
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
