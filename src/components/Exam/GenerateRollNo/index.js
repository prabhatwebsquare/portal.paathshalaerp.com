import CustomInput from "@/common/CustomInput"
import { LoadingContainer } from "@/common/LoadingContainer"
import { PageHeader } from "@/common/PageHeader"
import { STATUS } from "@/constant"
import { useExamStore } from "@/store/Exam"
import { useClassSetupStore } from "@/store/classSetup"
import { useStudentStore } from "@/store/studentStore"
import { Box, Button, Flex, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { groupBy, map, uniqBy } from "lodash"
import { useEffect, useMemo, useRef, useState } from "react"
import { MdLocalPrintshop } from "react-icons/md"
import { useReactToPrint } from "react-to-print"
import { SchoolHeader } from "@/common/SchoolHeader"
import { CustomSelect } from "@/common/CustomSelect"

export const GenerateRollNo = ({ themeColor, sessionMasterId }) => {
    const [inputValue, setInputValue] = useState({})
    const [generate, setGenerate] = useState(false)
    const [studentData, setStudentData] = useState([]);
    const [newExcelData, setNewExcelData] = useState([]);

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

    const { assignRollNoAction, assignRollNoStatus, resetRollNoStatus } = useExamStore(s => ({
        assignRollNoAction: s.assignRollNoAction,
        assignRollNoStatus: s.assignRollNoStatus,
        resetRollNoStatus: s.resetRollNoStatus
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

    const inputHandler = (name, val) => {
        setInputValue(pre => ({ ...pre, [name]: val }))
    }

    const getFilterStudent = (e) => {
        e.preventDefault()
        getFilterStudentsAction({ ...inputValue, sessionMasterId })
    }

    useEffect(() => {
        if (filterStudents?.length) {
            const data = map(filterStudents, std => ({
                "Roll No": "",
                "Sr No": std.student_master.srNo,
                "Admission No.": std.student_master.admissionNo,
                "Student Name": std.student_master.studentName,
                "Father Name": std.student_master.fatherName,
            }))
            setStudentData(data)
        }
    }, [filterStudents])

    const assignRollNo = () => {
        assignRollNoAction({
            sessionMasterId,
            ...inputValue,
            startFrom: generate
        })
        
    }

    useEffect(() => {
        if (assignRollNoStatus === STATUS.SUCCESS) {
            resetRollNoStatus()
            resetFilterStdStatus()
            setGenerate(false)
            setStudentData([])
            setNewExcelData([])
            setInputValue({})
        }
    }, [assignRollNoStatus, resetFilterStdStatus, resetRollNoStatus])

    const [allPrintProps, setAllPrintProps] = useState(null)
    const printAllRef = useRef(null);

    const handlePrintAllClick = () => {
        setAllPrintProps(filterStudents);
    };

    const handleAllPrint = useReactToPrint({
        content: () => printAllRef.current,
        onAfterPrint: () => setAllPrintProps(null),
        onPrintError: () => setAllPrintProps(null),
    });

    useEffect(() => {
        if (allPrintProps?.length) {
            handleAllPrint();
        }
    }, [allPrintProps, handleAllPrint]);

    return (
        <Box h={"100%"}>
            <PageHeader heading={"Roll Number"} />
            <Box p={5} bg={"white"} h={"90%"}>
                <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
                    <Flex justify={"space-between"}>
                        <form style={{ width: "60%" }} onSubmit={getFilterStudent}>
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
                                <Button type="submit" size={"sm"} colorScheme={themeColor}>Get</Button>
                            </Flex>
                        </form>
                        {/* <Flex gap={3}>
                            <DownloadCSV disabled={getFilterStudentsStatus !== STATUS.SUCCESS} data={studentData} name={`${find(allClassSubjects, c => c.classMasterId === parseInt(inputValue.classMasterId))?.class_master?.name} Class Roll Number`} />
                            <UploadExcel disabled={getFilterStudentsStatus !== STATUS.SUCCESS} setExcelData={setNewExcelData} button={"Upload RollNo"} />
                        </Flex> */}
                    </Flex>
                    {(getFilterStudentsStatus || 1) === STATUS.NOT_STARTED ?
                        <Flex justify={"center"} mt={7}><Text>Get Class Student First</Text></Flex>
                        :
                        <LoadingContainer status={getFilterStudentsStatus}>
                            {filterStudents?.length ?
                                <Flex mt={3} align={"center"} justify={"space-between"}>
                                    <Flex gap={4} w={"80%"}>
                                        <CustomInput size={"sm"} w={"20.5%"} type={"number"} name="startFrom" label={"Start From"} inputValue={inputValue} setInputValue={setInputValue} />
                                        <Button size={"sm"} colorScheme={themeColor} onClick={() => setGenerate(inputValue.startFrom)}>Generate</Button>
                                    </Flex>
                                    <Flex>
                                        <Button size={"sm"} colorScheme={themeColor} onClick={handlePrintAllClick}><MdLocalPrintshop /></Button>
                                    </Flex>
                                </Flex>
                                :
                                null
                            }
                            <TableContainer mt={3}>
                                <Table w="100%" size={"sm"} variant={"simple"}>
                                    <Thead>
                                        <Tr bg="gray.100">
                                            <Th>Roll No.</Th>
                                            <Th>Sr No.</Th>
                                            <Th>Name</Th>
                                            <Th>Father Name</Th>
                                            <Th>Class</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {filterStudents?.length ?
                                            map(filterStudents, (std, index) => (
                                                <Tr key={std.id} _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                                                    <Td>{generate ? (index + parseInt(generate)) : (std.rollNo || "-")}</Td>
                                                    <Td>{std.student_master.srNo}</Td>
                                                    <Td>{std.student_master.studentName}</Td>
                                                    <Td>{std.student_master.fatherName}</Td>
                                                    <Td>{std.class_master.name} - {std.stream_master.name}</Td>
                                                </Tr>
                                            ))
                                            :
                                            <Tr>
                                                <Td colSpan={4} textAlign={"center"} fontWeight={"semibold"}>No Student Found</Td>
                                            </Tr>
                                        }
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            {filterStudents?.length ?
                                <Flex mt={3} justify={"flex-end"}>
                                    <Button size={"sm"} colorScheme={themeColor} isDisabled={generate ? false : true} isLoading={assignRollNoStatus === STATUS.FETCHING} onClick={assignRollNo}>Save</Button>
                                </Flex>
                                :
                                null
                            }
                            <Box display={"none"}>
                                {allPrintProps && allPrintProps?.length &&
                                    <Box ref={printAllRef}>
                                        <StudentData filterStudents={filterStudents} generate={generate} setAllPrintProps={setAllPrintProps} />
                                    </Box>
                                }
                            </Box>
                        </LoadingContainer>
                    }
                </Box>
            </Box>
        </Box>
    )
}

const StudentData = ({ filterStudents, generate, setAllPrintProps }) => {

    useEffect(() => {
        return () => setAllPrintProps(null)
    }, [setAllPrintProps])

    return (
        <Box p={4}>
            <SchoolHeader />
            <TableContainer mt={3}>
                <Table w="100%" size={"sm"} variant={"simple"}>
                    <Thead>
                        <Tr bg="gray.100">
                            <Th>Roll No.</Th>
                            <Th>Sr No.</Th>
                            <Th>Name</Th>
                            <Th>Father Name</Th>
                            <Th>Class</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filterStudents?.length ?
                            map(filterStudents, (std, index) => (
                                <Tr key={std.id} _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                                    <Td>{generate ? (index + parseInt(generate)) : (std.rollNo || "-")}</Td>
                                    <Td>{std.student_master.srNo}</Td>
                                    <Td>{std.student_master.studentName}</Td>
                                    <Td>{std.student_master.fatherName}</Td>
                                    <Td>{std.class_master.name} - {std.stream_master.name}</Td>
                                </Tr>
                            ))
                            :
                            <Tr>
                                <Td colSpan={4} textAlign={"center"} fontWeight={"semibold"}>No Student Found</Td>
                            </Tr>
                        }
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}