import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useFeesSetupStore } from "@/store/feesSetup";
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

export const AddFeesName = ({ data, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          id: data.id,
          orderId: data.orderId,
        }
      : {}
  );

  const {
    allFeesNames,
    addFeesNameAction,
    addFeesNameStatus,
    updateFeesNameAction,
    updateFeesNameStatus,
    resetFeesNameStatus,
  } = useFeesSetupStore((s) => ({
    addFeesNameAction: s.addFeesNameAction,
    addFeesNameStatus: s.addFeesNameStatus,
    updateFeesNameAction: s.updateFeesNameAction,
    updateFeesNameStatus: s.updateFeesNameStatus,
    resetFeesNameStatus: s.resetFeesNameStatus,
    allFeesNames : s.allFeesNames
  }));

  const submitFeesName = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateFeesNameAction(inputValue);
    } else {
      addFeesNameAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addFeesNameStatus === STATUS.SUCCESS ||
      updateFeesNameStatus === STATUS.SUCCESS
    ) {
      resetFeesNameStatus();
      closeDrawer();
    }
  }, [
    addFeesNameStatus,
    closeDrawer,
    resetFeesNameStatus,
    updateFeesNameStatus,
  ]);
  useEffect(() => {
  
    if (allFeesNames?.length > 0) {
      const maxorderId = Math.max(...allFeesNames.map((c) => c.orderId || 0));
  
      if (!data?.id) {
        setInputValue((prev) => ({ ...prev, orderId: maxorderId + 1 }));
      } else if (data?.id && (data.orderId === undefined || data.orderId === null)) {
        setInputValue((prev) => ({ ...prev, orderId: maxorderId + 1 }));
      }
    }
  }, [allFeesNames, data]);
  

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitFeesName}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Fees Name" : "Add New Fees Name"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"Fees Name"}
                autoFocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
          <CustomInput
                type={"number"}
                name="orderId"
                label={"Order"}
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
                addFeesNameStatus === STATUS.FETCHING ||
                updateFeesNameStatus === STATUS.FETCHING
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
