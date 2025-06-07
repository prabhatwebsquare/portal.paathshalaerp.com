import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { format } from "date-fns";
import { groupBy, map } from "lodash";
import { useStudentStore } from "@/store/studentStore";
import { useRouter } from "next/router";
import { BsPersonFillCheck } from "react-icons/bs";
import { MarkDailyAttendance } from "./MarkDailyAttendance";
import { LoadingContainer } from "@/common/LoadingContainer";
import { SendSms } from "@/common/SendSms";
import { useSmsStore } from "@/store/SmsStore";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import ReactToPrint from "react-to-print";


export const PrintableAttendanceTable = forwardRef(({ dailyAttendance, selectedDate }, ref) => {
  const totals = {
    totalStudent: 0,
    totalpresent: 0,
    totalAbsent: 0,
    totalHalfDay: 0,
    totalLeave: 0,
  };

  dailyAttendance?.forEach((item) => {
    totals.totalStudent += item.totalStudent || 0;
    totals.totalpresent += item.totalpresent || 0;
    totals.totalAbsent += item.totalAbsent || 0;
    totals.totalHalfDay += item.totalHalfDay || 0;
    totals.totalLeave += item.totalLeave || 0;
  });

  return (
    <div ref={ref} style={{ padding: "40px", fontFamily: "'Segoe UI', sans-serif", color: "#333" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ margin: 0, fontSize: "28px", color: "#2c3e50" }}>
          📘 Daily Attendance Report
        </h1>
        <p style={{ fontSize: "16px", marginTop: "8px" }}>Date: {selectedDate}</p>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }} border="1">
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th style={headerStyle}>Class</th>
            <th style={headerStyle}>Stream</th>
            <th style={headerStyle}>Section</th>
            <th style={headerStyle}>Total Students</th>
            <th style={headerStyle}>Present</th>
            <th style={headerStyle}>Absent</th>
            <th style={headerStyle}>Half Day</th>
            <th style={headerStyle}>Leave</th>
          </tr>
        </thead>
        <tbody>
          {dailyAttendance?.map((sub, index) => (
            <tr key={index} style={index % 2 === 0 ? evenRowStyle : oddRowStyle}>
              <td style={cellStyle}>{sub.className}</td>
              <td style={cellStyle}>{sub.streamName}</td>
              <td style={cellStyle}>{sub.sectionName}</td>
              <td style={cellStyle}>{sub.totalStudent}</td>
              <td style={cellStyle}>{sub.totalpresent}</td>
              <td style={cellStyle}>{sub.totalAbsent}</td>
              <td style={cellStyle}>{sub.totalHalfDay}</td>
              <td style={cellStyle}>{sub.totalLeave}</td>
            </tr>
          ))}

          {/* Totals Row */}
          <tr style={{ backgroundColor: "#e0e0e0", fontWeight: "bold" }}>
            <td style={cellStyle} colSpan={3}>Total</td>
            <td style={cellStyle}>{totals.totalStudent}</td>
            <td style={cellStyle}>{totals.totalpresent}</td>
            <td style={cellStyle}>{totals.totalAbsent}</td>
            <td style={cellStyle}>{totals.totalHalfDay}</td>
            <td style={cellStyle}>{totals.totalLeave}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "40px", textAlign: "right" }}>
        <p style={{ fontSize: "14px", fontStyle: "italic" }}>Authorized Signature: __________________</p>
      </div>
    </div>
  );
});

PrintableAttendanceTable.displayName = "PrintableAttendanceTable";

// Styling
const headerStyle = {
  padding: "10px",
  fontWeight: "bold",
  textAlign: "center",
  backgroundColor: "#2c3e50",
  color: "white",
};

const cellStyle = {
  padding: "8px",
  textAlign: "center",
};

const evenRowStyle = {
  backgroundColor: "#ffffff",
};

const oddRowStyle = {
  backgroundColor: "#f9f9f9",
};


