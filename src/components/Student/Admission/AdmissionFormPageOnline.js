import { PageHeader } from "@/common/PageHeader";
import { Box, Button, Text, Flex, Image, VStack, Heading, Badge } from "@chakra-ui/react";
import { AdmissionFormOnline } from "./AdmissionFormOnline";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { compact } from "lodash";
import { MdSchool, MdPerson, MdCalendarToday } from "react-icons/md";
import { URL } from "@/services/apis";

export const AdmissionFormPageOnline = ({SchoolInfo , admissionId ,  themeColor }) => {
  const  SCHOOLDATA = SchoolInfo?.schoolData
  const session = SchoolInfo?.sessionData;
  return (
    <Box minH="100vh" bg={`${themeColor}.50`}>
      {/* Header Card - Full Width */}
      <Box
        bg="white"
        p={4}
        boxShadow="md"
        position="relative"
        overflow="hidden"
        mb={4}
      >
        {/* Decorative Elements */}
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="4px"
          bgGradient={`linear(to-r, ${themeColor}.400, ${themeColor}.600)`}
        />

        {/* School Info */}
        <Box maxW="1200px" mx="auto">
          <Flex direction={{ base: "column", md: "row" }} align="center" gap={4}>
            {/* School Logo */}
            <Box>
              <Image
                src={ URL + SCHOOLDATA?.logo || "https://via.placeholder.com/150"}
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
              {/* School Name */}
              <Heading
                size="lg"
                bgGradient={`linear(to-r, ${themeColor}.600, ${themeColor}.400)`}
                bgClip="text"
                textAlign="center"
              >
                {SCHOOLDATA?.name}
              </Heading>
              
              {/* School Address */}
              <Text
                fontSize="sm"
                color="gray.600"
                fontStyle="italic"
                textAlign="center"
              >
                {compact([
                  SCHOOLDATA?.address,
                  SCHOOLDATA?.district,
                  SCHOOLDATA?.state,
                ]).join(", ")}
              </Text>

              {/* School Info Badges */}
              <Flex gap={2} wrap="wrap" justify="center">
                {/* School Code Badge */}
                <Badge
                  colorScheme={themeColor}
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  fontSize="xs"
                >
                  <Flex align="center" gap={1}>
                    <MdSchool size={14} />
                    <Text>School Code: {SCHOOLDATA?.schoolCode}</Text>
                  </Flex>
                </Badge>

                {/* Registration Number Badge */}
                <Badge
                  colorScheme={themeColor}
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  fontSize="xs"
                >
                  <Flex align="center" gap={1}>
                    <MdSchool size={14} />
                    <Text>Reg No: {SCHOOLDATA?.regNo}</Text>
                  </Flex>
                </Badge>

                {/* Affiliation Badge */}
                <Badge
                  colorScheme={themeColor}
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  fontSize="xs"
                >
                  <Flex align="center" gap={1}>
                    <MdSchool size={14} />
                    <Text>Affiliation: {SCHOOLDATA?.affiliationNo}</Text>
                  </Flex>
                </Badge>

                {/* Contact Badge */}
                <Badge
                  colorScheme={themeColor}
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  fontSize="xs"
                >
                  <Flex align="center" gap={1}>
                    <MdPerson size={14} />
                    <Text>Contact: {SCHOOLDATA?.mobileNo}</Text>
                  </Flex>
                </Badge>

                {/* Academic Year Badge */}
              
              </Flex>

              {/* Form Title Box */}
              <Box
                p={2}
                bg={`${themeColor}.50`}
                borderRadius="md"
                textAlign="center"
                border="1px dashed"
                borderColor={`${themeColor}.200`}
              >
                <Heading
                  size="sm"
                  color={`${themeColor}.700`}
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Online Student Admission Form   {session?.name}
                </Heading>
              </Box>
            </VStack>
          </Flex>
        </Box>
      </Box>

      {/* Form Section - Centered with max width */}
      <Box maxW="1000px" mx="auto" px={4}>
        <Box
          bg="white"
          p={6}
          borderRadius="xl"
          boxShadow="lg"
          className="scrollBar"
          maxH="80vh"
          overflowY="auto"
        >
          <AdmissionFormOnline
          SCHOOLDATA={SCHOOLDATA}
          admissionId={admissionId}
            themeColor={themeColor}
            sessionMasterId={session?.id}
          />
        </Box>
      </Box>
    </Box>
  );
};
