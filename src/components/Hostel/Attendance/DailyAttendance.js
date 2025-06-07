import { useStudentStore } from "@/store/studentStore"
import { Avatar, Box, Button, Flex, IconButton, Image, Input, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react"
import dayjs from "dayjs"
import { groupBy, map } from "lodash"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { BsPersonFillCheck } from "react-icons/bs";
import { MarkDailyAttendance } from "./MarkDailyAttendance"
import { LoadingContainer } from "@/common/LoadingContainer"
import { SendSms } from "@/common/SendSms"
import { useSmsStore } from "@/store/SmsStore"
import { NoData } from "@/common/NoData"
import { HasPermission } from "@/common/HasPermission"
import { PERMISSIONS } from "@/constant/PermissionConstant"

export const DailyAttendance = ({ sessionMasterId, themeColor }) => {
    const router = useRouter()
    const [selectedDate, setSelectedDate] = useState(dayjs(new Date()).format("YYYY-MM-DD"))
    const [toggleMark, setToggleMark] = useState(null)
    const [toggleSMS, setToggleSMS] = useState(null)

    const { getDailyAttendanceAction, getDailyAttendanceStatus, dailyAttendance
    } = useStudentStore(s => ({
        getDailyAttendanceAction: s.getDailyAttendanceAction,
        getDailyAttendanceStatus: s.getDailyAttendanceStatus,
        dailyAttendance: s.dailyAttendance
    }))

    useEffect(() => {
        getDailyAttendanceAction({ sessionMasterId, date: selectedDate })
    }, [getDailyAttendanceAction, selectedDate, sessionMasterId])

    return (
        <Box>
            <Flex justify={"space-between"} align={"center"}>
                <Input w="fit-content" size={"sm"} type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                {/* <SendSms /> */}
            </Flex>
            <LoadingContainer status={getDailyAttendanceStatus}>
                {dailyAttendance?.length ?
                    <TableContainer>
                        <Table mt={5}>
                            <Thead>
                                <Tr>
                                    <Th color={"white"} textAlign={"center"}>Class</Th>
                                    <Th color={"white"} textAlign={"center"}>Stream</Th>
                                    <Th color={"white"} textAlign={"center"}>Section</Th>
                                    <Th color={"white"} textAlign={"center"}>Total Student</Th>
                                    <Th color={"white"} textAlign={"center"}>Present Student</Th>
                                    <Th color={"white"} textAlign={"center"}>Absent Student</Th>
                                    {HasPermission(PERMISSIONS.STUDENT_ATTENDANCE_ADD) &&
                                        <Th color={"white"} textAlign={"center"}>Action</Th>
                                    }
                                </Tr>
                            </Thead>
                            <Tbody>
                                {map(groupBy(dailyAttendance, "classMasterId"), (cs, index) => {
                                    const subLength = cs?.length;
                                    return (
                                        <React.Fragment key={index}>
                                            {cs?.map((sub, subIndex) => (
                                                <Tr key={subIndex}>
                                                    {subIndex === 0 && (
                                                        <Td rowSpan={subLength} textAlign={"center"} fontSize={16} fontWeight={"bold"}>
                                                            <Flex flexDir={"column"} align={"center"}>
                                                                <Avatar size={"sm"} name={sub.className} />
                                                                {sub.className?.length > 1 ? <Text>{sub.className}</Text> : null}
                                                            </Flex>
                                                        </Td>
                                                    )}
                                                    <Td textAlign={"center"} fontWeight={"semibold"}>{sub.streamName}</Td>
                                                    <Td textAlign={"center"}>{sub.sectionName}</Td>
                                                    <Td textAlign={"center"}>{sub.totalStudent}</Td>
                                                    <Td>
                                                        <Flex w="100%" justify={"center"}>
                                                            <Text w="fit-content" color={"white"} p={0.5} px={2} py={sub.totalpresent?.toString().length > 1 ? 1 : 0.5} borderRadius={"50%"} bg="green.500">{sub.totalpresent}</Text>
                                                        </Flex>
                                                    </Td>
                                                    <Td>
                                                        <Flex w="100%" justify={"center"}>
                                                            <Text w="fit-content" color={"white"} p={0.5} px={2} py={sub.totalpresent?.toString().length > 1 ? 1 : 0.5} borderRadius={"50%"} bg="red.500">{sub.totalAbsent}</Text>
                                                        </Flex>
                                                    </Td>
                                                    {HasPermission(PERMISSIONS.STUDENT_ATTENDANCE_ADD) &&
                                                        <Td textAlign={"center"}>
                                                            <Tooltip placement="top" label="Mark Attendance">
                                                                <IconButton
                                                                    size={"xs"}
                                                                    variant={"ghost"}
                                                                    color={"blue.500"}
                                                                    icon={<BsPersonFillCheck fontSize={20} />}
                                                                    onClick={() => setToggleMark(sub)} />
                                                            </Tooltip>
                                                        </Td>
                                                    }
                                                </Tr>
                                            ))}
                                        </React.Fragment>
                                    )
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                    :
                    <NoData title={"No Attendance Found"} />
                }
            </LoadingContainer>
            {toggleMark && <MarkDailyAttendance getDailyAttendanceAction={getDailyAttendanceAction} data={toggleMark} date={selectedDate} sessionMasterId={sessionMasterId} themeColor={themeColor} closeDrawer={() => setToggleMark(null)} />}
        </Box>
    )
}