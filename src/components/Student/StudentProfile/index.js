import React, { useEffect, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  HStack,
  Icon,
  Tooltip,
  Button,
  ScaleFade,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowBackIcon, EditIcon, PhoneIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useStudentStore } from "@/store/studentStore";
import { LoadingContainer } from "@/common/LoadingContainer";
import { FeesSummery } from "./FeesSummery";
import { YearlyAttendanceGraph } from "./AttendanceReport";
import { ExamReport } from "./ExamReport";
import { LibraryBook } from "./LibraryBook";
import ExamChart from "./ExamRankChart";
import { TransportFeesSummary } from "./transportData";
import { IoMdMail } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";

export const StudentProfile = ({ themeColor, sessionMasterId }) => {
  const router = useRouter();
  const {
    getStudentDetailsAction,
    getStudentDetailsStatus,
    studentDetails,
    dashboardData,
    resetStdDetailsStatus,
  } = useStudentStore((s) => ({
    getStudentDetailsAction: s.getStudentDetailsAction,
    getStudentDetailsStatus: s.getStudentDetailsStatus,
    studentDetails: s.studentDetails,
    resetStdDetailsStatus: s.resetStdDetailsStatus,
    dashboardData: s.dashboardData,
  }));

  useEffect(() => {
    if (router?.query?.id) {
      getStudentDetailsAction({
        id: router?.query?.id,
        sessionMasterId,
      });
    }
  }, [getStudentDetailsAction, router?.query?.id, sessionMasterId]);

  useEffect(() => {
    return () => resetStdDetailsStatus();
  }, [resetStdDetailsStatus]);

  const stdData = useMemo(() => {
    return studentDetails?.student_master;
  }, [studentDetails?.student_master]);

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");


  return (
    <Box h="100%" bg={bgColor} p={4}>
      <Box className="scrollBar" maxH="100%" overflowY="scroll">
        <LoadingContainer status={getStudentDetailsStatus}>
          {/* Student Info Header */}
          <ScaleFade initialScale={0.95} in={true}>
            <Flex
              py={4}
              px={6}
              bg={cardBg}
              borderRadius="2xl"
              boxShadow={`0 8px 16px ${themeColor}.100`}
              align="center"
              justify="space-between"
              position="relative"
              overflow="hidden"
              border="1px solid"
              borderColor={`${themeColor}.100`}
              _hover={{ boxShadow: `0 12px 24px ${themeColor}.200` }}
              transition="all 0.3s ease"
            >
              {/* Gradient Accent */}
              <Box
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h="4px"
                bgGradient={`linear(to-r, ${themeColor}.400, ${themeColor}.600)`}
              />

              {/* Main Content */}
              <Flex
                align="center"
                w={{ base: "100%", md: "85%" }}
                flexWrap={{ base: "wrap", md: "nowrap" }}
                gap={{ base: 4, md: 6 }}
              >
                {/* Avatar and Back Button */}
                <HStack
                  w={{ base: "100%", md: "15%" }}
                  spacing={4}
                  align="center"
                >
                  <Tooltip
                    placement="top"
                    label="Go Back"
                    hasArrow
                    bg={`${themeColor}.500`}
                  >
                    <ArrowBackIcon
                      boxSize={5}
                      cursor="pointer"
                      color={`${themeColor}.500`}
                      onClick={() => router.back()}
                      _hover={{
                        transform: "scale(1.2)",
                        color: `${themeColor}.700`,
                      }}
                      transition="all 0.2s"
                    />
                  </Tooltip>
                  <Box position="relative">
                    <Avatar
                      size="xl"
                      src="/assets/login2.png"
                      border="2px solid"
                      borderColor={`${themeColor}.200`}
                      boxShadow={`0 4px 8px ${themeColor}.100`}
                      _hover={{ transform: "scale(1.05)" }}
                      transition="all 0.2s"
                    />
                    <EditIcon
                      position="absolute"
                      bottom={0}
                      right={0}
                      bg={`${themeColor}.500`}
                      color="white"
                      borderRadius="full"
                      p={1}
                      boxSize={4}
                      border="2px solid white"
                      cursor="pointer"
                      _hover={{ bg: `${themeColor}.600` }}
                      transition="all 0.2s"
                    />
                  </Box>
                </HStack>

                {/* Student Info */}
                {stdData && (
                  <VStack
                    align="start"
                    w={{ base: "100%", md: "42.5%" }}
                    spacing={2}
                    fontSize={{ base: 12, md: 13 }}
                  >
                    <Text
                      fontSize={{ base: 18, md: 20 }}
                      fontWeight="extrabold"
                      color={`${themeColor}.600`}
                    >
                      {stdData.studentName}
                    </Text>
                    <HStack spacing={4} wrap="wrap">
                      <HStack spacing={2}>
                        <Icon
                          as={PhoneIcon}
                          boxSize={4}
                          color={`${themeColor}.500`}
                        />
                        <Text color={textColor}>
                          {stdData.fatherContact || "N/A"}
                        </Text>
                      </HStack>
                      <HStack spacing={2}>
                        <Icon
                          as={IoMdMail}
                          boxSize={4}
                          color={`${themeColor}.500`}
                        />
                        <Text color={textColor}>
                          {stdData.studentEmail || "N/A"}
                        </Text>
                      </HStack>
                    </HStack>
                    <HStack spacing={2}>
                      <Icon
                        as={IoLocationSharp}
                        boxSize={4}
                        color={`${themeColor}.500`}
                      />
                      <Text color={textColor}>{stdData.address || "N/A"}</Text>
                    </HStack>
                  </VStack>
                )}

                {/* Parent and Academic Info */}
                {stdData && studentDetails && (
                  <VStack
                    align="start"
                    w={{ base: "100%", md: "42.5%" }}
                    spacing={2}
                    fontSize={{ base: 12, md: 13 }}
                  >
                    <Text
                      fontSize={{ base: 16, md: 18 }}
                      fontWeight="bold"
                      color={`${themeColor}.600`}
                    >
                      {stdData.fatherName}
                    </Text>
                    <HStack spacing={2}>
                      <Text fontWeight="semibold" color={textColor}>
                        SR No:
                      </Text>
                      <Text color={textColor}>{stdData.srNo}</Text>
                    </HStack>
                    <HStack spacing={2} wrap="wrap">
                      <Text color={textColor}>
                        {studentDetails.class_master.name}
                      </Text>
                      <Text color={textColor}>-</Text>
                      <Text color={textColor}>
                        {studentDetails.stream_master.name}
                      </Text>
                      <Text color={textColor}>-</Text>
                      <Text color={textColor}>
                        {studentDetails.section_master.name}
                      </Text>
                    </HStack>
                  </VStack>
                )}
              </Flex>
            </Flex>
          </ScaleFade>

          {/* Profile Sections */}
          <Flex mt={6} gap={4} flexWrap="wrap" justify="space-between">
            <ProfileHeader title="Fees Summary">
              <FeesSummery
                sessionMasterId={sessionMasterId}
                data={dashboardData?.feesInfo}
              />
            </ProfileHeader>
            <ProfileHeader title="Transport Fee Summary">
              <TransportFeesSummary
                sessionMasterId={sessionMasterId}
                data={dashboardData?.transportFeesInfo}
              />
            </ProfileHeader>
            <ProfileHeader title="Attendance Report">
              <YearlyAttendanceGraph data={dashboardData?.attendData} />
            </ProfileHeader>
            {/* <ProfileHeader title="Exam Report">
              <ExamReport />
            </ProfileHeader> */}
            {/* <ProfileHeader title="Library Books">
              <LibraryBook />
            </ProfileHeader> */}
            {/* <ProfileHeader title="Exam Rank Chart">
              <ExamChart />
            </ProfileHeader> */}
          </Flex>
        </LoadingContainer>
      </Box>
    </Box>
  );
};

const ProfileHeader = ({ children, title }) => {
  const themeColor = "blue"; // Can be passed as a prop
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Box
      w={{ base: "100%", md: "49%" }}
      minH="400px"
      bg={cardBg}
      borderRadius="lg"
      boxShadow={`0 4px 8px ${themeColor}.100`}
      overflow="hidden"
      _hover={{ boxShadow: `0 6px 12px ${themeColor}.200` }}
      transition="all 0.3s ease"
    >
      <Flex
        px={4}
        py={2}
        bgGradient={`linear(to-r, ${themeColor}.50, ${themeColor}.100)`}
        borderBottom="1px solid"
        borderColor={`${themeColor}.200`}
        align="center"
      >
        <Text fontWeight="bold" fontSize="md" color={`${themeColor}.600`}>
          {title}
        </Text>
      </Flex>
      <Box p={4} maxH="2290px" overflowY="auto" className="scrollBar">
        {children}
      </Box>
    </Box>
  );
};
