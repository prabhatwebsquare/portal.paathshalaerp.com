import { LoadingContainer } from "@/common/LoadingContainer";
import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
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
import { find, findIndex, map } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const MarkDailyAttendance = ({
  getDailyAttendanceAction,
  data,
  date,
  sessionMasterId,
  themeColor,
  closeDrawer,
}) => {
  const router = useRouter();
  const [attendance, setAttendance] = useState([]);

  const inputHandler = (id, val) => {
    if (find(attendance, (a) => a.promotionId === id)) {
      setAttendance(
        map(attendance, (a) =>
          a.promotionId === id ? { promotionId: id, isPresent: val } : a
        )
      );
    } else {
      setAttendance((pre) => [...pre, { promotionId: id, isPresent: val }]);
    }
  };

  const {
    getFilterStudentsAction,
    getFilterStudentsStatus,
    filterStudents,
    resetFilterStdStatus,
    addDayAttendAction,
    addDayAttendStatus,
    resetDayAttendStatus,
    getDayAttendAction,
    getDayAttendStatus,
    dayAttendance,
  } = useStudentStore((s) => ({
    getFilterStudentsAction: s.getFilterStudentsAction,
    getFilterStudentsStatus: s.getFilterStudentsStatus,
    filterStudents: s.filterStudents,
    resetFilterStdStatus: s.resetFilterStdStatus,
    addDayAttendAction: s.addDayAttendAction,
    addDayAttendStatus: s.addDayAttendStatus,
    resetDayAttendStatus: s.resetDayAttendStatus,
    getDayAttendAction: s.getDayAttendAction,
    getDayAttendStatus: s.getDayAttendStatus,
    dayAttendance: s.dayAttendance,
  }));

  useEffect(() => {
    getFilterStudentsAction({
      sessionMasterId,
      classMasterId: data.classMasterId,
      streamMasterId: data.streamMasterId,
      sectionMasterId: data.sectionMasterId,
    });
    getDayAttendAction({
      sessionMasterId,
      classMasterId: data.classMasterId,
      streamMasterId: data.streamMasterId,
      sectionMasterId: data.sectionMasterId,
      date,
    });
  }, [
    data,
    date,
    getDayAttendAction,
    getFilterStudentsAction,
    sessionMasterId,
  ]);

  useEffect(() => {
    if (dayAttendance?.length) {
      setAttendance(
        map(dayAttendance, (da) => ({
          promotionId: da.promotionId,
          isPresent: da.isPresent,
        }))
      );
    }
  }, [dayAttendance]);

  const saveAttendance = () => {
    addDayAttendAction({
      sessionMasterId,
      date,
      attendanceData: attendance,
    });
  };

  useEffect(() => {
    if (addDayAttendStatus === STATUS.SUCCESS) {
      getDailyAttendanceAction({ sessionMasterId, date });
      resetDayAttendStatus();
      resetFilterStdStatus();
      closeDrawer();
    }
  }, [
    addDayAttendStatus,
    closeDrawer,
    date,
    getDailyAttendanceAction,
    resetDayAttendStatus,
    resetFilterStdStatus,
    sessionMasterId,
  ]);

  return (
    <Drawer size={"xl"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <Flex w={"90%"} align={"center"} justify={"space-between"}>
            <Flex align={"center"}>
              <Text fontSize={20} fontWeight={"semibold"}>
                {data.className}&nbsp; - &nbsp;{data.streamName}
              </Text>
            </Flex>
            <Text fontSize={14} fontWeight={"semibold"}>
              {date}
            </Text>
          </Flex>
        </DrawerHeader>
        <DrawerBody overflowY={"scroll"} className="scrollBar">
          <Box>
            <LoadingContainer
              status={getFilterStudentsStatus || getDayAttendStatus}
            >
              <Box
                p={5}
                bg="white"
                className="scrollBar"
                maxH={"73vh"}
                overflowY={"scroll"}
                borderRadius={5}
              >
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Roll No.</Th>
                      <Th>Student Name</Th>
                      <Th>Father Name</Th>
                      <Th>Present/Absent</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(filterStudents, (std, index) => {
                      const isChecked = find(
                        attendance,
                        (a) => a.promotionId === std.id
                      )?.isPresent;
                      const student = std?.student_master;
                      return (
                        <Tr key={index}>
                          <Td>{std.rollNo}</Td>
                          <Td fontWeight={"semibold"}>
                            <Flex align={"center"}>
                              <Avatar size={"xs"} />
                              <Text ml={2}>{student.studentName}</Text>
                            </Flex>
                          </Td>
                          <Td>{student.fatherName}</Td>
                          <Td>
                            <RadioGroup
                              onChange={(e) => inputHandler(std.id, e)}
                              value={isChecked}
                            >
                              <Stack direction="row" spacing={2}>
                                <Radio
                                  colorScheme="green"
                                  value="1"
                                  border={"1px solid green"}
                                >
                                  Present
                                </Radio>
                                <Radio
                                  colorScheme="red"
                                  value="0"
                                  border={"1px solid red"}
                                >
                                  Absent
                                </Radio>
                                <Radio
                              colorScheme="orange"
                              value="3"
                              border={"2px solid orange"}
                            >
                              Leave
                            </Radio>
                              </Stack>
                            </RadioGroup>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                {/* <Button size={"sm"} mt={5} colorScheme={themeColor} onClick={saveAttendance}>Save</Button> */}
              </Box>
            </LoadingContainer>
          </Box>
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
          <Button size={"sm"} colorScheme={themeColor} onClick={saveAttendance}>
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
