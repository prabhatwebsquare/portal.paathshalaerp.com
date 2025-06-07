import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import CustomTextarea from "@/common/CustomTextarea";
import { MultiSelectDropdown } from "@/common/MultiSelectDropdown";
import MultiSelectSelector from "@/common/MultiSelectSelector";
import { STATUS } from "@/constant";
import { useAppStore } from "@/store/App";
import { useStaffStore } from "@/store/StaffStore";
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
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { map } from "lodash";
import React, { useEffect, useRef, useState } from "react";

export const AddTeacherAppMessage = ({
  themeColor,
  sessionMasterId,
  type,
  data,
  closeDrawer,
}) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
        message: data?.message,
        id: data.id,
        staffIds: data?.staffIds,
        isStudent: data?.isStudent,
      }
      : {
        isStudent: 0,
        date: dayjs().format("YYYY-MM-DD"),
      }
  );
  const {
    addMessageAction,
    addMessageStatus,
    updateMessageAction,
    updateMessageStatus,
    resetMessageStatus,
    getTeachMessageAction,
  } = useAppStore((s) => ({
    addMessageAction: s.addMessageAction,
    addMessageStatus: s.addMessageStatus,
    updateMessageAction: s.updateMessageAction,
    updateMessageStatus: s.updateMessageStatus,
    resetMessageStatus: s.resetMessageStatus,
    getTeachMessageAction: s.getTeachMessageAction,
  }));

  const addMessage = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateMessageAction(inputValue);
    } else {
      addMessageAction({
        sessionMasterId,
        ...inputValue,
      });
    }
  };

  useEffect(() => {
    if (
      addMessageStatus === STATUS.SUCCESS ||
      updateMessageStatus === STATUS.SUCCESS
    ) {
      getTeachMessageAction({ sessionMasterId });
      resetMessageStatus();
      closeDrawer();
    }
  }, [addMessageStatus, closeDrawer, resetMessageStatus, updateMessageStatus]);

  const { getStaffAction, getStaffStatus, allStaffs } = useStaffStore((s) => ({
    getStaffAction: s.getStaffAction,
    getStaffStatus: s.getStaffStatus,
    allStaffs: s.allStaffs,
  }));

  useEffect(() => {
    if ((getStaffStatus || 1) === STATUS.NOT_STARTED) {
      getStaffAction();
    }
  }, [getStaffAction, getStaffStatus]);
  const [staffIds, setstaffIds] = useState()
  const updateStaffId = (name, val) => {
    setstaffIds((pre) => ({ ...pre, [name]: val }));
  };
  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addMessage}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Teacher Message" : "Add Teacher Message"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>

              <MultiSelectSelector
                label="Select Staff"
                name="staffIds"
                options={map(allStaffs, (d) => ({ value: d.id, name: d.name }))}
                selectedValues={inputValue.staffIds}
                setSelectedValues={(staffIds) => {
                  if (staffIds?.includes("all")) {
                    setInputValue((prev) => ({
                      ...prev,
                      staffIds: "all",
                    }));
                  } else {
                    setInputValue((prev) => ({
                      ...prev,
                      staffIds: staffIds,
                    }));
                  }
                }}
              />
              <CustomTextarea
                type={"text"}
                name="message"
                label={"Message"}
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
