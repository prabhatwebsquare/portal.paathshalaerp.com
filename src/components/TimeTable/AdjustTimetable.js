import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Text,
  HStack,
} from "@chakra-ui/react";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { map } from "lodash";
import { useTimetableStore } from "@/store/Timetable";

const TimeTableAdjustment = () => {
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const themeColor = getLocalStorageItem("themeColor") || "blue";

  const {
    RegisteredTeacher,
    getTeacherRegistrionAction,
    addAdjustmentTimetableAction,
    adjustmentTimeTableData,
    saveAdjustDataAction,
  } = useTimetableStore((s) => ({
    RegisteredTeacher: s.RegisteredTeacher,
    getTeacherRegistrionAction: s.getTeacherRegistrionAction,
    addAdjustmentTimetableAction: s.addAdjustmentTimetableAction,
    adjustmentTimeTableData: s.adjustmentTimeTableData,
    saveAdjustDataAction: s.saveAdjustDataAction,
  }));

  useEffect(() => {
    getTeacherRegistrionAction();
  }, []);

  const [details, setDetails] = useState([]);

  useEffect(() => {
    if (adjustmentTimeTableData?.periodMasterList) {
      const newDetails = adjustmentTimeTableData.periodMasterList.map(
        (row) => ({
          classMasterId: row.class_master?.id,
          streamMasterId: row.stream_master?.id,
          sectionMasterId: row.section_master?.id,
          subjectMasterId: row.subject_master?.id,
          oldStaffMasterId: row.staff?.id,
          staffMasterId: row.staff?.id,
          periodMasterId: row.period_master?.id,
          key: row.key,
        })
      );
      setDetails(newDetails);
    }
    if (adjustmentTimeTableData?.adjustPeriodMasteList) {
      const newDetails = adjustmentTimeTableData.adjustPeriodMasteList.map(
        (row) => ({
          classMasterId: row.class_master?.id,
          streamMasterId: row.stream_master?.id,
          sectionMasterId: row.section_master?.id,
          subjectMasterId: row.subject_master?.id,
          oldStaffMasterId: row.staff?.id,
          staffMasterId: row.staff?.id,
          periodMasterId: row.period_master?.id,
          key: row.key,
        })
      );
      setDetails((prevDetails) => [...prevDetails, ...newDetails]); // Append to existing details
    }
  }, [
    adjustmentTimeTableData?.periodMasterList,
    adjustmentTimeTableData?.adjustPeriodMasteList,
  ]);

  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
  );
  const handleVacantTeacherChange = (index, value) => {
    setDetails((prevDetails) => {
      const updatedDetails = prevDetails.map((item, i) =>
        i === index ? { ...item, staffMasterId: value } : item
      );
      return updatedDetails;
    });
  };

  const handleShow = () => {
    const data = {
      date: selectedTeacher.date,
      staffMasterId: selectedTeacher.staffMasterId,
      sessionMasterId: sessionMasterId,
    };
    addAdjustmentTimetableAction(data);
  };

  const handleSave = () => {
    const finalData = {
      sessionMasterId: sessionMasterId,
      date: selectedTeacher.date,
      oldStaffMasterId: selectedTeacher.staffMasterId,
      details,
    };
    saveAdjustDataAction(finalData);
  };

  const handleCancel = () => {
    setDetails([]);
    setSelectedTeacher("");
  };

  return (
    <Box p={6}>
      <Flex justify="start" align="center" mb={6} gap={4}>
        <CustomSelect
          w={"100%"}
          name={"staffMasterId"}
          label={"Select Teacher"}
          inputValue={selectedTeacher}
          setInputValue={setSelectedTeacher}
          data={map(RegisteredTeacher, (d) => ({
            value: d?.id,
            name: d?.name,
          }))}
        />
        <CustomInput
          w={"100%"}
          type={"date"}
          name="date"
          label={"Select Date"}
          inputValue={selectedTeacher}
          setInputValue={setSelectedTeacher}
        />
        <Button w={150} colorScheme={themeColor} onClick={handleShow}>
          Show
        </Button>
      </Flex>
      {(adjustmentTimeTableData?.periodMasterList?.length > 0 ||
        adjustmentTimeTableData?.adjustPeriodMasteList?.length > 0) && (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Period Name</Th>
              <Th>Class</Th>
              <Th>Faculty</Th>
              <Th>Section</Th>
              <Th>Subject</Th>
              <Th>Vacant Teacher Name</Th>
            </Tr>
          </Thead>
          <Tbody>
            {adjustmentTimeTableData?.periodMasterList?.map((row, index) => (
              <Tr key={row.key}>
                <Td>{row.period_master?.name || "Period 1"}</Td>
                <Td>{row.class_master?.name}</Td>
                <Td>{row.stream_master?.name}</Td>
                <Td>{row.section_master?.name}</Td>
                <Td>{row.subject_master?.name}</Td>
                <Td>
                  <Select
                    borderColor={`${themeColor}.200`}
                    focusBorderColor={`${themeColor}.400`}
                    placeholder="Select Vacant Teacher"
                    value={details[index]?.staffMasterId || ""}
                    onChange={(e) =>
                      handleVacantTeacherChange(index, e.target.value)
                    }
                  >
                    {adjustmentTimeTableData?.unassignedStaffData.map(
                      (teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </option>
                      )
                    )}
                  </Select>
                </Td>
              </Tr>
            ))}
            {adjustmentTimeTableData?.adjustPeriodMasteList?.map(
              (row, index) => (
                <Tr key={row.key}>
                  <Td>{row.period_master?.name || "Period 1"}</Td>
                  <Td>{row.class_master?.name}</Td>
                  <Td>{row.stream_master?.name}</Td>
                  <Td>{row.section_master?.name}</Td>
                  <Td>{row.subject_master?.name}</Td>
                  <Td>
                    <Select
                      borderColor={`${themeColor}.200`}
                      focusBorderColor={`${themeColor}.400`}
                      placeholder="Select Vacant Teacher"
                      value={
                        details[
                          index +
                            adjustmentTimeTableData?.periodMasterList.length
                        ]?.staffMasterId || ""
                      }
                      onChange={(e) =>
                        handleVacantTeacherChange(
                          index +
                            adjustmentTimeTableData?.periodMasterList.length,
                          e.target.value
                        )
                      }
                    >
                      {adjustmentTimeTableData?.unassignedStaffData.map(
                        (teacher) => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </option>
                        )
                      )}
                    </Select>
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      )}
      {(adjustmentTimeTableData?.periodMasterList?.length > 0 ||
        adjustmentTimeTableData?.adjustPeriodMasteList?.length > 0) && (
        <Flex mt={4} justify="flex-end">
          <HStack spacing={4}>
            <Button colorScheme={themeColor} onClick={handleSave}>
              Save
            </Button>
            <Button
              colorScheme="red.400"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </HStack>
        </Flex>
      )}
    </Box>
  );
};

export default TimeTableAdjustment;
