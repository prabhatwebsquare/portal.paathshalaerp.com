import {
  Box,
  Button,
  IconButton,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { AddStaff } from "./AddStaff";
import { PageHeader } from "@/common/PageHeader";
import { AddIcon, EditIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { LoadingContainer } from "@/common/LoadingContainer";
import { DeleteButton } from "@/common/DeleteButton";
import { useStaffStore } from "@/store/StaffStore";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { useMobileAppStore } from "@/store/MobileApp";

export const StaffList = ({ themeColor, sessionMasterId, pageName }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);

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

  const { ActivateTeacherAction, DeactivateTeacherAction } = useMobileAppStore(
    (s) => ({
      ActivateTeacherAction: s.ActivateTeacherAction,
      DeactivateTeacherAction: s.DeactivateTeacherAction,
    })
  );

  useEffect(() => {
    if ((getStaffStatus || 1) === STATUS.NOT_STARTED) {
      getStaffAction();
    }
  }, [getStaffAction, getStaffStatus]);

  const deleteStaff = (id) => {
    deleteStaffAction(id);
  };

  const activateSelectedTeachers = async (data) => {
    // const data = {
    //   sessionMasterId,
    //   staffData: [id],
    // };


    const payload = {
      type: data?.designation,
      staffId: data.id,
      sessionMasterId,
      name: data?.name,
      mobileNo: data?.mobileNo,
      email: data?.email,
      username: data?.mobileNo,
      password: "311311",
      designation: data?.designation,
    };
    await ActivateTeacherAction(payload);
    getStaffAction();
  };

  const deactivateSelectedTeachers = async (id) => {
    await DeactivateTeacherAction(id);
    getStaffAction();
  };

  const isReceptionPage = pageName === "Receiption";
  const isAppPage = pageName === "App_Staff_List";
  const [visibleAuthCodeId, setVisibleAuthCodeId] = useState(null);

  return (
    <Box>
      <PageHeader
        heading={"Staff List"}
        extra={
          isReceptionPage ? (
            <Button
              size={"sm"}
              colorScheme={themeColor}
              onClick={() => setToggleDrawer([])}
              leftIcon={<AddIcon />}
            >
              Add Staff
            </Button>
          ) : (
            HasPermission(PERMISSIONS.STAFF_ADD) && (
              <Button
                size={"sm"}
                colorScheme={themeColor}
                onClick={() => setToggleDrawer([])}
                leftIcon={<AddIcon />}
              >
                Add Staff
              </Button>
            )
          )
        }
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getStaffStatus}>
            {allStaffs?.length ? (
              <TableContainer mt={2}>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>S No.</Th>
                      <Th>Name</Th>
                      <Th>{isAppPage ? "Username" : "Mobile No."}</Th>
                      <Th>Designation</Th>
                      {!isReceptionPage && (
                        <>
                          {!isAppPage && <Th>Device Id</Th>}
                          <Th>UserName</Th>
                          <Th>Password</Th>
                        </>
                      )}
                      {(HasPermission(PERMISSIONS.STAFF_EDIT) ||
                        HasPermission(PERMISSIONS.STAFF_DELETE)) && (
                          <Th>Action</Th>
                        )}
                      {!isReceptionPage && <Th>Status Action</Th>}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(allStaffs, (staff, index) =>
                      staff ? (
                        <Tr key={staff.id}>
                          <Td>{index + 1}</Td>
                          <Td>{staff.name}</Td>
                          <Td>{staff.mobileNo}</Td>
                          <Td>{staff.designation}</Td>

                          {!isReceptionPage && (
                            <>
                              {!isAppPage && <Td>{staff.deviceId || "N/A"}</Td>}
                              <Td>{staff.app_user?.username || "N/A"}</Td>
                              <Td>
                                {staff.app_user?.authCode ? (
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    fontSize="md"
                                    fontWeight="semibold"
                                  >
                                    <Text
                                      as="span"
                                      color={
                                        visibleAuthCodeId === staff.id
                                          ? "green.600"
                                          : "gray.500"
                                      }
                                      fontSize="lg"
                                    >
                                      {visibleAuthCodeId === staff.id
                                        ? staff.app_user.authCode
                                        : "••••"}
                                    </Text>
                                    <IconButton
                                      icon={
                                        visibleAuthCodeId === staff.id ? (
                                          <ViewOffIcon />
                                        ) : (
                                          <ViewIcon />
                                        )
                                      }
                                      onClick={() =>
                                        setVisibleAuthCodeId(
                                          visibleAuthCodeId === staff.id
                                            ? null
                                            : staff.id
                                        )
                                      }
                                      variant="ghost"
                                      aria-label="Toggle auth code visibility"
                                      ml={2}
                                      colorScheme={
                                        visibleAuthCodeId === staff.id
                                          ? "green"
                                          : "gray"
                                      }
                                      size="sm"
                                      _hover={{
                                        bg: "gray.100",
                                        transform: "scale(1.1)",
                                      }}
                                    />
                                  </Box>
                                ) : (
                                  <Text>N/A</Text>
                                )}
                              </Td>
                            </>
                          )}

                          {(HasPermission(PERMISSIONS.STAFF_EDIT) ||
                            HasPermission(PERMISSIONS.STAFF_DELETE)) && (
                              <Td>
                                {HasPermission(PERMISSIONS.STAFF_EDIT) ? (
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
                                ) : null}
                                {HasPermission(PERMISSIONS.STAFF_DELETE) ? (
                                  <DeleteButton
                                    description={
                                      "Are you sure? Do you want to delete?"
                                    }
                                    confirm={() => deleteStaff(staff.id)}
                                    status={deleteStaffStatus}
                                    reset={resetStaffStatus}
                                  />
                                ) : null}
                              </Td>
                            )}

                          {!isReceptionPage && (
                            <Td>
                              <Tooltip
                                label={
                                  staff.app_user != null ? "Active" : "Deactive"
                                }
                                hasArrow
                                placement="top"
                                bg="gray.600"
                                color="white"
                                openDelay={200} // Delay before showing (optional)
                                closeDelay={100} // Tooltip hides shortly after mouse leaves
                              >
                                <Box display="inline-block">
                                  <Switch
                                    isChecked={staff.app_user != null}
                                    onChange={() => {
                                      if (staff.app_user != null) {
                                        deactivateSelectedTeachers(staff.id);
                                      } else {
                                        activateSelectedTeachers(staff);
                                      }
                                    }}
                                    colorScheme={
                                      staff.app_user != null ? "green" : "red"
                                    }
                                    size="sm"
                                    ml={2}
                                  />
                                </Box>
                              </Tooltip>
                            </Td>
                          )}
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
        <AddStaff
          themeColor={themeColor}
          data={toggleDrawer}
          closeDrawer={() => setToggleDrawer(null)}
        />
      )}
    </Box>
  );
};
