import { SchoolHeaderSmall } from "@/common/SchoolHeaderSmall";
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
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { sumBy, toUpper } from "lodash";

export const FeesReceiptSecond = ({
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
    section_master,
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

  const fontSize = "7px";
  const bottomFontSize = "6px";
  const labelFontSize = "9px";
  const headingFontSize = "10px";
  const fontFamily = `'Poppins', sans-serif`;

  const InfoRow = ({ label, value, color = "inherit", bg = "transparent" }) => (
    <Flex w="fit-content" color={color} bg={bg} fontSize={fontSize} my={1} fontWeight={"semibold"}>
      <Text >{label}</Text>
      <Text ml={1}>: {value}</Text>
    </Flex>
  );

  const renderReceiptHeader = () => (
    <Flex flexDir="column" w="40%" align="flex-end">
      <Text fontSize={headingFontSize} fontWeight="semibold">
        {feesTypeMasterId === 2 ? "TRANSPORT FEES RECEIPT" : "FEES RECEIPT"}
      </Text>
      {feesMode === 2 ? (
        <InfoRow
          label="TRANSPORT RECEIPT NO"
          value={toUpper(transportReceiptNo)}
          color="green.900"
        />
      ) : (
        <InfoRow
          label="RECEIPT NO"
          value={toUpper(receiptNo)}
          color="green.900"
        />
      )}
      <Text fontSize={fontSize} mt={1}>
        {dayjs(date).format("MMMM DD, YYYY").toUpperCase()}
      </Text>
      {(feesMode !== 2 || chequeId) && (
        <InfoRow label="USER" value={toUpper(user?.name || "")} />
      )}
    </Flex>
  );

  return (
    <Box
      m={1}
      p={2}
      border="1px solid"
      borderColor="black"
      borderRadius="md"
      fontFamily={fontFamily}
      fontSize={fontSize}
      style={{ pageBreakInside: "avoid" }}
      pos="relative"
    >
      {(chequeStatus === "Cancelled" || status === "Cancelled") && (
        <Flex w="100%" h="100%" pos="absolute" align="center" justify="center">
          <Image src="/assets/cancelled.png" opacity={0.1} alt="Cancelled" />
        </Flex>
      )}

      {feesTypeMasterId === 2 ? (
        <TransporterHeader
          schoolData={printProps.schoolData}
          extra={
            <Text mb={1} fontSize={labelFontSize} textAlign="right">
              {toUpper(copy)}
            </Text>
          }
        />
      ) : (
        <SchoolHeaderSmall
          schoolData={printProps.schoolData}
          haveToShowMoreInfo={false}
          extra={
            <Text mb={1} fontSize={labelFontSize} textAlign="right">
              {toUpper(copy)}
            </Text>
          }
        />
      )}
      <Box borderBottom="2px solid gray" my={2} />

      {student && (
        <Flex py={1}>
          <Box w="60%">
            {[
              ["SR NO.", student.srNo],
              ["STUDENT NAME", student.studentName],
              ["FATHER'S NAME", student.fatherName],
              ["MOTHER'S NAME", student.motherName],
              [
                "CLASS",
                `${class_master?.name} - ${stream_master?.name} - ${section_master?.name}`,
              ],
            ].map(([label, value], idx) => (
              <Flex key={idx} fontSize={fontSize} my={1}>
                <Text fontWeight="medium" w="35%">
                  {label}
                </Text>
                <Text ml={1} fontWeight={"semibold"}>: {toUpper(value)}</Text>
              </Flex>
            ))}
          </Box>
          {renderReceiptHeader()}
        </Flex>
      )}

      <Box py={2} borderBottom="1px solid" borderColor="gray.300">
        <Table
          size="sm"
          variant="simple"
          sx={{
            "th, td": {
              fontSize: `8px !important`,
              lineHeight: "1.2",
              fontWeight: "medium",
              textTransform: "uppercase",
              padding: "4px",
            },
          }}
        >
          <Thead>
            <Tr>
              <Th w="10%">S NO.</Th>
              <Th>PARTICULAR</Th>
              <Th w="20%" isNumeric>
                AMOUNT
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {(fees_collects?.length > 0 ? [...fees_collects] : [])
              .concat(Array(Math.max(0, 10 - fees_collects?.length)).fill(null))
              .map((fee, i) => (
                <Tr key={i}>
                  <Td>{i + 1}</Td>
                  <Td>
                    {fee
                      ? toUpper(
                          fee?.transport_fee_master?.name ||
                            fee?.fees_name_master?.name ||
                            ""
                        )
                      : ""}
                  </Td>
                  <Td isNumeric> {fee ? `₹ ${fee.amount?.toFixed(2)}` : ""}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>

      <Flex fontSize={bottomFontSize} mt={2} justify="space-between">
        <VStack w="35%" align="flex-start" spacing={1}>
          <Flex>
            <Text fontWeight="medium">IN WORDS:</Text>
            <Text ml={1}>{toUpper(NumberToWords(total))} ONLY</Text>
          </Flex>
          <Flex>
            <Text fontWeight="medium">REMARK:</Text>
            <Text ml={1}>{toUpper(remark || "N/A")}</Text>
          </Flex>
        </VStack>

    

        <VStack w="32%" align="flex-start" spacing={1}>
          <Flex>
            <Text fontWeight="medium">PAYMENT MODE:</Text>
            <Text ml={1}>{toUpper(type)}</Text>
          </Flex>
          {chequeNo && (
            <>
              <Flex>
                <Text fontWeight="medium">CHEQUE BANK:</Text>
                <Text ml={1}>{toUpper(bank)}</Text>
              </Flex>
              <Flex>
                <Text fontWeight="medium">CHEQUE NO:</Text>
                <Text ml={1}>{toUpper(chequeNo)}</Text>
              </Flex>
            </>
          )}
          {ledger_master?.type !== "CASH" && ledger_master?.name && (
            <Flex>
              <Text fontWeight="medium">BANK NAME:</Text>
              <Text ml={1}>{toUpper(ledger_master.name)}</Text>
            </Flex>
          )}
          {transitionNo && (
            <Flex>
              <Text fontWeight="medium">TRANSACTION NO.:</Text>
              <Text ml={1}>{transitionNo}</Text>
            </Flex>
          )}
        </VStack>
        <VStack w="32%" align="flex-start" spacing={1}>
          <Flex>
            <Text fontWeight="medium">TOTAL DEPOSIT:</Text>
            <Text ml={1}>₹ {totalFees?.toFixed(2)}</Text>
          </Flex>
          <Flex>
            <Text fontWeight="medium">TOTAL DUE TILL DATE:</Text>
            <Text ml={1}>
              ₹ {printProps?.feesInfo?.totalDue?.toFixed(2) || "0.00"}
            </Text>
          </Flex>
        </VStack>
      </Flex>

      <Flex justify="space-between" mt={4}>
        <Text fontSize={bottomFontSize}>
          PRINTED AT {dayjs().format("DD-MM-YYYY hh:mm:ss A").toUpperCase()}
        </Text>
        <Text
          fontSize={bottomFontSize}
          borderTop="1px solid"
          borderColor="gray.300"
          pt={1}
        >
          AUTHORISED SIGNATURE
        </Text>
      </Flex>
      <style jsx global>{`
        @media print {
          th {
            background-color: rgb(0, 46, 105) !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            text-transform: uppercase !important;
            font-weight: bold !important;
          }
        }
      `}</style>
    </Box>
  );
};
