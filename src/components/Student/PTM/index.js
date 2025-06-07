import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import { useStudentStore } from "@/store/studentStore"
import { Box, HStack, IconButton, Select, Table, TableContainer, Tbody, Td, Th, Thead, Text, Tooltip, Tr, Button, Checkbox, Flex } from "@chakra-ui/react";
import { filter, findIndex, groupBy, intersectionBy, map, uniqBy } from "lodash"
import { useEffect, useMemo, useRef, useState } from "react";
import { MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { PrintMarkSheet, StudentDetails } from "./StudentDetails";
import { CustomSelect } from "@/common/CustomSelect";
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { LoadingContainer } from "@/common/LoadingContainer"
import { IoEyeOutline } from "react-icons/io5";

export const PTM = ({ themeColor, sessionMasterId }) => {
    const [inputValue, setInputValue] = useState({})
    const [toggleDetails, setToggleDetails] = useState(null)

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

    return (
        <Box h={"100%"}>
            <PageHeader heading={"PTM Report"} />
            <Box p={5} bg={"white"} h={"90%"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
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
                        {/* <Button px={4} size={"sm"} colorScheme={themeColor} isDisabled={selectedStudent?.length ? false : true} onClick={handlePrintClick}>Print</Button> */}
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
                                            <Th>Action</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {map(filterStudents, (std, index) => {
                                            return (
                                                <Tr key={index} _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                                                    <Td>{std.srNo}</Td>
                                                    <Td>{std.rollNo}</Td>
                                                    <Td>{std.student_master.studentName}</Td>
                                                    <Td>{std.student_master.fatherName}</Td>
                                                    <Td>
                                                        <Tooltip placement="top" label="View Details">
                                                            <IconButton size={"xs"} variant={"ghost"} icon={<IoEyeOutline fontSize={17} />} onClick={() => setToggleDetails(std)} colorScheme={"blue"} />
                                                        </Tooltip>
                                                    </Td>
                                                </Tr>
                                            )
                                        })}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </LoadingContainer>
                    }
                </Box>
                {toggleDetails && <StudentDetails data={toggleDetails} closeDrawer={() => setToggleDetails(null)} themeColor={themeColor} />}
            </Box>
        </Box>
    )
}

