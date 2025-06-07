import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import CustomTextarea from "@/common/CustomTextarea";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useExamStore } from "@/store/Exam";
import { useMobileAppStore } from "@/store/MobileApp";
import { useClassSetupStore } from "@/store/classSetup";
import { useStdFeesStore } from "@/store/stdFees";
import {
  Avatar,
  Box,
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
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { groupBy, map, uniqBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";

export const AddHoliday = ({
  themeColor,
  sessionMasterId,
  data,
  closeDrawer,
}) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,
          title: data.title,
          startDate: dayjs(data.startDate).format("YYYY-MM-DD"),
          endDate: dayjs(data.endDate).format("YYYY-MM-DD"),
          type: data.type,
          sessionMasterId,
        }
      : { sessionMasterId }
  );

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  const {
    addHolidayAction,
    addHolidayStatus,
    updateHolidayAction,
    updateHolidayStatus,
    resetHolidayStatus,
  } = useMobileAppStore((s) => ({
    addHolidayAction: s.addHolidayAction,
    addHolidayStatus: s.addHolidayStatus,
    allHolidays: s.allHolidays,
    updateHolidayAction: s.updateHolidayAction,
    updateHolidayStatus: s.updateHolidayStatus,
    resetHolidayStatus: s.resetHolidayStatus,
  }));

  const addHoliday = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateHolidayAction(inputValue);
    } else {
      addHolidayAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addHolidayStatus === STATUS.SUCCESS ||
      updateHolidayStatus === STATUS.SUCCESS
    ) {
      resetHolidayStatus();
      closeDrawer();
    }
  }, [addHolidayStatus, closeDrawer, resetHolidayStatus, updateHolidayStatus]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addHoliday}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Holiday" : "Add Holiday"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="title"
                label={"Holiday"}
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
              <CustomSelect
                name={"type"}
                label={"Type"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[
                  { name: "Student", value: "Student" },
                  { name: "Common", value: "Student/Staff" },
                ]}
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
            {/* <Button size={"sm"} type={"submit"} isLoading={addExamStatus === STATUS.FETCHING || updateExamStatus === STATUS.FETCHING} colorScheme='green'>{data?.id ? "Update" : "Add"}</Button> */}
            <Button size={"sm"} type={"submit"} colorScheme={themeColor}>
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
