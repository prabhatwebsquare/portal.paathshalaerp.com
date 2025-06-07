import React, { useState, useEffect } from "react";
import CustomInput from "@/common/CustomInput";
import { Box, Button, Flex, Image, Text, VStack } from "@chakra-ui/react";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { toUpper } from "lodash";
import { useLoginStore } from "@/store/Login";
import { STATUS } from "@/constant";
import { useRouter } from "next/router";
function ForgotPassword() {
  const themeColor = getLocalStorageItem("themeColor") || "blue";
  const [inputValues, setInputValues] = useState({
    orgCode: "",
    email: "",
    otp: "",
  });
  const router = useRouter();
  const [showVerificationField, setShowVerificationField] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(30);
  useEffect(() => {
    if (isResendDisabled && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
    if (timer === 0) {
      setIsResendDisabled(false);
    }
  }, [isResendDisabled, timer]);
  const handleResendCode = () => {
    setIsResendDisabled(true);
    setTimer(30);
    forgotPasswordAction(inputValues);
  };
  useEffect(() => {
    if (inputValues?.orgCode) {
      setInputValues((pre) => ({
        ...pre,
        orgCode: toUpper(inputValues?.orgCode),
      }));
    }
  }, [inputValues?.orgCode]);

  const {
    forgotPasswordAction,
    resetPasswordAction,
    resetPasswordStatus,
    forgotPasswordStatus,
  } = useLoginStore((s) => ({
    forgotPasswordStatus: s.forgotPasswordStatus,
    forgotPasswordAction: s.forgotPasswordAction,
    resetPasswordAction: s.resetPasswordAction,
    resetPasswordStatus: s.resetPasswordStatus,
  }));

  const handleSendCode = () => {
    forgotPasswordAction(inputValues);
  };

  useEffect(() => {
    if (forgotPasswordStatus == STATUS.SUCCESS) {
      setShowVerificationField(true);
      setIsResendDisabled(true);
      setTimer(30);
    }
    return () => {};
  }, [forgotPasswordStatus]);

  useEffect(() => {
    if (resetPasswordStatus == STATUS.SUCCESS) {
      router.push("/login");
    }
    return () => {};
  }, [resetPasswordStatus]);

  const ForgotPassword = (e) => {
    e.preventDefault();
    resetPasswordAction(inputValues);
  };
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
      bg={`${themeColor}.200`}
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
      bg={`${themeColor}.200`}
      opacity="0.3"
      borderRadius="full"
      filter="blur(80px)"
    />
  
    {/* Forgot Password Container */}
    <Flex
      h="75%"
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
          w="80%"
          h="60%"
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
  
      {/* Right Side - Forgot Password Form */}
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
          Forgot Password?
        </Text>
        <Text textAlign="justify" mt={2} fontSize="sm" color="gray.700">
          Lost your password? No worries, we have got you covered. Reset it here.
        </Text>
  
        <form style={{ width: "100%" }} onSubmit={ForgotPassword}>
          <VStack mt={6} spacing={4}>
            {/* Organization Code */}
            <CustomInput
              type="text"
              name="orgCode"
              label="Organisation Code"
              inputValue={inputValues}
              setInputValue={setInputValues}
              isDisabled={forgotPasswordStatus === STATUS.SUCCESS}
            />
            {/* Mobile Number */}
            <CustomInput
              type="email"
              name="email"
              label="Registered Email ID"
              inputValue={inputValues}
              setInputValue={setInputValues}
              isDisabled={forgotPasswordStatus === STATUS.SUCCESS}
            />
            {showVerificationField && (
              <CustomInput
                type="number"
                name="otp"
                label="Enter Verification Code"
                inputValue={inputValues}
                setInputValue={setInputValues}
                isDisabled={resetPasswordStatus === STATUS.FETCHING}
              />
            )}
          </VStack>
  
          {/* Send Verification Code or Resend */}
          {!showVerificationField ? (
            <Button
              mt={8}
              w="100%"
              size="lg"
              colorScheme={themeColor}
              type="button"
              onClick={handleSendCode}
              _hover={{ transform: "scale(1.02)", boxShadow: "md" }}
              transition="all 0.2s"
            >
              Send Verification Code
            </Button>
          ) : (
            <>
              <Text mt={2} fontSize="sm" color="blue.500" textAlign="right">
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleResendCode}
                  isDisabled={isResendDisabled}
                >
                  Resend Verification Code
                </Button>
                {isResendDisabled && (
                  <Text as="span" fontSize="xs" color="gray.500">
                    {" "}
                    ({timer}s)
                  </Text>
                )}
              </Text>
              <Button
                mt={2}
                w="100%"
                size="lg"
                colorScheme={themeColor}
                type="submit"
                _hover={{ transform: "scale(1.02)", boxShadow: "md" }}
                transition="all 0.2s"
              >
                Submit
              </Button>
            </>
          )}
        </form>
      </Flex>
    </Flex>
  </Flex>
  );
}

export default ForgotPassword;
