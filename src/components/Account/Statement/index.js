import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { filter, map } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import CustomInput from "@/common/CustomInput";
import dayjs from "dayjs";
import { CustomSelect } from "@/common/CustomSelect";
import { useAccountStore } from "@/store/Account";
import { STATUS } from "@/constant";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { useReactToPrint } from "react-to-print";
import { SchoolHeader } from "@/common/SchoolHeader";

export const Statement = ({ themeColor, sessionMasterId }) => {
  const [inputValue, setInputValue] = useState({
    startDate: dayjs().startOf('month').format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });

  const {
    getStatementAction,
    getStatementStatus,
    allStatement,
    resetStatement,
    getLedgerAction,
    getLedgerStatus,
    allLedgers,
    closeingBalance,
  } = useAccountStore((s) => ({
    getStatementAction: s.getStatementAction,
    getStatementStatus: s.getStatementStatus,
    allStatement: s.allStatement,
    resetStatement: s.resetStatement,
    getLedgerAction: s.getLedgerAction,
    getLedgerStatus: s.getLedgerStatus,
    allLedgers: s.allLedgers,
    closeingBalance: s.closeingBalance,
  }));

  useEffect(() => {
    if ((getLedgerStatus || 1) === STATUS.NOT_STARTED) {
      getLedgerAction();
    }
  }, [
    getLedgerAction,
    getLedgerStatus,
    getStatementAction,
    getStatementStatus,
    sessionMasterId,
  ]);

  useEffect(() => {
    return () => resetStatement();
  }, [resetStatement]);

  const getData = (e) => {
    e.preventDefault();
    getStatementAction({
      ...inputValue,
      sessionMasterId,
      ledgerMasterId: inputValue?.ledgerMasterId,
    });
  };

  const [allPrintProps, setAllPrintProps] = useState(null);
  const printAllRef = useRef(null);

  const handlePrintAllClick = () => {
    setAllPrintProps(allStatement);
  };

  const handleAllPrint = useReactToPrint({
    content: () => printAllRef.current,
    onAfterPrint: () => setAllPrintProps(null),
    onPrintError: () => setAllPrintProps(null),
    pageStyle: `
        @page {
            size: landscape;
          }
        `,
  });

  useEffect(() => {
    if (allPrintProps?.length) {
      handleAllPrint();
    }
  }, [allPrintProps, handleAllPrint]);

  return (
    <Box>
      <PageHeader heading={"Statement"} />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <Flex justify={"space-between"}>
            <form style={{ width: "70%" }} onSubmit={getData}>
              <Flex gap={4} align={"center"} mt={2}>
                <CustomSelect
                  w={"20%"}
                  size={"md"}
                  name={"ledgerMasterId"}
                  label={"Select Ledger"}
                  notRequire={true}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(
                    filter(allLedgers, (l) => l.type !== "CASH" && l.type !== "BANK"),
                    (l) => ({ value: l.id, name: l.name })
                  )}
                  
                />
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
                <Button
                  size={"sm"}
                  type="submit"
                  isDisabled={inputValue?.ledgerMasterId ? false : true}
                  colorScheme={themeColor}
                >
                  Get
                </Button>
              </Flex>
            </form>
            <Button
              px={4}
              size={"sm"}
              colorScheme={themeColor}
              isDisabled={allStatement?.length ? false : true}
              onClick={handlePrintAllClick}
            >
              Print
            </Button>
          </Flex>
          <LoadingContainer status={getStatementStatus}>
            {allStatement?.length ? (
              <StatementData
                allStatement={allStatement}
                closeingBalance={closeingBalance}
              />
            ) : (
              <NoData title={"No Statement Found"} />
            )}

            <Box display={"none"}>
              {allPrintProps && allPrintProps?.length && (
                <Box ref={printAllRef} p={5}>
                  <SchoolHeader title={"Statement Report"} />
                  <StatementData
                    allStatement={allStatement}
                    closeingBalance={closeingBalance}
                  />
                </Box>
              )}
            </Box>
          </LoadingContainer>
        </Box>
        {/* {toggleDrawer && <AddExpense data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} />} */}
      </Box>
    </Box>
  );
};

