import CustomInput from "@/common/CustomInput"
import { LoadingContainer } from "@/common/LoadingContainer"
import { NoData } from "@/common/NoData"
import { PageHeader } from "@/common/PageHeader"
import { STATUS } from "@/constant"
import { URL } from "@/services/apis"
import { useStdFeesStore } from "@/store/stdFees"
import { AddIcon, EditIcon } from "@chakra-ui/icons"
import { Avatar, Box, Button, Flex, IconButton, Image, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react"
import { map } from "lodash"
import { useEffect, useState } from "react"
import { FaHandshake } from "react-icons/fa6"
import { AddMember } from "./AddMember"

export const FamilyMeet = ({ sessionMasterId, themeColor }) => {
    const [inputValue, setInputValue] = useState({})
    const [toggleDrawer, setToggleDrawer] = useState(null)

    const [searchInput, setSearchInput] = useState({})
    const [selectedStudent, setSelectedStudent] = useState(null)

    const inputHandler = (name, val) => {
        setInputValue(pre => ({ ...pre, [name]: val }))
    }

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
            <PageHeader heading={"Family Meet"} />
            <Box p={5} bg={"white"} h={"75vh"} className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                <CustomInput type={"text"} search={true} name="filters" label={"Search Student"} inputValue={searchInput} setInputValue={handleSearchInput} />
                {(searchStudentStatus === STATUS.NOT_STARTED && !searchStd?.length && !selectedStudent) ?
                    <Flex mt={5} w={"100%"} align={"center"} flexDir={"column"}>
                        <Image h="300px" src="/assets/student.png" alt="Search Student" />
                        <Text fontSize={18} fontWeight={"semibold"}>Search Student</Text>
                    </Flex>
                    :
                    null
                }
                <LoadingContainer status={searchStudentStatus}>
                    <Box>
                        {searchStd?.length ?
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
                                                        <Avatar mr={3} size={"xs"} src={`${URL}${std.student_master.photo}`} />
                                                        {std.student_master.studentName}
                                                    </Flex>
                                                </Td>
                                                <Td>{std.student_master.fatherName}</Td>
                                                <Td>{std.student_master.motherName}</Td>
                                                <Td>{std.student_master.fatherContact}</Td>
                                                <Td>{std.class_master.name} - {std.stream_master.name}</Td>
                                                <Td>{std.student_master.admissionNo}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            :
                            searchStudentStatus === STATUS.SUCCESS ?
                                <NoData title={"No Student Found"} />
                                :
                                null
                        }
                        {selectedStudent ?
                            <Box>
                                <Flex mt={2} w={"100%"} p={2} bg={`${themeColor}.50`} border={"1px solid"} borderColor={"gray.200"} borderRadius={10}>
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
                                    {/* {toggleViewSibling && <ViewSiblings id={toggleViewSibling} closeModal={() => setToggleViewSibling(null)} themeColor={themeColor} selectSibling={selectSibling} />} */}
                                </Flex>
                                <Flex mt={4} align={"center"} justify={"space-between"}>
                                    <Text fontWeight={"semibold"}>Family Members</Text>
                                    <Button size={"sm"} colorScheme={themeColor} leftIcon={<AddIcon />} onClick={() => setToggleDrawer([])}>Add Member</Button>
                                </Flex>
                                <Table mt={2}>
                                    <Thead>
                                        <Tr>
                                            <Th>Name</Th>
                                            <Th>Contact</Th>
                                            <Th>Address</Th>
                                            <Th>Relation</Th>
                                            <Th>Aadhar No</Th>
                                            <Th>Action</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {map(new Array(4), (a, i) => (
                                            <Tr>
                                                <Td>
                                                    <Flex align={"center"}>
                                                        <Avatar mr={3} size={"xs"} src={""} />
                                                        Sourav
                                                    </Flex>
                                                </Td>
                                                <Td>9876543210</Td>
                                                <Td>Jaipur, Rajasthan</Td>
                                                <Td>Brother</Td>
                                                <Td>946154582318</Td>
                                                <Td>
                                                    <Tooltip placement="top" label={"Meet"}>
                                                        <IconButton size={"xs"} variant={"ghost"} colorScheme={themeColor} icon={<FaHandshake fontSize={18} />} />
                                                    </Tooltip>
                                                    <Tooltip placement="top" label={"Edit"}>
                                                        <IconButton ml={2} size={"xs"} variant={"ghost"} colorScheme={themeColor} icon={<EditIcon fontSize={14} />} />
                                                    </Tooltip>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                                {toggleDrawer && <AddMember data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} themeColor={themeColor} />}

                            </Box>
                            :
                            null
                        }
                    </Box>
                </LoadingContainer>
            </Box>
        </Box>
    )
}