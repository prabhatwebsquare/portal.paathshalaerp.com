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

export const AddShelfLocation = ({ data, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          id: data.id,
        }
      : {}
  );

  const {
    addShelfLocationAction,
    addShelfLocationStatus,
    updateShelfLocationAction,
    updateShelfLocationStatus,
    resetShelfLocationStatus,
  } = useLibraryStore((s) => ({
    addShelfLocationAction: s.addShelfLocationAction,
    addShelfLocationStatus: s.addShelfLocationStatus,
    updateShelfLocationAction: s.updateShelfLocationAction,
    updateShelfLocationStatus: s.updateShelfLocationStatus,
    resetShelfLocationStatus: s.resetShelfLocationStatus,
  }));

  const addShelfLocation = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateShelfLocationAction(inputValue);
    } else {
      addShelfLocationAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addShelfLocationStatus === STATUS.SUCCESS ||
      updateShelfLocationStatus === STATUS.SUCCESS
    ) {
      resetShelfLocationStatus();
      closeDrawer();
    }
  }, [
    addShelfLocationStatus,
    closeDrawer,
    resetShelfLocationStatus,
    updateShelfLocationStatus,
  ]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addShelfLocation}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Shelf Location" : "Add New Shelf Location"}
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
                addShelfLocationStatus === STATUS.FETCHING ||
                updateShelfLocationStatus === STATUS.FETCHING
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
