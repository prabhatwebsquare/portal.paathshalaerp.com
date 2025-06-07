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

export const AddDesignation = ({ data, themeColor, closeDrawer }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          id: data.id,
        }
      : {}
  );

  const {
    adddesignationAction,
    adddesignationStatus,
    updatedesignationAction,
    updatedesignationStatus,
    resetdesignationStatus,
  } = useAdditionalSetupStore((s) => ({
    adddesignationAction: s.adddesignationAction,
    adddesignationStatus: s.adddesignationStatus,
    updatedesignationAction: s.updatedesignationAction,
    updatedesignationStatus: s.updatedesignationStatus,
    resetdesignationStatus: s.resetdesignationStatus,
  }));

  const submitdesignation = (e) => {
    e.preventDefault();
    if (data?.id) {
      updatedesignationAction(inputValue);
    } else {
      adddesignationAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      adddesignationStatus === STATUS.SUCCESS ||
      updatedesignationStatus === STATUS.SUCCESS
    ) {
      resetdesignationStatus();
      closeDrawer();
    }
  }, [adddesignationStatus, closeDrawer, resetdesignationStatus, updatedesignationStatus]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitdesignation}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Designation" : "Add New Designation"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"Designation"}
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
                adddesignationStatus === STATUS.FETCHING ||
                updatedesignationStatus === STATUS.FETCHING
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
