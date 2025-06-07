import CustomInput from "@/common/CustomInput";
import CustomTextarea from "@/common/CustomTextarea";
import { LoadingContainer } from "@/common/LoadingContainer";
import { FILE_URL } from "@/services/apis";
import { useStdFeesStore } from "@/store/stdFees";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
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
import { useEffect, useState } from "react";
export const AddRustication = ({
  data,
  closeDrawer,
  sessionMasterId,
  themeColor,
}) => {
  const [inputValue, setInputValue] = useState({});
  const [searchInput, setSearchInput] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(
    data?.id ? data.promotion : null
  );

  const today = format(new Date(), "yyyy-MM-dd");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your submit logic here
  };

  useEffect(() => {
    return () => resetSearch();
  }, [resetSearch]);

  return (
    <form onSubmit={handleSubmit}>
      <Drawer size={"lg"} isOpen={data} onClose={closeDrawer}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            {data?.id ? "Edit Rustication" : "Add Rustication"}
          </DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody>
            <VStack>
              <CustomInput
                type={"text"}
                search={true}
                notRequire={true}
                name="filters"
                label={"Search Student"}
                autoFocus={true}
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
                                    src={`${FILE_URL}${std.student_master.photo}`}
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
                    <Flex flexWrap={"wrap"} gap={3}>
                      <Flex
                        w={"100%"}
                        p={2}
                        bg={`${themeColor}.50`}
                        border={"1px solid"}
                        borderColor={"gray.200"}
                        borderRadius={10}
                      >
                        <Box w={"15%"}>
                          <Avatar
                            mr={3}
                            size={"lg"}
                            src={`${FILE_URL}${selectedStudent.student_master.photo}`}
                          />
                        </Box>
                        <Box w={"60%"} fontSize={13} fontWeight={"semibold"}>
                          <Flex w={"100%"}>
                            <Text w={"35%"}>Name</Text>
                            <Text>
                              : &nbsp;
                              {selectedStudent.student_master?.studentName}
                            </Text>
                          </Flex>
                          <Flex w={"100%"}>
                            <Text w={"35%"}>Father&apos;s Name</Text>
                            <Text>
                              : &nbsp;
                              {selectedStudent.student_master?.fatherName}
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
                      <CustomInput
                        w={"48%"}
                        size={"sm"}
                        type={"date"}
                        autoFocus={true}
                        name="rusticationDate"
                        label={"Rustication Date"}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        max={today}
                      />
                      <CustomTextarea
                        size={"sm"}
                        name="reason"
                        label={"Reason of Rustication"}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                    </Flex>
                  ) : null}
                </Box>
              </LoadingContainer>
            </VStack>
          </DrawerBody>
          <Flex
            justifyContent={"space-between"}
            p={4}
            borderTop={"1px solid"}
            borderColor={"gray.200"}
          >
            <Box
              as={"button"}
              px={4}
              py={2}
              bg={`${themeColor}.500`}
              color={"white"}
              borderRadius={"md"}
              fontWeight={"semibold"}
              _hover={{ bg: `${themeColor}.600` }}
              onClick={handleSubmit}
            >
              Submit
            </Box>
            <Box
              as={"button"}
              px={4}
              py={2}
              bg={"gray.200"}
              borderRadius={"md"}
              fontWeight={"semibold"}
              _hover={{ bg: "gray.300" }}
              onClick={closeDrawer}
            >
              Cancel
            </Box>
          </Flex>
        </DrawerContent>
      </Drawer>
    </form>
  );
};
