import { URL } from "@/services/apis";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import {
  Box,
  Flex,
  Image,
  Text,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { compact } from "lodash";

export const SchoolHeader = ({
  schoolData,
  title,
  extra,
  haveToShowMoreInfo = true,
}) => {
  const session = getLocalStorageItem("sessionMaster");
  const school = getLocalStorageItem("user");
  const currentSchoolData = school?.schoolData || schoolData;

  return (
    <Flex minH={"100px"} align={"center"} p={0} bg="white" boxShadow="sm" borderRadius="lg" position="relative">
      {/* Top Section - Reg No and Affiliation */}
      <Flex position="absolute" top={2} left={2} right={2} justify="space-between">
        <HStack spacing={4}>
          {currentSchoolData?.regNo && (
            <Text fontSize={"xs"} fontWeight="500" color="gray.700">
              Reg No:{" "}
              <Text as="span" fontWeight="normal" color="gray.600">
                {currentSchoolData.regNo}
              </Text>
            </Text>
          )}
        </HStack>
        <HStack spacing={4}>
          {currentSchoolData?.affiliationNo && (
            <Text fontSize={"xs"} fontWeight="500" color="gray.700">
              Affiliation:{" "}
              <Text as="span" fontWeight="normal" color="gray.600">
                {currentSchoolData.affiliationNo}
              </Text>
            </Text>
          )}
        </HStack>
      </Flex>

      {/* Main Content */}
      <Flex w="100%" mt={8} align={"center"}>
        {/* Left Section - Logo */}
        <Flex p={0} w={"25%"} align={"center"} justify={"center"} direction="column">
          {currentSchoolData?.logo ? (
            <Image
              h={"150px"}
              w={"150px"}
              src={`${URL}${currentSchoolData?.logo}`}
              objectFit={"cover"}
              alt="School Logo"
              p={2}
              transition="transform 0.3s"
              _hover={{ transform: "scale(1.05)" }}
            />
          ) : (
            <Box
              h={"150px"}
              w={"150px"}
              bg="gray.50"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="2px dashed"
              borderColor="gray.300"
              borderRadius="lg"
              transition="all 0.3s"
              _hover={{ borderColor: "blue.300", bg: "blue.50" }}
            >
              <Text fontSize="sm" color="gray.500">
                No Logo
              </Text>
            </Box>
          )}
        </Flex>

        {/* Middle Section - School Info */}
        <VStack w={"55%"} align={"center"} spacing={0}>
          {currentSchoolData?.name && (
            <Text
              fontSize={"2xl"}
              fontWeight={"bold"}
              textAlign="center"
              color="blue.700"
              mb={1}
              textShadow="0 1px 2px rgba(0,0,0,0.1)"
            >
              {currentSchoolData?.name}
            </Text>
          )}
          {currentSchoolData?.address ||
          currentSchoolData?.district ||
          currentSchoolData?.state ? (
            <Text
              fontSize={"xs"}
              fontWeight={600}
              textAlign="center"
              color="gray.600"
              mb={1}
            >
              {compact([
                currentSchoolData?.address,
                currentSchoolData?.district,
                currentSchoolData?.state,
              ]).join(", ")}
            </Text>
          ) : null}
          <Divider borderColor="blue.200" w="90%" mb={1} />

          <HStack
            spacing={2}
            fontSize={"xs"}
            mb={0.5}
            flexWrap="wrap"
            justify="center"
          >
            {currentSchoolData?.email && (
              <Text fontWeight="500" color="gray.700">
                Email:{" "}
                <Text as="span" fontWeight="normal" color="gray.600">
                  {currentSchoolData.email}
                </Text>
              </Text>
            )}
            {currentSchoolData?.website && (
              <Text fontWeight="500" color="gray.700">
                Website:{" "}
                <Text as="span" fontWeight="normal" color="gray.600">
                  {currentSchoolData.website}
                </Text>
              </Text>
            )}
          </HStack>

          {session && (
            <Text
              fontSize={"xs"}
              fontWeight={"600"}
              bg="green.100"
              color="green.700"
              px={2}
              py={0.5}
              borderRadius="full"
              mt={0.5}
            >
              Session: {session.name}
            </Text>
          )}
          {title && (
            <Text
              mt={1}
              fontSize={"sm"}
              fontWeight={"bold"}
              color="blue.600"
              bg="blue.50"
              px={2}
              py={0.5}
              borderRadius="full"
            >
              {title}
            </Text>
          )}
        </VStack>

        {/* Right Section - Extra Info */}
        <VStack w={"20%"} pr={1} align={"flex-end"} spacing={1}>
          {extra && (
            <Box fontSize={"xs"} mt={1}>
              {extra}
            </Box>
          )}
        </VStack>
      </Flex>
    </Flex>
  );
};
