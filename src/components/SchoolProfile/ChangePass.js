import CustomInput from "@/common/CustomInput";
import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { useLoginStore } from "@/store/Login";
import { Box, Button, Flex, VStack, Text, Icon, InputRightElement, InputGroup } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaKey, FaExclamationCircle } from "react-icons/fa";

export const ChangePassword = ({ themeColor }) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { changePassAction, changePassStatus, resetPassStatus } = useLoginStore((s) => ({
    changePassAction: s.changePassAction,
    changePassStatus: s.changePassStatus,
    resetPassStatus: s.resetPassStatus,
  }));

  const passwordsMatch = inputValue.newPassword === inputValue.confirmPassword;

  const submitData = (e) => {
    e.preventDefault();
    if (passwordsMatch) {
      changePassAction(inputValue);
    }
  };

  useEffect(() => {
    if (changePassStatus === STATUS.SUCCESS) {
      resetPassStatus();
      setInputValue({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      router.push("/");
    }
  }, [changePassStatus, resetPassStatus, router]);

  return (
    <Box h="82vh">
      <PageHeader heading="Change Password" />
      <Flex justify="center" align="center" h="90%" p={5} position="relative" overflow="hidden">
        <Box position="absolute" top="-50px" left="-50px" w="200px" h="200px" bg={`${themeColor}.100`} opacity="0.3" borderRadius="full" filter="blur(80px)" />
        <Box position="absolute" bottom="-50px" right="-50px" w="200px" h="200px" bg={`${themeColor}.200`} opacity="0.3" borderRadius="full" filter="blur(80px)" />

        <Box w="100%" maxW="500px" bg="white" p={8} borderRadius="lg" boxShadow="xl" position="relative" zIndex="1">
          <form onSubmit={submitData}>
            <VStack spacing={6} align="center">
              <Icon as={FaKey} w={12} h={12} color={`${themeColor}.500`} />
              <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                Change Your Password
              </Text>

              <CustomInput
                w="100%"
                type="password"
                name="oldPassword"
                label="Old Password"
                inputValue={inputValue}
                setInputValue={setInputValue}
              />

              <CustomInput
                w="100%"
                type="password"
                name="newPassword"
                label="New Password"
                inputValue={inputValue}
                setInputValue={setInputValue}
              />

              <InputGroup w="100%">
                <CustomInput
                  w="100%"
                  type="password"
                  name="confirmPassword"
                  label="Confirm New Password"
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                {!passwordsMatch && inputValue.confirmPassword && (
                  <InputRightElement>
                    <Icon as={FaExclamationCircle} color="red.500" />
                  </InputRightElement>
                )}
              </InputGroup>

              <Button
                w="100%"
                size="lg"
                colorScheme={themeColor}
                type="submit"
                isLoading={changePassStatus === STATUS.FETCHING}
                isDisabled={!passwordsMatch}
                _hover={{ transform: "scale(1.02)", bg: `${themeColor}.600` }}
                transition="all 0.2s"
              >
                Update Password
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </Box>
  );
};