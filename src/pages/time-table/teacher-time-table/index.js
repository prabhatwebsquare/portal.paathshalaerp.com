// pages/teacher-timetable.js
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { MainLayout } from "@/layout/MainLayout";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { useTimetableStore } from "@/store/Timetable";
import { PageHeader } from "@/common/PageHeader";
import { CustomSelect } from "@/common/CustomSelect";
import { map } from "lodash";
import { NoData } from "@/common/NoData";
import moment from "moment";

const Index = () => {
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [timetable, setTimetable] = useState([]);
  const tableRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(timetable);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Timetable");
    XLSX.writeFile(wb, "timetable.xlsx");
  };
  const themeColor = getLocalStorageItem("themeColor") || "blue";

  const {
    RegisteredTeacher,
    getTeacherRegistrionAction,
    getTeacherTimeTableAction,
    TeacherTimeTable,
    TimetableMaster,
    getTimetableMasterAction,
  } = useTimetableStore((s) => ({
    getTimetableMasterAction: s.getTimetableMasterAction,
    TimetableMaster: s.TimetableMaster,
    RegisteredTeacher: s.RegisteredTeacher,
    getTeacherRegistrionAction: s.getTeacherRegistrionAction,
    getTeacherTimeTableAction: s.getTeacherTimeTableAction,
    TeacherTimeTable: s.TeacherTimeTable,
    getTeacherTimetableStatus: s.getTeacherTimetableStatus,
  }));

  useEffect(() => {
    getTeacherRegistrionAction();
    getTimetableMasterAction();
    return () => {};
  }, []);

  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
  );
  const handleFilter = () => {
    const data = {
      staffMasterId: selectedTeacher.classMasterId,
      sessionMasterId: sessionMasterId,
    };
    getTeacherTimeTableAction(data);
  };
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const convertTo12HourFormat = (time24) => {
    return moment(time24, "HH:mm:ss").format("hh:mm A");
  };
  return (
    <MainLayout>
      <PageHeader
        heading={"Get Teacher Timetable"}
        extra={
          <HStack spacing={5} mb={4}>
            <CustomSelect
              w={250}
              name={"classMasterId"}
              label={"Select Teacher"}
              inputValue={selectedTeacher}
              setInputValue={setSelectedTeacher}
              data={map(RegisteredTeacher, (d, key) => ({
                value: d?.id,
                name: d?.name,
              }))}
            />
            <Button
              px={7}
              colorScheme={themeColor}
              fontSize={"smaller"}
              onClick={handleFilter}
            >
              Show
            </Button>

            {/* Print and Export Buttons */}
            {TeacherTimeTable?.length > 0 && (
              <>
                <Button
                  colorScheme={themeColor}
                  fontSize={"smaller"}
                  onClick={handlePrint}
                >
                  Print
                </Button>
                <Button
                  colorScheme={themeColor}
                  fontSize={"smaller"}
                  onClick={handleExportToExcel}
                >
                  Export to Excel
                </Button>
              </>
            )}
          </HStack>
        }
      />
      <Box p={5}>
        {TeacherTimeTable?.length > 0 ? (
          <>
            <Table variant="simple" mb={4}>
              <Thead>
                <Tr>
                  <Th textAlign={"center"}>Period</Th>
                  {days?.map((day) => (
                    <Th key={day} textAlign={"center"}>
                      <Text fontWeight={700} fontSize="sm">
                        {day}
                      </Text>
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {TimetableMaster?.map((period) => (
                  <Tr key={period.id}>
                    <Td
                      textAlign={"center"}
                      _hover={{
                        backgroundColor: `${themeColor}.100`, // Background color changes to the theme's light variant
                        color: `${themeColor}.800`, // Text color changes to white
                      }}
                    >
                      <Text fontWeight={700} fontSize="md" textAlign="center">
                        {period.name}
                      </Text>
                      <Text fontSize="sm" color={`${themeColor}.900`}>
                        {convertTo12HourFormat(period.startTime)} -{" "}
                        {convertTo12HourFormat(period.endTime)}
                      </Text>
                    </Td>
                    {days.map((day) => {
                      const record = TeacherTimeTable.find(
                        (item) =>
                          item.day === day &&
                          item.records.some(
                            (rec) => rec.period_master.id === period.id
                          )
                      );

                      return (
                        <Td key={day}>
                          <Box>
                            {record ? (
                              record.records
                                .filter(
                                  (rec) => rec.period_master.id === period.id
                                )
                                .map((rec) => (
                                  <Box
                                    key={rec.id}
                                    bg={`${themeColor}.100`}
                                    p={2}
                                    borderRadius="lg"
                                    boxShadow="sm"
                                    fontWeight={700}
                                    border="1px solid"
                                    borderColor={`${themeColor}.500`}
                                    _hover={{
                                      backgroundColor: `${themeColor}.300`, // Background color changes to the theme's light variant
                                      color: `${themeColor}.800`, // Text color changes to white
                                      borderColor: `${themeColor}.900`, // Border color changes to the theme's darker variant
                                    }}
                                  >
                                    <Text fontSize="md" textAlign="center">
                                      {rec.class_master.name}{" "}
                                      {`( ${rec.stream_master.name} - ${rec.section_master.name} )`}
                                    </Text>
                                    <Text
                                      fontSize="md"
                                      textAlign="center"
                                    ></Text>

                                    <Text fontSize="sm" textAlign="center">
                                      {rec.subject_master.name}
                                    </Text>
                                  </Box>
                                ))
                            ) : (
                              <Box
                                bg="gray.100"
                                p={2}
                                borderRadius="lg"
                                boxShadow="sm"
                                fontWeight={700}
                                border="1px solid"
                                borderColor={`${themeColor}.500`}
                              >
                                <Text textAlign="center" color={"gray.500"}>
                                  No record
                                </Text>
                              </Box>
                            )}
                          </Box>
                        </Td>
                      );
                    })}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        ) : (
          <NoData title={"Search Time Table First !"} />
        )}
      </Box>
    </MainLayout>
  );
};

export default Index;
