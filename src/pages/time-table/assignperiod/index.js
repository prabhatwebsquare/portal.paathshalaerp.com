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
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select as ChakraSelect,
  useColorModeValue,
  Stack,
  SimpleGrid,
  Badge,
  Text,
} from "@chakra-ui/react";
import { MainLayout } from "@/layout/MainLayout";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { useTimetableStore } from "@/store/Timetable";
import { useClassSetupStore } from "@/store/classSetup";
import { groupBy, map, uniqBy } from "lodash";
import { CustomSelect } from "@/common/CustomSelect";

const AssignPeriod = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [editKey, setEditKey] = useState("");
  const [assignments, setAssignments] = useState({});
  const [selectedCell, setSelectedCell] = useState({
    day: "",
    period: "",
    periodId: "",
    key: "",
  });
  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
  );

  const [modalData, setModalData] = useState({ teacher: "", subject: "" });
  const [formData, setFormData] = useState({
    classMasterId: "",
    streamMasterId: "",
    sessionMasterId: sessionMasterId,
  });
  const [errors, setErrors] = useState({ class: "", faculty: "" });
  const [showTable, setShowTable] = useState(false);

  const {
    detailAssignTimeTableStatus,
    wholeDetailTimeTable,
    getDetailAssignTimeTableAction,
    assignTimeTableByDayWise,
  } = useTimetableStore((s) => ({
    detailAssignTimeTableStatus: s.detailAssignTimeTableStatus,
    wholeDetailTimeTable: s.wholeDetailTimeTable,
    getDetailAssignTimeTableAction: s.getDetailAssignTimeTableAction,
    assignTimeTableByDayWise: s.assignTimeTableByDayWise,
  }));

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
  const classes = useMemo(
    () => groupBy(allClassSubjects, "classMasterId"),
    [allClassSubjects]
  );

  useEffect(() => {
    getClassSubjectAction();
    getSectionAction();
  }, []);

  const handleShowTable = () => {
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
      getDetailAssignTimeTableAction(formData, sessionMasterId);
      setShowTable(true);
    }
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (day, period, data, periodId, key) => {
    setSelectedCell({ day, period, periodId, key });
    setIsEditing(!!data);
    setEditKey(key);
    setModalData({
      teacher: data?.staff?.id || "",
      subject: data?.subject_master?.id || "",
    });
    onOpen();
  };
  const handleAddAssignment = async () => {
    const key = `${selectedCell.day}-${selectedCell.period}`;
    const assignmentData = {
      teacher: modalData.teacher,
      subject: modalData.subject,
    };
    setAssignments((prev) => ({
      ...prev,
      [key]: assignmentData,
    }));

    const data = {
      classMasterId: formData.classMasterId,
      streamMasterId: formData.streamMasterId,
      subjectMasterId: modalData.subject,
      day: selectedCell.day,
      staffMasterId: modalData.teacher,
      periodMasterId: selectedCell.periodId,
      sectionMasterId: formData.sectionMasterId,
      key: selectedCell.key,
      sessionMasterId: formData.sessionMasterId,
    };
    try {
      await assignTimeTableByDayWise(data);
      getDetailAssignTimeTableAction(formData, formData.sessionMasterId);
    } catch (error) {
      console.error("Error assigning timetable:", error);
    } finally {
      onClose();
    }
  };

  const cardBg = useColorModeValue("white", "gray.800");
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const themeColor = getLocalStorageItem("themeColor") || "blue";
  return (
    <MainLayout>
      <Box p={5}>
        <Box
          borderWidth="1px"
          borderRadius="lg"
          shadow="md"
          p={5}
          mb={6}
          bg="white"
        >
          <Heading size="md" mb={4}>
            Assign Period to Teacher
          </Heading>
          <HStack spacing={4} width="100%">
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
            <FormControl isInvalid={!!errors.faculty}>
              <FormLabel>Section</FormLabel>
              <CustomSelect
                // w={"32%"}
                name={"sectionMasterId"}
                label={"Select Section"}
                inputValue={formData}
                setInputValue={setFormData}
                data={map(allSections, (d, index) => ({
                  value: d.id,
                  name: d.name,
                }))}
              />
            </FormControl>
            <Button
              sx={{
                px: 8,
                mt: 7,
              }}
              colorScheme={themeColor}
              onClick={handleShowTable}
              isDisabled={!!errors.class || !!errors.faculty}
            >
              Show
            </Button>
          </HStack>
        </Box>

        {showTable && (
          <Stack spacing={6} p={5}>
            <Box height={"54vh"} overflow={"scroll"} overflowX={"hidden"}>
              {days.map((day) => (
                <Box
                  key={day}
                  borderWidth="1px"
                  borderRadius="lg"
                  p={5}
                  bg={cardBg}
                >
                  <Heading as="h3" size="md" mb={4}>
                    {day}
                  </Heading>
                  <SimpleGrid columns={8} spacing={4}>
                    {wholeDetailTimeTable?.periodMaster.map((period) => {
                      const key = `${day}-${period.name}`.trim(); // Trim spaces
                      const dayData =
                        wholeDetailTimeTable?.periodManagement.find(
                          (pm) =>
                            pm.day?.trim().toLowerCase() ===
                            day?.trim().toLowerCase()
                        );

                      const periodData = dayData?.records.find(
                        (record) => record.key?.trim() === key
                      );
                      const teacherName =
                        periodData?.staff?.name || "Unassigned";
                      const subjectName =
                        periodData?.subject_master?.name || "Unassigned";

                      return (
                        <Box
                          key={key}
                          p={3}
                          borderWidth="1px"
                          borderRadius="md"
                          bg={periodData ? "green.200" : "red.200"}
                          color={periodData ? "black" : "gray.900"}
                          onClick={() =>
                            handleOpenModal(
                              day,
                              period.name,
                              periodData,
                              period.id,
                              key
                            )
                          }
                        >
                          <Text fontSize="sm" fontWeight="bold">
                            {period.name}
                          </Text>

                          {!periodData ? (
                            <Badge colorScheme="red">Unassigned</Badge>
                          ) : (
                            <Text
                              fontSize="sm"
                              fontWeight={700}
                            >{`${teacherName} - ${subjectName}`}</Text>
                          )}
                        </Box>
                      );
                    })}
                  </SimpleGrid>
                </Box>
              ))}
            </Box>
          </Stack>
        )}

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {isEditing ? "Edit Assignment" : "Assign Period"}
            </ModalHeader>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Teacher</FormLabel>
                  <ChakraSelect
                    placeholder="Select Teacher"
                    name="teacher"
                    value={modalData.teacher}
                    onChange={handleModalChange}
                  >
                    {wholeDetailTimeTable?.teacherStaffs?.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {`Emp ID: ${teacher.employeeId} - ${teacher.name}`}
                      </option>
                    ))}
                  </ChakraSelect>
                </FormControl>
                <FormControl>
                  <FormLabel>Subject</FormLabel>
                  <ChakraSelect
                    placeholder="Select Subject"
                    name="subject"
                    value={modalData.subject}
                    onChange={handleModalChange}
                  >
                    {wholeDetailTimeTable?.assignSubjectMaster?.map(
                      (subject) => (
                        <option
                          key={subject.subject_master.id}
                          value={subject.subject_master.id}
                        >
                          {subject.subject_master.name}
                        </option>
                      )
                    )}
                  </ChakraSelect>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme={themeColor} onClick={handleAddAssignment}>
                {isEditing ? "Update" : "Add"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </MainLayout>
  );
};

export default AssignPeriod;
