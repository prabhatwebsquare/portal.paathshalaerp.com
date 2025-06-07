import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import CustomTextarea from "@/common/CustomTextarea";
import { LoadingContainer } from "@/common/LoadingContainer";
import MultiSelectSelector from "@/common/MultiSelectSelector";
import { STATUS } from "@/constant";
import { URL } from "@/services/apis";
import { useAppStore } from "@/store/App";
import { useClassSetupStore } from "@/store/classSetup";
import { useStdFeesStore } from "@/store/stdFees";
import { useStudentStore } from "@/store/studentStore";
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
  Image,
  Input,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { findIndex, flatMap, groupBy, map, orderBy, uniqBy } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";

export const AddAppMessage = ({
  themeColor,
  sessionMasterId,
  data,
  closeDrawer,
}) => {

  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,
          classMasterId: data?.classMasterId,
          streamMasterId: data?.streamMasterId,
          isStudent: data?.isStudent,
          message: data?.message,
          subject: data?.subject,
          isClass: data?.student_messages.length > 0 ? "0" : "1",
          sectionMasterId: data?.sectionMasterId,
        }
      : {}
  );
  const [selectedStudent, setSelectedStudent] = useState([]);
  useEffect(() => {
    if (data?.student_messages?.length) {
      const promotionIds = data.student_messages.map((msg) => ({
        id: msg?.promotion?.id,
      }));


      setSelectedStudent(promotionIds);
    } else {
      setSelectedStudent([]);
    }
  }, [data]);

  const {
    addMessageAction,
    addMessageStatus,
    updateMessageAction,
    updateMessageStatus,
    resetMessageStatus,
    getMessageAction,
  } = useAppStore((s) => ({
    addMessageAction: s.addMessageAction,
    addMessageStatus: s.addMessageStatus,
    updateMessageAction: s.updateMessageAction,
    updateMessageStatus: s.updateMessageStatus,
    resetMessageStatus: s.resetMessageStatus,
    getMessageAction: s.getMessageAction,
  }));

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));
  const { getSectionAction, getSectionStatus, allSections } =
    useClassSetupStore((s) => ({
      getSectionAction: s.getSectionAction,
      getSectionStatus: s.getSectionStatus,
      allSections: s.allSections,
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
  const addMessage = async (e) => {
    e.preventDefault();

    const { isClass, sectionMasterId, subject, message } = inputValue;

    await addMessageAction({
      sessionMasterId,
      sectionMasterId,
      subject,
      message,
      isStudent: 1,
      ...(isClass !== "1" && {
        promotionIds: selectedStudent.map((s) => s.id),
      }),
      ...(isClass === "1" &&
        (inputValue.classMasterId === "all"
          ? { allClass: 1 }
          : {
              classMasterId: inputValue.classMasterId,
              streamMasterId: inputValue.streamMasterId,
              sectionMasterId: inputValue.sectionMasterId,
            })),
    });
  };
  const { getClassAction, getClassStatus, allClasses } = useClassSetupStore(
    (s) => ({
      getClassAction: s.getClassAction,
      allClasses: s.allClasses,
      getClassStatus: s.getClassStatus,
    })
  );
  useEffect(() => {
    if ((getClassStatus || 1) === STATUS.NOT_STARTED) {
      getClassAction();
    }
  }, [getClassAction, getClassStatus]);
  useEffect(() => {
    if (
      addMessageStatus === STATUS.SUCCESS ||
      updateMessageStatus === STATUS.SUCCESS
    ) {
      getMessageAction({ sessionMasterId });
      resetMessageStatus();
      closeDrawer();
    }
  }, [addMessageStatus, closeDrawer, resetMessageStatus, updateMessageStatus]);

  const Classdata = useMemo(() => {
    return map(orderBy(allClasses, "orderNo", "asc"), (c) => ({
      value: c.id,
      name: c.name,
    }));
  }, [allClasses]);
  const allStreams = useMemo(() => {
    return map(
      uniqBy(
        flatMap(
          orderBy(allClassSubjects, "orderNo", "asc"),
          (c) => c.stream_master
        ),
        (stream) => stream?.id
      ),
      (stream) => ({
        value: stream?.id,
        name: stream?.name,
      })
    );
  }, [allClassSubjects]);

  const selectAllStd = () => {
    if (selectedStudent?.length === filterStudents?.length) {
      setSelectedStudent([]);
    } else {
      setSelectedStudent(map(filterStudents, (s) => ({ id: s.id })));
    }
  };
  const handleCheck = (id) => {
    if (findIndex(selectedStudent, (s) => s.id === id) !== -1) {
      setSelectedStudent(filter(selectedStudent, (s) => s.id !== id));
    } else {
      setSelectedStudent([...selectedStudent, { id }]);
    }
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
  const getFilterStudent = () => {
    getFilterStudentsAction({ ...inputValue, sessionMasterId });
  };

  useEffect(() => {
    return () => resetFilterStdStatus();
  }, [resetFilterStdStatus]);

  useEffect(() => {
    if (
      inputValue.classMasterId &&
      inputValue.streamMasterId &&
      inputValue.sectionMasterId
    ) {
      getFilterStudentsAction({ ...inputValue, sessionMasterId });
    }
    return () => {};
  }, [inputValue]);
  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addMessage}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit App Message" : "Add App Message"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <Flex w={"100%"} gap={2}>
                <CustomSelect
                  w={"100%"}
                  name={"isClass"}
                  label={"Select Class"}
                  autoFocus={true}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={[
                    { name: "Class Wise", value: "1" },
                    { name: "Student Wise", value: "0" },
                  ]}
                />
              </Flex>
              {inputValue?.isClass === "0" ? (
                <>
                  <Box w={"100%"}>
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

                      <Button
                        onClick={getFilterStudent}
                        type="button" // prevent default form behavior
                        size={"sm"}
                        mt={2}
                        px={5}
                        colorScheme={themeColor}
                      >
                        Get
                      </Button>
                    </Flex>
                    {(getFilterStudentsStatus || 1) === STATUS.NOT_STARTED ? (
                      <Flex justify={"center"} mt={7}>
                        <Text>Get Class Student First</Text>
                      </Flex>
                    ) : (
                      <LoadingContainer status={getFilterStudentsStatus}>
                        <TableContainer>
                          <Table w="100%" size={"sm"} variant={"simple"}>
                            <Thead>
                              <Tr bg="gray.100">
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
                                {/* <Th>Sr No.</Th> */}
                                <Th>Roll No.</Th>
                                <Th>Name</Th>
                                <Th>Father Name</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {map(filterStudents, (std, index) => {
                                const isChecked =
                                  findIndex(
                                    selectedStudent,
                                    (s) => s.id === std.id
                                  ) !== -1
                                    ? true
                                    : false;
                                return (
                                  <Tr
                                    key={index}
                                    _hover={{ bg: "gray.50" }}
                                    cursor={"pointer"}
                                  >
                                    <Td>
                                      <Checkbox
                                        colorScheme={themeColor}
                                        isChecked={isChecked}
                                        onChange={() => handleCheck(std.id)}
                                      />
                                    </Td>
                                    {/* <Td>{std.srNo}</Td> */}
                                    <Td>{std.rollNo}</Td>
                                    <Td>{std.student_master.studentName}</Td>
                                    <Td>{std.student_master.fatherName}</Td>
                                  </Tr>
                                );
                              })}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </LoadingContainer>
                    )}
                  </Box>
                </>
              ) : (
                inputValue?.isClass === "1" && (
                  <>
                    <CustomSelect
                      size={"md"}
                      name={"classMasterId"}
                      label={"Select Class"}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      data={[
                        { value: "all", name: "All Classes" },
                        ...map(classes, (d, key) => ({
                          value: key,
                          name: d?.[0]?.class_master?.name,
                        })),
                      ]}
                    />
                    <CustomSelect
                      size={"md"}
                      name={"streamMasterId"}
                      label={"Select Stream"}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      data={[
                        { value: "all", name: "All Streams" },
                        ...map(
                          uniqBy(
                            classes?.[inputValue?.classMasterId],
                            "streamMasterId"
                          ),
                          (d, index) => ({
                            value: d.stream_master.id,
                            name: d.stream_master.name,
                          })
                        ),
                      ]}
                    />
                  </>
                )
              )}
              {inputValue?.isClass && (
                <>
                  <CustomInput
                    type={"text"}
                    name="subject"
                    label={"Subject"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                  <CustomTextarea
                    type={"text"}
                    name="message"
                    label={"Message"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                </>
              )}
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
              type={"submit"}
              isDisabled={
                inputValue?.isClass === "0"
                  ? selectedStudent
                    ? false
                    : true
                  : false
              }
              isLoading={
                addMessageStatus === STATUS.FETCHING ||
                updateMessageStatus === STATUS.FETCHING
              }
              colorScheme={themeColor}
            >
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
