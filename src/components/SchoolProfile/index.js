import { Avatar, Box, Flex, Icon, Text, Tooltip } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { ArrowBackIcon, EditIcon, PhoneIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { IoMdMail } from "react-icons/io";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import dayjs from "dayjs";
import { UpdateSchool } from "../Admin/UpdateSchool";

export const SchoolProfile = ({ themeColor }) => {
  const router = useRouter();
  const user = getLocalStorageItem("user");
  const school = useMemo(() => {
    return user?.schoolData;
  }, [user?.schoolData]);
  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
  );
  return (
    <Box>
      <Flex
        py={4}
        bgGradient={`linear(to-r, ${themeColor}.700, ${themeColor}.50)`}
        color="white"
        align="center"
        justify="space-between"
        borderRadius="12px"
        boxShadow="xl"
        px={6}
        position="relative"
        overflow="hidden"
      >
        {/* Decorative Elements */}
        <Box
          position="absolute"
          top="-50px"
          left="-50px"
          w="200px"
          h="200px"
          bg={`${themeColor}.300`}
          opacity="0.3"
          borderRadius="full"
          filter="blur(80px)"
        />
        <Box
          position="absolute"
          bottom="-50px"
          right="-50px"
          w="200px"
          h="200px"
          bg={`${themeColor}.400`}
          opacity="0.3"
          borderRadius="full"
          filter="blur(80px)"
        />

        {/* Back Button */}
        <Tooltip placement="top" label="Back">
          <ArrowBackIcon
            boxSize={7}
            onClick={() => router.back()}
            _hover={{
              transform: "scale(1.1)",
              transition: "0.2s",
              cursor: "pointer",
            }}
          />
        </Tooltip>

        {/* School Info */}
        <Flex align="center" ml={6} flex={1}>
          {/* School Logo */}
          <Flex pos="relative">
            <Avatar
              size="lg"
              src={school?.logo}
              name={school?.name}
              showBorder
              borderColor="white"
              borderWidth={3}
              _hover={{
                boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)",
                transform: "scale(1.05)",
                transition: "0.3s",
              }}
            />
          </Flex>
          <Box ml={6}>
            <Text fontSize="2xl" fontWeight="bold" color="white">
              {school?.name}
            </Text>
            {school?.email && (
              <Flex fontSize="sm" align="center" mt={1}>
                <Icon as={IoMdMail} w={5} h={5} color="white" />
                <Text ml={2}>{school?.email}</Text>
              </Flex>
            )}
            <Flex fontSize="sm" align="center" mt={1}>
              <Icon as={PhoneIcon} w={5} h={5} color="white" />
              <Text ml={2}>{school?.mobileNo}</Text>
            </Flex>
          </Box>
        </Flex>
        <Box
          bg={`${themeColor}.400`}
          px={4}
          py={2}
          borderRadius="lg"
          boxShadow="md"
          _hover={{ transform: "scale(1.02)", transition: "all 0.2s" }}
        >
          <Text fontSize="sm" fontWeight="semibold" color="white">
            Renewal Date:{" "}
            {school?.expireDate
              ? dayjs(school?.expireDate).format("DD-MM-YYYY")
              : "-"}
          </Text>
        </Box>
      </Flex>

      <UpdateSchool
        key={school}
        themeColor={themeColor}
        sessionMasterId={sessionMasterId}
        schoolDate={school}
      />
    </Box>
  );
};
