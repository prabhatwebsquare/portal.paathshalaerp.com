import { TransporterHeader } from "@/common/TransporterHeader";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  Image,
  Divider,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { sumBy } from "lodash";
import dayjs from "dayjs";
import { SchoolHeader } from "@/common/SchoolHeader";

const FeesReceiptThree = ({
  feeReceiptSchoolData,
  isTransport,
  printProps,
  copy,
  themeColor = "blue",
}) => {
  const { data } = printProps || {};
  const {
    student_master: student,
    fees_collects = [],
    class_master,
    stream_master,
    section_master,
    chequeStatus,
    status,
    receiptNo,
    transportReceiptNo,
    feesMode,
    date,
    type,
    user,
    bank,
    chequeNo,
    ledger_master,
    remark,
    feesTypeMasterId,
    dueAmount = 0,
  } = data || {};

  const totalFees =
    sumBy(fees_collects, "amount") + sumBy(fees_collects, "lateFees");

  return (
    <Box
      maxW="595pt"
      mx="auto"
      p={2}
      border={`2px double ${themeColor}.700`}
      borderRadius="lg"
      bg="white"
      boxShadow={`0 4px 8px ${themeColor}.100`}
      fontFamily="'Merriweather', serif"
      position="relative"
    >
      {(chequeStatus === "Cancelled" || status === "Cancelled") && (
        <Flex
          w="100%"
          h="100%"
          pos="absolute"
          align="center"
          justify="center"
          zIndex={1}
        >
          <Image
            src="/assets/cancelled.png"
            opacity={0.3}
            alt="Cancelled"
            transform="rotate(-45deg)"
            maxW="400px"
          />
        </Flex>
      )}

      {feesTypeMasterId === 2 ? (
        <TransporterHeader
          schoolData={printProps.schoolData}
          extra={
            <Text
              mb={1}
              fontSize="xs"
              textAlign="right"
              color={`${themeColor}.800`}
              fontFamily="'Merriweather', serif"
              className="note-text"
            >
              {copy}
            </Text>
          }
        />
      ) : (
        <SchoolHeader
          schoolData={printProps.schoolData}
          extra={
            <Text
              mb={1}
              fontSize="xs"
              textAlign="right"
              color={`${themeColor}.800`}
              fontFamily="'Merriweather', serif"
              className="note-text"
            >
              {copy}
            </Text>
          }
        />
      )}

      <Divider
        border="0"
        height="2px"
        bgGradient={`linear(to-r, ${themeColor}.700, ${themeColor}.200)`}
        my={4}
      />

      <Flex gap={1} mb={2}>
        {/* Student Info Section */}
        <Box
          flex="1"
          border={`1px solid `}
          borderRadius="md"
          p={2}
          borderColor={`${themeColor}.500`}
          bg={`white`}
          boxShadow={`0 2px 4px ${themeColor}.100`}
          _hover={{
            borderColor: `${themeColor}.400`,
            boxShadow: `0 4px 8px ${themeColor}.200`,
          }}
          transition="all 0.3s"
        >
          <Grid templateColumns="auto 1fr" gap={1} fontSize="sm">
            <GridItem
              minW="100px"
              className="label-text"
              fontWeight="bold"
              color={`${themeColor}.800`}
            >
              Receipt No:
            </GridItem>
            <GridItem className="value-text">
              {feesTypeMasterId === 2 ? transportReceiptNo : receiptNo || "N/A"}
            </GridItem>
            <GridItem
              minW="100px"
              className="label-text"
              fontWeight="bold"
              color={`${themeColor}.800`}
            >
              Student&apos;s Name:
            </GridItem>
            <GridItem className="value-text">
              {student?.studentName || "N/A"}
            </GridItem>
            <GridItem
              minW="100px"
              className="label-text"
              fontWeight="bold"
              color={`${themeColor}.800`}
            >
              Father&apos;s Name:
            </GridItem>
            <GridItem className="value-text">
              {student?.fatherName || "N/A"}
            </GridItem>
            <GridItem
              minW="100px"
              className="label-text"
              fontWeight="bold"
              color={`${themeColor}.800`}
            >
              Class:
            </GridItem>
            <GridItem className="value-text">
              {class_master?.name || "N/A"}
              {stream_master?.name ? ` - ${stream_master?.name}` : ""}
            </GridItem>
            <GridItem
              minW="100px"
              className="label-text"
              fontWeight="bold"
              color={`${themeColor}.800`}
            >
              Section:
            </GridItem>
            <GridItem className="value-text">
              {section_master?.name || "N/A"}
            </GridItem>
          </Grid>
        </Box>
        <Box
          flex="1"
          border={`1px solid `}
          borderRadius="md"
          p={2}
          borderColor={`${themeColor}.500`}
          bg={`white`}
          boxShadow={`0 2px 4px ${themeColor}.100`}
          _hover={{
            borderColor: `${themeColor}.400`,
            boxShadow: `0 4px 8px ${themeColor}.200`,
          }}
          transition="all 0.3s"
        >
          <Grid templateColumns="auto 1fr" gap={1} fontSize="sm">
            <GridItem
              minW="100px"
              className="label-text"
              fontWeight="bold"
              color={`${themeColor}.800`}
            >
              Date:
            </GridItem>
            <GridItem className="value-text" textAlign="right">
              {date ? dayjs(date).format("DD-MM-YYYY") : "N/A"}
            </GridItem>
            <GridItem
              minW="100px"
              className="label-text"
              fontWeight="bold"
              color={`${themeColor}.800`}
            >
              User:
            </GridItem>
            <GridItem className="value-text" textAlign="right">
              {user?.name || "N/A"}
            </GridItem>
            <GridItem
              minW="100px"
              className="label-text"
              fontWeight="bold"
              color={`${themeColor}.800`}
            >
              Mode:
            </GridItem>
            <GridItem className="value-text" textAlign="right">
              {type}
              {/* {feesMode || "N/A"} */}
              {bank ? `, ${bank}` : ""}
              {chequeNo ? `, ${chequeNo}` : ""}
            </GridItem>
            <GridItem
              minW="100px"
              className="label-text"
              fontWeight="bold"
              color={`${themeColor}.800`}
            >
              Faculty:
            </GridItem>
            <GridItem className="value-text" textAlign="right">
              {ledger_master?.name || "N/A"}
            </GridItem>
            <GridItem
              minW="100px"
              className="label-text"
              fontWeight="bold"
              color={`${themeColor}.800`}
            >
              Sr/Adm No:
            </GridItem>
            <GridItem className="value-text" textAlign="right">
              {student?.srNo || "N/A"}
            </GridItem>
          </Grid>
        </Box>
      </Flex>

      <Table variant="simple" mb={2}>
        <Thead bg={`${themeColor}.700`} color="white">
          <Tr>
            <Th
              color="white"
              fontFamily="'Cinzel', serif"
              fontSize="sm"
              className="header-text"
              py={2}
            >
              S.No
            </Th>
            <Th
              color="white"
              fontFamily="'Cinzel', serif"
              fontSize="sm"
              className="header-text"
              py={2}
            >
              Particular
            </Th>
            <Th
              color="white"
              fontFamily="'Cinzel', serif"
              fontSize="sm"
              className="header-text"
              py={2}
              isNumeric
            >
              Amount
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {fees_collects.map((fee, i) => (
            <Tr key={i}>
              <Td py={1} className="table-text">
                {i + 1}
              </Td>
              <Td py={1} className="table-text">
                {fee?.transport_fee_master?.name ||
                  fee?.fees_name_master?.name ||
                  "-"}
              </Td>
              <Td py={1} textAlign="right" className="table-text">
                {fee?.amount?.toFixed(2) || ""}
              </Td>
            </Tr>
          ))}
          {fees_collects.length === 0 && (
            <Tr>
              <Td colSpan={3} textAlign="center" className="table-text">
                No fees recorded
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      <Box
        border={`1px solid ${themeColor}.200`}
        borderRadius="md"
        p={1}
        bg="white"
        boxShadow={`0 2px 4px ${themeColor}.100`}
        mb={4}
        _hover={{
          borderColor: `${themeColor}.400`,
          boxShadow: `0 4px 8px ${themeColor}.200`,
        }}
        transition="all 0.3s"
      >
        <Flex justify="space-between" align="center">
          <Text
            fontSize="sm"
            fontWeight="bold"
            color={`${themeColor}.800`}
            className="label-text"
          >
            In Words: Rupees {totalFees?.toFixed(2)} Only
          </Text>
          <Flex align="center">
            <Text
              fontWeight="bold"
              mr={2}
              color={`${themeColor}.800`}
              className="label-text"
            >
              Total Amount:
            </Text>
            <Box
              border={`1px solid ${themeColor}.200`}
              borderRadius="md"
              px={4}
              py={1}
              bg={`${themeColor}.50`}
              textAlign="center"
              minW="120px"
              className="value-text"
            >
              ₹ {totalFees?.toFixed(2)}
            </Box>
          </Flex>
        </Flex>
        <Flex justify="flex-end" mt={2} align="center">
          <Text
            fontWeight="bold"
            mr={2}
            color={`${themeColor}.800`}
            className="label-text"
          >
            Due Amount Till Date:
          </Text>
          <Box
            border={`1px solid ${themeColor}.200`}
            borderRadius="md"
            px={4}
            py={1}
            bg={`${themeColor}.50`}
            textAlign="center"
            minW="120px"
            className="value-text"
          >
            ₹ {printProps?.feesInfo?.totalDue?.toFixed(2) || "0.00"}
          </Box>
        </Flex>
      </Box>

      <Divider
        border="0"
        height="2px"
        bgGradient={`linear(to-r, ${themeColor}.700, ${themeColor}.200)`}
        my={4}
      />

      <Flex justify="space-between" align="flex-start">
        <Box>
          <Text
            fontSize="sm"
            fontWeight="bold"
            color={`${themeColor}.800`}
            fontFamily="'Cinzel', serif"
            className="header-text"
          >
            IMPORTANT INFORMATION
          </Text>
          {remark && (
            <Text fontSize="xs" color="gray.600" className="note-text">
              {remark}
            </Text>
          )}
        </Box>
        <Box textAlign="right">
          <Text
            fontSize="md"
            fontWeight="normal"
            color={`${themeColor}.800`}
            fontFamily="'Great Vibes', cursive"
            className="signature-text"
          >
            Authorised Signatory
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default FeesReceiptThree;
