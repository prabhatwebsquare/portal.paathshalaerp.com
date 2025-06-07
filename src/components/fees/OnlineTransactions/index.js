import { PageHeader } from "@/common/PageHeader"
import { Box, Button, Flex, IconButton, Image, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react"
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

export const OnlineTransactions = ({ themeColor, sessionMasterId }) => {
    const [inputValue, setInputValue] = useState({ startDate: dayjs().format("YYYY-MM-DD"), endDate: dayjs().format("YYYY-MM-DD") })
    const [excelData, setExcelData] = useState(null)

    // const { getCollectionsAction, getCollectionsStatus, collectionsData, resetFeeCollection,
    //     getFeesReceiptAction, getFeesReceiptStatus, feeReceiptData, resetFeesReceipt
    // } = useStdFeesStore(s => ({
    //     getCollectionsAction: s.getCollectionsAction,
    //     getCollectionsStatus: s.getCollectionsStatus,
    //     collectionsData: s.collectionsData,
    //     resetFeeCollection: s.resetFeeCollection,
    //     getFeesReceiptAction: s.getFeesReceiptAction,
    //     getFeesReceiptStatus: s.getFeesReceiptStatus,
    //     feeReceiptData: s.feeReceiptData,
    //     resetFeesReceipt: s.resetFeesReceipt
    // }))

    // useEffect(() => {
    //     if ((getCollectionsStatus || 1) === STATUS.NOT_STARTED) {
    //         getCollectionsAction({
    //             startDate: inputValue.startDate,
    //             endDate: inputValue.endDate,
    //             type: "all",
    //             userId: "all",
    //             feesMode: 1,
    //             sessionMasterId,
    //             status: "Received"
    //         })
    //     }
    // }, [getCollectionsAction, getCollectionsStatus, inputValue, sessionMasterId])

    // useEffect(() => {
    //     return () => resetFeeCollection()
    // }, [resetFeeCollection])


    const inputHandler = (name, val) => {
        setInputValue(pre => ({ ...pre, [name]: val }))
    }

    const getData = (e) => {
        e.preventDefault()
        // getCollectionsAction({
        //     startDate: inputValue.startDate,
        //     endDate: inputValue.endDate,
        //     type: inputValue.type || "all",
        //     userId: inputValue.userId || "all",
        //     feesMode: 1,
        //     sessionMasterId,
        //     status: "Received"
        // })
    }

    // useEffect(() => {
    //     if (collectionsData) {
    //         const data = collectionsData.map(item => {
    //             const fee = item?.fees_collects
    //             return ({
    //                 ReceiptNo: item.receiptNo,
    //                 Name: item.student_master?.studentName,
    //                 "Father Name": item.student_master?.fatherName,
    //                 "Class": item.class_master?.name + "-" + item.stream_master?.name,
    //                 Deposite: sumBy(fee, "amount"),
    //                 Discount: sumBy(fee, "discount"),
    //                 "Late Fees": sumBy(fee, "lateFees") || 0,
    //                 Mode: toUpper(item.type),
    //                 "Transaction No": toUpper(item.transitionNo),
    //                 "Deposite Date": item.date ? dayjs(item.date).format("DD-MM-YYYY") : "",
    //                 "User": item.user?.name,
    //             })
    //         });
    //         setExcelData(data)
    //     }
    // }, [collectionsData])

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
        <Box h="100%">
            <PageHeader heading={"Online Transactions"} extra={
                <Flex>
                    <Tooltip label="Print" placement="top">
                        <Button mr={3} size={"sm"} onClick={handlePrint} colorScheme={themeColor}><MdLocalPrintshop fontSize={18} /></Button>
                    </Tooltip>
                    <Tooltip label="Download Excel" placement="top">
                        <DownloadExcel button={<RiFileExcel2Fill />} data={excelData} name={"Online Transaction Report"} />
                    </Tooltip>
                </Flex>
            } />
            <Box p={5} bg={"white"} h={"90%"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <form onSubmit={getData}>
                        <Flex gap={4} align={"center"} mt={2}>
                            <CustomInput w={"20%"} size={"sm"} notRequire={true} type={"date"} name="startDate" label={"Start Date"} inputValue={inputValue} setInputValue={setInputValue} />
                            <CustomInput w={"20%"} size={"sm"} notRequire={true} type={"date"} name="endDate" label={"End Date"} inputValue={inputValue} setInputValue={setInputValue} />
                            <CustomSelect w={"20%"} size={"md"} name={"type"} label={"All Mode"} notRequire={true} inputValue={inputValue} setInputValue={setInputValue} data={[
                                { name: "Cash", value: "cash" },
                                { name: "Cheque", value: "cheque" },
                                { name: "Net Banking", value: "netBanking" },
                                { name: "UPI", value: "upi" },
                                { name: "Credit Card", value: "creditCard" },
                                { name: "Debit Card", value: "debitCard" },
                                { name: "Payment Gateway", value: "paymentGateway" },
                                { name: "Other", value: "other" },
                            ]} />
                            <Button size={"sm"} type="submit" colorScheme={themeColor}>Get</Button>
                        </Flex>
                    </form>
                    <DataTable />

                    <Box display={"none"}>
                        <Box ref={printRef} p={5}>
                            <SchoolHeader title={"Online Transactions Report"}
                                extra={
                                    <>
                                        {inputValue?.startDate ?
                                            <Flex w="100%" justify={"flex-end"} fontSize={14}>
                                                <Text w="fit-content">Date:</Text>
                                                <Text ml={2} w="fit-content" fontWeight={"semibold"}>{dayjs(inputValue.startDate).format("DD-MM-YYYY") + " - " + dayjs(inputValue.endDate).format("DD-MM-YYYY")}</Text>
                                            </Flex>
                                            :
                                            null
                                        }
                                    </>
                                }
                            />
                            <DataTable />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box >
    )
}

const DataTable = ({ }) => {
    return (
        <TableContainer mt={5} w="100%">
            <Table size={"sm"} variant={"simple"}>
                <Thead>
                    <Tr bg="gray.100">
                        <Th>R. No.</Th>
                        <Th>Name</Th>
                        <Th>Father Name</Th>
                        <Th>Class</Th>
                        <Th>Deposite</Th>
                        <Th>Discount</Th>
                        <Th>Late Fees</Th>
                        <Th>Mode/Trans. No</Th>
                        <Th>Dep. Date</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {map(new Array(5), (data, index) => {
                        return (
                            <Tr _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                                <Td isNumeric>{index + 1}</Td>
                                <Td>Amit</Td>
                                <Td>Shubham</Td>
                                <Td>1 - Common</Td>
                                <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />5000</Flex></Td>
                                <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />0</Flex></Td>
                                <Td ><Flex w={"100%"} align={"center"} justify={"flex-end"}><MdCurrencyRupee />0</Flex></Td>
                                <Td>
                                    <Flex flexDir={"column"} align={"center"}>
                                        <Text>{toUpper("UPI")}</Text>
                                        {/* {data.transitionNo ? <Text color={"gray.500"} fontSize={10} fontStyle={"italic"}>({data.transitionNo})</Text> : null} */}
                                        <Text color={"gray.500"} fontSize={10} fontStyle={"italic"}>({"8ne98uwe93i9434n9"})</Text>
                                    </Flex>
                                </Td>
                                {/* <Td>{data.date ? dayjs(data.date).format("DD-MM-YYYY") : ""}</Td> */}
                                <Td>{dayjs().format("DD-MM-YYYY")}</Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    )
}

const Total = ({ type, amount }) => {
    return (
        <Flex w={"25%"} fontSize={16} p={3} border={"1px solid"} borderColor={"gray.200"} borderRadius={10}>
            <Text w={"40%"}>{type}</Text>
            <Flex align={"center"} justify={"flex-end"}>
                <MdCurrencyRupee />
                <Text ml={1} fontWeight={"bold"}>{amount}</Text>
            </Flex>
        </Flex>
    )
}