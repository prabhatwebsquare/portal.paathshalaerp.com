import { Avatar, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import dayjs from "dayjs"
import { map } from "lodash"

export const ViewRTE = ({ data, closeDrawer, sessionMasterId, themeColor }) => {
    return (
        <Drawer size={"xl"} isOpen={data} onClose={closeDrawer}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader>1 - Common - A</DrawerHeader>
                <DrawerCloseButton />
                <DrawerBody>
                    <TableContainer>
                        <Table w="100%" size={"sm"} variant={"simple"}>
                            <Thead>
                                <Tr bg="gray.100">
                                    <Th>Sr ate</Th>
                                    <Th>Admission No.</Th>
                                    <Th>Admission Date</Th>
                                    <Th>Name</Th>
                                    <Th>Father Name</Th>
                                    <Th>Contact</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {map(new Array(5), (std, index) => (
                                    <Tr _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                                        <Td>{index + 1}</Td>
                                        <Td>{index + 110}</Td>
                                        <Td>{dayjs().format("DD-MM-YYYY")}</Td>
                                        <Td>
                                            <Flex align={"center"}>
                                                <Avatar mr={3} size={"xs"} src={""} />Amit
                                            </Flex>
                                        </Td>
                                        <Td>Shubham</Td>
                                        <Td>9876543210</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}