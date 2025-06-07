import { DeleteButton } from "@/common/DeleteButton";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { groupBy, map, orderBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { AddNoticeBoard } from "./AddNoticeBoard";
import { useClassSetupStore } from "@/store/classSetup";
import { useAppStore } from "@/store/App";
import dayjs from "dayjs";
import { URL } from "@/services/apis";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const StudentNoticeBoard = ({ themeColor, sessionMasterId }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    const { getNoticeBoardAction, getNoticeBoardStatus, allNoticeBoards, deleteNoticeBoardAction, deleteNoticeBoardStatus, resetNoticeBoardStatus, updateNoticeBoardStatus } = useAppStore(s => ({
        getNoticeBoardAction: s.getNoticeBoardAction,
        getNoticeBoardStatus: s.getNoticeBoardStatus,
        allNoticeBoards: s.allNoticeBoards,
        deleteNoticeBoardAction: s.deleteNoticeBoardAction,
        deleteNoticeBoardStatus: s.deleteNoticeBoardStatus,
        resetNoticeBoardStatus: s.resetNoticeBoardStatus,
        updateNoticeBoardStatus: s.updateNoticeBoardStatus
    }))

    const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } = useClassSetupStore(s => ({
        getClassSubjectAction: s.getClassSubjectAction,
        getClassSubjectStatus: s.getClassSubjectStatus,
        allClassSubjects: s.allClassSubjects
    }))

    useEffect(() => {
        if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
            getClassSubjectAction()
        }
    }, [getClassSubjectAction, getClassSubjectStatus])

    useEffect(() => {
        getNoticeBoardAction({ sessionMasterId })
    }, [getNoticeBoardAction, sessionMasterId,])

    useEffect(() => {
        if (updateNoticeBoardStatus === STATUS.SUCCESS) {
            setToggleDrawer(null)
            getNoticeBoardAction({ sessionMasterId })
        }
    }, [updateNoticeBoardStatus])

    const classes = useMemo(() => {
        return groupBy(allClassSubjects, "classMasterId")
    }, [allClassSubjects])

    const deleteNoticeBoard = (id) => {
        deleteNoticeBoardAction(id , "Student")
    }
    return (
        <Box pos={"relative"} h={"60vh"}>
            <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
                <LoadingContainer status={getNoticeBoardStatus}>
                    {allNoticeBoards?.length ?
                        <TableContainer mt={2}>
                            <Table w="100%" size={"sm"} variant={"simple"}>
                                <Thead>
                                    <Tr bg="gray.100">
                                        <Th>S.No.</Th>
                                        <Th>Notice Type</Th>
                                        <Th>Class</Th>
                                        <Th>Subject</Th>
                                        <Th>Message</Th>
                                        <Th>Date</Th>
                                        <Th>File</Th>
                                        {(HasPermission(PERMISSIONS.NOTICE_BOARD_EDIT) || HasPermission(PERMISSIONS.NOTICE_BOARD_DELETE)) ?
                                            <Th>Action</Th>
                                            :
                                            null
                                        }
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {map(orderBy(allNoticeBoards, "orderNo", "asc"), (notice, index) => (
                                        <Tr key={notice?.id}>
                                            <Td>{index + 1}</Td>
                                            <Td>{notice.isClass ? "Class Wise" : "Student Wise"}</Td>
                                            <Td>{notice?.classMasterId ? notice?.class_master?.name : "-"}</Td>
                                            <Td>{notice.subject}</Td>
                                            <Td>{notice.message}</Td>
                                            <Td>{notice.date ? dayjs(notice.date).format("DD-MM-YYYY") : null}</Td>
                                            <Td cursor={"pointer"} color={`${themeColor}.500`}>{notice.file ? <Text onClick={() => window.open(`${URL}${notice.file}`)}>File</Text> : null}</Td>
                                            {(HasPermission(PERMISSIONS.NOTICE_BOARD_EDIT) || HasPermission(PERMISSIONS.NOTICE_BOARD_DELETE)) ?
                                                <Td>
                                                    {HasPermission(PERMISSIONS.NOTICE_BOARD_EDIT) &&
                                                        <Tooltip placement="top" label="Edit">
                                                            <IconButton mr={3} size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={themeColor} onClick={() => setToggleDrawer(notice)} />
                                                        </Tooltip>
                                                    }
                                                    {HasPermission(PERMISSIONS.NOTICE_BOARD_DELETE) &&
                                                        <DeleteButton
                                                            description={"Are you sure? Do you want to delete?"}
                                                            confirm={() => deleteNoticeBoard(notice?.id)}
                                                            status={deleteNoticeBoardStatus}
                                                            reset={resetNoticeBoardStatus}
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
                        :
                        <NoData title={"No Student Notice Found"} />
                    }
                </LoadingContainer>
                {HasPermission(PERMISSIONS.NOTICE_BOARD_ADD) &&
                    <Tooltip placement="top" label={"Add Notice Board"}>
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
                {toggleDrawer && <AddNoticeBoard type={"exam"} themeColor={themeColor} sessionMasterId={sessionMasterId} data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} />}
            </Box>
        </Box>
    )
}