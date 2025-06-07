import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useState } from "react";
import { AddRouteStation } from "./AddRouteStation";
import { PageHeader } from "@/common/PageHeader";
import { NoData } from "@/common/NoData";

export const RouteStation = () => {
    const [toggleDrawer, setToggleDrawer] = useState(null)

    return (
        <Box>
            <PageHeader heading={"Route Stations"} extra={<Button size={"sm"} colorScheme={"green"} onClick={() => setToggleDrawer([])}>Add Route Station</Button>} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    {true ?
                        <TableContainer mt={2}>
                            <Table w="100%" size={"sm"} variant={"simple"}>
                                <Thead>
                                    <Tr bg="gray.100">
                                        <Th>Sr No.</Th>
                                        <Th>Route</Th>
                                        <Th>Station Name</Th>
                                        <Th>Action</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {map(new Array(15), (r, index) => (
                                        <Tr>
                                            <Td>{index + 1}</Td>
                                            <Td>CineStar</Td>
                                            <Td>CineStar</Td>
                                            <Td>
                                                <Tooltip placement="top" label="Edit">
                                                    <IconButton size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={"blue"} onClick={() => setToggleDrawer({ id: 1111, class: 1, order: 1 })} />
                                                </Tooltip>
                                                <Tooltip placement="top" label="Delete">
                                                    <IconButton size={"sm"} variant={"ghost"} icon={<DeleteIcon />} colorScheme={"red"} />
                                                </Tooltip>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        :
                        <NoData title={"No Route Station Found"} />
                    }
                </Box>
                {toggleDrawer && <AddRouteStation data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} />}
            </Box>
        </Box>
    )
}