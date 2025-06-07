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

export const ReceivedItem = ({ themeColor, sessionMasterId }) => {
    const [inputValue, setInputValue] = useState({ startDate: dayjs().format("YYYY-MM-DD"), endDate: dayjs().format("YYYY-MM-DD") })
    const [limit, setLimit] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)

    const search = () => {
    }

    return (
        <Box>
            <PageHeader heading={"Received Item"} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
                    <Flex mt={2} justify={"space-between"}>
                        <Flex w={"45%"} gap={3}>
                            <CustomInput autoFocus={true} size={"sm"} type={"date"} name="startDate" label={"Start Date"} inputValue={inputValue} setInputValue={setInputValue} />
                            <CustomInput size={"sm"} type={"date"} name="endDate" label={"End Date"} inputValue={inputValue} setInputValue={setInputValue} />
                            <Button size={"sm"} colorScheme={themeColor} onClick={search}>Get</Button>
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
            </Box>
        </Box >
    )
}