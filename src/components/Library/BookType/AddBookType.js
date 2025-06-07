import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useLibraryStore } from "@/store/Library";
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

export const AddBookType = ({ data, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          id: data.id,
        }
      : {}
  );

  const {
    addBookTypeAction,
    addBookTypeStatus,
    updateBookTypeAction,
    updateBookTypeStatus,
    resetBookTypeStatus,
  } = useLibraryStore((s) => ({
    addBookTypeAction: s.addBookTypeAction,
    addBookTypeStatus: s.addBookTypeStatus,
    updateBookTypeAction: s.updateBookTypeAction,
    updateBookTypeStatus: s.updateBookTypeStatus,
    resetBookTypeStatus: s.resetBookTypeStatus,
  }));

  const addBookType = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateBookTypeAction(inputValue);
    } else {
      addBookTypeAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addBookTypeStatus === STATUS.SUCCESS ||
      updateBookTypeStatus === STATUS.SUCCESS
    ) {
      resetBookTypeStatus();
      closeDrawer();
    }
  }, [
    addBookTypeStatus,
    closeDrawer,
    resetBookTypeStatus,
    updateBookTypeStatus,
  ]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addBookType}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Book/Journal Type" : "Add Book/Journal Type"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"Name"}
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
                addBookTypeStatus === STATUS.FETCHING ||
                updateBookTypeStatus === STATUS.FETCHING
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
