import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
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

export const AddHouse = ({ data, themeColor, closeDrawer }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          id: data.id,
        }
      : {}
  );

  const {
    addHouseAction,
    addHouseStatus,
    updateHouseAction,
    updateHouseStatus,
    resetHouseStatus,
  } = useAdditionalSetupStore((s) => ({
    addHouseAction: s.addHouseAction,
    addHouseStatus: s.addHouseStatus,
    updateHouseAction: s.updateHouseAction,
    updateHouseStatus: s.updateHouseStatus,
    resetHouseStatus: s.resetHouseStatus,
  }));

  const submitHouse = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateHouseAction(inputValue);
    } else {
      addHouseAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addHouseStatus === STATUS.SUCCESS ||
      updateHouseStatus === STATUS.SUCCESS
    ) {
      resetHouseStatus();
      closeDrawer();
    }
  }, [addHouseStatus, closeDrawer, resetHouseStatus, updateHouseStatus]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitHouse}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit House" : "Add New House"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"House"}
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
                addHouseStatus === STATUS.FETCHING ||
                updateHouseStatus === STATUS.FETCHING
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
