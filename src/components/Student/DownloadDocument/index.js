import CustomInput from "@/common/CustomInput"
import { LoadingContainer } from "@/common/LoadingContainer"
import { PageHeader } from "@/common/PageHeader"
import { URL } from "@/services/apis"
import { useStdFeesStore } from "@/store/stdFees"
import { DownloadIcon } from "@chakra-ui/icons"
import { Avatar, Box, Button, Flex, IconButton, Image, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr, VStack } from "@chakra-ui/react"
import { map } from "lodash"
import { useEffect, useState } from "react"

export const DownloadDocument = ({ sessionMasterId, themeColor }) => {

    const [inputValue, setInputValue] = useState({})
    const [searchInput, setSearchInput] = useState({})
    const [selectedStudent, setSelectedStudent] = useState(null)

    const { searchStudentAction, searchStudentStatus, searchStd, resetSearch,
    } = useStdFeesStore(s => ({
        searchStudentAction: s.searchStudentAction,
        searchStudentStatus: s.searchStudentStatus,
        searchStd: s.searchStd,
        resetSearch: s.resetSearch,
    }))

    const handleSearchInput = (val) => {
        setSearchInput({ filters: val })
        if (val?.length >= 1) {
            searchStudentAction({
                sessionMasterId,
                search: val
            })
        }
    }

    const selectStudent = (std) => {
        resetSearch()
        setSelectedStudent(std)
    }

    useEffect(() => {
        return () => resetSearch()
    }, [resetSearch])

    return (
        <Box h="100%">
            <PageHeader heading={"Download Documents"} />
            <Box p={5} bg={"white"} h={"90%"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"} pt={2}>
                    <CustomInput type={"text"} search={true} notRequire={true} name="filters" label={"Search Student"} autoFocus={true} inputValue={searchInput} setInputValue={handleSearchInput} />
                    <LoadingContainer status={searchStudentStatus}>
                        <Box w={"100%"}>
                            {searchStd?.length ?
                                <TableContainer mt={5}>
                                    <Table>
                                        <Thead>
                                            <Tr>
                                                <Th>SR No.</Th>
                                                <Th>Name</Th>
                                                <Th>Father&apos;s Name</Th>
                                                <Th>Contact</Th>
                                                <Th>Class</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {map(searchStd, std => (

                                                <Tr>
                                                    <Td>{std.student_master.srNo}</Td>
                                                    <Td
                                                        color={"blue.400"}
                                                        fontWeight={"semibold"}
                                                        cursor={"pointer"}
                                                        onClick={() => selectStudent(std)}
                                                    >
                                                        <Flex>
                                                            <Avatar mr={3} size={"xs"} src={std.student_master.photo} />
                                                            {std.student_master.studentName}
                                                        </Flex>
                                                    </Td>
                                                    <Td>{std.student_master.fatherName}</Td>
                                                    <Td>{std.student_master.fatherContact}</Td>
                                                    <Td>{std.class_master.name} - {std.stream_master.name}</Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                                :
                                null
                            }
                            {selectedStudent ?
                                <Flex mt={3} flexWrap={"wrap"} gap={3}>
                                    <Flex w={"100%"} p={2} bg={`${themeColor}.50`} border={"1px solid"} borderColor={"gray.200"} borderRadius={10}>
                                        <Box w={"15%"}>
                                            <Image h={"70px"} src={`${URL}${selectedStudent.student_master?.photo}`} alt={"Profile"} />
                                        </Box>
                                        <Box w={"60%"} fontSize={13} fontWeight={"semibold"}>
                                            <Flex w={"100%"}>
                                                <Text w={"35%"}>Name</Text>
                                                <Text>: &nbsp;{selectedStudent.student_master?.studentName}</Text>
                                            </Flex>
                                            <Flex w={"100%"}>
                                                <Text w={"35%"}>Father&apos;s Name</Text>
                                                <Text>: &nbsp;{selectedStudent.student_master?.fatherName}</Text>
                                            </Flex>
                                            <Flex w={"100%"}>
                                                <Text w={"35%"}>Contact </Text>
                                                <Text>: &nbsp;{selectedStudent.student_master?.fatherContact}</Text>
                                            </Flex>
                                        </Box>
                                        <Box w={"40%"} fontSize={13} fontWeight={"semibold"}>
                                            <Flex w={"90%"}>
                                                <Text w={"40%"}>Class</Text>
                                                <Text>: &nbsp;{selectedStudent.class_master?.name}</Text>
                                            </Flex>
                                            <Flex w={"90%"}>
                                                <Text w={"40%"}>Stream</Text>
                                                <Text>: &nbsp;{selectedStudent.stream_master?.name}</Text>
                                            </Flex>
                                        </Box>
                                    </Flex>
                                    <DownloadFile name={"Aadhar Card"} themeColor={themeColor} url={"https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf"} />
                                    <DownloadFile name={"Aadhar Card"} themeColor={themeColor} url={"https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf"} />
                                    <DownloadFile name={"Aadhar Card"} themeColor={themeColor} url={"https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf"} />
                                    <DownloadFile name={"Aadhar Card"} themeColor={themeColor} url={"https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf"} />
                                </Flex>
                                :
                                null
                            }
                        </Box>
                    </LoadingContainer>
                </Box>
            </Box>
        </Box>
    )
}

const DownloadFile = ({ name, url, themeColor }) => {
    return (

        <Box w={"23%"} border={"1px solid"} borderColor={"gray.200"} borderRadius={10} align={"center"}>
            <Image m={5} w={"70%"} h={"100px"} src="/assets/file.png" alt={""} />
            <Flex px={4} py={1} align={"center"} justify={"space-between"} border={"1px solid"} borderColor={"gray.200"}>
                <Text fontWeight={"semibold"} color={`${themeColor}.700`}>{name}</Text>
                <Tooltip placement="top" label="Download File">
                    <IconButton variant={"ghost"} icon={<DownloadIcon />} colorScheme={themeColor} onClick={() => window.open(url)} />
                </Tooltip>
            </Flex>
        </Box>
    )
}