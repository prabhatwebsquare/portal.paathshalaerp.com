import { URL } from "@/services/apis";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { Box, Flex, Image, Text } from "@chakra-ui/react";

export const TransporterHeader = ({ schoolData, title, extra }) => {
  const transporter = getLocalStorageItem("transport");

  // Use transporter data from localStorage if available, otherwise fallback to schoolData prop
  const currentTransporterData = transporter || schoolData;

  return (
    <Flex
      h={currentTransporterData ? "105px" : "auto"}
      border={currentTransporterData ? "1px solid" : "none"}
      borderColor={"gray.200"}
      align={"center"}
    >
      {currentTransporterData && (
        <>
          {/* Logo Section */}
          <Flex p={3} w={"25%"} align={"center"}>
            {currentTransporterData?.logo ? (
              <Image
                h={"90px"}
                w="60%"
                src={`${URL}${currentTransporterData.logo}`}
                objectFit={"contain"}
                alt="Transporter Logo"
              />
            ) : null}
          </Flex>

          {/* Transporter Details */}
          <Box w={"50%"} align={"center"}>
            <Text fontSize={20} fontWeight={"semibold"}>
              {currentTransporterData?.name || "Transporter Name"}
            </Text>
            <Text fontSize={14}>
              {currentTransporterData?.address || "Transporter Address"}
            </Text>
            <Text mt={2} fontSize={18} fontWeight={"semibold"}>
              {title || "Transport Information"}
            </Text>
          </Box>

          {/* Extra Details */}
          <Box w={"25%"} pr={2}>
            <Flex flexDir={"column"} align={"flex-end"} fontSize={12}>
              <Text fontSize={14}>
                Contact: {currentTransporterData?.mobileNo || "N/A"}
              </Text>
              {extra}
            </Flex>
          </Box>
        </>
      )}
    </Flex>
  );
};
