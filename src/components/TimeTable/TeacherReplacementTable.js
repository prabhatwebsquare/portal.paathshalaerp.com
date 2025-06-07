import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useReactToPrint } from "react-to-print";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import CustomInput from "@/common/CustomInput";
import { useTimetableStore } from "@/store/Timetable";
import PrintTeacherReplacementTable from "./PrintTeacherReplacementTable";

const TeacherReplacementTable = () => {
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const themeColor = getLocalStorageItem("themeColor") || "blue";
  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
  );

  const {
    adjustTimeTableList,
    getTeacherRegistrionAction,
    getAdjustTimeTableListAction,
  } = useTimetableStore((s) => ({
    getTeacherRegistrionAction: s.getTeacherRegistrionAction,
    getAdjustTimeTableListAction: s.getAdjustTimeTableListAction,
    adjustTimeTableList: s.adjustTimeTableList,
  }));

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Teacher Replacement Timetable",
  });

  useEffect(() => {
    getTeacherRegistrionAction();
  }, []);

  const handleShow = () => {
    const data = {
      date: selectedTeacher.date,
      sessionMasterId: sessionMasterId,
    };
    getAdjustTimeTableListAction(data);
  };

  return (
    <Box p={6}>
      <Flex justify="start" align="center" mb={6} gap={4}>
        <CustomInput
          w={"20%"}
          type={"date"}
          name="date"
          label={"Select Date"}
          inputValue={selectedTeacher}
          setInputValue={setSelectedTeacher}
        />
        <Button w={150} colorScheme={themeColor} onClick={handleShow}>
          Show
        </Button>
        {adjustTimeTableList?.length > 0 && (
          <Button w={150} colorScheme={themeColor} onClick={handlePrint}>
            Print
          </Button>
        )}
      </Flex>
      {adjustTimeTableList?.length > 0 && (
        <>
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Period</Th>
                <Th>Class</Th>
                <Th>Section</Th>
                <Th>Subject</Th>
                <Th>Old Teacher</Th>
                <Th>New Teacher</Th>
              </Tr>
            </Thead>
            <Tbody>
              {adjustTimeTableList?.map((row, index) => (
                <Tr key={index}>
                  <Td>{row.date}</Td>

                  <Td>{row.period_master?.name}</Td>
                  <Td>{row.class_master?.name}</Td>
                  <Td>{row.section_master?.name}</Td>
                  <Td>{row.subject_master?.name}</Td>
                  <Td>{row.oldStaff?.name}</Td>
                  <Td>{row.staff?.name}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {/* Hidden print component */}
          <Box display="none">
            <PrintTeacherReplacementTable
              ref={printRef}
              data={adjustTimeTableList}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default TeacherReplacementTable;
