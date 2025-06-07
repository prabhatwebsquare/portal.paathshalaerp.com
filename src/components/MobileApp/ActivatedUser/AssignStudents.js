import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import { useMobileAppStore } from "@/store/MobileApp";
import { useStdFeesStore } from "@/store/stdFees";
import { useStudentStore } from "@/store/studentStore";
import { CloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
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
  VStack,
} from "@chakra-ui/react";
import { filter, findIndex, groupBy, map, uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";

export const AssignStudents = ({
  closeDrawer,
  data,
  sessionMasterId,
  themeColor,
  getStudents,
}) => {
  const [inputValue, setInputValue] = useState({});
  const [selectedStudent, setSelectedStudent] = useState([]);

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  const {
    getFilterStudentsAction,
    getFilterStudentsStatus,
    filterStudents,
    resetFilterStdStatus,
  } = useStudentStore((s) => ({
    getFilterStudentsAction: s.getFilterStudentsAction,
    getFilterStudentsStatus: s.getFilterStudentsStatus,
    filterStudents: s.filterStudents,
    resetFilterStdStatus: s.resetFilterStdStatus,
  }));

  const { getSectionAction, getSectionStatus, allSections } =
    useClassSetupStore((s) => ({
      getSectionAction: s.getSectionAction,
      getSectionStatus: s.getSectionStatus,
      allSections: s.allSections,
    }));

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  const {
    getClassActivateStdAction,
    getClassActivateStdStatus,
    allClassActivateStds,
    addActivateStdAction,
    addActivateStdStatus,
    resetActivateStdStatus,
  } = useMobileAppStore((s) => ({
    getClassActivateStdAction: s.getClassActivateStdAction,
    getClassActivateStdStatus: s.getClassActivateStdStatus,
    allClassActivateStds: s.allClassActivateStds,
    addActivateStdAction: s.addActivateStdAction,
    addActivateStdStatus: s.addActivateStdStatus,
    resetActivateStdStatus: s.resetActivateStdStatus,
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

  useEffect(() => {
    return () => resetFilterStdStatus();
  }, [resetFilterStdStatus]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const getFilterStudent = (e) => {
    e.preventDefault();
    getFilterStudentsAction({ ...inputValue, sessionMasterId });
    getClassActivateStdAction({ ...inputValue, sessionMasterId });
  };

  useEffect(() => {
    if (allClassActivateStds?.length) {
      setSelectedStudent(map(allClassActivateStds, "id"));
    }
  }, [allClassActivateStds]);

  const selectAllStd = () => {
    if (selectedStudent?.length === filterStudents?.length) {
      setSelectedStudent([]);
    } else {
      setSelectedStudent(map(filterStudents, "id"));
    }
  };

  const handleCheck = (id) => {
    if (findIndex(selectedStudent, (s) => s === id) !== -1) {
      setSelectedStudent(filter(selectedStudent, (s) => s !== id));
    } else {
      setSelectedStudent([...selectedStudent, id]);
    }
  };

  const activateStudent = () => {
    addActivateStdAction({
      sessionMasterId,
      promotionData: selectedStudent,
    });
  };

  useEffect(() => {
    if (addActivateStdStatus === STATUS.SUCCESS) {
      resetActivateStdStatus();
      setSelectedStudent([]);
      getStudents();
      closeDrawer();
    }
  }, [addActivateStdStatus, closeDrawer, getStudents, resetActivateStdStatus]);

  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      {/* <form onSubmit={saveDetails}> */}
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {data?.id ? "Edit Student" : "Assign Student"}
        </DrawerHeader>

        <DrawerBody>
          <VStack spacing={3} w={"100%"}>
            <form style={{ width: "100%" }} onSubmit={getFilterStudent}>
              <Flex pb={3} gap={4}>
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
                      value: d.stream_master.id,
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
                  data={map(allSections, (d) => ({
                    value: d.id,
                    name: d.name,
                  }))}
                />
                <Button type="submit" size={"sm"} colorScheme={themeColor}>
                  Get
                </Button>
              </Flex>
            </form>
            <LoadingContainer
              status={getFilterStudentsStatus || getClassActivateStdStatus}
            >
              {filterStudents?.length ? (
                <Box w={"100%"}>
                  <TableContainer mt={5}>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>
                            <Checkbox
                              colorScheme={themeColor}
                              isChecked={
                                selectedStudent?.length ===
                                filterStudents?.length
                                  ? true
                                  : false
                              }
                              onChange={selectAllStd}
                            />
                          </Th>
                          <Th>SR No.</Th>
                          <Th>Name</Th>
                          <Th>Father&apos;s Name</Th>
                          <Th>Contact</Th>
                          <Th>Class</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {map(filterStudents, (std) => {
                          const isChecked =
                            findIndex(selectedStudent, (s) => s === std.id) !==
                            -1
                              ? true
                              : false;
                          return (
                            <Tr>
                              <Td>
                                <Checkbox
                                  colorScheme={themeColor}
                                  isChecked={isChecked}
                                  onChange={() => handleCheck(std.id)}
                                />
                              </Td>
                              <Td>{std.student_master.srNo}</Td>
                              <Td>
                                <Flex>
                                  <Avatar
                                    mr={3}
                                    size={"xs"}
                                    src={std.student_master.photo}
                                  />
                                  {std.student_master.studentName}
                                </Flex>
                              </Td>
                              <Td>{std.student_master.fatherName}</Td>
                              <Td>{std.student_master.fatherContact}</Td>
                              <Td>
                                {std.class_master.name} -{" "}
                                {std.stream_master.name}
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : (
                <NoData title={"No Data Found"} />
              )}
            </LoadingContainer>
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <Button
            size={"sm"}
            variant="outline"
            mr={3}
            colorScheme={"red"}
            onClick={closeDrawer}
          >
            Cancel
          </Button>
          <Button
            size={"sm"}
            colorScheme={themeColor}
            isDisabled={selectedStudent?.length ? false : true}
            onClick={activateStudent}
          >
            {data?.id ? "Update" : "Add"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
