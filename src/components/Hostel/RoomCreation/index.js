import { EditIcon } from "@chakra-ui/icons";
import { Box, Button, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { LoadingContainer } from "@/common/LoadingContainer";
import { DeleteButton } from "@/common/DeleteButton";
import { NoData } from "@/common/NoData";
import { AddItem } from "./AddRoom";

export const RoomCreation = ({ themeColor, sessionMasterId }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)

    const deleteRoom = (id) => {
    }

    return (
        <Box>
            <PageHeader heading={"Room List"} extra={<Button size={"sm"} colorScheme={themeColor} onClick={() => setToggleDrawer([])}>Add Room</Button>} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
                    <TableContainer mt={2}>
                        <Table w="100%" size={"sm"} variant={"simple"}>
                            <Thead>
                                <Tr bg="gray.100">
                                    <Th>S.No.</Th>
                                    <Th>Room</Th>
                                    <Th>Total Bed</Th>
                                    <Th>Rent</Th>
                                    <Th>Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {map(new Array(5), (a, index) => (
                                    <Tr>
                                        <Td>{index + 1}</Td>
                                        <Td>101</Td>
                                        <Td>3</Td>
                                        <Td>6000</Td>
                                        <Td>
                                            <Tooltip placement="top" label="Edit">
                                                <IconButton mr={3} size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={themeColor} onClick={() => setToggleDrawer([])} />
                                            </Tooltip>
                                            <DeleteButton
                                                description={"Are you sure? Do you want to delete?"}
                                                confirm={() => deleteRoom(index)}
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