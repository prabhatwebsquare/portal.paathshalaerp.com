import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
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
import { map, sumBy } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import dayjs from "dayjs";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { AddContraVoucher } from "./AddContraVoucher";
import { useAccountStore } from "@/store/Account";
import { STATUS } from "@/constant";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { DeleteButton } from "@/common/DeleteButton";
import { SchoolHeader } from "@/common/SchoolHeader";
import { useReactToPrint } from "react-to-print";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
export const ContraVoucher = ({ sessionMasterId, themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);

  const {
    getContraVoucherAction,
    getContraVoucherStatus,
    allContraVouchers,
    resetContraVoucherData,
    deleteContraVoucherAction,
    deleteContraVoucherStatus,
    resetContraVoucherStatus,
  } = useAccountStore((s) => ({
    getContraVoucherAction: s.getContraVoucherAction,
    getContraVoucherStatus: s.getContraVoucherStatus,
    allContraVouchers: s.allContraVouchers,
    resetContraVoucherData: s.resetContraVoucherData,
    deleteContraVoucherAction: s.deleteContraVoucherAction,
    deleteContraVoucherStatus: s.deleteContraVoucherStatus,
    resetContraVoucherStatus: s.resetContraVoucherStatus,
  }));

  useEffect(() => {
    if ((getContraVoucherStatus || 1) === STATUS.NOT_STARTED) {
      getContraVoucherAction({ sessionMasterId });
    }
  }, [getContraVoucherAction, getContraVoucherStatus, sessionMasterId]);

  useEffect(() => {
    return () => resetContraVoucherData();
  }, [resetContraVoucherData]);

  const deleteContraVoucher = (id) => {
    deleteContraVoucherAction(id);
  };

  const [allPrintProps, setAllPrintProps] = useState(null);
  const printAllRef = useRef(null);

  const handlePrintAllClick = () => {
    setAllPrintProps(allContraVouchers);
  };

  const handleAllPrint = useReactToPrint({
    content: () => printAllRef.current,
    onAfterPrint: () => setAllPrintProps(null),
    onPrintError: () => setAllPrintProps(null),
    // pageStyle: `
    // @page {
    //     size: landscape;
    //   }
    // `,
  });

  useEffect(() => {
    if (allPrintProps?.length) {
      handleAllPrint();
    }
  }, [allPrintProps, handleAllPrint]);
  const formatTransactionType = (type) => {
    if (!type) return "-";
    return type
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (str) => str.toUpperCase());
  };
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headerBg = useColorModeValue(`${themeColor}.50`, `${themeColor}.900`);
  const footerBg = useColorModeValue(`${themeColor}.100`, `${themeColor}.800`);
  return (
    <Box>
      <PageHeader
        heading={"Bank Transaction"}
        extra={
          <Flex>
           
            {HasPermission(PERMISSIONS.CONTRA_VOUCHER_ADD) && (
           <Button
           size={"sm"}
           colorScheme={themeColor}
           leftIcon={<AddIcon />}
           onClick={() => setToggleDrawer([])}
         >
           Contra Voucher
         </Button>
            )}
            <Button
              ml={2}
              px={4}
              size={"sm"}
              colorScheme={themeColor}
              isDisabled={allContraVouchers?.length ? false : true}
              onClick={handlePrintAllClick}
            >
              Print
            </Button>
          </Flex>
        }
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getContraVoucherStatus}>
            {allContraVouchers?.length ? (
              <Table size="sm" variant="simple" colorScheme={themeColor}>
                <Thead>
                  <Tr bg={headerBg}>
                    {[
                      "Voucher No.",
                      "Date", 
                      "Type",
                      "Giver",
                      "Receiver",
                      "Amount",
                      "Narration",
                      ...(HasPermission(PERMISSIONS.CONTRA_VOUCHER_EDIT) || 
                          HasPermission(PERMISSIONS.CONTRA_VOUCHER_DELETE) ? 
                          ["Action"] : [])
                    ].map((heading, i) => (
                      <Th
                        key={i}
                        color={`${themeColor}.700`}
                        fontWeight="bold"
                        textTransform="uppercase"
                        fontSize="xs"
                        py={3}
                        isNumeric={heading === "Amount"}
                      >
                        {heading}
                      </Th>
                    ))}
                  </Tr>
                </Thead>

                <Tbody fontSize={{ base: "xs", md: "sm" }} color={textColor}>
                  {map(allContraVouchers, (voucher) => {
                    const receiver =
                      voucher?.ledger_master?.type ||
                      voucher?.ledger_master?.name ||
                      "-";
                    const giver =
                      voucher?.anotherLedgerMaster?.type ||
                      voucher?.anotherLedgerMaster?.name ||
                      "-";

                    const formattedReceiver = receiver
                      ?.toLowerCase()
                      .includes("bank")
                      ? `(${voucher.ledger_master?.bank || "-"} ${
                          voucher.ledger_master?.accountNumber || "-"
                        })`
                      : receiver;

                    const formattedGiver = giver?.toLowerCase().includes("bank")
                      ? `(${voucher.anotherLedgerMaster?.bank || "-"} ${
                          voucher.anotherLedgerMaster?.accountNumber || "-"
                        })`
                      : giver;

                    return (
                      <Tr
                        key={voucher.id}
                        _hover={{
                          bg: `${themeColor}.50`,
                          transform: "translateY(-1px)",
                          boxShadow: `0 2px 4px ${themeColor}.100`,
                        }}
                        transition="all 0.2s ease"
                        sx={{
                          "@media print": {
                            _hover: {
                              bg: "transparent",
                              transform: "none",
                              boxShadow: "none",
                            },
                          },
                        }}
                      >
                        <Td>{voucher.voucherNo}</Td>
                        <Td>
                          {voucher.voucherDate
                            ? dayjs(voucher.voucherDate).format("DD-MM-YYYY")
                            : "-"}
                        </Td>
                        <Td>
                          <Text
                            fontWeight="semibold"
                            color={`${themeColor}.600`}
                            textTransform="capitalize"
                          >
                            {formatTransactionType(voucher.transactionType)}
                          </Text>
                        </Td>
                        <Td>{formattedReceiver}</Td>
                        <Td>{formattedGiver}</Td>

                        <Td isNumeric>
                          <Flex align="center" justify="flex-end">
                            <Text fontWeight="bold" color={`${themeColor}.700`}>
                              ₹ {voucher.amount}
                            </Text>
                          </Flex>
                        </Td>
                        <Td>
                          <Text isTruncated maxW="200px">
                            {voucher.remark || "-"}
                          </Text>
                        </Td>
                   
                          {(HasPermission(PERMISSIONS.CONTRA_VOUCHER_EDIT) || 
                            HasPermission(PERMISSIONS.CONTRA_VOUCHER_DELETE)) && (
                              <Td>
                            <HStack spacing={2}>
                              {HasPermission(PERMISSIONS.CONTRA_VOUCHER_EDIT) && (
                                <Tooltip placement="top" label="Edit">
                                  <IconButton
                                    size="sm"
                                    variant="ghost"
                                    icon={<EditIcon />}
                                    colorScheme="blue"
                                    onClick={() => setToggleDrawer(voucher)}
                                  />
                                </Tooltip>
                              )}
                              {HasPermission(PERMISSIONS.CONTRA_VOUCHER_DELETE) && (
                                <DeleteButton
                                  description={
                                    "Are you sure? Do you want to delete?"
                                  }
                                  confirm={() => deleteContraVoucher(voucher.id)}
                                  status={deleteContraVoucherStatus}
                                  reset={resetContraVoucherStatus}
                                />
                              )}
                            </HStack>
                            </Td>
                          )}
                       
                      </Tr>
                    );
                  })}
                </Tbody>

                <Tfoot>
                  <Tr bg={footerBg}>
                    <Td
                      colSpan={5}
                      fontWeight="bold"
                      color={`${themeColor}.700`}
                    >
                      Total
                    </Td>
                    <Td isNumeric fontWeight="bold" color={`${themeColor}.700`}>
                      ₹ {sumBy(allContraVouchers, "amount")}
                    </Td>
                    <Td />
                    {(HasPermission(PERMISSIONS.CONTRA_VOUCHER_EDIT) || 
                            HasPermission(PERMISSIONS.CONTRA_VOUCHER_DELETE)) && (

                    <Td />
                    )}
                  </Tr>
                </Tfoot>
              </Table>
            ) : (
              <NoData title={"No Bank Transaction Found"} />
            )}
            <Box display={"none"}>
              {allPrintProps && allPrintProps?.length && (
                <Box ref={printAllRef} p={5}>
                  <SchoolHeader title={"Statement Report"} />
                  <ContraData allContraVouchers={allContraVouchers} />
                </Box>
              )}
            </Box>
          </LoadingContainer>
          {toggleDrawer && (
            <AddContraVoucher
              data={toggleDrawer}
              closeDrawer={() => setToggleDrawer(null)}
              sessionMasterId={sessionMasterId}
              themeColor={themeColor}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

const ContraData = ({ allContraVouchers }) => {
  return (
    <Table w="100%" size={"sm"} variant={"simple"}>
      <Thead>
        <Tr bg="gray.100">
          <Th>Voucher No.</Th>
          <Th>Date</Th>
          <Th>From</Th>
          <Th>To</Th>
          <Th>Amount</Th>
          <Th>Remark</Th>
        </Tr>
      </Thead>
      <Tbody>
        {map(allContraVouchers, (contra, index) => (
          <Tr>
            <Td>{contra.voucherNo}</Td>
            <Td>
              {contra?.voucherDate
                ? dayjs(contra.voucherDate).format("DD-MM-YYYY")
                : ""}
            </Td>
            <Td>{contra.anotherLedgerMaster?.name}</Td>
            <Td>{contra.ledger_master?.name}</Td>
            <Td>₹ {contra.amount}</Td>
            <Td>{contra.remark}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
