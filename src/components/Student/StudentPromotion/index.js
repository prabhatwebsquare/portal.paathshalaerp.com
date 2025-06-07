import { CustomSelect } from "@/common/CustomSelect";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import { useStudentStore } from "@/store/studentStore";
import { FaBook, FaBus, FaBed } from "react-icons/fa"; // Install react-icons if not already: npm install react-icons
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Icon,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { findIndex, groupBy, map, uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { FaUsers, FaCheckCircle, FaHourglassHalf } from "react-icons/fa"; // Ensure you have react-icons installed
import { FaUserCheck } from "react-icons/fa"; // Install react-icons if needed: npm install react-icons
import { useStdFeesStore } from "@/store/stdFees";
import { MdCurrencyRupee } from "react-icons/md";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { StudentFees } from "../StudentProfile/StudentFees";
export const StudentPromotion = ({ sessionMasterId, themeColor }) => {
  const steps = [
    { title: "First", description: "Select Students" },
    { title: "Second", description: "Fee Options" },
    { title: "Third", description: "Promotion Details" },
  ];

  const [activeStep, setActiveStep] = useState(0);

  const handleNextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBackStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [inputValue, setInputValue] = useState({
    sessionMasterId,
    promotionIds: [],
    latestSessionMasterId: "",
    latestClassMasterId: "",
    latestStreamMasterId: "",
    latestSectionMaster: "",
    isAcademicOpeningAmount: false,
    isTransportOpeningAmount: false,
    isHostal: false,
  });

  const { getSectionAction, getSectionStatus, allSections } =
    useClassSetupStore((s) => ({
      getSectionAction: s.getSectionAction,
      getSectionStatus: s.getSectionStatus,
      allSections: s.allSections,
    }));

  const {
    getClassSubjectAction,
    getClassSubjectCustomAction,
    getClassSubjectStatus,
    allClassSubjects,
  } = useClassSetupStore((s) => ({
    getClassSubjectAction: s.getClassSubjectAction,
    getClassSubjectStatus: s.getClassSubjectStatus,
    allClassSubjects: s.allClassSubjects,
    getClassSubjectCustomAction: s.getClassSubjectCustomAction,
  }));

  const {
    getPermotedStudentAction,
    getPermotedStudentStatus,
    PermotedStudent,
    resetPermotedStudent,
    addStudentPromoteAction,
    addStudentPromoteStatus,
    resetStudentPromoteStatus,
  } = useStdFeesStore((s) => ({
    addStudentPromoteAction: s.addStudentPromoteAction,
    addStudentPromoteStatus: s.addStudentPromoteStatus,
    getPermotedStudentAction: s.getPermotedStudentAction,
    getPermotedStudentStatus: s.getPermotedStudentStatus,
    PermotedStudent: s.PermotedStudent,
    resetPermotedStudent: s.resetPermotedStudent,
    resetStudentPromoteStatus: s.resetStudentPromoteStatus,
  }));

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
  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
    if ((getSectionStatus || 1) === STATUS.NOT_STARTED) {
      getSectionAction();
    }
  }, [
    getClassSubjectAction,
    getClassSubjectStatus,
    getSectionAction,
    getSectionStatus,
  ]);

  useEffect(() => {
    return () => resetPermotedStudent();
  }, [resetPermotedStudent]);

  useEffect(() => {
    return () => resetStudentPromoteStatus();
  }, [resetStudentPromoteStatus]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const Permoteclasses = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const getFilterStudent = (e) => {
    e.preventDefault();
    const AcadmicSearch = {
      sessionMasterId,
      ...inputValue,
    };
    getPermotedStudentAction(AcadmicSearch);
  };
  const selectAllStd = () => {
    if (
      inputValue.promotionIds?.length === PermotedStudent?.studentData?.length
    ) {
      setInputValue({
        ...inputValue,
        promotionIds: [],
      });
    } else {
      setInputValue({
        ...inputValue,
        promotionIds: PermotedStudent?.studentData.map((s) => s.id),
      });
    }
  };

  const handleCheck = (id) => {
    const index = inputValue.promotionIds.indexOf(id);
    if (index !== -1) {
      setInputValue({
        ...inputValue,
        promotionIds: inputValue.promotionIds.filter((item) => item !== id),
      });
    } else {
      setInputValue({
        ...inputValue,
        promotionIds: [...inputValue.promotionIds, id],
      });
    }
  };

  const handleFinish = () => {
    addStudentPromoteAction(inputValue);
  };
  useEffect(() => {
    if (addStudentPromoteStatus == STATUS.SUCCESS) {
      resetPermotedStudent();
      resetStudentPromoteStatus();
      setInputValue({});
      setActiveStep(0);
    }
    return () => {};
  }, [
    addStudentPromoteStatus,
    resetPermotedStudent,
    resetStudentPromoteStatus,
  ]);

  useEffect(() => {
    if (inputValue.latestSessionMasterId) {
      getClassSubjectCustomAction({
        sessionMasterId: inputValue.latestSessionMasterId,
      });
    }

    return () => {};
  }, [inputValue.latestSessionMasterId]);

  return (
    <Box>
      <Flex mb={3} bg={`${themeColor}.200`} p={3} borderRadius={10}>
        <Stepper w="100%" index={activeStep} colorScheme={themeColor}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>
              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>
              <StepSeparator />
            </Step>
          ))}
        </Stepper>
      </Flex>
      <Box p={3}>
        {/* Stage 1: Select Students */}
        {activeStep === 0 && (
          <Box
            bg="white"
            borderRadius="lg"
            boxShadow="md"
            p={6}
            borderWidth={1}
            borderColor={`${themeColor}.100`}
          >
            <Flex justify="space-between" align="center" mb={6}>
              <Text fontSize="lg" fontWeight="bold" color={`${themeColor}.700`}>
                Student Selection
              </Text>
              <Flex
                justify="space-between" // or "flex-start" depending on context
                align="center"
                bg={`${themeColor}.50`}
                p={3}
                borderRadius="lg"
                borderWidth={1}
                borderColor={`${themeColor}.200`}
                gap={6} // Slightly increased for better separation
                flexWrap="wrap" // Ensures responsiveness on smaller screens
                width="auto" // Prevents stretching; adjusts to content
              >
                <Flex align="center" gap={2}>
                  <Icon as={FaUsers} color={`${themeColor}.600`} boxSize={5} />
                  <Box>
                    <Text
                      fontSize="xs"
                      color={`${themeColor}.600`}
                      lineHeight="1"
                    >
                      Total
                    </Text>
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      color={`${themeColor}.800`}
                      lineHeight="1.2"
                    >
                      {PermotedStudent?.studentData?.length || 0}
                    </Text>
                  </Box>
                </Flex>
                <Flex align="center" gap={2}>
                  <Icon
                    as={FaCheckCircle}
                    color={`${themeColor}.600`}
                    boxSize={5}
                  />
                  <Box>
                    <Text
                      fontSize="xs"
                      color={`${themeColor}.600`}
                      lineHeight="1"
                    >
                      Promoted
                    </Text>
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      color={`${themeColor}.800`}
                      lineHeight="1.2"
                    >
                      {0}
                    </Text>
                  </Box>
                </Flex>
                <Flex align="center" gap={2}>
                  <Icon
                    as={FaHourglassHalf}
                    color={`${themeColor}.600`}
                    boxSize={5}
                  />
                  <Box>
                    <Text
                      fontSize="xs"
                      color={`${themeColor}.600`}
                      lineHeight="1"
                    >
                      Remaining
                    </Text>
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      color={`${themeColor}.800`}
                      lineHeight="1.2"
                    >
                      {(PermotedStudent?.studentData?.length || 0) - 0}
                      {/* promotedStudents?.length ||  */}
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </Flex>
            <form onSubmit={getFilterStudent}>
              <Flex direction="column" gap={6}>
                <Flex gap={4} wrap="wrap" align="flex-end">
                  <Box flex="1" minW="200px">
                    <CustomSelect
                      size="md"
                      name="classMasterId"
                      label="Select Class"
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      data={map(classes, (d, key) => ({
                        value: key,
                        name: d?.[0]?.class_master?.name,
                      }))}
                      bg="gray.50"
                      borderColor={`${themeColor}.200`}
                      focusBorderColor={`${themeColor}.500`}
                      borderRadius="md"
                    />
                  </Box>
                  <Box flex="1" minW="200px">
                    <CustomSelect
                      size="md"
                      name="streamMasterId"
                      label="Select Stream"
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
                      bg="gray.50"
                      borderColor={`${themeColor}.200`}
                      focusBorderColor={`${themeColor}.500`}
                      borderRadius="md"
                    />
                  </Box>
                  <Box flex="1" minW="200px">
                    <CustomSelect
                      size="md"
                      name="sectionMasterId"
                      label="Select Section"
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      data={map(allSections, (d) => ({
                        value: d.id,
                        name: d.name,
                      }))}
                      bg="gray.50"
                      borderColor={`${themeColor}.200`}
                      focusBorderColor={`${themeColor}.500`}
                      borderRadius="md"
                    />
                  </Box>
                  <Button
                    type="submit"
                    size="md"
                    colorScheme={themeColor}
                    px={6}
                    boxShadow="sm"
                    _hover={{ boxShadow: "md" }}
                  >
                    Get Students
                  </Button>
                </Flex>
              </Flex>
            </form>
            {(getPermotedStudentStatus || 1) === STATUS.NOT_STARTED ? (
              <Flex
                justify="center"
                mt={7}
                p={4}
                bg="gray.50"
                borderRadius="md"
              >
                <Text fontSize="md" color="gray.600">
                  Please select criteria and get class students first
                </Text>
              </Flex>
            ) : (
              <Box
                className="Scollbar"
                style={{ maxHeight: "50vh", overflowY: "auto" }}
              >
                <LoadingContainer status={getPermotedStudentStatus}>
                  <TableContainer
                    mt={6}
                    borderRadius="lg"
                    borderWidth={1}
                    borderColor={`${themeColor}.200`}
                    bg="white"
                    boxShadow="md" // Adds depth
                    overflow="hidden" // Ensures gradient doesn't bleed outside
                  >
                    <Table size="md" variant="simple">
                      <Thead>
                        <Tr
                          bgGradient={`linear(to-r, ${themeColor}.500, ${themeColor}.300)`} // Gradient header
                          color="white" // White text for contrast
                        >
                          <Th py={4} px={6}>
                            <Checkbox
                              colorScheme={themeColor}
                              isChecked={
                                inputValue.promotionIds?.length ===
                                PermotedStudent?.studentData?.length
                              }
                              onChange={selectAllStd}
                              size="lg"
                              bg="whiteAlpha.200" // Subtle background for checkbox
                              borderColor="whiteAlpha.400"
                              _checked={{
                                bg: `${themeColor}.600`,
                                borderColor: `${themeColor}.600`,
                              }}
                              _hover={{ bg: "whiteAlpha.300" }}
                            />
                          </Th>
                          <Th>Sr No.</Th>
                          <Th>Name</Th>
                          <Th>Father Name</Th>
                          <Th>Contact</Th>
                          <Th>Closeing Fees Amount</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {map(PermotedStudent?.studentData, (fee, index) => (
                          <Tr
                            key={index}
                            bg={index % 2 === 0 ? "gray.50" : "white"} // Zebra striping
                            transition="all 0.3s ease"
                            _hover={{
                              bg: `${themeColor}.100`, // Stronger hover effect
                              transform: "translateY(-2px)", // Slight lift
                              boxShadow: "sm",
                            }}
                            cursor="pointer"
                          >
                            <Td py={3} px={6}>
                              <Checkbox
                                colorScheme={themeColor}
                                isChecked={inputValue.promotionIds.includes(
                                  fee.id
                                )}
                                onChange={() => handleCheck(fee.id)}
                                size="lg"
                                borderColor={`${themeColor}.300`}
                                _checked={{
                                  bg: `${themeColor}.500`,
                                  borderColor: `${themeColor}.500`,
                                }}
                                _hover={{ borderColor: `${themeColor}.400` }}
                              />
                            </Td>
                            <Td py={3} px={6} color="gray.700">
                              {" "}
                              {fee.student_master?.srNo}
                            </Td>
                            <Td py={3} px={6} color="gray.700">
                              {" "}
                              {fee.student_master?.studentName}
                            </Td>
                            <Td py={3} px={6} color="gray.700">
                              {" "}
                              {fee.student_master?.fatherName}
                            </Td>
                            <Td py={3} px={6} color="gray.700">
                              {fee.student_master?.fatherContact}
                            </Td>

                            <Td>
                              <Flex
                                align={"center"}
                                justify={"start"}
                                color={"red.600"}
                              >
                                <MdCurrencyRupee />
                                {fee.totalFees +
                                  fee.totalLateFees -
                                  (fee.totalCollectFees +
                                    fee.totalCollectDiscount +
                                    fee.totalCollectLateFees)}
                              </Flex>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </LoadingContainer>
              </Box>
            )}
            <Flex
              my={6}
              justify="space-between"
              align="center"
              gap={4}
              flexWrap="wrap"
            >
              {/* Student Counts Section */}
              {inputValue.promotionIds?.length > 0 && (
                <Flex
                  align="center"
                  justify="center"
                  bgGradient={`linear(to-r, ${themeColor}.100, ${themeColor}.300)`} // Gradient background
                  p={3}
                  borderRadius="lg"
                  borderWidth={1}
                  borderColor={`${themeColor}.300`}
                  boxShadow="sm"
                  transition="all 0.3s ease"
                  _hover={{
                    boxShadow: "md",
                    transform: "scale(1.02)",
                    bgGradient: `linear(to-r, ${themeColor}.200, ${themeColor}.400)`,
                  }}
                  width="fit-content" // Adjusts to content size
                  gap={3} // Reduced gap for compactness
                >
                  {inputValue.promotionIds?.length > 0 && (
                    <Flex align="center" gap={3}>
                      {/* Icon */}
                      <Icon
                        as={FaUserCheck}
                        color={`${themeColor}.600`}
                        boxSize={6}
                        transition="all 0.3s ease"
                        _hover={{
                          color: `${themeColor}.700`,
                          transform: "rotate(10deg)",
                        }}
                      />
                      {/* Text Block */}
                      <Box textAlign="left">
                        <Text
                          fontSize="sm"
                          color={`${themeColor}.700`}
                          fontWeight="medium"
                          lineHeight="1"
                        >
                          Selected Students
                        </Text>
                        <Text
                          fontSize="2xl" // Larger for emphasis
                          fontWeight="extrabold"
                          color={`${themeColor}.800`}
                          lineHeight="1.2"
                        >
                          {inputValue.promotionIds?.length || 0}
                        </Text>
                      </Box>
                    </Flex>
                  )}
                </Flex>
              )}

              {/* Buttons Section */}
              <Flex gap={4}>
                <Button
                  size="md"
                  variant="outline"
                  colorScheme={themeColor}
                  onClick={handleBackStep}
                  isDisabled={true}
                  px={6}
                  _hover={{ bg: `${themeColor}.50` }}
                >
                  Previous
                </Button>
                <Button
                  size="md"
                  colorScheme={themeColor}
                  onClick={handleNextStep}
                  isDisabled={!inputValue.promotionIds?.length}
                  px={6}
                  boxShadow="sm"
                  _hover={{ boxShadow: "md" }}
                >
                  Next
                </Button>
              </Flex>
            </Flex>
          </Box>
        )}

        {/* Stage 2: Fee Options (Checkboxes Only) */}
        {activeStep === 1 && (
          <Box
            bg="white"
            borderRadius="lg"
            boxShadow="lg"
            p={6}
            borderWidth={1}
            borderColor={`${themeColor}.100`}
            overflow="hidden" // For gradient edge smoothness
          >
            <Flex direction="column" gap={6}>
              {/* Header with Gradient */}
              <Box
                bgGradient={`linear(to-r, ${themeColor}.500, ${themeColor}.300)`}
                p={3}
                borderRadius="md"
                textAlign="center"
              >
                <Text fontSize="xl" fontWeight="bold" color="white">
                  Last Year Dues Fee Promote Options
                </Text>
              </Box>

              {/* Checkboxes in a Grid */}
              <Flex
                direction={{ base: "column", md: "row" }} // Stack on mobile, row on desktop
                gap={4}
                justify="space-between"
                wrap="wrap"
              >
                <Box
                  flex="1"
                  bg={`${themeColor}.50`}
                  p={4}
                  borderRadius="md"
                  borderWidth={1}
                  borderColor={`${themeColor}.200`}
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "translateY(-4px)",
                    boxShadow: "md",
                    borderColor: `${themeColor}.400`,
                  }}
                >
                  <Flex align="center" gap={3}>
                    <Icon as={FaBook} color={`${themeColor}.600`} boxSize={6} />
                    <Checkbox
                      colorScheme={themeColor}
                      isChecked={inputValue.isAcademicOpeningAmount}
                      onChange={(e) =>
                        setInputValue({
                          ...inputValue,
                          isAcademicOpeningAmount: e.target.checked,
                        })
                      }
                      size="lg"
                      spacing={3}
                    >
                      <Text
                        fontSize="md"
                        fontWeight="medium"
                        color={`${themeColor}.800`}
                      >
                        Academic Fee
                      </Text>
                    </Checkbox>
                  </Flex>
                </Box>

                <Box
                  flex="1"
                  bg={`${themeColor}.50`}
                  p={4}
                  borderRadius="md"
                  borderWidth={1}
                  borderColor={`${themeColor}.200`}
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "translateY(-4px)",
                    boxShadow: "md",
                    borderColor: `${themeColor}.400`,
                  }}
                >
                  <Flex align="center" gap={3}>
                    <Icon as={FaBus} color={`${themeColor}.600`} boxSize={6} />
                    <Checkbox
                      colorScheme={themeColor}
                      isChecked={inputValue.isTransportOpeningAmount}
                      onChange={(e) =>
                        setInputValue({
                          ...inputValue,
                          isTransportOpeningAmount: e.target.checked,
                        })
                      }
                      size="lg"
                      spacing={3}
                    >
                      <Text
                        fontSize="md"
                        fontWeight="medium"
                        color={`${themeColor}.800`}
                      >
                        Transport Fee
                      </Text>
                    </Checkbox>
                  </Flex>
                </Box>

                <Box
                  flex="1"
                  bg={`${themeColor}.50`}
                  p={4}
                  borderRadius="md"
                  borderWidth={1}
                  borderColor={`${themeColor}.200`}
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "translateY(-4px)",
                    boxShadow: "md",
                    borderColor: `${themeColor}.400`,
                  }}
                >
                  <Flex align="center" gap={3}>
                    <Icon as={FaBed} color={`${themeColor}.600`} boxSize={6} />
                    <Checkbox
                      colorScheme={themeColor}
                      isChecked={inputValue.isHostal}
                      onChange={(e) =>
                        setInputValue({
                          ...inputValue,
                          isHostal: e.target.checked,
                        })
                      }
                      size="lg"
                      spacing={3}
                    >
                      <Text
                        fontSize="md"
                        fontWeight="medium"
                        color={`${themeColor}.800`}
                      >
                        Hostel Fee
                      </Text>
                    </Checkbox>
                  </Flex>
                </Box>
              </Flex>
            </Flex>

            {/* Buttons */}
            <Flex my={6} justify="flex-end" gap={4}>
              <Button
                size="md"
                variant="outline"
                colorScheme={themeColor}
                onClick={handleBackStep}
                px={6}
                bg="white"
                borderWidth={2}
                transition="all 0.2s"
                _hover={{
                  bg: `${themeColor}.100`,
                  transform: "scale(1.05)",
                }}
              >
                Previous
              </Button>
              <Button
                size="md"
                colorScheme={themeColor}
                onClick={handleNextStep}
                px={6}
                bg={`${themeColor}.600`}
                color="white"
                boxShadow="md"
                transition="all 0.2s"
                _hover={{
                  bg: `${themeColor}.700`,
                  transform: "scale(1.05)",
                  boxShadow: "lg",
                }}
              >
                Next
              </Button>
            </Flex>
          </Box>
        )}

        {activeStep === 2 && (
          <Box
            bg="white"
            borderRadius="lg"
            boxShadow="md"
            p={6}
            borderWidth={1}
            borderColor={`${themeColor}.100`}
          >
            <Flex direction="column" gap={6}>
              <Text fontSize="lg" fontWeight="bold" color={`${themeColor}.700`}>
                New Promoted Class Details
              </Text>
              <Flex gap={4} wrap="wrap">
                <Box flex="1" minW="200px">
                  <CustomSelect
                    size="md"
                    name="latestSessionMasterId"
                    label="Promote to Session"
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    data={map(allSessions, (d) => ({
                      value: d.id,
                      name: d.name,
                    }))}
                    bg="gray.50"
                    borderColor={`${themeColor}.200`}
                    focusBorderColor={`${themeColor}.500`}
                    borderRadius="md"
                  />
                </Box>
                <Box flex="1" minW="200px">
                  <CustomSelect
                    size="md"
                    name="latestClassMasterId"
                    label="Promote to Class"
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    data={map(Permoteclasses, (d, key) => ({
                      value: key,
                      name: d?.[0]?.class_master?.name,
                    }))}
                    bg="gray.50"
                    borderColor={`${themeColor}.200`}
                    focusBorderColor={`${themeColor}.500`}
                    borderRadius="md"
                  />
                </Box>
                <Box flex="1" minW="200px">
                  <CustomSelect
                    size="md"
                    name="latestStreamMasterId"
                    label="Select Stream"
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    data={map(
                      uniqBy(
                        Permoteclasses?.[inputValue?.latestClassMasterId],
                        "streamMasterId"
                      ),
                      (d) => ({
                        value: d.stream_master.id,
                        name: d.stream_master.name,
                      })
                    )}
                    bg="gray.50"
                    borderColor={`${themeColor}.200`}
                    focusBorderColor={`${themeColor}.500`}
                    borderRadius="md"
                  />
                </Box>
                <Box flex="1" minW="200px">
                  <CustomSelect
                    size="md"
                    name="latestSectionMaster"
                    label="Promote to Section"
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    data={map(allSections, (d) => ({
                      value: d.id,
                      name: d.name,
                    }))}
                    bg="gray.50"
                    borderColor={`${themeColor}.200`}
                    focusBorderColor={`${themeColor}.500`}
                    borderRadius="md"
                  />
                </Box>
              </Flex>
              {inputValue?.latestClassMasterId &&
                inputValue?.latestStreamMasterId &&
                inputValue?.latestSessionMasterId &&
                inputValue?.latestSectionMaster && (
                  <StudentFees
                    key={`${inputValue.latestClassMasterId}-${inputValue.latestStreamMasterId}-${inputValue.latestSessionMasterId}-${inputValue.latestSectionMaster}`}
                    classMasterId={inputValue.latestClassMasterId}
                    streamMasterId={inputValue.latestStreamMasterId}
                    sessionMasterId={inputValue.latestSessionMasterId}
                    themeColor={themeColor}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    page="promotion"
                  />
                )}
            </Flex>
            <Flex my={6} justify="flex-end" gap={4}>
              <Button
                size="md"
                variant="outline"
                colorScheme={themeColor}
                onClick={handleBackStep}
                px={6}
                _hover={{ bg: `${themeColor}.50` }}
              >
                Previous
              </Button>
              <Button
                size="md"
                colorScheme={themeColor}
                onClick={handleFinish}
                isDisabled={
                  !inputValue.latestSessionMasterId ||
                  !inputValue.latestClassMasterId ||
                  !inputValue.latestStreamMasterId ||
                  !inputValue.latestSectionMaster
                }
                loadingText="Submitting"
                isLoading={addStudentPromoteStatus === STATUS.FETCHING}
                px={6}
                boxShadow="sm"
                _hover={{ boxShadow: "md" }}
              >
                Finish
              </Button>
            </Flex>
          </Box>
        )}
      </Box>
    </Box>
  );
};
