import { CustomSelect } from "@/common/CustomSelect"
import { LoadingContainer } from "@/common/LoadingContainer"
import { PageHeader } from "@/common/PageHeader"
import { STATUS } from "@/constant"
import { useClassSetupStore } from "@/store/classSetup"
import { useStudentStore } from "@/store/studentStore"
import { Box, Button, Flex, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { find, groupBy, map, uniqBy } from "lodash"
import { useEffect, useMemo, useState } from "react"

export const SubjectWiseStudent = ({ sessionMasterId, themeColor }) => {
    const [inputValue, setInputValue] = useState({})

    const inputHandler = (name, val) => {
        setInputValue(pre => ({ ...pre, [name]: val }))
    }

    const { getSectionAction, getSectionStatus, allSections } = useClassSetupStore(s => ({
        getSectionAction: s.getSectionAction,
        getSectionStatus: s.getSectionStatus,
        allSections: s.allSections
    }))

    const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } = useClassSetupStore(s => ({
        getClassSubjectAction: s.getClassSubjectAction,
        getClassSubjectStatus: s.getClassSubjectStatus,
        allClassSubjects: s.allClassSubjects
    }))

    const { getFilterStudentsAction, getFilterStudentsStatus, filterStudents, resetFilterStdStatus } = useStudentStore(s => ({
        getFilterStudentsAction: s.getFilterStudentsAction,
        getFilterStudentsStatus: s.getFilterStudentsStatus,
        filterStudents: s.filterStudents,
        resetFilterStdStatus: s.resetFilterStdStatus
    }))

    useEffect(() => {
        if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
            getClassSubjectAction()
        }
        if ((getSectionStatus || 1) === STATUS.NOT_STARTED) {
            getSectionAction()
        }
    }, [getClassSubjectAction, getClassSubjectStatus, getSectionAction, getSectionStatus])

    const classes = useMemo(() => {
        return groupBy(allClassSubjects, "classMasterId")
    }, [allClassSubjects])

    useEffect(() => {
        return () => resetFilterStdStatus()
    }, [resetFilterStdStatus])

    const getFilterStudent = (e) => {
        e.preventDefault()
        getFilterStudentsAction({ ...inputValue, sessionMasterId })
    }

    return (
        <Box h={"100%"}>
            <PageHeader heading={"Subject Wise Student"} />
            <Box p={5} bg={"white"} h={"90%"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <Flex justify={"space-between"}>
                        <form style={{ width: "70%" }} onSubmit={getFilterStudent}>
                            <Flex pb={3} gap={4}>
                                <CustomSelect size={"sm"} name={"classMasterId"} label={"Select Class"} inputValue={inputValue} setInputValue={setInputValue} data={
                                    map(classes, (d, key) => ({ value: key, name: d?.[0]?.class_master?.name }))
                                } />
                                <CustomSelect size={"sm"} name={"streamMasterId"} label={"Select Stream"} inputValue={inputValue} setInputValue={setInputValue} data={
                                    map(uniqBy(classes?.[inputValue?.classMasterId], "streamMasterId"), (d, index) => ({ value: d.stream_master.id, name: d.stream_master.name }))
                                } />
                                <CustomSelect size={"sm"} name={"sectionMasterId"} label={"Select Section"} inputValue={inputValue} setInputValue={setInputValue} data={
                                    map(allSections, d => ({ value: d.id, name: d.name }))
                                } />
                                <CustomSelect size={"sm"} name={"subjectMasterId"} label={"Select Subject"} inputValue={inputValue} setInputValue={setInputValue} data={
                                    map(find(allClassSubjects, sub => sub.classMasterId === parseInt(inputValue.classMasterId) && sub.streamMasterId === parseInt(inputValue?.streamMasterId))?.assign_class_subjects, d => ({ value: d?.subjectMasterId, name: d?.subject_master?.name }))
                                } />
                                <Button type="submit" size={"sm"} colorScheme={themeColor}>Get</Button>
                            </Flex>
                        </form>
                    </Flex>
                    {(getFilterStudentsStatus || 1) === STATUS.NOT_STARTED ?
                        <Flex justify={"center"} mt={7}><Text>Get Class Student First</Text></Flex>
                        :
                        <LoadingContainer status={getFilterStudentsStatus}>
                            <TableContainer>
                                <Table w="100%" size={"sm"} variant={"simple"}>
                                    <Thead>
                                        <Tr bg="gray.100">
                                            <Th>Sr No.</Th>
                                            <Th>Roll No.</Th>
                                            <Th>Name</Th>
                                            <Th>Father Name</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {map(filterStudents, (std, index) => (
                                            <Tr key={index} _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                                                <Td>{std.srNo}</Td>
                                                <Td>{std.rollNo}</Td>
                                                <Td>{std.student_master.studentName}</Td>
                                                <Td>{std.student_master.fatherName}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </LoadingContainer>
                    }
                </Box>
            </Box>
        </Box>
    )
}