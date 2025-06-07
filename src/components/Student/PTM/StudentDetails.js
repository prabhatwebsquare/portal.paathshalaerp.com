import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { SchoolHeader } from "@/common/SchoolHeader";
import { STATUS } from "@/constant";
import { URL } from "@/services/apis";
import { useStdFeesStore } from "@/store/stdFees";
import {
  Avatar,
  Box,
  Flex,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  Grid,
  Divider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  Button,
  DrawerBody,
  Tag,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { map, toUpper } from "lodash";
import { useEffect } from "react";
import { MdCurrencyRupee } from "react-icons/md";

export const StudentDetails = ({ data, closeDrawer, themeColor }) => {
  const {
    getFeesLedgerAction,
    getFeesLedgerStatus,
    feesLedger,
    resetFeesLedger,
  } = useStdFeesStore((s) => ({
    getFeesLedgerAction: s.getFeesLedgerAction,
    getFeesLedgerStatus: s.getFeesLedgerStatus,
    feesLedger: s.feesLedger,
    resetFeesLedger: s.resetFeesLedger,
  }));

  useEffect(() => {
    if ((getFeesLedgerStatus || 1) === STATUS.NOT_STARTED && data?.id) {
      getFeesLedgerAction({
        studentMasterId: data?.studentMasterId,
        promotionId: data.id,
        feesMode: 1,
      });
    }
  }, [data, getFeesLedgerAction, getFeesLedgerStatus]);

  useEffect(() => {
    return () => resetFeesLedger();
  }, [resetFeesLedger]);

  return (
    <Drawer size={"xl"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <Flex w={"95%"} justify={"space-between"}>
            <Text>Student PTM Report</Text>
            {/* <Button size={"sm"} colorScheme={themeColor} onClick={() => handlePrintClick(studentSR)}>Print</Button> */}
            {/* <Button size={"sm"} colorScheme={themeColor} onClick={handlePrint}>Print</Button> */}
          </Flex>
        </DrawerHeader>
        <DrawerBody>
          <Box>
            {/* <SchoolHeader title={"PTM Report"} /> */}
            <Flex w={"100%"} p={2} mb={3} bg={`${themeColor}.50`}>
              <Box w={"60%"} fontSize={13} fontWeight={"semibold"}>
                <Flex w={"100%"}>
                  <Text w={"35%"}>Name</Text>
                  <Text>: &nbsp;{data.student_master?.studentName}</Text>
                </Flex>
                <Flex w={"100%"}>
                  <Text w={"35%"}>Father&apos;s Name</Text>
                  <Text>: &nbsp;{data.student_master?.fatherName}</Text>
                </Flex>
                <Flex w={"100%"}>
                  <Text w={"35%"}>Contact </Text>
                  <Text>: &nbsp;{data.student_master?.fatherContact}</Text>
                </Flex>
              </Box>
              <Box w={"30%"} fontSize={13} fontWeight={"semibold"}>
                <Flex w={"90%"}>
                  <Text w={"40%"}>Class</Text>
                  <Text>: &nbsp;{data.class_master?.name}</Text>
                </Flex>
                <Flex w={"90%"}>
                  <Text w={"40%"}>Stream</Text>
                  <Text>: &nbsp;{data.stream_master?.name}</Text>
                </Flex>
              </Box>
              <Flex w={"10%"} align={"center"} justify={"center"}>
                <Image
                  h={"70px"}
                  src={`${URL}${data.student_master?.photo}`}
                  alt={"Profile"}
                />
              </Flex>
            </Flex>
            <LoadingContainer status={getFeesLedgerStatus}>
              <Box w={"100%"} align={"center"}>
                {/* <Text mt={10} fontSize={20} fontWeight={"semibold"}>Fees Collection List</Text> */}
                {feesLedger?.feesReport?.length ? (
                  <TableContainer>
                    <Table w="100%" size={"sm"} variant={"simple"}>
                      <Thead>
                        <Tr bg="gray.100">
                          <Th>Receipt No.</Th>
                          <Th>Deposite Date</Th>
                          <Th>Fees Type</Th>
                          <Th>Deposite</Th>
                          <Th>Discount</Th>
                          <Th>Mode (Trans/Cheque No.)</Th>
                          <Th>Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {map(feesLedger?.feesReport, (data) => {
                          return (
                            <Tr _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                              <Td isNumeric>
                                {data.feesMode === 2
                                  ? data.transportReceiptNo
                                  : data.receiptNo}
                              </Td>
                              <Td>{dayjs(data.date).format("DD-MM-YYYY")}</Td>
                              <Td>
                                {data?.feesTypeMasterId === 2
                                  ? "Transport Fees"
                                  : "School Fees"}
                              </Td>
                              <Td style={{ fontWeight: "bold" }}>
                                <Flex align={"center"} justify={"flex-end"}>
                                  <MdCurrencyRupee />
                                  {(data.totalAmount || 0) +
                                    (data.totalLateFees || 0)}
                                </Flex>
                              </Td>
                              <Td>
                                <Flex align={"center"} justify={"flex-end"}>
                                  <MdCurrencyRupee />
                                  {data.totalDiscount || 0}
                                </Flex>
                              </Td>
                              <Td>
                                <Flex
                                  justify={"center"}
                                  align={"center"}
                                  flexDir={"column"}
                                >
                                  <Text>{toUpper(data.type)}</Text>
                                  <Text
                                    color={"gray.500"}
                                    fontSize={10}
                                    fontStyle={"italic"}
                                  >
                                    {data.transitionNo}
                                  </Text>
                                </Flex>
                              </Td>
                              {/* <Td>{data.type === "" data.transitionNo}</Td> */}
                              <Td>
                                {data.chequeStatus ? (
                                  <Tag
                                    colorScheme={
                                      data.chequeStatus === "Collected"
                                        ? "teal"
                                        : data.chequeStatus ===
                                          "Deposit Into Bank"
                                        ? "yellow"
                                        : data.chequeStatus === "Cleared"
                                        ? "green"
                                        : "red"
                                    }
                                  >
                                    {data.chequeStatus}
                                  </Tag>
                                ) : null}
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
                              </Td>
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
            </LoadingContainer>
            {/* <Flex flexDir={"column"} align={"center"} justify={"center"}> */}
            <Table mt={3}>
              <Thead>
                <Tr>
                  <Th>Exam</Th>
                  <Th>Total Marks</Th>
                  <Th>Obt. Marks</Th>
                  <Th>Percentage</Th>
                  <Th>Rank</Th>
                </Tr>
              </Thead>
              <Tbody>
                {map(new Array(5), (a, i) => (
                  <Tr>
                    <Td>{i + 1} Term</Td>
                    <Td>100</Td>
                    <Td>90</Td>
                    <Td>90%</Td>
                    <Td>2</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
