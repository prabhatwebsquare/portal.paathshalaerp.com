import CustomInput from "@/common/CustomInput";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
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

export const AddSiblings = ({
  closeDrawer,
  data,
  sessionMasterId,
  themeColor,
}) => {
  const [searchInput, setSearchInput] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(
    data?.id ? { ...data.promotion, promotionId: data.promotion.id } : null
  );
  const [siblings, setSiblings] = useState(
    data?.id
      ? map(data?.moreSibling, (s) => ({
          ...s.promotion,
          promotionId: s.promotion.id,
        }))
      : []
  );

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

  const {
    addSiblingAction,
    addSiblingStatus,
    allSiblings,
    resetSiblingStatus,
  } = useStdFeesStore((s) => ({
    addSiblingAction: s.addSiblingAction,
    addSiblingStatus: s.addSiblingStatus,
    allSiblings: s.allSiblings,
    resetSiblingStatus: s.resetSiblingStatus,
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
    if (selectedStudent?.promotionId) {
      setSiblings((pre) => [...pre, std]);
    } else {
      setSelectedStudent(std);
    }
  };

  const removeSibling = (id) => {
    setSiblings(filter(siblings, (s) => s.promotionId !== id));
  };

  const submitData = () => {
    addSiblingAction({
      sessionMasterId,
      promotionId: selectedStudent.promotionId,
      siblingData: map(siblings, "promotionId"),
    });
  };

  const close = () => {
    setSearchInput({ filters: "" });
    resetSearch();
    setSiblings([]);
    closeDrawer();
  };

  useEffect(() => {
    if (addSiblingStatus === STATUS.SUCCESS) {
      resetSiblingStatus();
      setSearchInput({ filters: "" });
      resetSearch();
      setSiblings([]);
      closeDrawer();
    }
  }, [addSiblingStatus, closeDrawer, resetSearch, resetSiblingStatus]);

  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={close}>
      <DrawerOverlay />
      {/* <form onSubmit={saveDetails}> */}
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {data?.id ? "Edit Siblings" : "Add Siblings"}
        </DrawerHeader>

        <DrawerBody>
          <VStack spacing={3} w={"100%"}>
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
                  <Box w={"60%"} fontSize={13} fontWeight={"semibold"} pr={4}>
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
                        : &nbsp;{selectedStudent.student_master?.fatherContact}
                      </Text>
                    </Flex>
                  </Box>
                  <Box w={"40%"} fontSize={13} fontWeight={"semibold"}>
                    <Flex w={"100%"}>
                      <Text w={"35%"}>Class</Text>
                      <Text>: &nbsp;{selectedStudent.class_master?.name}</Text>
                    </Flex>
                    <Flex w={"100%"}>
                      <Text w={"35%"}>Stream</Text>
                      <Text>: &nbsp;{selectedStudent.stream_master?.name}</Text>
                    </Flex>
                  </Box>
                </Flex>
                <Text mt={5} fontSize={18} fontWeight={"semibold"}>
                  Search Sibling
                </Text>
              </Box>
            ) : null}
            <CustomInput
              type={"text"}
              search={true}
              name="filters"
              label={"Search Student"}
              autoFocus={true}
              inputValue={searchInput}
              setInputValue={handleSearchInput}
            />
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
                  </Box>
                ) : null}
              </Box>
            </LoadingContainer>
            {siblings?.length ? (
              <Box w={"100%"}>
                <Text mt={3} fontSize={18} fontWeight={"semibold"}>
                  Selected Siblings
                </Text>
                <TableContainer mt={5}>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>SR No.</Th>
                        <Th>Name</Th>
                        <Th>Father&apos;s Name</Th>
                        <Th>Contact</Th>
                        <Th>Class</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {map(siblings, (std) => (
                        <Tr>
                          <Td>{std.student_master.srNo}</Td>
                          <Td
                            color={"blue.400"}
                            fontWeight={"semibold"}
                            cursor={"pointer"}
                            // onClick={() => selectStudent(std)}
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
                            {std.class_master.name} - {std.stream_master.name}
                          </Td>
                          <Td>
                            <Tooltip placement="top" label={"Remove"}>
                              <IconButton
                                size={"xs"}
                                variant={"ghost"}
                                colorScheme={"red"}
                                onClick={() => removeSibling(std.promotionId)}
                                icon={<CloseIcon />}
                              />
                            </Tooltip>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            ) : null}
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
          <Button
            size={"sm"}
            isDisabled={siblings?.length ? false : true}
            colorScheme={themeColor}
            isLoading={addSiblingStatus === STATUS.FETCHING}
            onClick={submitData}
          >
            {data?.id ? "Update" : "Add"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
