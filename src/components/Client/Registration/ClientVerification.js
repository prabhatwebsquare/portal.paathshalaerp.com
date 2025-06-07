import { Box, Button, Flex, Icon, Text, VStack, Stack } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/router";

export const ClientVerification = ({
  handleBackStep,
  handleNextStep,
  sessionMasterId,
  themeColor,
}) => {
  const router = useRouter();

  const submitDetails = () => {
    router.push("/client/list");
  };

  return (
    <Box
      maxW={"700px"}
      mx={"auto"}
      mt={100}
      p={6}
      borderRadius={"lg"}
      boxShadow={"lg"}
      bgGradient={`linear(to-r, ${themeColor}.100, white)`}
    >
      <VStack spacing={6} mb={15}>
        <Icon as={FaCheckCircle} boxSize={14} color={`${themeColor}.500`} />
        <Text fontWeight={"bold"} fontSize={"2xl"} textAlign={"center"}>
          Profile Verification in Progress
        </Text>
        <Text fontSize={"lg"} color={"gray.600"} textAlign={"center"}>
          Your profile is currently under review. You will be notified once the
          process is completed.
        </Text>
      </VStack>
      <Stack spacing={4} mt={6}>
        <Flex justify={"space-between"}>
          <Button
            variant={"outline"}
            colorScheme={themeColor}
            size={"sm"}
            onClick={handleBackStep}
          >
            Back
          </Button>
          <Button
            size={"sm"}
            colorScheme={themeColor}
            onClick={() => {
              submitDetails();
            }}
            boxShadow={"md"}
            _hover={{
              bg: `${themeColor}.600`,
            }}
          >
            Finish
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
};
