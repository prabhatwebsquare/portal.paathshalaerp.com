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
    adddesignationSuperAdminAction,
    adddesignationSuperAdminStatus,
    updatedesignationSuperAdminAction,
    updatedesignationSuperAdminStatus,
    resetdesignationSuperAdminStatus,
  } = useAdditionalSetupStore((s) => ({
    adddesignationSuperAdminAction: s.adddesignationSuperAdminAction,
    adddesignationSuperAdminStatus: s.adddesignationSuperAdminStatus,
    updatedesignationSuperAdminAction: s.updatedesignationSuperAdminAction,
    updatedesignationSuperAdminStatus: s.updatedesignationSuperAdminStatus,
    resetdesignationSuperAdminStatus: s.resetdesignationSuperAdminStatus,
  }));

  const submitdesignation = (e) => {
    e.preventDefault();
    if (data?.id) {
      updatedesignationSuperAdminAction(inputValue);
    } else {
      adddesignationSuperAdminAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      adddesignationSuperAdminStatus === STATUS.SUCCESS ||
      updatedesignationSuperAdminStatus === STATUS.SUCCESS
    ) {
      resetdesignationSuperAdminStatus();
      closeDrawer();
    }
  }, [adddesignationSuperAdminStatus, closeDrawer, resetdesignationSuperAdminStatus, updatedesignationSuperAdminStatus]);

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
                adddesignationSuperAdminStatus === STATUS.FETCHING ||
                updatedesignationSuperAdminStatus === STATUS.FETCHING
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
