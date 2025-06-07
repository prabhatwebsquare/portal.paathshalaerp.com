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

export const AddStream = ({ streamData, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    streamData?.id
      ? {
          name: streamData.name,
          id: streamData.id,
        }
      : {}
  );

  const {
    addStreamAction,
    addStreamStatus,
    updateStreamAction,
    updateStreamStatus,
    resetStreamStatus,
  } = useClassSetupStore((s) => ({
    addStreamAction: s.addStreamAction,
    addStreamStatus: s.addStreamStatus,
    updateStreamAction: s.updateStreamAction,
    updateStreamStatus: s.updateStreamStatus,
    resetStreamStatus: s.resetStreamStatus,
  }));

  const submitStream = (e) => {
    e.preventDefault();
    if (streamData?.id) {
      updateStreamAction(inputValue);
    } else {
      addStreamAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addStreamStatus === STATUS.SUCCESS ||
      updateStreamStatus === STATUS.SUCCESS
    ) {
      resetStreamStatus();
      closeDrawer();
    }
  }, [addStreamStatus, closeDrawer, resetStreamStatus, updateStreamStatus]);

  return (
    <Drawer isOpen={streamData} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitStream}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {streamData?.id ? "Edit Stream" : "Add New Stream"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"Stream"}
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
                addStreamStatus === STATUS.FETCHING ||
                updateStreamStatus === STATUS.FETCHING
              }
              colorScheme={themeColor}
            >
              {streamData?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
