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
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { LoadingContainer } from "@/common/LoadingContainer";
import { DeleteButton } from "@/common/DeleteButton";
import { useStaffStore } from "@/store/StaffStore";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { EmployeeRegistrationAdmin } from "../EmployeeRegistrationAdmin";

export const AdminStaff = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const {
    getStaffSuperAdminAction,
    getStaffSuperAdminStatus,
    allStaffsSuperAdmin,
    deleteSuperAdminStaffAction,
    deleteSuperAdminStaffStatus,
    resetStaffStatus,
  } = useStaffStore((s) => ({
    getStaffSuperAdminAction: s.getStaffSuperAdminAction,
    getStaffSuperAdminStatus: s.getStaffSuperAdminStatus,
    allStaffsSuperAdmin: s.allStaffsSuperAdmin,
    deleteSuperAdminStaffAction: s.deleteSuperAdminStaffAction,
    deleteSuperAdminStaffStatus: s.deleteSuperAdminStaffStatus,
    resetStaffStatus: s.resetStaffStatus,
  }));

  useEffect(() => {
    if ((getStaffSuperAdminStatus || 1) === STATUS.NOT_STARTED) {
      getStaffSuperAdminAction({
        page: 1,
        limit: 10,
      });
    }
  }, [getStaffSuperAdminAction, getStaffSuperAdminStatus]);

  const deleteStaff = async (id) => {
   await deleteSuperAdminStaffAction(id);
   getStaffSuperAdminAction({
    page: 1,
    limit: 10,
  });
  };


  return (
    <Box h={"100%"}>
      <PageHeader
        heading={"Staff List"}
        extra={
          <Button
            size={"sm"}
            colorScheme={themeColor}
            onClick={() => setToggleDrawer([])}
            leftIcon={<AddIcon />}
          >
            Add Staff
          </Button>
        }
      />
      <Box bg={"white"} h={"90%"} p={5}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getStaffSuperAdminStatus}>
            {allStaffsSuperAdmin?.data?.length ? (
              <TableContainer mt={2}>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>S No.</Th>
                      <Th>Name</Th>
                      <Th>Mobile No.</Th>
                      <Th>Email</Th>
                      <Th>Gender</Th>
                      <Th>DOB</Th>
                      <Th>Hire Date</Th>
                      <Th>Address</Th>
                      <Th>Status</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(allStaffsSuperAdmin.data, (staff, index) =>
                      staff ? (
                        <Tr key={staff.id}>
                          <Td>{index + 1}</Td>
                          <Td>{staff.fullName}</Td>{" "}
                          <Td>{staff.mobileNo}</Td>
                          <Td>{staff.email}</Td>
                          <Td>{staff.gender}</Td>
                          <Td>
                            {staff.dob
                              ? new Date(staff.dob).toLocaleDateString()
                              : "-"}
                          </Td>
                          <Td>
                            {staff.hireDate
                              ? new Date(staff.hireDate).toLocaleDateString()
                              : "-"}
                          </Td>
                          <Td>{staff.address}</Td>
                          <Td>{staff.isActive ? "Active" : "Inactive"}</Td>
                          <Td>
                            <Tooltip placement="top" label="Edit">
                              <IconButton
                                mr={3}
                                size={"sm"}
                                variant={"ghost"}
                                icon={<EditIcon />}
                                colorScheme={"blue"}
                                onClick={() => setToggleDrawer(staff)}
                              />
                            </Tooltip>
                            <DeleteButton
                              description={
                                "Are you sure? Do you want to delete?"
                              }
                              confirm={() => deleteStaff(staff.id)}
                              status={deleteSuperAdminStaffStatus}
                              reset={resetStaffStatus}
                            />
                          </Td>
                        </Tr>
                      ) : null
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Staff Found"} />
            )}
          </LoadingContainer>
        </Box>
      </Box>
      {toggleDrawer && (
        <EmployeeRegistrationAdmin
          data={toggleDrawer}
          closeDrawer={() => setToggleDrawer(null)}
          themeColor={themeColor}
          sessionMasterId={sessionMasterId}
        />
      )}
    </Box>
  );
};
