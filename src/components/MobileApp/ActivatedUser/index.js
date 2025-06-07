import CustomInput from "@/common/CustomInput";
import { LoadingContainer } from "@/common/LoadingContainer";
import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { groupBy, map, uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { AssignStudents } from "./AssignStudents";
import { useMobileAppStore } from "@/store/MobileApp";
import { NoData } from "@/common/NoData";
import { ConfirmAlert } from "@/common/ConfirmationAlert";
import { CustomSelect } from "@/common/CustomSelect";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { DeleteIcon } from "@chakra-ui/icons";

export const ActivatedUser = ({ themeColor, sessionMasterId }) => {
  const [inputValue, setInputValue] = useState({});
  const [toggleModal, setToggleModal] = useState(null);
  const [toggleDeactivate, setToggleDeactivate] = useState(null);

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  const {
    getActivateStdDashAction,
    getActivateStdDashStatus,
    allActivateStdDashs,
    getActivateStdAction,
    getActivateStdStatus,
    allActivateStds,
    deleteActivateStdAction,
    deleteActivateStdStatus,
    resetActivateStdStatus,
  } = useMobileAppStore((s) => ({
    getActivateStdDashAction: s.getActivateStdDashAction,
    getActivateStdDashStatus: s.getActivateStdDashStatus,
    allActivateStdDashs: s.allActivateStdDashs,
    getActivateStdAction: s.getActivateStdAction,
    getActivateStdStatus: s.getActivateStdStatus,
    allActivateStds: s.allActivateStds,
    deleteActivateStdAction: s.deleteActivateStdAction,
    deleteActivateStdStatus: s.deleteActivateStdStatus,
    resetActivateStdStatus: s.resetActivateStdStatus,
  }));

  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
  }, [getActivateStdDashAction, getClassSubjectAction, getClassSubjectStatus]);

  useEffect(() => {
    getActivateStdDashAction({ sessionMasterId });
  }, [getActivateStdDashAction, sessionMasterId]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const getActivatedStd = (e) => {
    e.preventDefault();
    getActivateStdAction({ ...inputValue, sessionMasterId });
  };
  const getStudents = () => {
    if (inputValue?.classMasterId) {
      getActivateStdAction({ ...inputValue, sessionMasterId });
    }
  };

  const deactivateStd = () => {
    deleteActivateStdAction(toggleDeactivate);
  };

  useEffect(() => {
    if (deleteActivateStdStatus === STATUS.SUCCESS) {
      resetActivateStdStatus();
      setToggleDeactivate(null);
    }
  }, [deleteActivateStdStatus, resetActivateStdStatus]);

  return (
    <Box h={"100%"}>
      <PageHeader
        heading={"Student (App User)"}
        extra={
          HasPermission(PERMISSIONS.ACTIVATED_STUDENT_ADD) && (
            <Button
              px={4}
              size={"sm"}
              colorScheme={themeColor}
              onClick={() => setToggleModal({})}
            >
              Assign Student
            </Button>
          )
        }
      />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getActivateStdDashStatus}>
            <Flex gap={4}>
              <AppCount
                title={"Total App Limit"}
                count={allActivateStdDashs?.total}
                bg={"green.200"}
              />
              <AppCount
                title={"App Activate Student"}
                count={allActivateStdDashs?.student}
                bg={"blue.200"}
              />
              <AppCount
                title={"App Unused Student"}
                count={allActivateStdDashs?.unUsed}
                bg={"red.200"}
              />
            </Flex>
            <Flex mt={3} justify={"space-between"}>
              <form style={{ width: "40%" }} onSubmit={getActivatedStd}>
                <Flex pb={3} gap={4}>
                  <CustomSelect
                    size={"sm"}
                    name={"classMasterId"}
                    label={"Select Class"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    data={map(classes, (d, key) => ({
                      value: key,
                      name: d?.[0]?.class_master?.name,
                    }))}
                  />
                  <CustomSelect
                    size={"sm"}
                    name={"streamMasterId"}
                    label={"Select Stream"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    data={map(
                      uniqBy(
                        classes?.[inputValue?.classMasterId],
                        "streamMasterId"
                      ),
                      (d, index) => ({
                        value: d.stream_master.id,
                        name: d.stream_master.name,
                      })
                    )}
                  />
                  <Button type="submit" size={"sm"} colorScheme={themeColor}>
                    Get
                  </Button>
                </Flex>
              </form>
            </Flex>
            <LoadingContainer status={getActivateStdStatus}>
              {allActivateStds?.data?.length ? (
                <TableContainer>
                  <Table w="100%" size={"sm"} variant={"simple"}>
                    <Thead>
                      <Tr bg="gray.100">
                        <Th>S No.</Th>
                        <Th>Name</Th>
                        <Th>Contact</Th>
                        <Th>UserName</Th>
                        <Th>Password</Th>
                        <Th>Activate At</Th>
                        {HasPermission(PERMISSIONS.ACTIVATED_STUDENT_EDIT) && (
                          <Th>Action</Th>
                        )}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {map(allActivateStds?.data, (std, index) => {
                        return (
                          <Tr
                            key={index}
                            _hover={{ bg: "gray.50" }}
                            cursor={"pointer"}
                          >
                            <Td>{index + 1}</Td>
                            <Td>
                              <Flex>
                                <Avatar mr={3} size={"xs"} src={std.photo} />
                                {std.name}
                              </Flex>
                            </Td>
                            <Td>{std.mobileNo}</Td>
                            <Td>{std.username}</Td>
                            <Td>{std.authCode}</Td>
                            <Td>
                              {std.date
                                ? dayjs(std.date).format("DD-MM-YYYY")
                                : null}
                            </Td>
                            {/* <Td>{dayjs().format("DD-MM-YYYY")}</Td> */}
                            {HasPermission(
                              PERMISSIONS.ACTIVATED_STUDENT_EDIT
                            ) && (
                              <Td>
                                <Button
                                  size={"xs"}
                                  variant={"outline"}
                                  colorScheme={"red"}
                                  leftIcon={<DeleteIcon />}
                                  onClick={() => setToggleDeactivate(std.id)}
                                >
                                  Delete 
                                </Button>
                              </Td>
                            )}
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <NoData title={"No Activated Student Found"} />
              )}
           
            </LoadingContainer>
          </LoadingContainer>
          {toggleModal && (
                <AssignStudents
                  data={toggleModal}
                  closeDrawer={() => setToggleModal(null)}
                  sessionMasterId={sessionMasterId}
                  themeColor={themeColor}
                  getStudents={getStudents}
                />
              )}
              {toggleDeactivate && (
                <ConfirmAlert
                  data={toggleDeactivate}
                  button={"Delete"}
                  heading={"Delete Confirmation"}
                  description={
                    "Are you sure? Do you want to Delete Student?"
                  }
                  closeAlert={() => setToggleDeactivate(null)}
                  confirm={deactivateStd}
                  loading={deleteActivateStdStatus === STATUS.FETCHING}
                  sessionMasterId={sessionMasterId}
                  themeColor={themeColor}
                />
              )}
        </Box>
      </Box>
    </Box>
  );
};

const AppCount = ({ title, count, bg }) => {
  return (
    <Box
      w={"20%"}
      px={3}
      py={1}
      border={"1px solid"}
      borderColor={"gray.200"}
      borderRadius={10}
      bg={bg}
    >
      <Text fontWeight={"semibold"}>{title}</Text>
      <Text mt={1} fontSize={20}>
        {count}
      </Text>
    </Box>
  );
};
