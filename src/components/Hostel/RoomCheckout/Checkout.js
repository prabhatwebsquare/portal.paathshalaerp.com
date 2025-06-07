import CustomInput from "@/common/CustomInput";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { STATUS } from "@/constant";
import { URL } from "@/services/apis";
import { useStdFeesStore } from "@/store/stdFees";
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
import { map } from "lodash";
import React, { useEffect, useState } from "react";

export const AddNewCheckout = ({
  data,
  closeDrawer,
  sessionMasterId,
  themeColor,
}) => {
  const [inputValue, setInputValue] = useState({});

  const [searchInput, setSearchInput] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  const { searchStudentAction, searchStudentStatus, searchStd, resetSearch } =
    useStdFeesStore((s) => ({
      searchStudentAction: s.searchStudentAction,
      searchStudentStatus: s.searchStudentStatus,
      searchStd: s.searchStd,
      resetSearch: s.resetSearch,
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
    setSelectedStudent(std);
  };

  useEffect(() => {
    return () => resetSearch();
  }, [resetSearch]);

  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      {/* <form onSubmit={addItem}> */}
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {data?.id ? "Edit Checkout" : "Add Checkout"}
        </DrawerHeader>

        <DrawerBody>
          <Box>
            <CustomInput
              type={"text"}
              search={true}
              name="filters"
              label={"Search Student"}
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
              <Box>
                {searchStd?.length ? (
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
                                  src={`${URL}${std.student_master.photo}`}
                                />
                                {std.student_master.studentName}
                              </Flex>
                            </Td>
                            <Td>{std.student_master.fatherName}</Td>
                            <Td>{std.student_master.motherName}</Td>
                            <Td>{std.student_master.fatherContact}</Td>
                            <Td>
                              {std.class_master.name} - {std.stream_master.name}
                            </Td>
                            <Td>{std.student_master.admissionNo}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                ) : searchStudentStatus === STATUS.SUCCESS ? (
                  <NoData title={"No Student Found"} />
                ) : null}
                {selectedStudent ? (
                  // <Flex flexWrap={"wrap"} gap={3}>
                  <Flex
                    mt={2}
                    w={"100%"}
                    p={2}
                    bg={`${themeColor}.50`}
                    border={"1px solid"}
                    borderColor={"gray.200"}
                    borderRadius={10}
                  >
                    <Box w={"15%"}>
                      <Image
                        h={"70px"}
                        src={`${URL}${selectedStudent.student_master?.photo}`}
                        alt={"Profile"}
                      />
                    </Box>
                    <Box w={"60%"} fontSize={13} fontWeight={"semibold"}>
                      <Flex w={"100%"}>
                        <Text w={"35%"}>Name</Text>
                        <Text>
                          : &nbsp;{selectedStudent.student_master?.studentName}
                        </Text>
                      </Flex>
                      <Flex w={"100%"}>
                        <Text w={"35%"}>Father&apos;s Name</Text>
                        <Text>
                          : &nbsp;{selectedStudent.student_master?.fatherName}
                        </Text>
                      </Flex>
                      <Flex w={"100%"}>
                        <Text w={"35%"}>Contact </Text>
                        <Text>
                          : &nbsp;
                          {selectedStudent.student_master?.fatherContact}
                        </Text>
                      </Flex>
                    </Box>
                    <Box w={"40%"} fontSize={13} fontWeight={"semibold"}>
                      <Flex w={"90%"}>
                        <Text w={"40%"}>Class</Text>
                        <Text>
                          : &nbsp;{selectedStudent.class_master?.name}
                        </Text>
                      </Flex>
                      <Flex w={"90%"}>
                        <Text w={"40%"}>Stream</Text>
                        <Text>
                          : &nbsp;{selectedStudent.stream_master?.name}
                        </Text>
                      </Flex>
                    </Box>
                    {/* {toggleViewSibling && <ViewSiblings id={toggleViewSibling} closeModal={() => setToggleViewSibling(null)} themeColor={themeColor} selectSibling={selectSibling} />} */}
                  </Flex>
                ) : null}
              </Box>
            </LoadingContainer>
          </Box>
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
          <Button size={"sm"} type={"submit"} colorScheme={themeColor}>
            {data?.id ? "Update" : "Checkout"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
      {/* </form> */}
    </Drawer>
  );
};
