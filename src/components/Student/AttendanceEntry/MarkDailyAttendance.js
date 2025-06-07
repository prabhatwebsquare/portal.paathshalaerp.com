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
  IconButton,
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
import { filter, find, findIndex, map } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiMarkupLine } from "react-icons/ri";
import { TfiMarkerAlt } from "react-icons/tfi";
import { MarkAllModal } from "./MarkAllModal";
export const MarkDailyAttendance = ({
  getDailyAttendanceAction,
  data,
  date,
  sessionMasterId,
  themeColor,
  closeDrawer,
}) => {
  const [attendance, setAttendance] = useState([]);
  const [toggleAttendance, setToggleAttendance] = useState(null);

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
          promotionId: da.id,
          isPresent: da?.attendances?.[0].isPresent.toString(),
        }))
      );
    }
  }, [dayAttendance]);

  const confirmMark = (type) => {
    if (type === "present") {
      setToggleAttendance(null);
      setAttendance(
        map(filterStudents, (std) => ({ promotionId: std.id, isPresent: "1" }))
      );
    }
    if (type === "absent") {
      setToggleAttendance(null);
      setAttendance(
        map(filterStudents, (std) => ({ promotionId: std.id, isPresent: "0" }))
      );
    }
    if (type === "remaining") {
      setToggleAttendance(null);
      setAttendance(
        map(filterStudents, (std) =>
          find(attendance, (a) => a.promotionId === std.id)
            ? { promotionId: std.id, isPresent: "1" }
            : { promotionId: std.id, isPresent: "0" }
        )
      );
    }
  };

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
              <Flex gap={5} justify={"flex-end"} align={"center"}>
                <Text fontSize={14} fontWeight={"semibold"} color={"blue.800"}>
                  Total Student:&nbsp;{filterStudents?.length}
                </Text>
                <Text fontSize={14} fontWeight={"semibold"} color={"green.400"}>
                  Total Present:&nbsp;
                  {filter(attendance, (a) => a.isPresent === "1")?.length}
                </Text>
                <Text fontSize={14} fontWeight={"semibold"} color={"red.400"}>
                  Total Absent:&nbsp;
                  {filter(attendance, (a) => a.isPresent === "0")?.length}
                </Text>
                <Text fontSize={14} fontWeight={"semibold"} color={"blue.400"}>
                  Total Half Day:&nbsp;
                  {filter(attendance, (a) => a.isPresent === "2")?.length}
                </Text>
              </Flex>
              <Box
                p={5}
                bg="white"
                className="scrollBar"
                maxH={"70vh"}
                overflowY={"scroll"}
                borderRadius={5}
              >
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Roll No.</Th>
                      <Th>Sr No.</Th>
                      <Th>Student Name</Th>
                      <Th>Father Name</Th>
                      <Th>
                        <Flex align={"center"} justify={"space-between"}>
                          <Text>Present/Absent</Text>
                          <Tooltip label={"Mark All"} placement="top">
                            <IconButton
                              size={"xs"}
                              icon={<TfiMarkerAlt fontSize={20} />}
                              colorScheme={"white"}
                              variant={"ghost"}
                              onClick={() => setToggleAttendance([])}
                            />
                          </Tooltip>
                        </Flex>
                      </Th>
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
                          <Td>{std.srNo}</Td>
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
                                  colorScheme="red"
                                  value="0"
                                  border={"1px solid red"}
                                >
                                  A
                                </Radio>
                                <Radio
                                  colorScheme="green"
                                  value="1"
                                  border={"1px solid green"}
                                >
                                  P
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
                {/* <Button size={"sm"} mt={5} colorScheme={themeColor} onClick={saveAttendance}>Save</Button> */}
              </Box>
            </LoadingContainer>
            {toggleAttendance && (
              <MarkAllModal
                data={toggleAttendance}
                closeModal={() => setToggleAttendance(null)}
                themeColor={themeColor}
                confirmMark={confirmMark}
              />
            )}
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
