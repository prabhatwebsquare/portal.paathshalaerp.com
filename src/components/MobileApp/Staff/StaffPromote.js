import {
  Box,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Checkbox,
  Button,
  HStack,
  Avatar,
} from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { LoadingContainer } from "@/common/LoadingContainer";
import { useStaffStore } from "@/store/StaffStore";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { useMobileAppStore } from "@/store/MobileApp";
import { CustomSelect } from "@/common/CustomSelect";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { URL } from "@/services/apis";

export const StaffPromote = ({ themeColor, sessionMasterId , pageName }) => {
  const [selectedStaff, setSelectedStaff] = useState([]);
  const { getStaffAction, getStaffStatus, allStaffs , promoteStaffAction , promoteStaffStatus } = useStaffStore((s) => ({
    getStaffAction: s.getStaffAction,
    getStaffStatus: s.getStaffStatus,
    allStaffs: s.allStaffs,
    promoteStaffAction: s.promoteStaffAction,
    promoteStaffStatus: s.promoteStaffStatus,
  }));

  useEffect(() => {
    if ((getStaffStatus || 1) === STATUS.NOT_STARTED) {
      getStaffAction();
    }
  }, [getStaffAction, getStaffStatus]);

  const handleCheckboxChange = (staffId) => {
    setSelectedStaff((prev) => {
      if (prev.includes(staffId)) {
        return prev.filter((id) => id !== staffId);
      } else {
        return [...prev, staffId];
      }
    });
  };

  const isReceptionPage = pageName === "Receiption";
  const isAppPage = pageName === "App_Staff_List";
  const [visibleAuthCodeId, setVisibleAuthCodeId] = useState(null);
  const { getSessionAction, getSessionStatus, allSessions } =
    useAdditionalSetupStore((s) => ({
      getSessionAction: s.getSessionAction,
      getSessionStatus: s.getSessionStatus,
      allSessions: s.allSessions,
    }));

  useEffect(() => {
    if ((getSessionStatus || 1) === STATUS.NOT_STARTED) {
      getSessionAction();
    }
  }, [getSessionAction, getSessionStatus]);
  const [inputValue, setInputValue] = useState({
    sessionMasterId: "",
  });
  const promoteStudent = () => {
    const data = {
      staffIds: selectedStaff,
      sessionMasterId: inputValue.sessionMasterId,
    };
    promoteStaffAction(data);
  };

  useEffect(() => {
    if(promoteStaffStatus === STATUS.SUCCESS) {
      setSelectedStaff([]);
      setInputValue({ sessionMasterId: "" });
      getStaffAction();
    }
  
    return () => {
      
    }
  }, [promoteStaffStatus])
  

  return (
    <Box>
      <PageHeader
        heading={"Staff Promote"}
        extra={<Button colorScheme={themeColor} size={"sm"}  disabled={promoteStaffStatus == STATUS.FETCHING || !selectedStaff?.length || !inputValue.sessionMasterId} loadingText={"Promoting.."} isLoading={promoteStaffStatus == STATUS.FETCHING} onClick={promoteStudent}>Promote Staff</Button>}
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <CustomSelect
          size="md"
          w={"20%"}
          name="sessionMasterId"
          label="Select Session to Prmote" 
          inputValue={inputValue}
          setInputValue={setInputValue}
          data={map(allSessions?.filter((d) => d?.id !== sessionMasterId) || [], (d) => ({
            value: d?.id,
            name: d?.name,
          }))}
          bg="gray.50"
          borderColor={`${themeColor}.200`}
          focusBorderColor={`${themeColor}.500`}
          borderRadius="md"
        />
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getStaffStatus}>
            {allStaffs?.length ? (
              <TableContainer mt={2}>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>
                        <Checkbox
                          isChecked={
                            selectedStaff?.length ===
                            allStaffs?.filter((staff) => staff?.app_user).length
                          }
                          isIndeterminate={
                            selectedStaff.length > 0 &&
                            selectedStaff.length <
                              allStaffs?.filter((staff) => staff?.app_user)
                                .length
                          }
                          onChange={() => {
                            if (
                              selectedStaff.length ===
                              allStaffs?.filter((staff) => staff?.app_user)
                                .length
                            ) {
                              setSelectedStaff([]);
                            } else {
                              setSelectedStaff(
                                allStaffs
                                  ?.filter((staff) => staff?.app_user)
                                  .map((staff) => staff.id)
                              );
                            }
                          }}
                        />
                      </Th>
                      <Th>S No.</Th>
                      <Th>Name</Th>
                      <Th>{isAppPage ? "Username" : "Mobile No."}</Th>
                      <Th>Designation</Th>
                      {!isReceptionPage && (
                        <>
                          <Th>App UserName</Th>
                          <Th>App Password</Th>
                        </>
                      )}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(
                      allStaffs?.filter((staff) => staff?.app_user),
                      (staff, index) =>
                        staff ? (
                          <Tr key={staff.id}>
                            <Td>
                              <Checkbox
                                isChecked={selectedStaff.includes(staff.id)}
                                onChange={() => handleCheckboxChange(staff.id)}
                              />
                            </Td>
                            <Td>{index + 1}</Td>

                            <Td>
                              <HStack spacing={2}>
                                <Avatar 
                                  size="sm"
                                  name={staff.name}
                                  src={`${URL}${staff.photo}`}
                                />
                                <Text>{staff.name}</Text>
                              </HStack>
                            </Td>
                            <Td>{staff.mobileNo}</Td>
                            <Td>{staff.designation}</Td>
                            {!isReceptionPage && (
                              <>
                          
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
                                          : "******"}
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
    </Box>
  );
};
