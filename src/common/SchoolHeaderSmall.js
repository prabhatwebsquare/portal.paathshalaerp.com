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

export const SchoolHeaderSmall = ({ schoolData, title, extra }) => {
  const session = getLocalStorageItem("sessionMaster");
  const school = getLocalStorageItem("user");
  const currentSchoolData = school?.schoolData || schoolData;

  return (
    <Box w="100%" p={1} fontSize="8px" position="relative">
      {/* Top Section - Reg No and Affiliation */}
      <Flex position="absolute" top={0} left={1} right={1} justify="space-between">
        <HStack spacing={2}>
          {currentSchoolData?.regNo && (
            <Text fontSize="7px" fontWeight="500" color="gray.700">
              Reg No:{" "}
              <Text as="span" fontWeight="normal" color="gray.600">
                {currentSchoolData.regNo}
              </Text>
            </Text>
          )}
        </HStack>
        <HStack spacing={2}>
          {currentSchoolData?.affiliationNo && (
            <Text fontSize="7px" fontWeight="500" color="gray.700">
              Affiliation:{" "}
              <Text as="span" fontWeight="normal" color="gray.600">
                {currentSchoolData.affiliationNo}
              </Text>
            </Text>
          )}
        </HStack>
      </Flex>

      <Flex align="start" justify="space-between" mt={4}>
        {/* Left: Logo */}
        <Box w="20%" display="flex" alignItems="center" justifyContent="flex-start">
          {currentSchoolData?.logo ? (
            <Image
              h="60px"
              w="60px"
              src={`${URL}${currentSchoolData.logo}`}
              objectFit="cover"
              alt="Logo"
              p={1}
            />
          ) : (
            <Box
              h="60px"
              w="60px"
              bg="gray.50"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="1px dashed"
              borderColor="gray.300"
              borderRadius="md"
            >
              <Text fontSize="6px" color="gray.400">No Logo</Text>
            </Box>
          )}
        </Box>

        {/* Center: School Info */}
        <VStack w="60%" spacing={0.5} align="center">
          {/* School Name */}
          {currentSchoolData?.name && (
            <Text fontWeight="bold" fontSize="10px" textAlign="center" color="blue.700">
              {currentSchoolData.name}
            </Text>
          )}
          {/* Address */}
          {(currentSchoolData?.address ||
            currentSchoolData?.district ||
            currentSchoolData?.state) && (
            <Text textAlign="center" color="gray.600" fontWeight="500" fontSize="7px">
              {compact([
                currentSchoolData?.address,
                currentSchoolData?.district,
                currentSchoolData?.state,
              ]).join(", ")}
            </Text>
          )}

          <Divider borderColor="gray.300" my={0.5} />

          <HStack spacing={2} flexWrap="wrap" justify="center">
            {currentSchoolData?.email && (
              <Text fontWeight="500" fontSize="7px">
                Email: <Text as="span" fontWeight="normal" fontSize="6px">{currentSchoolData.email}</Text>
              </Text>
            )}
            {currentSchoolData?.website && (
              <Text fontWeight="500" fontSize="7px">
                Web: <Text as="span" fontWeight="normal" fontSize="6px">{currentSchoolData.website}</Text>
              </Text>
            )}
          </HStack>
          {session && (
            <Text bg="green.50" color="green.700" px={1} borderRadius="md" fontSize="7px">
              Session: {session.name}
            </Text>
          )}
          {title && (
            <Text
              mt={1}
              fontWeight="bold"
              color="blue.600"
              bg="blue.50"
              px={1}
              borderRadius="md"
              fontSize="8px"
            >
              {title}
            </Text>
          )}
        </VStack>

        {/* Right: Principal/Director/Extra */}
        <VStack w="20%" align="flex-end" spacing={0.5}>
          {currentSchoolData?.principleName && (
            <Text fontSize="7px">
              <b>Principal:</b> {currentSchoolData.principleName}
            </Text>
          )}
          {currentSchoolData?.directorName && (
            <Text fontSize="7px">
              <b>Director:</b> {currentSchoolData.directorName}
            </Text>
          )}
          {extra && (
            <Box mt={0.5}>
              {extra}
            </Box>
          )}
        </VStack>
      </Flex>
    </Box>
  );
};
