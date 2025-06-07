import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { useAdminStore } from "@/store/AdminStore";
import { DeleteButton } from "@/common/DeleteButton";
import { LoadingContainer } from "@/common/LoadingContainer";
import { AddRole } from "./AddRole";
import { FaLock } from "react-icons/fa";
import { RolePermissions } from "./RolePermissions";
import { STATUS } from "@/constant";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const Roles = ({ sessionMasterId, themeColor }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    const [togglePermission, setTogglePermission] = useState(null)

    const { getRoleAction, getRoleStatus, allRoles, deleteRoleAction, deleteRoleStatus, resetRoleStatus } = useAdminStore(s => ({
        getRoleAction: s.getRoleAction,
        getRoleStatus: s.getRoleStatus,
        allRoles: s.allRoles,
        deleteRoleAction: s.deleteRoleAction,
        deleteRoleStatus: s.deleteRoleStatus,
        resetRoleStatus: s.resetRoleStatus
    }))

    useEffect(() => {
        if ((getRoleStatus || 1) === STATUS.NOT_STARTED) {
            getRoleAction()
        }
    }, [getRoleAction, getRoleStatus])

    const deleteRole = (id) => {
        deleteRoleAction(id)
    }
    return (
        <Box h={"100%"}>
            <PageHeader heading={"Roles List"} extra={HasPermission(PERMISSIONS.ROLES_ADD) && <Button size={"sm"} colorScheme={themeColor} leftIcon={<AddIcon />} onClick={() => setToggleDrawer([])}>Add Role</Button>} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <LoadingContainer status={getRoleStatus}>
                        {allRoles?.length ?
                            <TableContainer mt={2}>
                                <Table w="100%" size={"sm"} variant={"simple"}>
                                    <Thead>
                                        <Tr bg="gray.100">
                                            <Th>S. No.</Th>
                                            <Th>Role</Th>
                                            {(HasPermission(PERMISSIONS.ROLES_EDIT) || HasPermission(PERMISSIONS.ROLES_DELETE)) ?
                                                <Th>Action</Th>
                                                :
                                                null
                                            }
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {map(allRoles, (role, index) => (
                                            <Tr>
                                                <Td>{index + 1}</Td>
                                                <Td>{role?.name}</Td>
                                                {(HasPermission(PERMISSIONS.ROLES_EDIT) || HasPermission(PERMISSIONS.ROLES_DELETE)) ?
                                                    <Td>
                                                        {role.id === 1 ?
                                                            null
                                                            :
                                                            <>
                                                                {HasPermission(PERMISSIONS.ROLES_EDIT) &&
                                                                    <Tooltip placement="top" label="Edit">
                                                                        <IconButton mr={2} size={"xs"} variant={"ghost"} icon={<EditIcon />} colorScheme={"blue"} onClick={() => setToggleDrawer(role)} />
                                                                    </Tooltip>
                                                                }
                                                                {HasPermission(PERMISSIONS.ROLES_DELETE) &&
                                                                    <DeleteButton
                                                                        description={"Are you sure? Do you want to delete?"}
                                                                        confirm={() => deleteRole(role.id)}
                                                                        status={deleteRoleStatus}
                                                                        reset={resetRoleStatus}
                                                                    />
                                                                }
                                                                <Tooltip placement="top" label="Permissions">
                                                                    <IconButton size={"xs"} variant={"ghost"} icon={<FaLock />} colorScheme={"green"} onClick={() => setTogglePermission(role)} />
                                                                </Tooltip>
                                                            </>
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
                            null
                        }
                    </LoadingContainer>
                </Box>
                {toggleDrawer && <AddRole data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} themeColor={themeColor} />}
                {togglePermission && <RolePermissions data={togglePermission} closeDrawer={() => setTogglePermission(null)} themeColor={themeColor} />}
            </Box>
        </Box>
    )
}