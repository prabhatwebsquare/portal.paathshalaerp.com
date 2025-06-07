import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { PageHeader } from "@/common/PageHeader";
import { SendSms } from "@/common/SendSms";
import { STATUS } from "@/constant";
import { URL } from "@/services/apis";
import { useStaffStore } from "@/store/StaffStore";
import { useStudentStore } from "@/store/studentStore";
import { ArrowBackIcon } from "@chakra-ui/icons";
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
  Input,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { find, findIndex, map } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const DailyAttendance = ({ sessionMasterId, themeColor }) => {
  const router = useRouter();
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );

  const inputHandler = (id, val) => {
    if (find(attendance, (a) => a.staffId === id)) {
      setAttendance(
        map(attendance, (a) =>
          a.staffId === id ? { staffId: id, isPresent: val } : a
        )
      );
    } else {
      setAttendance((pre) => [...pre, { staffId: id, isPresent: val }]);
    }
  };

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

  const {
    getDayAttendAction,
    getDayAttendStatus,
    dayAttendance,
    addDayAttendAction,
    addDayAttendStatus,
    resetDayAttendStatus,
  } = useStaffStore((s) => ({
    getDayAttendAction: s.getDayAttendAction,
    getDayAttendStatus: s.getDayAttendStatus,
    dayAttendance: s.dayAttendance,
    addDayAttendAction: s.addDayAttendAction,
    addDayAttendStatus: s.addDayAttendStatus,
    resetDayAttendStatus: s.resetDayAttendStatus,
  }));

  useEffect(() => {
    getDayAttendAction({ sessionMasterId, date: selectedDate });
  }, [getDayAttendAction, selectedDate, sessionMasterId]);

  const saveAttendance = () => {
    addDayAttendAction({
      sessionMasterId,
      date: selectedDate,
      attendanceData: attendance,
    });
  };

  useEffect(() => {
    setAttendance(
      map(dayAttendance, (atten) => ({
        staffId: atten.id,
        isPresent:
          atten.staff_attendances[
            atten.staff_attendances?.length - 1
          ]?.isPresent.toString(),
      }))
    );
  }, [dayAttendance]);

  useEffect(() => {
    if (addDayAttendStatus === STATUS.SUCCESS) {
      getDayAttendAction({ sessionMasterId, date: selectedDate });
      resetDayAttendStatus();
    }
  }, [
    addDayAttendStatus,
    getDayAttendAction,
    resetDayAttendStatus,
    selectedDate,
    sessionMasterId,
  ]);

  return (
    <Box>
      <Box
        bg="white"
        className="scrollBar"
        maxH={"73vh"}
        overflowY={"scroll"}
        borderRadius={5}
      >
        <Flex justify={"space-between"} align={"center"}>
          <Input
            w="fit-content"
            size={"sm"}
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <SendSms />
        </Flex>
        <LoadingContainer status={getDayAttendStatus}>
          {allStaffs?.length ? (
            <Table mt={5}>
              <Thead>
                <Tr>
                  <Th>Device Id</Th>
                  <Th>Staff Name</Th>
                  <Th>Contact</Th>
                  <Th>Designation</Th>
                  <Th>Department</Th>
                  <Th>Gender</Th>
                  <Th>Present/Absent</Th>
                </Tr>
              </Thead>
              <Tbody>
                {map(allStaffs, (atten, index) => {
                  const isChecked = find(
                    attendance,
                    (a) => a.staffId === atten?.id
                  )?.isPresent;

                  return (
                    <Tr key={index}>
                      <Td>{atten?.employeeCode || atten?.id}</Td>
                      <Td fontWeight="semibold">
                        <Flex align="center">
                          <Avatar size="xs" src={`${URL}${atten.photo}`} />
                          <Text ml={2}>{atten?.name}</Text>
                        </Flex>
                      </Td>
                      <Td>{atten?.mobileNo}</Td>
                      <Td>{atten?.designation}</Td>
                      <Td>{atten?.department}</Td>
                      <Td>{atten?.gender}</Td>

                      <Td>
                        <RadioGroup
                          onChange={(e) => inputHandler(atten?.id, e)}
                          value={isChecked}
                        >
                          <Stack direction="row" spacing={2}>
                            <Radio
                              colorScheme="green"
                              value="1"
                              border="1px solid green"
                            >
                              P
                            </Radio>
                            <Radio
                              colorScheme="red"
                              value="0"
                              border="1px solid red"
                            >
                              A
                            </Radio>
                            <Radio
                              colorScheme="blue"
                              value="2"
                              border={"1px solid blue"}
                            >
                              H
                            </Radio>
                            <Radio
                              colorScheme="orange"
                              value="5"
                              border={"2px solid orange"}
                            >
                              L 
                            </Radio>
                          </Stack>
                        </RadioGroup>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          ) : (
            <NoData title="No Staff Found" />
          )}
          <Box mt={5} display={"flex"} justifyContent={"end"}>
            <Button
              mt={5}
              size={"sm"}
              width={"20%"}
              colorScheme={themeColor}
              onClick={saveAttendance}
            >
              Submit Attendance
            </Button>
          </Box>
        </LoadingContainer>
      </Box>
    </Box>
  );
};
