import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Checkbox, Flex, IconButton, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { find, map } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { useLibraryStore } from "@/store/Library";
import Barcode from "react-barcode";
import { MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { SchoolHeader } from "@/common/SchoolHeader";

export const CurrentStock = ({ themeColor, sessionMasterId }) => {
    const [inputValue, setInputValue] = useState({})

    const { getCatalogAction, getCatalogStatus, allCatalogs, resetCatalogData, getCurrentStockAction, getCurrentStockStatus, allCurrentStocks, resetCurrentStockData } = useLibraryStore(s => ({
        getCatalogAction: s.getCatalogAction,
        getCatalogStatus: s.getCatalogStatus,
        allCatalogs: s.allCatalogs,
        resetCatalogData: s.resetCatalogData,
        getCurrentStockAction: s.getCurrentStockAction,
        getCurrentStockStatus: s.getCurrentStockStatus,
        allCurrentStocks: s.allCurrentStocks,
        resetCurrentStockData: s.resetCurrentStockData
    }))

    useEffect(() => {
        if ((getCurrentStockStatus || 1) === STATUS.NOT_STARTED) {
            getCurrentStockAction()
        }
    }, [getCurrentStockAction, getCurrentStockStatus])

    useEffect(() => {
        return () => resetCurrentStockData()
    }, [resetCurrentStockData])

    useEffect(() => {
        if ((getCatalogStatus || 1) === STATUS.NOT_STARTED) {
            getCatalogAction({ limit: 1000000, page: 1 })
        }
    }, [getCatalogAction, getCatalogStatus])

    useEffect(() => {
        return () => resetCatalogData()
    }, [resetCatalogData])

    const inputHandler = (name, val) => {
        setInputValue(pre => ({ ...pre, [name]: val }))
    }

    const getCurrentStock = () => {
        getCurrentStockAction(inputValue)
    }

    const printAllRef = useRef(null);
    const handleAllPrint = useReactToPrint({
        content: () => printAllRef.current,
        pageStyle: `
        @page {
            size: landscape;
          }
        `,
    });

    return (
        <Box>
            <PageHeader heading={"Current Stock"} extra={<Button size={"sm"} colorScheme={themeColor} onClick={handleAllPrint}>Print</Button>} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
                    <Flex w={"50%"} gap={3}>
                        {/* <CustomSelect size={"sm"} name="catelogId" label={"Select Book"} inputValue={inputValue} autoFocus={true} setInputValue={setInputValue} data={
                            map(allCatalogs?.data, c => ({ name: c.name, value: c.id }))
                        } /> */}
                        <Menu w={"30%"} closeOnSelect={false}>
                            <MenuButton w={"30%"} colorScheme='blue'>
                                <Flex px={3} py={1} border={"1px solid"} borderColor={"gray.200"} fontSize={13} fontWeight={"bold"} color={"blue.800"}>Select Book</Flex>
                            </MenuButton>
                            <MenuList minWidth='240px'>
                                <MenuOptionGroup title='Select Book' type='checkbox' onChange={(e) => inputHandler("catelogId", e)}>
                                    <MenuItemOption isDisabled={!find(inputValue?.catelogId, ex => ex === "all") && inputValue?.catelogId?.length} value='all'>All</MenuItemOption>
                                    {map(allCatalogs?.data, cat => (
                                        <MenuItemOption isDisabled={find(inputValue?.catelogId, ex => ex === "all") ? true : false} value={cat.id}>{cat.name}</MenuItemOption>
                                    ))}
                                </MenuOptionGroup>
                            </MenuList>
                        </Menu>
                        <Button size={"sm"} isDisabled={inputValue?.catelogId ? false : true} colorScheme={themeColor} onClick={getCurrentStock}>Get</Button>
                    </Flex>
                    <LoadingContainer status={getCurrentStockStatus}>
                        <Data allCurrentStocks={allCurrentStocks} />
                        <Box display={"none"}>
                            {/* {allPrintProps && allPrintProps?.length && */}
                            <Box ref={printAllRef} p={5}>
                                <SchoolHeader title={"Current Stock Report"} />
                                <Data allCurrentStocks={allCurrentStocks} />
                            </Box>
                            {/* } */}
                        </Box>
                    </LoadingContainer>
                </Box>
            </Box>
        </Box>
    )
}

const Data = ({ allCurrentStocks }) => {
    return (
        allCurrentStocks?.length ?
            <TableContainer mt={2}>
                < Table w="100%" size={"sm"} variant={"simple"} >
                    <Thead>
                        <Tr bg="gray.100">
                            <Th>S.No.</Th>
                            <Th>Book Name</Th>
                            <Th>Book Type</Th>
                            <Th>Author</Th>
                            <Th>Publisher</Th>
                            <Th textAlign={"center"}>Stock</Th>
                            <Th textAlign={"center"}>Issued</Th>
                            <Th textAlign={"center"}>Damage</Th>
                            <Th textAlign={"center"}>Available</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {map(allCurrentStocks, (stock, index) => (
                            <Tr key={index}>
                                <Td>{index + 1}</Td>
                                <Td>{stock.name}</Td>
                                <Td>{stock.book_type.name}</Td>
                                <Td>{stock.author}</Td>
                                <Td>{stock.publisher}</Td>
                                <Td textAlign={"center"}>{stock.issuedBooks + stock.pendingBooks}</Td>
                                <Td textAlign={"center"}>{stock.issuedBooks}</Td>
                                <Td textAlign={"center"}>{stock.damageBooks}</Td>
                                <Td textAlign={"center"} style={{ fontWeight: "bold" }}>{stock.pendingBooks}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table >
            </TableContainer >
            :
            <NoData title={"No Stock Found"} />

    )
}