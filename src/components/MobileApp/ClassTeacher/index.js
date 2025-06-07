import { Box, Button, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { AddClassTeacher } from "./AddClassTeacher";
import { useStaffStore } from "@/store/StaffStore";
import { LoadingContainer } from "@/common/LoadingContainer";
import { DeleteButton } from "@/common/DeleteButton";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const ClassTeacher = ({ themeColor, sessionMasterId }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    const { getClassTeachAction, getClassTeachStatus, allClassTeachs, deleteClassTeachAction, deleteClassTeachStatus, resetClassTeachStatus } = useStaffStore(s => ({
        getClassTeachAction: s.getClassTeachAction,
        getClassTeachStatus: s.getClassTeachStatus,
        allClassTeachs: s.allClassTeachs,
        deleteClassTeachAction: s.deleteClassTeachAction,
        deleteClassTeachStatus: s.deleteClassTeachStatus,
        resetClassTeachStatus: s.resetClassTeachStatus
    }))

    useEffect(() => {
        if ((getClassTeachStatus || 1) === STATUS.NOT_STARTED) {
            getClassTeachAction()
        }
    }, [getClassTeachAction, getClassTeachStatus])

    const deleteClassTeach = (id) => {
        deleteClassTeachAction(id)
    }

    return (
        <Box>
            <PageHeader heading={"Class Teacher"} extra={HasPermission(PERMISSIONS.CLASS_TEACHER_ADD) && <Button size={"sm"} colorScheme={themeColor} onClick={() => setToggleDrawer([])} leftIcon={<AddIcon />}>Add Class Teacher</Button>} />
            <Box bg={"white"} h={"90%"} p={5}>
                <LoadingContainer status={getClassTeachStatus}>
                    {allClassTeachs?.length ?
                        <TableContainer mt={2}>
                            <Table w="100%" size={"sm"} variant={"simple"}>
                                <Thead>
                                    <Tr bg="gray.100">
                                        <Th>S No.</Th>
                                        <Th>Staff</Th>
                                        <Th>Class</Th>
                                        <Th>Stream</Th>
                                        <Th>Section</Th>
                                        {(HasPermission(PERMISSIONS.CLASS_TEACHER_EDIT) || HasPermission(PERMISSIONS.CLASS_TEACHER_DELETE)) ?
                                            <Th>Action</Th>
                                            :
                                            null
                                        }
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {map(allClassTeachs, (c, index) => (
                                        <Tr key={c.id}>
                                            <Td>{index + 1}</Td>
                                            <Td>{c.staff?.name}</Td>
                                            <Td>{c.class_master?.name}</Td>
                                            <Td>{c.stream_master?.name}</Td>
                                            <Td>{c.section_master?.name}</Td>
                                            {(HasPermission(PERMISSIONS.CLASS_TEACHER_EDIT) || HasPermission(PERMISSIONS.CLASS_TEACHER_DELETE)) ?
                                                <Td>
                                                    {HasPermission(PERMISSIONS.CLASS_TEACHER_EDIT) &&
                                                        <Tooltip placement="top" label="Edit">
                                                            <IconButton mr={3} size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={"blue"} onClick={() => setToggleDrawer(c)} />
                                                        </Tooltip>
                                                    }
                                                    {HasPermission(PERMISSIONS.CLASS_TEACHER_DELETE) &&
                                                        <DeleteButton
                                                            description={"Are you sure? Do you want to delete?"}
                                                            confirm={() => deleteClassTeach(c.id)}
                                                            status={deleteClassTeachStatus}
                                                            reset={resetClassTeachStatus}
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
                        <NoData title={"No Class Teacher Found"} />}
                </LoadingContainer>
            </Box>
            {toggleDrawer && <AddClassTeacher themeColor={themeColor} data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} />}
        </Box>
    )
}