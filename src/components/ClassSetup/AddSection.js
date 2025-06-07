import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
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

export const AddSection = ({ sectionData, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    sectionData?.id
      ? {
          name: sectionData.name,
          orderNo: sectionData.orderNo,
          id: sectionData.id,
        }
      : {}
  );

  const {
    addSectionAction,
    addSectionStatus,
    updateSectionAction,
    updateSectionStatus,
    resetSectionStatus,
    allSections
  } = useClassSetupStore((s) => ({
    addSectionAction: s.addSectionAction,
    addSectionStatus: s.addSectionStatus,
    updateSectionAction: s.updateSectionAction,
    updateSectionStatus: s.updateSectionStatus,
    resetSectionStatus: s.resetSectionStatus,
    allSections : s.allSections
  }));
  useEffect(() => {
    if (allSections?.length > 0 && !sectionData?.id) {
      const maxOrderNo = Math.max(...allSections.map((c) => c.orderNo));
      setInputValue((prev) => ({...prev, orderNo: maxOrderNo + 1 }));
    }
  
    return () => {
      
    }
  }, [allSections])
  const addSection = (e) => {
    e.preventDefault();
    if (sectionData?.id) {
      updateSectionAction(inputValue);
    } else {
      addSectionAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addSectionStatus === STATUS.SUCCESS ||
      updateSectionStatus === STATUS.SUCCESS
    ) {
      resetSectionStatus();
      closeDrawer();
    }
  }, [addSectionStatus, closeDrawer, resetSectionStatus, updateSectionStatus]);

  return (
    <Drawer isOpen={sectionData} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addSection}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {sectionData?.id ? "Edit Section" : "Add New Section"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"Section"}
                autoFocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                type={"number"}
                name="orderNo"
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
                addSectionStatus === STATUS.FETCHING ||
                updateSectionStatus === STATUS.FETCHING
              }
              colorScheme={themeColor}
            >
              {sectionData?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
