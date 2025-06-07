import CustomInput from "@/common/CustomInput";
import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { useAdminBankStore } from "@/store/Banks";
import { useClientStore } from "@/store/client";
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Select,
  Text,
  VStack,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { map } from "lodash";
import { useEffect, useState } from "react";

export const PaymentVerification = ({ data, themeColor }) => {
  const paymentLink = `https://developer.paathshalaerp.com/payment/${data.orderId}`;
  const { onCopy } = useClipboard(paymentLink);
  const toast = useToast();

  const handleCopy = () => {
    onCopy();
    toast({
      title: "Link Copied!",
      description: "The payment link has been copied to your clipboard.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const [inputValue, setInputValue] = useState({
    date: data.paymentDate ? dayjs(data.paymentDate).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
    feesType: "school-fees",
    type: data.paymentMode || "Cash",
    amount: data.totalAmount -  data.advanceAmount || 0,
    bank: data.transactionBank || "",
    remark: data.remark || "",
    ledgerMasterId: "",
    pyamentType: data.pyamentType || "PaymentGetway",
    paymentGatewayLink: data.paymentGatewayLink || paymentLink,
    transactionNo: data.transactionNo || "",
  });

  const inputHandler = (name, val) => {
    setInputValue((prev) => ({ ...prev, [name]: val }));
  };

  const { makePaymentAction } = useClientStore((s) => ({
    makePaymentAction: s.makePaymentAction,
  }));

  const submitDetails = async (e) => {
    e.preventDefault();
    const info = {
      orderId: data.orderId,
      status: 2, // Assuming 2 means "processed" or "verified"
      ...inputValue,
    };

    try {
      await makePaymentAction(info);
      toast({
        title: "Payment Verified",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify payment",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const { getAdminBankAction, getAdminBanksStatus, allAdminBanks } =
    useAdminBankStore((s) => ({
      getAdminBankAction: s.getAdminBankAction,
      getAdminBanksStatus: s.getAdminBanksStatus,
      allAdminBanks: s.allAdminBanks,
    }));

  useEffect(() => {
    if (getAdminBanksStatus === STATUS.NOT_STARTED) {
      getAdminBankAction();
    }
  }, [getAdminBankAction, getAdminBanksStatus]);

  return (
    <form onSubmit={submitDetails}>
      <Box p={6} borderRadius="md" boxShadow="md" mt={5} minH={600}>
        <VStack spacing={6}>
          <Box
            bg={`${themeColor}.50`}
            p={6}
            borderRadius="md"
            boxShadow="md"
            w="100%"
          >
            <VStack spacing={6}>
              <Text
                fontWeight="bold"
                fontSize="xl"
                color={`${themeColor}.700`}
                textAlign="center"
              >
                Select Payment Method
              </Text>
              <RadioGroup
                value={inputValue.pyamentType}
                onChange={(e) => inputHandler("pyamentType", e)}
                colorScheme={themeColor}
              >
                <HStack align="center" spacing={8} w="100%" justify="center">
                  <Box
                    as="label"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    p={4}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor={`${themeColor}.300`}
                    bg={
                      inputValue.pyamentType === "PaymentGetway"
                        ? `${themeColor}.100`
                        : "white"
                    }
                    boxShadow={
                      inputValue.pyamentType === "PaymentGetway" ? "md" : "sm"
                    }
                    cursor="pointer"
                    transition="all 0.2s ease-in-out"
                    _hover={{
                      boxShadow: "lg",
                      borderColor: `${themeColor}.400`,
                    }}
                  >
                    <Radio value="PaymentGetway" display="none" />
                    <Text fontWeight="medium" color={`${themeColor}.600`}>
                      Payment Gateway
                    </Text>
                  </Box>
                  <Box
                    as="label"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    p={4}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor={`${themeColor}.300`}
                    bg={
                      inputValue.pyamentType === "manualPayment"
                        ? `${themeColor}.100`
                        : "white"
                    }
                    boxShadow={
                      inputValue.pyamentType === "manualPayment" ? "md" : "sm"
                    }
                    cursor="pointer"
                    transition="all 0.2s ease-in-out"
                    _hover={{
                      boxShadow: "lg",
                      borderColor: `${themeColor}.400`,
                    }}
                  >
                    <Radio value="manualPayment" display="none" />
                    <Text fontWeight="medium" color={`${themeColor}.600`}>
                      Manual Payment
                    </Text>
                  </Box>
                </HStack>
              </RadioGroup>
            </VStack>
          </Box>

          {inputValue.pyamentType === "PaymentGetway" && (
            <Flex
              mt={10}
              w="100%"
              align="center"
              justify="space-between"
              bg="white"
              p={3}
              borderRadius="md"
              boxShadow="sm"
            >
              <Input
                value={inputValue.paymentGatewayLink}
                isReadOnly
                bg="gray.50"
                borderColor={`${themeColor}.300`}
                focusBorderColor={`${themeColor}.500`}
                borderRadius="md"
                flex={1}
                mr={2}
              />
              <Button size="sm" colorScheme={themeColor} onClick={handleCopy}>
                Copy Link
              </Button>
            </Flex>
          )}

          {inputValue.pyamentType === "manualPayment" && (
            <Flex
              w="100%"
              gap={3}
              flexWrap="wrap"
              mt={5}
              align="center"
              justify="space-between"
              bg="white"
              borderRadius="md"
              boxShadow="sm"
            >
              <Select
                w={
                  inputValue.type && inputValue.type !== "Cash"
                    ? { lg: "47%", xl: "48.5%" }
                    : "100%"
                }
                size="md"
                isRequired
                fontSize={13}
                fontWeight="bold"
                color="blue.800"
                focusBorderColor={`${themeColor}.400`}
                placeholder="Select Payment Mode"
                value={inputValue.type}
                onChange={(e) => inputHandler("type", e.target.value)}
              >
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="NetBanking">Net Banking</option>
                <option value="Upi">UPI</option>
                <option value="CreditCard">Credit Card</option>
                <option value="DebitCard">Debit Card</option>
                <option value="PaymentGateway">Payment Gateway</option>
                <option value="Other">Other</option>
              </Select>

              {inputValue.type === "Cheque" && (
                <>
                  <Select
                    w={{ lg: "47%", xl: "48.5%" }}
                    size="md"
                    isRequired
                    fontSize={13}
                    fontWeight="bold"
                    color="blue.800"
                    focusBorderColor={`${themeColor}.400`}
                    placeholder="Select Bank Name"
                    value={inputValue.bank}
                    onChange={(e) => inputHandler("bank", e.target.value)}
                  >
                    {map(allAdminBanks, (bank) => (
                      <option key={bank.id} value={bank.name}>
                        {bank.name}
                      </option>
                    ))}
                  </Select>
                  <CustomInput
                    w={{ lg: "47%", xl: "48.5%" }}
                    type="text"
                    name="transactionNo"
                    label="Cheque No."
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                  <CustomInput
                    w={{ lg: "47%", xl: "48.5%" }}
                    type="date"
                    name="date"
                    label="Cheque Date"
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                </>
              )}

              {inputValue.type !== "Cash" && inputValue.type !== "Cheque" && (
                <>
                  <CustomInput
                    w={{ lg: "47%", xl: "48.5%" }}
                    type="text"
                    name="transactionNo"
                    label="Transaction No."
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                  <CustomInput
                    w={{ lg: "47%", xl: "48.5%" }}
                    type="date"
                    name="date"
                    label="Transaction Date"
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                  <Select
                    w={{ lg: "47%", xl: "48.5%" }}
                    size="md"
                    fontSize={13}
                    fontWeight="bold"
                    color="blue.800"
                    focusBorderColor={`${themeColor}.400`}
                    placeholder="Select Bank"
                    value={inputValue.bank}
                    onChange={(e) => inputHandler("bank", e.target.value)}
                  >
                    {map(allAdminBanks, (bank) => (
                      <option key={bank.id} value={bank.name}>
                        {bank.name}
                      </option>
                    ))}
                  </Select>
                </>
              )}
            </Flex>
          )}

          <Flex
            w="100%"
            flexWrap="wrap"
            align="center"
            justify="space-between"
          >
            <CustomInput
              w="48%"
              type="number"
              name="amount"
              label="Amount"
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
            <CustomTextarea
              w="50%"
              rows={2}
              type="text"
              notRequire={true}
              name="remark"
              label="Remark"
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
          </Flex>

          <Flex
            p={4}
            position="fixed"
            bottom={0}
            right={10}
            width="40%"
            bg="white"
            borderTop="3px solid"
            borderColor={`${themeColor}.500`}
            boxShadow="sm"
            justify="center"
            alignItems="center"
          >
            <Button
              type="submit"
              size="md"
              colorScheme={themeColor}
              width="70%"
              py={5}
              borderRadius="md"
              boxShadow="md"
              _hover={{
                boxShadow: "lg",
                borderColor: `${themeColor}.400`,
              }}
            >
              Verify Payment
            </Button>
          </Flex>
        </VStack>
      </Box>
    </form>
  );
};