import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { LoadingContainer } from "@/common/LoadingContainer";
import { DeleteButton } from "@/common/DeleteButton";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { useLibraryStore } from "@/store/Library";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { AddStockEntry } from "./AddStockEntry";
import { BulkStockEntry } from "./BulkStockEntry";
import CustomInput from "@/common/CustomInput";
import { GrPowerReset } from "react-icons/gr";
import Pagination from "@/common/Pagination";

export const StockEntry = ({ themeColor, sessionMasterId }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    const [toggleModal, setToggleModal] = useState(null)
    const [inputValue, setInputValue] = useState({ search: "" })
    const [limit, setLimit] = useState(2)
    const [currentPage, setCurrentPage] = useState(1)

    const { getPurchaseEntryAction, getPurchaseEntryStatus, allPurchaseEntrys, resetPurchaseEntryData, deletePurchaseEntryAction, deletePurchaseEntryStatus, resetPurchaseEntryStatus } = useLibraryStore(s => ({
        getPurchaseEntryAction: s.getPurchaseEntryAction,
        getPurchaseEntryStatus: s.getPurchaseEntryStatus,
        allPurchaseEntrys: s.allPurchaseEntrys,
        resetPurchaseEntryData: s.resetPurchaseEntryData,
        deletePurchaseEntryAction: s.deletePurchaseEntryAction,
        deletePurchaseEntryStatus: s.deletePurchaseEntryStatus,
        resetPurchaseEntryStatus: s.resetPurchaseEntryStatus
    }))

    useEffect(() => {
        if ((getPurchaseEntryStatus || 1) === STATUS.NOT_STARTED) {
            getPurchaseEntryAction({ page: 1, limit: 2 })
        }
    }, [getPurchaseEntryAction, getPurchaseEntryStatus])

    useEffect(() => {
        if (currentPage && limit)
            getPurchaseEntryAction({ page: currentPage, limit: parseInt(limit), ...inputValue })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, getPurchaseEntryAction, limit, sessionMasterId])

    const searchBook = () => {
        setCurrentPage(1)
        getPurchaseEntryAction({ page: 1, limit: 10, ...inputValue })
    }

    const reset = () => {
        setCurrentPage(1)
        setInputValue({ search: "" })
        getPurchaseEntryAction({ page: 1, limit: 10, search: "" })
    }

    useEffect(() => {
        return () => resetPurchaseEntryData()
    }, [resetPurchaseEntryData])

    const deletePurchaseEntry = (id) => {
        deletePurchaseEntryAction(id)
    }

    return (
        <Box>
            <PageHeader heading={"Stock Entry"} extra={HasPermission(PERMISSIONS.PURCHASE_ENTRY_ADD) &&
                <Flex gap={3}>
                    {/* <Button size={"sm"} colorScheme={themeColor} leftIcon={<AddIcon />} onClick={() => setToggleModal([])}>Bulk Entry</Button> */}
                    <Button size={"sm"} colorScheme={themeColor} leftIcon={<AddIcon />} onClick={() => setToggleDrawer([])}>Add Stock Entry</Button>
                </Flex>
            } />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
                    <Flex mt={2} justify={"space-between"}>
                        <Flex w={"45%"}>
                            <CustomInput autoFocus={true} size={"sm"} type={"text"} name="search" label={"Search By Item/Department"} inputValue={inputValue} setInputValue={setInputValue} />
                            <Button ml={2} size={"sm"} colorScheme={themeColor} isDisabled={inputValue?.search ? false : true} onClick={searchBook}>Get</Button>
                            <Button ml={2} size={"sm"} leftIcon={<GrPowerReset />} onClick={reset}>Reset</Button>
                        </Flex>
                        <Pagination totalItems={allPurchaseEntrys?.purchaseCount} limit={limit} setLimit={setLimit} currentPage={currentPage} setCurrentPage={setCurrentPage} themeColor={themeColor} />
                    </Flex>
                    <LoadingContainer status={getPurchaseEntryStatus}>
                        {allPurchaseEntrys?.length ?
                            <TableContainer mt={2}>
                                <Table w="100%" size={"sm"} variant={"simple"}>
                                    <Thead>
                                        <Tr bg="gray.100">
                                            <Th>S.No.</Th>
                                            <Th>Supplier</Th>
                                            <Th>Item</Th>
                                            <Th>Quantity</Th>
                                            <Th>Date</Th>
                                            <Th>Bill No</Th>
                                            <Th>Amount</Th>
                                            <Th>Description</Th>
                                            {/* {(HasPermission(PERMISSIONS.PURCHASE_ENTRY_EDIT) || HasPermission(PERMISSIONS.PURCHASE_ENTRY_DELETE)) ? */}
                                            <Th>Action</Th>
                                            {/* :
                                                null
                                            } */}
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {map(new Array(5), (a, i) => (
                                            <Tr>
                                                <Td>{i + 1}</Td>
                                                <Td>ABC Pvt. Ltd.</Td>
                                                <Td>Beaker</Td>
                                                <Td>20</Td>
                                                <Td>22-09-2024</Td>
                                                <Td>25</Td>
                                                <Td>50000</Td>
                                                <Td>Chemistry lab</Td>
                                                <Td></Td>
                                            </Tr>
                                        ))}
                                        {/* {map(allPurchaseEntrys, (entry, index) => (
                                            map(entry?.purchase_book_details, (book, i) => (
                                                <Tr key={i}>
                                                    {i === 0 &&
                                                        <>
                                                            <Td rowSpan={entry.purchase_book_details?.length}>{index + 1}</Td>
                                                            <Td rowSpan={entry.purchase_book_details?.length}>{entry.book_vendor?.name}</Td>
                                                        </>
                                                    }
                                                    <Td>{book.catelog.name}</Td>
                                                    <Td>{book.catelog.author}</Td>
                                                    <Td>{book.catelog.publisher}</Td>
                                                    <Td>{book.catelog.catelogType}</Td>
                                                    <Td>{book.quantity}</Td>
                                                    <Td>{book.price}</Td>
                                                    {i === 0 &&
                                                        (HasPermission(PERMISSIONS.PURCHASE_ENTRY_EDIT) || HasPermission(PERMISSIONS.PURCHASE_ENTRY_DELETE)) ?
                                                        <Td rowSpan={entry.purchase_book_details?.length}>
                                                            {HasPermission(PERMISSIONS.PURCHASE_ENTRY_EDIT) &&
                                                                <Tooltip placement="top" label="Edit">
                                                                    <IconButton mr={3} size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={themeColor} onClick={() => setToggleDrawer(entry)} />
                                                                </Tooltip>
                                                            }
                                                            {HasPermission(PERMISSIONS.PURCHASE_ENTRY_DELETE) &&
                                                                <DeleteButton
                                                                    description={"Are you sure? Do you want to delete?"}
                                                                    confirm={() => deletePurchaseEntry(entry.id)}
                                                                    status={deletePurchaseEntryStatus}
                                                                    reset={resetPurchaseEntryStatus}
                                                                />
                                                            }
                                                        </Td>
                                                        :
                                                        null
                                                    }
                                                </Tr>
                                            ))
                                        ))} */}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            :
                            <NoData title={"No Stock Entry Found"} />
                        }
                    </LoadingContainer>
                </Box>
                {toggleDrawer && <AddStockEntry data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} themeColor={themeColor} />}
                {/* {toggleModal && <BulkStockEntry data={toggleModal} closeModal={() => setToggleModal(null)} themeColor={themeColor} />} */}
            </Box>
        </Box>
    )
}