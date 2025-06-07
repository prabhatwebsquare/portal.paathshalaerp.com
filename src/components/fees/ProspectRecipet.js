import { SchoolHeader } from "@/common/SchoolHeader";
import { NumberToWords } from "@/constant/NumToWords";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import {
  Box,
  Flex,
  Image,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { map, sumBy, toUpper } from "lodash";
import { useMemo } from "react";
import { MdCurrencyRupee } from "react-icons/md";

export const FeesReceipt = ({ printProps, copy }) => {
  const student = printProps.data?.student_master;
  const fees = printProps?.data;

  const totalFees =
    sumBy(fees.fees_collects, "amount") + sumBy(fees.fees_collects, "lateFees");
  const total =
    sumBy(fees.fees_collects, "amount") +
    sumBy(fees.fees_collects, "discount") +
    sumBy(fees.fees_collects, "lateFees");
  return (
    <Box
      m={4}
      p={2}
      border={"1px solid"}
      borderColor={"gray.200"}
      borderRadius={5}
      style={{ pageBreakInside: "avoid" }}
      pos={"relative"}
    >
      {fees?.chequeStatus === "Cancelled" || fees.status === "Cancelled" ? (
        <Flex
          w={"100%"}
          h={"100%"}
          pos={"absolute"}
          align={"center"}
          justify={"center"}
        >
          <Image
            src={"/assets/cancelled.png"}
            opacity={0.2}
            alt={"Cancelled"}
          />
        </Flex>
      ) : null}
      {/* <Flex h={"90px"} borderBottom={"1px solid"} borderColor={"gray.200"}>
                <Box w={"25%"} align={"flex-start"}>
                    <Image w="60%" h={"90%"} src="/assets/login2.png" alt="" />
                </Box>
                <Box w={"50%"} align={"center"}>
                    <Text fontSize={24} fontWeight={"semibold"}>{printProps.schoolData?.name}</Text>
                    <Text fontSize={13}>{printProps.schoolData?.address}</Text>
                </Box>
                <Flex w={"25%"} flexDir={"column"} justify={"space-between"}>
                    <Flex w="100%" justify={"flex-end"} fontSize={12} fontWeight={"semibold"}>
                        <Text w="fit-content">Reg No:</Text>
                        <Text w="fit-content">{printProps.schoolData?.regNo}</Text>
                    </Flex>
                    <Text mb={2} fontSize={12} textAlign={"right"}>{copy}</Text>
                </Flex>
            </Flex> */}
      <SchoolHeader
        extra={
          <Text mb={2} fontSize={12} textAlign={"right"}>
            {copy}
          </Text>
        }
      />
      {student && (
        <Flex py={2} borderBottom={"1px solid"} borderColor={"gray.200"}>
          <Box w="60%" fontSize={12}>
            <Flex align={"center"}>
              <Text w="30%">SR No. </Text>
              <Text ml={2} fontWeight={"semibold"}>
                : {student.srNo}
              </Text>
            </Flex>
            <Flex align={"center"}>
              <Text w="30%">Student Name </Text>
              <Text ml={2} fontWeight={"semibold"}>
                : {student.studentName}
              </Text>
            </Flex>
            <Flex align={"center"}>
              <Text w="30%">Father&apos;s Name </Text>
              <Text ml={2} fontWeight={"semibold"}>
                : {student.fatherName}
              </Text>
            </Flex>
            <Flex align={"center"}>
              <Text w="30%">Mother&apos;s Name </Text>
              <Text ml={2} fontWeight={"semibold"}>
                : {student.motherName}
              </Text>
            </Flex>
            <Flex align={"center"}>
              <Text w="30%">Class </Text>
              <Text ml={2} fontWeight={"semibold"}>
                : {printProps.data?.class_master?.name} -{" "}
                {printProps.data?.stream_master?.name}
              </Text>
            </Flex>
          </Box>
          {fees.chequeId ? (
            <Flex flexDir={"column"} w="40%" align="flex-end">
              <Text fontWeight={"semibold"}>
                {fees.transportReceiptNo || fees.receiptNo
                  ? fees.feesTypeMasterId === 2
                    ? "TRANSPORT FEES RECEIPT"
                    : "FEES RECEIPT"
                  : "CHEQUE RECEIPT"}
              </Text>
              <Text w="fit-content" fontSize={12}>
                {dayjs(fees.date).format("MMMM DD, YYYY")}
              </Text>
              {fees.feesMode === 2 ? (
                <Flex
                  w="fit-content"
                  fontWeight={"semibold"}
                  color={"green.400"}
                  fontSize={13}
                >
                  <Text>Transport Receipt No</Text>
                  <Text ml={1}>: {fees.transportReceiptNo}</Text>
                </Flex>
              ) : fees.receiptNo ? (
                <Flex
                  w="fit-content"
                  fontWeight={"semibold"}
                  color={"green.400"}
                  fontSize={13}
                >
                  <Text>Receipt No</Text>
                  <Text ml={1}>: {fees.receiptNo}</Text>
                </Flex>
              ) : null}
              <Flex
                w="fit-content"
                fontSize={12}
                mt={2}
                fontWeight={"semibold"}
              >
                <Text>By</Text>
                <Text ml={1}>: {fees.user.name}</Text>
              </Flex>
            </Flex>
          ) : (
            <Flex flexDir={"column"} w="40%" align="flex-end">
              <Text
                fontWeight={"semibold"}
                fontSize={fees.feesTypeMasterId === 2 ? 14 : 16}
              >
                {fees.feesTypeMasterId === 2
                  ? "TRANSPORT FEES RECEIPT"
                  : "FEES RECEIPT"}
              </Text>
              <Text w="fit-content" fontSize={12}>
                {dayjs(fees.date).format("MMMM DD, YYYY")}
              </Text>

              {fees.feesMode === 2 ? (
                <Flex
                  w="fit-content"
                  fontWeight={"semibold"}
                  color={"green.400"}
                  fontSize={13}
                >
                  <Text>Transport Receipt No</Text>
                  <Text ml={1}>: {fees.transportReceiptNo}</Text>
                </Flex>
              ) : (
                <Flex
                  w="fit-content"
                  fontWeight={"semibold"}
                  color={"green.400"}
                  fontSize={13}
                >
                  <Text>Receipt No</Text>
                  <Text ml={1}>: {fees.receiptNo}</Text>
                </Flex>
              )}
              <Flex
                w="fit-content"
                fontSize={12}
                mt={2}
                fontWeight={"semibold"}
              >
                <Text>By</Text>
                <Text ml={1}>: {fees.user.name}</Text>
              </Flex>
            </Flex>
          )}
        </Flex>
      )}
      <Box py={2} borderBottom={"1px solid"} borderColor={"gray.200"}>
        <Table size={"sm"}>
          <Thead>
            <Tr>
              <Th w="8%">Sr No.</Th>
              <Th>Particular</Th>
              <Th w={"20%"}>
                <Flex align={"center"}>
                  {"Fees Deposit ( "} <MdCurrencyRupee />
                  {" )"}
                </Flex>
              </Th>
              <Th w={"17%"}>
                <Flex align={"center"}>
                  {"Discount ( "} <MdCurrencyRupee />
                  {" )"}
                </Flex>
              </Th>
              <Th w={"17%"}>
                <Flex align={"center"}>
                  {"LateFees ( "} <MdCurrencyRupee />
                  {" )"}
                </Flex>
              </Th>
            </Tr>
          </Thead>
          <Tbody fontSize={12}>
            {map(fees.fees_collects, (fee, i) => (
              <Tr key={fee.id}>
                <Td>{i + 1}</Td>
                <Td>
                  {fee?.transport_fee_master?.name ||
                    fee?.fees_name_master?.name}
                </Td>
                <Td>
                  <Flex align={"center"} justify={"flex-end"}>
                    <MdCurrencyRupee />
                    {fee.amount}
                  </Flex>
                </Td>
                <Td>
                  <Flex align={"center"} justify={"flex-end"}>
                    <MdCurrencyRupee />
                    {fee.discount || 0}
                  </Flex>
                </Td>
                <Td>
                  <Flex align={"center"} justify={"flex-end"}>
                    <MdCurrencyRupee />
                    {fee.lateFees || 0}
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Flex>
        <Box w="70%">
          <Flex fontSize={12}>
            <Text>IN WORDS :</Text>
            <Text fontWeight={"bold"} ml={1}>
              {NumberToWords(total)}&nbsp;Only
            </Text>
          </Flex>
          <Flex fontSize={12}>
            <Text>Remark :</Text>
            <Text fontWeight={"bold"} ml={1}>
              {fees.remark}
            </Text>
          </Flex>
        </Box>
        <Box w="30%">
          <Flex fontSize={12}>
            <Text>Total :</Text>
            <Flex fontWeight={"bold"} align={"center"}>
              <MdCurrencyRupee />
              {total}
            </Flex>
          </Flex>
          <Flex fontSize={12}>
            <Text>Total Fees Deposit :</Text>
            <Flex fontWeight={"bold"} align={"center"}>
              <MdCurrencyRupee />
              {totalFees}
            </Flex>
          </Flex>
          <Flex fontSize={12}>
            <Text>Payment Mode :</Text>
            <Text fontWeight={"bold"} ml={1}>
              {toUpper(fees.type)}
            </Text>
          </Flex>
          {fees.chequeNo && (
            <Flex fontSize={12}>
              <Text>Cheque Bank :</Text>
              <Text fontWeight={"bold"} ml={1}>
                {toUpper(fees.bank)}
              </Text>
            </Flex>
          )}
          {fees.chequeNo && (
            <Flex fontSize={12}>
              <Text>Cheque No :</Text>
              <Text fontWeight={"bold"} ml={1}>
                {toUpper(fees.chequeNo)}
              </Text>
            </Flex>
          )}
          {fees?.ledger_master && (
            <Flex fontSize={12}>
              <Text>Bank Name :</Text>
              <Text fontWeight={"bold"} ml={1}>
                {fees?.ledger_master?.name}
              </Text>
            </Flex>
          )}
          {fees.transitionNo && (
            <Flex fontSize={12}>
              <Text>Transaction No. :</Text>
              <Text fontWeight={"bold"} ml={1}>
                {fees.transitionNo}
              </Text>
            </Flex>
          )}
        </Box>
      </Flex>
      <Flex justify={"space-between"}>
        <Text mt={12} fontSize={11} w="fit-content">
          Printed At {dayjs().format("DD-MM-YYYY hh:mm:ss A")}
        </Text>
        <Text
          mt={12}
          fontSize={11}
          w="fit-content"
          borderTop={"1px solid"}
          borderColor={"gray.200"}
        >
          Authorised Signature
        </Text>
      </Flex>
    </Box>
  );
};
