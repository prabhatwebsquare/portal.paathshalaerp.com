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
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import dayjs from "dayjs";
import { CustomSelect } from "@/common/CustomSelect";
import CustomInput from "@/common/CustomInput";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { STATUS } from "@/constant";
import { useAccountStore } from "@/store/Account";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { LedgerMaster } from "../LedgerMaster";
import { BsEyeFill } from "react-icons/bs";
import { RiFileExcel2Fill } from "react-icons/ri";
import { DownloadExcel } from "@/common/DownloadExcel";
import { MdCurrencyRupee, MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { SchoolHeader } from "@/common/SchoolHeader";

export const DayBook = ({ sessionMasterId, themeColor }) => {
  const [inputValue, setInputValue] = useState({
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
    // reportType: "DayBook",
  });

  const { getBankAction, getBankStatus, allBanks } = useAdditionalSetupStore(
    (s) => ({
      getBankAction: s.getBankAction,
      getBankStatus: s.getBankStatus,
      allBanks: s.allBanks,
    })
  );

  const {
    getAccountBookAction,
    getAccountBookStatus,
    allAccountBook,
    resetAccountBook,
  } = useAccountStore((s) => ({
    getAccountBookAction: s.getAccountBookAction,
    getAccountBookStatus: s.getAccountBookStatus,
    allAccountBook: s.allAccountBook,
    resetAccountBook: s.resetAccountBook,
  }));

  useEffect(() => {
    if ((getBankStatus || 1) === STATUS.NOT_STARTED) {
      getBankAction();
    }
    if ((getAccountBookStatus || 1) === STATUS.NOT_STARTED) {
      getAccountBookAction({
        ...inputValue,
        sessionMasterId,
        ledgerMasterId: "all",
      });
    }
  }, [
    getAccountBookAction,
    getAccountBookStatus,
    getBankAction,
    getBankStatus,
    inputValue,
    sessionMasterId,
  ]);

  useEffect(() => {
    return () => resetAccountBook();
  }, [resetAccountBook]);

  const getData = (e) => {
    e.preventDefault();
    getAccountBookAction({
      ...inputValue,
      sessionMasterId,
      // ledgerMasterId: inputValue?.reportType === "DayBook" ? "all" : inputValue?.reportType === "CashBook" ? 1 : inputValue?.bankId
    });
  };
  const formatTransactionType = (type) => {
    if (!type) return "-";
    return type
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (str) => str.toUpperCase());
  };
  const [excelData, setExcelData] = useState(null);

  useEffect(() => {
    if (allAccountBook?.length > 0) {
      const formattedData = allAccountBook.map((statement) => {
        const fromType =
          statement?.anotherLedgerMaster?.type ||
          statement?.anotherLedgerMaster?.name ||
          "-";
        const toType =
          statement?.ledger_master?.type ||
          statement?.ledger_master?.name ||
          "-";

        const formattedReceiver = toType?.toLowerCase().includes("bank")
          ? `Bank (${statement.ledger_master?.bank || "-"} ${
              statement.ledger_master?.accountNumber || "-"
            })`
          : toType;

        const formattedGiver = fromType?.toLowerCase().includes("bank")
          ? `Bank (${statement.anotherLedgerMaster?.bank || "-"} ${
              statement.anotherLedgerMaster?.accountNumber || "-"
            })`
          : fromType;

        return {
          VoucherNo: statement.voucherNo || "-",
          Date: statement.voucherDate
            ? new Date(statement.voucherDate).toLocaleDateString("en-GB")
            : "-",
          Type: formatTransactionType(statement.transactionType),
          Receiver: formattedReceiver,
          Giver: formattedGiver,
          Amount: `₹ ${statement.amount || 0}`,
          Narration: statement.remark || "-",
        };
      });

      setExcelData(formattedData);
    }
  }, [allAccountBook]);
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Bank Transaction Report",
  });
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headerBg = useColorModeValue(`${themeColor}.50`, `${themeColor}.900`);
  const footerBg = useColorModeValue(`${themeColor}.100`, `${themeColor}.800`);
  const totalAmount = allAccountBook?.reduce(
    (acc, curr) => acc + (Number(curr.amount) || 0),
    0
  );
  return (
    <Box>
      <PageHeader
        heading={"Bank Transaction Report"}
        extra={
          <Flex>
            <Tooltip label="Print" placement="top">
              <Button
                mr={3}
                size={"sm"}
                onClick={handlePrint}
                colorScheme={themeColor}
              >
                <MdLocalPrintshop fontSize={18} />
              </Button>
            </Tooltip>
            <Tooltip label="Download Excel" placement="top">
              <DownloadExcel
                button={<RiFileExcel2Fill />}
                data={excelData}
                name={"Bank Transaction Report"}
              />
            </Tooltip>
          </Flex>
        }
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <form onSubmit={getData}>
            <Flex gap={4} align={"center"} my={2}>
              <CustomInput
                w={"20%"}
                size={"sm"}
                notRequire={true}
                type={"date"}
                name="startDate"
                label={"Start Date"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                w={"20%"}
                size={"sm"}
                notRequire={true}
                type={"date"}
                name="endDate"
                label={"End Date"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              {/* <CustomSelect w={"20%"} size={"md"} name={"reportType"} label={"Select Report Type"} notRequire={true} inputValue={inputValue} setInputValue={setInputValue} data={[
                                { value: "DayBook", name: "Day Book" },
                                { value: "CashBook", name: "Cash Book" },
                                { value: "BankBook", name: "Bank Book" },
                            ]} /> */}
              {inputValue?.reportType === "BankBook" ? (
                <CustomSelect
                  w={"20%"}
                  size={"md"}
                  name={"bankId"}
                  label={"Select Bank"}
                  notRequire={true}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(allBanks, (bank) => ({
                    value: bank.id,
                    name: bank.name + " - " + bank.accountNumber,
                  }))}
                />
              ) : null}
              <Button size={"sm"} type="submit" colorScheme={themeColor}>
                Get
              </Button>
            </Flex>
          </form>
          <LoadingContainer status={getAccountBookStatus}>
            {allAccountBook?.length ? (
         <ScaleFade initialScale={0.95} in={true}>
         <TableContainer
           mt={4}
           bg={cardBg}
           borderRadius="xl"
           boxShadow={`0 6px 12px ${themeColor}.100`}
           border="1px solid"
           borderColor={`${themeColor}.100`}
           overflowX="auto"
           p={4}
           sx={{
             "@media print": {
               boxShadow: "none",
               border: `1px solid ${themeColor}.200`,
             },
           }}
         >
           <Table size="sm" variant="simple" colorScheme={themeColor}>
             <Thead>
               <Tr bg={headerBg}>
                 <Th
                   color={`${themeColor}.700`}
                   fontWeight="bold"
                   textTransform="uppercase"
                   fontSize="xs"
                   py={3}
                 >
                   Voucher No.
                 </Th>
                 <Th
                   color={`${themeColor}.700`}
                   fontWeight="bold"
                   textTransform="uppercase"
                   fontSize="xs"
                   py={3}
                 >
                   Date
                 </Th>
                 <Th
                   color={`${themeColor}.700`}
                   fontWeight="bold"
                   textTransform="uppercase"
                   fontSize="xs"
                   py={3}
                 >
                   Type
                 </Th>
                 <Th
                   color={`${themeColor}.700`}
                   fontWeight="bold"
                   textTransform="uppercase"
                   fontSize="xs"
                   py={3}
                 >
                   Giver
                 </Th>
                 <Th
                   color={`${themeColor}.700`}
                   fontWeight="bold"
                   textTransform="uppercase"
                   fontSize="xs"
                   py={3}
                 >
                   Receiver
                 </Th>
               
                 <Th
                   color={`${themeColor}.700`}
                   fontWeight="bold"
                   textTransform="uppercase"
                   fontSize="xs"
                   py={3}
                   isNumeric
                 >
                   Amount
                 </Th>
                 <Th
                   color={`${themeColor}.700`}
                   fontWeight="bold"
                   textTransform="uppercase"
                   fontSize="xs"
                   py={3}
                 >
                   Narration
                 </Th>
               </Tr>
             </Thead>
             <Tbody fontSize={{ base: "xs", md: "sm" }} color={textColor}>
               {map(allAccountBook, (statement) => {
                 const fromType =
                   statement?.anotherLedgerMaster?.type ||
                   statement?.anotherLedgerMaster?.name ||
                   "-";
                 const toType =
                   statement?.ledger_master?.type ||
                   statement?.ledger_master?.name ||
                   "-";
   
                 const formattedReceiver = toType?.toLowerCase().includes("bank")
                   ? ` (${statement.ledger_master?.bank || "-"} ${
                       statement.ledger_master?.accountNumber || "-"
                     })`
                   : toType;
   
                 const formattedGiver = fromType?.toLowerCase().includes("bank")
                   ? ` (${statement.anotherLedgerMaster?.bank || "-"} ${
                       statement.anotherLedgerMaster?.accountNumber || "-"
                     })`
                   : fromType;
   
                 return (
                   <Tr
                     key={statement.id}
                     _hover={{
                       bg: `${themeColor}.50`,
                       transform: "translateY(-1px)",
                       boxShadow: `0 2px 4px ${themeColor}.100`,
                     }}
                     transition="all 0.2s ease"
                     sx={{
                       "@media print": {
                         _hover: { bg: "transparent", transform: "none", boxShadow: "none" },
                       },
                     }}
                   >
                     <Td>{statement.voucherNo || "-"}</Td>
                     <Td>
                       {statement.voucherDate
                         ? dayjs(statement.voucherDate).format("DD-MM-YYYY")
                         : "-"}
                     </Td>
                     <Td>
                       <Text
                         fontWeight="semibold"
                         color={`${themeColor}.600`}
                         textTransform="capitalize"
                       >
                         {formatTransactionType(statement.transactionType)}
                       </Text>
                     </Td>
                     <Td>{formattedGiver}</Td>
                     <Td>{formattedReceiver}</Td>
                  
                     <Td isNumeric>
                       <Flex align="center" justify="flex-end">
                         <Text fontWeight="bold" color={`${themeColor}.700`}>
                           ₹ {statement.amount}
                         </Text>
                       </Flex>
                     </Td>
                     <Td>
                       <Text isTruncated maxW="200px">
                         {statement.remark || "-"}
                       </Text>
                     </Td>
                   </Tr>
                 );
               })}
             </Tbody>
             <Tfoot>
               <Tr bg={footerBg}>
                 <Td colSpan={5} fontWeight="bold" color={`${themeColor}.700`}>
                   Total
                 </Td>
                 <Td isNumeric fontWeight="bold" color={`${themeColor}.700`}>
                   ₹ {totalAmount}
                 </Td>
                 <Td />
               </Tr>
             </Tfoot>
           </Table>
         </TableContainer>
       </ScaleFade>
            ) : (
              <NoData title={"No Data Found"} />
            )}
          </LoadingContainer>
          <Box display="none">
            <Box ref={printRef} p={5}>
              <style>{`
      @media print {
        @page { size: A4 landscape; margin: 1cm; }
      }
    `}</style>

              <SchoolHeader
                title="Ledger Report"
                extra={
                  <>
                    {inputValue?.startDate ? (
                      <Flex w="100%" justify="flex-end" fontSize={12}>
                        <Text w="fit-content">Date:</Text>
                        <Text ml={2} w="fit-content" fontWeight="semibold">
                          {dayjs(inputValue.startDate).format("DD-MM-YYYY")} -{" "}
                          {dayjs(inputValue.endDate).format("DD-MM-YYYY")}
                        </Text>
                      </Flex>
                    ) : null}
                  </>
                }
              />

              {allAccountBook?.length ? (
                <TableContainer mt={5}>
                  <Table size="sm" variant="simple" className="print-table">
                    <Thead>
                      <Tr bg="gray.100">
                        <Th>Voucher No.</Th>
                        <Th>Voucher Date</Th>
                        <Th>Transaction Type</Th>
                        <Th>Receiver</Th>
                        <Th>Giver</Th>
                        <Th>Amount</Th>
                        <Th>Remark</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {allAccountBook.map((statement) => {
                        const fromType =
                          statement?.anotherLedgerMaster?.type ||
                          statement?.anotherLedgerMaster?.name ||
                          "-";

                        const toType =
                          statement?.ledger_master?.type ||
                          statement?.ledger_master?.name ||
                          "-";

                        const formattedReceiver = toType
                          ?.toLowerCase()
                          .includes("bank")
                          ? `Bank (${statement.ledger_master?.bank || "-"} ${
                              statement.ledger_master?.accountNumber || "-"
                            })`
                          : toType;

                        const formattedGiver = fromType
                          ?.toLowerCase()
                          .includes("bank")
                          ? `Bank (${
                              statement.anotherLedgerMaster?.bank || "-"
                            } ${
                              statement.anotherLedgerMaster?.accountNumber ||
                              "-"
                            })`
                          : fromType;

                        return (
                          <Tr key={statement.id}>
                            <Td>{statement.voucherNo || "-"}</Td>
                            <Td>
                              {statement.voucherDate
                                ? dayjs(statement.voucherDate).format(
                                    "DD-MM-YYYY"
                                  )
                                : "-"}
                            </Td>
                            <Td>
                              {formatTransactionType(statement.transactionType)}
                            </Td>
                            <Td>{formattedReceiver}</Td>
                            <Td>{formattedGiver}</Td>
                            <Td>
                              <Flex align="center" justify="flex-end">
                                <MdCurrencyRupee size={12} />
                                {statement.amount}
                              </Flex>
                            </Td>
                            <Td fontSize="xs">{statement.remark || "-"}</Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                    <Tfoot>
                      <Tr bg="gray.100" fontWeight="bold">
                        <Td colSpan={5}>Total</Td>
                        <Td>
                          <Flex align="center" justify="flex-end">
                            <MdCurrencyRupee size={12} />
                            {allAccountBook.reduce(
                              (acc, val) => acc + val.amount,
                              0
                            )}
                          </Flex>
                        </Td>
                        <Td></Td>
                      </Tr>
                    </Tfoot>
                  </Table>
                </TableContainer>
              ) : (
                <NoData title="No Ledger Records Found" />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
