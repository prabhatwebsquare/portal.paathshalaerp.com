import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { useLoginStore } from "@/store/Login";
import { ChevronUpIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect } from "react";
import { BsCurrencyRupee } from "react-icons/bs";
import MonthlyEarningsDiscountsChart1 from "./Chart/1";

export const Fees = ({ sessionMasterId }) => {
  const {
    fetchExtraDashboardInfoAction,
    fetchExtraDashboardInfoStatus,
    extraDashboardInfo,
    resetDashboardStatus,
  } = useLoginStore((s) => ({
    fetchExtraDashboardInfoAction: s.fetchExtraDashboardInfoAction,
    fetchExtraDashboardInfoStatus: s.fetchExtraDashboardInfoStatus,
    extraDashboardInfo: s.extraDashboardInfo,
    resetDashboardStatus: s.resetDashboardStatus,
  }));

  useEffect(() => {
    if ((fetchExtraDashboardInfoStatus || 1) === STATUS.NOT_STARTED) {
      fetchExtraDashboardInfoAction({ sessionMasterId });
    }
  }, [
    fetchExtraDashboardInfoAction,
    fetchExtraDashboardInfoStatus,
    sessionMasterId,
  ]);

  useEffect(() => {
    return () => resetDashboardStatus();
  }, [resetDashboardStatus]);
  return (
    <Box>
      <PageHeader heading={"Fees"} />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box className="scrollBar" height={"100%"} overflowY={"scroll"}>
          {extraDashboardInfo ? (
        <Flex w="100%" justify="space-between" gap={4} flexWrap="wrap">
        <DashUi
          title="Total Fees"
          amount={extraDashboardInfo.totalFees}
          color="blue"
        />
        <DashUi
          title="Total Deposite"
          amount={extraDashboardInfo.totalFeesReceived}
          color="green"
        />
        <DashUi
          title="Total Discount"
          amount={extraDashboardInfo.totalDiscountRecived}
          color="orange"
        />
        <DashUi
          title="Total Balance"
          amount={
            extraDashboardInfo.totalFees -
            (extraDashboardInfo.totalFeesReceived + extraDashboardInfo.totalDiscountRecived)
          }
          color="red"
        />
        <DashUi
          title="Total LateFees"
          amount={extraDashboardInfo.totalLateFees}
          color="teal"
        />
      </Flex>
      
          ) : null}
          {/* <MonthlyEarningsDiscountsChart1 /> */}
        </Box>
      </Box>
    </Box>
  );
};

const DashUi = ({ color, title, amount }) => {
    return (
      <Box
        p={4}
        shadow="lg"
        borderRadius="xl"
        height="100%"
        w={["19%"]}
        bg={useColorModeValue("white", "gray.800")}
        position="relative"
        transition="all 0.3s"
        _hover={{
          transform: "translateY(-4px)",
          shadow: "2xl",
        }}
      >
        {/* Top gradient bar */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h={2}
          bgGradient={`linear(to-r, ${color}.400, ${color}.900)`}
          borderTopRadius="xl"
        />
  
        {/* Title */}
        <Text fontSize="md" fontWeight="bold" color={`${color}.600`} mb={1}>
          {title}
        </Text>
  
        {/* Amount section */}
        <Flex
          align="center"
          justify="space-between"
          bg={`${color}.50`}
          p={2}
          borderRadius="lg"
        >
          <Box
            p={2}
            borderRadius="full"
            bg={`${color}.100`}
            color={`${color}.600`}
          >
            <BsCurrencyRupee fontSize={20} />
          </Box>
  
          <Text fontSize="xl" fontWeight="bold" color={`${color}.700`}>
            {amount ? amount : 0}
          </Text>
        </Flex>
      </Box>
    );
  };
