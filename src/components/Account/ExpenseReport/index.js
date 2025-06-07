import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Select,
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
import { SchoolHeader } from "@/common/SchoolHeader";
import { useReactToPrint } from "react-to-print";

export const ExpenseReport = ({ themeColor, sessionMasterId }) => {
  const [inputValue, setInputValue] = useState({
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
    ledgerMasterId: "all",
    expenseTypeId: "all",
    paymentMode: "all",
    sortBy: "date",
  });

  const {
    getExpenseDataAction,
    getExpenseDataStatus,
    allExpenseData,
    getLedgerAction,
    getLedgerStatus,
    allLedgers,
    getExpenseTypeAction,
    getExpenseTypeStatus,
    allExpenseTypes,
  } = useAccountStore((s) => ({
    getExpenseDataAction: s.getExpenseDataAction,
    getExpenseDataStatus: s.getExpenseDataStatus,
    allExpenseData: s.allExpenseData,
    getLedgerAction: s.getLedgerAction,
    getLedgerStatus: s.getLedgerStatus,
    allLedgers: s.allLedgers,
    getExpenseTypeAction: s.getExpenseTypeAction,
    getExpenseTypeStatus: s.getExpenseTypeStatus,
    allExpenseTypes: s.allExpenseTypes,
  }));

  useEffect(() => {
    if ((getLedgerStatus || 1) === STATUS.NOT_STARTED) {
      getLedgerAction();
    }
    if ((getExpenseTypeStatus || 1) === STATUS.NOT_STARTED) {
      getExpenseTypeAction();
    }
  }, [
    getExpenseTypeAction,
    getExpenseTypeStatus,
    getLedgerAction,
    getLedgerStatus,
  ]);

  const getData = (e) => {
    e.preventDefault();
    getExpenseDataAction({
      ...inputValue,
      sessionMasterId,
      ledgerMasterId: inputValue?.ledgerMasterId || "all",
      expenseTypeId: inputValue?.expenseTypeId || "all",
      paymentMode: inputValue?.paymentMode || "all",
      sortBy: inputValue?.sortBy || "date",
    });
  };

  const [allPrintProps, setAllPrintProps] = useState(null);
  const printAllRef = useRef(null);

  const handlePrintAllClick = () => {
    setAllPrintProps(allExpenseData);
  };

  const handleAllPrint = useReactToPrint({
    content: () => printAllRef.current,
    onAfterPrint: () => setAllPrintProps(null),
    onPrintError: () => setAllPrintProps(null),
  });

  useEffect(() => {
    if (allPrintProps?.length) {
      handleAllPrint();
    }
  }, [allPrintProps, handleAllPrint]);

  return (
    <Box>
      <PageHeader heading={"Expense Report"} />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <form onSubmit={getData}>
            <Flex gap={4} align={"center"} my={2} w={"90%"}>
              <CustomInput
                size={"sm"}
                notRequire={true}
                type={"date"}
                name="startDate"
                label={"Start Date"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                size={"sm"}
                notRequire={true}
                type={"date"}
                name="endDate"
                label={"End Date"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomSelect
                size={"md"}
                name={"ledgerMasterId"}
                label={"All Ledger"}
                notRequire={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
                // data={[
                //   { name: "Select All", value: "all" },
                //   ...map(allLedgers, (l) => ({ value: l.id, name: l.name })),
                // ]}
                data={[
                  { name: "Select All", value: "all" },
                  ...map(
                    filter(
                      allLedgers,
                      (l) => l.type !== "CASH" && l.type !== "BANK"
                    ),
                    (l) => ({ value: l.id, name: l.name })
                  ),
                ]}
              />

              <CustomSelect
                size={"md"}
                name={"paymentMode"}
                label={"All Mode"}
                notRequire={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[
                  { name: "Select All", value: "all" },
                  { name: "Cash", value: "cash" },
                  { name: "Cheque", value: "cheque" },
                  { name: "Net Banking", value: "netBanking" },
                  { name: "UPI", value: "upi" },
                  { name: "Credit Card", value: "creditCard" },
                  { name: "Debit Card", value: "debitCard" },
                  { name: "Payment Gateway", value: "paymentGateway" },
                  { name: "Other", value: "other" },
                ]}
              />

              <CustomSelect
                size={"md"}
                name={"expenseTypeId"}
                label={"All Expense Type"}
                notRequire={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[
                  { name: "Select All", value: "all" },
                  ...map(allExpenseTypes, (l) => ({
                    value: l.id,
                    name: l.type,
                  })),
                ]}
              />
              <CustomSelect
                size={"md"}
                name={"sortBy"}
                label={"Sort By"}
                notRequire={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[
                  { name: "Date", value: "date" },
                  { name: "Voucher No.", value: "voucherNo" },
                ]}
              />
              <Button
                size={"sm"}
                type="submit"
                colorScheme={themeColor}
                width={"10%"}
              >
                Get
              </Button>
              <Button
                ml={2}
                px={4}
                width={"20%"}
                size={"sm"}
                colorScheme={themeColor}
                isDisabled={allExpenseData?.length ? false : true}
                onClick={handlePrintAllClick}
              >
                Print
              </Button>
            </Flex>
          </form>
          <LoadingContainer status={getExpenseDataStatus}>
            {allExpenseData?.length ? (
              <ExpenseData allExpenseData={allExpenseData} />
            ) : (
              <NoData title={"No Expense Report Found"} />
            )}
            <Box display={"none"}>
              {allPrintProps && allPrintProps?.length && (
                <Box ref={printAllRef} p={5}>
                  <style>{`
      @media print {
        @page { size: A4 landscape; margin: 1cm; }
      }
    `}</style>
                  <SchoolHeader title={"Expense Report"} />
                  <ExpenseData allExpenseData={allExpenseData} />
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

const ExpenseData = ({ allExpenseData }) => {
  return (
    <TableContainer mt={2}>
      <Table w="100%" size={"sm"} variant={"simple"}>
        <Thead>
          <Tr bg="gray.100">
            <Th>Voucher No.</Th>
            <Th>Date</Th>
            <Th>Ledger Name</Th>
            <Th>Expense Type</Th>
            <Th>Mode</Th>
            <Th>Bank</Th>
            <Th>Amount</Th>
            <Th>Remark</Th>
          </Tr>
        </Thead>
        <Tbody>
          {map(allExpenseData, (expense, index) => (
            <Tr>
              <Td>{expense.voucherNo}</Td>
              <Td>
                {expense.voucherDate
                  ? dayjs(expense.voucherDate).format("DD-MM-YYYY")
                  : null}
              </Td>
              <Td>{expense.ledger_master?.name}</Td>
              <Td>{expense.expense_type?.type}</Td>
              <Td>
                <Box align={"center"}>
                  <Text>{expense.paymentMode || "Cash"}</Text>
                  <Text color={"gray.500"} fontSize={11} fontStyle={"italic"}>
                    {expense.transactionNo}
                  </Text>
                </Box>
              </Td>
              <Td>
                {expense.anotherLedgerMaster?.type === "CASH" ||
                expense.anotherLedgerMaster?.type === "BANK" ? (
                  <Box align={"center"}>
                    <Text>{expense.anotherLedgerMaster?.name}</Text>
                    <Text color={"gray.500"} fontSize={11} fontStyle={"italic"}>
                      {expense.anotherLedgerMaster?.accountNumber}
                    </Text>
                  </Box>
                ) : (
                  ""
                )}
              </Td>
              <Td>{expense.amount}</Td>
              <Td>{expense.remark}</Td>
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          <Tr bg="gray.200" fontWeight="bold">
            <Td colSpan={6} textAlign="right">
              Total
            </Td>
            <Td>
              ₹{" "}
              {allExpenseData
                ?.reduce((sum, item) => sum + Number(item.amount || 0), 0)
                .toFixed(2)}
            </Td>
            <Td></Td>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};
