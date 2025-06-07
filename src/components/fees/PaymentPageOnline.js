import { useRef } from 'react';
import { Box, Button, Text, Flex, Image, VStack, Heading, Badge, Input } from "@chakra-ui/react";
import { compact } from "lodash";
import { MdSchool, MdPerson } from "react-icons/md";
import { URL } from "@/services/apis";
import AtomPaynetz from "../AtomPaynetz";

export const PaymentPageOnline = ({ SchoolInfo, admissionId, themeColor }) => {
  const SCHOOLDATA = SchoolInfo?.schoolData;
  const session = SchoolInfo?.sessionData;
  const atomPayRef = useRef();

  const handlePayment = () => {
    atomPayRef.current?.openPay({
      custEmail: 'abc@gmail.com',
      custMobile: '1234567890',
      amount: '200',
    });
  };

  return (
    <Box minH="100vh" bg={`${themeColor}.50`}>
      {/* Header Card */}
      <Box bg="white" p={4} boxShadow="md" position="relative" overflow="hidden" mb={4}>
        <Box position="absolute" top={0} left={0} w="100%" h="4px" bgGradient={`linear(to-r, ${themeColor}.400, ${themeColor}.600)`} />
        <Box maxW="1200px" mx="auto">
          <Flex direction={{ base: "column", md: "row" }} align="center" gap={4}>
            <Box>
              <Image
                src={URL + (SCHOOLDATA?.logo || "https://via.placeholder.com/150")}
                alt="School Logo"
                h="120px"
                w="120px"
                borderRadius="lg"
                boxShadow="sm"
                p={1}
                bg="white"
                objectFit="contain"
              />
            </Box>

            <VStack flex={1} align="center" spacing={2}>
              <Heading
                size="lg"
                bgGradient={`linear(to-r, ${themeColor}.600, ${themeColor}.400)`}
                bgClip="text"
                textAlign="center"
              >
                {SCHOOLDATA?.name}
              </Heading>

              <Text fontSize="sm" color="gray.600" fontStyle="italic" textAlign="center">
                {compact([SCHOOLDATA?.address, SCHOOLDATA?.district, SCHOOLDATA?.state]).join(", ")}
              </Text>

              <Flex gap={2} wrap="wrap" justify="center">
                <Badge colorScheme={themeColor} px={2} py={0.5} borderRadius="full" fontSize="xs">
                  <Flex align="center" gap={1}>
                    <MdSchool size={14} />
                    <Text>School Code: {SCHOOLDATA?.schoolCode}</Text>
                  </Flex>
                </Badge>
                <Badge colorScheme={themeColor} px={2} py={0.5} borderRadius="full" fontSize="xs">
                  <Flex align="center" gap={1}>
                    <MdSchool size={14} />
                    <Text>Reg No: {SCHOOLDATA?.regNo}</Text>
                  </Flex>
                </Badge>
                <Badge colorScheme={themeColor} px={2} py={0.5} borderRadius="full" fontSize="xs">
                  <Flex align="center" gap={1}>
                    <MdSchool size={14} />
                    <Text>Affiliation: {SCHOOLDATA?.affiliationNo}</Text>
                  </Flex>
                </Badge>
                <Badge colorScheme={themeColor} px={2} py={0.5} borderRadius="full" fontSize="xs">
                  <Flex align="center" gap={1}>
                    <MdPerson size={14} />
                    <Text>Contact: {SCHOOLDATA?.mobileNo}</Text>
                  </Flex>
                </Badge>
              </Flex>

              <Box
                p={2}
                bg={`${themeColor}.50`}
                borderRadius="md"
                textAlign="center"
                border="1px dashed"
                borderColor={`${themeColor}.200`}
              >
                <Heading size="sm" color={`${themeColor}.700`} textTransform="uppercase" letterSpacing="wider">
                  Online Payment of Student Fees {session?.name}
                </Heading>
              </Box>
            </VStack>
          </Flex>
        </Box>
      </Box>

      {/* Form Section */}
      <Box maxW="1000px" mx="auto" px={4}>
        <Box bg="white" p={6} borderRadius="xl" boxShadow="lg" maxH="80vh" overflowY="auto">
          <form>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text mb={2} fontWeight="medium">Organisation Code</Text>
                <Input placeholder="Enter Organisation Code" size="md" name="ordgCode" required />
              </Box>
              <Box>
                <Text mb={2} fontWeight="medium">Admission No</Text>
                <Input placeholder="Enter Admission Number" size="md" name="admissionNo" required />
              </Box>
              <Box>
                <Text mb={2} fontWeight="medium">Date of Birth</Text>
                <Input type="date" size="md" name="dob" required />
              </Box>
            </VStack>
          </form>
          <Button colorScheme={themeColor} mt={4}>Submit</Button>
          {/* <Button colorScheme={themeColor} mt={4} onClick={handlePayment}>
            Pay Now
          </Button> */}

          {/* Hidden Atom Pay Component */}
          <AtomPaynetz ref={atomPayRef} />
        </Box>
      </Box>
    </Box>
  );
};