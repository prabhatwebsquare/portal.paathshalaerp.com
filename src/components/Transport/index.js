import {
  Box,
  Flex,
  Text,
  SimpleGrid,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
  HStack,
  StatHelpText,
  Heading,
  useColorModeValue,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { Image, Badge, IconButton, Tooltip } from "@chakra-ui/react";
import {
  FaRoute,
  FaUsers,
  FaBus,
  FaMoneyBillWave,
  FaChartBar,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import MonthlyEarningsDiscountsChart from "../fees/Chart/1";
import { useTransportStore } from "@/store/Transport";
import { useEffect } from "react";
import { FILE_URL } from "@/services/apis";
import { setLocalStorageItem } from "@/utils/LocalStorage";

export const Transport = ({ themeColor, sessionMasterId }) => {
  const lightText = useColorModeValue(`${themeColor}.800`, `${themeColor}.200`);

  const overdueTransportFees = [
    {
      studentName: "John Doe",
      vehicle: "Bus 1",
      dueAmount: 1500,
      dueDate: "2024-12-10",
      status: "Overdue",
      paymentStatus: "Pending",
    },
    {
      studentName: "Jane Smith",
      vehicle: "Bus 2",
      dueAmount: 1200,
      dueDate: "2024-12-15",
      status: "Overdue",
      paymentStatus: "Pending",
    },
    {
      studentName: "Michael Johnson",
      vehicle: "Bus 3",
      dueAmount: 1000,
      dueDate: "2024-12-18",
      status: "Overdue",
      paymentStatus: "Pending",
    },
    {
      studentName: "Emily Davis",
      vehicle: "Bus 1",
      dueAmount: 1400,
      dueDate: "2024-12-17",
      status: "Overdue",
      paymentStatus: "Pending",
    },
    {
      studentName: "Sarah Brown",
      vehicle: "Bus 2",
      dueAmount: 1800,
      dueDate: "2024-12-19",
      status: "Overdue",
      paymentStatus: "Pending",
    },
    {
      studentName: "David Wilson",
      vehicle: "Bus 3",
      dueAmount: 1100,
      dueDate: "2024-12-21",
      status: "Overdue",
      paymentStatus: "Pending",
    },
    {
      studentName: "Olivia Taylor",
      vehicle: "Bus 1",
      dueAmount: 1600,
      dueDate: "2024-12-23",
      status: "Overdue",
      paymentStatus: "Pending",
    },
    {
      studentName: "Daniel Martinez",
      vehicle: "Bus 2",
      dueAmount: 1300,
      dueDate: "2024-12-25",
      status: "Overdue",
      paymentStatus: "Pending",
    },
  ];
  const { getDashboardAction, getDashboardStatus, dashboardData } =
    useTransportStore((s) => ({
      getDashboardAction: s.getDashboardAction,
      getDashboardStatus: s.getDashboardStatus,
      dashboardData: s.dashboardData,
    }));

  useEffect(() => {
    getDashboardAction({ sessionMasterId });
    return () => {};
  }, [sessionMasterId]);

  useEffect(() => {
    if (dashboardData?.tranporter) {
      setLocalStorageItem("transport", dashboardData?.tranporter);
    }
    return () => {};
  }, [dashboardData]);

  return (
    <Box
      bg={"white"}
      className="scrollBar"
      h={"100%"}
      maxH={"100%"}
      overflowY={"scroll"}
      p={5}
    >
      <Heading as="h2" fontSize={"2xl"} mb={3}>
        {dashboardData?.tranporter && (
          <>
            Welcome Back,{" "}
            <Text as="span" color={lightText}>
              {dashboardData?.tranporter?.name || ""}
            </Text>
          </>
        )}
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 5 }} spacing={6} bg={"white"} p={0}>
        <StatBox
          icon={FaBus}
          label="Registerd Student"
          value={dashboardData?.studentCount}
          color="blue.500"
          themeColor={themeColor}
        />
        <StatBox
          icon={FaUsers}
          label="Registerd Drivers"
          value={dashboardData?.driverCount}
          color="green.500"
          themeColor={themeColor}
        />
        <StatBox
          icon={FaMoneyBillWave}
          label="Total Fees"
          value={dashboardData?.totalFees}
          color="purple.500"
          themeColor={themeColor}
        />
        <StatBox
          icon={FaFileInvoiceDollar}
          label="Deposit Fees"
          value={dashboardData?.totalReceived}
          color="green.500"
          themeColor={themeColor}
        />
        <StatBox
          icon={FaFileInvoiceDollar}
          label="Pending Fees"
          value={dashboardData?.totalFees - dashboardData?.totalReceived}
          color="red.500"
          themeColor={themeColor}
        />
      </SimpleGrid>
      {dashboardData?.tranporter && (
        <TransporterDetails transporter={dashboardData?.tranporter} />
      )}
      <Box mt={0} p={0}>
        <Flex direction={{ base: "column", md: "row" }} spacing={0}>
          <Box w={{ base: "100%", md: "60.66%" }} p={4}>
            {/* <MonthlyEarningsDiscountsChart /> */}
          </Box>
          <Box w={{ base: "100%", md: "40.33%" }} p={4}>
            {/* <Box
              gridColumn="span 4"
              mt={0}
              h="100%"
              display="flex"
              flexDirection="column"
              shadow="md"
              borderWidth="1px"
              borderRadius="md"
              bg={"white"}
              p={5}
            >
              <Heading size="sm" mb={4} color={`${themeColor}.800`}>
                Overdue Fee List
              </Heading>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Student Name</Th>
                    <Th>Vehicle</Th>
                    <Th>Due Amount</Th>
                    <Th>Due Date</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {overdueTransportFees.length > 0 ? (
                    overdueTransportFees.map((fee, index) => (
                      <Tr key={index}>
                        <Td>{fee.studentName}</Td>
                        <Td>{fee.vehicle}</Td>
                        <Td>₹{fee.dueAmount}</Td>
                        <Td>{fee.dueDate}</Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={6} textAlign="center">
                        No Overdue Fees
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box> */}
            {/* <Box p={0}>
              <VStack spacing={2} align="flex-start">
                <ModuleCard
                  title="Manage Stations"
                  icon={FaRoute}
                  color="teal.500"
                />
                <ModuleCard
                  title="Driver Management"
                  icon={FaUsers}
                  color="blue.500"
                />
                <ModuleCard
                  title="Vehicle Registration"
                  icon={FaBus}
                  color="purple.500"
                />
                <ModuleCard
                  title="Route Planning"
                  icon={FaRoute}
                  color="orange.500"
                />
                <ModuleCard
                  title="Fee Management"
                  icon={FaMoneyBillWave}
                  color="pink.500"
                />
              </VStack>
            </Box> */}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};
const StatBox = ({ icon, label, value, color, themeColor }) => (
  <Stat
    // bg="gray.100"
    p={4}
    borderRadius="md"
    boxShadow="md"
    border="1px solid gray"
  >
    <Flex align="center">
      <Icon as={icon} w={10} h={10} color={color} />
      <VStack align="flex-start" ml={4}>
        <StatLabel fontSize="md" color="gray.900">
          {label}
        </StatLabel>
        <StatNumber fontSize="2xl" fontWeight="bold">
          {value}
        </StatNumber>
      </VStack>
    </Flex>
  </Stat>
);

const ModuleCard = ({ title, icon, color }) => (
  <Box
    p={4}
    width={"100%"}
    borderRadius="md"
    boxShadow="md"
    border="1px solid"
    borderColor={color}
    bg="white"
    _hover={{
      bg: color,
      color: "white",
      transform: "scale(1.05)",
      boxShadow: "xl",
    }}
    transition="all 0.3s ease-in-out"
    cursor="pointer"
    display="flex"
    alignItems="center"
    justifyContent="space-between"
  >
    <HStack spacing={3}>
      <Icon as={icon} w={8} h={8} color={color} />
      <Text fontSize="lg" fontWeight="bold">
        {title}
      </Text>
    </HStack>
    <Box
      borderRadius="full"
      bg={color}
      w={8}
      h={8}
      display="flex"
      alignItems="center"
      justifyContent="center"
      opacity={0.2}
      _hover={{ opacity: 1 }}
      transition="all 0.3s"
    >
      <Icon as={icon} w={5} h={5} color="white" />
    </Box>
  </Box>
);

const TransporterDetails = ({ transporter }) => {
  // TODO: Implement this component
  return (
    <div>
      <Flex
        w="100%"
        justify="center"
        align="center"
        p={4}
        // bg="gray.50"
        borderRadius="lg"
        boxShadow="lg"
        overflow="hidden"
      >
        <Box
          w={{ base: "100%", md: "80%", lg: "60%" }}
          bg="white"
          p={5}
          borderRadius="md"
          position="relative"
        >
          {/* Logo Section */}
          <Flex justify="center" mb={5}>
            <Image
              src={FILE_URL + transporter?.logo}
              alt={transporter?.name}
              boxSize="150px"
              borderRadius="full"
              objectFit="cover"
              border="2px solid"
              borderColor="blue.400"
            />
          </Flex>

          {/* Transporter Details */}
          <Box textAlign="center">
            <Text fontSize="xl" fontWeight="bold" color="blue.600" mb={2}>
              {transporter?.name}
            </Text>

            <Flex justify="center" gap={6} my={7}>
              <Box>
                <Text fontSize="sm" color="gray.600">
                  Mobile No:
                </Text>
                <Text fontSize="md" fontWeight="bold" color="gray.800">
                  {transporter?.mobileNo}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600">
                  Address:
                </Text>
                <Text fontSize="md" fontWeight="bold" color="gray.800">
                  {transporter?.address}
                </Text>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </div>
  );
};
