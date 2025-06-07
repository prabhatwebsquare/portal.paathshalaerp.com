import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, Flex, IconButton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { LoadingContainer } from "@/common/LoadingContainer";
import { DeleteButton } from "@/common/DeleteButton";
import { useTransportStore } from "@/store/Transport";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { useLibraryStore } from "@/store/Library";
import dayjs from "dayjs";
import { IoIosReturnLeft } from "react-icons/io";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { AddBookReturn } from "./AddBookReturn";
import CustomInput from "@/common/CustomInput";
import Pagination from "@/common/Pagination";

export const BookReturn = ({ themeColor, sessionMasterId }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    const [inputValue, setInputValue] = useState({ startDate: dayjs().format("YYYY-MM-DD"), endDate: dayjs().format("YYYY-MM-DD") })
    const [limit, setLimit] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)

    const { getBookReturnAction, getBookReturnStatus, allBookReturns, resetBookReturnData } = useLibraryStore(s => ({
        getBookReturnAction: s.getBookReturnAction,
        getBookReturnStatus: s.getBookReturnStatus,
        allBookReturns: s.allBookReturns,
        resetBookReturnData: s.resetBookReturnData
    }))

    useEffect(() => {
        if ((getBookReturnStatus || 1) === STATUS.NOT_STARTED) {
            getBookReturnAction({ status: 1, page: 1, limit: 10, ...inputValue })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getBookReturnAction, getBookReturnStatus])

    useEffect(() => {
        if (currentPage && limit)
            getBookReturnAction({ status: 1, page: currentPage, limit: parseInt(limit), ...inputValue })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, getBookReturnAction, limit, sessionMasterId])

    const searchBookReturn = () => {
        setCurrentPage(1)
        getBookReturnAction({ status: 1, page: 1, limit: 10, ...inputValue })
    }

    useEffect(() => {
        return () => resetBookReturnData()
    }, [resetBookReturnData])

    return (
        <Box>
            <PageHeader heading={"Book Return"} extra={HasPermission(PERMISSIONS.BOOK_RETURN_ADD) && <Button size={"sm"} colorScheme={themeColor} onClick={() => setToggleDrawer([])}>Book Return</Button>} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
                    <Flex mt={2} justify={"space-between"}>
                        <Flex w={"45%"} gap={3}>
                            <CustomInput autoFocus={true} size={"sm"} type={"date"} name="startDate" label={"Start Date"} inputValue={inputValue} setInputValue={setInputValue} />
                            <CustomInput size={"sm"} type={"date"} name="endDate" label={"End Date"} inputValue={inputValue} setInputValue={setInputValue} />
                            <Button size={"sm"} colorScheme={themeColor} onClick={searchBookReturn}>Get</Button>
                            {/* <Button ml={2} size={"sm"} leftIcon={<GrPowerReset />} onClick={reset}>Reset</Button> */}
                        </Flex>
                        <Pagination totalItems={allBookReturns?.bookIssueCount} limit={limit} setLimit={setLimit} currentPage={currentPage} setCurrentPage={setCurrentPage} themeColor={themeColor} />
                    </Flex>
                    <LoadingContainer status={getBookReturnStatus}>
                        {allBookReturns?.data?.length ?
                            <TableContainer mt={2}>
                                <Table w="100%" size={"sm"} variant={"simple"}>
                                    <Thead>
                                        <Tr bg="gray.100">
                                            <Th>S.No.</Th>
                                            <Th>Name</Th>
                                            <Th>Father Name</Th>
                                            <Th>Contact</Th>
                                            <Th>Book Name</Th>
                                            {/* <Th>Author</Th>
                                            <Th>Book Type</Th>
                                            <Th>Publisher</Th> */}
                                            <Th>Accession No</Th>
                                            <Th>Issue Date</Th>
                                            <Th>Return Date</Th>
                                            <Th>Penalty</Th>
                                            <Th>Status</Th>
                                            {(HasPermission(PERMISSIONS.BOOK_ISSUE_EDIT) || HasPermission(PERMISSIONS.BOOK_ISSUE_DELETE)) ?
                                                <Th>Action</Th>
                                                :
                                                null
                                            }
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {map(allBookReturns.data, (issue, index) => (
                                            map(issue?.book_issue_details, (book, i) => (
                                                <Tr key={i}>
                                                    {i === 0 &&
                                                        <>
                                                            <Td rowSpan={issue.book_issue_details?.length}>{index + 1}</Td>
                                                            <Td rowSpan={issue.book_issue_details?.length}>{issue.promotion?.student_master?.studentName}</Td>
                                                            <Td rowSpan={issue.book_issue_details?.length}>{issue.promotion?.student_master?.fatherName}</Td>
                                                            <Td rowSpan={issue.book_issue_details?.length}>{issue.promotion?.student_master?.fatherContact}</Td>
                                                        </>
                                                    }
                                                    <Td>{book?.accession?.catelog?.name}</Td>
                                                    {/* <Td>{book?.accession?.catelog?.author}</Td>
                                                    <Td>{book?.accession?.catelog?.publisher}</Td>
                                                    <Td>{book?.accession?.catelog?.catelogType}</Td> */}
                                                    <Td>{book?.accession?.accessionFormNo}</Td>
                                                    <Td>{book?.issueDate ? dayjs(book.issueDate).format("DD-MM-YYYY") : ""}</Td>
                                                    <Td>{book?.returnDate ? dayjs(book.returnDate).format("DD-MM-YYYY") : ""}</Td>
                                                    <Td>10</Td>
                                                    <Td>
                                                        {issue.status === 0 ?
                                                            <Badge variant='outline' colorScheme={"blue"}>Issued</Badge>
                                                            :
                                                            <Badge variant='outline' colorScheme={"green"}>Returned</Badge>
                                                        }
                                                    </Td>
                                                    {i === 0 &&
                                                        (HasPermission(PERMISSIONS.BOOK_ISSUE_EDIT) || HasPermission(PERMISSIONS.BOOK_ISSUE_DELETE)) ?
                                                        <Td rowSpan={issue.book_issue_details?.length}>
                                                            {HasPermission(PERMISSIONS.BOOK_ISSUE_EDIT) &&
                                                                <Tooltip placement="top" label="Edit">
                                                                    <IconButton mr={1} size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={themeColor} onClick={() => setToggleDrawer(issue)} />
                                                                </Tooltip>
                                                            }
                                                            {/* {HasPermission(PERMISSIONS.BOOK_ISSUE_EDIT) &&
                                                                <Tooltip placement="top" label="Return">
                                                                    <IconButton mr={1} size={"sm"} variant={"ghost"} icon={<IoIosReturnLeft fontSize={20} />} colorScheme={"green"} onClick={() => setToggleReturn(issue)} />
                                                                </Tooltip>
                                                            } */}
                                                            {/* {HasPermission(PERMISSIONS.BOOK_ISSUE_DELETE) &&
                                                                <DeleteButton
                                                                    description={"Are you sure? Do you want to delete?"}
                                                                    confirm={() => deleteBookIssue(shelf.id)}
                                                                    status={deleteBookIssueStatus}
                                                                    reset={resetBookIssueStatus}
                                                                />
                                                            } */}
                                                        </Td>
                                                        :
                                                        null
                                                    }
                                                </Tr>
                                            ))
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            :
                            <NoData title={"No Book Return Found"} />
                        }
                    </LoadingContainer>
                </Box>
                {toggleDrawer && <AddBookReturn data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} themeColor={themeColor} sessionMasterId={sessionMasterId} getBookReturnAction={getBookReturnAction} />}
                {/* {toggleReturn && <ReturnBook data={toggleReturn} closeDrawer={() => setToggleReturn(null)} themeColor={themeColor} sessionMasterId={sessionMasterId} />} */}
            </Box>
        </Box>
    )
}