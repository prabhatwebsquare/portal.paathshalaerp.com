import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useStdFeesStore } from "@/store/stdFees";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { Box, Flex, IconButton, Table, TableContainer, Tag, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react"
import dayjs from "dayjs";
import { map, toUpper } from "lodash";
import { useEffect, useMemo, useState } from "react"
import { MdCurrencyRupee, MdLocalPrintshop } from "react-icons/md";
import { NoData } from "@/common/NoData";
import { ReceiptDrawer } from "@/components/fees/ReceiptDrawer";

export const FeesHistory = ({ studentMasterId, promotionId, themeColor, sessionMasterId }) => {
    const school = useMemo(() => (getLocalStorageItem("user")), [])
    const [toggleReceiptModal, setToggleReceiptModal] = useState(null)

    const { getFeesLedgerAction, getFeesLedgerStatus, feesLedger, resetFeesLedger,
        getFeesReceiptAction, getFeesReceiptStatus, feeReceiptData, resetFeesReceipt
    } = useStdFeesStore(s => ({
        getFeesLedgerAction: s.getFeesLedgerAction,
        getFeesLedgerStatus: s.getFeesLedgerStatus,
        feesLedger: s.feesLedger,
        resetFeesLedger: s.resetFeesLedger,
        getFeesReceiptAction: s.getFeesReceiptAction,
        getFeesReceiptStatus: s.getFeesReceiptStatus,
        feeReceiptData: s.feeReceiptData,
        resetFeesReceipt: s.resetFeesReceipt
    }))

    useEffect(() => {
        if ((getFeesLedgerStatus || 1) === STATUS.NOT_STARTED && promotionId) {
            getFeesLedgerAction({ studentMasterId, promotionId, feesMode: 1 })
        }
    }, [getFeesLedgerAction, getFeesLedgerStatus, promotionId, studentMasterId])

    useEffect(() => {
        return () => resetFeesLedger()
    }, [resetFeesLedger])

    const receiptPrint = (data) => {
        getFeesReceiptAction({
            sessionMasterId,
            schoolCode: school?.schoolData?.schoolCode,
            promotionId: data?.promotionId,
            feesReportId: data?.id
        })
    }
    useEffect(() => {
        if (getFeesReceiptStatus === STATUS.SUCCESS) {
            resetFeesReceipt()
            setToggleReceiptModal(feeReceiptData)
        }
    }, [feeReceiptData, getFeesReceiptStatus, resetFeesReceipt])

    return (
        <Box h="100%">
            <LoadingContainer status={getFeesLedgerStatus}>
                <Box w={"100%"} align={"center"}>
                    {/* <Text mt={10} fontSize={20} fontWeight={"semibold"}>Fees Collection List</Text> */}
                    {feesLedger?.feesReport?.length ?
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
                                        {/* <Th>Trans/Cheque No.</Th> */}
                                        <Th>Status</Th>
                                        <Th>Action</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {map(feesLedger?.feesReport, data => {
                                        return (
                                            <Tr _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                                                <Td isNumeric>{data.feesMode === 2 ? data.transportReceiptNo : data.receiptNo}</Td>
                                                <Td>{dayjs(data.date).format("DD-MM-YYYY")}</Td>
                                                <Td>{data?.feesTypeMasterId === 2 ? "Transport Fees" : "School Fees"}</Td>
                                                <Td style={{ fontWeight: "bold" }}><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{(data.totalAmount || 0) + (data.totalLateFees || 0)}</Flex></Td>
                                                <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{data.totalDiscount || 0}</Flex></Td>
                                                <Td>
                                                    <Flex justify={"center"} align={"center"} flexDir={"column"} >
                                                        <Text>{toUpper(data.type)}</Text>
                                                        <Text color={"gray.500"} fontSize={10} fontStyle={"italic"}>{data.transitionNo}</Text>
                                                    </Flex>
                                                </Td>
                                                {/* <Td>{data.type === "" data.transitionNo}</Td> */}
                                                <Td>
                                                    {data.chequeStatus ?
                                                        <Tag
                                                            colorScheme={
                                                                data.chequeStatus === "Collected" ? "teal"
                                                                    : data.chequeStatus === "Deposit Into Bank" ? "yellow"
                                                                        : data.chequeStatus === "Cleared" ? "green"
                                                                            : "red"
                                                            }>
                                                            {data.chequeStatus}
                                                        </Tag>
                                                        :
                                                        null
                                                    }
                                                    {(data.chequeStatus || data.status) ?
                                                        <Tag
                                                            colorScheme={
                                                                data.status === "Received" ? "green"
                                                                    : data.status === "Cancelled" ? "red"
                                                                        : data.chequeStatus === "Collected" ? "teal"
                                                                            : data.chequeStatus === "Deposit Into Bank" ? "yellow"
                                                                                : data.chequeStatus === "Cleared" ? "green"
                                                                                    : "red"
                                                            }>
                                                            {data.chequeId ? data.chequeStatus : data.status}
                                                        </Tag>
                                                        :
                                                        null
                                                    }
                                                </Td>
                                                <Td>
                                                    <Tooltip placement="top" label={"Print Receipt"}>
                                                        <IconButton
                                                            ml={2}
                                                            size="xs"
                                                            variant={"ghost"}
                                                            colorScheme={themeColor}
                                                            icon={<MdLocalPrintshop fontSize={18} />}
                                                            onClick={() => receiptPrint(data)}
                                                        />
                                                    </Tooltip>
                                                </Td>
                                            </Tr>
                                        )
                                    })}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        :
                        <NoData title={"No Fees Collection Found"} />
                    }
                </Box>
                {toggleReceiptModal && <ReceiptDrawer themeColor={themeColor} feeReceiptData={feeReceiptData} closeModal={() => setToggleReceiptModal(null)} resetAllData={resetFeesReceipt} />}
            </LoadingContainer >
        </Box >
    )
}