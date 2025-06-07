import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import { useStudentStore } from "@/store/studentStore"
import { Box, Table, TableContainer, Tbody, Td, Th, Thead, Text, Tr, Button, Checkbox, Flex, Menu, MenuButton, MenuList, MenuOptionGroup, MenuItemOption, Tooltip, IconButton } from "@chakra-ui/react";
import { find, groupBy, map, uniqBy } from "lodash"
import { useEffect, useMemo, useState } from "react";
import { CustomSelect } from "@/common/CustomSelect";
import { LoadingContainer } from "@/common/LoadingContainer"
import { BsEyeFill } from "react-icons/bs";
import { AllMonthDrawer } from "./AllMonthDrawer";

export const AllMonthAttendance = ({ themeColor, sessionMasterId }) => {
    const [inputValue, setInputValue] = useState({})
    const [toggleDrawer, setToggleDrawer] = useState(null)

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

    const getFilterStudent = () => {
        getFilterStudentsAction({ ...inputValue, sessionMasterId })
    }

    return (
        <Box pos={"relative"} h={"70vh"}>
            <Box className="scrollBar" maxH={"70vh"} overflowY={"scroll"}>
                <Flex justify={"space-between"}>
                    {/* <form style={{ width: "80%" }} onSubmit={getFilterStudent}> */}
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
                        <Button type="submit" size={"sm"} colorScheme={themeColor} onClick={getFilterStudent}>Get</Button>
                    </Flex>
                    {/* </form> */}
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
                                    {map(filterStudents, (std, index) => (
                                        <Tr key={index} _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                                            <Td>{std.srNo}</Td>
                                            <Td>{std.rollNo}</Td>
                                            <Td>{std.student_master.studentName}</Td>
                                            <Td>{std.student_master.fatherName}</Td>
                                            <Td>
                                                <Tooltip placement="top" label={"Edit Receipt"}>
                                                    <IconButton
                                                        size="xs"
                                                        variant={"ghost"}
                                                        colorScheme={themeColor}
                                                        icon={<BsEyeFill fontSize={16} />}
                                                        onClick={() => setToggleDrawer(std)}
                                                    />
                                                </Tooltip>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        {toggleDrawer && <AllMonthDrawer data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} sessionMasterId={sessionMasterId} themeColor={themeColor} />}
                    </LoadingContainer>
                }
            </Box>
        </Box >
    )
}