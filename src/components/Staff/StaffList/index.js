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
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { LoadingContainer } from "@/common/LoadingContainer";
import { DeleteButton } from "@/common/DeleteButton";
import { useStaffStore } from "@/store/StaffStore";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import dayjs from "dayjs";
import { EmployeeRegistration } from "../EmployeeRegistration";

export const StaffList = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const {
    getStaffAction,
    getStaffStatus,
    allStaffs,
    deleteStaffAction,
    deleteStaffStatus,
    resetStaffStatus,
  } = useStaffStore((s) => ({
    getStaffAction: s.getStaffAction,
    getStaffStatus: s.getStaffStatus,
    allStaffs: s.allStaffs,
    deleteStaffAction: s.deleteStaffAction,
    deleteStaffStatus: s.deleteStaffStatus,
    resetStaffStatus: s.resetStaffStatus,
  }));
  useEffect(() => {
    return () => {
      resetStaffStatus();
    };
  }, []);
  
  useEffect(() => {
    if ((getStaffStatus || 1) === STATUS.NOT_STARTED) {
      getStaffAction();
    }
  }, [getStaffAction, getStaffStatus]);

  const deleteStaff = (id) => {
    deleteStaffAction(id);
  };

  return (
    <Box h={"100%"}>
      <PageHeader
        heading={"Staff List"}
        extra={
          HasPermission(PERMISSIONS.STAFF_ADD) && (
            <Button
            size="sm"
            colorScheme={themeColor}
            onClick={() => {
              setSelectedStaff(null); // for Add
              setToggleDrawer(true);
            }}
            leftIcon={<AddIcon />}
          >
            Add Staff
          </Button>
          
          )
        }
      />
      <Box bg={"white"} h={"90%"} p={5}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getStaffStatus}>
            {allStaffs?.length ? (
                <TableContainer mt={2}>
                  <Table w="100%" size="sm" variant="simple">
                    <Thead>
                      <Tr bg="gray.100">
                        <Th>S No.</Th>
                        <Th>Name</Th>
                        <Th>Device Id</Th>
                        <Th>Mobile No.</Th>
                        <Th>Email</Th>
                        <Th>Designation</Th>
                        <Th>Department</Th>
                        <Th>Gender</Th>
                        <Th>DOB</Th>
                        <Th>Address</Th>
                        {HasPermission(PERMISSIONS.STAFF_EDIT) ||
                        HasPermission(PERMISSIONS.STAFF_DELETE) ? (
                          <Th>Action</Th>
                        ) : null}
                      </Tr>
                    </Thead>

                    <Tbody>
                      {map(allStaffs, (staff, index) =>
                        staff ? (
                          <Tr key={staff.id}>
                            <Td>{index + 1}</Td>
                            <Td>{staff.name}</Td>
                            <Td>{staff.deviceId || "N/A"}</Td>
                            <Td>{staff.mobileNo}</Td>
                            <Td>{staff.email}</Td>
                            <Td>{staff.designation}</Td>
                            <Td>{staff.department}</Td>
                            <Td>{staff.gender}</Td>
                            <Td>
                              {staff.dob
                                ? dayjs(staff.dob).format("DD/MM/YYYY")
                                : "-"}
                            </Td>
                            <Td>{staff.address}</Td>
                            {(HasPermission(PERMISSIONS.STAFF_EDIT) ||
                              HasPermission(PERMISSIONS.STAFF_DELETE)) && (
                              <Td>
                                {HasPermission(PERMISSIONS.STAFF_EDIT) && (
                                  <Tooltip placement="top" label="Edit">
                                    <IconButton
                                      mr={3}
                                      size="sm"
                                      variant="ghost"
                                      icon={<EditIcon />}
                                      colorScheme="blue"
                                      onClick={() => {
                                        setSelectedStaff(staff);
                                        setToggleDrawer(true);
                                      }}
                                    />
                                  </Tooltip>
                                )}
                                {HasPermission(PERMISSIONS.STAFF_DELETE) && (
                                  <DeleteButton
                                    description="Are you sure? Do you want to delete?"
                                    confirm={() => deleteStaff(staff.id)}
                                    status={deleteStaffStatus}
                                    reset={resetStaffStatus}
                                  />
                                )}
                              </Td>
                            )}
                          </Tr>
                        ) : null
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
            ) : (
              <NoData title="No Staff Found" />
            )}
          </LoadingContainer>
        </Box>
      </Box>
      {toggleDrawer && (
  <EmployeeRegistration
    data={selectedStaff}
    isOpen={toggleDrawer}
    closeDrawer={() => setToggleDrawer(false)}
    themeColor={themeColor}
    sessionMasterId={sessionMasterId}
  />
)}

    </Box>
  );
};
