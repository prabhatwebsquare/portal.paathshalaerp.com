import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { DownloadCSV } from "@/common/DownloadCSV";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { PageHeader } from "@/common/PageHeader";
import { SchoolHeader } from "@/common/SchoolHeader";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
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
import { filter, find, groupBy, map, uniqBy } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MdFileDownload } from "react-icons/md";
import { useReactToPrint } from "react-to-print";

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

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  const { getSectionAction, getSectionStatus, allSections } =
    useClassSetupStore((s) => ({
      getSectionAction: s.getSectionAction,
      getSectionStatus: s.getSectionStatus,
      allSections: s.allSections,
    }));

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
  } = useStudentStore((s) => ({
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
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
    if ((getSectionStatus || 1) === STATUS.NOT_STARTED) {
      getSectionAction();
    }
  }, [
    getClassSubjectAction,
    getClassSubjectStatus,
    getSectionAction,
    getSectionStatus,
  ]);

  useEffect(() => {
    return () => resetAttendanceReport();
  }, [resetAttendanceReport]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

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

  useEffect(() => {
    if (dayAttendance?.length) {
      const data = map(dayAttendance, (std) => {
        const atten = std?.attendances?.[0];
        const studentData = {
          "Roll No.": std.rollNo || "-",
          "Sr No.": std?.srNo,
          "Student Name": std?.student_master?.studentName,
          "Father Name": std?.student_master?.fatherName,
          "Father Name": std?.student_master?.fatherName,
          [`${inputValue?.date} Attendance`]:
            atten.isPresent === 1
              ? "PRESENT"
              : atten.isPresent === 0
              ? "ABSENT"
              : atten.isPresent === 2
              ? "HALF DAY"
              : "NOT MARKED",
          "In Time":
            std?.attendances?.length && atten.isPresent === 1
              ? dayjs(std?.attendances[0]?.date).format("hh:mm A")
              : "-",
          "Out Time":
            std?.attendances?.length > 1 && atten.isPresent === 1
              ? dayjs(
                  std?.attendances[std?.attendances?.length - 1]?.date
                ).format("hh:mm A")
              : "-",
        };
        return studentData;
      });
      setStudentData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayAttendance]);

  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <Box pos={"relative"} h={"70vh"}>
      <Box className="scrollBar" maxH={"70vh"} overflowY={"scroll"}>
        <Flex align={"center"} justify={"space-between"}>
          <form style={{ width: "80%" }} onSubmit={getStudent}>
            <Flex w={"100%"} pb={3} gap={4} mt={5}>
              <CustomSelect
                size={"sm"}
                name={"classMasterId"}
                label={"Select Class"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(classes, (d, key) => ({
                  value: key,
                  name: d?.[0]?.class_master?.name,
                }))}
              />
              <CustomSelect
                size={"sm"}
                name={"streamMasterId"}
                label={"Select Stream"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(
                  uniqBy(
                    classes?.[inputValue?.classMasterId],
                    "streamMasterId"
                  ),
                  (d, index) => ({
                    value: d.stream_master?.id,
                    name: d.stream_master.name,
                  })
                )}
              />
              <CustomSelect
                size={"sm"}
                name={"sectionMasterId"}
                label={"Select Section"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(allSections, (d) => ({ value: d.id, name: d.name }))}
              />
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
        <Flex mt={2} gap={5} justify={"flex-end"} align={"center"}>
          <Text fontSize={14} fontWeight={"semibold"} color={"blue.800"}>
            Total Student:&nbsp;{dayAttendance?.length}
          </Text>
          <Text fontSize={14} fontWeight={"semibold"} color={"green.400"}>
            Total Present:&nbsp;
            {
              filter(dayAttendance, (a) => a?.attendances?.[0].isPresent === 1)
                ?.length
            }
          </Text>
          <Text fontSize={14} fontWeight={"semibold"} color={"red.400"}>
            Total Absent:&nbsp;
            {
              filter(dayAttendance, (a) => a?.attendances?.[0].isPresent === 0)
                ?.length
            }
          </Text>
          <Text fontSize={14} fontWeight={"semibold"} color={"blue.400"}>
            Total Half Day:&nbsp;
            {
              filter(dayAttendance, (a) => a?.attendances?.[0].isPresent === 2)
                ?.length
            }
          </Text>
        </Flex>
      ) : null}
      {dayAttendance?.length ? (
        <Table mt={5}>
          <Thead>
            <Tr>
              <Th>Sr. No.</Th>
              <Th>Roll No</Th>
              <Th>Student Name</Th>
              <Th>Father Name</Th>
              <Th>Attendance</Th>
            </Tr>
          </Thead>
          <Tbody>
            {map(dayAttendance, (std) => {
              const atten = std?.attendances?.[0];
              return (
                <Tr>
                  <Td>{std?.srNo}</Td>
                  <Td>{std.rollNo}</Td>
                  <Td>{std.student_master.studentName}</Td>
                  <Td>{std.student_master.fatherName}</Td>
                  <Td>
                    <Flex gap={8}>
                      <Badge
                        h={"fit-content"}
                        variant={"outline"}
                        colorScheme={
                          atten.isPresent === 1
                            ? "green"
                            : atten.isPresent === 0
                            ? "red"
                            : atten.isPresent === 2
                            ? "blue"
                            : "yellow"
                        }
                      >
                        {atten.isPresent === 1
                          ? "PRESENT"
                          : atten.isPresent === 0
                          ? "ABSENT"
                          : atten.isPresent === 2
                          ? "HALF DAY"
                          : "NOT MARKED"}
                      </Badge>
                      <Flex>
                        {std?.attendances?.length > 0 &&
                        atten.isPresent === 1 ? (
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
                              {dayjs(
                                std?.attendances[0]?.attendance_logs[0]
                                  ?.createdAt || ""
                              ).format("hh:mm A")}
                            </Text>
                            <Text fontWeight="bold" mr={2}>
                              Out Time:
                            </Text>
                            <Text>
                              {std?.attendances?.length > 1
                                ? dayjs(
                                    std?.attendances[0]?.attendance_logs[
                                      std?.attendances[0]?.attendance_logs
                                        .length - 1
                                    ]?.createdAt || ""
                                  ).format("hh:mm A")
                                : "Not available"}
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
              <Th>Roll No</Th>
              <Th>Student Name</Th>
              <Th>Father Name</Th>
              <Th>Month Days.</Th>
              <Th>Working Days</Th>
              <Th>Holidays</Th>
              <Th>Present</Th>
              <Th>Absent</Th>
            </Tr>
          </Thead>

      
          <Tbody>
            {map(
              yearlyAttendance?.length ? yearlyAttendance : monthlyAttendance,
              (atten) => (
                <Tr>
                  <Td>{atten.srNo}</Td>
                  <Td>{atten.rollNo}</Td>
                  <Td>{atten.student_master.studentName}</Td>
                  <Td>{atten.student_master.fatherName}</Td>
                  <Td>{atten.alldays}</Td>
                  <Td>{atten.alldays - (atten.sundays + atten.holiday)}</Td>
                  <Td>{atten?.holiday}</Td>
                  <Td style={{ align: "center" }}>
                    <Flex
                      w="25px"
                      h={"25px"}
                      align={"center"}
                      justify={"center"}
                      color={"white"}
                      borderRadius={"50%"}
                      bg="green.500"
                    >
                      {atten.present}
                    </Flex>
                  </Td>
                  <Td style={{ align: "center" }}>
                    <Flex
                      w="25px"
                      h={"25px"}
                      align={"center"}
                      justify={"center"}
                      color={"white"}
                      borderRadius={"50%"}
                      bg="red.500"
                    >
                      {atten.absent}
                    </Flex>
                  </Td>
                  {/* <Td>{atten.present}</Td>
                                    <Td>{atten.absent}</Td> */}
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      ) : (
        // <Flex flexDir={"column"} align={"center"}>
        //     <Image h={"300"} src={"/assets/nodata.avif"} alt={"No Data"} />
        //     <Text fontWeight={"semibold"} fontSize={18}>No Attendance Found</Text>
        // </Flex>
        <NoData title={"No Attendance Found"} />
      )}
    </>
  );
};
