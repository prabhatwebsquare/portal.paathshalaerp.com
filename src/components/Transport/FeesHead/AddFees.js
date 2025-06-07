import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useTransportStore } from "@/store/Transport";
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

export const AddFeesHead = ({ data, closeDrawer, themeColor }) => {
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
    addFeesHeadAction,
    addFeesHeadStatus,
    updateFeesHeadAction,
    updateFeesHeadStatus,
    resetFeesHeadStatus,
    allFeesHeads
  } = useTransportStore((s) => ({
    addFeesHeadAction: s.addFeesHeadAction,
    addFeesHeadStatus: s.addFeesHeadStatus,
    updateFeesHeadAction: s.updateFeesHeadAction,
    updateFeesHeadStatus: s.updateFeesHeadStatus,
    resetFeesHeadStatus: s.resetFeesHeadStatus,
    allFeesHeads : s.allFeesHeads
  }));

  const addFeesHead = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateFeesHeadAction(inputValue);
    } else {
      addFeesHeadAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addFeesHeadStatus === STATUS.SUCCESS ||
      updateFeesHeadStatus === STATUS.SUCCESS
    ) {
      resetFeesHeadStatus();
      closeDrawer();
    }
  }, [
    addFeesHeadStatus,
    closeDrawer,
    resetFeesHeadStatus,
    updateFeesHeadStatus,
  ]);
  useEffect(() => {
  
    if (allFeesHeads?.length > 0) {
      const maxorderId = Math.max(...allFeesHeads.map((c) => c.orderId || 0));
  
      if (!data?.id) {
        setInputValue((prev) => ({ ...prev, orderId: maxorderId + 1 }));
      } else if (data?.id && (data.orderId === undefined || data.orderId === null)) {
        setInputValue((prev) => ({ ...prev, orderId: maxorderId + 1 }));
      }
    }
  }, [allFeesHeads, data]);
  

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addFeesHead}>
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
                addFeesHeadStatus === STATUS.FETCHING ||
                updateFeesHeadStatus === STATUS.FETCHING
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
