import CustomArrayInput from "@/common/CustomArrayInput";
import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { STATUS } from "@/constant";
import { FILE_URL, URL } from "@/services/apis";
import { useTransportStore } from "@/store/Transport";
import { useTransportFeesStore } from "@/store/TransportFees";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { useStdFeesStore } from "@/store/stdFees";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Image,
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
import { filter, find, findIndex, map } from "lodash";
import { useEffect, useState } from "react";
import { MdCurrencyRupee, MdPercent } from "react-icons/md";

export const StudentRegistration = ({
  themeColor,
  sessionMasterId,
  data,
  closeDrawer,
}) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          transportRouteId: data.transportRouteId,
          stationMasterId: data.station_master.id,
        }
      : {}
  );
  const [searchInput, setSearchInput] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(
    data?.id ? data.promotion : null
  );
  const [selectedFees, setSelectedFees] = useState([]);
  const { searchStudentAction, searchStudentStatus, searchStd, resetSearch } =
    useStdFeesStore((s) => ({
      searchStudentAction: s.searchStudentAction,
      searchStudentStatus: s.searchStudentStatus,
      searchStd: s.searchStd,
      resetSearch: s.resetSearch,
    }));
  const {
    getStationAction,
    getStationStatus,
    allStations,
    getCheckFeesAction,
    getCheckFeesStatus,
    allCheckFees,
    resetCheckFees,
    getRouteAction,
    getRouteStatus,
    allRoutes,
  } = useTransportStore((s) => ({
    getStationAction: s.getStationAction,
    getStationStatus: s.getStationStatus,
    allStations: s.allStations,
    getCheckFeesAction: s.getCheckFeesAction,
    getCheckFeesStatus: s.getCheckFeesStatus,
    allCheckFees: s.allCheckFees,
    resetCheckFees: s.resetCheckFees,
    getRouteAction: s.getRouteAction,
    getRouteStatus: s.getRouteStatus,
    allRoutes: s.allRoutes,
  }));

  const {
    addStdRegistrationAction,
    addStdRegistrationStatus,
    resetRegistrationStatus,
    getStdRegistrationAction,
  } = useTransportFeesStore((s) => ({
    addStdRegistrationAction: s.addStdRegistrationAction,
    addStdRegistrationStatus: s.addStdRegistrationStatus,
    resetRegistrationStatus: s.resetRegistrationStatus,
    getStdRegistrationAction: s.getStdRegistrationAction,
  }));

  useEffect(() => {
    if ((getStationStatus || 1) === STATUS.NOT_STARTED) {
      getStationAction();
    }
  }, [getStationAction, getStationStatus]);

  useEffect(() => {
    return () => resetCheckFees();
  }, [resetCheckFees]);

  useEffect(() => {
    if (inputValue?.stationMasterId) {
      getCheckFeesAction({
        stationMasterId: inputValue.stationMasterId,
        sessionMasterId,
        classMasterId: selectedStudent.class_master?.id,
        promotionId: data.promotionId || selectedStudent.promotionId,
      });
    }
  }, [
    getCheckFeesAction,
    inputValue?.stationMasterId,
    selectedStudent?.class_master?.id,
    sessionMasterId,
  ]);

  const handleCheck = (id) => {
    if (findIndex(selectedFees, (s) => s === id) !== -1) {
      setSelectedFees(filter(selectedFees, (s) => s !== id));
    } else {
      setSelectedFees([...selectedFees, id]);
    }
  };
  const handleSearchInput = (val) => {
    setSearchInput({ filters: val });
    if (val?.length >= 1) {
      searchStudentAction({
        sessionMasterId,
        search: val,
      });
    }
  };

  const selectStudent = (std) => {
    resetSearch();
    setSelectedStudent(std);
  };
  useEffect(() => {
    if (allCheckFees?.exitFees) {
      setSelectedFees(allCheckFees.exitFees);
    }
    return () => {};
  }, [allCheckFees]);

  const [feesCollectList, setfeesCollectList] = useState([]);
  useEffect(() => {
    if (allCheckFees?.feesCollect) {
      setfeesCollectList(allCheckFees.feesCollect);
    }
    return () => {};
  }, [allCheckFees]);

  const saveDetails = (e) => {
    e.preventDefault();
    const temp = {
      feesMode: 2,
      sessionMasterId,
      promotionId: data.promotionId || selectedStudent.promotionId,
      vehicleId: SingleRouteDetail.vehicle.id,
      shiftId: SingleRouteDetail.shiftId,
      feesData: selectedFees,
      transportRouteId: inputValue.transportRouteId,
      isEdit: data?.promotionId ? 1 : 0,
    };
    addStdRegistrationAction(temp);
  };

  useEffect(() => {
    if (addStdRegistrationStatus === STATUS.SUCCESS) {
      resetRegistrationStatus();
      closeDrawer();
    }
  }, [addStdRegistrationStatus, closeDrawer, resetRegistrationStatus]);
  const {
    getShiftAction,
    getShiftStatus,
    allShifts,
    getRouteByIdAction,
    getShiftByIdStatus,
    SingleRouteDetail,
  } = useAdditionalSetupStore((s) => ({
    getShiftAction: s.getShiftAction,
    getShiftStatus: s.getShiftStatus,
    allShifts: s.allShifts,
    getRouteByIdAction: s.getRouteByIdAction,
    getShiftByIdStatus: s.getShiftByIdStatus,
    SingleRouteDetail: s.SingleRouteDetail,
  }));
  useEffect(() => {
    if ((getShiftStatus || 1) === STATUS.NOT_STARTED) {
      getShiftAction();
    }
  }, [getShiftAction, getShiftStatus]);

  useEffect(() => {
    const data = {
      transportRouteId: inputValue.transportRouteId,
      sessionMasterId,
    };
    if (!inputValue.transportRouteId) {
      return;
    }
    getRouteByIdAction(data);
  }, [inputValue.transportRouteId]);

  useEffect(() => {
    if ((getRouteStatus || 1) === STATUS.NOT_STARTED) {
      getRouteAction({ sessionMasterId });
    }
  }, [getRouteAction, getRouteStatus]);


  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={saveDetails}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Student Details" : "Student Registration"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                notRequire
                type={"text"}
                search={true}
                name="filters"
                label={"Search Student"}
                inputValue={searchInput}
                setInputValue={handleSearchInput}
              />
              <LoadingContainer status={searchStudentStatus}>
                <Box w={"100%"}>
                  {searchStd?.length ? (
                    <TableContainer mt={5}>
                      <Table>
                        <Thead>
                          <Tr>
                            <Th>SR No.</Th>
                            <Th>Name</Th>
                            <Th>Father&apos;s Name</Th>
                            <Th>Contact</Th>
                            <Th>Class</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {map(searchStd, (std) => (
                            <Tr>
                              <Td>{std.student_master.srNo}</Td>
                              <Td
                                color={"blue.400"}
                                fontWeight={"semibold"}
                                cursor={"pointer"}
                                onClick={() => selectStudent(std)}
                              >
                                <Flex>
                                  <Avatar
                                    mr={3}
                                    size={"xs"}
                                    src={FILE_URL + std.student_master.photo}
                                  />
                                  {std.student_master.studentName}
                                </Flex>
                              </Td>
                              <Td>{std.student_master.fatherName}</Td>
                              <Td>{std.student_master.fatherContact}</Td>
                              <Td>
                                {std.class_master.name} -{" "}
                                {std.stream_master.name}
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  ) : null}
                  {selectedStudent ? (
                    <>
                      <Flex
                        my={3}
                        p={2}
                        bg={`${themeColor}.50`}
                        border={"1px solid"}
                        borderColor={"gray.200"}
                        borderRadius={10}
                      >
                        <Box w={"15%"}>
                          <Avatar
                            size={"md"}
                            src={`${URL}${selectedStudent.student_master?.photo}`}
                            alt={"Profile"}
                          />
                        </Box>
                        <Box w={"60%"} fontSize={13} fontWeight={"semibold"}>
                          <Flex w={"100%"}>
                            <Text w={"35%"}>Name</Text>
                            <Text>
                              : &nbsp;
                              {selectedStudent.student_master?.studentName}
                            </Text>
                          </Flex>
                          <Flex w={"100%"}>
                            <Text w={"35%"}>Father&apos;s Name</Text>
                            <Text>
                              : &nbsp;
                              {selectedStudent.student_master?.fatherName}
                            </Text>
                          </Flex>
                          <Flex w={"100%"}>
                            <Text w={"35%"}>Contact </Text>
                            <Text>
                              : &nbsp;
                              {selectedStudent.student_master?.fatherContact}
                            </Text>
                          </Flex>
                        </Box>
                        <Box w={"40%"} fontSize={13} fontWeight={"semibold"}>
                          <Flex w={"90%"}>
                            <Text w={"40%"}>Class</Text>
                            <Text>
                              : &nbsp;{selectedStudent.class_master?.name}
                            </Text>
                          </Flex>
                          <Flex w={"90%"}>
                            <Text w={"40%"}>Stream</Text>
                            <Text>
                              : &nbsp;{selectedStudent.stream_master?.name}
                            </Text>
                          </Flex>
                        </Box>
                      </Flex>
                      <CustomSelect
                        disabled={feesCollectList.length > 0 ? true : false}
                        name={"transportRouteId"}
                        label={"Select Route"}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        data={map(allRoutes, (d, key) => ({
                          value: d?.id,
                          name: d?.name,
                        }))}
                      />
                      <CustomSelect
                disabled={feesCollectList.length > 0 ? true : false}
                        mt={5}
                        name={"stationMasterId"}
                        label={"Select Station"}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        data={map(
                          SingleRouteDetail?.assign_stations,
                          (stat) => ({
                            value: stat.station_master.id,
                            name: stat.station_master.name,
                          })
                        )}
                      />

                      <LoadingContainer status={getCheckFeesStatus}>
                        {allCheckFees?.assignTransportFees?.length ? (
                          map(
                            allCheckFees.assignTransportFees,
                            (fee, index) => {
                              const isChecked =
                                findIndex(selectedFees, (s) => s === fee.id) !==
                                -1
                                  ? true
                                  : false;
                              return (
                                <Flex
                                  my={3}
                                  p={3}
                                  justify={"space-between"}
                                  border={"1px solid"}
                                  borderColor={"gray.200"}
                                  borderRadius={5}
                                >
                                  <Checkbox
                                    isDisabled={feesCollectList?.some(
                                      (item) => item.assginId === fee.id
                                    )}
                                    isChecked={isChecked}
                                    colorScheme={themeColor}
                                    onChange={() => handleCheck(fee.id)}
                                  />

                                  <Box w={"80%"}>
                                    <Text fontSize={14} fontWeight={"semibold"}>
                                      {fee.transport_fee_master.name}
                                    </Text>
                                    <Flex fontSize={13} color={"gray.700"}>
                                      <Text>
                                        Due Date: &nbsp;{" "}
                                        {dayjs(fee.dueDate).format(
                                          "DD-MM-YYYY"
                                        )}
                                      </Text>
                                      <Text ml={5}>
                                        Fees: &nbsp; {fee.feeAmount}
                                      </Text>
                                      <Flex ml={5}>
                                        Late Fees: &nbsp;{" "}
                                        <Flex align={"center"}>
                                          {fee.lateFees}
                                          {fee.isPercent ? (
                                            <MdPercent />
                                          ) : (
                                            <MdCurrencyRupee />
                                          )}{" "}
                                          / {fee.isDaily ? "Day" : "Month"}
                                        </Flex>
                                      </Flex>
                                    </Flex>
                                  </Box>
                                  <Box w={"10%"}>
                                    {/* <CustomArrayInput type={"number"} name="amount" label={"Fees Amount"} inputValue={feesInput} setInputValue={setFeesInput} /> */}
                                  </Box>
                                </Flex>
                              );
                            }
                          )
                        ) : (
                          <NoData title={"There is no Fee Assign"} />
                        )}
                      </LoadingContainer>
                    </>
                  ) : null}
                </Box>
              </LoadingContainer>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              size={"sm"}
              variant="outline"
              mr={3}
              colorScheme={"red"}
              onClick={closeDrawer}
            >
              Cancel
            </Button>
            <Button
              size={"sm"}
              type="submit"
              colorScheme="green"
              isDisabled={selectedFees?.length ? false : true}
            >
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
