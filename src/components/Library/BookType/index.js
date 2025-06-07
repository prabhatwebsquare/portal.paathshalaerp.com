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
import Barcode from "react-barcode";
import { AddBookType } from "./AddBookType";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const BookType = ({ themeColor, sessionMasterId }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)

    const { getBookTypeAction, getBookTypeStatus, allBookTypes, deleteBookTypeAction, deleteBookTypeStatus, resetBookTypeStatus } = useLibraryStore(s => ({
        getBookTypeAction: s.getBookTypeAction,
        getBookTypeStatus: s.getBookTypeStatus,
        allBookTypes: s.allBookTypes,
        deleteBookTypeAction: s.deleteBookTypeAction,
        deleteBookTypeStatus: s.deleteBookTypeStatus,
        resetBookTypeStatus: s.resetBookTypeStatus
    }))

    useEffect(() => {
        if ((getBookTypeStatus || 1) === STATUS.NOT_STARTED) {
            getBookTypeAction()
        }
    }, [getBookTypeAction, getBookTypeStatus])

    const deleteBookType = (id) => {
        deleteBookTypeAction(id)
    }

    return (
        <Box>
            <PageHeader heading={"Book/Journal Type"} extra={HasPermission(PERMISSIONS.BOOK_TYPE_ADD) && <Button size={"sm"} colorScheme={themeColor} onClick={() => setToggleDrawer([])}>Add Type</Button>} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
                    <LoadingContainer status={getBookTypeStatus}>
                        {allBookTypes?.length ?
                            <TableContainer mt={2}>
                                <Table w="100%" size={"sm"} variant={"simple"}>
                                    <Thead>
                                        <Tr bg="gray.100">
                                            <Th>S.No.</Th>
                                            <Th>Name</Th>
                                            {(HasPermission(PERMISSIONS.BOOK_TYPE_EDIT) || HasPermission(PERMISSIONS.BOOK_TYPE_DELETE)) ?
                                                <Th>Action</Th>
                                                :
                                                null
                                            }
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {map(allBookTypes, (book, index) => (
                                            <Tr key={book.id}>
                                                <Td>{index + 1}</Td>
                                                <Td>{book.name}</Td>
                                                {(HasPermission(PERMISSIONS.BOOK_TYPE_EDIT) || HasPermission(PERMISSIONS.BOOK_TYPE_DELETE)) ?
                                                    <Td>
                                                        {HasPermission(PERMISSIONS.BOOK_TYPE_EDIT) &&
                                                            <Tooltip placement="top" label="Edit">
                                                                <IconButton mr={3} size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={themeColor} onClick={() => setToggleDrawer(book)} />
                                                            </Tooltip>
                                                        }
                                                        {HasPermission(PERMISSIONS.BOOK_TYPE_DELETE) &&
                                                            <DeleteButton
                                                                description={"Are you sure? Do you want to delete?"}
                                                                confirm={() => deleteBookType(book.id)}
                                                                status={deleteBookTypeStatus}
                                                                reset={resetBookTypeStatus}
                                                            />
                                                        }
                                                    </Td>
                                                    :
                                                    null
                                                }
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            :
                            <NoData title={"No Book/Journal Type Found"} />
                        }
                    </LoadingContainer>
                </Box>
                {toggleDrawer && <AddBookType data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} themeColor={themeColor} />}
            </Box>
        </Box>
    )
}