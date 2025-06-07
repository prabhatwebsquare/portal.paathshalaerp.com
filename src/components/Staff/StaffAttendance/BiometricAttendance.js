import CustomInput from "@/common/CustomInput";
import {
  Badge,
  Box,
  Button,
  Flex,
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
import { groupBy, map } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { BiometricLogs } from "./BiometricLogs";
import { STATUS } from "@/constant";
import { useStudentStore } from "@/store/studentStore";
import { NoData } from "@/common/NoData";
import { LoadingContainer } from "@/common/LoadingContainer";
import { DownloadCSV } from "@/common/DownloadCSV";
import { MdFileDownload } from "react-icons/md";
import { MarkMonthlyAttendance } from "./MarkMonthlyAttendance";

export const BiometricAttendance = ({ sessionMasterId, themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [toggleLogs, setToggleLogs] = useState(null);
  const [inputValue, setInputValue] = useState({
    fromDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });
  const [datesRange, setDatesRange] = useState(false);
  const [staffData, setStaffData] = useState([]);
  const {
    getBioStaffAttendanceAction,
    getBioStaffAttendanceStatus,
    bioStaffAttendance,
    resetBioStaffAttendanceStatus,
  } = useStudentStore((s) => ({
    getBioStaffAttendanceAction: s.getBioStaffAttendanceAction,
    getBioStaffAttendanceStatus: s.getBioStaffAttendanceStatus,
    bioStaffAttendance: s.bioStaffAttendance,
    resetBioStaffAttendanceStatus: s.resetBioStaffAttendanceStatus,
  }));

  useEffect(() => {
    return () => resetBioStaffAttendanceStatus();
  }, [resetBioStaffAttendanceStatus]);

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
    getBioStaffAttendanceAction({
      sessionMasterId,
      ...inputValue,
    });
  };

  useEffect(() => {
    if (bioStaffAttendance?.length) {
      const data = map(bioStaffAttendance, (staff) => {
        const dateWise = groupBy(
          map(staff?.staff_attendances, (b) => ({
            ...b,
            cDate: dayjs(b.date).format("YYYY-MM-DD"),
          })),
          "cDate"
        );
        const staffRecord = {
          "Employee Code": staff.employeeCode || "-",
          Name: staff.name,
          Designation: staff.designation || "-",
        };

        map(datesRange, (d) => {
          const data = dateWise[d];
          const date = dayjs(d).format("DD-MM-YYYY");
          staffRecord[`${date}`] = data?.length ? "PRESENT" : "ABSENT";
          staffRecord[`${date} In`] = data?.length
            ? dayjs(data[0]?.date).format("hh:mm A")
            : "-";
          staffRecord[`${date} Out`] = data?.length
            ? data.length > 1
              ? dayjs(data[data.length - 1]?.date).format("hh:mm A")
              : "-"
            : "-";
        });

        return staffRecord;
      });
      setStaffData(data);
    }
  }, [bioStaffAttendance, datesRange]);

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
          Fetch Staff Biometric Attendance
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
              label={"Start Date"}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
            <CustomInput
              size={"sm"}
              w={"20%"}
              type={"date"}
              name="endDate"
              label={"End Date"}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
            <Button size={"sm"} colorScheme={themeColor} type={"submit"}>
              Get
            </Button>
          </Flex>
        </form>
        <DownloadCSV
          disabled={getBioStaffAttendanceStatus !== STATUS.SUCCESS}
          data={staffData}
          name={`${inputValue?.fromDate} - ${inputValue?.endDate} Staff Biometric Attendance`}
          button={
            <Flex align={"center"}>
              <MdFileDownload /> <Text ml={1}>Excel</Text>
            </Flex>
          }
        />
      </Flex>

      <LoadingContainer status={getBioStaffAttendanceStatus}>
        {bioStaffAttendance?.length ? (
          <TableContainer>
            <Table mt={5}>
              <Thead>
                <Tr>
                  <Th>Employee Code</Th>
                  <Th>Name</Th>
                  <Th>Designation</Th>
                  {map(datesRange, (d) => (
                    <>
                      <Th>{dayjs(d).format("DD-MM-YYYY")}</Th>
                      <Th>Attendance Entry</Th>
                    </>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {map(bioStaffAttendance, (staff) => {
                  const dateWise = groupBy(
                    map(staff?.staff_attendances, (b) => ({
                      ...b,
                      cDate: dayjs(b.date).format("YYYY-MM-DD"),
                    })),
                    "cDate"
                  );
                  return (
                    <Tr key={staff.id}>
                      <Td>{staff.employeeCode || "-"}</Td>
                      <Td>{staff.name}</Td>
                      <Td>{staff.designation || "-"}</Td>
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
                            <Td>{data?.length ? "Biometric" : "Manual"}</Td>
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
          <NoData title={"No Staff Found"} />
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