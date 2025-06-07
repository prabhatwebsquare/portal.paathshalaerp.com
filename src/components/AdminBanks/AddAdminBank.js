import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useAdminBankStore } from "@/store/Banks";
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
  Select,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export const AddAdminBank = ({ data, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          id: data.id,
        }
      : {}
  );

  const {
    addAdminBankAction,
    addAdminBankStatus,
    updateAdminBankAction,
    updateAdminBankStatus,
    resetAdminBankStatus,
  } = useAdminBankStore((s) => ({
    addAdminBankAction: s.addAdminBankAction,
    addAdminBankStatus: s.addAdminBankStatus,
    updateAdminBankAction: s.updateAdminBankAction,
    updateAdminBankStatus: s.updateAdminBankStatus,
    resetAdminBankStatus: s.resetAdminBankStatus,
  }));

  const addAdminBank = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateAdminBankAction(inputValue);
    } else {
      addAdminBankAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addAdminBankStatus === STATUS.SUCCESS ||
      updateAdminBankStatus === STATUS.SUCCESS
    ) {
      resetAdminBankStatus();
      closeDrawer();
    }
  }, [
    addAdminBankStatus,
    closeDrawer,
    resetAdminBankStatus,
    updateAdminBankStatus,
  ]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addAdminBank}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{data?.id ? "Edit Bank" : "Add New Bank"}</DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"Bank Name"}
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
                addAdminBankStatus === STATUS.FETCHING ||
                updateAdminBankStatus === STATUS.FETCHING
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
