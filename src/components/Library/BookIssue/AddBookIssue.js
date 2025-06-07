import CustomArrayInput from "@/common/CustomArrayInput";
import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { URL } from "@/services/apis";
import { useLibraryStore } from "@/store/Library";
import { useStdFeesStore } from "@/store/stdFees";
import { DeleteIcon } from "@chakra-ui/icons";
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
  Radio,
  RadioGroup,
  Stack,
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
import { cloneDeep, map } from "lodash";
import React, { useEffect, useState } from "react";

export const AddBookIssue = ({
  data,
  closeDrawer,
  themeColor,
  sessionMasterId,
}) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          issueDate: data.issueDate
            ? dayjs(data.issueDate).format("YYYY-MM-DD")
            : "",
          returnDate: data.returnDate
            ? dayjs(data.returnDate).format("YYYY-MM-DD")
            : "",
          id: data.id,
        }
      : {
          issueDate: dayjs().format("YYYY-MM-DD"),
          returnDate: dayjs().format("YYYY-MM-DD"),
        }
  );

  const {
    addBookIssueAction,
    addBookIssueStatus,
    updateBookIssueAction,
    updateBookIssueStatus,
    resetBookIssueStatus,
  } = useLibraryStore((s) => ({
    addBookIssueAction: s.addBookIssueAction,
    addBookIssueStatus: s.addBookIssueStatus,
    updateBookIssueAction: s.updateBookIssueAction,
    updateBookIssueStatus: s.updateBookIssueStatus,
    resetBookIssueStatus: s.resetBookIssueStatus,
  }));
  const {
    getSearchAccessionAction,
    getSearchAccessionStatus,
    allSearchAccessions,
    resetSearchAccession,
  } = useLibraryStore((s) => ({
    getSearchAccessionAction: s.getSearchAccessionAction,
    getSearchAccessionStatus: s.getSearchAccessionStatus,
    allSearchAccessions: s.allSearchAccessions,
    resetSearchAccession: s.resetSearchAccession,
  }));

  const [searchInput, setSearchInput] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(
    data?.id ? data.promotion : null
  );
  const [searchBook, setSearchBook] = useState({});
  const [selectedBook, setSelectedBook] = useState(
    data?.id ? map(data.book_issue_details, "accession") : []
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

  const handleSearchBook = (val) => {
    setSearchBook({ accessionFormNo: val });
    if (val?.length === 8) {
      getSearchAccessionAction({
        search: val,
      });
    }
  };

  // const selectBook = (book) => {
  //     resetSearchAccession()
  //     setSearchBook({ accessionFormNo: "" })
  //     if (selectedBook?.length) {
  //         setSelectedBook(pre => ([...pre, book]))
  //     }
  //     else {
  //         setSelectedBook([book])
  //     }
  // }

  useEffect(() => {
    if (allSearchAccessions) {
      resetSearchAccession();
      setSearchBook({ accessionFormNo: "" });
      if (selectedBook?.length) {
        setSelectedBook((pre) => [...pre, allSearchAccessions]);
      } else {
        setSelectedBook([allSearchAccessions]);
      }
    }
  }, [allSearchAccessions, resetSearchAccession, selectedBook]);

  const deleteBookArray = (index) => {
    const newData = cloneDeep(selectedBook);
    newData.splice(index, 1);
    setSelectedBook(newData);
  };

  useEffect(() => {
    return () => resetSearchAccession();
  }, [resetSearchAccession]);

  const addBookIssue = () => {
    if (data?.id) {
      updateBookIssueAction({
        ...inputValue,
        sessionMasterId,
        promotionId: selectedStudent?.id,
        bookData: map(selectedBook, (book) => ({
          catelogId: book.catelogId,
          accessionFormNo: book.accessionFormNo,
          shelfLocationId: book.shelfLocationId,
          accessionId: book.id,
        })),
      });
    } else {
      addBookIssueAction({
        ...inputValue,
        sessionMasterId,
        promotionId: selectedStudent?.promotionId,
        bookData: map(selectedBook, (book) => ({
          catelogId: book.catelogId,
          accessionFormNo: book.accessionFormNo,
          shelfLocationId: book.shelfLocationId,
          accessionId: book.id,
        })),
      });
    }
  };

  useEffect(() => {
    if (
      addBookIssueStatus === STATUS.SUCCESS ||
      updateBookIssueStatus === STATUS.SUCCESS
    ) {
      resetBookIssueStatus();
      closeDrawer();
    }
  }, [
    addBookIssueStatus,
    closeDrawer,
    resetBookIssueStatus,
    updateBookIssueStatus,
  ]);

  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      {/* <form onSubmit={addBookIssue}> */}
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {data?.id ? "Edit Book Issue" : "Book Issue"}
        </DrawerHeader>

        <DrawerBody>
          <VStack spacing={3}>
            <RadioGroup
              mb={2}
              w={"100%"}
              colorScheme={themeColor}
              onChange={(e) => inputHandler("type", e)}
              value={inputValue?.type}
            >
              <Stack direction="row" fontWeight={"semibold"}>
                <Radio
                  borderColor={`${themeColor}.400`}
                  fontWeight={"bold"}
                  value="student"
                  autoFocus={true}
                >
                  Issue to student
                </Radio>
                <Radio
                  borderColor={`${themeColor}.400`}
                  fontWeight={"bold"}
                  value="staff"
                >
                  Issue to staff
                </Radio>
              </Stack>
            </RadioGroup>
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
                                  src={`${URL}${std.student_master.photo}`}
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
                            : &nbsp;
                            {selectedStudent.student_master?.studentName}
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
                    <CustomInput
                      type={"number"}
                      autoFocus={true}
                      notRequire={true}
                      search={true}
                      limit={8}
                      name="accessionFormNo"
                      label={"Search Accession No/Barcode"}
                      inputValue={searchBook}
                      setInputValue={handleSearchBook}
                    />
                    {/* <CustomInput w={"48%"} type={"text"} notRequire={true} name="barcode" label={"BarCode"} inputValue={inputValue} setInputValue={setInputValue} /> */}
                    <Box w={"100%"}>
                      <LoadingContainer status={getSearchAccessionStatus}>
                        {/* {allSearchAccessions ?
                                                        <TableContainer>
                                                            <Table>
                                                                <Thead>
                                                                    <Tr>
                                                                        <Th>Book Name</Th>
                                                                        <Th>Author</Th>
                                                                        <Th>Accession No</Th>
                                                                        <Th>Shelf</Th>
                                                                    </Tr>
                                                                </Thead>
                                                                <Tbody>
                                                                    {allSearchAccessions ?
                                                                        <Tr cursor={"pointer"} _hover={{ bg: "gray.100" }} onClick={() => selectBook(allSearchAccessions)}>
                                                                            <Td>{allSearchAccessions.catelog?.name}</Td>
                                                                            <Td>{allSearchAccessions.catelog?.author}</Td>
                                                                            <Td>{allSearchAccessions.accessionFormNo}</Td>
                                                                            <Td>{allSearchAccessions.shelf_location?.name}</Td>
                                                                        </Tr>
                                                                        :
                                                                        null
                                                                    }
                                                                </Tbody>
                                                            </Table>
                                                        </TableContainer>
                                                        :
                                                        null
                                                    } */}
                      </LoadingContainer>
                    </Box>
                    {selectedBook?.length ? (
                      <>
                        <TableContainer w={"100%"} my={3}>
                          <Table>
                            <Thead>
                              <Tr>
                                <Th>Book Name</Th>
                                <Th>Author</Th>
                                <Th>Accession No</Th>
                                <Th>Shelf</Th>
                                <Th>Action</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {map(selectedBook, (book, index) => (
                                <Tr>
                                  <Td>{book.catelog?.name}</Td>
                                  <Td>{book.catelog?.author}</Td>
                                  <Td>{book.accessionFormNo}</Td>
                                  <Td>{book.shelf_location?.name}</Td>
                                  <Td>
                                    <IconButton
                                      size={"xs"}
                                      variant={"ghost"}
                                      colorScheme={"red"}
                                      onClick={() => deleteBookArray(index)}
                                      icon={<DeleteIcon />}
                                    />
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </TableContainer>
                        <CustomInput
                          w={"48%"}
                          type={"date"}
                          name="issueDate"
                          label={"Issue Date"}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                        />
                        <CustomInput
                          w={"48%"}
                          type={"date"}
                          name="returnDate"
                          label={"Return Date"}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                        />
                      </>
                    ) : null}
                  </Flex>
                ) : null}
              </Box>
            </LoadingContainer>
            {/* <CustomSelect name="name" label={"Select Book"} inputValue={inputValue} setInputValue={setInputValue} />
                            <CustomInput type={"text"} name="name" label={"Quantity"} inputValue={inputValue} setInputValue={setInputValue} /> */}
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
            onClick={addBookIssue}
            isDisabled={selectedBook?.length && selectedStudent ? false : true}
            isLoading={
              addBookIssueStatus === STATUS.FETCHING ||
              updateBookIssueStatus === STATUS.FETCHING
            }
            colorScheme={themeColor}
          >
            {data?.id ? "Update" : "Add"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
      {/* </form> */}
    </Drawer>
  );
};