export const DailyAttendance = ({ sessionMasterId, themeColor }) => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const printRef = useRef();
  const [toggleMark, setToggleMark] = useState(null);
  const [toggleSMS, setToggleSMS] = useState(null);
  const {
    getDailyAttendanceAction,
    getDailyAttendanceStatus,
    dailyAttendance,
  } = useStudentStore((s) => ({
    getDailyAttendanceAction: s.getDailyAttendanceAction,
    getDailyAttendanceStatus: s.getDailyAttendanceStatus,
    dailyAttendance: s.dailyAttendance,
  }));

  useEffect(() => {
    getDailyAttendanceAction({ sessionMasterId, date: selectedDate });
  }, [getDailyAttendanceAction, selectedDate, sessionMasterId]);

  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <Box>
      <Flex justify={"space-between"} align={"center"}>
        <Input
          w="fit-content"
          size={"sm"}
          type="date"
          value={selectedDate}
          max={today}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <ReactToPrint
          trigger={() => (
            <Button size="sm" colorScheme={themeColor}>
              Print Attendance
            </Button>
          )}
          content={() => printRef.current}
        />
      </Flex>

      <LoadingContainer status={getDailyAttendanceStatus}>
        {dailyAttendance?.length ? (
          <Box
            p={4}
            bg="white"
            borderRadius="lg"
            boxShadow="md"
            borderWidth="1px"
            borderColor="gray.300"
            mt={5}
          >
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Class</Th>
                    <Th>Stream</Th>
                    <Th>Section</Th>
                    <Th>Total Student</Th>
                    <Th>Present</Th>
                    <Th>Absent</Th>
                    <Th>Half Day</Th>
                    <Th>Leave</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {map(groupBy(dailyAttendance, "classMasterId"), (cs, index) => {
                    const subLength = cs?.length;
                    return (
                      <React.Fragment key={index}>
                        {cs?.map((sub, subIndex) => (
                          <Tr key={subIndex}>
                            {subIndex === 0 && (
                              <Td rowSpan={subLength}>{sub.className}</Td>
                            )}
                            <Td>{sub.streamName}</Td>
                            <Td>{sub.sectionName}</Td>
                            <Td>{sub.totalStudent}</Td>
                            <Td>
                            <Flex w="100%" justify={"center"}>
                              <Text
                                w="fit-content"
                                color={"white"}
                                p={0.5}
                                px={2}
                                py={
                                  sub.totalpresent?.toString().length > 1
                                    ? 1
                                    : 0.5
                                }
                                borderRadius={"50%"}
                                bg="green.500"
                              >
                                {sub.totalpresent}
                              </Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Flex w="100%" justify={"center"}>
                              <Text
                                w="fit-content"
                                color={"white"}
                                p={0.5}
                                px={2}
                                py={
                                  sub.totalpresent?.toString().length > 1
                                    ? 1
                                    : 0.5
                                }
                                borderRadius={"50%"}
                                bg="red.500"
                              >
                                {sub.totalAbsent}
                              </Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Flex w="100%" justify={"center"}>
                              <Text
                                w="fit-content"
                                color={"white"}
                                p={0.5}
                                px={2}
                                py={
                                  sub.totalpresent?.toString().length > 1
                                    ? 1
                                    : 0.5
                                }
                                borderRadius={"50%"}
                                bg="yellow.500"
                              >
                                {sub.totalHalfDay}
                              </Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Flex w="100%" justify={"center"}>
                              <Text
                                w="fit-content"
                                color={"white"}
                                p={0.5}
                                px={2}
                                py={
                                  sub.totalpresent?.toString().length > 1
                                    ? 1
                                    : 0.5
                                }
                                borderRadius={"50%"}
                                bg="yellow.500"
                              >
                                {sub.totalLeave}
                              </Text>
                            </Flex>
                          </Td>
                            <Td textAlign={"center"}>
                            <Tooltip placement="top" label="Mark Attendance">
                              <IconButton
                                size={"xs"}
                                variant={"ghost"}
                                color={"blue.500"}
                                icon={<BsPersonFillCheck fontSize={20} />}
                                onClick={() => setToggleMark(sub)}
                              />
                            </Tooltip>
                          </Td>
                          </Tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th colSpan={3}>Total</Th>
                    <Th>
                      {dailyAttendance.reduce((sum, item) => sum + (item.totalStudent || 0), 0)}
                    </Th>
                    <Th  textAlign="center">
                      {dailyAttendance.reduce((sum, item) => sum + (item.totalpresent || 0), 0)}
                    </Th>
                    <Th  textAlign="center">
                      {dailyAttendance.reduce((sum, item) => sum + (item.totalAbsent || 0), 0)}
                    </Th>
                    <Th  textAlign="center">
                      {dailyAttendance.reduce((sum, item) => sum + (item.totalHalfDay || 0), 0)}
                    </Th>
                    <Th  textAlign="center"> 
                      {dailyAttendance.reduce((sum, item) => sum + (item.totalLeave || 0), 0)}
                    </Th>
                    <Th />
                  </Tr>
                </Tfoot>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <NoData title="No Attendance Found" />
        )}
      </LoadingContainer>
      {toggleMark && (
        <MarkDailyAttendance
          getDailyAttendanceAction={getDailyAttendanceAction}
          data={toggleMark}
          date={selectedDate}
          sessionMasterId={sessionMasterId}
          themeColor={themeColor}
          closeDrawer={() => setToggleMark(null)}
        />
      )}

      {/* Hidden Printable Table */}
      <div style={{ display: "none" }}>
        <PrintableAttendanceTable
          ref={printRef}
          dailyAttendance={dailyAttendance}
          selectedDate={selectedDate}
        />
      </div>

      {/* A4 landscape print style */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 1cm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </Box>
  );
};
