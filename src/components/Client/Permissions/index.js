import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
  Switch,
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
import { DeleteButton } from "@/common/DeleteButton";
import { LoadingContainer } from "@/common/LoadingContainer";
import { AddPermissions } from "./AddPermissions";
import { STATUS } from "@/constant";
import { useSysAdminStore } from "@/store/SysAdmin";
import { NoData } from "@/common/NoData";

export const Permissions = ({ themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [changeStatus, setChangeStatus] = useState(null);

  const {
    getSchoolPermissionAction,
    getSchoolPermissionStatus,
    allSchoolPermissions,
    deleteSchoolPermissionAction,
    deleteSchoolPermissionStatus,
    resetSchoolPermissionStatus,
  } = useSysAdminStore((s) => ({
    getSchoolPermissionAction: s.getSchoolPermissionAction,
    getSchoolPermissionStatus: s.getSchoolPermissionStatus,
    allSchoolPermissions: s.allSchoolPermissions,
    deleteSchoolPermissionAction: s.deleteSchoolPermissionAction,
    deleteSchoolPermissionStatus: s.deleteSchoolPermissionStatus,
    resetSchoolPermissionStatus: s.resetSchoolPermissionStatus,
  }));

  useEffect(() => {
    if ((getSchoolPermissionStatus || 1) === STATUS.NOT_STARTED) {
      getSchoolPermissionAction();
    }
  }, [getSchoolPermissionAction, getSchoolPermissionStatus]);

  const deleteSchoolPermission = (id) => {
    deleteSchoolPermissionAction(id);
  };
  return (
    <Box h={"100%"}>
      <PageHeader
        heading={"Permissions List"}
        extra={
          <Button
            size={"sm"}
            colorScheme={themeColor}
            leftIcon={<AddIcon />}
            onClick={() => setToggleDrawer([])}
          >
            Add Permission
          </Button>
        }
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getSchoolPermissionStatus}>
            {allSchoolPermissions?.length ? (
              <TableContainer mt={2}>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>S. No.</Th>
                      <Th>Name</Th>
                      <Th>Status (Active/DeActive)</Th>
                      {/* {(HasPermission(PERMISSIONS.ADMIN_EDIT) || HasPermission(PERMISSIONS.ADMIN_DELETE)) ? */}
                      <Th>Action</Th>
                      {/* :
                                                null
                                            } */}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(allSchoolPermissions, (permission, index) => (
                      <Tr>
                        <Td>{index + 1}</Td>
                        <Td>{permission?.name}</Td>
                        <Td>
                          <Switch
                            colorScheme={"green"}
                            isChecked={permission.status === 1 ? true : false}
                            onChange={() => setChangeStatus(permission)}
                          />
                        </Td>
                        {/* {(HasPermission(PERMISSIONS.ADMIN_EDIT) || HasPermission(PERMISSIONS.ADMIN_DELETE)) ? */}
                        <Td>
                          {/* {HasPermission(PERMISSIONS.ADMIN_EDIT) && */}
                          <Tooltip placement="top" label="Edit">
                            <IconButton
                              mr={2}
                              size={"xs"}
                              variant={"ghost"}
                              icon={<EditIcon />}
                              colorScheme={"blue"}
                              onClick={() => setToggleDrawer(permission)}
                            />
                          </Tooltip>
                          {/* }
                                                        {HasPermission(PERMISSIONS.ADMIN_DELETE) && */}
                          {/* <DeleteButton
                                                        description={"Are you sure? Do you want to delete?"}
                                                        confirm={() => deleteSchoolPermission(permission.id)}
                                                        status={deleteSchoolPermissionStatus}
                                                        reset={resetSchoolPermissionStatus}
                                                    /> */}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Permission Found"} />
            )}
          </LoadingContainer>
        </Box>
        {toggleDrawer && (
          <AddPermissions
            data={toggleDrawer}
            closeDrawer={() => setToggleDrawer(null)}
            themeColor={themeColor}
          />
        )}
      </Box>
    </Box>
  );
};
