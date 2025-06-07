import { LoadingContainer } from '@/common/LoadingContainer';
import { useLibraryStore } from '@/store/Library';
import { Flex, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { map } from 'lodash';
import React, { useEffect } from 'react';

export const LibraryBook = ({ promotionId }) => {

    const { getStdBookAction, getStdBookStatus, allStdBooks } = useLibraryStore(s => ({
        getStdBookAction: s.getStdBookAction,
        getStdBookStatus: s.getStdBookStatus,
        allStdBooks: s.allStdBooks
    }))

    useEffect(() => {
        if (promotionId) {
            getStdBookAction({
                promotionId: promotionId,
                status: 0
            })
        }
    }, [getStdBookAction, promotionId])

    return (
        <Flex flexDir={"column"} align={"center"} justify={"center"}>
            <LoadingContainer status={getStdBookStatus}>
                <TableContainer w={"100%"} my={3}>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Accession No</Th>
                                <Th>Book Name</Th>
                                <Th>Shelf</Th>
                                <Th>Issue Date</Th>
                                <Th>Return Date</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {map(allStdBooks, book => {
                                // const isChecked = findIndex(selectedBook, s => s.id === book.id) !== -1 ? true : false
                                return (
                                    <Tr>
                                        <Td>{book.accessionFormNo}</Td>
                                        <Td>{book?.accession?.catelog?.name}</Td>
                                        <Td>{book.shelf_location?.name}</Td>
                                        <Td>{dayjs(book.issueDate).format("DD-MM-YYYY")}</Td>
                                        <Td>{dayjs(book.returnDate).format("DD-MM-YYYY")}</Td>
                                    </Tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </LoadingContainer>
        </Flex >
    );
}