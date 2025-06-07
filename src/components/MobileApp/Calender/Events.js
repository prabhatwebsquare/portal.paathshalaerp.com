import { DeleteButton } from "@/common/DeleteButton";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useExamStore } from "@/store/Exam";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Tab, TabList, Table, TableContainer, Tabs, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map, orderBy } from "lodash";
import React, { useEffect, useState } from "react";
import { AddExam } from "./AddHoliday";
import { PageHeader } from "@/common/PageHeader";
import { AddTeacherNotice } from "./AddEvent";
import dayjs from "dayjs";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const Events = ({ themeColor }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    // const { getExamAction, getExamStatus, allExams, deleteExamAction, deleteExamStatus, resetStatus } = useExamStore(s => ({
    //     getExamAction: s.getExamAction,
    //     getExamStatus: s.getExamStatus,
    //     allExams: s.allExams,
    //     deleteExamAction: s.deleteExamAction,
    //     deleteExamStatus: s.deleteExamStatus,
    //     resetStatus: s.resetStatus
    // }))

    // useEffect(() => {
    //     getExamAction({ type: "test" })
    // }, [getExamAction])

    const deleteEvent = (id) => {
        // deleteExamAction(id)
    }
    return (
        <Box pos={"relative"} h={"60vh"}>
            <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
                {/* <LoadingContainer status={getExamStatus}> */}
                <TableContainer mt={2}>
                    <Table w="100%" size={"sm"} variant={"simple"}>
                        <Thead>
                            <Tr bg="gray.100">
                                <Th>S.No.</Th>
                                <Th>Event Name</Th>
                                <Th>Date</Th>
                                {(HasPermission(PERMISSIONS.CALENDER_EDIT) || HasPermission(PERMISSIONS.CALENDER_DELETE)) ?
                                    <Th>Action</Th>
                                    :
                                    null
                                }
                            </Tr>
                        </Thead>
                        <Tbody>
                            {map(new Array(4), (exam, index) => (
                                <Tr key={exam?.id}>
                                    <Td>{index + 1}</Td>
                                    <Td>Farewell Party</Td>
                                    <Td>{dayjs().format("DD-MM-YYYY")}</Td>
                                    {(HasPermission(PERMISSIONS.CALENDER_EDIT) || HasPermission(PERMISSIONS.CALENDER_DELETE)) ?
                                        <Td>
                                            {HasPermission(PERMISSIONS.CALENDER_EDIT) &&
                                                <Tooltip placement="top" label="Edit">
                                                    <IconButton mr={3} size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={themeColor} onClick={() => setToggleDrawer(exam)} />
                                                </Tooltip>
                                            }
                                            {HasPermission(PERMISSIONS.CALENDER_DELETE) &&
                                                <DeleteButton
                                                    description={"Are you sure? Do you want to delete?"}
                                                    confirm={() => deleteEvent(exam.id)}
                                                // status={deleteExamStatus}
                                                // reset={resetStatus}
                                                />
                                            }
                                        </Td>
                                        :
                                        null
                                    }
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                {/* </LoadingContainer> */}
                {HasPermission(PERMISSIONS.CALENDER_ADD) &&
                    <Tooltip placement="top" label={"Add New Test"}>
                        <Flex pos={"absolute"} bottom={10} right={10}
                            w={"50px"} h={"50px"}
                            bg={`${themeColor}.500`}
                            justify={"center"}
                            align={"center"}
                            borderRadius={"50%"}
                            color={"white"}
                            onClick={() => setToggleDrawer([])}
                        >
                            <AddIcon />
                        </Flex>
                    </Tooltip>
                }
                {toggleDrawer && <AddTeacherNotice data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} />}
            </Box>
        </Box>
    )
}