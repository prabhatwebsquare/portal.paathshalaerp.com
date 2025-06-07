import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import CustomTextarea from "@/common/CustomTextarea";
import { LoadingContainer } from "@/common/LoadingContainer";
import { UploadFile } from "@/common/UploadFile";
import { STATUS } from "@/constant";
import { URL } from "@/services/apis";
import { useAppStore } from "@/store/App";
import { useClassSetupStore } from "@/store/classSetup";
import { useStdFeesStore } from "@/store/stdFees";
import {
  Avatar,
  Box,
  Button,
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
import { groupBy, map, uniqBy } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";

export const AddNoticeBoard = ({
  themeColor,
  sessionMasterId,
  data,
  closeDrawer,
}) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
        ...data,
        isClass :data.classMasterId == null ? "0" : "1",
        date: dayjs(data?.date).format("YYYY-MM-DD"),
        
        }
      : {
          isClass: "1",
          date: dayjs().format("YYYY-MM-DD"),
        }
  );
  const [searchInput, setSearchInput] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const {
    addNoticeBoardAction,
    addNoticeBoardStatus,
    updateNoticeBoardAction,
    updateNoticeBoardStatus,
    resetNoticeBoardStatus,
    allNoticeBoards
  } = useAppStore((s) => ({
    addNoticeBoardAction: s.addNoticeBoardAction,
    addNoticeBoardStatus: s.addNoticeBoardStatus,
    updateNoticeBoardAction: s.updateNoticeBoardAction,
    updateNoticeBoardStatus: s.updateNoticeBoardStatus,
    resetNoticeBoardStatus: s.resetNoticeBoardStatus,
    allNoticeBoards :s.allNoticeBoards
  }));
  useEffect(() => {
    if (allNoticeBoards?.length > 0 && !data?.id) {
      const maxOrderNo = Math.max(...allNoticeBoards.map((c) => c.orderNo));
      setInputValue((prev) => ({...prev, orderNo: maxOrderNo + 1 }));
    }
  
    return () => {
      
    }
  }, [allNoticeBoards])
  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  const { searchStudentAction, searchStudentStatus, searchStd, resetSearch } =
    useStdFeesStore((s) => ({
      searchStudentAction: s.searchStudentAction,
      searchStudentStatus: s.searchStudentStatus,
      searchStd: s.searchStd,
      resetSearch: s.resetSearch,
    }));

  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
  }, [getClassSubjectAction, getClassSubjectStatus]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const handleSearchInput = (val) => {
    setSearchInput({ filters: val });
    if (val?.length >= 1) {
      searchStudentAction({
        sessionMasterId,
        search: val,
      });
    }
  };

  const selectStudent = (std) => {
    resetSearch();
    setSelectedStudent(std);
  };

  const inputRef = useRef();
  const labelClick = () => {
    inputRef.current.click();
  };

  const selectedFile = (file) => {
    if (file?.length) {
      setInputValue((pre) => ({ ...pre, file: file[0] }));
    }
  };

  const addNoticeBoard = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateNoticeBoardAction(inputValue);
    } else {
      addNoticeBoardAction({
        sessionMasterId,
        ...inputValue,
        isStudent: 1,
        students: JSON.stringify([selectedStudent?.promotionId]),
      });
    }
  };

  useEffect(() => {
    if (
      addNoticeBoardStatus === STATUS.SUCCESS ||
      updateNoticeBoardStatus === STATUS.SUCCESS
    ) {
      resetNoticeBoardStatus();
      closeDrawer();
    }
  }, [
    addNoticeBoardStatus,
    closeDrawer,
    resetNoticeBoardStatus,
    updateNoticeBoardStatus,
  ]);

  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addNoticeBoard}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Notice Board" : "Add Notice Board"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <Flex w={"100%"} gap={2}>
                <CustomSelect
                  w={"49%"}
                  name={"isClass"}
                  label={"Select Class"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={[
                    { name: "Class Wise", value: "1" },
                    { name: "Student Wise", value: "0" },
                  ]}
                />
                <CustomInput
                  w={"49%"}
                  type={"date"}
                  name="date"
                  label={"Date"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
              </Flex>
              {inputValue?.isClass === "0" ? (
                <>
                  <CustomInput
                    type={"text"}
                    search={true}
                    name="filters"
                    label={"Search Student"}
                    inputValue={searchInput}
                    setInputValue={handleSearchInput}
                  />
                  <LoadingContainer status={searchStudentStatus}>
                    <Box w={"100%"}>
                      {searchStd?.length ? (
                        <TableContainer mt={5}>
                          <Table>
                            <Thead>
                              <Tr>
                                <Th>SR No.</Th>
                                <Th>Name</Th>
                                <Th>Father&apos;s Name</Th>
                                <Th>Contact</Th>
                                <Th>Class</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {map(searchStd, (std) => (
                                <Tr>
                                  <Td>{std.student_master.srNo}</Td>
                                  <Td
                                    color={"blue.400"}
                                    fontWeight={"semibold"}
                                    cursor={"pointer"}
                                    onClick={() => selectStudent(std)}
                                  >
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
                              ))}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      ) : null}
                      {selectedStudent ? (
                        <Flex
                          my={3}
                          p={2}
                          bg={`${themeColor}.50`}
                          border={"1px solid"}
                          borderColor={"gray.200"}
                          borderRadius={10}
                        >
                          <Box w={"10%"}>
                            <Image
                              h={"70px"}
                              src={`${URL}${selectedStudent.student_master?.photo}`}
                              alt={"Profile"}
                            />
                          </Box>
                          <Box w={"45%"} fontSize={13} fontWeight={"semibold"}>
                            <Flex w={"70%"}>
                              <Text w={"50%"}>Name</Text>
                              <Text>
                                : &nbsp;
                                {selectedStudent.student_master?.studentName}
                              </Text>
                            </Flex>
                            <Flex w={"70%"}>
                              <Text w={"50%"}>Father&apos;s Name</Text>
                              <Text>
                                : &nbsp;
                                {selectedStudent.student_master?.fatherName}
                              </Text>
                            </Flex>
                            <Flex w={"70%"}>
                              <Text w={"50%"}>Contact </Text>
                              <Text>
                                : &nbsp;
                                {selectedStudent.student_master?.fatherContact}
                              </Text>
                            </Flex>
                          </Box>
                          <Box w={"45%"} fontSize={13} fontWeight={"semibold"}>
                            <Flex w={"70%"}>
                              <Text w={"50%"}>Class</Text>
                              <Text>
                                : &nbsp;{selectedStudent.class_master?.name}
                              </Text>
                            </Flex>
                            <Flex w={"70%"}>
                              <Text w={"50%"}>Stream</Text>
                              <Text>
                                : &nbsp;{selectedStudent.stream_master?.name}
                              </Text>
                            </Flex>
                          </Box>
                        </Flex>
                      ) : null}
                    </Box>
                  </LoadingContainer>
                </>
              ) : (
                <>
                  <CustomSelect
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
                </>
              )}
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
              {/* <Flex w={"100%"} border={"1px solid"} borderColor={"gray.200"} p={2} borderRadius={5} onClick={labelClick}>
                                <Text pr={3} borderRight={"1px solid"} borderColor={"gray.200"} fontWeight={"semibold"}>Choose File</Text>
                                <Text ml={3}>{inputValue?.file?.name ? inputValue.file.name : "Select a file"}</Text>
                            </Flex>
                            <Input type="file" ref={inputRef} display={"none"} onChange={(e) => selectedFile(e.target.files)} /> */}
              <UploadFile
                type={"file"}
                data={{ label: "File", name: "file" }}
                accept={"all"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
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
              isLoading={
                addNoticeBoardStatus === STATUS.FETCHING ||
                updateNoticeBoardStatus === STATUS.FETCHING
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
