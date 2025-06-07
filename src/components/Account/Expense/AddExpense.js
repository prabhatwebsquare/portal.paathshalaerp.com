import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { STATUS } from "@/constant";
import { useAccountStore } from "@/store/Account";
import { getLocalStorageItem } from "@/utils/LocalStorage";
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

export const AddExpense = ({ data, closeDrawer }) => {
  const themeColor = getLocalStorageItem("themeColor") || "blue";
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,
          type: data.type,
        }
      : {}
  );

  const {
    addExpenseTypeAction,
    addExpenseTypeStatus,
    updateExpenseTypeAction,
    updateExpenseTypeStatus,
    resetExpenseTypeStatus,
  } = useAccountStore((s) => ({
    addExpenseTypeAction: s.addExpenseTypeAction,
    addExpenseTypeStatus: s.addExpenseTypeStatus,
    updateExpenseTypeAction: s.updateExpenseTypeAction,
    updateExpenseTypeStatus: s.updateExpenseTypeStatus,
    resetExpenseTypeStatus: s.resetExpenseTypeStatus,
  }));

  const submitData = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateExpenseTypeAction(inputValue);
    } else {
      addExpenseTypeAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addExpenseTypeStatus === STATUS.SUCCESS ||
      updateExpenseTypeStatus === STATUS.SUCCESS
    ) {
      resetExpenseTypeStatus();
      closeDrawer();
    }
  }, [
    addExpenseTypeStatus,
    closeDrawer,
    resetExpenseTypeStatus,
    updateExpenseTypeStatus,
  ]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitData}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Expense" : "Add New Expense"}
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="type"
                label={"Expense Type"}
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
              type="submit"
              colorScheme={themeColor}
              isLoading={
                addExpenseTypeStatus === STATUS.FETCHING ||
                updateExpenseTypeStatus === STATUS.FETCHING
              }
            >
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
