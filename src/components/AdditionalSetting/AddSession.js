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
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

export const AddSession = ({ data, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          startDate: dayjs(data.startDate).format("YYYY-MM-DD"),
          endDate: dayjs(data.endDate).format("YYYY-MM-DD"),
          id: data.id,
        }
      : {}
  );

  const {
    addSessionAction,
    addSessionStatus,
    updateSessionAction,
    updateSessionStatus,
    resetSessionStatus,
  } = useAdditionalSetupStore((s) => ({
    addSessionAction: s.addSessionAction,
    addSessionStatus: s.addSessionStatus,
    updateSessionAction: s.updateSessionAction,
    updateSessionStatus: s.updateSessionStatus,
    resetSessionStatus: s.resetSessionStatus,
  }));
  const addSession = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateSessionAction(inputValue);
    } else {
      addSessionAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addSessionStatus === STATUS.SUCCESS ||
      updateSessionStatus === STATUS.SUCCESS
    ) {
      resetSessionStatus();
      closeDrawer();
    }
  }, [addSessionStatus, closeDrawer, resetSessionStatus, updateSessionStatus]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addSession}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Session" : "Add New Session"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"Session"}
                autoFocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                type={"date"}
                name="startDate"
                label={"Start Date"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                type={"date"}
                name="endDate"
                label={"End Date"}
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
                addSessionStatus === STATUS.FETCHING ||
                updateSessionStatus === STATUS.FETCHING
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
