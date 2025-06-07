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
import { MainLayout } from "@/layout/MainLayout";
import { useStudentStore } from "@/store/studentStore";

function ProspectsHistory() {
  const [inputValue, setInputValue] = useState({
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });
  const themeColor = useMemo(() => getLocalStorageItem("themeColor"), []);
  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
  );
  const [excelData, setExcelData] = useState(null);
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
  useEffect(() => {
    getUserAction();
    return () => {};
  }, []);

  const { getEnquiryAction, getEnquiryStatus, allEnquiry, resetGetEnquiry } =
    useStudentStore((s) => ({
      getEnquiryAction: s.getEnquiryAction,
      getEnquiryStatus: s.getEnquiryStatus,
      allEnquiry: s.allEnquiry,
      resetGetEnquiry: s.resetGetEnquiry,
    }));

  useEffect(() => {
    if ((getEnquiryStatus || 1) === STATUS.NOT_STARTED) {
      getEnquiryAction({
        startDate: inputValue.startDate,
        endDate: inputValue.endDate,
        type: "all",
        userId: "all",
        sessionMasterId,
        brocherAmount: "yes",
      });
    }
  }, [getEnquiryAction, getEnquiryStatus, inputValue, sessionMasterId]);

  useEffect(() => {
    return () => resetGetEnquiry();
  }, [resetGetEnquiry]);

  const getData = (e) => {
    e.preventDefault();
    getEnquiryAction({
      startDate: inputValue.startDate,
      endDate: inputValue.endDate,
      type: inputValue.type || "all",
      userId: inputValue.userId || "all",
      sessionMasterId,
      brocherAmount: "yes",
    });
  };

  useEffect(() => {
    if (allEnquiry) {
      const data = allEnquiry.map((item, index) => {
        return {
          "S. No": index + 1,
          Name: item.name,
          "Father Name": item.fatherName,
          Class: item.class_master?.name + "-" + item.stream_master?.name,
          "Brocher Amount": item.brocherAmount,
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
  }, [allEnquiry]);

  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
        @page {
            size: landscape;
          }
        `,
  });

  return (
    <MainLayout>
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
                    // { name: "Cheque", value: "cheque" },
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
            <LoadingContainer status={getEnquiryStatus}>
              {allEnquiry?.length ? (
                <TableContainer mt={5} w="100%" p={2}>
                  <Table size={"sm"} variant={"simple"}>
                    <Thead>
                      <Tr bg="gray.100">
                        <Th>S. No.</Th>
                        <Th>Name</Th>
                        <Th>Father Name</Th>
                        <Th>Class</Th>
                        <Th>Brocher Amount</Th>
                        <Th>Mode/Trans. No</Th>
                        <Th>Enquiry Date</Th>
                        <Th>Collected By</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {map(allEnquiry, (data, index) => {
                        const fee = data?.fees_collects;
                        return (
                          <Tr
                            key={data.id}
                            _hover={{ bg: "gray.50" }}
                            cursor={"pointer"}
                          >
                            <Td isNumeric textAlign={"center"}>
                              {index + 1}
                            </Td>
                            <Td textAlign={"center"}>{data.name}</Td>
                            <Td textAlign={"center"}>{data.fatherName}</Td>
                            <Td textAlign={"center"}>
                              {data.class_master?.name} -{" "}
                              {data.stream_master?.name}
                            </Td>
                            <Td align={"center"}>
                              <Flex align={"center"} justify={"center"}>
                                <MdCurrencyRupee />
                                {data.brocherAmount}
                              </Flex>
                            </Td>

                            <Td align={"center"}>
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
                            <Td textAlign={"center"}>
                              {data.date
                                ? dayjs(data.date).format("DD-MM-YYYY")
                                : ""}
                            </Td>
                            <Td>{data.user?.name}</Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <NoData title={"No Collection Found"} />
              )}
            </LoadingContainer>
            <Box display={"none"}>
              <Box ref={printRef} p={5}>
                <SchoolHeader
                  title={"Fees Collection Report"}
                  extra={
                    <>
                      {inputValue?.startDate ? (
                        <Flex w="100%" justify={"flex-end"} fontSize={14}>
                          <Text w="fit-content">Date:</Text>
                          <Text ml={2} w="fit-content" fontWeight={"semibold"}>
                            {dayjs(inputValue.startDate).format("DD-MM-YYYY") +
                              " - " +
                              dayjs(inputValue.endDate).format("DD-MM-YYYY")}
                          </Text>
                        </Flex>
                      ) : null}
                      <Flex w="100%" justify={"flex-end"} fontSize={14}>
                        <Text w="fit-content">Collected By:</Text>
                        <Text ml={2} w="fit-content" fontWeight={"semibold"}>
                          {inputValue.userId
                            ? allEnquiry?.[0]?.user?.name
                            : "All"}
                        </Text>
                      </Flex>
                    </>
                  }
                />
                {allEnquiry?.length ? (
                  <Box>
                    <TableContainer mt={3} w="100%">
                      <Table size={"sm"} variant={"simple"}>
                        <Thead>
                          <Tr bg="gray.100">
                            <Th>S. No.</Th>
                            <Th>Name</Th>
                            <Th>Father Name</Th>
                            <Th>Class</Th>
                            <Th>Brocher Amount</Th>
                            <Th>Mode/Trans. No</Th>
                            <Th>Enquiry Date</Th>
                            <Th>Collected By</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {map(allEnquiry, (data, index) => {
                            const fee = data?.fees_collects;
                            return (
                              <Tr
                                key={data.id}
                                _hover={{ bg: "gray.50" }}
                                cursor={"pointer"}
                              >
                                <Td isNumeric textAlign={"center"}>
                                  {index + 1}
                                </Td>
                                <Td textAlign={"center"}>{data.name}</Td>
                                <Td textAlign={"center"}>{data.fatherName}</Td>
                                <Td textAlign={"center"}>
                                  {data.class_master?.name} -{" "}
                                  {data.stream_master?.name}
                                </Td>
                                <Td align={"center"}>
                                  <Flex align={"center"} justify={"center"}>
                                    <MdCurrencyRupee />
                                    {data.brocherAmount}
                                  </Flex>
                                </Td>

                                <Td align={"center"}>
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
                                <Td textAlign={"center"}>
                                  {data.date
                                    ? dayjs(data.date).format("DD-MM-YYYY")
                                    : ""}
                                </Td>
                                <Td>{data.user?.name}</Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </TableContainer>
                    <Flex mt={10} justify={"space-between"}>
                      <Total
                        type={"Cash"}
                        amount={sum(
                          map(
                            filter(allEnquiry, (f) => f.type === "Cash"),
                            (data) => sum(map(data.fees_collects, "amount"))
                          )
                        )}
                      />
                      <Total
                        type={"Cheque"}
                        amount={sum(
                          map(
                            filter(allEnquiry, (f) => f.type === "Cheque"),
                            (data) => sum(map(data.fees_collects, "amount"))
                          )
                        )}
                      />
                      <Total
                        type={"Online"}
                        amount={sum(
                          map(
                            filter(
                              allEnquiry,
                              (f) => f.type !== "Cash" && f.type !== "Cheque"
                            ),
                            (data) => sum(map(data.fees_collects, "amount"))
                          )
                        )}
                      />
                    </Flex>
                  </Box>
                ) : (
                  <NoData title={"No Collection Found"} />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}

const Total = ({ type, amount }) => {
  return (
    <Flex
      w={"25%"}
      fontSize={16}
      p={3}
      border={"1px solid"}
      borderColor={"gray.200"}
      borderRadius={10}
    >
      <Text w={"40%"}>{type}</Text>
      <Flex align={"center"} justify={"flex-end"}>
        <MdCurrencyRupee />
        <Text ml={1} fontWeight={"bold"}>
          {amount}
        </Text>
      </Flex>
    </Flex>
  );
};

export default ProspectsHistory;
