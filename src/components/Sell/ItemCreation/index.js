import { EditIcon } from "@chakra-ui/icons";
import { Box, Button, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { LoadingContainer } from "@/common/LoadingContainer";
import { DeleteButton } from "@/common/DeleteButton";
import { NoData } from "@/common/NoData";
import { AddItem } from "./AddItem";

export const ItemCreation = ({ themeColor, sessionMasterId }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)

    const deleteBookType = (id) => {
    }

    return (
        <Box>
            <PageHeader heading={"Item Creation"} extra={<Button size={"sm"} colorScheme={themeColor} onClick={() => setToggleDrawer([])}>Add Item</Button>} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
                    <TableContainer mt={2}>
                        <Table w="100%" size={"sm"} variant={"simple"}>
                            <Thead>
                                <Tr bg="gray.100">
                                    <Th>S.No.</Th>
                                    <Th>Name</Th>
                                    <Th>Price</Th>
                                    <Th>Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {map(new Array(5), (a, index) => (
                                    <Tr>
                                        <Td>{index + 1}</Td>
                                        <Td>Shirt</Td>
                                        <Td>250</Td>
                                        <Td>
                                            <Tooltip placement="top" label="Edit">
                                                <IconButton mr={3} size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={themeColor} onClick={() => setToggleDrawer([])} />
                                            </Tooltip>
                                            <DeleteButton
                                                description={"Are you sure? Do you want to delete?"}
                                                confirm={() => deleteBookType(index)}
                                            />
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
                {toggleDrawer && <AddItem data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} themeColor={themeColor} />}
            </Box>
        </Box>
    )
}