import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useLoginStore } from "@/store/Login";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/LocalStorage";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { toUpper } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaPhone, FaEnvelope, FaExclamationTriangle } from "react-icons/fa";
export const LoginUser = ({ themeColor }) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState({});
  const [passType, setPassType] = useState("password");
  const [toggleRenewal, setToggleRenewal] = useState(null);

  useEffect(() => {
    if (inputValue?.orgCode) {
      setInputValue((pre) => ({
        ...pre,
        orgCode: toUpper(inputValue?.orgCode),
      }));
    }
  }, [inputValue?.orgCode]);

  useEffect(() => {
    const token = getLocalStorageItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const { loginUserAction, userLoginStatus, userLogin, resetStatus } =
    useLoginStore((s) => ({
      loginUserAction: s.loginUserAction,
      userLoginStatus: s.userLoginStatus,
      userLogin: s.userLogin,
      resetStatus: s.resetStatus,
    }));

  const loginUser = (e) => {
    e.preventDefault();
    loginUserAction(inputValue);
  };

  const change = (data) => {
    if (data === "password") {
      setPassType("text");
    } else {
      setPassType("password");
    }
  };

  useEffect(() => {
    if (userLoginStatus === STATUS.SUCCESS && userLogin) {
      resetStatus();
      if (
        dayjs(userLogin?.schoolData?.expireDate).format("YYYY-MM-DD") >
        dayjs().format("YYYY-MM-DD")
      ) {
        setLocalStorageItem("token", userLogin?.accessToken);
        setLocalStorageItem("bulkMessageStatus", userLogin?.bulkMessageStatus);
        setLocalStorageItem("user", userLogin);
        setLocalStorageItem("sessionMasterId", userLogin?.sessionData?.id);
        setLocalStorageItem("sessionMaster", userLogin?.sessionData);
        setLocalStorageItem("themeColor", "blue");
        setLocalStorageItem("masterCheck", userLogin?.masterCheck);
        setLocalStorageItem("marksheetLayout", 1);
        setLocalStorageItem("receiptLayout", 1);
        setLocalStorageItem("tcLayout", 1);
        setLocalStorageItem("isTransportCombine", userLogin?.schoolData?.isTransportCombine);
        router.push("/");
        window.location.reload();
      } else {
        setToggleRenewal(true);
      }
    }
  }, [resetStatus, router, userLogin, userLoginStatus]);

  return (
    <Flex
      h="100vh"
      w="100vw"
      justify="center"
      align="center"
      bg="gray.50"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative Elements */}
      <Box
        position="absolute"
        top="-10%"
        left="-10%"
        w="400px"
        h="400px"
        bg={`${themeColor}.900`}
        opacity="0.3"
        borderRadius="full"
        filter="blur(80px)"
      />
      <Box
        position="absolute"
        bottom="-10%"
        right="-10%"
        w="400px"
        h="400px"
        bg={`${themeColor}.900`}
        opacity="0.3"
        borderRadius="full"
        filter="blur(80px)"
      />

      {/* Login Container */}
      <Flex
        h="85%"
        w="80%"
        flexDir={{ base: "column", md: "row" }}
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="2xl"
        bg="white"
      >
        {/* Left Side - Branding Section */}
        <Flex
          flexDir="column"
          p={10}
          w={{ base: "100%", md: "50%" }}
          bgGradient={`linear(to-br, ${themeColor}.600, ${themeColor}.800)`}
          align="center"
          justify="center"
          position="relative"
        >
          {/* Decorative Pattern */}
          <Box
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            bgImage="url('/assets/pattern.svg')" // Add a subtle pattern
            opacity="0.1"
          />
          <Image
            w="100%"
            maxW="400px"
            src="/assets/SmartPaathshala.png"
            alt="Smart Paathshala"
            zIndex="1"
          />
          <Text
            mt={6}
            fontSize="xl"
            fontWeight="bold"
            color="white"
            textAlign="center"
            zIndex="1"
          >
            Smart Tools for Smarter Schools
          </Text>
        </Flex>

        {/* Right Side - Login Form */}
        <Flex
          flexDir="column"
          w={{ base: "100%", md: "50%" }}
          h="100%"
          bg="white"
          align="flex-start"
          px={{ base: 6, md: 28 }}
          py={10}
          justify="center"
          position="relative"
        >
          {/* Decorative Accent */}
          <Box
            position="absolute"
            top="0"
            left="0"
            w="4px"
            h="100%"
            bg={`${themeColor}.500`}
          />
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Login to Your Account
          </Text>

          <form style={{ width: "100%" }} onSubmit={loginUser}>
            <VStack spacing={6}>
              <CustomInput
                type="text"
                name="orgCode"
                label="Organisation Code"
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                type="number"
                name="mobileNo"
                label="Registered Mobile Number"
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                type={passType}
                name="password"
                label="Password"
                inputValue={inputValue}
                setInputValue={setInputValue}
                isPassword={true}
                change={change}
              />
            </VStack>
            <Button
              mt={8}
              w="100%"
              size="lg"
              colorScheme={themeColor}
              type="submit"
              isLoading={userLoginStatus === STATUS.FETCHING}
              _hover={{ transform: "scale(1.02)", boxShadow: "md" }}
              transition="all 0.2s"
            >
              Login
            </Button>
          </form>

          <Text
            onClick={() => router.push("/forgotPassword")}
            mt={4}
            w="100%"
            fontSize="sm"
            textAlign="center"
            color={`${themeColor}.500`}
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
          >
            Forgot Password?
          </Text>

          <Text
            w="100%"
            mt={6}
            fontSize="sm"
            textAlign="center"
            color="gray.600"
          >
            Need help? Contact Support:&nbsp;
            <Link
              href="tel:+916367908919"
              color={`${themeColor}.500`}
              fontWeight="bold"
            >
              +91 6367-9089-19
            </Link>
          </Text>
        </Flex>
      </Flex>

      {toggleRenewal && (
        <Modal size="3xl" isOpen={true} isCentered>
          <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
          <ModalContent
            bg={cardBg}
            borderRadius="xl"
            boxShadow={`0 10px 20px ${themeColor}.200`}
            p={6}
            position="relative"
            overflow="hidden"
            bgGradient={`linear(to-b, ${themeColor}.50, ${cardBg})`}
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              w="100%"
              h="8px"
              bgGradient={`linear(to-r, ${themeColor}.400, ${themeColor}.600)`}
            />
            <ModalHeader
              borderBottom="1px solid"
              borderColor={`${themeColor}.100`}
              textAlign="center"
              py={4}
            >
              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
                color={`${themeColor}.600`}
                bgGradient={`linear(to-r, ${themeColor}.500, ${themeColor}.700)`}
                bgClip="text"
              >
                Renewal Notification
              </Text>
            </ModalHeader>

            <ModalBody>
              <VStack spacing={2} align="center">
                {/* Centered Image */}
                <ScaleFade initialScale={0.8} in={true}>
                  <Flex justify="center" w="full">
                    <Image
                      mt={5}
                      w={{ base: "30%", md: "40%" }}
                      src="/assets/SmartPaathshala.png"
                      alt="WebSquare Software Pvt. Ltd."
                      borderRadius="md"
                      boxShadow={`0 4px 12px ${themeColor}.200`}
                      transition="all 0.3s"
                      _hover={{ transform: "scale(1.05)" }}
                    />
                  </Flex>
                </ScaleFade>

                <Text
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="extrabold"
                  color={`${themeColor}.500`}
                  textShadow={`1px 1px 2px ${themeColor}.200`}
                  my={0}
                >
                  Your Account License Has Expired!
                </Text>

                <Text
                  fontSize={{ base: "md", md: "md" }}
                  color={textColor}
                  maxW="500px"
                  px={4}
                  py={2}
                  bg={`${themeColor}.50`}
                  borderRadius="md"
                  boxShadow="sm"
                >
                  Please renew it by contacting the Paathshala Support Team.
                </Text>

                <Flex
  my={5}
  justify="center"
  align="center"
  w="full"
  // p={{ base: 3, md: 2 }}
  py={3}
  bg={`${themeColor}.100`}
  borderRadius="lg"
  boxShadow={`0 4px 8px ${themeColor}.200`}
  fontSize={{ base: "sm", md: "lg" }}
  fontWeight="bold"
  color={textColor}
  gap={{ base: 2, md: 1 }}
  flexWrap={{ base: "wrap", md: "nowrap" }} // Prevent wrapping on larger screens
  direction="row"
>
  {[
    { label: "Customer Care:", number: "+91 141-492-0003" },
    { label: "Call us:", number: "+91 9694-222-788" },
    { label: "Call us:", number: "+91 6367-9089-19" },
  ].map((contact, index) => (
    <HStack
      key={index}
      spacing={3}
      p={3}
      bg={`${themeColor}.50`}
      borderRadius="md"
      transition="all 0.3s"
      _hover={{
        bg: `${themeColor}.200`,
        transform: "translateY(-2px)",
        boxShadow: `0 6px 12px ${themeColor}.300`,
      }}
      fontSize={{ base: "xs", md: "12px" }}
    >
      <Icon as={FaPhone} w={3} h={3} color={`${themeColor}.600`} />
      <Text>
        {contact.label} {contact.number}
      </Text>
    </HStack>
  ))}
</Flex>


                <Icon
                  as={FaExclamationTriangle}
                  w={10}
                  h={10}
                  color={`${themeColor}.400`}
                  opacity={0.2}
                  position="absolute"
                  bottom={4}
                  right={4}
                />
              </VStack>
            </ModalBody>

            <Box textAlign="center" py={4}>
              <Button
                colorScheme={themeColor}
                size="lg"
                px={8}
                mt={4}
                boxShadow={`0 4px 8px ${themeColor}.200`}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: `0 6px 12px ${themeColor}.300`,
                }}
                transition="all 0.2s"
                onClick={() => {
                  window.location.href =
                    "https://newwebsquaressoftware.nowpay.co.in";
                }}
              >
                Renew  License Now
              </Button>
            </Box>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
};
