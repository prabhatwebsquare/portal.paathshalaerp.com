import CustomInput from "@/common/CustomInput";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useStdFeesStore } from "@/store/stdFees";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import {
  Avatar,
  Box,
  Flex,
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
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { filter, map, sumBy, toUpper } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { MdCurrencyRupee, MdLocalPrintshop } from "react-icons/md";
import { NoData } from "@/common/NoData";
import { URL } from "@/services/apis";
import { ReceiptDrawer } from "@/components/fees/ReceiptDrawer";
import { useRouter } from "next/router";

export const TransportFeesLedger = ({ themeColor, sessionMasterId }) => {
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
    getFeesLedgerAction({ studentMasterId, promotionId, feesMode: 2 });
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

  const transportFeesDetails = useMemo(() => {
    return map(
      filter(feesLedger?.studentFees, (s) => s.fees_type_master?.id === 2),
      (f) => ({
        ...f,
        fees: f.amount + f.lateFees + (sumBy(f.fees_collects, "lateFees") || 0),
        totalFees: f.amount,
        totalLateFees: f.lateFees + (sumBy(f.fees_collects, "lateFees") || 0),
        deposite: sumBy(
          filter(f.fees_collects, (c) => c.status !== "Pending"),
          "amount"
        ),
        lateFeesCollected: sumBy(f.fees_collects, "lateFees") || 0,
        pending: sumBy(
          filter(f.fees_collects, (c) => c.status === "Pending"),
          "amount"
        ),
        discount: sumBy(f.fees_collects, "discount"),
        dueFees:
          f.amount -
          (sumBy(f.fees_collects, "amount") +
            sumBy(f.fees_collects, "discount")),
      })
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

  return (
    <Box h="100%">
      {/* <PageHeader heading={"Fees Collection"} /> */}
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
            <LoadingContainer status={getFeesLedgerStatus}>
              {feesLedger ? (
                <Box>
                  <Flex
                    my={3}
                    p={2}
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
                    <Box w={"45%"} fontSize={13} fontWeight={"semibold"}>
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
                    <Box w={"45%"} fontSize={13} fontWeight={"semibold"}>
                      <Flex w={"100%"}>
                        <Text w={"25%"}>Class</Text>
                        <Text>
                          : &nbsp;{feesLedger?.student?.class_master?.name}
                        </Text>
                      </Flex>
                      <Flex w={"100%"}>
                        <Text w={"25%"}>Stream</Text>
                        <Text>
                          : &nbsp;{feesLedger?.student?.stream_master?.name}
                        </Text>
                      </Flex>
                      <Flex w={"100%"}>
                        <Text w={"25%"}>Section</Text>
                        <Text>
                          : &nbsp;{feesLedger?.student?.section_master?.name}
                        </Text>
                      </Flex>
                    </Box>
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
                      <Flex w={"100%"}>
                        <Box w={"50%"}>
                          <Flex fontWeight={"semibold"} fontSize={14}>
                            <Text>Total Fees</Text>
                            <Flex ml={3} align={"center"} color={"blue.500"}>
                              <MdCurrencyRupee />{" "}
                              {feesLedger.totalFinalFees || 0}
                            </Flex>
                          </Flex>
                          <Flex fontWeight={"semibold"} fontSize={14}>
                            <Text>Total Tution Fees</Text>
                            <Flex ml={3} align={"center"} color={"blue.500"}>
                              <MdCurrencyRupee /> {feesLedger.totalFees || 0}
                            </Flex>
                          </Flex>
                          <Flex fontWeight={"semibold"} fontSize={14}>
                            <Text>Total Late Fees</Text>
                            <Flex ml={3} align={"center"} color={"blue.500"}>
                              <MdCurrencyRupee />{" "}
                              {feesLedger.totalLateFees || 0}
                            </Flex>
                          </Flex>
                          <Flex fontWeight={"semibold"} fontSize={14}>
                            <Text>Deposite</Text>
                            <Flex ml={3} align={"center"} color={"blue.500"}>
                              <MdCurrencyRupee />{" "}
                              {feesLedger.totalFeesCollect || 0}
                            </Flex>
                          </Flex>
                          <Flex fontWeight={"semibold"} fontSize={14}>
                            <Text>LateFees Deposite</Text>
                            <Flex ml={3} align={"center"} color={"blue.500"}>
                              <MdCurrencyRupee />{" "}
                              {feesLedger.totalLateFesCollect || 0}
                            </Flex>
                          </Flex>
                          <Flex fontWeight={"semibold"} fontSize={14}>
                            <Text>Discount</Text>
                            <Flex ml={3} align={"center"} color={"blue.500"}>
                              <MdCurrencyRupee />{" "}
                              {feesLedger.totalDiscountCollect || 0}
                            </Flex>
                          </Flex>
                        </Box>
                        <Flex flexDir={"column"} w={"50%"} align={"flex-end"}>
                          <Flex fontWeight={"semibold"} fontSize={18}>
                            <Text>Due Fees</Text>
                            <Flex ml={3} align={"center"} color={"red.500"}>
                              <MdCurrencyRupee /> {feesLedger.totalDue || 0}
                            </Flex>
                          </Flex>
                          <Flex fontWeight={"semibold"} fontSize={14}>
                            <Text>Late Fees Due</Text>
                            <Flex ml={3} align={"center"} color={"red.500"}>
                              <MdCurrencyRupee />{" "}
                              {feesLedger.totalLateFees -
                                feesLedger.totalLateFesCollect}
                            </Flex>
                          </Flex>
                        </Flex>
                      </Flex>
                      {transportFeesDetails?.length ? (
                        <Box mt={4} fontSize={14} pl={4}>
                          <Flex
                            px={2}
                            py={1}
                            ml={-4}
                            fontWeight={"semibold"}
                            bg={`${themeColor}.200`}
                            align={"center"}
                            justify={"space-between"}
                          >
                            <Text>Transport Fees Details</Text>
                            <Text fontSize={14} fontWeight={"bold"}>
                              Due Fees: &nbsp;{" "}
                              {sumBy(transportFeesDetails, "amount")}
                            </Text>
                          </Flex>
                          <TableContainer>
                            <Table>
                              <Tbody>
                                <Tr>
                                  <Td>
                                    <Flex fontWeight={"bold"}>Fees Head </Flex>
                                  </Td>
                                  <Td>
                                    <Flex fontWeight={"bold"}>Fees </Flex>
                                  </Td>
                                  <Td>
                                    <Flex fontWeight={"bold"}>Total Fees </Flex>
                                  </Td>
                                  <Td>
                                    <Flex fontWeight={"bold"}>
                                      Total Late Fees{" "}
                                    </Flex>
                                  </Td>
                                  <Td>
                                    <Flex fontWeight={"bold"}>Deposite </Flex>
                                  </Td>
                                  <Td>
                                    <Flex fontWeight={"bold"}>
                                      Late Fees Deposite
                                    </Flex>
                                  </Td>
                                  <Td>
                                    <Flex fontWeight={"bold"}>Discount </Flex>
                                  </Td>
                                  <Td>
                                    <Flex fontWeight={"bold"}>Due Fees</Flex>
                                  </Td>
                                  <Td>
                                    <Flex fontWeight={"bold"}>Due Date </Flex>
                                  </Td>
                                </Tr>
                                {map(transportFeesDetails, (fee) => (
                                  <Tr>
                                    <Td>{fee?.transport_fee_master?.name}</Td>
                                    <Td>
                                      <Flex
                                        align={"center"}
                                        justify={"flex-end"}
                                      >
                                        <MdCurrencyRupee />
                                        {fee.fees}
                                      </Flex>
                                    </Td>
                                    <Td>
                                      <Flex
                                        align={"center"}
                                        justify={"flex-end"}
                                      >
                                        <MdCurrencyRupee />
                                        {fee.totalFees}
                                      </Flex>
                                    </Td>
                                    <Td>
                                      <Flex
                                        align={"center"}
                                        justify={"flex-end"}
                                      >
                                        <MdCurrencyRupee />
                                        {fee.totalLateFees}
                                      </Flex>
                                    </Td>
                                    <Td>
                                      <Flex
                                        align={"center"}
                                        justify={"flex-end"}
                                      >
                                        <MdCurrencyRupee />
                                        {fee.deposite || 0}
                                      </Flex>
                                    </Td>
                                    <Td>
                                      <Flex
                                        align={"center"}
                                        justify={"flex-end"}
                                      >
                                        <MdCurrencyRupee />
                                        {fee.lateFeesCollected || 0}
                                      </Flex>
                                    </Td>
                                    <Td>
                                      <Flex
                                        align={"center"}
                                        justify={"flex-end"}
                                      >
                                        <MdCurrencyRupee />
                                        {fee.discount}
                                      </Flex>
                                    </Td>
                                    <Td>
                                      <Flex
                                        align={"center"}
                                        justify={"flex-end"}
                                      >
                                        <MdCurrencyRupee />
                                        {fee.dueFees}
                                      </Flex>
                                    </Td>
                                    <Td>
                                      {fee.dueDate
                                        ? dayjs(fee.dueDate).format(
                                            "DD-MM-YYYY"
                                          )
                                        : ""}
                                    </Td>
                                  </Tr>
                                ))}
                                <Tr>
                                  <Td
                                    style={{
                                      fontSize: 15,
                                      background: "white",
                                    }}
                                  >
                                    <Flex fontWeight={"bold"}>Total </Flex>
                                  </Td>
                                  <Td
                                    style={{
                                      fontSize: 15,
                                      background: "white",
                                    }}
                                  >
                                    <Flex
                                      fontWeight={"bold"}
                                      align={"center"}
                                      justify={"flex-end"}
                                    >
                                      <MdCurrencyRupee />
                                      {sumBy(transportFeesDetails, "fees")}
                                    </Flex>
                                  </Td>
                                  <Td
                                    style={{
                                      fontSize: 15,
                                      background: "white",
                                    }}
                                  >
                                    <Flex
                                      fontWeight={"bold"}
                                      align={"center"}
                                      justify={"flex-end"}
                                    >
                                      <MdCurrencyRupee />
                                      {sumBy(transportFeesDetails, "totalFees")}
                                    </Flex>
                                  </Td>
                                  <Td
                                    style={{
                                      fontSize: 15,
                                      background: "white",
                                    }}
                                  >
                                    <Flex
                                      fontWeight={"bold"}
                                      align={"center"}
                                      justify={"flex-end"}
                                    >
                                      <MdCurrencyRupee />
                                      {sumBy(
                                        transportFeesDetails,
                                        "totalLateFees"
                                      )}
                                    </Flex>
                                  </Td>
                                  <Td
                                    style={{
                                      fontSize: 15,
                                      background: "white",
                                    }}
                                  >
                                    <Flex
                                      fontWeight={"bold"}
                                      align={"center"}
                                      justify={"flex-end"}
                                    >
                                      <MdCurrencyRupee />
                                      {sumBy(transportFeesDetails, "deposite")}
                                    </Flex>
                                  </Td>
                                  <Td
                                    style={{
                                      fontSize: 15,
                                      background: "white",
                                    }}
                                  >
                                    <Flex
                                      fontWeight={"bold"}
                                      align={"center"}
                                      justify={"flex-end"}
                                    >
                                      <MdCurrencyRupee />
                                      {sumBy(
                                        transportFeesDetails,
                                        "lateFeesCollected"
                                      )}
                                    </Flex>
                                  </Td>
                                  <Td
                                    style={{
                                      fontSize: 15,
                                      background: "white",
                                    }}
                                  >
                                    <Flex
                                      fontWeight={"bold"}
                                      align={"center"}
                                      justify={"flex-end"}
                                    >
                                      <MdCurrencyRupee />
                                      {sumBy(transportFeesDetails, "discount")}
                                    </Flex>
                                  </Td>
                                  <Td
                                    style={{
                                      fontSize: 15,
                                      background: "white",
                                    }}
                                  >
                                    <Flex
                                      fontWeight={"bold"}
                                      align={"center"}
                                      justify={"flex-end"}
                                    >
                                      <MdCurrencyRupee />
                                      {sumBy(transportFeesDetails, "dueFees")}
                                    </Flex>
                                  </Td>
                                  <Td
                                    style={{
                                      fontSize: 15,
                                      background: "white",
                                    }}
                                  ></Td>
                                </Tr>
                              </Tbody>
                            </Table>
                          </TableContainer>
                        </Box>
                      ) : null}
                    </Box>
                    <Box
                      w={"100%"}
                      border={"1px solid"}
                      borderColor={"gray.200"}
                      align={"center"}
                      borderRightRadius={5}
                    >
                      <Text mt={10} fontSize={20} fontWeight={"semibold"}>
                        Fees Collection List
                      </Text>
                      {feesLedger?.feesReport?.length ? (
                        <TableContainer m={5}>
                          <Table w="100%" size={"sm"} variant={"simple"}>
                            <Thead>
                              <Tr bg="gray.100">
                                <Th>Receipt No.</Th>
                                <Th>Deposite Date</Th>
                                <Th>Fees Type</Th>
                                <Th>Deposite</Th>
                                <Th>Discount</Th>
                                <Th>Mode (Trans/Cheque No.)</Th>
                                {/* <Th>Trans/Cheque No.</Th> */}
                                <Th>Status</Th>
                                <Th>Action</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {map(feesLedger?.feesReport, (data) => {
                                return (
                                  <Tr
                                    _hover={{ bg: "gray.50" }}
                                    cursor={"pointer"}
                                  >
                                    <Td isNumeric>
                                      {data.feesMode === 2
                                        ? data.transportReceiptNo
                                        : data.receiptNo}
                                    </Td>
                                    <Td>
                                      {dayjs(data.date).format("DD-MM-YYYY")}
                                    </Td>
                                    <Td>
                                      {data?.feesTypeMasterId === 2
                                        ? "Transport Fees"
                                        : "School Fees"}
                                    </Td>
                                    <Td style={{ fontWeight: "bold" }}>
                                      <Flex
                                        align={"center"}
                                        justify={"flex-end"}
                                      >
                                        <MdCurrencyRupee />
                                        {(data.totalAmount || 0) +
                                          (data.totalLateFees || 0)}
                                      </Flex>
                                    </Td>
                                    <Td>
                                      <Flex
                                        align={"center"}
                                        justify={"flex-end"}
                                      >
                                        <MdCurrencyRupee />
                                        {data.totalDiscount || 0}
                                      </Flex>
                                    </Td>
                                    <Td>
                                      <Flex flexDir={"column"} align={"center"}>
                                        <Text>{toUpper(data.type)}</Text>
                                        {data.transitionNo ? (
                                          <Text
                                            color={"gray.500"}
                                            fontSize={10}
                                            fontStyle={"italic"}
                                          >
                                            ({data.transitionNo})
                                          </Text>
                                        ) : null}
                                      </Flex>
                                    </Td>
                                    {/* <Td>{data.type === "" data.transitionNo}</Td> */}
                                    <Td>
                                      {data.chequeStatus || data.status ? (
                                        <Tag
                                          colorScheme={
                                            data.status === "Received"
                                              ? "green"
                                              : data.status === "Cancelled"
                                              ? "red"
                                              : data.chequeStatus ===
                                                "Collected"
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
                                    <Td>
                                      <Tooltip
                                        placement="top"
                                        label={"Print Receipt"}
                                      >
                                        <IconButton
                                          ml={2}
                                          size="xs"
                                          variant={"ghost"}
                                          colorScheme={themeColor}
                                          icon={
                                            <MdLocalPrintshop fontSize={18} />
                                          }
                                          onClick={() => receiptPrint(data)}
                                        />
                                      </Tooltip>
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
                    {toggleReceiptModal && (
                      <ReceiptDrawer
                        isTransport={true}
                        themeColor={themeColor}
                        feeReceiptData={feeReceiptData}
                        closeModal={() => setToggleReceiptModal(null)}
                        resetAllData={resetFeesReceipt}
                      />
                    )}
                  </Flex>
                </Box>
              ) : null}
            </LoadingContainer>
          </Box>
        </LoadingContainer>
      </Box>
    </Box>
  );
};
