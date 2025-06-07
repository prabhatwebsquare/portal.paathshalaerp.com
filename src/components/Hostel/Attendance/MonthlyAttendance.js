import CustomMultipleDatePicker from "@/common/CustomCalender";
import CustomInput from "@/common/CustomInput";
import { Box, Button, Flex, IconButton, Image, Input, Select, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import dayjs from "dayjs";
import { groupBy, map, uniqBy } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BsPersonFillCheck } from "react-icons/bs";
import { MarkMonthlyAttendance } from "./MarkMonthlyAttendance";
import { useClassSetupStore } from "@/store/classSetup";
import { STATUS } from "@/constant";
import { useStudentStore } from "@/store/studentStore";
import { NoData } from "@/common/NoData";
import { CustomSelect } from "@/common/CustomSelect";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";


export const MonthlyAttendance = ({ sessionMasterId, themeColor }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    const [inputValue, setInputValue] = useState([])
    const [studentList, setStudentList] = useState(false)

    const inputHandler = (name, val) => {
        setInputValue(pre => ({ ...pre, [name]: val }))
    }

    const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } = useClassSetupStore(s => ({
        getClassSubjectAction: s.getClassSubjectAction,
        getClassSubjectStatus: s.getClassSubjectStatus,
        allClassSubjects: s.allClassSubjects
    }))

    const { getSectionAction, getSectionStatus, allSections } = useClassSetupStore(s => ({
        getSectionAction: s.getSectionAction,
        getSectionStatus: s.getSectionStatus,
        allSections: s.allSections
    }))

    const { getMonthlyAttendanceAction, getMonthlyAttendanceStatus, monthlyAttendance } = useStudentStore(s => ({
        getMonthlyAttendanceAction: s.getMonthlyAttendanceAction,
        getMonthlyAttendanceStatus: s.getMonthlyAttendanceStatus,
        monthlyAttendance: s.monthlyAttendance
    }))

    useEffect(() => {
        if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
            getClassSubjectAction()
        }
        if ((getSectionStatus || 1) === STATUS.NOT_STARTED) {
            getSectionAction()
        }
    }, [getClassSubjectAction, getClassSubjectStatus, getSectionStatus, getSectionAction])

    const classes = useMemo(() => {
        return groupBy(allClassSubjects, "classMasterId")
    }, [allClassSubjects])

    const getStudent = (e) => {
        e.preventDefault()
        getMonthlyAttendanceAction({ sessionMasterId, ...inputValue })
    }
    const reloadData = () => {
        getMonthlyAttendanceAction({ sessionMasterId, ...inputValue })
    }

    return (
        <Box>
            <form onSubmit={getStudent}>
                <Flex gap={3}>
                    <CustomInput size={"sm"} w={"20%"} type={"month"} name="date" label={"Select Month"} inputValue={inputValue} setInputValue={setInputValue} />
                    <CustomSelect size={"sm"} w={"20%"} name={"classMasterId"} label={"Select Class"} inputValue={inputValue} setInputValue={setInputValue} data={
                        map(classes, (d, key) => ({ value: key, name: d?.[0]?.class_master?.name }))
                    } />
                    <CustomSelect size={"sm"} w={"20%"} name={"streamMasterId"} label={"Select Stream"} inputValue={inputValue} setInputValue={setInputValue} data={
                        map(uniqBy(classes?.[inputValue?.classMasterId], "streamMasterId"), (d, index) => ({ value: d.stream_master?.id, name: d.stream_master.name }))
                    } />
                    <CustomSelect size={"sm"} w={"20%"} name={"sectionMasterId"} label={"Select Section"} inputValue={inputValue} setInputValue={setInputValue} data={
                        map(allSections, d => ({ value: d.id, name: d.name }))
                    } />
                    <Button size={"sm"} colorScheme={"green"} type="submit">Get</Button>
                </Flex>
            </form>
            {monthlyAttendance?.length ?
                <Table mt={5}>
                    <Thead>
                        <Tr>
                            <Th>Roll No</Th>
                            <Th>Student Name</Th>
                            <Th>Father Name</Th>
                            <Th>Total Days</Th>
                            <Th>Present</Th>
                            <Th>Absent</Th>
                            {HasPermission(PERMISSIONS.STUDENT_ATTENDANCE_ADD) &&
                                <Th>Attendance</Th>
                            }
                        </Tr>
                    </Thead>
                    <Tbody>
                        {map(monthlyAttendance, atten => (
                            <Tr>
                                <Td>{atten.rollNo}</Td>
                                <Td>{atten.student_master.studentName}</Td>
                                <Td>{atten.student_master.fatherName}</Td>
                                <Td>{atten.alldays}</Td>
                                <Td>{atten.present}</Td>
                                <Td>{atten.absent}</Td>
                                {HasPermission(PERMISSIONS.STUDENT_ATTENDANCE_ADD) &&
                                    <Td>
                                        <Tooltip placement="top" label="Mark Attendance">
                                            <IconButton
                                                size={"xs"}
                                                variant={"ghost"}
                                                color={"blue.500"}
                                                icon={<BsPersonFillCheck fontSize={20} />}
                                                onClick={() => setToggleDrawer(atten)}
                                            />
                                        </Tooltip>
                                    </Td>
                                }
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
                :
                <NoData title={"No Student Found"} />
            }
            {toggleDrawer && <MarkMonthlyAttendance data={toggleDrawer} getStudent={reloadData} inputValue={inputValue} closeDrawer={() => setToggleDrawer(null)} sessionMasterId={sessionMasterId} />}
        </Box>
    )
}