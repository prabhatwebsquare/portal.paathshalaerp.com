import CustomInput from "@/common/CustomInput"
import { LoadingContainer } from "@/common/LoadingContainer"
import { PageHeader } from "@/common/PageHeader"
import { STATUS } from "@/constant"
import { useClassSetupStore } from "@/store/classSetup"
import { useStudentStore } from "@/store/studentStore"
import { Badge, Box, Button, Flex, IconButton, Image, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react"
import { filter, find, groupBy, map, uniqBy } from "lodash"
import { useRouter } from "next/router"
import React, { useEffect, useMemo, useState } from "react"
import { FaEye } from "react-icons/fa"
import { MdManageAccounts } from "react-icons/md"
import { SRDetails } from "./SRDetails"
import { GrPowerReset } from "react-icons/gr"
import Pagination from "@/common/Pagination"
import { NoData } from "@/common/NoData"

export const SRList = ({ themeColor, sessionMasterId }) => {
    const router = useRouter()
    const [toggleSRDetails, setToggleSRDetails] = useState(null)
    const [limit, setLimit] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [inputValue, setInputValue] = useState({ search: "" })

    const { getSRListAction, getSRListStatus, srList, resetStudent } = useStudentStore(s => ({
        getSRListAction: s.getSRListAction,
        getSRListStatus: s.getSRListStatus,
        srList: s.srList,
        resetStudent: s.resetStudent
    }))

    useEffect(() => {
        if ((getSRListStatus || 1) === STATUS.NOT_STARTED) {
            getSRListAction({ page: 1, limit: 10 })
        }
    }, [getSRListAction, getSRListStatus, sessionMasterId])

    useEffect(() => {
        if (currentPage && limit)
            getSRListAction({ page: currentPage, limit: parseInt(limit), ...inputValue })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, getSRListAction, limit])

    const searchStudent = () => {
        setCurrentPage(1)
        getSRListAction({ page: 1, limit: 10, ...inputValue })
    }

    const reset = () => {
        setCurrentPage(1)
        setInputValue({ search: "" })
        getSRListAction({ page: 1, limit: 10, search: "" })
    }

    useEffect(() => {
        return () => resetStudent()
    }, [resetStudent])
    return (
        <Box h="100%">
            <PageHeader heading={"SR List"} />
            <Box p={5} bg={"white"} h={"90%"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <Flex w={"100%"} justify={"space-between"} my={4} align={"center"}>
                        <Flex w={"45%"}>
                            <CustomInput size={"sm"} type={"text"} name="search" label={"Search By Sr No/Name/Father Contact"} inputValue={inputValue} setInputValue={setInputValue} />
                            <Button ml={2} size={"sm"} colorScheme={themeColor} isDisabled={inputValue?.search ? false : true} onClick={searchStudent}>Get</Button>
                            <Button ml={2} size={"sm"} leftIcon={<GrPowerReset />} onClick={reset}>Reset</Button>
                        </Flex>
                        <Pagination totalItems={srList?.studentCount} limit={limit} setLimit={setLimit} currentPage={currentPage} setCurrentPage={setCurrentPage} themeColor={themeColor} />
                    </Flex>
                    <LoadingContainer status={getSRListStatus}>
                        {srList?.data?.length ?
                            <Table mt={5}>
                                <Thead>
                                    <Tr>
                                        <Th>Sr. No.</Th>
                                        <Th>Student Name</Th>
                                        <Th>Father Name</Th>
                                        <Th>Contact</Th>
                                        <Th>Gender</Th>
                                        <Th>Last Admission Class</Th>
                                        <Th>Address</Th>
                                        <Th>Status</Th>
                                        <Th>Action</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {map(srList.data, std => {
                                        return (
                                            <Tr>
                                                <Td>{std.srNo}</Td>
                                                <Td>{std.studentName}</Td>
                                                <Td>{std.fatherName}</Td>
                                                <Td>{std.fatherContact}</Td>
                                                <Td>{std.gender}</Td>
                                                <Td>{std.promotions?.[0].class_master.name}</Td>
                                                <Td>{std.address}</Td>
                                                <Td><Badge variant={"outline"} colorScheme={"green"}>Active</Badge></Td>
                                                <Td>
                                                    {/* <Tooltip placement="top" label={"Manage SR"}>
                                                        <IconButton size={"xs"} variant={"ghost"} colorScheme={"blue"} onClick={() => router.push(`/student/manage-sr?id=${std.id}`)} icon={<MdManageAccounts fontSize={20} />} />
                                                    </Tooltip> */}
                                                    <Tooltip placement="top" label={"View SR Details"}>
                                                        <IconButton size={"xs"} variant={"ghost"} colorScheme={"green"} onClick={() => setToggleSRDetails(std.id)} icon={<FaEye fontSize={20} />} />
                                                    </Tooltip>
                                                </Td>
                                            </Tr>
                                        )
                                    })}
                                </Tbody>
                            </Table>
                            :
                            // <Flex flexDir={"column"} align={"center"}>
                            //     <Image h={"300"} src={"/assets/nodata.avif"} alt={"No Data"} />
                            //     <Text fontWeight={"semibold"} fontSize={18}>No Students Found</Text>
                            // </Flex>
                            <NoData title={"No SR List Found"} />
                        }
                    </LoadingContainer>
                    {toggleSRDetails && <SRDetails id={toggleSRDetails} closeDrawer={() => setToggleSRDetails(null)} themeColor={themeColor} />}
                </Box>
            </Box>
        </Box>
    )
}