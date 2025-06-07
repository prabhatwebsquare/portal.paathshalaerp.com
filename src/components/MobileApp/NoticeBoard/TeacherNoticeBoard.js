import { DeleteButton } from "@/common/DeleteButton";
import { LoadingContainer } from "@/common/LoadingContainer";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map, orderBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useAppStore } from "@/store/App";
import { AddTeacherNotice } from "./AddTeacherNotice";
import dayjs from "dayjs";
import { URL } from "@/services/apis";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const TeacherNoticeBoard = ({ themeColor, sessionMasterId }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    const { getTeachNoticeBoardAction, getTeachNoticeBoardStatus, allTeachNoticeBoards, deleteNoticeBoardAction, deleteNoticeBoardStatus, resetNoticeBoardStatus } = useAppStore(s => ({
        getTeachNoticeBoardAction: s.getTeachNoticeBoardAction,
        getTeachNoticeBoardStatus: s.getTeachNoticeBoardStatus,
        allTeachNoticeBoards: s.allTeachNoticeBoards,
        deleteNoticeBoardAction: s.deleteNoticeBoardAction,
        deleteNoticeBoardStatus: s.deleteNoticeBoardStatus,
        resetNoticeBoardStatus: s.resetNoticeBoardStatus
    }))

    useEffect(() => {
        getTeachNoticeBoardAction({ sessionMasterId })
    }, [getTeachNoticeBoardAction, sessionMasterId])

    const deleteNoticeBoard = (id) => {
        deleteNoticeBoardAction(id , "Teacher")
    }
    return (
        <Box pos={"relative"} h={"60vh"}>
            <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
                <LoadingContainer status={getTeachNoticeBoardStatus}>
                    {allTeachNoticeBoards?.length ?
                        <TableContainer mt={2}>
                            <Table w="100%" size={"sm"} variant={"simple"}>
                                <Thead>
                                    <Tr bg="gray.100">
                                        <Th>S.No.</Th>
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
                                    {map(orderBy(allTeachNoticeBoards, "orderNo", "asc"), (notice, index) => (
                                        <Tr key={notice?.id}>
                                            <Td>{index + 1}</Td>
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
                        <NoData title={"No Teacher Notice Found"} />
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
                {toggleDrawer && <AddTeacherNotice type={"exam"} themeColor={themeColor} sessionMasterId={sessionMasterId} data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} />}
            </Box>
        </Box>
    )
}