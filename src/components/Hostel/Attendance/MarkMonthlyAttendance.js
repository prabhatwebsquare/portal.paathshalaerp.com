import CustomMultipleDatePicker from "@/common/CustomCalender";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useMobileAppStore } from "@/store/MobileApp";
import { useStudentStore } from "@/store/studentStore";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { filter, find, flatMap, map, split } from "lodash";
import { useEffect, useMemo, useState } from "react";

export const MarkMonthlyAttendance = ({
  data,
  getStudent,
  closeDrawer,
  inputValue,
  sessionMasterId,
}) => {
  const month = parseInt(dayjs(inputValue.date).format("MM"));
  const year = parseInt(dayjs(inputValue.date).format("YYYY"));
  const [selectedDates, setSelectedDates] = useState([]);


  const {
    getStdMonthAttAction,
    getStdMonthAttStatus,
    stdMonthAtt,
    addMonthlyAttendanceAction,
    addMonthlyAttendanceStatus,
    resetDayAttendStatus,
  } = useStudentStore((s) => ({
    getStdMonthAttAction: s.getStdMonthAttAction,
    getStdMonthAttStatus: s.getStdMonthAttStatus,
    stdMonthAtt: s.stdMonthAtt,
    addMonthlyAttendanceAction: s.addMonthlyAttendanceAction,
    addMonthlyAttendanceStatus: s.addMonthlyAttendanceStatus,
    resetDayAttendStatus: s.resetDayAttendStatus,
  }));


  const formatDate = (date) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    const dateString = date; // Use toString() for the exact format
    return dateString;
  };

  useEffect(() => {
    setSelectedDates(
      map(
        filter(stdMonthAtt?.date, (f) => f.status === 1),
        (d) => new Date(d.date)
      )
    );
  }, [stdMonthAtt?.date]);

  const { getHolidayAction, getHolidayStatus, allHolidays } = useMobileAppStore(
    (s) => ({
      getHolidayAction: s.getHolidayAction,
      getHolidayStatus: s.getHolidayStatus,
      allHolidays: s.allHolidays,
    })
  );

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

  useEffect(() => {
    if ((getHolidayStatus || 1) === STATUS.NOT_STARTED) {
      getHolidayAction({ sessionMasterId });
    }
  }, [getHolidayAction, getHolidayStatus, sessionMasterId]);

  useEffect(() => {
    getStdMonthAttAction({
      promotionId: data.id,
      sessionMasterId,
      month,
      year,
    });
  }, [data.id, getStdMonthAttAction, month, sessionMasterId, year]);

  const isSundayOrHoliday = (date) => {
    const day = dayjs(date).day();
    return day === 0 || holidays.includes(dayjs(date).format("YYYY-MM-DD"));
  };

  const startDate = dayjs(
    dayjs(new Date(year, month - 1)).format("YYYY-MM-DD")
  );
  const endOfMonth = startDate
    .add(1, "month")
    .startOf("month")
    .subtract(1, "day");
  const totalDays = endOfMonth.date();

  const submit = () => {
    const tempDates = map(selectedDates, (s) => dayjs(s).format("YYYY-MM-DD"));
    const totalPresent = [];

    for (let i = 0; i < totalDays; i++) {
      const currentDate = dayjs(`${year}-${month}-${i + 1}`).format(
        "YYYY-MM-DD"
      );
      if (isSundayOrHoliday(currentDate)) {
        continue;
      }
      const isPresent = tempDates.includes(currentDate) ? 1 : 0;
      totalPresent.push({
        date: currentDate,
        isPresent: isPresent,
      });
    }
    addMonthlyAttendanceAction({
      sessionMasterId,
      promotionId: data.id,
      attendanceData: totalPresent,
    });
  };

  useEffect(() => {
    if (addMonthlyAttendanceStatus === STATUS.SUCCESS) {
      resetDayAttendStatus();
      getStudent();
      closeDrawer();
    }
  }, [
    addMonthlyAttendanceStatus,
    closeDrawer,
    getStudent,
    resetDayAttendStatus,
  ]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{data?.student_master?.studentName}</DrawerHeader>
        <DrawerBody overflowY={"scroll"} className="scrollBar">
          <LoadingContainer status={getStdMonthAttStatus}>
            <CustomMultipleDatePicker
              holidays={holidays}
              month={month - 1}
              year={year}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
            />
          </LoadingContainer>
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
          <Button size={"sm"} colorScheme="green" onClick={submit}>
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
