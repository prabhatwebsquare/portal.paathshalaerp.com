import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { AddPurchaseOrder } from "./AddPurchaseOrder";
import Pagination from "@/common/Pagination";

export const PurchaseOrder = ({ themeColor, sessionMasterId }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    const [limit, setLimit] = useState(2)
    const [currentPage, setCurrentPage] = useState(1)

    // useEffect(() => {
    //     if (currentPage && limit)
    //         getPurchaseEntryAction({ page: currentPage, limit: parseInt(limit) })
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [currentPage, limit, sessionMasterId])

    const deletePurchaseEntry = (id) => {
    }

    return (
        <Box>
            <PageHeader heading={"Purchase Order"} extra={<Button size={"sm"} colorScheme={themeColor} leftIcon={<AddIcon />} onClick={() => setToggleDrawer([])}>Add Order</Button>} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
                    <Flex mt={2} justify={"space-between"}>
                        <Flex w={"45%"}>
                            {/* <CustomInput autoFocus={true} size={"sm"} type={"text"} name="search" label={"Search By Item"} inputValue={inputValue} setInputValue={setInputValue} />
                            <Button ml={2} size={"sm"} colorScheme={themeColor} isDisabled={inputValue?.search ? false : true} onClick={searchBook}>Get</Button>
                            <Button ml={2} size={"sm"} leftIcon={<GrPowerReset />} onClick={reset}>Reset</Button> */}
                        </Flex>
                        <Pagination totalItems={1} limit={limit} setLimit={setLimit} currentPage={currentPage} setCurrentPage={setCurrentPage} themeColor={themeColor} />
                    </Flex>
                    <TableContainer mt={2}>
                        <Table w="100%" size={"sm"} variant={"simple"}>
                            <Thead>
                                <Tr bg="gray.100">
                                    <Th>S.No.</Th>
                                    <Th>Supplier</Th>
                                    <Th>Item</Th>
                                    <Th>Quantity</Th>
                                    <Th>Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {map(new Array(5), (a, i) => (
                                    <Tr>
                                        <Td>{i + 1}</Td>
                                        <Td>ABC Pvt. Ltd.</Td>
                                        <Td>Beaker</Td>
                                        <Td>20</Td>
                                        <Td></Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
                {toggleDrawer && <AddPurchaseOrder data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} themeColor={themeColor} />}
                {/* {toggleModal && <BulkStockEntry data={toggleModal} closeModal={() => setToggleModal(null)} themeColor={themeColor} />} */}
            </Box>
        </Box>
    )
}