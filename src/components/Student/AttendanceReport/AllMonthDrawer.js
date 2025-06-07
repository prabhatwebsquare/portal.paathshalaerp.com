import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useExamStore } from "@/store/Exam";
import { useMobileAppStore } from "@/store/MobileApp";
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
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { flatMap, map } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export const AllMonthDrawer = ({
  data,
  closeDrawer,
  sessionMasterId,
  themeColor,
}) => {
  const [inputValue, setInputValue] = useState({});
  const sessionMaster = useMemo(() => getLocalStorageItem("sessionMaster"), []);

  const { getHolidayAction, getHolidayStatus, allHolidays } = useMobileAppStore(
    (s) => ({
      getHolidayAction: s.getHolidayAction,
      getHolidayStatus: s.getHolidayStatus,
      allHolidays: s.allHolidays,
    })
  );

  useEffect(() => {
    if ((getHolidayStatus || 1) === STATUS.NOT_STARTED) {
      getHolidayAction({ sessionMasterId });
    }
  }, [getHolidayAction, getHolidayStatus, sessionMasterId]);

  const getDatesRange = (sDate, eDate) => {
    const startDate = dayjs(sDate);
    const endDate = dayjs(eDate);
    const numberOfDays = endDate.diff(startDate, "day");
    const dateRange = [];
    for (let i = 0; i <= numberOfDays; i++) {
      dateRange.push(startDate.add(i, "day").format("YYYY-MM-DD"));
    }
    return dateRange;
  };

  const holidays = useMemo(() => {
    return flatMap(allHolidays, (h) => getDatesRange(h.startDate, h.endDate));
  }, [allHolidays]);

  return (
    <Drawer size={"xl"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{}</DrawerHeader>
        <DrawerBody>
          <VStack spacing={3}>
            <Flex flexWrap={"wrap"} gap={2}>
              {map(new Array(12), (a, i) => (
                <Flex w={"30%"}>
                  <UseDateSelection
                    month={i + 1}
                    year={"2024"}
                    selectedDates={[new Date(`2024-${i + 1}-03`)]}
                    holidays={holidays}
                  />
                </Flex>
              ))}
            </Flex>
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const UseDateSelection = ({ month, year, selectedDates, holidays }) => {
  const [selectableMonth, setSelectableMonth] = useState(month);
  const [selectableYear, setSelectableYear] = useState(year);

  useEffect(() => {
    if (selectedDates.length > 0) {
      const firstSelectedDate = selectedDates[0];
      setSelectableMonth(firstSelectedDate.getMonth());
      setSelectableYear(firstSelectedDate.getFullYear());
    }
  }, [selectedDates]);

  const isDateSelected = (date) => {
    return selectedDates.some(
      (selectedDate) =>
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isAbsent = (date) => {
    return selectedDates.some(
      (selectedDate) =>
        date.getDate() !== selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isHoliday = (date) => {
    const dateFormat = dayjs(date).format("YYYY-MM-DD");
    return holidays.includes(dateFormat);
  };

  return (
    <DatePicker
      selected={new Date(selectableYear, selectableMonth)}
      dateFormat="dd-MM-yyyy"
      inline
      renderDayContents={(day, date) => {
        const isSelected = isDateSelected(date);
        const isSelectable =
          date.getMonth() === selectableMonth &&
          date.getFullYear() === selectableYear;
        const isSunday = date.getDay() === 0;
        const isHolidayDate = isHoliday(date);
        const absent = isAbsent(date);

        let style = {};
        if (isSelected) {
          style.backgroundColor = "#48BB78";
          style.color = "#ffffff";
        } else if (!isSelectable) {
          style.backgroundColor = "#ECE9EB";
          style.pointerEvents = "none";
          style.color = "gray";
        } else if (absent) {
          style.backgroundColor = "red";
          style.color = "white";
        }
        if (isSunday) {
          style.color = "#FC73B8";
          style.backgroundColor = "white";
        }
        if (isHolidayDate) {
          style.border = "1px solid red";
          style.backgroundColor = "white";
          style.color = "black";
        }

        return (
          <Tooltip
            placement="top"
            label={isSunday ? "Sunday" : isHolidayDate ? "Holiday" : ""}
          >
            <div style={style}>{day}</div>
          </Tooltip>
        );
      }}
    />
  );
};
