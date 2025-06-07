import { Box, Button, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { groupBy, map } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { AddSubjectTeacher } from "./AddSubjectTeacher";
import { MdDriveFolderUpload } from "react-icons/md";
import { UploadSyllabus } from "./UploadSyllabus";
import { useStaffStore } from "@/store/StaffStore";
import { STATUS } from "@/constant";
import { DeleteButton } from "@/common/DeleteButton";
import { NoData } from "@/common/NoData";
import { LoadingContainer } from "@/common/LoadingContainer";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const SubjectTeacher = ({ themeColor, sessionMasterId }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    const [toggleSyllabus, setToggleSyllabus] = useState(null)
    const { getSubTeachAction, getSubTeachStatus, allSubTeachs, deleteSubTeachAction, deleteSubTeachStatus, resetSubTeachStatus } = useStaffStore(s => ({
        getSubTeachAction: s.getSubTeachAction,
        getSubTeachStatus: s.getSubTeachStatus,
        allSubTeachs: s.allSubTeachs,
        deleteSubTeachAction: s.deleteSubTeachAction,
        deleteSubTeachStatus: s.deleteSubTeachStatus,
        resetSubTeachStatus: s.resetSubTeachStatus
    }))

    useEffect(() => {
        if ((getSubTeachStatus || 1) === STATUS.NOT_STARTED) {
            getSubTeachAction()
        }
    }, [getSubTeachAction, getSubTeachStatus])

    const staffWise = useMemo(() => {
        return groupBy(allSubTeachs, "staffId")
    }, [allSubTeachs])

    const deleteSubTeach = (id) => {
        deleteSubTeachAction(id)
    }

    return (
        <Box>
            <PageHeader heading={"Subject Teacher"} extra={HasPermission(PERMISSIONS.SUBJECT_TEACHER_ADD) && <Button size={"sm"} colorScheme={themeColor} onClick={() => setToggleDrawer([])} leftIcon={<AddIcon />}>Add Subject Teacher</Button>} />
            <Box bg={"white"} h={"80vh"} p={5} className="scrollBar" overflowY={"scroll"}>
                <LoadingContainer status={getSubTeachStatus}>
                    {allSubTeachs?.length ?
                        <TableContainer mt={2}>
                            <Table w="100%" size={"sm"} variant={"simple"}>
                                <Thead>
                                    <Tr bg="gray.100">
                                        <Th>Staff</Th>
                                        <Th>Class</Th>
                                        <Th>Stream</Th>
                                        <Th>Subject</Th>
                                        {(HasPermission(PERMISSIONS.SUBJECT_TEACHER_EDIT) || HasPermission(PERMISSIONS.SUBJECT_TEACHER_DELETE)) ?
                                            <Th>Action</Th>
                                            :
                                            null
                                        }
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {map(staffWise, (data, index) => (
                                        map(data, (sub, subIndex) => (
                                            <Tr>
                                                {subIndex === 0 &&
                                                    <Td rowSpan={data?.length}>{sub?.staff.name}</Td>
                                                }
                                                <Td>{sub.class_master?.name}</Td>
                                                <Td>{sub.stream_master?.name}</Td>
                                                <Td>{sub.subject_master?.name}</Td>
                                                {subIndex === 0 &&
                                                    (HasPermission(PERMISSIONS.SUBJECT_TEACHER_EDIT) || HasPermission(PERMISSIONS.SUBJECT_TEACHER_DELETE)) ?
                                                    <Td rowSpan={data?.length}>
                                                        {HasPermission(PERMISSIONS.SUBJECT_TEACHER_EDIT) &&
                                                            <Tooltip placement="top" label="Edit">
                                                                <IconButton mr={3} size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={"blue"} onClick={() => setToggleDrawer(data)} />
                                                            </Tooltip>
                                                        }
                                                        {HasPermission(PERMISSIONS.SUBJECT_TEACHER_DELETE) &&
                                                            <DeleteButton
                                                                description={"Are you sure? Do you want to delete?"}
                                                                confirm={() => deleteSubTeach(sub?.staffId)}
                                                                status={deleteSubTeachStatus}
                                                                reset={resetSubTeachStatus}
                                                            />
                                                        }
                                                    </Td>
                                                    :
                                                    null
                                                }
                                            </Tr>
                                        ))
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        :
                        <NoData title={"No Subject Teacher Found"} />
                    }
                </LoadingContainer>
            </Box>
            {toggleSyllabus && <UploadSyllabus themeColor={themeColor} data={toggleSyllabus} closeModal={() => setToggleSyllabus(null)} />}
            {toggleDrawer && <AddSubjectTeacher themeColor={themeColor} data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} sessionMasterId={sessionMasterId} />}
        </Box>
    )
}