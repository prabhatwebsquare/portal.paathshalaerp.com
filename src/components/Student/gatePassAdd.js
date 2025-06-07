import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  VStack,
  Text,
  Td,
  Avatar,
  Flex,
  Tr,
  Tbody,
  Th,
  Thead,
  Table,
  TableContainer,
  Box,
  HStack,
} from "@chakra-ui/react";
import { CustomSelect } from "@/common/CustomSelect";
import CustomInput from "@/common/CustomInput";
import { SearchStudent } from "@/layout/SearchStudent";
import { LoadingContainer } from "@/common/LoadingContainer";
import { useStdFeesStore } from "@/store/stdFees";
import { isEqual, map, omitBy } from "lodash";
import { URL } from "@/services/apis";
import moment from "moment";
import { useStaffStore } from "@/store/StaffStore";
import { STATUS } from "@/constant";
import { ErrorAlert } from "@/utils/Helper";
import { useStudentStore } from "@/store/studentStore";

export default function GatePassAdd({ sessionMasterId, themeColor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState({});

  useEffect(() => {
    const currentTime = moment().format("HH:mm"); // format for <input type="time" />
    const todayDate = moment().format("YYYY-MM-DD");

    setInputValue({
      timeout: currentTime,
      date: todayDate,
    });
  }, []);
  const openDrawer = () => setIsOpen(true);

  const { searchStudentAction, searchStudentStatus, searchStd, resetSearch } =
    useStdFeesStore((s) => ({
      searchStudentAction: s.searchStudentAction,
      searchStudentStatus: s.searchStudentStatus,
      searchStd: s.searchStd,
      resetSearch: s.resetSearch,
    }));
  const [searchInput, setSearchInput] = useState({});
  const handleSearchInput = (val) => {
    setSearchInput({ filters: val });
    if (val?.length >= 1) {
      searchStudentAction({
        sessionMasterId,
        search: val,
      });
    }
  };

  const [selectedStudent, setSelectedStudent] = useState(null);
  const selectStudent = (std) => {
    resetSearch();
    setSearchInput({ filters: "" });
    setSelectedStudent(std);
  };
  const { addPassAction, addPassStatus, allPasses, resetPassStatus } =
    useStudentStore((s) => ({
      addPassAction: s.addPassAction,
      addPassStatus: s.addPassStatus,
      allPasses: s.allPasses,
      resetPassStatus: s.resetPassStatus,
    }));
  const { getStaffAction, getStaffStatus, allStaffs } = useStaffStore((s) => ({
    getStaffAction: s.getStaffAction,
    getStaffStatus: s.getStaffStatus,
    allStaffs: s.allStaffs,
  }));

  useEffect(() => {
    if ((getStaffStatus || 1) === STATUS.NOT_STARTED) {
      getStaffAction();
    }
  }, [getStaffAction, getStaffStatus]);
  const principals = useMemo(() => {
    const result =
      allStaffs?.filter((data) => data.designation === "Principal") || [];
    return [...result, { name: "N/A", id: "NO" }];
  }, [allStaffs]);

  const Teacher = useMemo(() => {
    const result =
      allStaffs?.filter((data) => data.designation === "Teacher") || [];
    return [...result, { name: "N/A", id: "NO" }];
  }, [allStaffs]);

  const Admin = useMemo(() => {
    const result =
      allStaffs?.filter((data) => data.designation === "Admin") || [];
    return [...result, { name: "N/A", id: "NO" }];
  }, [allStaffs]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const isStudent = inputValue.gatepassType === "student";
  //   if (isStudent && !selectedStudent) {
  //     ErrorAlert("Please select a student.");
  //     return;
  //   }
  //   if (isStudent) {
  //     const approvals = [
  //       inputValue.classTeacherId,
  //       inputValue.hodId,
  //       inputValue.principalId,
  //     ];

  //     const filledApprovals = approvals.filter((val) => val);
  //     const noCount = filledApprovals.filter((val) => val === "NO").length;

  //     if (
  //       filledApprovals.length === 0 ||
  //       noCount === 3 ||
  //       filledApprovals.length - noCount < 1
  //     ) {
  //       ErrorAlert(
  //         "Please get at least one valid approval. All three cannot be NO or empty."
  //       );
  //       return;
  //     }
  //   }
  //   const data = {
  //     ...inputValue,
  //     promotionId:
  //       inputValue.gatepassType === "student"
  //         ? [selectedStudent?.promotionId]
  //         : undefined,
  //     sessionMasterId,

  //   };
  //   if (inputValue.principalId && inputValue.principalId !== "NO") {
  //     data.principalId = inputValue.principalId;
  //   }

  //   if (inputValue.classTeacherId && inputValue.classTeacherId !== "NO") {
  //     data.classTeacherId = inputValue.classTeacherId;
  //   }

  //   if (inputValue.hodId && inputValue.hodId !== "NO") {
  //     data.hodId = inputValue.hodId;
  //   }
  //   addPassAction(data);
  // };
  const handleSubmit = (e) => {
    e.preventDefault();

    const isStudent = inputValue.gatepassType === "student";

    if (isStudent && !selectedStudent) {
      ErrorAlert("Please select a student.");
      return;
    }

    if (isStudent) {
      const approvals = [
        inputValue.classTeacherId,
        inputValue.hodId,
        inputValue.principalId,
      ];

      const filledApprovals = approvals.filter(Boolean);
      const noCount = filledApprovals.filter((val) => val === "NO").length;

      if (
        filledApprovals.length === 0 ||
        noCount === 3 ||
        filledApprovals.length - noCount < 1
      ) {
        ErrorAlert(
          "Please get at least one valid approval. All three cannot be NO or empty."
        );
        return;
      }
    }

    const cleanedInput = omitBy(inputValue, (val) => isEqual(val, "NO"));

    const data = {
      ...cleanedInput,
      sessionMasterId,
      promotionId: isStudent ? [selectedStudent?.promotionId] : undefined,
    };

    addPassAction(data);
    setIsOpen(false);
    const currentTime = moment().format("HH:mm");
    const todayDate = moment().format("YYYY-MM-DD");
    setInputValue({
      timeout: currentTime,
      date: todayDate,
    });
    setSelectedStudent(null);
  };

  useEffect(() => {
    if (addPassStatus === STATUS.SUCCESS) {
      closeDrawer();
      resetSearch();
      setIsOpen(false);
    }
    return () => {};
  }, []);

  return (
    <>
      <Button onClick={openDrawer} colorScheme="blue" size={"sm"} mr={3}>
        Add Gate Pass
      </Button>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={() => setIsOpen(false)}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add Gate Pass</DrawerHeader>
          <form onSubmit={handleSubmit}>
            <DrawerBody>
              <VStack align="start" spacing={4}>
                <CustomSelect
                  w={"100%"}
                  name={"gatepassType"}
                  label={"Select Gate Pass Type"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={[
                    { name: "Student", value: "student" },
                    { name: "Staff", value: "staff" },
                  ]}
                />

                {inputValue.gatepassType === "student" && (
                  <>
                    <CustomInput
                      type={"text"}
                      search={true}
                      notRequire
                      name="filters"
                      label={"Search Student"}
                      autoFocus={true}
                      inputValue={searchInput}
                      setInputValue={handleSearchInput}
                    />
                    <LoadingContainer status={searchStudentStatus}>
                      <Box>
                        {searchStd?.length ? (
                          <Box
                            className="scrollBar"
                            maxH={"40vh"}
                            overflowY={"scroll"}
                            width={"100%"}
                          >
                            <TableContainer mt={0}>
                              <Table>
                                <Thead>
                                  <Tr>
                                    <Th>Name</Th>
                                    <Th>Father&apos;s Name</Th>
                                    <Th>Contact</Th>
                                    <Th>Class</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {map(searchStd, (std) => (
                                    <Tr>
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
                                            src={`${URL}${std.student_master.photo}`}
                                          />
                                          {std.student_master.studentName}
                                        </Flex>
                                      </Td>
                                      <Td>{std.student_master.fatherName}</Td>
                                      <Td>
                                        {std.student_master.fatherContact}
                                      </Td>
                                      <Td>
                                        {std.class_master.name} -{" "}
                                        {std.stream_master.name}
                                      </Td>
                                    </Tr>
                                  ))}
                                </Tbody>
                              </Table>
                            </TableContainer>
                          </Box>
                        ) : null}
                      </Box>
                    </LoadingContainer>
                    {selectedStudent ? (
                      <Box w={"100%"}>
                        <Flex
                          my={0}
                          p={2}
                          bg={`${themeColor}.50`}
                          border={"1px solid"}
                          borderColor={"gray.200"}
                          borderRadius={10}
                        >
                          <Box
                            w={"60%"}
                            fontSize={13}
                            fontWeight={"semibold"}
                            pr={4}
                          >
                            <Flex w={"100%"}>
                              <Text w={"30%"}>Name</Text>
                              <Text>
                                : &nbsp;
                                {selectedStudent.student_master?.studentName}
                              </Text>
                            </Flex>
                            <Flex w={"100%"}>
                              <Text w={"30%"}>Father&apos;s Name</Text>
                              <Text>
                                : &nbsp;
                                {selectedStudent.student_master?.fatherName}
                              </Text>
                            </Flex>
                            <Flex w={"100%"}>
                              <Text w={"30%"}>Contact </Text>
                              <Text>
                                : &nbsp;
                                {selectedStudent.student_master?.fatherContact}
                              </Text>
                            </Flex>
                          </Box>
                          <Box w={"40%"} fontSize={13} fontWeight={"semibold"}>
                            <Flex w={"100%"}>
                              <Text w={"35%"}>Class</Text>
                              <Text>
                                : &nbsp;{selectedStudent.class_master?.name}
                              </Text>
                            </Flex>
                            <Flex w={"100%"}>
                              <Text w={"35%"}>Stream</Text>
                              <Text>
                                : &nbsp;{selectedStudent.stream_master?.name}
                              </Text>
                            </Flex>
                          </Box>
                        </Flex>
                      </Box>
                    ) : null}
                    <CustomInput
                      size={"md"}
                      type={"text"}
                      name={"reason"}
                      label={"Reason for Leaving"}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                    />
                    <HStack
                      align="center"
                      spacing={8}
                      w="100%"
                      justify="center"
                    >
                      <CustomInput
                        size={"md"}
                        w={"48%"}
                        type={"date"}
                        name={"date"}
                        label={"Date"}
                        disabled
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                      <CustomInput
                        size={"md"}
                        w={"48%"}
                        type={"time"}
                        name={"timeout"}
                        disabled
                        label={"Time Out"}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                    </HStack>

                    <Text fontWeight={"bold"}>Approval Section</Text>

                    <CustomSelect
                      size={"md"}
                      name={"classTeacherId"}
                      label={"Class Teacher Name"}
                      notRequire
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      data={map(Teacher, (staff) => ({
                        name: staff.name,
                        value: staff.id,
                      }))}
                    />
                    <CustomSelect
                      size={"md"}
                      name={"hodId"}
                      notRequire
                      label={"HOD Name"}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      data={map(Admin, (staff) => ({
                        name: staff.name,
                        value: staff.id,
                      }))}
                    />
                    <CustomSelect
                      size={"md"}
                      name={"principalId"}
                      notRequire
                      label={"Principal Approval (Optional)"}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      data={map(principals, (staff) => ({
                        name: staff.name,
                        value: staff.id,
                      }))}
                    />
                  </>
                )}

                {/* STAFF GATE PASS FORM */}
                {inputValue.gatepassType === "staff" && (
                  <>
                    <CustomSelect
                      size={"md"}
                      name={"staffId"}
                      label={"Select Staff"}
                      
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      data={map(allStaffs, (staff) => ({
                        name: staff.name,
                        value: staff.id,
                      }))}
                    />

                    <CustomInput
                      size={"md"}
                      type={"date"}
                      name={"date"}
                      label={"Date"}
                      disabled
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                    />
                    <CustomInput
                      size={"md"}
                      type={"time"}
                      name={"timeout"}
                      label={"Time Out"}
                      disabled
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                    />
                    <CustomInput
                      size={"md"}
                      type={"text"}
                      name={"reason"}
                      notRequire={true}
                      label={"Reason for Leaving"}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                    />

                    <Text fontWeight={"bold"}>Approval Section</Text>
                    <CustomSelect
                      size={"md"}
                      name={"hodId"}
                      notRequire
                      label={"HOD Name"}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      data={map(Admin, (staff) => ({
                        name: staff.name,
                        value: staff.id,
                      }))}
                    />
                    <CustomSelect
                      size={"md"}
                      name={"principalId"}
                      notRequire
                      label={"Principal Approval (Optional)"}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      data={map(principals, (staff) => ({
                        name: staff.name,
                        value: staff.id,
                      }))}
                    />
                  </>
                )}
              </VStack>
            </DrawerBody>
            <DrawerFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Submit
              </Button>
              <Button onClick={() => setIsOpen(false)}>Cancel</Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
}
