import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Checkbox, Flex, Select, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import CustomTextarea from "@/common/CustomTextarea";
import { SendNotification } from "./SendNotification";

export const RouteWiseStudentSMS = () => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    const [inputValue, setInputValue] = useState({})

    const inputHandler = (name, val) => {
        setInputValue(pre => ({ ...pre, [name]: val }))
    }
    return (
        <Box>
            <PageHeader heading={"Route Wise Student SMS"} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <Flex w={"100%"} justify={"space-between"}>
                        <Flex gap={4}>
                            <Select
                                size="sm"
                                isRequired
                                fontSize={13}
                                fontWeight={"semibold"}
                                focusBorderColor='green.400'
                                placeholder="Select Route"
                                value={inputValue?.Route}
                                onChange={(e) => inputHandler("Route", e.target.value)}
                            >
                                {map(new Array(4), (d, index) => (
                                    <option value={"Route" + (index + 1)}>Route{index + 1}</option>
                                ))}
                            </Select>
                            <Button size={"sm"} colorScheme={"green"}>Get</Button>
                        </Flex>
                        <Button size={"sm"} colorScheme={"green"} onClick={() => setToggleDrawer([])}>Send Notification</Button>
                    </Flex>
                    <TableContainer mt={2}>
                        <Table w="100%" size={"sm"} variant={"simple"}>
                            <Thead>
                                <Tr bg="gray.100">
                                    <Th><Checkbox /></Th>
                                    <Th>Student Name</Th>
                                    <Th>Father&apos; Name</Th>
                                    <Th>Contact</Th>
                                    <Th>Class</Th>
                                    <Th>Stream</Th>
                                    <Th>Section</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {map(new Array(5), (r, index) => (
                                    <Tr>
                                        <Td><Checkbox /></Td>
                                        <Td>Manish</Td>
                                        <Td>Rajesh</Td>
                                        <Td>9834398534</Td>
                                        <Td>10</Td>
                                        <Td>Science</Td>
                                        <Td>A</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                    {toggleDrawer && <SendNotification data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} />}
                </Box>
            </Box>
        </Box>
    )
}