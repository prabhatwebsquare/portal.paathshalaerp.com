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
import ReactToPrint from "react-to-print";

export const AttendanceRegister = ({ themeColor, sessionMasterId }) => {
  const [inputValue, setInputValue] = useState({});
  const [filters, setFilters] = useState([]);

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  const {
    getSectionAction,
    getSectionStatus,
    allSections,
    getMonthlyAttendaceAction,
    monthlyAttendace,
    monthlyAttendaceStatus,
  } = useClassSetupStore((s) => ({
    getSectionAction: s.getSectionAction,
    getSectionStatus: s.getSectionStatus,
    allSections: s.allSections,
    getMonthlyAttendaceAction: s.getMonthlyAttendaceAction,
    monthlyAttendace: s.monthlyAttendace,
    monthlyAttendaceStatus: s.monthlyAttendaceStatus,
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

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);
  const getStudent = (e) => {
    e.preventDefault();
    setFilters(inputValue);
    const temp = {
      classMasterId: inputValue.classMasterId,
      streamMasterId: inputValue.streamMasterId,
      sectionMasterId: inputValue.sectionMasterId,
      sessionMasterId,
      month: inputValue.month,
    };
    getMonthlyAttendaceAction(temp);
  };

  const printRef = useRef(null);

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
            <ReactToPrint
              trigger={() => (
                <Button size="sm" colorScheme={themeColor}>
                  Print Attendance
                </Button>
              )}
              content={() => printRef.current}
            />
          </Flex>
        </Flex>
        <Attendance monthlyAttendance={monthlyAttendace} filters={filters} monthlyAttendanceStatus={monthlyAttendaceStatus} />
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
              monthlyAttendance={monthlyAttendace}
              filters={filters}
              monthlyAttendanceStatus={monthlyAttendaceStatus}
            />
          </Box>
        </Box>
        <style jsx global>{`


  @media print {

  
    @page {
      size: A4 landscape;
      margin: 1cm;
    }

    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

  table {
    table-layout: fixed !important;
    width: 100% !important;
    font-size: 7px !important;
  }

  th, td {
    padding: 2px !important;
    font-size: 7px !important;
    word-wrap: break-word !important;
  }
    .chakra-container, .chakra-box {
      overflow: visible !important;
    }

    .print-container {
      width: 100%;
      overflow: visible;
    }
  td:nth-child(3) { /* Student Name column */
    max-width: 70px !important;
    white-space: normal !important;
  }
    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
`}</style>



      </Box>
    </Box>
  );
};

const Attendance = ({ monthlyAttendance, monthlyAttendanceStatus }) => {
  const totalDays = 30;
  return (
    <LoadingContainer status={monthlyAttendanceStatus}>
      <Box overflowX="auto" className="print-container">
        <TableContainer>

          {monthlyAttendance?.students.length > 0 ?
            <Table
              mt={5}
              size="sm"
              style={{
                fontSize: "9px",
                tableLayout: "fixed",
                minWidth: "1500px", // Adjust depending on number of columns
              }}
            >
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
                        maxWidth: "80px",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
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
            :
            <NoData title={"No Attendance Found"} />
          }
        </TableContainer>
      </Box>
    </LoadingContainer>
  );
};

export default Attendance;
