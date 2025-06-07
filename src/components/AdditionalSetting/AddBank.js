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

export const AddBank = ({ data, sessionMasterId, themeColor, closeDrawer }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          accountNumber: data.accountNumber,
          openingBalance: data.openingBalance,
          ifsc: data.ifsc,
          branch: data.branch,
          id: data.id,
        }
      : {}
  );

  const {
    addBankAction,
    addBankStatus,
    updateBankAction,
    updateBankStatus,
    resetBankStatus,
  } = useAdditionalSetupStore((s) => ({
    addBankAction: s.addBankAction,
    addBankStatus: s.addBankStatus,
    updateBankAction: s.updateBankAction,
    updateBankStatus: s.updateBankStatus,
    resetBankStatus: s.resetBankStatus,
  }));

  const submitBank = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateBankAction({
        ...inputValue,
        sessionMasterId,
      });
    } else {
      addBankAction({
        ...inputValue,
        sessionMasterId,
      });
    }
  };

  useEffect(() => {
    if (
      addBankStatus === STATUS.SUCCESS ||
      updateBankStatus === STATUS.SUCCESS
    ) {
      resetBankStatus();
      closeDrawer();
    }
  }, [addBankStatus, closeDrawer, resetBankStatus, updateBankStatus]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitBank}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{data?.id ? "Edit Bank" : "Add New Bank"}</DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"Bank"}
                autoFocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                type={"number"}
                limit={17}
                name="accountNumber"
                label={"Account Number"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                type={"number"}
                name="openingBalance"
                label={"Opening Balance"}
                autoFocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                type={"text"}
                name="ifsc"
                label={"IFSC Code"}
                autoFocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                type={"text"}
                name="branch"
                label={"Branch"}
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
                addBankStatus === STATUS.FETCHING ||
                updateBankStatus === STATUS.FETCHING
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
