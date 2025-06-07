import { DownloadExcel } from "@/common/DownloadExcel";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { PageHeader } from "@/common/PageHeader";
import Pagination from "@/common/Pagination";
import { STATUS } from "@/constant";
import { useStdFeesStore } from "@/store/stdFees";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map, split, sum, sumBy } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { RiFileExcel2Fill } from "react-icons/ri";

export const StudentFeesSummary = ({ id }) => {
    const { query } = useRouter()
    const router = useRouter()

    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
        const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), []);
    const [limit, setLimit] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const { getPendingFeesAction, getPendingFeesStatus, pendingFees, resetPendingFees } = useStdFeesStore(s => ({
        getPendingFeesAction: s.getPendingFeesAction,
        getPendingFeesStatus: s.getPendingFeesStatus,
        pendingFees: s.pendingFees,
        resetPendingFees: s.resetPendingFees
    }))

    useEffect(() => {
        if (sessionMasterId && (getPendingFeesStatus || 1) === STATUS.NOT_STARTED) {
            const ids = split(query.slug, "_")
            getPendingFeesAction({
                feesMode: 1,
                feesTypeMasterId:  1,
                sessionMasterId,
                classMasterId: ids[0],
                streamMasterId: ids[1],
                page: currentPage,
                limit: parseInt(limit),

            })
        }
    }, [getPendingFeesAction, getPendingFeesStatus, query.slug, sessionMasterId ,currentPage, limit])
    useEffect(() => {
            const ids = split(query?.slug, "_")
            getPendingFeesAction({
                feesMode: 1,
                feesTypeMasterId:  1,
                sessionMasterId,
                classMasterId: ids[0],
                streamMasterId: ids[1],
                page: currentPage,
                limit: parseInt(limit),

            })
    
    }, [currentPage, limit])

    useEffect(() => {
        return () => {resetPendingFees()
            setCurrentPage(1)
            setLimit(20)
        }
    }, [resetPendingFees])

    const [excelData, setExcelData] = useState(null);
    useEffect(() => {
      if (pendingFees?.studentData?.length > 0) {
        setExcelData(pendingFees?.studentData);
      }
    }, [pendingFees?.studentData]);
    return (
        <Box h="100%">
            <PageHeader heading={`Class ${pendingFees?.classData?.name || ""} Fees Summary`}  extra={
                 <DownloadExcel
                 button={<RiFileExcel2Fill />}
                 data={excelData}
                 name={`Class ${pendingFees?.classData?.name} Fees Summary`}
               />
            } />
            <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                <LoadingContainer status={getPendingFeesStatus}>
                <Pagination
                totalItems={pendingFees?.totalCount}
                limit={limit}
                setLimit={setLimit}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                themeColor={themeColor}
              />
                    {pendingFees?.studentData?.length ?
                        <TableContainer mt={2}>
                            <Table w="100%" size={"sm"} variant={"simple"}>
                                <Thead>
                                    <Tr bg="gray.100">
                                        <Th>Sr No.</Th>
                                        <Th>Student</Th>
                                        <Th>Father Name</Th>
                                        <Th>Contact</Th>
                                        <Th>Total</Th>
                                        <Th>Total Fees</Th>
                                        <Th>Total Late Fees</Th>
                                        <Th>Deposite</Th>
                                        <Th isNumeric>Coll. Late Fees</Th>
                                        <Th>Discount</Th>
                                        <Th>Due Fees</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {map(pendingFees?.studentData, (std, index) => (
                                        <Tr>
                                            <Td>{std.student_master?.srNo}</Td>
                                            <Td><Flex color="blue.400" _hover={{ color: "blue.600" }} cursor={"pointer"} onClick={() => router.push(`/fees/fees-ledger?pid=${std.id}&mid=${std.student_master.id}`)}>{std.student_master?.studentName}</Flex></Td>
                                            <Td>{std.student_master?.fatherName}</Td>
                                            <Td>{std.student_master?.fatherContact}</Td>
                                            <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{std.totalFees + std.totalLateFees}</Flex></Td>
                                            <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{std.totalFees}</Flex></Td>
                                            <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{std.totalLateFees || 0}</Flex></Td>
                                            <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{std.totalCollectFees}</Flex></Td>
                                            <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{std.totalCollectLateFees || 0}</Flex></Td>
                                            <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{std.totalCollectDiscount}</Flex></Td>
                                            <Td><Flex align={"center"} justify={"flex-end"} color={"red.600"}><MdCurrencyRupee />{(std.totalFees + std.totalLateFees) - (std.totalCollectFees + std.totalCollectDiscount + std.totalCollectLateFees)}</Flex></Td>
                                        </Tr>
                                    ))}
                                    <Tr fontWeight={"bold"} bg="gray.100">
                                        <Td>Total</Td>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td><Flex align={"center"} justify={"flex-end"} fontWeight={"bold"}><MdCurrencyRupee />{sum(map(pendingFees?.studentData, "totalFees")) + sum(map(pendingFees?.studentData, "totalLateFees"))}</Flex></Td>
                                        <Td><Flex align={"center"} justify={"flex-end"} fontWeight={"bold"}><MdCurrencyRupee />{sum(map(pendingFees?.studentData, "totalFees"))}</Flex></Td>
                                        <Td><Flex align={"center"} justify={"flex-end"} fontWeight={"bold"}><MdCurrencyRupee />{sum(map(pendingFees?.studentData, "totalLateFees"))}</Flex></Td>
                                        <Td><Flex align={"center"} justify={"flex-end"} fontWeight={"bold"}><MdCurrencyRupee />{sum(map(pendingFees?.studentData, "totalCollectFees"))}</Flex></Td>
                                        <Td><Flex align={"center"} justify={"flex-end"} fontWeight={"bold"}><MdCurrencyRupee />{sum(map(pendingFees?.studentData, "totalCollectLateFees"))}</Flex></Td>
                                        <Td><Flex align={"center"} justify={"flex-end"} fontWeight={"bold"}><MdCurrencyRupee />{sum(map(pendingFees?.studentData, "totalCollectDiscount"))}</Flex></Td>
                                        <Td><Flex align={"center"} justify={"flex-end"} fontWeight={"bold"} color={"red.600"}><MdCurrencyRupee />{(sum(map(pendingFees?.studentData, "totalFees")) + sum(map(pendingFees?.studentData, "totalLateFees"))) - (sum(map(pendingFees?.studentData, "totalCollectFees")) + sum(map(pendingFees?.studentData, "totalCollectDiscount")) + sum(map(pendingFees?.studentData, "totalCollectLateFees")))}</Flex></Td>

                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                        :
                        <NoData title={"No Student Fees Found"} />
                    }
                </LoadingContainer>
            </Box>
        </Box >
    )
}