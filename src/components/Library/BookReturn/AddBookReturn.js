import CustomInput from "@/common/CustomInput";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { URL } from "@/services/apis";
import { useLibraryStore } from "@/store/Library";
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
import { filter, map, sumBy } from "lodash";
import React, { useEffect, useState } from "react";

export const AddBookReturn = ({
  data,
  closeDrawer,
  themeColor,
  sessionMasterId,
}) => {
  const [inputValue, setInputValue] = useState({});

  const {
    addBookReturnAction,
    addBookReturnStatus,
    updateBookReturnAction,
    updateBookReturnStatus,
    resetBookReturnStatus,
    getStdBookAction,
    getStdBookStatus,
    allStdBooks,
  } = useLibraryStore((s) => ({
    addBookReturnAction: s.addBookReturnAction,
    addBookReturnStatus: s.addBookReturnStatus,
    updateBookReturnAction: s.updateBookReturnAction,
    updateBookReturnStatus: s.updateBookReturnStatus,
    resetBookReturnStatus: s.resetBookReturnStatus,
    getStdBookAction: s.getStdBookAction,
    getStdBookStatus: s.getStdBookStatus,
    allStdBooks: s.allStdBooks,
  }));

  const [searchBook, setSearchBook] = useState({});
  const [searchInput, setSearchInput] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(
    data?.id ? data.promotion : null
  );
  const [issuedBook, setIssuedBook] = useState(
    data?.id ? data.book_issue_details : []
  );

  useEffect(() => {
    const temp = map(allStdBooks, (b) => {
      const dif = dayjs().diff(dayjs(b.returnDate), "day");
      return {
        ...b,
        isSelected: false,
        daysDifference: dif,
        penalty: dif > 0 ? dif * 2 : 0,
      };
    });
    setIssuedBook(temp);
  }, [allStdBooks]);

  const handleCheck = (id, name, val) => {
    setIssuedBook(
      map(issuedBook, (b) => (b.id === id ? { ...b, [name]: val } : b))
    );
  };

  const handleSearchBook = (val) => {
    setSearchBook({ accessionFormNo: val });
    if (val?.length === 8) {
      setIssuedBook(
        map(issuedBook, (b) =>
          parseInt(b.accessionFormNo) === parseInt(val)
            ? { ...b, isSelected: true }
            : b
        )
      );
      setSearchBook({ accessionFormNo: "" });
    }
  };

  useEffect(() => {
    const temp = filter(issuedBook, (b) => b.isSelected === true);
    setInputValue({
      totalDayDiff: sumBy(temp, "daysDifference") || "0",
      totalPenalty: sumBy(temp, "penalty") || "0",
    });
  }, [issuedBook]);

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
    getStdBookAction({
      promotionId: std.promotionId,
      status: 0,
    });
    resetSearch();
    setSelectedStudent(std);
  };

  useEffect(() => {
    return () => resetSearch();
  }, [resetSearch]);

  const addBookReturn = () => {
    // e.preventDefault()
    if (data?.id) {
      updateBookReturnAction({
        ...inputValue,
        promotionId: selectedStudent?.id,
        bookData: map(issuedBook, (book) => ({
          catelogId: book.catelogId,
          accessionFormNo: book.accessionFormNo,
          shelfLocationId: book.shelfLocationId,
          accessionId: book.id,
        })),
      });
    } else {
      addBookReturnAction({
        ...inputValue,
        promotionId: selectedStudent?.promotionId,
        bookData: map(issuedBook, (book) => ({
          bookIssueDetailId: book.id,
          accessionId: book.accessionId,
          bookStatus: book.bookStatus,
          depositDate: dayjs().format("YYYY-MM-DD"),
          penalty: book.penalty,
          daysDifference: book.daysDifference > 0 ? book.daysDifference : 0,
        })),
      });
    }
  };

  useEffect(() => {
    if (
      addBookReturnStatus === STATUS.SUCCESS ||
      updateBookReturnStatus === STATUS.SUCCESS
    ) {
      resetBookReturnStatus();
      closeDrawer();
    }
  }, [
    addBookReturnStatus,
    closeDrawer,
    resetBookReturnStatus,
    updateBookReturnStatus,
  ]);

  return (
    <Drawer size={"xl"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      {/* <form onSubmit={addBookReturn}> */}
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {data?.id ? "Edit Book Issue" : "Book Return"}
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
                  value="student"
                  autoFocus={true}
                >
                  Return from student
                </Radio>
                <Radio borderColor={`${themeColor}.400`} value="staff">
                  Return from staff
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
                    {/* <CustomInput w={"48%"} type={"number"} notRequire={true} search={true} limit={8} name="accessionFormNo" label={"Search Accession No/Barcode"} inputValue={searchBook} setInputValue={handleSearchBook} /> */}
                    {/* <CustomInput w={"48%"} type={"text"} notRequire={true} name="barcode" label={"BarCode"} inputValue={inputValue} setInputValue={setInputValue} /> */}
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
                    {issuedBook?.length ? (
                      <>
                        <TableContainer w={"100%"} my={3}>
                          <Table>
                            <Thead>
                              <Tr>
                                <Th>Return</Th>
                                <Th>Accession No</Th>
                                <Th>Book Name</Th>
                                <Th>Shelf</Th>
                                <Th>Issue Date</Th>
                                <Th>Return Date</Th>
                                <Th>Late Days</Th>
                                <Th>Penalty</Th>
                                <Th>Action</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {map(issuedBook, (book, index) => {
                                // const isChecked = findIndex(selectedBook, s => s.id === book.id) !== -1 ? true : false
                                return (
                                  <Tr>
                                    <Td>
                                      <Checkbox
                                        borderColor={`${themeColor}.400`}
                                        colorScheme={themeColor}
                                        isChecked={book.isSelected}
                                        onChange={() =>
                                          handleCheck(
                                            book.id,
                                            "isSelected",
                                            !book.isSelected
                                          )
                                        }
                                      />
                                    </Td>
                                    <Td>{book.accessionFormNo}</Td>
                                    <Td>{book?.accession?.catelog?.name}</Td>
                                    <Td>{book.shelf_location?.name}</Td>
                                    <Td>
                                      {dayjs(book.issueDate).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </Td>
                                    <Td>
                                      {dayjs(book.returnDate).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </Td>
                                    <Td>{book.daysDifference}</Td>
                                    <Td>{book.penalty}</Td>
                                    <Td>
                                      <RadioGroup
                                        colorScheme={themeColor}
                                        onChange={(e) =>
                                          handleCheck(book.id, "bookStatus", e)
                                        }
                                        value={book?.bookStatus}
                                      >
                                        <Stack direction="row" align={"center"}>
                                          <Radio
                                            size={"sm"}
                                            value="2"
                                            borderColor={`${themeColor}.400`}
                                          >
                                            Book Damage
                                          </Radio>
                                          <Radio
                                            size={"sm"}
                                            value="3"
                                            borderColor={`${themeColor}.400`}
                                          >
                                            Book Lost
                                          </Radio>
                                        </Stack>
                                      </RadioGroup>
                                    </Td>
                                  </Tr>
                                );
                              })}
                            </Tbody>
                          </Table>
                        </TableContainer>
                        <CustomInput
                          w={"23%"}
                          type={"number"}
                          name="totalDayDiff"
                          label={"Total Late Days"}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                        />
                        <CustomInput
                          w={"23%"}
                          type={"number"}
                          name="totalPenalty"
                          label={"Total Penalty Amount"}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                        />
                        <CustomInput
                          w={"23%"}
                          type={"number"}
                          name="totalDamage"
                          label={"Total Damage Amount"}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                        />
                        <CustomInput
                          w={"23%"}
                          type={"number"}
                          name="totalLost"
                          label={"Total Lost Amount"}
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
            onClick={addBookReturn}
            isDisabled={issuedBook?.length && selectedStudent ? false : true}
            isLoading={
              addBookReturnStatus === STATUS.FETCHING ||
              updateBookReturnStatus === STATUS.FETCHING
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
