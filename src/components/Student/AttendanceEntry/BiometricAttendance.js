import CustomMultipleDatePicker from "@/common/CustomCalender";
import CustomInput from "@/common/CustomInput";
import {
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { groupBy, map, uniqBy } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BsPersonFillCheck } from "react-icons/bs";
import { MarkMonthlyAttendance } from "./MarkMonthlyAttendance";
import { BiometricLogs } from "./BiometricLogs";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import { useStudentStore } from "@/store/studentStore";
import { NoData } from "@/common/NoData";
import { LoadingContainer } from "@/common/LoadingContainer";
import { DownloadCSV } from "@/common/DownloadCSV";
import { MdFileDownload } from "react-icons/md";
import { CustomSelect } from "@/common/CustomSelect";

export const BiometricAttendance = ({ sessionMasterId, themeColor }) => {
  const router = useRouter();
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [toggleLogs, setToggleLogs] = useState(null);
  const [studentList, setStudentList] = useState(false);
  const [inputValue, setInputValue] = useState({
    fromDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });
  const [datesRange, setDatesRange] = useState(false);
  const [studentData, setStudentData] = useState([]);

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

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
    getBioAttendanceAction,
    getBioAttendanceStatus,
    bioAttendance,
    resetBioAttendanceStatus,
  } = useStudentStore((s) => ({
    getBioAttendanceAction: s.getBioAttendanceAction,
    getBioAttendanceStatus: s.getBioAttendanceStatus,
    bioAttendance: s.bioAttendance,
    resetBioAttendanceStatus: s.resetBioAttendanceStatus,
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
    getSectionStatus,
    getSectionAction,
  ]);

  useEffect(() => {
    return () => resetBioAttendanceStatus();
  }, [resetBioAttendanceStatus]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const getDatesRange = () => {
    const startDate = dayjs(inputValue?.fromDate);
    const endDate = dayjs(inputValue?.endDate);
    const numberOfDays = endDate.diff(startDate, "day");
    const dateRange = [];
    for (let i = 0; i <= numberOfDays; i++) {
      dateRange.push(startDate.add(i, "day").format("YYYY-MM-DD"));
    }
    return dateRange;
  };

  const getAttendanceData = (e) => {
    e.preventDefault();
    setDatesRange(getDatesRange());
    getBioAttendanceAction({
      sessionMasterId,
      ...inputValue,
    });
  };

  useEffect(() => {
    if (bioAttendance?.length) {
      const data = map(bioAttendance, (bio) => {
        const dateWise = groupBy(
          map(bio?.attendances, (b) => ({
            ...b,
            cDate: dayjs(b.date).format("YYYY-MM-DD"),
          })),
          "cDate"
        );
        const studentData = {
          "Roll No.": bio.rollNo || "-",
          "Sr No.": bio?.srNo,
          "Student Name": bio?.student_master?.studentName,
          "Father Name": bio?.student_master?.fatherName,
        };

        map(datesRange, (d) => {
          const data = dateWise[d];
          const date = dayjs(d).format("DD-MM-YYYY");
          studentData[`${date} `] = data?.length ? "PRESENT" : "ABSENT";
          studentData[`${date} In`] = data?.length
            ? dayjs(data[0]?.date).format("hh:mm A")
            : "-";
          studentData[`${date} Out`] = data?.length
            ? dayjs(data[data?.length - 1]?.date).format("hh:mm A")
            : "-";
        });

        return studentData;
      });
      setStudentData(data);
    }
  }, [bioAttendance, datesRange]);

  return (
    <Box>
      <Box>
        <Text
          fontSize="lg"
          fontWeight="bold"
          color={`${themeColor}.500`}
          textAlign="start"
          marginBottom={4}
        >
          Fetch Your Data from Device.
        </Text>
      </Box>
      <Flex w={"100%"} justify={"space-between"}>
        <form style={{ width: "85%" }} onSubmit={getAttendanceData}>
          <Flex gap={3}>
            <CustomInput
              size={"sm"}
              w={"20%"}
              type={"date"}
              name="fromDate"
              label={"StartDate"}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
            <CustomInput
              size={"sm"}
              w={"20%"}
              type={"date"}
              name="endDate"
              label={"EndDate"}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
            {/* <CustomSelect
              size={"sm"}
              w={"20%"}
              name={"classMasterId"}
              label={"Select Class"}
              inputValue={inputValue}
              setInputValue={setInputValue}
              data={map(classes, (d, key) => ({
                value: key,
                name: d?.[0]?.class_master?.name,
              }))}
            /> */}
            {/* <CustomSelect
              size={"sm"}
              w={"20%"}
              name={"streamMasterId"}
              label={"Select Stream"}
              inputValue={inputValue}
              setInputValue={setInputValue}
              data={map(
                uniqBy(classes?.[inputValue?.classMasterId], "streamMasterId"),
                (d, index) => ({
                  value: d.stream_master?.id,
                  name: d.stream_master.name,
                })
              )}
            /> */}
            {/* <CustomSelect
              size={"sm"}
              w={"20%"}
              name={"sectionMasterId"}
              label={"Select Section"}
              inputValue={inputValue}
              setInputValue={setInputValue}
              data={map(allSections, (d) => ({ value: d.id, name: d.name }))}
            /> */}
            <Button size={"sm"} colorScheme={themeColor} type={"submit"}>
              Get
            </Button>
          </Flex>
        </form>
        <DownloadCSV
          disabled={getBioAttendanceStatus !== STATUS.SUCCESS}
          data={studentData}
          name={`${inputValue?.fromDate} - ${inputValue?.endDate} Biometric Attendance`}
          button={
            <Flex align={"center"}>
              <MdFileDownload /> <Text ml={1}>Excel</Text>
            </Flex>
          }
        />
      </Flex>

      <LoadingContainer status={getBioAttendanceStatus}>
        {bioAttendance?.length ? (
          <TableContainer>
            <Table mt={5}>
              <Thead>
                <Tr>
                  <Th>Roll No</Th>
                  <Th>Sr No</Th>
                  <Th>Student Name</Th>
                  <Th>Father Name</Th>
                  {map(datesRange, (d) => (
                    <>
                      <Th>{dayjs(d).format("DD-MM-YYYY")}</Th>
                      <Th>Attendance Entry</Th>
                    </>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {map(bioAttendance, (bio) => {
                  const dateWise = groupBy(
                    map(bio?.attendances, (b) => ({
                      ...b,
                      cDate: dayjs(b.date).format("YYYY-MM-DD"),
                    })),
                    "cDate"
                  );
                  return (
                    <Tr>
                      <Td>{bio.rollNo}</Td>
                      <Td>{bio?.student_master?.srNo}</Td>
                      <Td>{bio?.student_master?.studentName}</Td>
                      <Td>{bio?.student_master?.fatherName}</Td>
                      {map(datesRange, (d) => {
                        const data = dateWise[d];
                        const atten = data?.[0];
                        return (
                          <>
                            <Td
                              cursor={"pointer"}
                              onClick={() => setToggleLogs(data)}
                            >
                              <Badge
                                variant="outline"
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
                            </Td>
                            <Td>Mannul / Biomatric</Td>
                          </>
                        );
                      })}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <NoData title={"No Student Found"} />
        )}
      </LoadingContainer>
      {toggleDrawer && (
        <MarkMonthlyAttendance
          data={toggleDrawer}
          inputValue={inputValue}
          closeDrawer={() => setToggleDrawer(null)}
        />
      )}
      {toggleLogs && (
        <BiometricLogs
          data={toggleLogs}
          closeModal={() => setToggleLogs(null)}
        />
      )}
    </Box>
  );
};
