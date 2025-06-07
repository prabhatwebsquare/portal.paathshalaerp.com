import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useStdFeesStore } from "@/store/stdFees";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { Box, Flex, Table, TableContainer, Tbody, Td, Text, Tr } from "@chakra-ui/react"
import dayjs from "dayjs";
import { filter, map, sumBy } from "lodash";
import { useEffect, useMemo } from "react"
import { MdCurrencyRupee } from "react-icons/md";

export const StdPendingFees = ({ studentMasterId, promotionId, themeColor, sessionMasterId }) => {
    const { getFeesLedgerAction, getFeesLedgerStatus, feesLedger, resetFeesLedger } = useStdFeesStore(s => ({
        getFeesLedgerAction: s.getFeesLedgerAction,
        getFeesLedgerStatus: s.getFeesLedgerStatus,
        feesLedger: s.feesLedger,
        resetFeesLedger: s.resetFeesLedger
    }))

    useEffect(() => {
        if ((getFeesLedgerStatus || 1) === STATUS.NOT_STARTED && promotionId) {
            getFeesLedgerAction({ studentMasterId, promotionId, feesMode: 1 })
        }
    }, [getFeesLedgerAction, getFeesLedgerStatus, promotionId, studentMasterId])

    useEffect(() => {
        return () => resetFeesLedger()
    }, [resetFeesLedger])

    const studentFeesDetails = useMemo(() => {
        return map(filter(feesLedger?.studentFees, s => s.fees_type_master?.id === 1), f => ({
            ...f,
            totalFees: f.amount,
            amount: (f.amount - (sumBy(f.fees_collects, "amount") + sumBy(f.fees_collects, "discount"))),
            deposite: sumBy(filter(f.fees_collects, c => c.status !== "Pending"), "amount"),
            pending: sumBy(filter(f.fees_collects, c => c.status === "Pending"), "amount"),
            discount: sumBy(f.fees_collects, "discount"),
            lateFees: f.lateFees - (sumBy(f.fees_collects, "lateFees") || 0)
        }))
    }, [feesLedger?.studentFees])

    const transportFeesDetails = useMemo(() => {
        return map(filter(feesLedger?.studentFees, s => s.fees_type_master?.id === 2), f => ({
            ...f,
            totalFees: f.amount,
            amount: (f.amount - (sumBy(f.fees_collects, "amount") + sumBy(f.fees_collects, "discount"))),
            deposite: sumBy(filter(f.fees_collects, c => c.status !== "Pending"), "amount"),
            pending: sumBy(filter(f.fees_collects, c => c.status === "Pending"), "amount"),
            discount: sumBy(f.fees_collects, "discount"),
            lateFees: f.lateFees - (sumBy(f.fees_collects, "lateFees") || 0)
        }))
    }, [feesLedger?.studentFees])

    return (
        <Box h="100%">
            <LoadingContainer status={getFeesLedgerStatus}>
                {feesLedger ?
                    <Box w={"100%"}>
                        <Flex w={"100%"}>
                            <Box w={"50%"}>
                                <Flex fontWeight={"semibold"} fontSize={14}>
                                    <Text>Total Fees</Text>
                                    <Flex ml={3} align={"center"} color={"blue.500"}><MdCurrencyRupee /> {feesLedger.totalFees || 0}</Flex>
                                </Flex>
                                <Flex fontWeight={"semibold"} fontSize={14}>
                                    <Text>Deposite</Text>
                                    <Flex ml={3} align={"center"} color={"blue.500"}><MdCurrencyRupee /> {feesLedger.totalFeesCollect || 0}</Flex>
                                </Flex>
                                <Flex fontWeight={"semibold"} fontSize={14}>
                                    <Text>Discount</Text>
                                    <Flex ml={3} align={"center"} color={"blue.500"}><MdCurrencyRupee /> {feesLedger.totalDiscountCollect || 0}</Flex>
                                </Flex>
                                <Flex fontWeight={"semibold"} fontSize={14}>
                                    <Text>LateFees Collect</Text>
                                    <Flex ml={3} align={"center"} color={"blue.500"}><MdCurrencyRupee /> {feesLedger.totalLateFesCollect || 0}</Flex>
                                </Flex>
                            </Box>
                            <Flex flexDir={"column"} w={"50%"} align={"flex-end"}>
                                <Flex fontWeight={"semibold"} fontSize={18}>
                                    <Text>Due Fees</Text>
                                    <Flex ml={3} align={"center"} color={"red.500"}><MdCurrencyRupee /> {feesLedger.totalDue || 0}</Flex>
                                </Flex>
                                <Flex fontWeight={"semibold"} fontSize={14}>
                                    <Text>Late Fees</Text>
                                    {/* <Flex ml={3} align={"center"} color={"red.500"}><MdCurrencyRupee /> {sumBy(studentFees.studentFees, "lateFees") || 0}</Flex> */}
                                </Flex>
                            </Flex>
                        </Flex>
                        {studentFeesDetails ?
                            <Box mt={4} fontSize={14}>
                                <Flex px={2} py={1} fontWeight={"semibold"} bg={`${themeColor}.200`} align={"center"} justify={"space-between"}>
                                    <Text>School Fees Details</Text>
                                    <Text fontSize={14} fontWeight={"bold"}>Due Fees: &nbsp; {sumBy(studentFeesDetails, "amount")}</Text>
                                </Flex>
                                <TableContainer>
                                    <Table>
                                        <Tbody>
                                            <Tr>
                                                <Td><Flex fontWeight={"bold"}>Fees Head </Flex></Td>
                                                <Td><Flex fontWeight={"bold"}>Total Fees </Flex></Td>
                                                <Td><Flex fontWeight={"bold"}>Deposite </Flex></Td>
                                                <Td><Flex fontWeight={"bold"}>Pending </Flex></Td>
                                                <Td><Flex fontWeight={"bold"}>Due Fees</Flex></Td>
                                                <Td><Flex fontWeight={"bold"}>Discount </Flex></Td>
                                                <Td><Flex fontWeight={"bold"}>Late Fees </Flex></Td>
                                                <Td><Flex fontWeight={"bold"}>Due Date </Flex></Td>
                                            </Tr>
                                            {map(studentFeesDetails, fee => (
                                                <Tr>
                                                    <Td>{fee?.fees_name_master?.name}</Td>
                                                    <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{fee.totalFees}</Flex></Td>
                                                    <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{fee.deposite}</Flex></Td>
                                                    <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{fee.pending}</Flex></Td>
                                                    <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{fee.amount}</Flex></Td>
                                                    <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{fee.discount}</Flex></Td>
                                                    <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{fee.lateFees || 0}</Flex></Td>
                                                    <Td>{fee.dueDate ? dayjs(fee.dueDate).format("DD-MM-YYYY") : ""}</Td>
                                                </Tr>
                                            ))}
                                            <Tr >
                                                <Td style={{ fontSize: 15, background: "white" }}><Flex fontWeight={"bold"}>Total </Flex></Td>
                                                <Td style={{ fontSize: 15, background: "white" }}><Flex fontWeight={"bold"} align={"center"} justify={"flex-end"}><MdCurrencyRupee />{sumBy(studentFeesDetails, "totalFees")}</Flex></Td>
                                                <Td style={{ fontSize: 15, background: "white" }}><Flex fontWeight={"bold"} align={"center"} justify={"flex-end"}><MdCurrencyRupee />{sumBy(studentFeesDetails, "deposite")}</Flex></Td>
                                                <Td style={{ fontSize: 15, background: "white" }}><Flex fontWeight={"bold"} align={"center"} justify={"flex-end"}><MdCurrencyRupee />{sumBy(studentFeesDetails, "pending")}</Flex></Td>
                                                <Td style={{ fontSize: 15, background: "white" }}><Flex fontWeight={"bold"} align={"center"} justify={"flex-end"}><MdCurrencyRupee />{sumBy(studentFeesDetails, "amount")}</Flex></Td>
                                                <Td style={{ fontSize: 15, background: "white" }}><Flex fontWeight={"bold"} align={"center"} justify={"flex-end"}><MdCurrencyRupee />{sumBy(studentFeesDetails, "discount")}</Flex></Td>
                                                <Td style={{ fontSize: 15, background: "white" }}><Flex fontWeight={"bold"} align={"center"} justify={"flex-end"}><MdCurrencyRupee />{sumBy(studentFeesDetails, "lateFees")}</Flex></Td>
                                                <Td style={{ fontSize: 15, background: "white" }}></Td>
                                            </Tr>
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </Box>
                            :
                            null
                        }
                        {transportFeesDetails?.length ?
                            <Box mt={4} fontSize={14}>
                                <Flex px={2} py={1} fontWeight={"semibold"} bg={`${themeColor}.200`} align={"center"} justify={"space-between"}>
                                    <Text>Transport Fees Details</Text>
                                    <Text fontSize={14} fontWeight={"bold"}>Due Fees: &nbsp; {sumBy(transportFeesDetails, "amount")}</Text>
                                </Flex>
                                <TableContainer>
                                    <Table>
                                        <Tbody>
                                            <Tr>
                                                <Td><Flex fontWeight={"bold"}>Fees Head </Flex></Td>
                                                <Td><Flex fontWeight={"bold"}>Total Fees </Flex></Td>
                                                <Td><Flex fontWeight={"bold"}>Deposite </Flex></Td>
                                                <Td><Flex fontWeight={"bold"}>Pending </Flex></Td>
                                                <Td><Flex fontWeight={"bold"}>Due Fees</Flex></Td>
                                                <Td><Flex fontWeight={"bold"}>Discount </Flex></Td>
                                                <Td><Flex fontWeight={"bold"}>Late Fees </Flex></Td>
                                                <Td><Flex fontWeight={"bold"}>Due Date </Flex></Td>
                                            </Tr>
                                            {map(transportFeesDetails, fee => (
                                                <Tr>
                                                    <Td>{fee?.transport_fee_master?.name}</Td>
                                                    <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{fee.totalFees}</Flex></Td>
                                                    <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{fee.deposite}</Flex></Td>
                                                    <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{fee.pending}</Flex></Td>
                                                    <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{fee.amount}</Flex></Td>
                                                    <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{fee.discount}</Flex></Td>
                                                    <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{fee.lateFees || 0}</Flex></Td>
                                                    <Td>{fee.dueDate ? dayjs(fee.dueDate).format("DD-MM-YYYY") : ""}</Td>
                                                </Tr>
                                            ))}
                                            <Tr>
                                                <Td style={{ fontSize: 15, background: "white" }}><Flex fontWeight={"bold"}>Total </Flex></Td>
                                                <Td style={{ fontSize: 15, background: "white" }}><Flex fontWeight={"bold"} align={"center"} justify={"flex-end"}><MdCurrencyRupee />{sumBy(transportFeesDetails, "totalFees")}</Flex></Td>
                                                <Td style={{ fontSize: 15, background: "white" }}><Flex fontWeight={"bold"} align={"center"} justify={"flex-end"}><MdCurrencyRupee />{sumBy(transportFeesDetails, "deposite")}</Flex></Td>
                                                <Td style={{ fontSize: 15, background: "white" }}><Flex fontWeight={"bold"} align={"center"} justify={"flex-end"}><MdCurrencyRupee />{sumBy(transportFeesDetails, "pending")}</Flex></Td>
                                                <Td style={{ fontSize: 15, background: "white" }}><Flex fontWeight={"bold"} align={"center"} justify={"flex-end"}><MdCurrencyRupee />{sumBy(transportFeesDetails, "amount")}</Flex></Td>
                                                <Td style={{ fontSize: 15, background: "white" }}><Flex fontWeight={"bold"} align={"center"} justify={"flex-end"}><MdCurrencyRupee />{sumBy(transportFeesDetails, "discount")}</Flex></Td>
                                                <Td style={{ fontSize: 15, background: "white" }}><Flex fontWeight={"bold"} align={"center"} justify={"flex-end"}><MdCurrencyRupee />{sumBy(transportFeesDetails, "lateFees")}</Flex></Td>
                                                <Td style={{ fontSize: 15, background: "white" }}></Td>
                                            </Tr>
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </Box>
                            :
                            null
                        }
                    </Box>
                    :
                    null
                }
            </LoadingContainer>
        </Box>
    )
}