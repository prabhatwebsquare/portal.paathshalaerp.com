import { EditIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, Flex, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { useLibraryStore } from "@/store/Library";
import dayjs from "dayjs";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import CustomInput from "@/common/CustomInput";
import Pagination from "@/common/Pagination";
import { AddIssueItem } from "./AddIssueItem";

export const IssueItem = ({ themeColor, sessionMasterId }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    const [inputValue, setInputValue] = useState({ startDate: dayjs().format("YYYY-MM-DD"), endDate: dayjs().format("YYYY-MM-DD") })
    const [limit, setLimit] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)

    // const { getBookIssueAction, getBookIssueStatus, allBookIssues, resetBookIssueData } = useLibraryStore(s => ({
    //     getBookIssueAction: s.getBookIssueAction,
    //     getBookIssueStatus: s.getBookIssueStatus,
    //     allBookIssues: s.allBookIssues,
    //     resetBookIssueData: s.resetBookIssueData
    // }))

    // useEffect(() => {
    //     if ((getBookIssueStatus || 1) === STATUS.NOT_STARTED) {
    //         getBookIssueAction({ status: 0, page: 1, limit: 10, ...inputValue })
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [getBookIssueAction, getBookIssueStatus])

    // useEffect(() => {
    //     if (currentPage && limit)
    //         getBookIssueAction({ status: 0, page: currentPage, limit: parseInt(limit), ...inputValue })
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [currentPage, getBookIssueAction, limit, sessionMasterId])

    const searchBookIssue = () => {
        //     setCurrentPage(1)
        //     getBookIssueAction({ status: 0, page: 1, limit: 10, ...inputValue })
    }

    // useEffect(() => {
    //     return () => resetBookIssueData()
    // }, [resetBookIssueData])

    return (
        <Box>
            <PageHeader heading={"Issue Item"} extra={<Button size={"sm"} colorScheme={themeColor} onClick={() => setToggleDrawer([])}>Add Issue Item</Button>} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
                    <Flex mt={2} justify={"space-between"}>
                        <Flex w={"45%"} gap={3}>
                            <CustomInput autoFocus={true} size={"sm"} type={"date"} name="startDate" label={"Start Date"} inputValue={inputValue} setInputValue={setInputValue} />
                            <CustomInput size={"sm"} type={"date"} name="endDate" label={"End Date"} inputValue={inputValue} setInputValue={setInputValue} />
                            <Button size={"sm"} colorScheme={themeColor} onClick={searchBookIssue}>Get</Button>
                            {/* <Button ml={2} size={"sm"} leftIcon={<GrPowerReset />} onClick={reset}>Reset</Button> */}
                        </Flex>
                        <Pagination totalItems={5} limit={limit} setLimit={setLimit} currentPage={currentPage} setCurrentPage={setCurrentPage} themeColor={themeColor} />
                    </Flex>
                    <TableContainer mt={2}>
                        <Table w="100%" size={"sm"} variant={"simple"}>
                            <Thead>
                                <Tr bg="gray.100">
                                    <Th>S.No.</Th>
                                    <Th>Seller</Th>
                                    <Th>Department</Th>
                                    <Th>Item Name</Th>
                                    <Th>Quantity</Th>
                                    <Th>Issue Date</Th>
                                    <Th>Status</Th>
                                    {/* {(HasPermission(PERMISSIONS.BOOK_ISSUE_EDIT) || HasPermission(PERMISSIONS.BOOK_ISSUE_DELETE)) ? */}
                                    <Th>Action</Th>
                                    {/* :
                                        null
                                    } */}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {map(new Array(5), (issue, index) => (
                                    <Tr>
                                        <Td>{index + 1}</Td>
                                        <Td>Ashok</Td>
                                        <Td>Science</Td>
                                        <Td>Beaker</Td>
                                        <Td>20</Td>
                                        <Td>02-10-2024</Td>
                                        <Td>Issued</Td>
                                        <Td></Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
                {toggleDrawer && <AddIssueItem data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} themeColor={themeColor} sessionMasterId={sessionMasterId} />}
                {/* {toggleReturn && <ReturnBook data={toggleReturn} closeDrawer={() => setToggleReturn(null)} themeColor={themeColor} sessionMasterId={sessionMasterId} />} */}
            </Box>
        </Box >
    )
}