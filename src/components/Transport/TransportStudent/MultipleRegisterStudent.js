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
  Th,
  Thead,
  Tr,
  Stepper,
  Step,
  StepDescription,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
} from "@chakra-ui/react";
import { find, findIndex, groupBy, map, uniqBy, filter } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { useClassSetupStore } from "@/store/classSetup";
import { STATUS } from "@/constant";
import { useTransportFeesStore } from "@/store/TransportFees";
import { useTransportStore } from "@/store/Transport";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { CustomSelect } from "@/common/CustomSelect";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { MdCurrencyRupee, MdPercent } from "react-icons/md";
import Pagination from "@/common/Pagination";
import dayjs from "dayjs";
import { useRouter } from "next/router";

export const MultipleRegisterStudent = ({ themeColor, sessionMasterId }) => {
  const [inputValue, setInputValue] = useState({});
  const [step, setStep] = useState(1);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  const {
    getStdNonRegistrationAction,
    getStdNonRegistrationStatus,
    allStdNonRegistrations,
    addStdMulRegistrationAction,
    addStdMulRegistrationStatus,
    resetMulRegistrationStatus
  } = useTransportFeesStore((s) => ({
    getStdNonRegistrationAction: s.getStdNonRegistrationAction,
    getStdNonRegistrationStatus: s.getStdNonRegistrationStatus,
    allStdNonRegistrations: s.allStdNonRegistrations,
    addStdMulRegistrationAction: s.addStdMulRegistrationAction,
    addStdMulRegistrationStatus: s.addStdMulRegistrationStatus,
    resetMulRegistrationStatus : s.resetMulRegistrationStatus
  }));

  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
  }, [getClassSubjectAction, getClassSubjectStatus]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const getTransportStudent = (e) => {
    e.preventDefault();
    getStdNonRegistrationAction({
      ...inputValue,
      sessionMasterId,
      page: 1,
      limit: 10,
    });
  };

  useEffect(() => {
    if (
      currentPage &&
      limit &&
      inputValue?.classMasterId &&
      inputValue?.streamMasterId
    )
      getStdNonRegistrationAction({
        page: currentPage,
        limit: parseInt(limit),
        ...inputValue,
        sessionMasterId,
      });
  }, [currentPage, , limit]);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const selectAllStd = () => {
    const allStudents = allStdNonRegistrations?.data || [];
    if (selectedStudent?.length === allStudents.length) {
      setSelectedStudent([]);
    } else {
      setSelectedStudent(map(allStudents, (s) => ({ id: s.id })));
    }
  };

  const handleCheck = (id) => {
    if (findIndex(selectedStudent, (s) => s.id === id) !== -1) {
      setSelectedStudent(filter(selectedStudent, (s) => s.id !== id));
    } else {
      setSelectedStudent([...selectedStudent, { id }]);
    }
  };

  const steps = [
    { title: "Step 1", description: "Select Students" },
    { title: "Step 2", description: "Assign Transport & Route" },
    { title: "Step 3", description: "Set Transport Fees" },
  ];
  const [checkedFees, setCheckedFees] = useState([]);

  const handleCheckFees = (feeId) => {
    setCheckedFees(
      (prev) =>
        prev.includes(feeId)
          ? prev.filter((id) => id !== feeId) // uncheck
          : [...prev, feeId] // check
    );
  };
  const router = useRouter()
  const handleNext = async () => {
    if (step === steps.length) {
      const payloadData = {
        feesData: checkedFees,
        feesMode: 2,
        isEdit: 0,
        promotionId: selectedStudent.map((data) => data.id),
        sessionMasterId,
        transportRouteId: inputValue.transportRouteId,
        vehicleId: SingleRouteDetail.vehicle.id,
        shiftId: SingleRouteDetail.shiftId,
      };
      await addStdMulRegistrationAction(payloadData);
    } else if (step < steps.length) {
      setStep(step + 1);
    }
  };

  useEffect(() => {
    if (addStdMulRegistrationStatus === STATUS.SUCCESS) {
      resetMulRegistrationStatus();
      window.location.reload(); 
    }
    return () => {};
  }, [addStdMulRegistrationStatus]);
  

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  const {
    getStationFeesAction,
    getStationFeesStatus,
    allStationFees,
    getRouteAction,
    getRouteStatus,
    allRoutes,
  } = useTransportStore((s) => ({
    getStationFeesAction: s.getStationFeesAction,
    getStationFeesStatus: s.getStationFeesStatus,
    allStationFees: s.allStationFees,
    getRouteAction: s.getRouteAction,
    getRouteStatus: s.getRouteStatus,
    allRoutes: s.allRoutes,
  }));
  useEffect(() => {
    if ((getRouteStatus || 1) === STATUS.NOT_STARTED) {
      getRouteAction({ sessionMasterId });
    }
  }, [getRouteAction, getRouteStatus]);
  const { getRouteByIdAction, getShiftByIdStatus, SingleRouteDetail } =
    useAdditionalSetupStore((s) => ({
      getRouteByIdAction: s.getRouteByIdAction,
      getShiftByIdStatus: s.getShiftByIdStatus,
      SingleRouteDetail: s.SingleRouteDetail,
    }));

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
    if (inputValue?.stationMasterId) {
      getStationFeesAction({
        stationMasterId: inputValue.stationMasterId,
        sessionMasterId,
        classMasterId: inputValue.classMasterId,
      });
    }
  }, [inputValue?.stationMasterId, inputValue?.classMasterId, sessionMasterId]);

  return (
    <Box>
      <PageHeader heading={"Bulk Registration"} />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
          <Stepper index={step - 1} colorScheme={themeColor} size="lg">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={
                      <StepNumber bg={`${themeColor}.500`} color="white" />
                    }
                    incomplete={
                      <StepNumber borderColor={`${themeColor}.500`} />
                    }
                    active={
                      <StepNumber
                        bg={`${themeColor}.500`}
                        color="white"
                        borderWidth={2}
                        borderRadius={"full"}
                        borderColor={`${themeColor}.500`}
                        boxShadow="0 0 0 4px rgba(0,0,0,0.1)"
                        transform="scale(1.1)"
                        transition="all 0.2s"
                      />
                    }
                  />
                </StepIndicator>
                <Box flexShrink="0" ml={4}>
                  <StepTitle
                    fontSize="lg"
                    fontWeight="bold"
                    color={`${themeColor}.700`}
                  >
                    {step.title}
                  </StepTitle>
                  <StepDescription color="gray.600">
                    {step.description}
                  </StepDescription>
                </Box>
                <StepSeparator />
              </Step>
            ))}
          </Stepper>
        </Box>

        {step === 1 ? (
          <>
            <Flex pt={3} justify={"space-between"}>
              <form style={{ width: "60%" }} onSubmit={getTransportStudent}>
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
                      (d) => ({
                        value: d.stream_master.id,
                        name: d.stream_master.name,
                      })
                    )}
                  />
                  <Button
                    type="submit"
                    size={"sm"}
                    px={10}
                    colorScheme={themeColor}
                  >
                    Get
                  </Button>
                </Flex>
              </form>
              <Pagination
                totalItems={allStdNonRegistrations?.totalCount}
                limit={limit}
                setLimit={setLimit}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                themeColor={themeColor}
              />
            </Flex>
            <Box
              w={"100%"}
              className="scrollBar"
              maxH={"70%"}
              overflowY={"scroll"}
              mt={7}
              bg="white"
              // p={2}
              // borderRadius="lg"
              // boxShadow="md"
            >
              <LoadingContainer status={getStdNonRegistrationStatus}>
                {allStdNonRegistrations?.data?.length ? (
                  <TableContainer mt={2}>
                    <Table w="100%" size={"sm"} variant={"simple"}>
                      <Thead>
                        <Tr bg="gray.100">
                          <Th>
                            <Checkbox
                              colorScheme={themeColor}
                              isChecked={
                                selectedStudent?.length > 0 &&
                                selectedStudent?.length ===
                                  allStdNonRegistrations?.data?.length
                              }
                              isIndeterminate={
                                selectedStudent?.length > 0 &&
                                selectedStudent?.length <
                                  allStdNonRegistrations?.data?.length
                              }
                              onChange={selectAllStd}
                            />
                          </Th>
                          <Th>Sr. No.</Th>
                          <Th>Student Name</Th>
                          <Th>Father&apos;s Name</Th>
                          <Th>Contact Number</Th>
                          <Th>Address</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {map(allStdNonRegistrations?.data, (std, index) => {
                          const student = std?.student_master;
                          const classData = std?.class_master;
                          const stream = std?.stream_master;
                          const isChecked =
                            findIndex(
                              selectedStudent,
                              (s) => s.id === std.id
                            ) !== -1;

                          return (
                            <Tr key={std.id}>
                              <Td>
                                <Checkbox
                                  colorScheme={themeColor}
                                  isChecked={isChecked}
                                  onChange={() => handleCheck(std.id)}
                                />
                              </Td>
                              <Td>{student?.srNo || "-"}</Td>
                              <Td>{student?.studentName || "-"}</Td>
                              <Td>{student?.fatherName || "-"}</Td>
                              <Td>{student?.studentContact || "-"}</Td>
                              <Td>{student?.address || "-"}</Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TableContainer>
                ) : (
                  <NoData title={"No Transport Student Found"} />
                )}
              </LoadingContainer>
            </Box>
          </>
        ) : step === 2 ? (
          <Flex
            direction="row"
            gap={2}
            justify="space-between"
            align="center"
            mt={5}
          >
            <CustomSelect
              w="50%"
              name="transportRouteId"
              label="Select Route"
              inputValue={inputValue}
              setInputValue={setInputValue}
              data={map(allRoutes, (d) => ({
                value: d?.id,
                name: d?.name,
              }))}
            />
            <CustomSelect
              w="50%"
              name="stationMasterId"
              label="Select Station"
              inputValue={inputValue}
              setInputValue={setInputValue}
              data={map(SingleRouteDetail?.assign_stations, (stat) => ({
                value: stat.station_master.id,
                name: stat.station_master.name,
              }))}
            />
          </Flex>
        ) : step === 3 ? (
          <Box
            w={"100%"}
            className="scrollBar"
            maxH={"70%"}
            overflowY={"scroll"}
            mt={7}
            bg="white"
            // p={5}
            // borderRadius="lg"
            // boxShadow="md"
          >
            <LoadingContainer status={getStationFeesStatus}>
              {allStationFees?.length ? (
                map(allStationFees, (fee, index) => {
                  const isChecked = checkedFees.includes(fee.id);

                  return (
                    <Flex
                      key={fee.id}
                      my={3}
                      p={3}
                      justify={"space-between"}
                      border={"1px solid"}
                      borderColor={"gray.200"}
                      borderRadius={5}
                    >
                      <Checkbox
                        isChecked={isChecked}
                        colorScheme={themeColor}
                        onChange={() => handleCheckFees(fee.id)}
                      />

                      <Box w={"80%"}>
                        <Text fontSize={14} fontWeight={"semibold"}>
                          {fee.transport_fee_master.name}
                        </Text>
                        <Flex fontSize={13} color={"gray.700"}>
                          <Text>
                            Due Date: &nbsp;
                            {dayjs(fee.dueDate).format("DD-MM-YYYY")}
                          </Text>
                          <Text ml={5}>Fees: &nbsp; {fee.feeAmount}</Text>
                          <Flex ml={5}>
                            Late Fees: &nbsp;
                            <Flex align={"center"}>
                              {fee.lateFees}
                              {fee.isPercent ? (
                                <MdPercent />
                              ) : (
                                <MdCurrencyRupee />
                              )}
                              / {fee.isDaily ? "Day" : "Month"}
                            </Flex>
                          </Flex>
                        </Flex>
                      </Box>

                      <Box w={"10%"}>
                        {/* You can add extra input here later if needed */}
                      </Box>
                    </Flex>
                  );
                })
              ) : (
                <NoData title={"There is no Fee Assign"} />
              )}
            </LoadingContainer>
          </Box>
        ) : null}

        {/* Step Navigation Buttons */}
        <Flex justify="space-between" mt={8}>
          <Button
            onClick={handlePrevious}
            isDisabled={step === 1}
            variant="outline"
            colorScheme={themeColor}
          >
            Previous
          </Button>
          <Button onClick={handleNext} colorScheme={themeColor}>
            {step === steps.length ? "Finish" : "Next"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};
