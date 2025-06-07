import { SchoolHeader } from "@/common/SchoolHeader";
import { TransporterHeader } from "@/common/TransporterHeader";
import { NumberToWords } from "@/constant/NumToWords";
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
import { MdCurrencyRupee } from "react-icons/md";

export const FeesReceipt = ({
  feeReceiptSchoolData,
  isTransport,
  printProps,
  copy,
}) => {
  const { data } = printProps || {};
  const {
    student_master: student,
    fees_collects = [],
    class_master,
    stream_master,
    chequeId,
    chequeStatus,
    status,
    feesTypeMasterId,
    transportReceiptNo,
    receiptNo,
    feesMode,
    date,
    user,
    type,
    bank,
    chequeNo,
    ledger_master,
    transitionNo,
    remark,
  } = data || {};

  const totalFees =
    sumBy(fees_collects, "amount") + sumBy(fees_collects, "lateFees");
  const total = sumBy(fees_collects, (f) => f.amount + f.discount + f.lateFees);
  const hasLateFees = fees_collects?.some((fee) => fee.lateFees > 0);

  const renderReceiptHeader = () => (
    <Flex flexDir="column" w="40%" align="flex-end" pr={2}>
      <Text fontWeight="medium" fontSize="9px" mb={1}>
        {feesTypeMasterId === 2 ? "TRANSPORT FEES RECEIPT" : "FEES RECEIPT"}
      </Text>
      {feesMode === 2 ? (
        <InfoRow
          label="Transport Receipt No"
          value={transportReceiptNo}
          color="green.600"
          bg="green.50"
        />
      ) : (
        <InfoRow
          label="Receipt No"
          value={receiptNo}
          color="green.600"
          bg="green.50"
        />
      )}
      <Text w="fit-content" fontSize="8px" my={1}>
        {dayjs(date).format("MMMM DD, YYYY")}
      </Text>
      {(feesMode !== 2 || chequeId) && (
        <InfoRow label="User" value={user?.name} />
      )}
    </Flex>
  );

  const InfoRow = ({ label, value, color = "inherit", bg = "transparent" }) => (
    <Flex
      w="fit-content"
      fontWeight="semibold"
      color={color}
      fontSize="10px" // Smaller font size
      bg={bg}
    >
      <Text>{label}</Text>
      <Text ml={1}>: {value}</Text>
    </Flex>
  );

  return (
    <Box
      m={1}
      p={2}
      border="1px solid"
      borderColor="black"
      borderRadius={3}
      style={{ pageBreakInside: "avoid" }}
      pos="relative"
      fontSize="10px"
      // textTransform="uppercase"
      fontWeight="semibold"
    >
      {(chequeStatus === "Cancelled" || status === "Cancelled") && (
        <Flex w="100%" h="100%" pos="absolute" align="center" justify="center">
          <Image src="/assets/cancelled.png" opacity={0.1} alt="Cancelled" />
        </Flex>
      )}

      {/* Header */}
      {feesTypeMasterId === 2 ? (
        <TransporterHeader
          schoolData={printProps.schoolData}
          extra={
            <Text mb={1} fontSize="10px" textAlign="right">
              {copy}
            </Text>
          }
        />
      ) : (
        <SchoolHeader
          schoolData={printProps.schoolData}
          extra={
            <Text mb={1} fontSize="10px" textAlign="right">
              {copy}
            </Text>
          }
        />
      )}
      <Box borderBottom="2px solid gray" my={2} />
      {/* Student Info */}
      {student && (
        <Flex py={1}>
          <Box w="60%" fontSize="10px">
            {[
              ["SR No.", student.srNo],
              ["Student Name", student.studentName],
              ["Father's Name", student.fatherName],
              ["Mother's Name", student.motherName],
              ["Class", `${class_master?.name} - ${stream_master?.name}`],
            ].map(([label, value], idx) => (
              <Flex key={idx} align="start" py={0.5}>
                <Text w="40%" fontWeight="medium">
                  {label}
                </Text>
                <Text fontWeight="normal">: {value}</Text>
              </Flex>
            ))}
          </Box>

          {renderReceiptHeader()}
        </Flex>
      )}

      {/* Table */}
      <Box py={1} >
        <Table
          size="sm"
          sx={{
            "th, td": { fontSize: "10px !important", fontWeight: "medium" },
          }}
        >
          <Thead sx={{ th: { lineHeight: "0.2" } }}>
            <Tr>
              <Th padding="1px" w="8%">
                S No.
              </Th>
              <Th padding="1px">Particular</Th>
              <Th padding="1px" w="18%">
                Total Fee
              </Th>
              <Th padding="1px" w="18%">
                Fees Deposit
              </Th>
              {hasLateFees && 
              
                <Th padding="1px" w="30%">
                Late Fees Deposit
              </Th>
              }
            
            </Tr>
          </Thead>
          <Tbody>
            {Array.from({ length: 7 }).map((_, i) => {
              const fee = fees_collects[i];
              return (
                <Tr key={i}>
                  <Td padding="1px" fontSize="5px" lineHeight="0.1">
                    {i + 1}
                  </Td>
                  <Td padding="1px" fontSize="4px" lineHeight="0.1">
                    {fee
                      ? fee?.transport_fee_master?.name ||
                        fee?.fees_name_master?.name
                      : ""}
                  </Td>
                  <Td
                    padding="1px"
                    textAlign="right"
                    fontSize="5px"
                    lineHeight="0.1"
                  >
                    {fee ? `₹ ${fee.lastFeesReport?.totalFees?.toFixed(2)}` : ""}  
                  </Td>
                  <Td
                    padding="1px"
                    textAlign="right"
                    fontSize="5px"
                    lineHeight="0.1"
                  >
                    {fee ? `₹ ${fee.amount?.toFixed(2)}` : ""}  

                  </Td>
                  {hasLateFees && 
                  
                     <Td
                    padding="1px"
                    textAlign="right"
                    fontSize="5px"
                    lineHeight="0.1"
                  >
                    {fee ? `₹ ${fee.lateFees?.toFixed(2)}` : ""}  

                  </Td>
                  
                  }
               
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>

      {/* Footer */}
      <Flex fontSize="10px" mt={1}>
        <Box w="40%">
          <Flex>
            <Text>IN WORDS:</Text>
            <Text ml={1} fontWeight="bold">
              {NumberToWords(total)} Only
            </Text>
          </Flex>
          <Flex>
            <Text>Remark:</Text>
            <Text ml={1} fontWeight="bold">
              {remark}
            </Text>
          </Flex>
        </Box>

     

        <Box w="30%">
          <Flex>
            <Text>Payment Mode:</Text>
            <Text fontWeight="bold" ml={1}>
              {toUpper(type)}
            </Text>
          </Flex>
          {chequeNo && (
            <>
              <Flex>
                <Text>Cheque Bank:</Text>
                <Text fontWeight="bold" ml={1}>
                  {toUpper(bank)}
                </Text>
              </Flex>
              <Flex>
                <Text>Cheque No:</Text>
                <Text fontWeight="bold" ml={1}>
                  {toUpper(chequeNo)}
                </Text>
              </Flex>
            </>
          )}
          {ledger_master?.type !== "CASH" && ledger_master?.name && (
            <Flex>
              <Text>Bank Name:</Text>
              <Text fontWeight="bold" ml={1}>
                {ledger_master.name}
              </Text>
            </Flex>
          )}
          {transitionNo && (
            <Flex>
              <Text>Transaction No.:</Text>
              <Text fontWeight="bold" ml={1}>
                {transitionNo}
              </Text>
            </Flex>
          )}
        </Box>
        <Box w="30%">
          {[
            ["Total Deposit", totalFees],
            ["Total Due till Date", printProps?.feesInfo?.totalDue],
          ].map(([label, value], idx) => (
            <Flex key={idx}>
              <Text>{label}:</Text>
              <Text fontWeight="bold" ml={1}>
                {value}
              </Text>
            </Flex>
          ))}
        </Box>
      </Flex>

      <Flex justify="space-between" mt={4}>
        <Text fontSize="9px">
          Printed At {dayjs().format("DD-MM-YYYY hh:mm:ss A")}
        </Text>
        <Text fontSize="9px" borderTop="1px solid" borderColor="gray.300">
          Authorised Signature
        </Text>
      </Flex>
      <style jsx global>{`
  @media print {
    th {
      background-color: rgb(0, 46, 105) !important;
      color: white !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      font-weight: bold !important;
    }
  }
`}</style>

    </Box>
  );
};
