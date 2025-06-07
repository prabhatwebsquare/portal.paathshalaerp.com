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
import { filter, find, groupBy, map, uniqBy } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MdFileDownload } from "react-icons/md";
import { useReactToPrint } from "react-to-print";

export const AttendanceRegister = ({ themeColor, sessionMasterId }) => {
  const [inputValue, setInputValue] = useState({});
  const [filters, setFilters] = useState([]);


  const {
    getMonthlyAttendanceAction,
    monthlyAttendance,
    getMonthlyAttendanceStatus,
  } = useStaffStore((s) => ({
    getMonthlyAttendanceStatus: s.getMonthlyAttendanceStatus,
    monthlyAttendance: s.monthlyAttendance,
    getMonthlyAttendanceAction: s.getMonthlyAttendanceAction,
  }));


  const getStudent = (e) => {
    e.preventDefault();
    setFilters(inputValue);
    const temp = {
      classMasterId: inputValue.classMasterId,
      streamMasterId: inputValue.streamMasterId,
      sectionMasterId: inputValue.sectionMasterId,
      sessionMasterId,
      month: inputValue.month,
      // classMasterId: 1,
      // streamMasterId: 1,
      // sectionMasterId: 1,
      // sessionMasterId: 2,
      // month: "2024-09",
    };
    getMonthlyAttendanceAction(temp);
  };

  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    // onAfterPrint: () => setAllPrintProps(null),
    // onPrintError: () => setAllPrintProps(null),
    pageStyle: `
        @page {
            size: landscape;
          }
        `,
  });

  return (
    <Box pos={"relative"} h={"70vh"}>
      <Box className="scrollBar" maxH={"70vh"} overflowY={"scroll"}>
        <Flex align={"center"} justify={"space-between"}>
          <form style={{ width: "80%" }} onSubmit={getStudent}>
            <Flex w={"100%"} pb={3} gap={4} mt={5}>

              <CustomInput
                size={"sm"}
                type={"month"}
                name="month"
                label={"Date"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <Button size={"sm"} type="submit" colorScheme={themeColor}>
                Get
              </Button>
            </Flex>
          </form>
          <Flex gap={3}>
            <Button size={"sm"} colorScheme={themeColor} onClick={handlePrint}>
              Print
            </Button>
          </Flex>
        </Flex>
        <Attendance monthlyAttendance={monthlyAttendance} filters={filters} />
        <Box display={"none"}>
          <Box ref={printRef} p={3}>
            <SchoolHeader
              title={"Attendance Report"}
              extra={
                <>
                  <Text>
                    Month :&nbsp;{dayjs(filters?.month).format("MMMM YYYY")}
                  </Text>
                </>
              }
            />
            <Attendance
              monthlyAttendance={monthlyAttendance}
              filters={filters}
            />
          </Box>
        </Box>
        {/* </LoadingContainer> */}
      </Box>
    </Box>
  );
};

const Attendance = ({ monthlyAttendance }) => {
  const totalDays = 30; // Fixed to 30 days as per your requirement

  return (
    <TableContainer>
      <Table mt={5} size="sm" style={{ fontSize: "10px" }}>
        <Thead>
          <Tr>
            <Th
              style={{
                paddingTop: "4px",
                paddingBottom: "4px",
                fontSize: "9px",
              }}
            >
              Sr. No.
            </Th>
            <Th
              style={{
                paddingTop: "4px",
                paddingBottom: "4px",
                fontSize: "9px",
              }}
            >
              Roll No
            </Th>
            <Th
              style={{
                paddingTop: "4px",
                paddingBottom: "4px",
                fontSize: "9px",
              }}
            >
              Student Name
            </Th>
            {monthlyAttendance?.dates?.map((date, i) => (
              <Th
                key={i}
                style={{
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  fontSize: "9px",
                }}
              >
                {dayjs(date).format("DD MMM")} {/* Format to "01 Sep" */}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {monthlyAttendance?.students?.map((student, index) => (
            <Tr key={student.id}>
              <Td
                style={{
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  fontSize: "9px",
                }}
              >
                {index + 1}
              </Td>
              <Td
                style={{
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  fontSize: "9px",
                }}
              >
                {student.rollNo || "N/A"}
              </Td>
              <Td
                style={{
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  fontSize: "9px",
                }}
              >
                {student.name}
              </Td>
              {map(new Array(totalDays), (day, i) => {
                let attendanceStatus;
                let circleColor;
                if (student.attendance[i] !== undefined) {
                  switch (student.attendance[i]) {
                    case 0:
                      attendanceStatus = "A"; // Absent
                      circleColor = "#ff7777"; // Red background circle for Absent
                      break;
                    case 1:
                      attendanceStatus = "P"; // Present
                      circleColor = "#b8ff96"; // Green background circle for Present
                      break;
                    case 2:
                      attendanceStatus = "H"; // Half Day
                      circleColor = "#ffbb77"; // Orange background circle for Half Day
                      break;
                    case 3:
                      attendanceStatus = "H"; // Holiday
                      circleColor = "#b6b6b6"; // Gray background circle for Holiday
                      break;
                    case 4:
                      attendanceStatus = "N"; // Not marked
                      circleColor = "#fdfbbb"; // Yellow background circle for Not Marked
                      break;
                    case 5:
                      attendanceStatus = "L"; // Leave
                      circleColor = "#ffbb77"; // Orange background circle for Leave
                      break;
                    default:
                      attendanceStatus = "-";
                      circleColor = "transparent"; // Default transparent circle
                      break;
                  }
                } else {
                  attendanceStatus = "-";
                  circleColor = "transparent"; // Default transparent circle
                }

                return (
                  <Td
                    key={i}
                    style={{
                      paddingTop: "4px",
                      paddingBottom: "4px",
                      fontSize: "9px",
                      textAlign: "center", // Center the content
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        width: "22px",  // reduced from 30px
                        height: "22px", // reduced from 30px
                        borderRadius: "50%",
                        backgroundColor: circleColor,
                        position: "relative",
                        margin: "0 auto",
                      }}
                    >
                      <div
                        style={{
                          width: "14px", // reduced from 18px
                          height: "14px",
                          borderRadius: "50%",
                          backgroundColor: "white",
                          color: "black",
                          fontSize: "8px", // reduced font
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        {attendanceStatus}
                      </div>
                    </div>
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default Attendance;
