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

export const SchoolHeaderSmallIdCard = ({ schoolData, title }) => {
  const school = getLocalStorageItem("user");
  const currentSchoolData = school?.schoolData || schoolData;

  return (
    <Box w="100%" p={1} fontSize="8px" borderRadius="md">
      <Flex align="center" justify="space-between" mb={0}>
        {/* Left: Logo */}
        <Box w="15%" display="flex" alignItems="center" justifyContent="center">
          {currentSchoolData?.logo ? (
            <Image
              h="25px"
              w="25px"
              src={`${URL}${currentSchoolData.logo}`}
              objectFit="cover"
              alt="Logo"
              p={0.5}
            />
          ) : (
            <Box
              h="25px"
              w="25px"
              bg="white"
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

        {/* School Name */}
        <Box w="85%" pl={1}>
          {currentSchoolData?.name && (
            <Text fontWeight="bold" fontSize="9px" color="gray.800">
              {currentSchoolData.name}
            </Text>
          )}
        </Box>
      </Flex>

      {/* Address */}
      {(currentSchoolData?.address ||
        currentSchoolData?.district ||
        currentSchoolData?.state) && (
        <Text textAlign="center" color="gray.700" fontSize="7px" mb={0.5}>
          {compact([
            currentSchoolData?.address,
            currentSchoolData?.district,
            currentSchoolData?.state,
          ]).join(", ")}
        </Text>
      )}

      {title && (
        <Text
          fontWeight="bold"
          color="gray.800"
          textAlign="center"
          fontSize="8px"
          mt={0.5}
        >
          {title}
        </Text>
      )}
    </Box>
  );
};
