import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Text,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  FormControl,
  FormLabel,
  Grid,
} from "@chakra-ui/react";
import { MainLayout } from "@/layout/MainLayout";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { NoData } from "@/common/NoData";
import { CustomSelect } from "@/common/CustomSelect";
import { useClassSetupStore } from "@/store/classSetup";
import { groupBy, map, uniqBy } from "lodash";
import { useTimetableStore } from "@/store/Timetable";
import moment from "moment";
import { PageHeader } from "@/common/PageHeader";
import CustomInput from "@/common/CustomInput";

const StudentAdjustTimetable = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const themeColor = getLocalStorageItem("themeColor") || "blue";
  const days = ["11-12-2024"];

  const handlePrint = () => {
    window.print(); // Opens print dialog
  };

  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
  );

  const [errors, setErrors] = useState({ class: "", faculty: "", Section: "" });
  const [formData, setFormData] = useState({
    classMasterId: "",
    streamMasterId: "",
    sectionMasterId: "",
    sessionMasterId: sessionMasterId,
  });

  const { getClassSubjectAction, allClassSubjects } = useClassSetupStore(
    (s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      allClassSubjects: s.allClassSubjects,
    })
  );

  const { getSectionAction, getSectionStatus, allSections } =
    useClassSetupStore((s) => ({
      getSectionAction: s.getSectionAction,
      getSectionStatus: s.getSectionStatus,
      allSections: s.allSections,
    }));

  const {
    getStudentTimeTableAction,
    getStudentTimeTable,
    getStudentTimeTableStatus,
    wholeDetailTimeTable,
    getDetailAssignTimeTableAction,
  } = useTimetableStore((s) => ({
    getStudentTimeTableAction: s.getStudentTimeTableAction,
    getStudentTimeTable: s.getStudentTimeTable,
    getStudentTimeTableStatus: s.getStudentTimeTableStatus,
    wholeDetailTimeTable: s.wholeDetailTimeTable,
    getDetailAssignTimeTableAction: s.getDetailAssignTimeTableAction,
  }));

  const classes = useMemo(
    () => groupBy(allClassSubjects, "classMasterId"),
    [allClassSubjects]
  );

  useEffect(() => {
    getClassSubjectAction();
    getSectionAction();
  }, []);

  const handleAdd = () => {
    const newErrors = { class: "", faculty: "" };
    let hasError = false;

    if (!formData.classMasterId) {
      newErrors.class = "Class is required";
      hasError = true;
    }
    if (!formData.streamMasterId) {
      newErrors.faculty = "Stream is required";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      const data = {
        classMasterId: formData.classMasterId,
        streamMasterId: formData.streamMasterId,
        sectionMasterId: formData.sectionMasterId,
        sessionMasterId: formData.sessionMasterId,
      };
      getStudentTimeTableAction(data);
      getDetailAssignTimeTableAction(data);
      onClose();
    }
  };
  const convertTo12HourFormat = (time24) => {
    return moment(time24, "HH:mm:ss").format("hh:mm A");
  };
  return (
    <Box height={"78vh"} backgroundColor={"white"}>
      <Flex justifyContent={"end"}>
        <Button colorScheme={themeColor} onClick={onOpen}>
          Add Filters
        </Button>
        <Button colorScheme={themeColor} onClick={handlePrint} ml={3}>
          Print
        </Button>
      </Flex>
      {/* Drawer for Filters */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Add Filters</DrawerHeader>
          <DrawerBody>
            <FormControl isInvalid={!!errors.class}>
              <FormLabel>Class</FormLabel>
              <CustomSelect
                w={"100%"}
                name={"classMasterId"}
                label={"Select Class"}
                inputValue={formData}
                setInputValue={setFormData}
                data={map(classes, (d, key) => ({
                  value: key,
                  name: d?.[0]?.class_master?.name,
                }))}
              />
              {errors.class && (
                <Text color="red.500" fontSize="sm">
                  {errors.class}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.faculty}>
              <FormLabel>Stream</FormLabel>
              <CustomSelect
                w={"100%"}
                name={"streamMasterId"}
                label={"Select Stream"}
                inputValue={formData}
                setInputValue={setFormData}
                data={map(
                  uniqBy(classes?.[formData?.classMasterId], "streamMasterId"),
                  (d) => ({
                    value: d.stream_master.id,
                    name: d.stream_master.name,
                  })
                )}
              />
              {errors.faculty && (
                <Text color="red.500" fontSize="sm">
                  {errors.faculty}
                </Text>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.Section}>
              <FormLabel>Section</FormLabel>
              <CustomSelect
                name={"sectionMasterId"}
                label={"Select Section"}
                inputValue={formData}
                setInputValue={setFormData}
                data={map(allSections, (d, index) => ({
                  value: d.id,
                  name: d.name,
                }))}
              />
              {errors.Section && (
                <Text color="red.500" fontSize="sm">
                  {errors.Section}
                </Text>
              )}
            </FormControl>
            <FormLabel mt={2}>Date</FormLabel>
            <CustomInput
              // w={"20%"}
              type={"date"}
              name="date"
              label={"Select Date"}
              inputValue={formData}
              setInputValue={setFormData}
            />
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme={themeColor} onClick={handleAdd}>
              Add
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Timetable Section */}
      {getStudentTimeTable?.length > 0 ? (
        <>
          <Box overflow={"scroll"} overflowX={"hidden"} height={"72vh"} mt={5}>
            <Table variant="simple" mb={4}>
              <Thead>
                <Tr>
                  <Th textAlign={"center"}>Period</Th>
                  {days.map((day) => (
                    <Th key={day} textAlign={"center"}>
                      <Text fontWeight={700} fontSize="sm">
                        {day}
                      </Text>
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {wholeDetailTimeTable?.periodMaster.map((period) => (
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
                      // Find the timetable record for the current day and period
                      const record = getStudentTimeTable.find(
                        (item) =>
                          "11-12-2024" === day &&
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
                                      {rec.staff.name} - {rec.staff.employeeId}
                                    </Text>
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
          </Box>
        </>
      ) : (
        <NoData title={"Search Time Table First !"} />
      )}
    </Box>
  );
};

export default StudentAdjustTimetable;
