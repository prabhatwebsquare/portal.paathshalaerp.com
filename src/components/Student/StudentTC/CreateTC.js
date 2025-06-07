import CustomInput from "@/common/CustomInput";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { STATUS } from "@/constant";
import { URL } from "@/services/apis";
import { useStdFeesStore } from "@/store/stdFees";
import { CloseIcon } from "@chakra-ui/icons";
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
  IconButton,
  Image,
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
import { filter, map } from "lodash";
import { useEffect, useState } from "react";

export const CreateTC = ({
  closeDrawer,
  data,
  sessionMasterId,
  themeColor,
}) => {
  const [searchInput, setSearchInput] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [tcDate, setTcDate] = useState("");
  const [causeOfTc, setCauseOfTc] = useState(""); // State for cause of TC
  const [tcNo, settcno] = useState("");
  const {
    searchStudentAction,
    searchStudentStatus,
    searchStd,
    resetSearch,
    tcCreateAction,
    tcStudentStatus,
    tccResetAction,
  } = useStdFeesStore((s) => ({
    searchStudentAction: s.searchStudentAction,
    searchStudentStatus: s.searchStudentStatus,
    searchStd: s.searchStd,
    resetSearch: s.resetSearch,
    tcCreateAction: s.tcCreateAction,
    tcStudentStatus: s.tcStudentStatus,
    tccResetAction: s.tccResetAction,
  }));

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
    setSearchInput({ filters: "" });
    setSelectedStudent(std);
  };

  const submitData = () => {
    const temp = {
      sessionMasterId,
      promotionId: selectedStudent.promotionId,
      status: 3,
      type: "tcissue",
      remark: causeOfTc.causeOfTc,
      date: tcDate.tcDate,
    };
    tcCreateAction(temp);
    closeDrawer();
    resetSearch();
    setSelectedStudent(null);
    setCauseOfTc("");
    settcno("");
    setTcDate("");
  };

  const close = () => {
    setSearchInput({ filters: "" });
    resetSearch();
    closeDrawer();
  };
  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={close}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Create TC</DrawerHeader>

        <DrawerBody>
          <VStack spacing={3} w={"100%"}>
            <CustomInput
              type={"text"}
              search={true}
              name="filters"
              label={"Search Student"}
              autoFocus={true}
              inputValue={searchInput}
              setInputValue={handleSearchInput}
            />
            {searchStudentStatus === STATUS.NOT_STARTED &&
            !searchStd?.length &&
            !selectedStudent ? (
              <Flex mt={5} w={"100%"} align={"center"} flexDir={"column"}>
                <Image
                  h="300px"
                  src="/assets/student.png"
                  alt="Search Student"
                />
                <Text fontSize={18} fontWeight={"semibold"}>
                  Search Student
                </Text>
              </Flex>
            ) : null}
            <LoadingContainer status={searchStudentStatus}>
              <Box w={"100%"}>
                {searchStd?.length ? (
                  <Box className="scrollBar" maxH={"40vh"} overflowY={"scroll"}>
                    <TableContainer mt={5}>
                      <Table>
                        <Thead>
                          <Tr>
                            <Th>SR No.</Th>
                            <Th>Name</Th>
                            <Th>Father&apos;s Name</Th>
                            <Th>Mother&apos;s Name</Th>
                            <Th>Contact</Th>
                            <Th>Class</Th>
                            <Th>Admission No.</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {map(searchStd, (std) => (
                            <Tr key={std.student_master.srNo}>
                              <Td>{std.student_master.srNo}</Td>
                              <Td
                                color={"blue.400"}
                                fontWeight={"semibold"}
                                cursor={"pointer"}
                                onClick={() => selectStudent(std)}
                              >
                                <Avatar
                                  size={"xs"}
                                  mr={3}
                                  src={`${URL}${std.student_master?.photo}`}
                                />
                                {std.student_master.studentName}
                              </Td>
                              <Td>{std.student_master.fatherName}</Td>
                              <Td>{std.student_master.motherName}</Td>
                              <Td>{std.student_master.fatherContact}</Td>
                              <Td>
                                {std.class_master.name} -{" "}
                                {std.stream_master.name}
                              </Td>
                              <Td>{std.student_master.admissionNo}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Box>
                ) : searchStudentStatus === STATUS.SUCCESS ? (
                  <NoData title={"No Student Found"} />
                ) : null}
              </Box>

              {selectedStudent ? (
                <Box w={"100%"}>
                  <Flex
                    my={3}
                    p={2}
                    bg={`${themeColor}.50`}
                    border={"1px solid"}
                    borderColor={"gray.200"}
                    borderRadius={10}
                  >
                    <Box w={"10%"}>
                      <Avatar
                        size={"md"}
                        src={`${URL}${selectedStudent.student_master?.photo}`}
                      />
                    </Box>
                    <Box w={"45%"} fontSize={13} fontWeight={"semibold"} pr={4}>
                      <Flex w={"100%"}>
                        <Text w={"30%"}>Name</Text>
                        <Text>
                          : &nbsp;{selectedStudent.student_master?.studentName}
                        </Text>
                      </Flex>
                      <Flex w={"100%"}>
                        <Text w={"30%"}>Father&apos;s Name</Text>
                        <Text>
                          : &nbsp;{selectedStudent.student_master?.fatherName}
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
                    <Box w={"45%"} fontSize={13} fontWeight={"semibold"}>
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
                  <CustomInput
                    type="text"
                    my={2}
                    name="tcNo"
                    label="Tc No."
                    inputValue={tcNo}
                    setInputValue={settcno}
                  />
                  <CustomInput
                    type="date"
                    name="tcDate"
                    my={2}
                    label="Enter The TC Date"
                    inputValue={tcDate}
                    setInputValue={setTcDate}
                  />
                  <CustomInput
                    type="text"
                    name="causeOfTc"
                    my={2}
                    label="Reason for issuing TC"
                    inputValue={causeOfTc}
                    setInputValue={setCauseOfTc}
                    placeholder="Reason for issuing TC"
                  />
                </Box>
              ) : null}
            </LoadingContainer>
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <Button
            size={"sm"}
            variant="outline"
            mr={3}
            colorScheme={"red"}
            onClick={close}
          >
            Cancel
          </Button>
          <Button size={"sm"} colorScheme={themeColor} onClick={submitData}>
            {data?.id ? "Update" : "Create"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
