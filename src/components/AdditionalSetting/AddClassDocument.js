import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { STATUS } from "@/constant";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
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
  Select,
  VStack,
} from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";

export const AddClassDocument = ({ data, themeColor, closeDrawer }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,

          id: data.id,
        }
      : {}
  );

  const { getClassAction, getClassStatus, allClasses } = useClassSetupStore(
    (s) => ({
      getClassAction: s.getClassAction,
      getClassStatus: s.getClassStatus,
      allClasses: s.allClasses,
    })
  );

  useEffect(() => {
    if ((getClassStatus || 1) === STATUS.NOT_STARTED) {
      getClassAction();
    }
  }, [getClassAction, getClassStatus]);
  const {
    addClassDocumentAction,
    addClassDocumentStatus,
    updateClassDocumentAction,
    updateClassDocumentStatus,
    resetClassDocumentStatus,
  } = useAdditionalSetupStore((s) => ({
    addClassDocumentAction: s.addClassDocumentAction,
    addClassDocumentStatus: s.addClassDocumentStatus,
    updateClassDocumentAction: s.updateClassDocumentAction,
    updateClassDocumentStatus: s.updateClassDocumentStatus,
    resetClassDocumentStatus: s.resetClassDocumentStatus,
  }));

  const submitClassDocument = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateClassDocumentAction(inputValue);
    } else {
      addClassDocumentAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addClassDocumentStatus === STATUS.SUCCESS ||
      updateClassDocumentStatus === STATUS.SUCCESS
    ) {
      resetClassDocumentStatus();
      closeDrawer();
    }
  }, [
    addClassDocumentStatus,
    closeDrawer,
    resetClassDocumentStatus,
    updateClassDocumentStatus,
  ]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitClassDocument}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Class Document" : "Add Class Document"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomSelect
                name={"classMasterId"}
                label={"Select Class"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(allClasses, (c) => ({ value: c.id, name: c.name }))}
              />
              <CustomInput
                type={"text"}
                name="document Name"
                label={"Document Name"}
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
                addClassDocumentStatus === STATUS.FETCHING ||
                updateClassDocumentStatus === STATUS.FETCHING
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
