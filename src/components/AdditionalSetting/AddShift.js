import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
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
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";

export const AddShift = ({ data, themeColor, closeDrawer }) => {
  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
  );
  const [inputValue, setInputValue] = useState(data.id ? data : {
    name: "",
    startTime: "",
    endTime: "",
    id: null,
    absentMessageTime: 0,
    sessionMasterId
  });

  // useEffect(() => {
  //   if (data?.id) {
  //     setInputValue({
  //       name: data.name,
  //       startTime: data.startTime,
  //       endTime: data.endTime,
  //       id: data.id,
  //       absentMessageTime: data?.absentMessageTime || 0,
  //       sessionMasterId : data.sessionMasterId
  //     });
  //   }
  // }, [data , sessionMasterId]);
  const {
    addShiftAction,
    addShiftStatus,
    updateShiftAction,
    updateShiftStatus,
    resetShiftStatus,
  } = useAdditionalSetupStore((s) => ({
    addShiftAction: s.addShiftAction,
    addShiftStatus: s.addShiftStatus,
    updateShiftAction: s.updateShiftAction,
    updateShiftStatus: s.updateShiftStatus,
    resetShiftStatus: s.resetShiftStatus,
  }));

  const submitShift = (e) => {
    e.preventDefault();
    if (data?.id) {
      const newData = {
        ...inputValue,
        sessionMasterId,
        title : "cdc"
      }
      updateShiftAction(newData);
    } else {
      addShiftAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addShiftStatus === STATUS.SUCCESS ||
      updateShiftStatus === STATUS.SUCCESS
    ) {
      resetShiftStatus();
      closeDrawer();
    }
  }, [addShiftStatus, closeDrawer, resetShiftStatus, updateShiftStatus]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitShift}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Shift" : "Add New Shift"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"Shift Name"}
                autoFocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                type={"time"}
                limit={17}
                name="startTime"
                label={"In Time"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                type={"time"}
                limit={17}
                name="endTime"
                label={"Out Time"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                type={"number"}
                name="absentMessageTime"
                label={"Absent Message Shoot Time"}
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
            <Button size={"sm"} type={"submit"} colorScheme={themeColor}>
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
