import { MainLayout } from "@/layout/MainLayout";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { Box, Flex, Text, Link, Icon, VStack } from "@chakra-ui/react";
import {
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
} from "react-icons/fa";

export default function Support() {
  const themeColor = getLocalStorageItem("themeColor");

  return (
    <MainLayout>
      <Flex
        h="80vh"
        align="center"
        justify="center"
        direction="column"
      >
        <Box
          px={8}
          py={8}
          borderRadius="2xl"
          boxShadow="2xl"
          textAlign="center"
          maxW="2xl"
          w="full"
          position="relative"
          className="scrollBar"
          maxH={"100%"}
          overflowY={"scroll"}
          bg={`${themeColor}.900`} // Dynamic gradient based on theme color
        >
          {/* Decorative Elements */}
          <Box
            position="absolute"
            top="-50px"
            right="-50px"
            w="200px"
            h="200px"
            bg={`${themeColor}.100`} // Decorative circle color based on theme color
            borderRadius="full"
            opacity="0.2"
          />
          <Box
            position="absolute"
            bottom="-50px"
            left="-50px"
            w="200px"
            h="200px"
            bg={`${themeColor}.100`} // Decorative circle color based on theme color
            borderRadius="full"
            opacity="0.2"
          />
          <Text
            fontSize="3xl"
            fontWeight="bold"
            color={`${themeColor}.50`} // Title color based on theme color
            mb={4}
          >
            Support Center
          </Text>
          <Text fontSize="lg" color="white" mb={6} fontWeight={"bold"}>
            We&apos;re here to help you with any questions or issues you might
            have. Please reach out to us via WhatsApp or email.
          </Text>

          <Flex
            align="center"
            justify="center"
            mb={6}
            p={4}
            bg={`${themeColor}.50`} // Background color based on theme color
            borderRadius="lg"
            _hover={{ bg: `${themeColor}.100`, transform: "scale(1.02)" }}
            transition="all 0.2s"
          >
            <Icon
              as={FaWhatsapp}
              w={8}
              h={8}
              color={`${themeColor}.500`}
              mr={2}
            />
            <Link href="https://wa.me/9694222788" isExternal>
              <Text
                fontSize="xl"
                color={`${themeColor}.700`}
                fontWeight="semibold"
              >
                Chat with us on WhatsApp
              </Text>
            </Link>
          </Flex>

          <VStack
            spacing={6}
            align="start"
            mt={8}
            p={6}
            bg="white"
            borderRadius="2xl"
            boxShadow="md"
          >
            <Flex direction={{ base: "column", md: "row" }} gap={6} w="full">
              <Flex
                align="center"
                p={4}
                bg={`${themeColor}.50`} // Background color based on theme color
                borderRadius="lg"
                flex={1}
                _hover={{
                  transform: "scale(1.02)",
                  bg: `${themeColor}.100`, // Hover effect based on theme color
                  boxShadow: "lg",
                }}
                transition="all 0.2s"
              >
                <Icon
                  as={FaMapMarkerAlt}
                  w={8}
                  h={8}
                  color={`${themeColor}.500`}
                  mr={4}
                />
                <Box>
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color={`${themeColor}.800`} // Title color based on theme color
                    mb={1}
                  >
                    Address
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    311, 3rd Floor, Center Tower, Central Spine, Vidhyadhar
                    Nagar, Jaipur (Raj.) - 302039, INDIA
                  </Text>
                </Box>
              </Flex>
              <Flex
                align="center"
                p={6}
                bg={`${themeColor}.50`} // Background color based on theme color
                borderRadius="2xl"
                flex={1}
                _hover={{
                  transform: "scale(1.02)",
                  bg: `${themeColor}.100`, // Hover effect based on theme color
                  boxShadow: "xl",
                }}
                transition="all 0.3s ease-in-out"
              >
                <Box>
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color={`${themeColor}.800`} // Title color based on theme color
                    mb={3}
                  >
                    Support
                  </Text>

                  {/* Phone Numbers */}
                  {["+91 141 4920003", "+91 9694222788", "+91 63679 08919" ,  "+91 9694222788"].map(
                    (number, index) => (
                      <Flex align="center" mb={2} key={index}>
                        <Icon
                          as={FaPhone}
                          w={5}
                          h={5}
                          color={`${themeColor}.500`}
                          mr={3}
                        />
                        <Text fontSize="md" color="gray.600">
                          {number}
                        </Text>
                      </Flex>
                    )
                  )}
                </Box>
              </Flex>
            </Flex>
            <Flex
              align="center"
              justify="center"
              mb={2}
              w={"100%"}
              p={4}
              bg={`${themeColor}.100`}
              borderRadius="lg"
              _hover={{ bg: `${themeColor}.200`, transform: "scale(1.02)" }}
              transition="all 0.2s"
            >
              <Icon
                as={FaEnvelope}
                w={8}
                h={8}
                color={`${themeColor}.500`}
                mr={2}
              />
              <Text
                fontSize="xl"
                color={`${themeColor}.700`}
                fontWeight="semibold"
              >
                support@paathshala.net.in
              </Text>
            </Flex>
          </VStack>
          <Flex align="center" justify="center" mt={6}>
            <Icon as={FaClock} w={5} h={5} color="white" mr={2} />
            <Text fontSize="sm" color="white" fontWeight="semibold">
              Our support team is available{" "}
              <strong>Mon - Sat, 10 AM to 6 PM</strong> to assist you.
            </Text>
          </Flex>
        </Box>
      </Flex>
    </MainLayout>
  );
}
