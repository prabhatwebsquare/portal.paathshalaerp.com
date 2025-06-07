import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
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

export const SuperAdminRoles = ({ sessionMasterId, themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [togglePermission, setTogglePermission] = useState(null);

  const {
    getRoleSuperAdminAction,
    getRoleSuperAdminStatus,
    allRolesSuperAdmin,
    deleteRoleSuperAdminAction,
    deleteRoleSuperAdminStatus,
    resetRoleSuperAdminStatus,
  } = useAdminStore((s) => ({
    getRoleSuperAdminAction: s.getRoleSuperAdminAction,
    getRoleSuperAdminStatus: s.getRoleSuperAdminStatus,
    allRolesSuperAdmin: s.allRolesSuperAdmin,
    deleteRoleSuperAdminAction: s.deleteRoleSuperAdminAction,
    deleteRoleSuperAdminStatus: s.deleteRoleSuperAdminStatus,
    resetRoleSuperAdminStatus: s.resetRoleSuperAdminStatus,
  }));

  useEffect(() => {
    if ((getRoleSuperAdminStatus || 1) === STATUS.NOT_STARTED) {
      getRoleSuperAdminAction();
    }
  }, [getRoleSuperAdminAction, getRoleSuperAdminStatus]);

  const deleteRole = (id) => {
    deleteRoleSuperAdminAction(id);
  };
  return (
    <Box h={"100%"}>
      <PageHeader
        heading={"Roles List"}
        extra={
          <Button
            size={"sm"}
            colorScheme={themeColor}
            leftIcon={<AddIcon />}
            onClick={() => setToggleDrawer([])}
          >
            Add Role
          </Button>
        }
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getRoleSuperAdminStatus}>
            {allRolesSuperAdmin?.length ? (
              <TableContainer mt={2}>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>S. No.</Th>
                      <Th>Role</Th>

                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>      
                    {map(allRolesSuperAdmin, (role, index) => (
                      <Tr>
                        <Td>{index + 1}</Td>
                        <Td>{role?.name}</Td>

                        <Td>
                          {role.id === 1 ? null : (
                            <>
                              <Tooltip placement="top" label="Edit">
                                <IconButton
                                  mr={2}
                                  size={"xs"}
                                  variant={"ghost"}
                                  icon={<EditIcon />}
                                  colorScheme={"blue"}
                                  onClick={() => setToggleDrawer(role)}
                                />
                              </Tooltip>

                              <DeleteButton
                                description={
                                  "Are you sure? Do you want to delete?"
                                }
                                confirm={() => deleteRole(role.id)}
                                status={deleteRoleSuperAdminStatus}
                                reset={resetRoleSuperAdminStatus}
                              />

                              <Tooltip placement="top" label="Permissions">
                                <IconButton
                                  size={"xs"}
                                  variant={"ghost"}
                                  icon={<FaLock />}
                                  colorScheme={"green"}
                                  onClick={() => setTogglePermission(role)}
                                />
                              </Tooltip>
                            </>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : null}
          </LoadingContainer>
        </Box>
        {toggleDrawer && (
          <AddRole
            data={toggleDrawer}
            closeDrawer={() => setToggleDrawer(null)}
            themeColor={themeColor}
          />
        )}
        {togglePermission && (
          <RolePermissions
            data={togglePermission}
            closeDrawer={() => setTogglePermission(null)}
            themeColor={themeColor}
          />
        )}
      </Box>
    </Box>
  );
};
