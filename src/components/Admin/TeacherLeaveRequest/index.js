import React from "react";
import {
  Box,
  Text,
  Flex,
  Avatar,
  Badge,
  VStack,
  HStack,
  Button,
  IconButton,
} from "@chakra-ui/react";
import {
  CheckIcon,
  CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { PageHeader } from "@/common/PageHeader";
import { NoData } from "@/common/NoData";

const TeacherLeaveRequest = ({
  themeColor,
  data,
  onApprove,
  onReject,
  currentPage,
  totalPages,
  onPageChange,
}) => {


  return (
    <Box borderRadius="lg">
      <PageHeader heading={"Teacher Leave Request"} />
      <Box height={"70vh"} overflow={"scroll"} className="scrollBar">
        <VStack spacing={4} align="stretch">
          {data?.data?.map((leave) => (
            <Box
              key={leave.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              bg="white"
              borderColor={`${themeColor}.300`}
              shadow="sm"
            >
              <Flex align="center" mb={4}>
                <Avatar
                  src={leave.staff.photo}
                  name={leave.staff.name}
                  size="lg"
                  mr={4}
                  borderWidth="2px"
                  borderColor={`${themeColor}.500`}
                />
                <Box>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color={`${themeColor}.700`}
                  >
                    {leave.staff.name}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {leave.staff.designation}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Email: {leave.staff.email}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Mobile: {leave.staff.mobileNo}
                  </Text>
                </Box>
              </Flex>
              <Box mb={4}>
                <HStack>
                  <Badge colorScheme={`${themeColor}`}>
                    From: {leave.fromDate.split("T")[0]}
                  </Badge>
                  <Badge colorScheme={`${themeColor}`}>
                    To: {leave.toDate.split("T")[0]}
                  </Badge>
                  <Badge colorScheme="green">Days: {leave.days}</Badge>
                </HStack>
                <Text mt={2} fontSize="sm" color="gray.600">
                  Cause: {leave.cause || "Not specified"}
                </Text>
                <Text mt={1} fontSize="sm" color="gray.600">
                  Leave Status:{" "}
                  {leave.leaveStatus === 1 ? (
                    <Badge colorScheme="yellow">Pending</Badge>
                  ) : leave.leaveStatus === 2 ? (
                    <Badge colorScheme="green">Approved</Badge>
                  ) : (
                    <Badge colorScheme="red">Rejected</Badge>
                  )}
                </Text>
              </Box>
              <Flex justifyContent="space-between">
                <Button
                  leftIcon={<CheckIcon />}
                  bg={`${themeColor}.500`}
                  color="white"
                  _hover={{ bg: `${themeColor}.600` }}
                  size="sm"
                  onClick={() => onApprove(leave.id)}
                >
                  Approve
                </Button>
                <Button
                  leftIcon={<CloseIcon />}
                  bg="red.500"
                  color="white"
                  _hover={{ bg: "red.600" }}
                  size="sm"
                  onClick={() => onReject(leave.id)}
                >
                  Reject
                </Button>
              </Flex>
            </Box>
          ))}
        </VStack>
        {
          data?.data?.length === 0 &&
          <NoData
            title={"No Leave Requests Found"}
          />
        }
      </Box>
      {data?.data?.length > 0 &&

        <Flex
          justify="center"
          bg={"white"}
          position="absolute"
          bottom={4}
          w="85vw"
          px={4}
          py={3}
          borderRadius="md"
          boxShadow="md"
          align="center"
          justifyContent="center"
        >
          <Button
            leftIcon={<ChevronLeftIcon />}
            isDisabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous Page"
            colorScheme={`${themeColor}`}
            variant="outline"
            size="sm"
            _hover={{ bg: `${themeColor}.100` }}
            _disabled={{ bg: "gray.200", cursor: "not-allowed" }}
          >
            Prev
          </Button>

          <Text
            mx={6}
            fontSize="lg"
            color={`${themeColor}.700`}
            fontWeight="bold"
          >
            Page {currentPage} of {totalPages}
          </Text>

          <Button
            rightIcon={<ChevronRightIcon />}
            isDisabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next Page"
            colorScheme={`${themeColor}`}
            variant="outline"
            size="sm"
            _hover={{ bg: `${themeColor}.100` }}
            _disabled={{ bg: "gray.200", cursor: "not-allowed" }}
          >
            Next
          </Button>
        </Flex>

      }

    </Box>
  );
};

export default TeacherLeaveRequest;
