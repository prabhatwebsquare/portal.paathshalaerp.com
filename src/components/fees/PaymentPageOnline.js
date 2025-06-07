import axios from 'axios';
import { useRef, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Text,
  Flex,
  Image,
  VStack,
  Heading,
  Badge,
  Input,
  Checkbox,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { compact } from "lodash";
import { MdSchool, MdPerson } from "react-icons/md";
import { URL } from "@/services/apis";
import AtomPaynetz from "../AtomPaynetz";
import StudentInfoCard from './StudentInfoCard';
const schema = Yup.object().shape({
  orgCode: Yup.string().required("Organisation Code is required"),
  admissionNo: Yup.string().required("Admission Number is required"),
  // dob: Yup.date()
  //   .required("Date of Birth is required")
  //   .typeError("Invalid Date"),
});

export const PaymentPageOnline = ({ SchoolInfo, orgCode, themeColor }) => {
  const SCHOOLDATA = SchoolInfo?.schoolData;
  const session = SchoolInfo?.sessionData;
  const atomPayRef = useRef();
  const [apiError, setApiError] = useState(null);
  const [feeDetails, setFeeDetails] = useState([]);
  const [selectedFees, setSelectedFees] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      orgCode: orgCode || "",
    },
  });

  useEffect(() => {
    setValue("orgCode", orgCode || "");
  }, [orgCode, setValue]);

  const toggleFeeSelection = (feeId) => {
    setSelectedFees((prev) =>
      prev.includes(feeId)
        ? prev.filter((id) => id !== feeId)
        : [...prev, feeId]
    );
  };

  const totalAmount = selectedFees.reduce((sum, feeId) => {
    const fee = feeDetails.find((f) => f.id === feeId);
    return fee ? sum + Number(fee.amount) : sum;
  }, 0);

  const onSubmit = async (data) => {
    setApiError(null);
    setFeeDetails([]);
    setSelectedFees([]);
    setStudentInfo(null);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/institute/payment/goToPayment",
        {
          orgCode: data.orgCode,
          admissionNo: data.admissionNo,
          dob: data.dob,
        }
      );

      const resData = response.data;
      if (resData.success) {
        const fees = resData.data?.feeDetails || [];
        setFeeDetails(fees);
        setSelectedFees([]); // ✅ Do not select any fee by default
        setStudentInfo(resData.data?.studentDetails || null);
      } else {
        setApiError(resData.message || "No matching details found.");
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again."
      );
    }
  };
  const handlePay = () => {
    atomPayRef.current?.openPay({
      custEmail: "student@email.com",
      custMobile: "9876543210",
      amount: selectedFees,
    });
  }

  return (
    <Box minH="100vh" bg={`${themeColor}.50`}>
      {/* Header Section */}
      <Box bg="white" p={4} boxShadow="md" position="relative" overflow="hidden" mb={4}>
        <Box position="absolute" top={0} left={0} w="100%" h="4px" bgGradient={`linear(to-r, ${themeColor}.400, ${themeColor}.600)`} />
        <Box maxW="1200px" mx="auto">
          <Flex direction={{ base: "column", md: "row" }} align="center" gap={4}>
            <Image
              src={URL + (SCHOOLDATA?.logo || "https://via.placeholder.com/150")}
              alt="School Logo"
              h="120px"
              w="120px"
              borderRadius="lg"
              boxShadow="sm"
              p={1}
              bg="white"
              objectFit="contain"
            />
            <VStack flex={1} align="center" spacing={2}>
              <Heading
                size="lg"
                bgGradient={`linear(to-r, ${themeColor}.600, ${themeColor}.400)`}
                bgClip="text"
                textAlign="center"
              >
                {SCHOOLDATA?.name}
              </Heading>
              <Text fontSize="sm" color="gray.600" fontStyle="italic" textAlign="center">
                {compact([SCHOOLDATA?.address, SCHOOLDATA?.district, SCHOOLDATA?.state]).join(", ")}
              </Text>
              <Flex gap={2} wrap="wrap" justify="center">
                {[
                  { label: "School Code", value: SCHOOLDATA?.schoolCode },
                  { label: "Reg No", value: SCHOOLDATA?.regNo },
                  { label: "Affiliation", value: SCHOOLDATA?.affiliationNo },
                  { label: "Contact", value: SCHOOLDATA?.mobileNo, icon: MdPerson },
                ].map(({ label, value, icon = MdSchool }) => (
                  <Badge
                    key={label}
                    colorScheme={themeColor}
                    px={2}
                    py={0.5}
                    borderRadius="full"
                    fontSize="xs"
                  >
                    <Flex align="center" gap={1}>
                      {icon && icon({ size: 14 })}
                      <Text>{label}: {value}</Text>
                    </Flex>
                  </Badge>
                ))}
              </Flex>
              <Box p={2} bg={`${themeColor}.50`} borderRadius="md" textAlign="center" border="1px dashed" borderColor={`${themeColor}.200`}>
                <Heading size="sm" color={`${themeColor}.700`} textTransform="uppercase" letterSpacing="wider">
                  Online Payment of Student Fees {session?.name}
                </Heading>
              </Box>
            </VStack>
          </Flex>
        </Box>
      </Box>

      {/* Main Form Section */}
      <Box maxW="1000px" mx="auto" px={4} py={6}>
        <Box bg="white" p={6} borderRadius="xl" boxShadow="lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text mb={2} fontWeight="medium">Organisation Code</Text>
                <Input placeholder="Enter Organisation Code" size="md" {...register("orgCode")} isDisabled />
                {errors.orgCode && <Text color="red.500" fontSize="sm">{errors.orgCode.message}</Text>}
              </Box>
              <Box>
                <Text mb={2} fontWeight="medium">Admission No</Text>
                <Input placeholder="Enter Admission Number" size="md" {...register("admissionNo")} />
                {errors.admissionNo && <Text color="red.500" fontSize="sm">{errors.admissionNo.message}</Text>}
              </Box>
              {/* <Box>
                <Text mb={2} fontWeight="medium">Date of Birth</Text>
                <Input type="date" size="md" {...register("dob")} />
                {errors.dob && <Text color="red.500" fontSize="sm">{errors.dob.message}</Text>}
              </Box> */}
              {apiError && (
                <Text color="red.600" fontSize="md" fontWeight="semibold">{apiError}</Text>
              )}
              <Button colorScheme={themeColor} type="submit">Fetch Fee Details</Button>
            </VStack>
          </form>

          {/* Student Info Section */}
          {studentInfo && (
            <Box mt={6}>
              <StudentInfoCard student={studentInfo} />
            </Box>
          )}


          {/* Fee Details Table */}
          {feeDetails.length > 0 && (
            <Box mt={6} overflowX="auto">
              <Text fontSize="lg" mb={2} fontWeight="bold" color={`${themeColor}.700`}>
                Select Fees to Pay
              </Text>
              <Box borderWidth="1px" borderRadius="md" borderColor={`${themeColor}.300`}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ backgroundColor: `${themeColor}.100` }}>
                    <tr>
                      <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>Select</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Fee Name</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>Amount</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>Paid</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeDetails.map((fee) => (
                      <tr key={fee.id} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: "8px", textAlign: "center" }}>
                          <Checkbox
                            isChecked={selectedFees.includes(fee.id)}
                            onChange={() => toggleFeeSelection(fee.id)}
                            colorScheme={themeColor}
                          />
                        </td>
                        <td style={{ padding: "8px", textAlign: "left" }}>{fee.feesName}</td>
                        <td style={{ padding: "8px", textAlign: "right" }}>{fee.amount}</td>
                        <td style={{ padding: "8px", textAlign: "right" }}>{fee.collectedAmount}</td>
                        <td style={{ padding: "8px", textAlign: "right" }}>{fee.due}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>

              <Flex justify="flex-end" mt={4} align="center" gap={4}>
                <Text fontWeight="bold" fontSize="lg">Total: ₹{totalAmount.toFixed(2)}</Text>
              </Flex>

              {selectedFees.length > 0 && (
                <Flex justify="flex-end" mt={4}>
                  <Button
                    colorScheme={themeColor}
                    onClick={() => handlePay(selectedFees)}
                  >
                    Pay Now
                  </Button>
                </Flex>
              )}
            </Box>
          )}
        </Box>
      </Box>
      <AtomPaynetz ref={atomPayRef} />
    </Box>
  );
};
