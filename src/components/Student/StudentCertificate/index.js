import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import { useStudentStore } from "@/store/studentStore"
import { Box, Table, TableContainer, Tbody, Td, Th, Thead, Text, Tr, Button, Checkbox, Flex, Menu, MenuButton, MenuList, MenuOptionGroup, MenuItemOption } from "@chakra-ui/react";
import { find, findIndex, groupBy, intersectionBy, map, uniqBy } from "lodash"
import { useEffect, useMemo, useRef, useState } from "react";
import { CustomSelect } from "@/common/CustomSelect";
import { LoadingContainer } from "@/common/LoadingContainer"
import { useReactToPrint } from "react-to-print";
import { CertificateTemplate } from "./CertificateTemplate";
import { useRouter } from "next/router";

export const StudentCertificate = ({ themeColor, sessionMasterId }) => {
    const router = useRouter()
    const [inputValue, setInputValue] = useState({})
    const [selectedStudent, setSelectedStudent] = useState([])
    const [toggleTemplate, setToggleTemplate] = useState(null)
    const [toggleModal, setToggleModal] = useState(null)

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

    useEffect(() => {
        return () => resetFilterStdStatus()
    }, [resetFilterStdStatus])

    const classes = useMemo(() => {
        return groupBy(allClassSubjects, "classMasterId")
    }, [allClassSubjects])

    const getFilterStudent = (e) => {
        e.preventDefault()
        getFilterStudentsAction({ ...inputValue, sessionMasterId })
    }

    const selectAllStd = () => {
        if (selectedStudent?.length === filterStudents?.length) {
            setSelectedStudent([])
        }
        else {
            setSelectedStudent(map(filterStudents, s => ({ id: s.id })))
        }
    }

    const handleCheck = (id) => {
        if (findIndex(selectedStudent, s => s.id === id) !== -1) {
            setSelectedStudent(filter(selectedStudent, s => s.id !== id))
        }
        else {
            setSelectedStudent([...selectedStudent, { id }])
        }
    }

    const [allPrintProps, setAllPrintProps] = useState(null)
    const printAllRef = useRef(null);

    const handlePrintClick = () => {
        const temp = intersectionBy(filterStudents, selectedStudent, "id")
        setAllPrintProps(temp);
    };

    const handleAllPrint = useReactToPrint({
        content: () => printAllRef.current,
        onAfterPrint: () => setAllPrintProps(null),
        onPrintError: () => setAllPrintProps(null),
        pageStyle: `
        @page {
            size: landscape;
          }
        `,
    });

    useEffect(() => {
        if (allPrintProps?.length) {
            handleAllPrint();
        }
    }, [allPrintProps, handleAllPrint]);

    return (
        <Box h={"100%"}>
            <PageHeader heading={"Student Certificate"} />
            <Box p={5} bg={"white"} h={"90%"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <Flex justify={"space-between"}>
                        <form style={{ width: "80%" }} onSubmit={getFilterStudent}>
                            <Flex w={"80%"} pb={3} gap={4}>
                                <CustomSelect w={"23%"} size={"sm"} name={"classMasterId"} label={"Select Class"} inputValue={inputValue} setInputValue={setInputValue} data={
                                    map(classes, (d, key) => ({ value: key, name: d?.[0]?.class_master?.name }))
                                } />
                                <CustomSelect w={"23%"} size={"sm"} name={"streamMasterId"} label={"Select Stream"} inputValue={inputValue} setInputValue={setInputValue} data={
                                    map(uniqBy(classes?.[inputValue?.classMasterId], "streamMasterId"), (d, index) => ({ value: d.stream_master.id, name: d.stream_master.name }))
                                } />
                                <CustomSelect w={"23%"} size={"sm"} name={"sectionMasterId"} label={"Select Section"} inputValue={inputValue} setInputValue={setInputValue} data={[
                                    { value: "all", name: "All Section" },
                                    ...map(allSections, d => ({ value: d.id, name: d.name }))
                                ]} />
                                {/* <CustomSelect w={"23%"} size={"sm"} name={"certificate"} label={"Select Certificate"} inputValue={inputValue} setInputValue={setInputValue} data={[
                                    { value: "all", name: "All Section" },
                                    ...map(allSections, d => ({ value: d.id, name: d.name }))
                                ]} /> */}
                                <Button type="submit" size={"sm"} colorScheme={themeColor}>Get</Button>
                            </Flex>
                        </form>
                        <Button px={4} size={"sm"} colorScheme={themeColor} isDisabled={selectedStudent?.length ? false : true} onClick={handlePrintClick}>Print</Button>
                    </Flex>
                    {(getFilterStudentsStatus || 1) === STATUS.NOT_STARTED ?
                        <Flex justify={"center"} mt={7}><Text>Get Class Student First</Text></Flex>
                        :
                        <LoadingContainer status={getFilterStudentsStatus}>
                            <Flex my={3} h={"150px"} gap={5}>
                                <Flex w={"25%"} bg={"gray.100"} borderRadius={10} />
                                <Box>
                                    <Text fontSize={18} fontWeight={"semibold"}>Birth Certificate</Text>
                                    <Flex mt={4}>
                                        <Button size={"sm"} colorScheme={themeColor} onClick={() => setToggleTemplate([])}>Change Template</Button>
                                        <Button size={"sm"} ml={2} variant={"outline"} colorScheme={themeColor} onClick={() => router.push("/student/certificate/create-template")}>Edit Template</Button>
                                    </Flex>
                                </Box>
                            </Flex>
                            <TableContainer>
                                <Table w="100%" size={"sm"} variant={"simple"}>
                                    <Thead>
                                        <Tr bg="gray.100">
                                            <Th><Checkbox colorScheme={themeColor} isChecked={selectedStudent?.length === filterStudents?.length ? true : false} onChange={selectAllStd} /></Th>
                                            <Th>Sr No.</Th>
                                            <Th>Roll No.</Th>
                                            <Th>Name</Th>
                                            <Th>Father Name</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {map(filterStudents, (std, index) => {
                                            const isChecked = findIndex(selectedStudent, s => s.id === std.id) !== -1 ? true : false
                                            return (
                                                <Tr key={index} _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                                                    <Td><Checkbox colorScheme={themeColor} isChecked={isChecked} onChange={() => handleCheck(std.id)} /></Td>
                                                    <Td>{std.srNo}</Td>
                                                    <Td>{std.rollNo}</Td>
                                                    <Td>{std.student_master.studentName}</Td>
                                                    <Td>{std.student_master.fatherName}</Td>
                                                </Tr>
                                            )
                                        })}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </LoadingContainer>
                    }
                    {toggleTemplate && <CertificateTemplate data={toggleTemplate} themeColor={themeColor} closeModal={() => setToggleTemplate(null)} />}
                </Box>
            </Box >
        </Box >
    )
}