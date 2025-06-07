import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, Checkbox, Flex, IconButton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { useLibraryStore } from "@/store/Library";
import Barcode from "react-barcode";
import { MdLocalPrintshop } from "react-icons/md";
import CustomInput from "@/common/CustomInput";

export const SearchBook = ({ themeColor, sessionMasterId }) => {
    const [searchInput, setSearchInput] = useState({})


    const { getSearchBookAction, getSearchBookStatus, allSearchBooks, resetSearchBookData } = useLibraryStore(s => ({
        getSearchBookAction: s.getSearchBookAction,
        getSearchBookStatus: s.getSearchBookStatus,
        allSearchBooks: s.allSearchBooks,
        resetSearchBookData: s.resetSearchBookData
    }))

    // useEffect(() => {
    //     if ((getSearchBookStatus || 1) === STATUS.NOT_STARTED) {
    //         getSearchBookAction()
    //     }
    // }, [getSearchBookAction, getSearchBookStatus])

    const handleSearchInput = (val) => {
        setSearchInput({ filters: val })
        if (val?.length >= 1) {
            getSearchBookAction({
                search: val
            })
        }
    }

    useEffect(() => {
        return () => resetSearchBookData()
    }, [resetSearchBookData])

    return (
        <Box>
            <PageHeader heading={"Search Book"} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box pt={3} className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
                    <CustomInput type={"text"} search={true} name="filters" label={"Search Book"} autoFocus={true} inputValue={searchInput} setInputValue={handleSearchInput} />
                    <LoadingContainer status={getSearchBookStatus}>
                        {allSearchBooks?.length ?
                            <TableContainer mt={2}>
                                <Table w="100%" size={"sm"} variant={"simple"}>
                                    <Thead>
                                        <Tr bg="gray.100">
                                            <Th>S.No.</Th>
                                            <Th>Accession No.</Th>
                                            <Th>Book Name</Th>
                                            <Th>Author</Th>
                                            <Th>Publisher</Th>
                                            <Th>Catalog Type</Th>
                                            <Th>Shelf</Th>
                                            <Th>Status</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {map(allSearchBooks, (book, index) => (
                                            <Tr key={index}>
                                                <Td>{index + 1}</Td>
                                                <Td>{book?.accessionFormNo}</Td>
                                                <Td>{book?.catelog?.name}</Td>
                                                <Td>{book?.catelog?.author}</Td>
                                                <Td>{book?.catelog?.publisher}</Td>
                                                <Td>{book?.catelog?.catelogType}</Td>
                                                <Td>{book?.shelf_location?.name}</Td>
                                                <Td>
                                                    {book.status === 0 ?
                                                        <Badge variant='outline' colorScheme={"green"}>Available</Badge>
                                                        :
                                                        <Badge variant='outline' colorScheme={"red"}>Not Available</Badge>
                                                    }
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            :
                            <NoData title={"No Book Found"} />
                        }
                    </LoadingContainer>
                </Box>
            </Box>
        </Box>
    )
}