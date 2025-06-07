import { PageHeader } from "@/common/PageHeader";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
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
import { useEffect, useMemo, useRef, useState } from "react";
import { MdCurrencyRupee, MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import dayjs from "dayjs";
import { useStdFeesStore } from "@/store/stdFees";
import { filter, map, sum, sumBy, toUpper } from "lodash";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { DownloadExcel } from "@/common/DownloadExcel";
import { RiFileExcel2Fill } from "react-icons/ri";
import { NoData } from "@/common/NoData";
import { SchoolHeader } from "@/common/SchoolHeader";
import { useAdminStore } from "@/store/AdminStore";
import { CustomSelect } from "@/common/CustomSelect";
import { LoadingContainer } from "@/common/LoadingContainer";

// Utility function to calculate totals by payment mode
const calculateTotalsByMode = (collectionsData) => {
  const totals = {};

  collectionsData?.forEach((data) => {
    const mode = data.type;
    const amount = sumBy(data.fees_collects, "amount");

    if (!totals[mode]) {
      totals[mode] = 0;
    }
    totals[mode] += amount;
  });

  return totals;
};

export const UserWiseCollectionList = ({ themeColor, sessionMasterId }) => {
  const getFinancialYearStartDate = () => {
    const today = new Date();
    const year =
      today.getMonth() < 3 ? today.getFullYear() - 1 : today.getFullYear();
    const financialYearStartDate = new Date(year, 3, 1);
    return financialYearStartDate.toISOString().split("T")[0];
  };

  const [inputValue, setInputValue] = useState({
    startDate: getFinancialYearStartDate(),
    endDate: dayjs().format("YYYY-MM-DD"),
  });
  const [excelData, setExcelData] = useState(null);
  const school = useMemo(() => getLocalStorageItem("user"), []);
  const tableRef = useRef(null);

  const { getUserAction, getUserStatus, allUsers } = useAdminStore((s) => ({
    getUserAction: s.getUserAction,
    getUserStatus: s.getUserStatus,
    allUsers: s.allUsers,
  }));

  useEffect(() => {
    if ((getUserStatus || 1) === STATUS.NOT_STARTED) {
      getUserAction();
    }
  }, [getUserAction, getUserStatus]);

  const {
    getCollectionsAction,
    getCollectionsStatus,
    collectionsData,
    resetFeeCollection,
    getFeesReceiptAction,
    getFeesReceiptStatus,
    feeReceiptData,
    resetFeesReceipt,
  } = useStdFeesStore((s) => ({
    getCollectionsAction: s.getCollectionsAction,
    getCollectionsStatus: s.getCollectionsStatus,
    collectionsData: s.collectionsData,
    resetFeeCollection: s.resetFeeCollection,
    getFeesReceiptAction: s.getFeesReceiptAction,
    getFeesReceiptStatus: s.getFeesReceiptStatus,
    feeReceiptData: s.feeReceiptData,
    resetFeesReceipt: s.resetFeesReceipt,
  }));

  useEffect(() => {
    if ((getCollectionsStatus || 1) === STATUS.NOT_STARTED) {
      getCollectionsAction({
        startDate: inputValue.startDate,
        endDate: inputValue.endDate,
        type: "all",
        userId: "all",
        feesMode: 2,
        sessionMasterId,
        status: "Received",
        page: 1,
        limit: 1000,
      });
    }
  }, [getCollectionsAction, getCollectionsStatus, inputValue, sessionMasterId]);

  useEffect(() => {
    return () => resetFeeCollection();
  }, [resetFeeCollection]);

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  const getData = (e) => {
    e.preventDefault();
    getCollectionsAction({
      startDate: inputValue.startDate,
      endDate: inputValue.endDate,
      type: inputValue.type || "all",
      userId: inputValue.userId || "all",
      feesMode: 2,
      sessionMasterId,
      status: "Received",
      page: 1,
      limit: 1000,
    });
  };

  useEffect(() => {
    if (collectionsData) {
      const data = collectionsData.map((item) => {
        const fee = item?.fees_collects;
        return {
          ReceiptNo: item.receiptNo,
          Name: item.student_master?.studentName,
          "Father Name": item.student_master?.fatherName,
          Class: item.class_master?.name + "-" + item.stream_master?.name,
          Deposite: sumBy(fee, "amount"),
          Discount: sumBy(fee, "discount"),
          "Late Fees": sumBy(fee, "lateFees") || 0,
          Mode: toUpper(item.type),
          "Transaction No": toUpper(item.transitionNo),
          "Deposite Date": item.date
            ? dayjs(item.date).format("DD-MM-YYYY")
            : "",
          User: item.user?.name,
        };
      });
      setExcelData(data);
    }
  }, [collectionsData]);

  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page {
        size: landscape !important;
        margin: 10mm;
      }
      @media print {
        html, body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          margin: 0;
          padding: 0;
        }
        .print-table {
          width: 100%;
          font-size: 9pt;
          border-collapse: collapse;
          table-layout: auto;
        }
        .print-table th, .print-table td {
          padding: 3px;
          border: 1px solid #ccc;
          word-wrap: break-word;
          white-space: normal;
          overflow: visible;
          max-width: 150px;
        }
        .print-table th {
          background-color: #f0f0f0;
        }
        .print-container {
          width: 100%;
          overflow: visible !important;
          padding: 10mm;
        }
        .no-print {
          display: none;
        }
        .summary-box {
          page-break-inside: avoid;
          margin-bottom: 10mm;
        }
        .print-table tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }
      }
    `,
  });

  // Calculate totals by payment mode
  const totalsByMode = useMemo(() => calculateTotalsByMode(collectionsData), [collectionsData]);

  return (
    <Box h="100%">
      <PageHeader
        heading={"UserWise Collection List"}
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
                name={"UserWise Fees Collection"}
              />
            </Tooltip>
          </Flex>
        }
      />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <form onSubmit={getData}>
            <Flex gap={4} align={"center"} mt={2}>
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
              <CustomSelect
                w={"20%"}
                size={"md"}
                name={"type"}
                label={"All Mode"}
                notRequire={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[
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
                w={"20%"}
                size="md"
                name={"userId"}
                label={"All User"}
                notRequire={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(allUsers, (user) => ({
                  name: user.name,
                  value: user.id,
                }))}
              />
              <Button size={"sm"} type="submit" colorScheme={themeColor}>
                Get
              </Button>
            </Flex>
          </form>
          <LoadingContainer status={getCollectionsStatus}>
            {/* Summary Box */}
            {collectionsData?.length ? (
              <Box mt={5} p={4} borderWidth="1px" borderRadius="lg" bg="gray.50" className="summary-box">
                <Text fontSize="lg" fontWeight="bold" mb={3}>
                  Collection Summary by Payment Mode
                </Text>
                <Flex wrap="wrap" gap={4}>
                  {Object.entries(totalsByMode).map(([mode, amount]) => (
                    <Flex
                      key={mode}
                      w={{ base: "100%", sm: "45%", md: "30%" }}
                      p={3}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      align="center"
                      justify="space-between"
                      bg="white"
                    >
                      <Text fontSize="md" textTransform="capitalize">
                        {mode}
                      </Text>
                      <Flex align="center">
                        <MdCurrencyRupee />
                        <Text ml={1} fontWeight="bold">
                          {amount}
                        </Text>
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              </Box>
            ) : null}

            {collectionsData?.length ? (
              <TableContainer mt={5} w="100%" p={2}>
                <Table size={"sm"} variant={"simple"} className="print-table">
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>R. No.</Th>
                      <Th>Name</Th>
                      <Th>Father Name</Th>
                      <Th>Class</Th>
                      <Th>Section</Th>
                      {/* <Th>Installment</Th> */}
                      <Th>Deposite</Th>
                      <Th>Discount</Th>
                      <Th>Late Fees</Th>
                      <Th>Total</Th>
                      <Th>Mode/Trans. No</Th>
                      <Th>Dep. Date</Th>
                      <Th>Collected By</Th>
                      <Th>Remark</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(collectionsData, (data) => {
                      const fee = data?.fees_collects;
                      return (
                        <Tr
                          key={data.id}
                          _hover={{ bg: "gray.50" }}
                          cursor={"pointer"}
                        >
                          <Td isNumeric>{data.receiptNo}</Td>
                          <Td>{data.student_master?.studentName}</Td>
                          <Td>{data.student_master?.fatherName}</Td>
                          <Td>{data.class_master?.name}</Td>
                          <Td>{data.section_master?.name}</Td>
                          {/* <Td>
                            {fee?.map((f) => (
                              <Box key={f.id} mb={2}>
                                {f.transport_fee_master?.name && (
                                  <Flex
                                    flexDir={"column"}
                                    align={"center"}
                                    bg="green.50"
                                    p={2}
                                    borderRadius="md"
                                    boxShadow="sm"
                                    mt={2}
                                  >
                                    <Text
                                      as="span"
                                      color="green.600"
                                      fontWeight="medium"
                                    >
                                      {f.transport_fee_master?.name}
                                    </Text>
                                  </Flex>
                                )}
                              </Box>
                            ))}
                          </Td> */}
                          <Td>
                            <Flex align={"center"} justify={"flex-end"}>
                              <MdCurrencyRupee />
                              {sumBy(fee, "amount")}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex align={"center"} justify={"flex-end"}>
                              <MdCurrencyRupee />
                              {sumBy(fee, "discount")}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex align={"center"} justify={"flex-end"}>
                              <MdCurrencyRupee />
                              {sumBy(fee, "lateFees") || 0}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex align={"center"} justify={"flex-end"}>
                              <MdCurrencyRupee />
                              {sumBy(
                                fee,
                                (f) => f.amount + f.lateFees - f.discount
                              )}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex flexDir={"column"} align={"center"}>
                              <Text>{toUpper(data.type)}</Text>
                              {data.transitionNo && (
                                <Text
                                  color={"gray.500"}
                                  fontSize={10}
                                  fontStyle={"italic"}
                                >
                                  ({data.transitionNo})
                                </Text>
                              )}
                            </Flex>
                          </Td>
                          <Td>
                            {data.date
                              ? dayjs(data.date).format("DD-MM-YYYY")
                              : ""}
                          </Td>
                          <Td>{data.user?.name}</Td>
                          <Td>{data.remark || "-"}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                  <Tfoot>
                    <Tr bg="gray.100" fontWeight="bold">
                      <Td colSpan={5}>Total</Td>
                      <Td>
                        <Flex align={"center"} justify={"flex-end"}>
                          <MdCurrencyRupee />
                          {sumBy(collectionsData, (data) =>
                            sumBy(data.fees_collects, "amount")
                          )}
                        </Flex>
                      </Td>
                      <Td>
                        <Flex align={"center"} justify={"flex-end"}>
                          <MdCurrencyRupee />
                          {sumBy(collectionsData, (data) =>
                            sumBy(data.fees_collects, "discount")
                          )}
                        </Flex>
                      </Td>
                      <Td>
                        <Flex align={"center"} justify={"flex-end"}>
                          <MdCurrencyRupee />
                          {sumBy(collectionsData, (data) =>
                            sumBy(data.fees_collects, "lateFees")
                          )}
                        </Flex>
                      </Td>
                      <Td>
                        <Flex align={"center"} justify={"flex-end"}>
                          <MdCurrencyRupee />
                          {sumBy(collectionsData, (data) =>
                            sumBy(
                              data.fees_collects,
                              (f) => f.amount + f.lateFees - f.discount
                            )
                          )}
                        </Flex>
                      </Td>
                      <Td colSpan={5}></Td>
                    </Tr>
                  </Tfoot>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Collection Found"} />
            )}
          </LoadingContainer>
          <Box display={"none"} className="no-print">
            <Box ref={printRef} p={5} className="print-container">
              <SchoolHeader
                title={"Fees Collection Report"}
                extra={
                  <>
                    {inputValue?.startDate ? (
                      <Flex w="100%" justify={"flex-end"} fontSize={12}>
                        <Text w="fit-content">Date:</Text>
                        <Text ml={2} w="fit-content" fontWeight={"semibold"}>
                          {dayjs(inputValue.startDate).format("DD-MM-YYYY") +
                            " - " +
                            dayjs(inputValue.endDate).format("DD-MM-YYYY")}
                        </Text>
                      </Flex>
                    ) : null}
                    <Flex w="100%" justify={"flex-end"} fontSize={12}>
                      <Text w="fit-content">Collected By:</Text>
                      <Text ml={2} w="fit-content" fontWeight={"semibold"}>
                        {inputValue.userId
                          ? collectionsData?.[0]?.user?.name
                          : "All"}
                      </Text>
                    </Flex>
                  </>
                }
              />
              {collectionsData?.length ? (
                <Box>
                  {/* Summary Box in Print */}
                  <Box mt={5} p={4} borderWidth="1px" borderRadius="lg" bg="gray.50" className="summary-box">
                    <Text fontSize="md" fontWeight="bold" mb={3}>
                      Collection Summary by Payment Mode
                    </Text>
                    <Flex wrap="wrap" gap={2}>
                      {Object.entries(totalsByMode).map(([mode, amount]) => (
                        <Flex
                          key={mode}
                          // w={{ base: "100%", sm: "45%", md: "30%" }}
                          p={2}
                          border="1px solid"
                          borderColor="gray.200"
                          borderRadius="md"
                          align="center"
                          justify="space-between"
                          bg="white"
                        >
                          <Text fontSize="sm" textTransform="capitalize">
                            {mode}
                          </Text>
                          <Flex align="center">
                            <MdCurrencyRupee size={12} />
                            <Text ml={1} fontWeight="bold" fontSize="sm">
                              {amount}
                            </Text>
                          </Flex>
                        </Flex>
                      ))}
                    </Flex>
                  </Box>

                  <TableContainer mt={3} w="100%">
                    <Table size={"sm"} variant={"simple"} className="print-table">
                      <Thead>
                        <Tr bg="gray.100">
                          <Th>R. No.</Th>
                          <Th>Name</Th>
                          <Th>Father Name</Th>
                          <Th>Class</Th>
                          <Th>Section</Th>
                          <Th>Installment</Th>
                          <Th>Deposite</Th>
                          <Th>Discount</Th>
                          <Th>Late Fees</Th>
                          <Th>Total</Th>
                          <Th>Mode/Trans. No</Th>
                          <Th>Dep. Date</Th>
                          <Th>Collected By</Th>
                          <Th>Remark</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {map(collectionsData, (data) => {
                          const fee = data?.fees_collects;
                          return (
                            <Tr key={data.id}>
                              <Td isNumeric>{data.receiptNo}</Td>
                              <Td>{data.student_master?.studentName}</Td>
                              <Td>{data.student_master?.fatherName}</Td>
                              <Td>
                                {data.class_master?.name} -{" "}
                                {data.stream_master?.name}
                              </Td>
                              <Td>{data.section_master?.name}</Td>
                              <Td>
                                {fee?.map((f) => (
                                  <Box key={f.id} mb={1}>
                                    {f.transport_fee_master?.name && (
                                      <Text fontSize="xs" color="green.600">
                                        {f.transport_fee_master?.name}
                                      </Text>
                                    )}
                                  </Box>
                                ))}
                              </Td>
                              <Td>
                                <Flex align="center" justify="flex-end">
                                  <MdCurrencyRupee size={12} />
                                  {sumBy(fee, "amount")}
                                </Flex>
                              </Td>
                              <Td>
                                <Flex align="center" justify="flex-end">
                                  <MdCurrencyRupee size={12} />
                                  {sumBy(fee, "discount")}
                                </Flex>
                              </Td>
                              <Td>
                                <Flex align="center" justify="flex-end">
                                  <MdCurrencyRupee size={12} />
                                  {sumBy(fee, "lateFees") || 0}
                                </Flex>
                              </Td>
                              <Td>
                                <Flex align="center" justify="flex-end">
                                  <MdCurrencyRupee size={12} />
                                  {sumBy(
                                    fee,
                                    (f) => f.amount + f.lateFees - f.discount
                                  )}
                                </Flex>
                              </Td>
                              <Td>
                                <Flex flexDir="column" align="center">
                                  <Text fontSize="xs">{toUpper(data.type)}</Text>
                                  {data.transitionNo && (
                                    <Text
                                      color="gray.500"
                                      fontSize={8}
                                      fontStyle="italic"
                                    >
                                      ({data.transitionNo})
                                    </Text>
                                  )}
                                </Flex>
                              </Td>
                              <Td fontSize="xs">
                                {dayjs(data.date).format("DD-MM-YYYY")}
                              </Td>
                              <Td fontSize="xs">{data.user?.name}</Td>
                              <Td fontSize="xs">{data.remark || "-"}</Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                      <Tfoot>
                        <Tr bg="gray.100" fontWeight="bold">
                          <Td colSpan={6}>Total</Td>
                          <Td>
                            <Flex align="center" justify="flex-end">
                              <MdCurrencyRupee size={12} />
                              {sumBy(collectionsData, (data) =>
                                sumBy(data.fees_collects, "amount")
                              )}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex align="center" justify="flex-end">
                              <MdCurrencyRupee size={12} />
                              {sumBy(collectionsData, (data) =>
                                sumBy(data.fees_collects, "discount")
                              )}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex align="center" justify="flex-end">
                              <MdCurrencyRupee size={12} />
                              {sumBy(collectionsData, (data) =>
                                sumBy(data.fees_collects, "lateFees")
                              )}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex align="center" justify="flex-end">
                              <MdCurrencyRupee size={12} />
                              {sumBy(collectionsData, (data) =>
                                sumBy(
                                  data.fees_collects,
                                  (f) => f.amount + f.lateFees - f.discount
                                )
                              )}
                            </Flex>
                          </Td>
                          <Td colSpan={5}></Td>
                        </Tr>
                      </Tfoot>
                    </Table>
                  </TableContainer>
                </Box>
              ) : (
                <NoData title={"No Collection Found"} />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};