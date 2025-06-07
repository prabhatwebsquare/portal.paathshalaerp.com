import { Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"

export const DefaultersReport = () => {
    return (
        <Box w={"49%"} border={"1px solid"} borderColor={"gray.200"}>
            <Text p={2} fontSize={16} fontWeight={"semibold"}>Defaulters Report</Text>
            <Flex className="scrollBar" maxH={"90%"} borderTop={"1px solid"} borderColor={"gray.200"} px={2} py={5} overflowY={"scroll"}>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Father&apos;s Name</Th>
                            <Th>Contact</Th>
                            <Th>Pending Fees</Th>
                            <Th>Due Date</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>Name</Td>
                            <Td>Father&apos;s Name</Td>
                            <Td>Contact</Td>
                            <Td>Pending Fees</Td>
                            <Td>Due Date</Td>
                            <Td>Action</Td>
                        </Tr>
                        <Tr>
                            <Td>Name</Td>
                            <Td>Father&apos;s Name</Td>
                            <Td>Contact</Td>
                            <Td>Pending Fees</Td>
                            <Td>Due Date</Td>
                            <Td>Action</Td>
                        </Tr>
                        <Tr>
                            <Td>Name</Td>
                            <Td>Father&apos;s Name</Td>
                            <Td>Contact</Td>
                            <Td>Pending Fees</Td>
                            <Td>Due Date</Td>
                            <Td>Action</Td>
                        </Tr>
                        <Tr>
                            <Td>Name</Td>
                            <Td>Father&apos;s Name</Td>
                            <Td>Contact</Td>
                            <Td>Pending Fees</Td>
                            <Td>Due Date</Td>
                            <Td>Action</Td>
                        </Tr>
                        <Tr>
                            <Td>Name</Td>
                            <Td>Father&apos;s Name</Td>
                            <Td>Contact</Td>
                            <Td>Pending Fees</Td>
                            <Td>Due Date</Td>
                            <Td>Action</Td>
                        </Tr>
                        <Tr>
                            <Td>Name</Td>
                            <Td>Father&apos;s Name</Td>
                            <Td>Contact</Td>
                            <Td>Pending Fees</Td>
                            <Td>Due Date</Td>
                            <Td>Action</Td>
                        </Tr>
                        <Tr>
                            <Td>Name</Td>
                            <Td>Father&apos;s Name</Td>
                            <Td>Contact</Td>
                            <Td>Pending Fees</Td>
                            <Td>Due Date</Td>
                            <Td>Action</Td>
                        </Tr>
                        <Tr>
                            <Td>Name</Td>
                            <Td>Father&apos;s Name</Td>
                            <Td>Contact</Td>
                            <Td>Pending Fees</Td>
                            <Td>Due Date</Td>
                            <Td>Action</Td>
                        </Tr>
                        <Tr>
                            <Td>Name</Td>
                            <Td>Father&apos;s Name</Td>
                            <Td>Contact</Td>
                            <Td>Pending Fees</Td>
                            <Td>Due Date</Td>
                            <Td>Action</Td>
                        </Tr>
                        <Tr>
                            <Td>Name</Td>
                            <Td>Father&apos;s Name</Td>
                            <Td>Contact</Td>
                            <Td>Pending Fees</Td>
                            <Td>Due Date</Td>
                            <Td>Action</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </Flex>
        </Box>
    )
}