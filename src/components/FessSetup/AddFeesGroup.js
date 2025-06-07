import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useFeesSetupStore } from "@/store/feesSetup";
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

export const AddFeesGroup = ({ data, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          id: data.id,
        }
      : {}
  );

  const {
    addFeesGroupAction,
    addFeesGroupStatus,
    updateFeesGroupAction,
    updateFeesGroupStatus,
    resetFeesGroupStatus,
  } = useFeesSetupStore((s) => ({
    addFeesGroupAction: s.addFeesGroupAction,
    addFeesGroupStatus: s.addFeesGroupStatus,
    updateFeesGroupAction: s.updateFeesGroupAction,
    updateFeesGroupStatus: s.updateFeesGroupStatus,
    resetFeesGroupStatus: s.resetFeesGroupStatus,
  }));

  const submitFeesGroup = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateFeesGroupAction(inputValue);
    } else {
      addFeesGroupAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addFeesGroupStatus === STATUS.SUCCESS ||
      updateFeesGroupStatus === STATUS.SUCCESS
    ) {
      resetFeesGroupStatus();
      closeDrawer();
    }
  }, [
    addFeesGroupStatus,
    closeDrawer,
    resetFeesGroupStatus,
    updateFeesGroupStatus,
  ]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitFeesGroup}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit FeesGroup" : "Add New FeesGroup"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"FeesGroup"}
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
                addFeesGroupStatus === STATUS.FETCHING ||
                updateFeesGroupStatus === STATUS.FETCHING
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
