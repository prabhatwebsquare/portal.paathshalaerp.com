import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { DownloadCSV } from "@/common/DownloadCSV";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { PageHeader } from "@/common/PageHeader";
import { SchoolHeader } from "@/common/SchoolHeader";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import { useStaffStore } from "@/store/StaffStore";
import { useStudentStore } from "@/store/studentStore";
import {
  Badge,
  Box,
  Button,
  Flex,
  Image,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { filter, find, groupBy, map, uniqBy } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MdFileDownload } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
dayjs.extend(utc);
export const StudentAttendanceReport = ({ themeColor, sessionMasterId }) => {
  const [inputValue, setInputValue] = useState({});
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    if (inputValue?.type === "month-wise") {
      setInputValue((pre) => ({ ...pre, date: dayjs().format("YYYY-MM") }));
    } else if (inputValue?.type === "day-wise") {
      setInputValue((pre) => ({ ...pre, date: dayjs().format("YYYY-MM-DD") }));
    } else {
      setInputValue((pre) => ({ ...pre, date: dayjs().format("YYYY-MM-DD") }));
    }
  }, [inputValue?.type]);

  const {
    getDayAttendAction,
    getDayAttendStatus,
    dayAttendance,
    getMonthlyAttendanceAction,
    getMonthlyAttendanceStatus,
    monthlyAttendance,
    getYearlyAttendanceAction,
    getYearlyAttendanceStatus,
    yearlyAttendance,
    resetAttendanceReport,
  } = useStaffStore((s) => ({
    getDayAttendAction: s.getDayAttendAction,
    getDayAttendStatus: s.getDayAttendStatus,
    dayAttendance: s.dayAttendance,
    getMonthlyAttendanceAction: s.getMonthlyAttendanceAction,
    getMonthlyAttendanceStatus: s.getMonthlyAttendanceStatus,
    monthlyAttendance: s.monthlyAttendance,
    getYearlyAttendanceAction: s.getYearlyAttendanceAction,
    getYearlyAttendanceStatus: s.getYearlyAttendanceStatus,
    yearlyAttendance: s.yearlyAttendance,
    resetAttendanceReport: s.resetAttendanceReport,
  }));

  useEffect(() => {
    return () => resetAttendanceReport();
  }, [resetAttendanceReport]);

  const getStudent = (e) => {
    e.preventDefault();
    resetAttendanceReport();
    if (inputValue?.type === "year-wise") {
      getYearlyAttendanceAction({ sessionMasterId, ...inputValue });
    } else if (inputValue?.type === "month-wise") {
      getMonthlyAttendanceAction({ sessionMasterId, ...inputValue });
    } else {
      getDayAttendAction({ sessionMasterId, ...inputValue });
    }
  };

  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <Box pos={"relative"} h={"70vh"}>
      <Box className="scrollBar" maxH={"70vh"} overflowY={"scroll"}>
        <Flex align={"center"} justify={"space-between"}>
          <form style={{ width: "50%" }} onSubmit={getStudent}>
            <Flex w={"100%"} pb={3} gap={4} mt={5}>
              <CustomSelect
                size={"sm"}
                name={"type"}
                label={"Select Type"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[
                  { name: "Day Wise", value: "day-wise" },
                  { name: "Month Wise", value: "month-wise" },
                  { name: "Year Wise", value: "year-wise" },
                ]}
              />
              {inputValue?.type === "year-wise" ? null : (
                <CustomInput
                  size={"sm"}
                  type={inputValue?.type === "month-wise" ? "month" : "date"}
                  name="date"
                  label={"Date"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
              )}
              <Button
                size={"sm"}
                w={"20%"}
                type="submit"
                colorScheme={themeColor}
                isLoading={
                  getDayAttendStatus === STATUS.FETCHING ||
                  getMonthlyAttendanceStatus === STATUS.FETCHING ||
                  getYearlyAttendanceStatus === STATUS.FETCHING
                }
              >
                Get
              </Button>
            </Flex>
          </form>
          <Flex gap={3}>
            <Button
              size={"sm"}
              colorScheme={themeColor}
              isDisabled={
                dayAttendance?.length ||
                monthlyAttendance?.length ||
                yearlyAttendance?.length
                  ? false
                  : true
              }
              onClick={handlePrint}
            >
              Print
            </Button>
            {dayAttendance?.length ? (
              <DownloadCSV
                disabled={getDayAttendStatus !== STATUS.SUCCESS}
                data={studentData}
                name={`${inputValue?.date} Attendance Report`}
                button={
                  <Flex align={"center"}>
                    <MdFileDownload /> <Text ml={1}>Excel</Text>
                  </Flex>
                }
              />
            ) : null}
          </Flex>
        </Flex>
        <LoadingContainer
          status={
            getDayAttendStatus ||
            getMonthlyAttendanceStatus ||
            getYearlyAttendanceStatus
          }
        >
          <Attendance
            dayAttendance={dayAttendance}
            monthlyAttendance={monthlyAttendance}
            yearlyAttendance={yearlyAttendance}
          />
          <Box display={"none"}>
            <Box ref={printRef} p={3}>
              <SchoolHeader
                title={"Attendance Report"}
                extra={
                  <>
                    <Text>
                      {inputValue?.type === "day-wise"
                        ? "Day Wise"
                        : inputValue?.type === "month-wise"
                        ? "Month Wise"
                        : "Year Wise"}
                    </Text>
                    {inputValue?.type === "year-wise" ? null : (
                      <Text>
                        Date:&nbsp;
                        {inputValue?.type === "day-wise"
                          ? dayjs(inputValue?.date).format("DD-MM-YYYY")
                          : dayjs(inputValue?.date).format("MMMM YYYY")}
                      </Text>
                    )}
                  </>
                }
              />
              <Attendance
                dayAttendance={dayAttendance}
                monthlyAttendance={monthlyAttendance}
                yearlyAttendance={yearlyAttendance}
              />
            </Box>
          </Box>
        </LoadingContainer>
      </Box>
    </Box>
  );
};

