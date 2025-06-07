import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, Flex, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { AddUser } from "./AddUser";
import { useAdminStore } from "@/store/AdminStore";
import { DeleteButton } from "@/common/DeleteButton";
import { LoadingContainer } from "@/common/LoadingContainer";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { STATUS } from "@/constant";
import { GrUpdate } from "react-icons/gr";

export const UsersList = ({ themeColor }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)

    const { getUserAction, getUserStatus, allUsers, resetUserData, updateUserAction, updateUserStatus, resetUserStatus } = useAdminStore(s => ({
        getUserAction: s.getUserAction,
        getUserStatus: s.getUserStatus,
        allUsers: s.allUsers,
        resetUserData: s.resetUserData,
        updateUserAction: s.updateUserAction,
        updateUserStatus: s.updateUserStatus,
        resetUserStatus: s.resetUserStatus
    }))

    useEffect(() => {
        if ((getUserStatus || 1) === STATUS.NOT_STARTED) {
            getUserAction()
        }
    }, [getUserAction, getUserStatus])

    useEffect(() => {
        return () => resetUserData()
    }, [resetUserData])

    const deleteUser = (data) => {
        updateUserAction({
            id: data.id,
            isActive: data.isActive === "1" ? "0" : "1"
        })
    }

    return (
        <Box>
            <PageHeader heading={"Users List"} extra={HasPermission(PERMISSIONS.USER_LIST_ADD) && <Button size={"sm"} colorScheme={themeColor} leftIcon={<AddIcon />} onClick={() => setToggleDrawer([])}>Add User</Button>} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <LoadingContainer status={getUserStatus}>
                        {allUsers?.length ?
                            <TableContainer mt={2}>
                                <Table w="100%" size={"sm"} variant={"simple"}>
                                    <Thead>
                                        <Tr bg="gray.100">
                                            <Th>S. No.</Th>
                                            <Th>Name</Th>
                                            <Th>Contact</Th>
                                            <Th>Email</Th>
                                            <Th>Role</Th>
                                            <Th>Status</Th>
                                            <Th>Password</Th>
                                            {(HasPermission(PERMISSIONS.USER_LIST_EDIT) || HasPermission(PERMISSIONS.USER_LIST_DELETE)) ?
                                                <Th>Action</Th>
                                                :
                                                null
                                            }
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {map(allUsers, (user, index) => (
                                            <Tr key={user.id}>
                                                <Td>{index + 1}</Td>
                                                <Td>{user.name}</Td>
                                                <Td>{user.mobileNo}</Td>
                                                <Td>{user.email}</Td>
                                                <Td style={{ fontWeight: "bold" }}>{user.role_master?.name}</Td>
                                                <Td>
                                                    <Flex gap={2} align={"center"} justify={"space-between"}>
                                                        <Badge variant={"outline"} colorScheme={user.isActive === "1" ? "green" : "red"}>{user.isActive === "1" ? "Active" : "InActive"}</Badge>
                                                        {user.id === 1 ?
                                                            null
                                                            :
                                                            HasPermission(PERMISSIONS.USER_LIST_DELETE) &&
                                                            <DeleteButton
                                                                icon={<GrUpdate />}
                                                                label={user.isActive === "1" ? "InActive" : "Active"}
                                                                heading={"Status Confirmation"}
                                                                description={"Are you sure? Do you want to change status?"}
                                                                button={user.isActive === "1" ? "InActive" : "Active"}
                                                                confirm={() => deleteUser(user)}
                                                                status={updateUserStatus}
                                                                reset={resetUserStatus}
                                                            />
                                                        }
                                                    </Flex>
                                                </Td>
                                                <Td>{user.authCode}</Td>
                                                {(HasPermission(PERMISSIONS.USER_LIST_EDIT) || HasPermission(PERMISSIONS.USER_LIST_DELETE)) ?
                                                    <Td>
                                                        {user.id === 1 ?
                                                            null
                                                            :
                                                            <>
                                                                {HasPermission(PERMISSIONS.USER_LIST_EDIT) &&
                                                                    <Tooltip placement="top" label="Edit">
                                                                        <IconButton size={"xs"} variant={"ghost"} icon={<EditIcon />} colorScheme={"blue"} onClick={() => setToggleDrawer(user)} />
                                                                    </Tooltip>
                                                                }
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
                {toggleDrawer && <AddUser data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} themeColor={themeColor} />}
            </Box>
        </Box>
    )
}