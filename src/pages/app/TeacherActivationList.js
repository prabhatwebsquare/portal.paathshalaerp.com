import React, { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/common/PageHeader";
import { MainLayout } from "@/layout/MainLayout";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useMobileAppStore } from "@/store/MobileApp";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { ConfirmAlert } from "@/common/ConfirmationAlert";
import { NoData } from "@/common/NoData";
import { AddIcon } from "@chakra-ui/icons";

function TeacherActivationList() {
  const themeColor = useMemo(() => getLocalStorageItem("themeColor"), []);
  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
  );
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [toggleDeactivate, setToggleDeactivate] = useState(null);

  const {
    deleteteacherActivationAction,
    deleteteacherActivationStatus,
    resetActivatetecherStatus,
    allActivateTeacher,
    getActivateteacherAction,
    getActivateTeacherStatus,
    ActivateTeacherAction,
    ActivateTeacherStatus,
  } = useMobileAppStore((s) => ({
    deleteteacherActivationAction: s.deleteteacherActivationAction,
    deleteteacherActivationStatus: s.deleteteacherActivationStatus,
    resetActivatetecherStatus: s.resetActivatetecherStatus,
    allActivateTeacher: s.allActivateTeacher,
    getActivateteacherAction: s.getActivateteacherAction,
    getActivateTeacherStatus: s.getActivateTeacherStatus,
    ActivateTeacherAction: s.ActivateTeacherAction,
    ActivateTeacherStatus: s.ActivateTeacherStatus,
  }));

  useEffect(() => {
    getActivateteacherAction();
  }, []);

  useEffect(() => {
    if (deleteteacherActivationStatus === STATUS.SUCCESS) {
      resetActivatetecherStatus();
      setToggleDeactivate(null);
    }
  }, [deleteteacherActivationStatus, resetActivatetecherStatus]);

  const handleTeacherSelect = (teacherId) => {
    setSelectedTeachers((prevSelectedTeachers) =>
      prevSelectedTeachers.includes(teacherId)
        ? prevSelectedTeachers.filter((id) => id !== teacherId)
        : [...prevSelectedTeachers, teacherId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTeachers.length === allActivateTeacher?.data?.length) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(
        allActivateTeacher?.data?.map((teacher) => teacher.id)
      );
    }
  };

  const deactivateSelectedTeachers = () => {
    if (toggleDeactivate) {
      deleteteacherActivationAction(toggleDeactivate);
    }
  };

  const activateSelectedTeachers = () => {
    if (selectedTeachers) {
      const data = {
        sessionMasterId,
        staffData: selectedTeachers,
      };
      ActivateTeacherAction(data);
    }
  };

  return (
    <MainLayout>
      <Box>
        <PageHeader
          heading={"Teacher List"}
          extra={
            <Button
              size={"sm"}
              colorScheme={themeColor}
              leftIcon={<AddIcon />}
              onClick={activateSelectedTeachers}
              // isDisabled={selectedTeachers.length === 0}
            >
              Active Teachers
            </Button>
          }
        />
        <Box p={5} bg={"white"} h={"78vh"}>
          <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
            <LoadingContainer status={getActivateTeacherStatus}>
              {allActivateTeacher?.data?.length ? (
                <TableContainer>
                  <Table w="100%" size={"sm"} variant={"simple"}>
                    <Thead>
                      <Tr bg="gray.100">
                        <Th>
                          <Checkbox
                            isChecked={
                              selectedTeachers.length ===
                              allActivateTeacher?.data?.length
                            }
                            onChange={handleSelectAll}
                          />
                        </Th>
                        <Th>S No.</Th>
                        <Th>Name</Th>
                        <Th>Contact</Th>
                        <Th>Gender</Th>
                        <Th>Email</Th>
                        <Th>UserName</Th>
                        <Th>Password</Th>
                        {HasPermission(PERMISSIONS.ACTIVATED_STUDENT_EDIT) && (
                          <Th>Action</Th>
                        )}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {allActivateTeacher?.data?.map((teacher, index) => (
                        <Tr
                          key={teacher.id}
                          _hover={{ bg: "gray.50" }}
                          cursor={"pointer"}
                        >
                          <Td>
                            <Checkbox
                              isChecked={selectedTeachers.includes(teacher.id)}
                              onChange={() => handleTeacherSelect(teacher.id)}
                            />
                          </Td>
                          <Td>{index + 1}</Td>
                          <Td>
                            <Flex>
                              <Avatar mr={3} size={"xs"} src={teacher.photo} />
                              {teacher.name} - {teacher?.employeeId}
                            </Flex>
                          </Td>
                          <Td>{teacher.mobileNo}</Td>
                          <Td>{teacher.gender || "N/A"}</Td>
                          <Td>{teacher.email || "N/A"}</Td>
                          <Td>{teacher?.app_user?.username || "N/A"}</Td>
                          <Td>{teacher?.app_user?.authCode || "N/A"}</Td>

                          <Td>
                            <Button
                              size={"sm"}
                              variant={"outline"}
                              colorScheme={
                                teacher?.app_user == null ? "gray" : "red"
                              }
                              disabled={teacher?.app_user == null}
                              onClick={() =>
                                setToggleDeactivate(teacher?.app_user?.id)
                              }
                            >
                              Deactive
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <NoData title={"No Activated Teachers Found"} />
              )}

              {toggleDeactivate && (
                <ConfirmAlert
                  data={toggleDeactivate}
                  button={"Deactivate"}
                  heading={"Deactivate Confirmation"}
                  description={
                    "Are you sure? Do you want to Deactivate Teacher?"
                  }
                  closeAlert={() => setToggleDeactivate(null)}
                  confirm={deactivateSelectedTeachers}
                  loading={deleteteacherActivationStatus === STATUS.FETCHING}
                  sessionMasterId={sessionMasterId}
                  themeColor={themeColor}
                />
              )}
            </LoadingContainer>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}

export default TeacherActivationList;
