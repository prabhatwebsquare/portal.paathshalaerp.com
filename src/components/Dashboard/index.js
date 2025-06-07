/* eslint-disable @next/next/no-img-element */
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Select,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  FaUsers,
  FaSchool,
  FaCog,
  FaRegFileAlt,
  FaTimesCircle,
  FaCheckCircle,
  FaSms,
} from "react-icons/fa"; // You can use any icons you prefer

import React, { useEffect, useMemo, useState } from "react";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { useLoginStore } from "@/store/Login";
import { STATUS } from "@/constant";
import {
  MdCoPresent,
  MdCurrencyRupee,
  MdEmail,
  MdOutlineMessage,
  MdPeople,
} from "react-icons/md";
import { LoadingContainer } from "@/common/LoadingContainer";
import { PiEye, PiStarFill, PiWarningFill } from "react-icons/pi";
import Link from "next/link";
import { BirthDay } from "../Student/BirthDay";
import dayjs from "dayjs";
import { RevenueChart } from "./RevenueChart";
import Icon from "react-multi-date-picker/components/icon";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { FiMessageCircle, FiSend } from "react-icons/fi";
import CustomInput from "@/common/CustomInput";
import { useAppStore } from "@/store/App";
import BulkSmsButton from "./BulkSmsButton";
export const Dashboard = ({ sessionMasterId, themeColor, masterCheck }) => {
  const lightBg = useColorModeValue("white", "gray.800");
  const lightText = useColorModeValue(`${themeColor}.800`, `${themeColor}.200`);

  const {
    dashboardAction,
    dashboardStatus,
    dashboard,
    resetDashboardStatus,
    updateNowAction,
    updateNowStatus,
    fetchExtraDashboardInfoAction, // New action for fetching fees details
    fetchExtraDashboardInfoStatus, // New status for extra info fetch
    extraDashboardInfo,
  } = useLoginStore((s) => ({
    dashboardAction: s.dashboardAction,
    dashboardStatus: s.dashboardStatus,
    dashboard: s.dashboard,
    resetDashboardStatus: s.resetDashboardStatus,
    updateNowAction: s.updateNowAction,
    updateNowStatus: s.updateNowStatus,
    fetchExtraDashboardInfoAction: s.fetchExtraDashboardInfoAction,
    fetchExtraDashboardInfoStatus: s.fetchExtraDashboardInfoStatus,
    extraDashboardInfo: s.extraDashboardInfo,
  }));

  useEffect(() => {
    if ((dashboardStatus || 1) === STATUS.NOT_STARTED) {
      dashboardAction({ sessionMasterId });
    }
  }, [dashboardAction, dashboardStatus, sessionMasterId]);

  useEffect(() => {
    if (updateNowStatus === STATUS.SUCCESS) {
      window.location.reload();
    }
  }, [updateNowStatus]);

  useEffect(() => {
    return () => resetDashboardStatus();
  }, [resetDashboardStatus]);
useEffect(() => {
  resetDashboardStatus();

  return () => {
    
  }
}, [])


  const user = getLocalStorageItem("user");
  const dashboardFake = {
    birthdays: [
      { name: "John Doe", plan: "Premium", expirationDate: "2024-12-20" },
      { name: "Jane Smith", plan: "Standard", expirationDate: "2024-12-22" },
      { name: "John Doe", plan: "Premium", expirationDate: "2024-12-20" },
      { name: "Jane Smith", plan: "Standard", expirationDate: "2024-12-22" },
      { name: "John Doe", plan: "Premium", expirationDate: "2024-12-20" },
      { name: "Jane Smith", plan: "Standard", expirationDate: "2024-12-22" },
      { name: "John Doe", plan: "Premium", expirationDate: "2024-12-20" },
      { name: "Jane Smith", plan: "Standard", expirationDate: "2024-12-22" },
    ],
  };
  const todayBirthdayStudents = dashboardFake?.birthdays || []; // Replace this with actual data.
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!masterCheck) {
      onOpen();
    }
  }, [onOpen]);

  const [requests, setRequests] = useState([
    {
      id: 1,
      user: "John Doe",
      type: "App",
      date: "2024-12-10",
      status: "Pending",
    },
    {
      id: 2,
      user: "Jane Smith",
      type: "Web",
      date: "2024-12-11",
      status: "Pending",
    },
    {
      id: 1,
      user: "John Doe",
      type: "App",
      date: "2024-12-10",
      status: "Pending",
    },

    // more requests
  ]);

  const handleApprove = (id) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status: "Approved" } : request
      )
    );
  };
  const bgColor = useColorModeValue("white", "gray.800");
  const handleReject = (id) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status: "Rejected" } : request
      )
    );
  };

  function formatNumber(number) {
    return new Intl.NumberFormat().format(number);
  }
  const {
    doRequestBulkMessageAction,
    doRequestBulkMessageStatus,
    bulkMessage,
    demandMorePackageRequest,
  } = useAppStore((s) => ({
    doRequestBulkMessageAction: s.doRequestBulkMessageAction,
    doRequestBulkMessageStatus: s.doRequestBulkMessageStatus,
    bulkMessage: s.bulkMessage,
    demandMorePackageRequest: s.demandMorePackageRequest,
  }));
  const {
    isOpen: isSmsModalOpen,
    onOpen: onSmsModalOpen,
    onClose: onSmsModalClose,
  } = useDisclosure();

  const toast = useToast();
  const handleRequestSms = async () => {
    await doRequestBulkMessageAction();
    await dashboardAction({ sessionMasterId });
    localStorage.setItem("bulkMessageStatus", dashboard.bulkMessageStatus);
    onSmsModalClose();
  };
  const bulkMessageStatus = useMemo(
    () => getLocalStorageItem("bulkMessageStatus"),
    []
  );
  useEffect(() => {
    if (dashboard) {
      localStorage.setItem("bulkMessageStatus", dashboard?.bulkMessageStatus);
    }
    return () => {};
  }, [dashboard]);

  const handleSendSms = async () => {
    if (!smsPackage) {
      toast({
        title: "Please select a package",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const packageData = JSON.parse(smsPackage);

      await demandMorePackageRequest({
        totalMessage: packageData.totalMessage,
        amount: packageData.amount,
      });
      onSmsModalClose();
    } catch (error) {
      console.error("Error parsing package data:", error);
      toast({
        title: "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const [smsPackage, setSmsPackage] = useState("");
  const [purchasedLimit, setPurchasedLimit] = useState(1000);
  const [sentToday, setSentToday] = useState(150);

  const handleToggleFees = () => {
    if (
      fetchExtraDashboardInfoStatus === STATUS.NOT_STARTED &&
      HasPermission(PERMISSIONS.FEES)
    ) {
      fetchExtraDashboardInfoAction({ sessionMasterId });
    }
  };

  return (
    <Box p={5} bg={lightBg}>
      <Box>
        <Box mb={8}>
          <Flex justify="space-between" align="center">
            <Heading as="h2" size="md">
              Welcome Back,{" "}
              <Text as="span" color="gray.600">
                {user?.userData?.name || user?.name}
              </Text>
            </Heading>
            {user?.roleMasterId != 1 && (
              <BulkSmsButton
                onSmsModalOpen={onSmsModalOpen}
                themeColor={themeColor}
                status={Number(bulkMessageStatus)}
              />
            )}
          </Flex>
          <Modal isOpen={isSmsModalOpen} onClose={onSmsModalClose} size="xl">
            <ModalOverlay />
            <ModalContent borderRadius="lg" boxShadow="xl">
              <ModalHeader
                display="flex"
                alignItems="center"
                bgGradient={`linear(to-r, ${themeColor}.500, ${themeColor}.900)`}
                color="white"
                borderTopRadius="lg"
                py={4}
              >
                <Icon as={FiMessageCircle} mr={2} /> {/* Add an icon */}
                Bulk SMS
              </ModalHeader>
              <ModalCloseButton
                color="white"
                _hover={{ bg: "white", color: `${themeColor}.900` }}
              />
              <ModalBody py={6}>
                {Number(bulkMessageStatus) != 2 ? (
                  <Button
                    colorScheme={themeColor}
                    w="full"
                    variant="outline"
                    onClick={handleRequestSms}
                    leftIcon={<Icon as={FiSend} />}
                    size="md"
                    disabled={Number(bulkMessageStatus) == 1}
                    _hover={{ transform: "scale(1.05)" }}
                    transition="all 0.2s"
                  >
                    {Number(bulkMessageStatus) == 1
                      ? "Pending For Approval"
                      : "SMS Activation Request"}
                  </Button>
                ) : (
                  <>
                    <Box
                      mb={6}
                      p={4}
                      bgGradient={`linear(to-r, ${themeColor}.900, ${themeColor}.500)`}
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor={`${themeColor}.200`}
                      boxShadow="sm"
                      _hover={{
                        boxShadow: "md",
                        transform: "translateY(-2px)",
                      }}
                      transition="all 0.2s"
                    >
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        mb={4}
                        color={"white"}
                      >
                        {/* <Icon as={FiActivity} mr={2} /> Add an icon */}
                        Your SMS Usage Details
                      </Text>

                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        {/* Purchased Limit Card */}
                        <Box
                          p={4}
                          bg="white"
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor={`${themeColor}.100`}
                          textAlign="center"
                          _hover={{ boxShadow: "lg" }}
                          transition="all 0.2s"
                        >
                          <Text fontSize="sm" color="gray.600" mb={1}>
                            Purchased Limit
                          </Text>
                          <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color={`${themeColor}.800`}
                          >
                            {purchasedLimit}
                          </Text>
                        </Box>

                        {/* Sent Today Card */}
                        <Box
                          p={4}
                          bg="white"
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor={`${themeColor}.100`}
                          textAlign="center"
                          _hover={{ boxShadow: "lg" }}
                          transition="all 0.2s"
                        >
                          <Text fontSize="sm" color="gray.600" mb={1}>
                            Sent Today
                          </Text>
                          <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color={`${themeColor}.800`}
                          >
                            {sentToday}
                          </Text>
                        </Box>

                        {/* Remaining Limit Card */}
                        <Box
                          p={4}
                          bg="white"
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor={`${themeColor}.100`}
                          textAlign="center"
                          _hover={{ boxShadow: "lg" }}
                          transition="all 0.2s"
                        >
                          <Text fontSize="sm" color="gray.600" mb={1}>
                            Remaining Limit
                          </Text>
                          <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color={`${themeColor}.800`}
                          >
                            564
                          </Text>
                        </Box>
                      </SimpleGrid>
                    </Box>

                    <Text mb={4} fontSize="lg" fontWeight="medium">
                      How much message package do you want?
                    </Text>
                    <Select
                      placeholder="Select message package"
                      value={smsPackage}
                      onChange={(e) => {
                        setSmsPackage(e.target.value);
                      }}
                      mb={5}
                      size="lg"
                      focusBorderColor={`${themeColor}.400`}
                    >
                      <option value='{"totalMessage":5000,"amount":2300}'>
                        5000 Messages (₹2300)
                      </option>
                      <option value='{"totalMessage":10000,"amount":3500}'>
                        10000 Messages (₹3500)
                      </option>
                      <option value='{"totalMessage":25000,"amount":6500}'>
                        25000 Messages (₹6500)
                      </option>
                      <option value='{"totalMessage":50000,"amount":12000}'>
                        50000 Messages (₹12000)
                      </option>
                      <option value='{"totalMessage":100000,"amount":23000}'>
                        100000 Messages (₹23000)
                      </option>
                    </Select>

                    <Button
                      bgGradient={`linear(to-r, ${themeColor}.500, ${themeColor}.900)`}
                      color={"white"}
                      w="full"
                      mt={2}
                      onClick={handleSendSms}
                      size="lg"
                      _hover={{ transform: "scale(1.05)" }}
                      transition="all 0.2s"
                    >
                      Send Request
                    </Button>
                  </>
                )}
              </ModalBody>

              <ModalFooter>
                <Button
                  // variant="outline"
                  colorScheme="red"
                  size={"sm"}
                  onClick={onSmsModalClose}
                  // leftIcon={<Icon as={FiX} />}
                  _hover={{ bg: "red.50" }}
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {masterCheck != true && (
            <Modal
              isOpen={isOpen}
              onClose={onClose}
              isCentered
              size="lg"
              closeOnOverlayClick={false}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalBody>
                  <Box textAlign="center">
                    <Icon
                      as={PiWarningFill}
                      boxSize={12}
                      color={`${themeColor}.500`}
                    />
                    <Text
                      mt={0}
                      fontSize="lg"
                      fontWeight="bold"
                      color="white"
                      borderRadius="200"
                      borderWidth="3px"
                      borderColor="white"
                      backgroundColor="red.500"
                      borderStyle="dotted"
                      p={2}
                      my={5}
                    >
                      Your Master Data is Incomplete!
                    </Text>
                    <Text mt={2} color="gray.600">
                      To proceed, you need to set up your Master Data. This
                      includes class, section, and subject settings for your
                      organization.
                    </Text>
                  </Box>
                </ModalBody>
                <ModalFooter justifyContent="center">
                  <Link href="/school-setting/class-setup">
                    <Button
                      colorScheme="red"
                      borderRadius="200"
                      variant="outline"
                      mr={3}
                      onClick={onClose}
                    >
                      Go to Setup Page
                    </Button>
                  </Link>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </Box>
        <LoadingContainer status={dashboardStatus}>
          {dashboard && (
            <>
              {/* Stat Cards */}
              <Box position="relative" mb={6}>
                <SimpleGrid columns={{ base: 1, md: 4, lg: 6 }} spacing={4}>
                  <StatCard
                    title="Total Students"
                    icon={<MdPeople />}
                    amount={dashboard.studentCount}
                    color="teal"
                  />
                  {fetchExtraDashboardInfoStatus == STATUS.SUCCESS ? (
                    <>
                      <StatCard
                        title="Total Fees"
                        icon={<MdCurrencyRupee />}
                        amount={
                          HasPermission(PERMISSIONS.FEES)
                            ? formatNumber(
                                extraDashboardInfo.totalFees
                              )
                            : "****"
                        }
                        color="blue"
                      />
                      <StatCard
                        title="Deposite"
                        icon={<MdCurrencyRupee />}
                        amount={
                          HasPermission(PERMISSIONS.FEES)
                            ? formatNumber(
                                extraDashboardInfo.totalFeesReceived +
                                  extraDashboardInfo.totalLateFeesReceived
                              )
                            : "****"
                        }
                        color="green"
                      />
                      <StatCard
                        title="Discount"
                        icon={<MdCurrencyRupee />}
                        amount={
                          HasPermission(PERMISSIONS.FEES)
                            ? formatNumber(
                                extraDashboardInfo.totalDiscountRecived
                              )
                            : "****"
                        }
                        color="orange"
                      />
                      <StatCard
                        title="Balance"
                        icon={<MdCurrencyRupee />}
                        amount={
                          HasPermission(PERMISSIONS.FEES)
                            ? formatNumber(
                                extraDashboardInfo.totalFees +
                                  extraDashboardInfo.totalLateFees -
                                  (extraDashboardInfo.totalFeesReceived +
                                    extraDashboardInfo.totalLateFeesReceived +
                                    extraDashboardInfo.totalDiscountRecived)
                              )
                            : "****"
                        }
                        color="red"
                      />
                      <StatCard
                        title="Today's Deposite"
                        icon={<MdCurrencyRupee />}
                        amount={
                          HasPermission(PERMISSIONS.FEES)
                            ? formatNumber(
                                extraDashboardInfo.todayFeesRecived +
                                  extraDashboardInfo.todayLateFeesRecived
                              )
                            : "****"
                        }
                        color="purple"
                      />
                    </>
                  ) : (
                    <Box
                      gridColumn={{
                        base: "span 1",
                        md: "span 3",
                        lg: "span 5",
                      }}
                      p={4}
                      bg={`${themeColor}.50`}
                      borderRadius="xl"
                      borderWidth="1px"
                      borderColor={`${themeColor}.100`}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      _hover={{
                        boxShadow: `0 4px 8px ${themeColor}.200`,
                        transform: "translateY(-2px)",
                      }}
                      transition="all 0.2s"
                    >
                      <Flex align="center" gap={4}>
                        <Icon
                          as={PiStarFill}
                          boxSize={6}
                          color={`${themeColor}.600`}
                        />
                        <Text
                          fontSize="lg"
                          fontWeight="bold"
                          color={`${themeColor}.700`}
                        >
                          Fees Details Hidden
                        </Text>
                        {HasPermission(PERMISSIONS.FEES) && (
                          <IconButton
                            icon={
                              fetchExtraDashboardInfoStatus ==
                              STATUS.FETCHING ? (
                                <CircularProgress isIndeterminate size="24px" />
                              ) : (
                                <PiEye />
                              )
                            }
                            colorScheme={themeColor}
                            bg={`${themeColor}.600`}
                            color="white"
                            borderRadius="full"
                            size="md"
                            aria-label="Show fees details"
                            onClick={handleToggleFees}
                            isDisabled={
                              fetchExtraDashboardInfoStatus == STATUS.FETCHING
                            }
                            _hover={{ bg: `${themeColor}.700` }}
                          />
                        )}
                      </Flex>
                    </Box>
                  )}
                </SimpleGrid>
              </Box>

              {dashboard && (
                <Grid
                  templateColumns="repeat(10, 1fr)"
                  gap="6"
                  alignItems="stretch"
                >
                  {/* First Box: Spanning 6 columns */}
                  <Box
                    gridColumn="span 6"
                    mt={8}
                    display="flex"
                    flexDirection="column"
                    h="100%"
                  >
                    <Flex
                      direction={{ base: "column", md: "row" }}
                      gap="6"
                      alignItems="stretch"
                      flex="1"
                    >
                      <Box
                        flex="1"
                        display="flex"
                        flexDirection="column"
                        h="100%"
                      >
                        <CalendarCard themeColor={themeColor} />
                      </Box>
                      <Box
                        flex="1"
                        display="flex"
                        flexDirection="column"
                        h="100%"
                      >
                        <PerformanceScore
                          score={
                            dashboard?.attendanceData?.overallAttendancePercent
                          }
                          teacherPresent={
                            dashboard?.attendanceData?.presentStaffToday
                          }
                          totalTeachers={dashboard?.attendanceData?.totalStaff}
                          studentPresent={
                            dashboard?.attendanceData?.presentStudentsToday
                          }
                          totalStudents={
                            dashboard?.attendanceData?.totalStudents
                          }
                          themeColor={themeColor}
                        />
                      </Box>
                    </Flex>
                  </Box>

                  {/* Second Box: Spanning 4 columns */}
                  <Box
                    gridColumn="span 4"
                    mt={8}
                    h="100%"
                    display="flex"
                    flexDirection="column"
                    shadow="md"
                    borderWidth="1px"
                    borderRadius="md"
                    bg={bgColor}
                    p={5}
                  >
                    <Heading
                      size="md"
                      mb={6}
                      bgGradient="linear(to-r, red.500, orange.500, yellow.500)"
                      bgClip="text"
                      textTransform="uppercase"
                      letterSpacing="wide"
                      fontWeight="extrabold"
                    >
                      Todays Birthdays
                    </Heading>
                    <BirthDay
                      page="dashboard"
                      themeColor={themeColor}
                      sessionMasterId={sessionMasterId}
                    />
                  </Box>
                </Grid>
              )}
              {user?.roleMasterId == 1 && (
                <SimpleGrid
                  columns={{ sm: 1, md: 2, lg: 3 }}
                  mx={5}
                  spacing="5"
                >
                  <StatCard
                    title="Total Client"
                    icon={<FaSchool />}
                    amount={200}
                    color={themeColor}
                  />
                  <StatCard
                    title="Total Active Client"
                    icon={<FaSchool />}
                    amount={200}
                    color={themeColor}
                  />
                  <StatCard
                    title="Total Deactive Client"
                    icon={<FaSchool />}
                    amount={200}
                    color={themeColor}
                  />
                </SimpleGrid>
              )}
              {user?.roleMasterId == 1 && (
                <Grid
                  templateColumns="repeat(10, 1fr)"
                  gap="6"
                  alignItems="stretch"
                >
                  {/* First Box: Spanning 6 columns */}
                  <Box
                    gridColumn="span 7"
                    mt={8}
                    display="flex"
                    flexDirection="column"
                    h="100%"
                  >
                    <Box
                      p={5}
                      gridColumn="span 3"
                      h="100%"
                      display="flex"
                      flexDirection="column"
                      shadow="md"
                      borderWidth="1px"
                      borderRadius="md"
                      bg={bgColor}
                    >
                      <Heading size="lg" mb={6} color={`${themeColor}.800`}>
                        Request Approval
                      </Heading>

                      {/* Tab Section */}
                      <Flex mb={6}>
                        <Button colorScheme={themeColor} flex="1" mr={4}>
                          App Requests
                        </Button>
                        <Button colorScheme={themeColor} flex="1">
                          Web Requests
                        </Button>
                      </Flex>

                      {/* Requests Table */}
                      <Box>
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>User</Th>
                              <Th>Request Type</Th>
                              <Th>Date</Th>
                              <Th>Status</Th>
                              <Th>Action</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {requests.map((request) => (
                              <Tr key={request.id}>
                                <Td>{request.user}</Td>
                                <Td>{request.type}</Td>
                                <Td>{request.date}</Td>
                                <Td>
                                  <Text
                                    color={
                                      request.status === "Pending"
                                        ? "orange.400"
                                        : request.status === "Approved"
                                        ? "green.400"
                                        : "red.400"
                                    }
                                  >
                                    {request.status}
                                  </Text>
                                </Td>
                                <Td>
                                  {request.status === "Pending" && (
                                    <Flex gap={2}>
                                      <IconButton
                                        icon={<FaCheckCircle />}
                                        colorScheme="green"
                                        onClick={() =>
                                          handleApprove(request.id)
                                        }
                                        aria-label="Approve"
                                      />
                                      <IconButton
                                        icon={<FaTimesCircle />}
                                        colorScheme="red"
                                        onClick={() => handleReject(request.id)}
                                        aria-label="Reject"
                                      />
                                    </Flex>
                                  )}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </Box>
                    </Box>
                  </Box>

                  {/* Second Box: Spanning 4 columns */}
                  <Box
                    gridColumn="span 3"
                    mt={8}
                    h="100%"
                    display="flex"
                    flexDirection="column"
                    shadow="md"
                    borderWidth="1px"
                    borderRadius="md"
                    bg={bgColor}
                    p={5}
                  >
                    <Heading size="md" mb={4} color={`${themeColor}.800`}>
                      Users with Expiring Plans
                    </Heading>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Name</Th>
                          <Th>Plan</Th>
                          <Th>Expiration Date</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {todayBirthdayStudents.length > 0 ? (
                          todayBirthdayStudents.map((user, index) => (
                            <Tr key={index}>
                              <Td>{user.name}</Td>
                              <Td>{user.plan}</Td>
                              <Td>{user.expirationDate}</Td>
                            </Tr>
                          ))
                        ) : (
                          <Tr>
                            <Td colSpan={3} textAlign="center">
                              No Plans Expiring Soon
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </Box>
                </Grid>
              )}
            </>
          )}
        </LoadingContainer>
        <WhatsAppButton />
      </Box>
    </Box>
  );
};

const WhatsAppButton = () => {
  return (
    <div>
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/9694222788"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
      >
        <img
          src="https://cdn-icons-png.freepik.com/256/3983/3983877.png?semt=ais_hybrid"
          alt="WhatsApp"
          className="whatsapp-icon"
        />
      </a>
    </div>
  );
};
const StatCard = ({ title, icon, amount, color }) => (
  <Box
    p={4} // Reduced padding
    shadow="lg"
    borderRadius="xl"
    height="100%"
    bg={useColorModeValue("white", "gray.800")}
    position="relative"
    transition="all 0.3s"
    _hover={{
      transform: "translateY(-4px)",
      shadow: "2xl",
    }}
  >
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      h={2}
      bgGradient={`linear(to-r, ${color}.400, ${color}.900)`}
      borderTopRadius="xl"
    />

    <Stat>
      <StatLabel fontSize="md" fontWeight="bold" color={`${color}.600`} mb={1}>
        {" "}
        {/* Smaller font size */}
        {title}
      </StatLabel>

      <Flex
        align="center"
        justify="space-between"
        bg={`${color}.50`}
        p={2}
        borderRadius="lg"
      >
        <Box
          p={2} // Reduced padding
          borderRadius="full"
          bg={`${color}.100`}
          color={`${color}.600`}
        >
          {icon}
        </Box>

        <StatNumber fontSize="xl" fontWeight="bold" color={`${color}.700`}>
          {" "}
          {/* Smaller font size */}
          {amount}
        </StatNumber>
      </Flex>
    </Stat>
  </Box>
);

const CalendarCard = ({ themeColor }) => {
  const today = dayjs(); // Current date
  const dateBg = useColorModeValue(`${themeColor}.100`, `${themeColor}.700`);
  const dateColor = useColorModeValue(`${themeColor}.800`, `${themeColor}.200`);

  return (
    <Box
      p={5}
      shadow="xl"
      borderWidth="2px"
      borderRadius="2xl"
      bg={useColorModeValue("white", "gray.800")}
      h="100%"
      display="flex"
      flexDirection="column"
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "8px",
        background: `linear-gradient(to right, purple.400, blue.400, green.400, yellow.400, red.400)`,
      }}
    >
      <Heading
        size="md"
        mb={6}
        bgGradient="linear(to-r, red.500, orange.500, yellow.500)"
        bgClip="text"
        textTransform="uppercase"
        letterSpacing="wide"
        fontWeight="extrabold"
      >
        Today&apos;s Date
      </Heading>
      <Flex
        direction="column"
        align="center"
        justify="center"
        borderRadius="xl"
        bgGradient="linear(to-b, blue.50, purple.50)"
        p={6}
        textAlign="center"
        flex="1"
        position="relative"
        boxShadow="2xl"
      >
        <VStack spacing={3}>
          <Text
            fontSize="7xl"
            fontWeight="black"
            textShadow="2px 2px 4px rgba(0,0,0,0.2)"
            bgGradient="linear(to-r, pink.500, purple.500, blue.500)"
            bgClip="text"
            letterSpacing="-2px"
          >
            {today.format("DD")}
          </Text>
          <Text
            fontSize="3xl"
            fontWeight="bold"
            letterSpacing="wider"
            bgGradient="linear(to-r, teal.400, blue.400)"
            bgClip="text"
          >
            {today.format("dddd")}
          </Text>
          <Text
            fontSize="xl"
            fontWeight="medium"
            bgGradient="linear(to-r, orange.400, yellow.400)"
            bgClip="text"
            mt={2}
          >
            {today.format("MMMM YYYY")}
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
};

const PerformanceScore = ({
  score,
  teacherPresent,
  totalTeachers,
  studentPresent,
  totalStudents,
  themeColor,
}) => {
  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="md"
      bg="white"
      h="100%"
    >
      <Heading
        size="md"
        mb={4}
        bgGradient="linear(to-r, purple.500, blue.500, teal.500)"
        bgClip="text"
        fontWeight="extrabold"
        letterSpacing="wide"
        textShadow="0 2px 4px rgba(0,0,0,0.1)"
      >
        Attendance Overview
      </Heading>

      <VStack spacing={8} align="center">
        {/* Two Circular Progress Charts Side by Side */}
        <Flex w="100%" justifyContent="space-evenly" alignItems="center">
          {/* Teacher Attendance Circle */}
          <VStack>
            <CircularProgress
              value={(teacherPresent / totalTeachers) * 100}
              size="120px"
              color="purple.500"
              thickness="8px"
              trackColor="purple.100"
            >
              <CircularProgressLabel>
                <VStack spacing={0}>
                  <Text fontWeight="bold" fontSize="xl" color="purple.600">
                    {Math.round((teacherPresent / totalTeachers) * 100)}%
                  </Text>
                  <Text fontSize="xs" color="purple.500">
                    Teachers
                  </Text>
                </VStack>
              </CircularProgressLabel>
            </CircularProgress>
            <Box textAlign="center" mt={2}>
              <Text color="purple.700" fontWeight="bold">
                {teacherPresent}/{totalTeachers}
              </Text>
              <Text fontSize="sm" color="purple.600">
                Present Today
              </Text>
            </Box>
          </VStack>

          {/* Student Attendance Circle */}
          <VStack>
            <CircularProgress
              value={(studentPresent / totalStudents) * 100}
              size="120px"
              color="teal.500"
              thickness="8px"
              trackColor="teal.100"
            >
              <CircularProgressLabel>
                <VStack spacing={0}>
                  <Text fontWeight="bold" fontSize="xl" color="teal.600">
                    {Math.round((studentPresent / totalStudents) * 100)}%
                  </Text>
                  <Text fontSize="xs" color="teal.500">
                    Students
                  </Text>
                </VStack>
              </CircularProgressLabel>
            </CircularProgress>
            <Box textAlign="center" mt={2}>
              <Text color="teal.700" fontWeight="bold">
                {studentPresent}/{totalStudents}
              </Text>
              <Text fontSize="sm" color="teal.600">
                Present Today
              </Text>
            </Box>
          </VStack>
        </Flex>

        {/* Overall Performance Score */}
        <Box
          p={4}
          borderRadius="lg"
          bgGradient="linear(to-r, blue.400, purple.500)"
          w="100%"
          textAlign="center"
          boxShadow="xl"
        >
          <Text color="white" fontSize="lg" fontWeight="semibold">
            Overall Performance Score
          </Text>
          <Text color="white" fontSize="3xl" fontWeight="bold">
            {score}%
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};
