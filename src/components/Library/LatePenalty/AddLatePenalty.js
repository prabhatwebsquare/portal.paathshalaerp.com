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

export const AddLatePenalty = ({ data, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          days: data.days,
          amount: data.amount,
          id: data.id,
        }
      : {}
  );

  const {
    addLatePenaltyAction,
    addLatePenaltyStatus,
    updateLatePenaltyAction,
    updateLatePenaltyStatus,
    resetLatePenaltyStatus,
  } = useLibraryStore((s) => ({
    addLatePenaltyAction: s.addLatePenaltyAction,
    addLatePenaltyStatus: s.addLatePenaltyStatus,
    updateLatePenaltyAction: s.updateLatePenaltyAction,
    updateLatePenaltyStatus: s.updateLatePenaltyStatus,
    resetLatePenaltyStatus: s.resetLatePenaltyStatus,
  }));

  const addLatePenalty = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateLatePenaltyAction(inputValue);
    } else {
      addLatePenaltyAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addLatePenaltyStatus === STATUS.SUCCESS ||
      updateLatePenaltyStatus === STATUS.SUCCESS
    ) {
      resetLatePenaltyStatus();
      closeDrawer();
    }
  }, [
    addLatePenaltyStatus,
    closeDrawer,
    resetLatePenaltyStatus,
    updateLatePenaltyStatus,
  ]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addLatePenalty}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Penalty" : "Add New Penalty"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"number"}
                name="days"
                label={"Days"}
                autoFocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                type={"number"}
                name="amount"
                label={"Amount"}
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
                addLatePenaltyStatus === STATUS.FETCHING ||
                updateLatePenaltyStatus === STATUS.FETCHING
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