const Attendance = ({ dayAttendance, monthlyAttendance, yearlyAttendance }) => {
  return (
    <>
  {dayAttendance?.length ? (
  <Flex mt={2} gap={5} justify="flex-end" align="center">
    <Text fontSize={14} fontWeight="semibold" color="blue.800">
      Total Staff:&nbsp;{dayAttendance.length}
    </Text>
    <Text fontSize={14} fontWeight="semibold" color="green.400">
      Total Present:&nbsp;
      {
        filter(dayAttendance, (staff) => staff?.staff_attendances?.[0]?.isPresent === 1)
          .length
      }
    </Text>
    <Text fontSize={14} fontWeight="semibold" color="red.400">
      Total Absent:&nbsp;
      {
        filter(dayAttendance, (staff) => staff?.staff_attendances?.[0]?.isPresent === 0)
          .length
      }
    </Text>
    <Text fontSize={14} fontWeight="semibold" color="blue.400">
      Total Half Day:&nbsp;
      {
        filter(dayAttendance, (staff) => staff?.staff_attendances?.[0]?.isPresent === 2)
          .length
      }
    </Text>
  </Flex>
) : null}

      {dayAttendance?.length ? (
        <Table mt={5}>
          <Thead>
            <Tr>
              <Th>Sr. No.</Th>
              <Th>Employee Code</Th>
              <Th>Staff Name</Th>
              <Th>Designation</Th>
              <Th>Attendance</Th>
            </Tr>
          </Thead>
          <Tbody>
            {map(dayAttendance, (staff, index) => {
              const atten = staff?.staff_attendances?.[0];
              return (
                <Tr key={staff.id}>
                  <Td>{index + 1}</Td>
                  <Td>{staff.employeeCode || "N/A"}</Td>
                  <Td>{staff.name}</Td>
                  <Td>{staff.designation}</Td>
                  <Td>
                    <Flex gap={8}>
                      <Badge
                        h={"fit-content"}
                        variant={"outline"}
                        colorScheme={
                          atten?.isPresent === 1
                            ? "green"
                            : atten?.isPresent === 0
                            ? "red"
                            : atten?.isPresent === 2
                            ? "blue"
                            : "yellow"
                        }
                      >
                        {atten?.isPresent === 1
                          ? "PRESENT"
                          : atten?.isPresent === 0
                          ? "ABSENT"
                          : atten?.isPresent === 2
                          ? "HALF DAY"
                       : "NOT MARKED"}

 
                      </Badge>
                      <Flex>
                        {atten?.isPresent === 1 ? (
                          <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            fontSize="14px"
                            color="blue.800"
                          >
                            <Text fontWeight="bold" mr={2}>
                              In Time:
                            </Text>
                            <Text mr={4}>
                              {dayjs(atten?.date).utc().format("hh:mm A")}
                            </Text>
                          </Box>
                        ) : (
                          <Text>No attendance record available</Text>
                        )}
                      </Flex>
                    </Flex>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      ) : monthlyAttendance?.length || yearlyAttendance?.length ? (
        <Table mt={5}>
        <Thead>
          <Tr>
            <Th>Sr. No.</Th>
            <Th>Staff Name</Th>
            <Th>Email</Th>
            <Th>Mobile No</Th>
            <Th>Gender</Th>
            <Th>Department</Th>
            <Th>Designation</Th>
            <Th>All Days</Th>
            <Th>Working Days</Th>
            <Th>Present</Th>
            <Th>Absent</Th>
            <Th>Half Day</Th>
            <Th>Leave</Th>
            <Th>Holiday</Th>
            <Th>Sundays</Th>
          </Tr>
        </Thead>
        <Tbody>
          {map(yearlyAttendance?.length ? yearlyAttendance : monthlyAttendance, (staff, index) => (
            <Tr key={staff.id}>
              <Td>{index + 1}</Td>
              <Td>{staff.name}</Td>
              <Td>{staff.email}</Td>
              <Td>{staff.mobileNo}</Td>
              <Td>{staff.gender}</Td>
              <Td>{staff.department}</Td>
              <Td>{staff.designation}</Td>
              <Td>{staff.alldays}</Td>
              <Td>{staff.alldays - (staff.sundays + staff.holiday)}</Td>
              <Td>
                <Flex
                  w="25px"
                  h="25px"
                  align="center"
                  justify="center"
                  color="white"
                  borderRadius="50%"
                  bg="green.500"
                >
                  {staff.present}
                </Flex>
              </Td>
              <Td>
                <Flex
                  w="25px"
                  h="25px"
                  align="center"
                  justify="center"
                  color="white"
                  borderRadius="50%"
                  bg="red.500"
                >
                  {staff.absent}
                </Flex>
              </Td>
              <Td>{staff.halfday}</Td>
              <Td>{staff.leave}</Td>
              <Td>{staff.holiday}</Td>
              <Td>{staff.sundays}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      
      ) : (
        <NoData title={"No Attendance Found"} />
      )}
    </>
  );
};
