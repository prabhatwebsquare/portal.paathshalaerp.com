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

export const AddIncomeType = ({ data, closeDrawer }) => {
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
    addIncomeTypeAction,
    addIncomeTypeStatus,
    updateIncomeTypeAction,
    updateIncomeTypeStatus,
    resetIncomeTypeStatus,
  } = useAccountStore((s) => ({
    addIncomeTypeAction: s.addIncomeTypeAction,
    addIncomeTypeStatus: s.addIncomeTypeStatus,
    updateIncomeTypeAction: s.updateIncomeTypeAction,
    updateIncomeTypeStatus: s.updateIncomeTypeStatus,
    resetIncomeTypeStatus: s.resetIncomeTypeStatus,
  }));

  const submitData = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateIncomeTypeAction(inputValue);
    } else {
      addIncomeTypeAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addIncomeTypeStatus === STATUS.SUCCESS ||
      updateIncomeTypeStatus === STATUS.SUCCESS
    ) {
      resetIncomeTypeStatus();
      closeDrawer();
    }
  }, [
    addIncomeTypeStatus,
    closeDrawer,
    resetIncomeTypeStatus,
    updateIncomeTypeStatus,
  ]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitData}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Income Type" : "Add New Income Type"}
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="type"
                label={"Income Type"}
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
                addIncomeTypeStatus === STATUS.FETCHING ||
                updateIncomeTypeStatus === STATUS.FETCHING
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
