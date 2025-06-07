import CustomInput from "@/common/CustomInput";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useStdFeesStore } from "@/store/stdFees";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  IconButton,
  Image,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { filter, map, sumBy, toUpper } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MdCurrencyRupee,
  MdDirectionsBus,
  MdLocalPrintshop,
  MdSchool,
} from "react-icons/md";
import { NoData } from "@/common/NoData";
import { ReceiptDrawer } from "../ReceiptDrawer";
import { URL } from "@/services/apis";
import { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import { FeesCertificate } from "./FeesCertificate";
import { PageHeader } from "@/common/PageHeader";
import { SchoolHeader } from "@/common/SchoolHeader";

export const FeesLedger = ({ themeColor, sessionMasterId }) => {
  const { query } = useRouter();
  const [searchInput, setSearchInput] = useState({});
  const school = useMemo(() => getLocalStorageItem("user"), []);
  const [toggleReceiptModal, setToggleReceiptModal] = useState(null);

  const {
    searchStudentAction,
    searchStudentStatus,
    searchStd,
    resetSearch,
    getFeesLedgerAction,
    getFeesLedgerStatus,
    feesLedger,
    resetFeesLedger,
    getFeesReceiptAction,
    getFeesReceiptStatus,
    feeReceiptData,
    resetFeesReceipt,
  } = useStdFeesStore((s) => ({
    searchStudentAction: s.searchStudentAction,
    searchStudentStatus: s.searchStudentStatus,
    searchStd: s.searchStd,
    resetSearch: s.resetSearch,
    getFeesLedgerAction: s.getFeesLedgerAction,
    getFeesLedgerStatus: s.getFeesLedgerStatus,
    feesLedger: s.feesLedger,
    resetFeesLedger: s.resetFeesLedger,
    getFeesReceiptAction: s.getFeesReceiptAction,
    getFeesReceiptStatus: s.getFeesReceiptStatus,
    feeReceiptData: s.feeReceiptData,
    resetFeesReceipt: s.resetFeesReceipt,
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

  const getStudentFees = (studentMasterId, promotionId) => {
    setSearchInput({ filters: "" });
    resetSearch();
    getFeesLedgerAction({ studentMasterId, promotionId, feesMode: 1 });
  };

  useEffect(() => {
    if (query?.pid && query?.mid) {
      getFeesLedgerAction({
        studentMasterId: query.mid,
        promotionId: query.pid,
        feesMode: 1,
      });
    }
  }, [getFeesLedgerAction, query]);

  const studentFeesDetails = useMemo(() => {
    return map(
      filter(feesLedger?.studentFees, (s) => s.fees_type_master?.id === 1),
      (f) => {
        const collected = filter(
          f.fees_collects,
          (c) => c.status === "Received"
        );
        const cancelled = filter(
          f.fees_collects,
          (c) => c.status === "Cancelled"
        );
        const pending = filter(f.fees_collects, (c) => c.status === "Pending");

        const receivedAmount = sumBy(collected, "amount");
        const receivedLateFees = sumBy(collected, "lateFees");
        const discount = sumBy(collected, "discount");
        const pendingAmount = sumBy(pending, "amount");

        const totalLateFees = f.lateFees + sumBy(f.fees_collects, "lateFees");

        return {
          ...f,
          fees: f.amount, // only original amount
          totalFees: f.amount,
          totalLateFees: totalLateFees,
          deposite: receivedAmount,
          lateFeesCollected: receivedLateFees,
          discount: discount,
          dueFees:
            f.totalFees -
            (f.feesReceived + f.lateFeesReceived + f.discountReceived),
          dueDate: f.dueDate,
        };
      }
    );
  }, [feesLedger?.studentFees]);

  const transportFeesDetails = useMemo(() => {
    return map(
      filter(feesLedger?.studentFees, (s) => s.fees_type_master?.id === 2),
      (f) => {
        const collected = filter(
          f.fees_collects,
          (c) => c.status === "Received"
        );
        const cancelled = filter(
          f.fees_collects,
          (c) => c.status === "Cancelled"
        );
        const pending = filter(f.fees_collects, (c) => c.status === "Pending");

        const receivedAmount = sumBy(collected, "amount");
        const receivedLateFees = sumBy(collected, "lateFees");
        const discount = sumBy(collected, "discount");
        const pendingAmount = sumBy(pending, "amount");

        const totalLateFees = f.lateFees + sumBy(f.fees_collects, "lateFees");

        return {
          ...f,
          fees: f.amount, // only original amount
          totalFees: f.amount,
          totalLateFees: totalLateFees,
          deposite: receivedAmount,
          lateFeesCollected: receivedLateFees,
          discount: discount,
          dueFees:
            f.totalFees -
            (f.feesReceived + f.lateFeesReceived + f.discountReceived),
          dueDate: f.dueDate,
        };
      }
    );
  }, [feesLedger?.studentFees]);

  const stdDetails = useMemo(() => {
    return feesLedger?.student?.student_master;
  }, [feesLedger?.student?.student_master]);

  useEffect(() => {
    return () => {
      setSearchInput({ filters: "" });
      resetSearch();
      resetFeesLedger();
    };
  }, [resetFeesLedger, resetSearch]);

  const receiptPrint = (data) => {
    getFeesReceiptAction({
      sessionMasterId,
      schoolCode: school?.schoolData?.schoolCode,
      promotionId: data?.promotionId,
      feesReportId: data?.id,
    });
  };
  useEffect(() => {
    if (getFeesReceiptStatus === STATUS.SUCCESS) {
      resetFeesReceipt();
      setToggleReceiptModal(feeReceiptData);
    }
  }, [feeReceiptData, getFeesReceiptStatus, resetFeesReceipt]);

  const [printProps, setPrintProps] = useState(null);
  const printRef = useRef(null);

  const handlePrintClick = () => {
    setPrintProps(feesLedger);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => setPrintProps(null),
    onPrintError: () => setPrintProps(null),
  });

  useEffect(() => {
    if (printProps) {
      handlePrint();
    }
  }, [printProps, handlePrint]);

  //feesLedger Print
  const [printPropsLedger, setPrintPropsLedger] = useState(null);
  const printRefLedger = useRef(null);

  const handlePrintLedgerClick = () => {
    setPrintPropsLedger(feesLedger);
  };

  const handlePrintLedger = useReactToPrint({
    content: () => printRefLedger.current,
    onAfterPrint: () => setPrintPropsLedger(null),
    onPrintError: () => setPrintPropsLedger(null),
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 0px; /* Ensure proper spacing */
      }
      * {
        line-height: 1.5;
        margin: 0px; 
        padding: 0px;
        font-family: 'Arial', sans-serif;
        font-size: 10px;
      }

    `,
  });

  useEffect(() => {
    if (printPropsLedger) {
      handlePrintLedger();
    }
  }, [printPropsLedger, handlePrintLedger]);

  return (
    <Box h="90%">
      <PageHeader
        heading={"Fees Collection"}
        extra={
          <Button
            size={"sm"}
            colorScheme={themeColor}
            leftIcon={<MdLocalPrintshop fontSize={18} />}
            onClick={handlePrintLedgerClick}
          >
            Print
          </Button>
        }
      />
      <Box
        p={5}
        bg={"white"}
        h={"100%"}
        className="scrollBar"
        maxH={"100%"}
        overflowY={"scroll"}
      >
        <CustomInput
          type={"text"}
          search={true}
          name="filters"
          autoFocus={true}
          label={"Search Student"}
          inputValue={searchInput}
          setInputValue={handleSearchInput}
        />
        {searchStudentStatus === STATUS.NOT_STARTED &&
        !searchStd?.length &&
        getFeesLedgerStatus === STATUS.NOT_STARTED ? (
          <Flex mt={5} w={"100%"} align={"center"} flexDir={"column"}>
            <Image h="300px" src="/assets/student.png" alt="Search Student" />
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
                          onClick={() =>
                            getStudentFees(
                              std.student_master.id,
                              std.promotionId
                            )
                          }
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
            ) : // <>ddddddd</>
            null}
            <Ledger
              getFeesLedgerStatus={getFeesLedgerStatus}
              themeColor={themeColor}
              feesLedger={feesLedger}
              stdDetails={stdDetails}
              studentFeesDetails={studentFeesDetails}
              transportFeesDetails={transportFeesDetails}
              receiptPrint={receiptPrint}
              setToggleReceiptModal={setToggleReceiptModal}
              resetFeesReceipt={resetFeesReceipt}
              setPrintProps={setPrintProps}
              handlePrintClick={handlePrintClick}
              toggleReceiptModal={toggleReceiptModal}
              printProps={printProps}
              printRef={printRef}
            />

            <Box display={"none"}>
              {printPropsLedger && (
                <Box ref={printRefLedger}>
                  <Ledger
                    getFeesLedgerStatus={getFeesLedgerStatus}
                    themeColor={themeColor}
                    feesLedger={feesLedger}
                    stdDetails={stdDetails}
                    studentFeesDetails={studentFeesDetails}
                    transportFeesDetails={transportFeesDetails}
                    receiptPrint={receiptPrint}
                    setToggleReceiptModal={setToggleReceiptModal}
                    resetFeesReceipt={resetFeesReceipt}
                    setPrintProps={setPrintProps}
                    handlePrintClick={handlePrintClick}
                    toggleReceiptModal={toggleReceiptModal}
                    printProps={printProps}
                    printRef={printRef}
                    printStatus={true}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </LoadingContainer>
      </Box>
    </Box>
  );
};

export const Ledger = ({
  getFeesLedgerStatus,
  feesLedger,
  themeColor,
  stdDetails,
  studentFeesDetails,
  transportFeesDetails,
  receiptPrint,
  setToggleReceiptModal,
  resetFeesReceipt,
  setPrintProps,
  handlePrintClick,
  toggleReceiptModal,
  printProps,
  printRef,
  printStatus,
}) => {
  return (
    <LoadingContainer status={getFeesLedgerStatus}>
      {printStatus && <SchoolHeader  
      ></SchoolHeader>}
      {feesLedger ? (
        <Box    sx={{
            '@media print': {
              bg: `${themeColor}.50`,
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact'
            }
          }}> 

          {printStatus && (
            <Box 
              p={4} 
            
              mb={4}
            >
              <Text 
                fontSize="xl" 
                fontWeight="bold" 
                color={`${themeColor}.700`}
                textAlign="center"
                mb={4}
              >
                Fees Ledger
              </Text>
            
            </Box>
          )}
      
          <Flex
            my={3}
            p={2}
            align={"center"}
            bg={`${themeColor}.50`}
            border={"1px solid"}
            borderColor={"gray.200"}
            borderRadius={10}
         
          >
            <Box w={"10%"}>
              <Image
                h={"70px"}
                src={`${URL}${stdDetails?.photo}`}
                alt={"Profile"}
              />
            </Box>
            <Box w={"55%"} fontSize={13} fontWeight={"semibold"}>
              <Flex w={"100%"}>
                <Text w={"25%"}>Name</Text>
                <Text>: &nbsp;{stdDetails?.studentName}</Text>
              </Flex>
              <Flex w={"100%"}>
                <Text w={"25%"}>Father&apos;s Name</Text>
                <Text>: &nbsp;{stdDetails?.fatherName}</Text>
              </Flex>
              <Flex w={"100%"}>
                <Text w={"25%"}>Contact </Text>
                <Text>: &nbsp;{stdDetails?.fatherContact}</Text>
              </Flex>
            </Box>
            <Box w={"35%"} fontSize={13} fontWeight={"semibold"}>
              <Flex w={"100%"}>
                <Text w={"25%"}>Class</Text>
                <Text>: &nbsp;{feesLedger?.student?.class_master?.name}</Text>
              </Flex>
              <Flex w={"100%"}>
                <Text w={"25%"}>Stream</Text>
                <Text>: &nbsp;{feesLedger?.student?.stream_master?.name}</Text>
              </Flex>
              <Flex w={"100%"}>
                <Text w={"25%"}>Section</Text>
                <Text>: &nbsp;{feesLedger?.student?.section_master?.name}</Text>
              </Flex>
            </Box>
            {!printStatus && (
              <Tooltip label={"Fees Certificate"} placement={"top"}>
                <IconButton
                  size={"xs"}
                  variant={"ghost"}
                  colorScheme={themeColor}
                  icon={<MdLocalPrintshop fontSize={18} />}
                  onClick={handlePrintClick}
                />
              </Tooltip>
            )}
          </Flex>
          <Flex mt={5} flexDir={"column"}>
            <Box
              w={"100%"}
              border={"1px solid"}
              borderColor={"gray.200"}
              p={5}
              borderLeftRadius={5}
              bg={`${themeColor}.50`}
            >
              <Grid templateColumns="repeat(3, 1fr)" gap={4} w="100%">
                {/* Fees Details Section */}
                <Box
                  p={4}
                  bg="white"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                  shadow="sm"
                >
                  <Text
                    fontSize="md"
                    fontWeight="bold"
                    mb={3}
                    color={`${themeColor}.700`}
                  >
                    Fees Details
                  </Text>
                  <VStack align="stretch" spacing={2}>
                    <Flex justify="space-between" fontSize="sm">
                      <Text>Total Fees</Text>
                      <Flex
                        align="center"
                        color="blue.500"
                        fontWeight="semibold"
                      >
                        <MdCurrencyRupee /> {feesLedger.totalFinalFees || 0}
                      </Flex>
                    </Flex>
                    <Flex justify="space-between" fontSize="sm">
                      <Text>Tution Fees</Text>
                      <Flex
                        align="center"
                        color="blue.500"
                        fontWeight="semibold"
                      >
                        <MdCurrencyRupee /> {feesLedger.totalFees || 0}
                      </Flex>
                    </Flex>
                    <Flex justify="space-between" fontSize="sm">
                      <Text>Late Fees</Text>
                      <Flex
                        align="center"
                        color="blue.500"
                        fontWeight="semibold"
                      >
                        <MdCurrencyRupee /> {feesLedger.totalLateFees || 0}
                      </Flex>
                    </Flex>
                  </VStack>
                </Box>

                {/* Deposit Details Section */}
                <Box
                  p={4}
                  bg="white"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                  shadow="sm"
                >
                  <Text
                    fontSize="md"
                    fontWeight="bold"
                    mb={3}
                    color={`${themeColor}.700`}
                  >
                    Deposit Details
                  </Text>
                  <VStack align="stretch" spacing={2}>
                    <Flex justify="space-between" fontSize="sm">
                      <Text>Total Deposit</Text>
                      <Flex
                        align="center"
                        color="green.500"
                        fontWeight="semibold"
                      >
                        <MdCurrencyRupee /> {feesLedger.totalFeesCollect || 0}
                      </Flex>
                    </Flex>
                    <Flex justify="space-between" fontSize="sm">
                      <Text>Late Fees Deposit</Text>
                      <Flex
                        align="center"
                        color="green.500"
                        fontWeight="semibold"
                      >
                        <MdCurrencyRupee />{" "}
                        {feesLedger.totalLateFesCollect || 0}
                      </Flex>
                    </Flex>
                    <Flex justify="space-between" fontSize="sm">
                      <Text>Discount</Text>
                      <Flex
                        align="center"
                        color="green.500"
                        fontWeight="semibold"
                      >
                        <MdCurrencyRupee />{" "}
                        {feesLedger.totalDiscountCollect || 0}
                      </Flex>
                    </Flex>
                  </VStack>
                </Box>

                {/* Due Details Section */}
                <Box
                  p={4}
                  bg="white"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                  shadow="sm"
                >
                  <Text
                    fontSize="md"
                    fontWeight="bold"
                    mb={3}
                    color={`${themeColor}.700`}
                  >
                    Due Details
                  </Text>
                  <VStack align="stretch" spacing={2}>
                    <Flex justify="space-between" fontSize="sm">
                      <Text>Total Due</Text>
                      <Flex
                        align="center"
                        color="red.500"
                        fontWeight="semibold"
                      >
                        <MdCurrencyRupee /> {feesLedger.totalDue || 0}
                      </Flex>
                    </Flex>
                    <Flex justify="space-between" fontSize="sm">
                      <Text>Late Fees Due</Text>
                      <Flex
                        align="center"
                        color="red.500"
                        fontWeight="semibold"
                      >
                        <MdCurrencyRupee />{" "}
                        {feesLedger.totalLateFees -
                          feesLedger.totalLateFesCollect}
                      </Flex>
                    </Flex>
                  </VStack>
                </Box>
              </Grid>
              {studentFeesDetails ? (
                <Box
                  mt={4}
                  fontSize={14}
                  border={printStatus ? "1px solid" : "none"}
                  borderColor={`${themeColor}.500`}
                  borderRadius="md"
                >
                  <Flex
                    px={4}
                    py={2}
                    fontWeight="semibold"
                    bg={`${themeColor}.100`}
                    borderTopRadius="md"
                    borderBottom="1px solid"
                    borderColor={`${themeColor}.200`}
                    align="center"
                    justify="space-between"
                    shadow="sm"
                  >
                    <Flex align="center" gap={2}>
                      <Icon
                        as={MdSchool}
                        color={`${themeColor}.500`}
                        boxSize={5}
                      />
                      <Text fontSize="md" color={`${themeColor}.700`}>
                        School Fees Details
                      </Text>
                    </Flex>
                    <Flex
                      align="center"
                      bg="white"
                      px={3}
                      py={1}
                      borderRadius="md"
                      border="1px solid"
                      borderColor={`${themeColor}.200`}
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color={`${themeColor}.700`}
                      >
                        School Due Fees:&nbsp;
                      </Text>
                      <Flex
                        as="span"
                        align="center"
                        color="red.500"
                        fontWeight="bold"
                      >
                        <MdCurrencyRupee />
                        {sumBy(studentFeesDetails, "dueFees")}
                      </Flex>
                    </Flex>
                  </Flex>

                  <TableContainer>
                    <Table>
                      <Tbody>
                        <Tr bg={`${themeColor}.100`}>
                          <Td fontWeight="bold">
                            <Flex align="center">Fees Head</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Fees</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Total Late Fees</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Deposit</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Late Fees Deposit</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Discount</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Due Fees</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Due Date</Flex>
                          </Td>
                        </Tr>

                        {map(studentFeesDetails, (fee, index) => (
                          <Tr key={index}>
                            <Td>
                              <Flex align="center">
                                {fee?.fees_name_master?.name || "N/A"}
                              </Flex>
                            </Td>
                            <Td>
                              <Flex align="center" justify="flex-end">
                                <MdCurrencyRupee />
                                {fee.fees}
                              </Flex>
                            </Td>

                            <Td>
                              <Flex align="center" justify="flex-end">
                                <MdCurrencyRupee />
                                {fee.totalLateFees}
                              </Flex>
                            </Td>
                            <Td>
                              <Flex align="center" justify="flex-end">
                                <MdCurrencyRupee />
                                {fee.deposite || 0}
                              </Flex>
                            </Td>
                            <Td>
                              <Flex align="center" justify="flex-end">
                                <MdCurrencyRupee />
                                {fee.lateFeesCollected || 0}
                              </Flex>
                            </Td>
                            <Td>
                              <Flex align="center" justify="flex-end">
                                <MdCurrencyRupee />
                                {fee.discountReceived || 0}
                              </Flex>
                            </Td>
                            <Td>
                              <Flex align="center" justify="flex-end">
                                <MdCurrencyRupee />
                                {fee.dueFees}
                              </Flex>
                            </Td>
                            <Td>
                              <Flex align="center">
                                {fee.dueDate
                                  ? dayjs(fee.dueDate).format("DD-MM-YYYY")
                                  : "N/A"}
                              </Flex>
                            </Td>
                          </Tr>
                        ))}

                        <Tr bg="white">
                          <Td fontWeight="bold">Total</Td>
                          <Td>
                            <Flex
                              align="center"
                              justify="flex-end"
                              fontWeight="bold"
                            >
                              <MdCurrencyRupee />
                              {sumBy(studentFeesDetails, "fees")}
                            </Flex>
                          </Td>

                          <Td>
                            <Flex
                              align="center"
                              justify="flex-end"
                              fontWeight="bold"
                            >
                              <MdCurrencyRupee />
                              {sumBy(studentFeesDetails, "totalLateFees")}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex
                              align="center"
                              justify="flex-end"
                              fontWeight="bold"
                            >
                              <MdCurrencyRupee />
                              {sumBy(studentFeesDetails, "deposite")}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex
                              align="center"
                              justify="flex-end"
                              fontWeight="bold"
                            >
                              <MdCurrencyRupee />
                              {sumBy(studentFeesDetails, "lateFeesCollected")}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex
                              align="center"
                              justify="flex-end"
                              fontWeight="bold"
                            >
                              <MdCurrencyRupee />
                              {sumBy(studentFeesDetails, "discount")}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex
                              align="center"
                              justify="flex-end"
                              fontWeight="bold"
                            >
                              <MdCurrencyRupee />
                              {sumBy(studentFeesDetails, "dueFees")}
                            </Flex>
                          </Td>
                          <Td />
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : null}
              {transportFeesDetails ? (
                <Box
                  mt={4}
                  fontSize={14}
                  border={printStatus ? "1px solid" : "none"}
                  borderColor={`${themeColor}.500`}
                  borderRadius="md"
                >
                  <Flex
                    px={4}
                    py={2}
                    fontWeight="semibold"
                    bg={`${themeColor}.100`}
                    borderTopRadius="md"
                    borderBottom="1px solid"
                    borderColor={`${themeColor}.200`}
                    align="center"
                    justify="space-between"
                    shadow="sm"
                  >
                    <Flex align="center" gap={2}>
                      <Icon
                        as={MdDirectionsBus}
                        color={`${themeColor}.500`}
                        boxSize={5}
                      />
                      <Text fontSize="md" color={`${themeColor}.700`}>
                        Transport Fees Details
                      </Text>
                    </Flex>
                    <Flex
                      align="center"
                      bg="white"
                      px={3}
                      py={1}
                      borderRadius="md"
                      border="1px solid"
                      borderColor={`${themeColor}.200`}
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color={`${themeColor}.700`}
                      >
                        Transport Due Fees:&nbsp;
                      </Text>
                      <Flex
                        as="span"
                        align="center"
                        color="red.500"
                        fontWeight="bold"
                      >
                        <MdCurrencyRupee />
                        {sumBy(transportFeesDetails, "dueFees")}
                      </Flex>
                    </Flex>
                  </Flex>

                  <TableContainer>
                    <Table>
                      <Tbody>
                        <Tr bg={`${themeColor}.100`}>
                          <Td fontWeight="bold">
                            <Flex align="center">Fees Head</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Fees</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Total Late Fees</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Deposit</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Late Fees Deposit</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Discount</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Due Fees</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Due Date</Flex>
                          </Td>
                        </Tr>

                        {map(transportFeesDetails, (fee, index) => (
                          <Tr key={index}>
                            <Td>
                              <Flex align="center">
                                {fee?.transport_fee_master?.name || "N/A"}
                              </Flex>
                            </Td>
                            <Td>
                              <Flex align="center" justify="flex-end">
                                <MdCurrencyRupee />
                                {fee.fees}
                              </Flex>
                            </Td>

                            <Td>
                              <Flex align="center" justify="flex-end">
                                <MdCurrencyRupee />
                                {fee.totalLateFees}
                              </Flex>
                            </Td>
                            <Td>
                              <Flex align="center" justify="flex-end">
                                <MdCurrencyRupee />
                                {fee.deposite || 0}
                              </Flex>
                            </Td>
                            <Td>
                              <Flex align="center" justify="flex-end">
                                <MdCurrencyRupee />
                                {fee.lateFeesCollected || 0}
                              </Flex>
                            </Td>
                            <Td>
                              <Flex align="center" justify="flex-end">
                                <MdCurrencyRupee />
                                {fee.discountReceived || 0}
                              </Flex>
                            </Td>
                            <Td>
                              <Flex align="center" justify="flex-end">
                                <MdCurrencyRupee />
                                {fee.dueFees}
                              </Flex>
                            </Td>
                            <Td>
                              <Flex align="center">
                                {fee.dueDate
                                  ? dayjs(fee.dueDate).format("DD-MM-YYYY")
                                  : "N/A"}
                              </Flex>
                            </Td>
                          </Tr>
                        ))}

                        <Tr bg="white">
                          <Td fontWeight="bold">Total</Td>
                          <Td>
                            <Flex
                              align="center"
                              justify="flex-end"
                              fontWeight="bold"
                            >
                              <MdCurrencyRupee />
                              {sumBy(transportFeesDetails, "fees")}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex
                              align="center"
                              justify="flex-end"
                              fontWeight="bold"
                            >
                              <MdCurrencyRupee />
                              {sumBy(transportFeesDetails, "totalLateFees")}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex
                              align="center"
                              justify="flex-end"
                              fontWeight="bold"
                            >
                              <MdCurrencyRupee />
                              {sumBy(transportFeesDetails, "deposite")}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex
                              align="center"
                              justify="flex-end"
                              fontWeight="bold"
                            >
                              <MdCurrencyRupee />
                              {sumBy(transportFeesDetails, "lateFeesCollected")}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex
                              align="center"
                              justify="flex-end"
                              fontWeight="bold"
                            >
                              <MdCurrencyRupee />
                              {sumBy(transportFeesDetails, "discount")}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex
                              align="center"
                              justify="flex-end"
                              fontWeight="bold"
                            >
                              <MdCurrencyRupee />
                              {sumBy(transportFeesDetails, "dueFees")}
                            </Flex>
                          </Td>
                          <Td />
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : null}
              <Box
                mt={4}
                fontSize={14}
                border={printStatus ? "1px solid" : "none"}
                borderColor={`${themeColor}.500`}
                borderRadius="md"
              >
                <Flex
                  px={4}
                  py={2}
                  fontWeight="semibold"
                  bg={`${themeColor}.100`}
                  borderTopRadius="md"
                  borderBottom="1px solid"
                  borderColor={`${themeColor}.200`}
                  align="center"
                  justify="space-between"
                  shadow="sm"
                >
                  <Flex align="center" gap={2}>
                    <Icon
                      as={MdSchool}
                      color={`${themeColor}.500`}
                      boxSize={5}
                    />
                    <Text fontSize="md" color={`${themeColor}.700`}>
                      Fees Collection List
                    </Text>
                  </Flex>
                </Flex>
                {feesLedger?.feesReport?.length ? (
                  <TableContainer>
                    <Table>
                      <Tbody>
                        <Tr bg={`${themeColor}.100`}>
                          <Td fontWeight="bold">
                            <Flex align="center">Receipt No.</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Deposite Date</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Fees Type</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Deposite</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Discount</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Mode (Trans/Cheque No.)</Flex>
                          </Td>
                          <Td fontWeight="bold">
                            <Flex align="center">Status</Flex>
                          </Td>
                          {!printStatus && (
                            <Td fontWeight="bold">
                              <Flex align="center">Action</Flex>
                            </Td>
                          )}
                        </Tr>
                        {map(feesLedger?.feesReport, (data) => {
                          return (
                            <Tr _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                              <Td isNumeric>
                                <Flex align="center">
                                  {data.feesMode === 2
                                    ? data.transportReceiptNo
                                    : data.receiptNo}
                                </Flex>
                              </Td>
                              <Td>
                                <Flex align="center">
                                  {dayjs(data.date).format("DD-MM-YYYY")}
                                </Flex>
                              </Td>
                              <Td>
                                <Flex align="center">
                                  {data?.feesTypeMasterId === 2
                                    ? "Transport Fees"
                                    : "School Fees"}
                                </Flex>
                              </Td>
                              <Td style={{ fontWeight: "bold" }}>
                                <Flex align="center" justify="flex-end">
                                  <MdCurrencyRupee />
                                  {(data.totalAmount || 0) +
                                    (data.totalLateFees || 0)}
                                </Flex>
                              </Td>
                              <Td>
                                <Flex align="center" justify="flex-end">
                                  <MdCurrencyRupee />
                                  {data.totalDiscount || 0}
                                </Flex>
                              </Td>
                              <Td>
                                <Flex flexDir="column" align="center">
                                  <Text>{toUpper(data.type)}</Text>
                                  {data.transitionNo ? (
                                    <Text
                                      color="gray.500"
                                      fontSize={10}
                                      fontStyle="italic"
                                    >
                                      ({data.transitionNo})
                                    </Text>
                                  ) : null}
                                </Flex>
                              </Td>
                              <Td>
                                <Flex align="center">
                                  {data.chequeStatus || data.status ? (
                                    <Tag
                                      colorScheme={
                                        data.status === "Received"
                                          ? "green"
                                          : data.status === "Cancelled"
                                          ? "red"
                                          : data.chequeStatus === "Collected"
                                          ? "teal"
                                          : data.chequeStatus ===
                                            "Deposit Into Bank"
                                          ? "yellow"
                                          : data.chequeStatus === "Cleared"
                                          ? "green"
                                          : "red"
                                      }
                                    >
                                      {data.chequeId
                                        ? data.chequeStatus
                                        : data.status}
                                    </Tag>
                                  ) : null}
                                </Flex>
                              </Td>
                              {!printStatus && (
                                <Td>
                                  <Flex align="center">
                                    <Tooltip
                                      placement="top"
                                      label="Print Receipt"
                                    >
                                      <IconButton
                                        ml={2}
                                        size="xs"
                                        variant="ghost"
                                        colorScheme={themeColor}
                                        icon={
                                          <MdLocalPrintshop fontSize={18} />
                                        }
                                        onClick={() => receiptPrint(data)}
                                      />
                                    </Tooltip>
                                  </Flex>
                                </Td>
                              )}
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TableContainer>
                ) : (
                  <NoData title={"No Fees Collection Found"} />
                )}
              </Box>
            </Box>

            {toggleReceiptModal && (
              <ReceiptDrawer
                themeColor={themeColor}
                feeReceiptData={feeReceiptData}
                closeModal={() => setToggleReceiptModal(null)}
                resetAllData={resetFeesReceipt}
              />
            )}
            <Box display={"none"}>
              {printProps && (
                <Box ref={printRef}>
                  <FeesCertificate
                    data={printProps}
                    stdDetails={stdDetails}
                    setPrintProps={setPrintProps}
                  />
                </Box>
              )}
            </Box>
          </Flex>
        </Box>
      ) : null}
    </LoadingContainer>
  );
};
