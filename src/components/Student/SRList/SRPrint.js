import { SchoolHeader } from "@/common/SchoolHeader"
import { Box, Flex, Table, Tbody, Td, Text, Tr } from "@chakra-ui/react"
import { useEffect } from "react"

export const SRPrint = ({ data, setPrintProps }) => {

    useEffect(() => {
        return () => setPrintProps(null)
    }, [setPrintProps])

    return (
        <Box p={5}>
            <Flex flexDir={"column"} h="fit-content">
                <SchoolHeader title={"Scholar Report"} />
                <Flex py={1} fontSize={14} fontWeight={"semibold"} justify={"center"} border={"1px solid"} borderColor={"gray.200"} align={"center"}>
                    <Text w={"33%"}>SCHOLAR REGISTER: 111</Text>
                    <Text w={"33%"} textAlign={"center"}>Record (A)</Text>
                    <Text w={"33%"} textAlign={"center"}></Text>
                </Flex>
                <Table>
                    <Tbody>
                        <Tr>
                            <Td style={{ padding: 1, textAlign: "center" }}>Date of Admission</Td>
                            <Td style={{ padding: 1, textAlign: "center" }}>Date of Removal</Td>
                            <Td style={{ padding: 1, textAlign: "center" }}>Cause of Removal</Td>
                        </Tr>
                        <Tr>
                            <Td></Td>
                            <Td></Td>
                            <Td></Td>
                        </Tr>
                        <Tr>
                            <Td></Td>
                            <Td></Td>
                            <Td></Td>
                        </Tr>
                    </Tbody>
                </Table>
                <Flex fontSize={14} fontWeight={"semibold"} justify={"center"} border={"1px solid"} borderColor={"gray.200"} align={"center"}> Record (B)</Flex>
                <Box>
                    <Flex>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    )
}