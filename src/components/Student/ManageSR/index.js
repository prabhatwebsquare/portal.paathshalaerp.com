import CustomArrayInput from "@/common/CustomArrayInput"
import CustomInput from "@/common/CustomInput"
import { HasPermission } from "@/common/HasPermission"
import { LoadingContainer } from "@/common/LoadingContainer"
import { PageHeader } from "@/common/PageHeader"
import { STATUS } from "@/constant"
import { PERMISSIONS } from "@/constant/PermissionConstant"
import { BASE_URL, URL } from "@/services/apis"
import { useAdditionalSetupStore } from "@/store/additionalSetup"
import { useClassSetupStore } from "@/store/classSetup"
import { useStdFeesStore } from "@/store/stdFees"
import { useStudentStore } from "@/store/studentStore"
import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import { Avatar, Badge, Box, Button, Flex, FormControl, IconButton, Image, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import dayjs from "dayjs"
import { cloneDeep, filter, find, groupBy, map, uniqBy } from "lodash"
import { useRouter } from "next/router"
import React, { useEffect, useMemo, useState } from "react"

export const ManageSR = ({ themeColor, sessionMasterId }) => {
    const router = useRouter()
    const [srRows, setSrRows] = useState([{}])
    const [searchInput, setSearchInput] = useState({})

    const { getSessionAction, getSessionStatus, allSessions } = useAdditionalSetupStore(s => ({
        getSessionAction: s.getSessionAction,
        getSessionStatus: s.getSessionStatus,
        allSessions: s.allSessions
    }))

    const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } = useClassSetupStore(s => ({
        getClassSubjectAction: s.getClassSubjectAction,
        getClassSubjectStatus: s.getClassSubjectStatus,
        allClassSubjects: s.allClassSubjects,
    }))

    const { searchStudentAction, searchStudentStatus, searchStd, resetSearch,
    } = useStdFeesStore(s => ({
        searchStudentAction: s.searchStudentAction,
        searchStudentStatus: s.searchStudentStatus,
        searchStd: s.searchStd,
        resetSearch: s.resetSearch,
    }))

    const { getStudentSRAction, getStudentSRStatus, studentSR, resetGetSRStatus, updateSrAction, updateSrStatus, resetSRStatus } = useStudentStore(s => ({
        getStudentSRAction: s.getStudentSRAction,
        getStudentSRStatus: s.getStudentSRStatus,
        studentSR: s.studentSR,
        resetGetSRStatus: s.resetGetSRStatus,
        updateSrAction: s.updateSrAction,
        updateSrStatus: s.updateSrStatus,
        resetSRStatus: s.resetSRStatus
    }))

    useEffect(() => {
        if ((getSessionStatus || 1) === STATUS.NOT_STARTED) {
            getSessionAction()
        }
        if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
            getClassSubjectAction()
        }
    }, [getClassSubjectAction, getClassSubjectStatus, getSessionAction, getSessionStatus])

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
        setSearchInput({ filters: '' })
        resetSearch()
        getStudentSRAction(std)
    }

    useEffect(() => {
        if (router.query.id && (getStudentSRStatus || 1) === STATUS.NOT_STARTED) {
            getStudentSRAction(router.query.id)
        }
    }, [getStudentSRAction, getStudentSRStatus, router.query.id])

    useEffect(() => {
        return () => resetGetSRStatus()
    }, [resetGetSRStatus])

    useEffect(() => {
        if (studentSR?.data?.length) {
            setSrRows(map(studentSR?.data, sr => ({
                sessionMasterId: sr.sessionMasterId,
                classMasterId: sr.classMasterId,
                streamMasterId: sr.streamMasterId,
                admissionDate: dayjs(sr.admissionDate).format("YYYY-MM-DD"),
                resultDate: dayjs(sr.resultDate).format("YYYY-MM-DD"),
                workingDays: sr.workingDays,
                present: sr.present,
                student: sr.student,
                result: sr.result,
                conduct: sr.conduct,
            })))
        }
    }, [studentSR])

    const classes = useMemo(() => {
        return groupBy(allClassSubjects, "classMasterId")
    }, [allClassSubjects])

    const srInput = (name, val, index) => {
        setSrRows(prevState => {
            const updatedArray = [...prevState];
            updatedArray[index] = {
                ...updatedArray[index],
                [name]: val
            };
            return updatedArray;
        });

    }

    const deleteSrArray = (index) => {
        const newData = cloneDeep(srRows);
        newData.splice(index, 1);
        setSrRows(newData);
    };


    const saveSR = (e) => {
        e.preventDefault()
        const id = router.query.id ? router.query.id : studentSR.studentMaster?.id
        const data = map(srRows, sr => ({ ...sr, admissionNo: studentSR.studentMaster?.admissionNo, srNo: studentSR.studentMaster.srNo, studentMasterId: studentSR.studentMaster?.id }))
        updateSrAction({ id, data: { data } })
    }

    useEffect(() => {
        if (updateSrStatus === STATUS.SUCCESS) {
            resetSRStatus()
            if (router.query.id) {
                router.push("/student/sr-list")
            }
            else {
                setSrRows([{}])
            }
        }
    }, [resetSRStatus, router, updateSrStatus])
    return (
        <Box h="100%">
            <PageHeader heading={"Manage S.R."} />
            <Box p={5} bg={"white"} h={"90%"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"} pt={2}>
                    {/* {router.query.id ?
                        studentSR ?
                            <Flex my={3} p={2} bg={`${themeColor}.50`} border={"1px solid"} borderColor={"gray.200"} borderRadius={10}>
                                <Box w={"50%"} fontSize={13} fontWeight={"semibold"}>
                                    <Flex w={"70%"}>
                                        <Text w={"50%"}>Name</Text>
                                        <Text>: &nbsp;{studentSR.studentMaster?.studentName}</Text>
                                    </Flex>
                                    <Flex w={"70%"}>
                                        <Text w={"50%"}>Father&apos;s Name</Text>
                                        <Text>: &nbsp;{studentSR.studentMaster?.fatherName}</Text>
                                    </Flex>
                                    <Flex w={"70%"}>
                                        <Text w={"50%"}>Contact </Text>
                                        <Text>: &nbsp;{studentSR.studentMaster?.fatherContact}</Text>
                                    </Flex>
                                </Box>
                                <Box w={"50%"} fontSize={13} fontWeight={"semibold"}>
                                    <Flex w={"70%"}>
                                        <Text w={"50%"}>SR No.</Text>
                                        <Text>: &nbsp;{studentSR.studentMaster?.srNo}</Text>
                                    </Flex>
                                    <Flex w={"70%"}>
                                        <Text w={"50%"}>Admission No</Text>
                                        <Text>: &nbsp;{studentSR.studentMaster?.admissionNo}</Text>
                                    </Flex>
                                </Box>
                            </Flex>
                            :
                            null
                        :
                        <> */}
                    <CustomInput type={"text"} search={true} name="filters" label={"Search Student"} autoFocus={true} inputValue={searchInput} setInputValue={handleSearchInput} />
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
                                                        onClick={() => selectStudent(std.student_master.id)}
                                                    >
                                                        <Flex align={"center"}>
                                                            <Avatar mr={3} size={"xs"} src={`${URL}${std.student_master.photo}`} />
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
                            {studentSR ?
                                <Flex my={3} p={2} bg={`${themeColor}.50`} border={"1px solid"} borderColor={"gray.200"} borderRadius={10}>
                                    <Box w={"20%"}>
                                        <Image h={"70px"} src={`${URL}${studentSR.studentMaster?.photo}`} alt={"Profile"} />
                                    </Box>
                                    <Box w={"40%"} fontSize={13} fontWeight={"semibold"}>
                                        <Flex w={"70%"}>
                                            <Text w={"50%"}>Name</Text>
                                            <Text>: &nbsp;{studentSR.studentMaster?.studentName}</Text>
                                        </Flex>
                                        <Flex w={"70%"}>
                                            <Text w={"50%"}>Father&apos;s Name</Text>
                                            <Text>: &nbsp;{studentSR.studentMaster?.fatherName}</Text>
                                        </Flex>
                                        <Flex w={"70%"}>
                                            <Text w={"50%"}>Contact </Text>
                                            <Text>: &nbsp;{studentSR.studentMaster?.fatherContact}</Text>
                                        </Flex>
                                    </Box>
                                    <Box w={"40%"} fontSize={13} fontWeight={"semibold"}>
                                        <Flex w={"70%"}>
                                            <Text w={"50%"}>SR No.</Text>
                                            <Text>: &nbsp;{studentSR.studentMaster?.srNo}</Text>
                                        </Flex>
                                        <Flex w={"70%"}>
                                            <Text w={"50%"}>Admission No</Text>
                                            <Text>: &nbsp;{studentSR.studentMaster?.admissionNo}</Text>
                                        </Flex>
                                    </Box>
                                </Flex>
                                :
                                null
                            }
                        </Box>
                    </LoadingContainer>
                    {/* </>
                    } */}
                    <LoadingContainer status={getSessionStatus}>
                        {studentSR ?
                            <form onSubmit={saveSR}>
                                <TableContainer>
                                    <Table mt={3} w="100%" size={"sm"} variant={"simple"}>
                                        <Thead>
                                            <Tr bg="gray.100">
                                                <Th w={"40%"}>Session</Th>
                                                <Th w={"40%"}>Class</Th>
                                                <Th w={"40%"}>Strean</Th>
                                                <Th w={"40%"}>Admission Date</Th>
                                                <Th w={"40%"}>Result Date</Th>
                                                <Th w={"40%"}>Working Days</Th>
                                                <Th w={"40%"}>Presents</Th>
                                                <Th w={"40%"}>Students</Th>
                                                <Th w={"40%"}>Result</Th>
                                                <Th w={"40%"}>Conduct</Th>
                                                <Th w={"40%"}>Action</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {map(srRows, (sr, index) => (
                                                <Tr key={index}>
                                                    <Td>
                                                        <FormControl isRequired>
                                                            <Select size={"sm"} fontWeight={"semibold"} focusBorderColor={`${themeColor}.400`} placeholder="Select Session"
                                                                value={sr?.sessionMasterId || ''}
                                                                onChange={(e) => srInput("sessionMasterId", parseInt(e.target.value), index)}>
                                                                {map(allSessions, session => (
                                                                    <option key={session.id} value={session.id}>{session.name}</option>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Td>
                                                    <Td>
                                                        <FormControl isRequired>
                                                            <Select
                                                                size={"sm"}
                                                                isRequired
                                                                fontSize={13}
                                                                fontWeight={"semibold"}
                                                                focusBorderColor={`${themeColor}.400`}
                                                                placeholder="Select Class"
                                                                value={sr?.classMasterId}
                                                                onChange={(e) => srInput("classMasterId", e.target.value, index)}
                                                            >
                                                                {map(classes, (d, key) => (
                                                                    <option value={key}>{d?.[0]?.class_master?.name}</option>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Td>
                                                    <Td>
                                                        <FormControl isRequired>
                                                            <Select
                                                                size={"sm"}
                                                                fontSize={13}
                                                                fontWeight={"semibold"}
                                                                focusBorderColor={`${themeColor}.400`}
                                                                placeholder="Select Stream"
                                                                value={sr?.streamMasterId}
                                                                onChange={(e) => srInput("streamMasterId", e.target.value, index)}
                                                            >
                                                                {map(uniqBy(classes?.[sr?.classMasterId], "streamMasterId"), (d, index) => (
                                                                    <option value={d.stream_master.id}>{d.stream_master.name}</option>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Td>
                                                    <Td>
                                                        <FormControl isRequired>
                                                            <CustomArrayInput size={"sm"} type={"date"} index={index} name="admissionDate" label={"Admission Date"} inputValue={sr} setInputValue={setSrRows} />
                                                        </FormControl>
                                                    </Td>
                                                    <Td>
                                                        <FormControl isRequired>
                                                            <CustomArrayInput size={"sm"} type={"date"} index={index} name="resultDate" label={"Result Date"} inputValue={sr} setInputValue={setSrRows} />
                                                        </FormControl>
                                                    </Td>
                                                    <Td>
                                                        <FormControl isRequired>
                                                            <CustomArrayInput size={"sm"} type={"number"} index={index} name="workingDays" label={"Working Days"} inputValue={sr} setInputValue={setSrRows} />
                                                        </FormControl>
                                                    </Td>
                                                    <Td>
                                                        <FormControl isRequired>
                                                            <CustomArrayInput size={"sm"} type={"number"} index={index} name="present" label={"Presents"} inputValue={sr} setInputValue={setSrRows} />
                                                        </FormControl>
                                                    </Td>
                                                    <Td>
                                                        <FormControl isRequired>
                                                            <CustomArrayInput size={"sm"} type={"number"} index={index} name="student" label={"Total Student"} inputValue={sr} setInputValue={setSrRows} />
                                                        </FormControl>
                                                    </Td>
                                                    <Td>
                                                        <FormControl isRequired>
                                                            <CustomArrayInput size={"sm"} type={"text"} index={index} name="result" label={"Result"} inputValue={sr} setInputValue={setSrRows} />
                                                        </FormControl>
                                                    </Td>
                                                    <Td>
                                                        <CustomArrayInput size={"sm"} type={"text"} index={index} name="conduct" label={"Conduct"} inputValue={sr} setInputValue={setSrRows} />
                                                    </Td>
                                                    <Td>
                                                        <IconButton size={"xs"} variant={"ghost"} colorScheme={"red"} onClick={() => deleteSrArray(index)} icon={<DeleteIcon />} />
                                                    </Td>
                                                </Tr>
                                            ))}
                                            {HasPermission(PERMISSIONS.MANAGE_SR_ADD) &&
                                                <Tr>
                                                    <Td colSpan={11} textAlign={"center"}><Button variant={"ghost"} colorScheme={"green"} leftIcon={<AddIcon />} onClick={() => setSrRows(pre => ([...pre, {}]))}>Add More</Button></Td>
                                                </Tr>
                                            }
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                                {(HasPermission(PERMISSIONS.MANAGE_SR_ADD) || HasPermission(PERMISSIONS.MANAGE_SR_EDIT)) &&
                                    <Flex mt={7} justify={"flex-end"}>
                                        <Button ml={4} size={"sm"} type="submit" colorScheme={themeColor}>Save</Button>
                                    </Flex>
                                }
                            </form>
                            :
                            null
                        }
                    </LoadingContainer>
                </Box>
            </Box>
        </Box >
    )
}