const StatementData = ({ allStatement, closeingBalance }) => {
  const DR = allStatement
    .reduce(
      (sum, item) =>
        sum + (item.type === "DR" ? item.feesAmount || item.amount || 0 : 0),
      0
    )
    .toFixed(2);
  const CR = allStatement
    .reduce(
      (sum, item) =>
        sum + (item.type === "CR" ? item.feesAmount || item.amount || 0 : 0),
      0
    )
    .toFixed(2);

  return (
    <TableContainer mt={4}>
      <Table w="100%" size="sm" variant="simple">
        <Thead bg="gray.100">
          <Tr>
            <Th>Date</Th>
            <Th>Voucher No.</Th>
            <Th>Voucher Type</Th>
            <Th>Ledger</Th>
            <Th>Bank Info</Th>
            <Th>Mode / Ref</Th>
            <Th isNumeric>DR (₹)</Th>
            <Th isNumeric>CR (₹)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {/* Closing Balance Row */}
          <Tr bg="gray.50">
            <Td colSpan={6} textAlign="right" fontWeight="bold">
              Opening Balance
            </Td>
            {closeingBalance.balanceType === "DR" && (
              <>
                <Td isNumeric fontWeight="bold">
                  ₹ {Math.abs(closeingBalance.closingBalance).toFixed(2)} DR
                </Td>
                <Td isNumeric>-</Td>
              </>
            )}
            {closeingBalance.balanceType === "CR" && (
              <>
                <Td isNumeric>-</Td>
                <Td isNumeric fontWeight="bold">
                  ₹ {Math.abs(closeingBalance.closingBalance).toFixed(2)} CR
                </Td>
              </>
            )}
            {closeingBalance.balanceType === "Balanced" && (
              <Td colSpan={2} textAlign="center" fontWeight="bold">
                ₹ {Math.abs(closeingBalance.closingBalance).toFixed(2)} Balanced
              </Td>
            )}
          </Tr>

          {/* All Entries */}
          {allStatement.map((entry, index) => {
            const {
              voucherDate,
              type,
              voucherNo,
              feesAmount,
              amount,
              ledgerMaster,
              anotherLedgerMaster,
              paymentMode,
              transactionNo,
              chequeNo,
              remark,
              entryType,
              paymentType,
            } = entry;

            const ledger =
              ledgerMaster?.name || entry.ledger_master?.name || "-";
            const anotherLedger =
              anotherLedgerMaster?.name ||
              entry.anotherLedgerMaster?.name ||
              "-";
            const bankAccount = anotherLedgerMaster?.accountNumber || "-";
            const refNumber = transactionNo || chequeNo || "-";
            const displayAmount = feesAmount || amount || 0;
            const entryDate = voucherDate ? new Date(voucherDate).toLocaleDateString("en-GB"): "-";
            const finalEntryType = "Payment";
            const voucherNoNo = voucherNo || "-";

            return (
              <Tr key={index}>
                <Td>{entryDate}</Td>
                <Td>{voucherNoNo}</Td>
                <Td>{finalEntryType}</Td>
                <Td>
                  <Text fontWeight="medium">{ledger}</Text>
                  {remark && (
                    <Text color="gray.500" fontSize="xs" fontStyle="italic">
                      {remark}
                    </Text>
                  )}
                </Td>
                <Td>
                  {anotherLedgerMaster?.type === "BANK" ? (
                    <>
                      <Text>{anotherLedger}</Text>
                      <Text color="gray.500" fontSize="xs" fontStyle="italic">
                        {bankAccount}
                      </Text>
                    </>
                  ) : (
                    "-"
                  )}
                </Td>
                <Td>
                  <Text>{paymentMode || "-"}</Text>
                  <Text color="gray.500" fontSize="xs" fontStyle="italic">
                    {refNumber}
                  </Text>
                </Td>
                <Td isNumeric>
                  {type === "DR" ? displayAmount.toFixed(2) : "-"}
                </Td>
                <Td isNumeric>
                  {type === "CR" ? displayAmount.toFixed(2) : "-"}
                </Td>
              </Tr>
            );
          })}

          <Tr>
            <Td colSpan={6} textAlign="right" fontWeight="bold">
              Total
            </Td>
            <Td isNumeric fontWeight="bold">
              ₹ {DR}
            </Td>
            <Td isNumeric fontWeight="bold">
              ₹ {CR}
            </Td>
         
          </Tr>
     
          <Tr>
            <Td colSpan={6} textAlign="right" fontWeight="bold">
              Closing Balance
            </Td>
            <Td colSpan={2} textAlign="center" fontWeight="bold">
              ₹ {(Number(closeingBalance.closingBalance) + (DR - CR)).toFixed(2)} {DR > CR ? "DR" : "CR"}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};
