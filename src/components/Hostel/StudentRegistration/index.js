import {
  Avatar,
  Box,
  Button,
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
} from "@chakra-ui/react";
import { map } from "lodash";
import React, { useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { LoadingContainer } from "@/common/LoadingContainer";
import CustomInput from "@/common/CustomInput";
import { FILE_URL, URL } from "@/services/apis";
import { useStdFeesStore } from "@/store/stdFees";
import { AssignRoom } from "./AssignRoom";

export const StudentRegistration = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [searchInput, setSearchInput] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
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

  return (
    <Box>
      <PageHeader heading={"Student Registration"} />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box
          pt={2}
          className="scrollBar"
          h={"100%"}
          maxH={"100%"}
          overflowY={"scroll"}
        >
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
                                src={FILE_URL + std.student_master.photo}
                              />
                              {std.student_master.studentName}
                            </Flex>
                          </Td>
                          <Td>{std.student_master.fatherName}</Td>
                          <Td>{std.student_master.fatherContact}</Td>
                          <Td>
                            {std.class_master.name} - {std.stream_master.name}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : null}
              {selectedStudent ? (
                <>
                  <Flex
                    my={3}
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
                  </Flex>
                  <AssignRoom themeColor={themeColor} />
                </>
              ) : null}
            </Box>
          </LoadingContainer>
        </Box>
      </Box>
    </Box>
  );
};
