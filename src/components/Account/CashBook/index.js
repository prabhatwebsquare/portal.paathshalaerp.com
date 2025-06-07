import {
  Box,
  Button,
  Flex,
  ScaleFade,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  useColorModeValue,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Tr,
  Badge,
} from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import dayjs from "dayjs";
import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useAccountStore } from "@/store/Account";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { RiFileExcel2Fill } from "react-icons/ri";
import { DownloadExcel } from "@/common/DownloadExcel";
import { MdCurrencyRupee, MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { SchoolHeader } from "@/common/SchoolHeader";
import { FaArrowUp, FaArrowDown, FaBalanceScale } from "react-icons/fa";

export const CashBook = ({ sessionMasterId, themeColor = "blue" }) => {
  const [inputValue, setInputValue] = useState({
    date: dayjs().format("YYYY-MM-DD"),
  });

  const { getCashBookAction, getCashBookStatus, allCashBook, resetCashBook } =
    useAccountStore((s) => ({
      getCashBookAction: s.getCashBookAction,
      getCashBookStatus: s.getCashBookStatus,
      allCashBook: s.allCashBook,
      resetCashBook: s.resetCashBook,
    }));

  // Fetch data when component mounts or input changes
  useEffect(() => {
    if ((getCashBookStatus || 1) === STATUS.NOT_STARTED) {
      getCashBookAction({
        ...inputValue,
        sessionMasterId,
      });
    }
  }, [getCashBookAction, getCashBookStatus, inputValue, sessionMasterId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => resetCashBook();
  }, [resetCashBook]);

  const getData = (e) => {
    e.preventDefault();
    getCashBookAction({
      ...inputValue,
      sessionMasterId,
    });
  };

  // Format Excel data
  const [excelData, setExcelData] = useState(null);
  useEffect(() => {
    const formattedData = [
      ...(allCashBook?.drlist || []).map((statement) => ({
        Type: "Expense",
        VoucherNo: statement.voucherNo || "-",
        Date: statement.voucherDate
          ? new Date(statement.voucherDate).toLocaleDateString("en-GB")
          : "-",
        Ledger: statement.ledgerName || "-",
        Amount: `₹ ${statement.amount || 0}`,
        Narration: statement.remark || "-",
      })),
      ...(allCashBook?.academicFeesReportList || []).map((item) => ({
        Type: "Income (Academic Fees)",
        VoucherNo: "-",
        Date: item.voucherDate
          ? new Date(item.voucherDate).toLocaleDateString("en-GB")
          : "-",
        Ledger: item.name,
        Amount: `₹ ${item.amount || 0}`,
        Narration: "Academic Fees",
      })),
      ...(allCashBook?.transporterFeesReportList || []).map((item) => ({
        Type: "Income (Transporter Fees)",
        VoucherNo: "-",
        Date: item.voucherDate
          ? new Date(item.voucherDate).toLocaleDateString("en-GB")
          : "-",
        Ledger: item.name,
        Amount: `₹ ${item.amount || 0}`,
        Narration: "Transporter Fees",
      })),
    ];
    setExcelData(formattedData);
  }, [allCashBook]);

  // Print functionality
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Cash_Book_${dayjs(inputValue.date).format("DD-MM-YYYY")}`,
  });

  // Color scheme
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headerBg = useColorModeValue(`${themeColor}.100`, `${themeColor}.900`);
  const footerBg = useColorModeValue(`${themeColor}.50`, `${themeColor}.800`);
  const borderColor = useColorModeValue(
    `${themeColor}.200`,
    `${themeColor}.700`
  );

  // Calculate totals
  const totalAmountIncome =
    (allCashBook?.academicFeesReportList?.reduce(
      (acc, item) => acc + (Number(item.amount) || 0),
      0
    ) || 0) +
    (allCashBook?.transporterFeesReportList?.reduce(
      (acc, item) => acc + (Number(item.amount) || 0),
      0
    ) || 0);

  const totalAmountExpense =
    allCashBook?.drlist?.reduce(
      (acc, statement) => acc + (Number(statement.amount) || 0),
      0
    ) || 0;
  const chakraColors = [
    "red",
    "pink",
    "purple",
    "blue",
    "cyan",
    "teal",
    "green",
    "lime",
    "yellow",
    "orange",
  ];

  function getRandomColor(index) {
    return chakraColors[index % chakraColors.length]; // Or use Math.random() if you want true randomness
  }

  return (
    <Box>
      <PageHeader
        heading="Cash Book"
        extra={
          <HStack spacing={3}>
            <Tooltip label="Print" placement="top">
              <Button
                size="sm"
                onClick={handlePrint}
                colorScheme={themeColor}
                variant="outline"
                _hover={{ bg: `${themeColor}.100` }}
              >
                <MdLocalPrintshop fontSize={18} />
              </Button>
            </Tooltip>
            <Tooltip label="Download Excel" placement="top">
              <DownloadExcel
                button={
                  <Button size="sm" colorScheme={themeColor}>
                    <RiFileExcel2Fill fontSize={18} />
                  </Button>
                }
                data={excelData}
                name={`Cash_Book_${dayjs(inputValue.date).format(
                  "DD-MM-YYYY"
                )}`}
              />
            </Tooltip>
          </HStack>
        }
      />
      <Box className="scrollBar" overflowY={"scroll"} h={"75vh"}>
        <VStack spacing={6} align="stretch">
          {/* Date Filter */}
          <Box
            bg={cardBg}
            p={{ base: 4, md: 6 }}
            borderRadius="lg"
            boxShadow="0 4px 20px rgba(0, 0, 0, 0.05)"
            border="1px solid"
            borderColor={borderColor}
          >
            <form onSubmit={getData}>
              <HStack spacing={4} align="center">
                <CustomInput
                  w={{ base: "100%", md: "25%" }}
                  size="sm"
                  notRequire={true}
                  type="date"
                  name="date"
                  label="Select Date"
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <Button
                  size="sm"
                  type="submit"
                  colorScheme={themeColor}
                  px={6}
                  _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
                >
                  Fetch Data
                </Button>
              </HStack>
            </form>
          </Box>

          {/* Opening Balances */}
          <SimpleGrid columns={{ base: 1, md: 5, lg: 6 }} spacing={2}>
            {map(allCashBook?.openingBalance, (balance, index) => {
              const color = getRandomColor(index * 2); // use a unique color per item

              return (
                <Box
                  key={index}
                  bg={cardBg}
                  p={5}
                  borderRadius="md"
                  boxShadow="0 6px 12px rgba(0, 0, 0, 0.1)"
                  border="1px solid"
                  borderColor={borderColor}
                  position="relative"
                  textAlign="center"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                    borderColor: `${themeColor}.400`,
                  }}
                  minW="120px"
                  maxW="250px"
                >
                  {/* Chip for Opening Balance */}
                  <Badge
                    position="absolute"
                    top="-10px"
                    left="50%"
                    transform="translateX(-50%)"
                    bg={`${color}.500`}
                    color="white"
                    fontSize="2xs"
                    fontWeight="bold"
                    px={2}
                    py={0.5}
                    borderRadius="full"
                    boxShadow="0 1px 3px rgba(0, 0, 0, 0.2)"
                  >
                    Opening Balance
                  </Badge>
                  <VStack spacing={2}>
                    <Flex
                      align="center"
                      justify="space-between"
                      w="100%"
                      px={2}
                      flexWrap="wrap"
                      gap={1}
                    >
                      <Text
                        fontWeight="bold"
                        fontSize="sm"
                        color={textColor}
                        flex="1"
                        textAlign="left"
                        isTruncated
                      >
                        {balance.name}
                      </Text>
                      <Flex align="center" flex="1" justify="flex-end">
                        <MdCurrencyRupee
                          size={14}
                          color={`${themeColor}.600`}
                        />
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color={`${themeColor}.700`}
                          ml={0.5}
                        >
                          {balance.amount.toLocaleString("en-IN")}
                        </Text>
                      </Flex>
                    </Flex>
                  </VStack>
                </Box>
              );
            })}
          </SimpleGrid>

          {/* Main Content */}
          <LoadingContainer status={getCashBookStatus}>
            <ScaleFade initialScale={0.95} in={true}>
              <VStack spacing={6} align="stretch">
                {/* Income Table */}
                {totalAmountIncome > 0 && (
                  <TableContainer
                    bg={cardBg}
                    borderRadius="xl"
                    boxShadow="0 6px 20px rgba(0, 0, 0, 0.1)"
                    border="1px solid"
                    borderColor={borderColor}
                    p={{ base: 4, md: 6 }}
                  >
                    <HStack mb={4} align="center">
                      <Icon as={FaArrowDown} color="green.500" boxSize={6} />
                      <Text fontWeight="bold" fontSize="xl" color={textColor}>
                        Income
                      </Text>
                      <Badge colorScheme="green" ml={2}>
                        Total: ₹{totalAmountIncome.toLocaleString("en-IN")}
                      </Badge>
                    </HStack>
                    <Table size="sm" variant="simple" colorScheme={themeColor}>
                      <Thead>
                        <Tr bg={headerBg}>
                          <Th color={`${themeColor}.700`} textAlign="center">
                            Sr No.
                          </Th>
                          <Th color={`${themeColor}.700`} textAlign="center">
                            Source
                          </Th>
                          <Th color={`${themeColor}.700`} textAlign="center">
                            Amount
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody
                        fontSize={{ base: "xs", md: "sm" }}
                        color={textColor}
                      >
                        {((sectionData) => {
                          let srNo = 1;
                          const renderSection = (title, data) => {
                            const filtered = (data || []).filter(
                              (item) => item.amount > 0
                            );

                            if (filtered.length === 0) return null;

                            return (
                              <>
                                <Tr bg={`${themeColor}.50`}>
                                  <Td
                                    colSpan={4}
                                    fontWeight="bold"
                                    textAlign="center"
                                  >
                                    {title}
                                  </Td>
                                </Tr>
                                {filtered.map((item, index) => (
                                  <Tr key={`${title}-${index}`}>
                                    <Td textAlign="center">{srNo++}</Td>
                                    <Td textAlign="center">
                                      {item.name} {item.accountNumber}
                                    </Td>
                                    <Td textAlign="center">
                                      <Flex align="center" justify="flex-end">
                                        <MdCurrencyRupee size={12} />
                                        {item.amount.toLocaleString("en-IN")}
                                      </Flex>
                                    </Td>
                                  </Tr>
                                ))}
                              </>
                            );
                          };

                          return (
                            <>
                              {renderSection(
                                "Academic Fees",
                                allCashBook?.academicFeesReportList
                              )}
                              {renderSection(
                                "Transporter Fees",
                                allCashBook?.transporterFeesReportList
                              )}
                              <Tr bg={footerBg}>
                                <Td
                                  colSpan={1}
                                  fontWeight="bold"
                                  textAlign="right"
                                >
                                  Total Income:
                                </Td>
                                <Td textAlign="center">
                                  <Flex align="center" justify="flex-end">
                                    <MdCurrencyRupee size={12} />
                                    {totalAmountIncome.toLocaleString("en-IN")}
                                  </Flex>
                                </Td>
                                <Td />
                              </Tr>
                            </>
                          );
                        })()}
                      </Tbody>
                    </Table>
                  </TableContainer>
                )}

                {/* Expense Table */}
                {allCashBook?.drlist?.length > 0 && (
                  <TableContainer
                    bg={cardBg}
                    borderRadius="xl"
                    boxShadow="0 6px 20px rgba(0, 0, 0, 0.1)"
                    border="1px solid"
                    borderColor={borderColor}
                    p={{ base: 4, md: 6 }}
                  >
                    <HStack mb={4} align="center">
                      <Icon as={FaArrowUp} color="red.500" boxSize={6} />
                      <Text fontWeight="bold" fontSize="xl" color={textColor}>
                        Expenses
                      </Text>
                      <Badge colorScheme="red" ml={2}>
                        Total: ₹{totalAmountExpense.toLocaleString("en-IN")}
                      </Badge>
                    </HStack>
                    <Table size="sm" variant="simple">
                      <Thead>
                        <Tr bg={headerBg}>
                          <Th color={`${themeColor}.700`} textAlign="center">
                            Sr No.
                          </Th>
                          <Th color={`${themeColor}.700`} textAlign="center">
                            Ledger
                          </Th>
                          {/* <Th color={`${themeColor}.700`} textAlign="center">
                            Date
                          </Th> */}
                          <Th color={`${themeColor}.700`} textAlign="center">
                            Amount
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {map(allCashBook?.drlist, (statement, index) => (
                          <Tr key={index}>
                            <Td textAlign="center">{index + 1}</Td>
                            <Td textAlign="center">{statement.name || "-"}</Td>
                            {/* <Td textAlign="center">
                              {statement.voucherDate
                                ? new Date(
                                    statement.voucherDate
                                  ).toLocaleDateString("en-GB")
                                : "-"}
                            </Td> */}
                            <Td textAlign="center">
                              <Flex align="center" justify="flex-end">
                                <MdCurrencyRupee size={12} />
                                {statement.amount.toLocaleString("en-IN")}
                              </Flex>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                      <Tfoot>
                        <Tr bg={footerBg}>
                          <Td colSpan={3} fontWeight="bold" textAlign="right">
                            Total Expenses:
                          </Td>
                          <Td>
                            <Flex align="center" justify="flex-end">
                              <MdCurrencyRupee size={12} />
                              {totalAmountExpense.toLocaleString("en-IN")}
                            </Flex>
                          </Td>
                        </Tr>
                      </Tfoot>
                    </Table>
                  </TableContainer>
                )}
              </VStack>
            </ScaleFade>
          </LoadingContainer>

          {/* Closing Balances */}
          <SimpleGrid columns={{ base: 1, md: 3, lg: 6 }} spacing={2}>
            {map(allCashBook?.closingBalance, (balance, index) => {
              const color = getRandomColor(index); // use a unique color per item

              return (
                <Box
                  key={index}
                  bg={cardBg}
                  p={3}
                  borderRadius="md"
                  boxShadow="0 6px 12px rgba(0, 0, 0, 0.1)"
                  border="1px solid"
                  borderColor={borderColor}
                  position="relative"
                  textAlign="center"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                    borderColor: `${themeColor}.400`,
                  }}
                  minW="120px"
                  maxW="250px"
                >
                  {/* Chip for Closing Balance */}
                  <Badge
                    position="absolute"
                    top="-10px"
                    left="50%"
                    transform="translateX(-50%)"
                    bg={`${color}.500`}
                    color="white"
                    fontSize="2xs"
                    fontWeight="bold"
                    px={2}
                    py={0.5}
                    borderRadius="full"
                    boxShadow="0 1px 3px rgba(0, 0, 0, 0.2)"
                  >
                    Closing Balance
                  </Badge>
                  <VStack spacing={2}>
                    <Flex
                      align="center"
                      justify="space-between"
                      w="100%"
                      px={2}
                      flexWrap="wrap"
                      gap={1}
                    >
                      <Text
                        fontWeight="bold"
                        fontSize="sm"
                        color={textColor}
                        flex="1"
                        textAlign="left"
                        isTruncated
                      >
                        {balance.name}
                      </Text>
                      <Flex align="center" flex="1" justify="flex-end">
                        <MdCurrencyRupee
                          size={14}
                          color={`${themeColor}.600`}
                        />
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color={`${themeColor}.700`}
                          ml={0.5}
                        >
                          {balance.amount.toLocaleString("en-IN")}
                        </Text>
                      </Flex>
                    </Flex>
                  </VStack>
                </Box>
              );
            })}
          </SimpleGrid>

          {/* Print Layout */}
          <Box display="none">
            <Box ref={printRef} p={5}>
              <style>{`
              @media print {
                @page { size: A4 portrait; margin: 1cm; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
                th { background-color: ${themeColor}.100; }
                .print-header { font-size: 16px; font-weight: bold; margin-bottom: 16px; }
              }
            `}</style>
              <SchoolHeader
                title="Cash Book"
                extra={
                  <Flex w="100%" justify="flex-end" fontSize={12}>
                    <Text w="fit-content">Date:</Text>
                    <Text ml={2} w="fit-content" fontWeight="semibold">
                      {dayjs(inputValue.date).format("DD-MM-YYYY")}
                    </Text>
                  </Flex>
                }
              />
              {/* Opening Balances for Print */}
              <SimpleGrid columns={4} spacing={2} mb={4}>
                {map(allCashBook?.openingBalance, (balance, index) => (
                  <Box
                    key={index}
                    p={2}
                    border="1px solid"
                    borderColor="gray.200"
                    textAlign="center"
                  >
                    <Text fontWeight="bold">{balance.name}</Text>
                    <Flex align="center" justify="center">
                      <MdCurrencyRupee size={12} />
                      <Text>{balance.amount.toLocaleString("en-IN")}</Text>
                    </Flex>
                  </Box>
                ))}
              </SimpleGrid>
              {/* Income Table for Print */}
              <Table>
                <Thead>
                  <Tr>
                    <Th>Sr No.</Th>
                    <Th>Source</Th>
                    <Th>Amount</Th>
                    <Th>Account</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {((sectionData) => {
                    let srNo = 1;
                    const renderSection = (title, data) => {
                      const filtered = (data || []).filter(
                        (item) => item.amount > 0
                      );
                      if (filtered.length === 0) return null;

                      return (
                        <>
                          <Tr>
                            <Td colSpan={4} fontWeight="bold">
                              {title}
                            </Td>
                          </Tr>
                          {filtered.map((item, index) => (
                            <Tr key={`${title}-${index}`}>
                              <Td>{srNo++}</Td>
                              <Td>{item.name}</Td>
                              <Td>{item.amount.toLocaleString("en-IN")}</Td>
                              <Td>{item.accountNumber || "-"}</Td>
                            </Tr>
                          ))}
                        </>
                      );
                    };

                    return (
                      <>
                        {renderSection(
                          "Academic Fees",
                          allCashBook?.academicFeesReportList
                        )}
                        {renderSection(
                          "Transporter Fees",
                          allCashBook?.transporterFeesReportList
                        )}
                        <Tr>
                          <Td colSpan={2} fontWeight="bold">
                            Total Income:
                          </Td>
                          <Td>{totalAmountIncome.toLocaleString("en-IN")}</Td>
                          <Td />
                        </Tr>
                      </>
                    );
                  })()}
                </Tbody>
              </Table>
              {/* Expense Table for Print */}
              <Table mt={4}>
                <Thead>
                  <Tr>
                    <Th>Sr No.</Th>
                    <Th>Ledger</Th>
                    <Th>Date</Th>
                    <Th>Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {map(allCashBook?.drlist, (statement, index) => (
                    <Tr key={index}>
                      <Td>{index + 1}</Td>
                      <Td>{statement.name || "-"}</Td>
                      <Td>
                        {statement.voucherDate
                          ? new Date(statement.voucherDate).toLocaleDateString(
                              "en-GB"
                            )
                          : "-"}
                      </Td>
                      <Td>₹{statement.amount.toLocaleString("en-IN")}</Td>
                    </Tr>
                  ))}
                  <Tr>
                    <Td colSpan={3} fontWeight="bold">
                      Total Expenses:
                    </Td>
                    <Td>₹{totalAmountExpense.toLocaleString("en-IN")}</Td>
                  </Tr>
                </Tbody>
              </Table>

              {/* Closing Balances for Print */}
              <SimpleGrid columns={4} spacing={2} mt={4}>
                {map(allCashBook?.closingBalance, (balance, index) => (
                  <Box
                    key={index}
                    p={2}
                    border="1px solid"
                    borderColor="gray.200"
                    textAlign="center"
                  >
                    <Text fontWeight="bold">{balance.name}</Text>
                    <Flex align="center" justify="center">
                      <MdCurrencyRupee size={12} />
                      <Text>{balance.amount.toLocaleString("en-IN")}</Text>
                    </Flex>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};
