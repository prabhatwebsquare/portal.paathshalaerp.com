import CustomInput from "@/common/CustomInput"
import { LoadingContainer } from "@/common/LoadingContainer"
import { NoData } from "@/common/NoData"
import { PageHeader } from "@/common/PageHeader"
import { STATUS } from "@/constant"
import { URL } from "@/services/apis"
import { useStdFeesStore } from "@/store/stdFees"
import { AddIcon } from "@chakra-ui/icons"
import { Avatar, Box, Button, Flex, Image, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { map } from "lodash"
import { useEffect, useState } from "react"
import { AddNewCheckout } from "./Checkout"

export const RoomCheckout = ({ sessionMasterId, themeColor }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    return (
        <Box h="100%">
            <PageHeader heading={"Room Checkout"} extra={<Button size={"sm"} colorScheme={themeColor} leftIcon={<AddIcon />} onClick={() => setToggleDrawer([])}>New Checkout</Button>} />
            <Box p={5} bg={"white"} h={"100%"} className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                <TableContainer mt={5}>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>SR No.</Th>
                                <Th>Name</Th>
                                <Th>Father&apos;s Name</Th>
                                <Th>Mother&apos;s Name</Th>
                                <Th>Contact</Th>
                                <Th>Class</Th>
                                <Th>Admission No.</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {map(new Array(5), (std, index) => (
                                <Tr>
                                    <Td>{index + 1111}</Td>
                                    <Td>
                                        <Flex>
                                            <Avatar mr={3} size={"xs"} src={""} />
                                            Ashok
                                        </Flex>
                                    </Td>
                                    <Td>Shubham</Td>
                                    <Td>Mother</Td>
                                    <Td>9876543210</Td>
                                    <Td>1 - Common</Td>
                                    <Td>1111</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                {toggleDrawer && <AddNewCheckout data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} sessionMasterId={sessionMasterId} themeColor={themeColor} />}
            </Box>
        </Box>
    )
}