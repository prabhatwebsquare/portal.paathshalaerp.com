import CustomInput from "@/common/CustomInput";
import { Button, Flex, VStack, Box, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect } from "react";

export const BasicDetails = ({
  handleNextStep,
  inputValue,
  setInputValue,
  themeColor,
}) => {
  const submitDetails = (e) => {
    e.preventDefault();
    handleNextStep();
  };

  // const calculateExpireDate = () => {
  //   const today = new Date();
  //   const postDate = new Date(today);
  //   postDate.setDate(today.getDate() + 365);
  //   return postDate.toISOString().split("T")[0];
  // };

  // useEffect(() => {
  //   setInputValue((prev) => ({
  //     ...prev,
  //     expireDate: prev?.expireDate || calculateExpireDate(),
  //   }));
  // }, [setInputValue]);

  const remainingAmount = inputValue.totalAmount - inputValue.advanceAmount;

  const cardBg = useColorModeValue("white", "gray.700");
  const cardBorder = useColorModeValue("gray.200", "gray.600");
  const amountColor = useColorModeValue(`${themeColor}.600`, `${themeColor}.300`);

  
  return (
    <form onSubmit={submitDetails}>
      <VStack spacing={3} w="100%" p={5}>
        <Flex w={"100%"} flexWrap={"wrap"} align={"center"} gap={3}>
          <CustomInput
            w={"32%"}
            type={"number"}
            name="studentLimit"
            label={"App Student Limit"}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          <CustomInput
            w={"32%"}
            type={"number"}
            name="perStudentPlan"
            label={"Per Student Plan"}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          <CustomInput
            w={"32%"}
            type={"number"}
            name="totalAmount"
            label={"Total Amount"}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          <CustomInput
            w={"32%"}
            type={"number"}
            name="advanceAmount"
            label={"Advance Amount"}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          <CustomInput
            w={"32%"}
            type={"number"}
            name="photoGallaryLimit"
            label={"Photo Gallery Limit"}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />

          {/* Remaining Amount Card */}
          {remainingAmount > 0 && 
                <Box
            w={"100%"}
            mt={4}
            p={4}
            bg={cardBg}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={cardBorder}
            boxShadow="sm"
            textAlign="center"
          >
            <Text fontSize="lg" fontWeight="bold" color={amountColor}>
              Remaining Amount:{" "}
              <Text as="span" fontSize="xl" fontWeight="extrabold">
                ₹{remainingAmount.toLocaleString()}
              </Text>
            </Text>
          </Box>
          
          }
    
        </Flex>
      </VStack>

      <Flex p={4} justify={"flex-end"}>
        <Button
          ml={4}
          size={"sm"}
          colorScheme={`${themeColor}`}
          type={"submit"}
        >
          Next
        </Button>
      </Flex>
    </form>
  );
};