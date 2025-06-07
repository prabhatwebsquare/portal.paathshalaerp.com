import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { PageHeader } from "@/common/PageHeader";
import { NumberToWords } from "@/constant/NumToWords";
import { useStdFeesStore } from "@/store/stdFees";
import { DownloadIcon } from "@chakra-ui/icons";
import { BASE_URL, URL } from "@/services/apis";
import {
  Box,
  Flex,
  IconButton,
  Image,
  Tooltip,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { compact, map, sumBy, toUpper } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { MdCurrencyRupee } from "react-icons/md";

export const OpenReceipt = () => {
  const route = useRouter();
  const printRef = useRef();

  const {
    getOpenFeesReceiptAction,
    getOpenFeesReceiptStatus,
    openFeeReceiptData,
  } = useStdFeesStore((s) => ({
    getOpenFeesReceiptAction: s.getOpenFeesReceiptAction,
    getOpenFeesReceiptStatus: s.getOpenFeesReceiptStatus,
    openFeeReceiptData: s.openFeeReceiptData,
  }));

  useEffect(() => {
    if (route?.query?.org && route?.query?.receiptNo) {
      getOpenFeesReceiptAction({
        org: route.query.org,
        receiptNo: route.query.receiptNo,
      });
    }
  }, [getOpenFeesReceiptAction, route.query]);

  const handleDownloadPdf = async () => {
    if (printRef.current) {
      // Wait for content to fully render
      await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay

      const element = printRef.current;
      // const canvas = await html2canvas(element, { scale: 2 });
      const canvas = await html2canvas(element, {
        scale: 3, // Increase scale for better quality
        logging: false, // Disable logging to reduce clutter
        useCORS: true, // Ensure images are loaded correctly
      });
      const imageData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const imgWidth = 595.28; // A4 width in pt (portrait mode)
      const pageHeight = 841.89; // A4 height in pt
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imageData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // If the content exceeds one page, add more pages
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imageData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("fees-receipt.pdf");
    }
  };

  return (
    <Box w={"100%"} align={"center"}>
      <LoadingContainer status={getOpenFeesReceiptStatus}>
        {openFeeReceiptData?.data ? (
          <>
            <Box w={"60%"}>
              <PageHeader
                heading={"Fees Receipt Print"}
                extra={
                  <Tooltip placement="top" label={"Edit Receipt"}>
                    <IconButton
                      size="xs"
                      variant={"ghost"}
                      colorScheme={"purple"}
                      icon={<DownloadIcon fontSize={16} />}
                      onClick={handleDownloadPdf}
                    />
                  </Tooltip>
                }
              />
              <FeesReceipt
                printProps={openFeeReceiptData}
                copy={"Candidate-Copy"}
                ref={printRef}
              />
            </Box>
            <Box w={"100%"} display={"none"}>
              {openFeeReceiptData?.data && (
                <Box ref={printRef}>
                  <FeesReceipt
                    printProps={openFeeReceiptData}
                    copy={"Candidate-Copy"}
                    ref={printRef}
                  />
                  <Box marginTop={"15%"}>
                    <FeesReceipt
                      printProps={openFeeReceiptData}
                      copy={"Office-Copy"}
                      ref={printRef}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </>
        ) : (
          <NoData title={"No Fees Receipt Found"} />
        )}
      </LoadingContainer>
    </Box>
  );
};
const FeesReceipt = ({ printProps, copy }) => {
  const student = printProps?.data?.student_master;
  const fees = printProps?.data;
  const school = printProps?.schoolData;
  const totalFees =
    sumBy(fees.fees_collects, "amount") + sumBy(fees.fees_collects, "lateFees");
  const total =
    sumBy(fees.fees_collects, "amount") +
    sumBy(fees.fees_collects, "discount") +
    sumBy(fees.fees_collects, "lateFees");

  return (
    <Box
      w={"100%"}
      mt={4}
      p={[2, 4]}
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
      <Flex
        h={["auto", "105px"]}
        border={"1px solid"}
        borderColor={"gray.200"}
        flexDir={["column", "row"]}
        align={"center"}
      >
        <Flex
          p={[2, 3]}
          w={["100%", "25%"]}
          align={"center"}
          justify={["center", "flex-start"]}
        >
          {school?.logo ? (
            <Image
              h={["70px", "90px"]}
              w={["40%", "60%"]}
              src={`${URL}${school?.logo}`}
              objectFit={"contain"}
              alt="School Logo"
            />
          ) : (
            <></>
          )}
        </Flex>
        <Box
          w={["100%", "50%"]}
          align={["center", "center"]}
          textAlign={["center", "center"]}
          p={2}
        >
          <Text fontSize={[20, 24]} fontWeight={"semibold"}>
            {school?.name}
          </Text>
          <Text fontSize={[12, 14]}>
            {compact([school?.address, school?.district, school?.state])?.join(
              ", "
            )}
          </Text>
          <Text mt={2} fontSize={[16, 18]} fontWeight={"semibold"}>
            Fees Receipt
          </Text>
        </Box>
        <Box
          w={["100%", "25%"]}
          align={"flex-end"}
          textAlign={"right"}
          pr={[2, 4]}
        >
          <Text mb={2} fontSize={[10, 12]} textAlign={"right"}>
            {copy}
          </Text>
        </Box>
      </Flex>
      {student && (
        <Flex
          py={2}
          borderBottom={"1px solid"}
          borderColor={"gray.200"}
          flexDir={["column", "row"]}
        >
          <Box w={["100%", "60%"]} fontSize={[10, 12]}>
            <Flex align={"center"}>
              <Text w="40%">SR No. </Text>
              <Text ml={2} fontWeight={"semibold"}>
                : {student.srNo}
              </Text>
            </Flex>
            <Flex align={"center"}>
              <Text w="40%">Student Name </Text>
              <Text ml={2} fontWeight={"semibold"}>
                : {student.studentName}
              </Text>
            </Flex>
            <Flex align={"center"}>
              <Text w="40%">Father&apos;s Name </Text>
              <Text ml={2} fontWeight={"semibold"}>
                : {student.fatherName}
              </Text>
            </Flex>
            <Flex align={"center"}>
              <Text w="40%">Mother&apos;s Name </Text>
              <Text ml={2} fontWeight={"semibold"}>
                : {student.motherName}
              </Text>
            </Flex>
            <Flex align={"center"}>
              <Text w="40%">Class </Text>
              <Text ml={2} fontWeight={"semibold"}>
                : {printProps.data?.class_master?.name} -{" "}
                {printProps.data?.stream_master?.name}
              </Text>
            </Flex>
          </Box>
          <Flex
            w={["100%", "40%"]}
            mt={[4, 0]}
            flexDir={"column"}
            align={["flex-start", "flex-end"]}
          >
            <Text
              fontWeight={"semibold"}
              fontSize={fees.feesTypeMasterId === 2 ? [12, 14] : [14, 16]}
            >
              {fees.feesTypeMasterId === 2
                ? "TRANSPORT FEES RECEIPT"
                : "FEES RECEIPT"}
            </Text>
            <Text w="fit-content" fontSize={[10, 12]}>
              {dayjs(fees.createdAt).format("MMMM DD, YYYY hh:mm A")}
            </Text>
            <Flex
              w="fit-content"
              fontWeight={"semibold"}
              color={"green.400"}
              fontSize={[10, 12]}
            >
              <Text>Receipt No</Text>
              <Text ml={1}>: {fees.receiptNo || "-"}</Text>
            </Flex>
            <Flex
              w="fit-content"
              fontSize={[10, 12]}
              mt={2}
              fontWeight={"semibold"}
            >
              <Text>By</Text>
              <Text ml={1}>: {fees.user.name}</Text>
            </Flex>
          </Flex>
        </Flex>
      )}
      <Box py={2} borderBottom={"1px solid"} borderColor={"gray.200"}>
        <Box overflowX={"auto"}>
          <Table size={"sm"} fontSize={[10, 12]}>
            <Thead>
              <Tr>
                <Th w="10%">Sr No.</Th>
                <Th>Particular</Th>
                <Th w={"23%"}>
                  <Flex align={"center"}>
                    {"Fees Deposit ( "} <MdCurrencyRupee />
                    {" )"}
                  </Flex>
                </Th>
                <Th w={"20%"}>
                  <Flex align={"center"}>
                    {"Discount ( "} <MdCurrencyRupee />
                    {" )"}
                  </Flex>
                </Th>
                <Th w={"20%"}>
                  <Flex align={"center"}>
                    {"LateFees ( "} <MdCurrencyRupee />
                    {" )"}
                  </Flex>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {map(fees?.fees_collects, (fee, i) => (
                <Tr key={fee.id}>
                  <Td fontSize={["xs", "sm"]}>{i + 1}</Td>
                  <Td fontSize={["xs", "sm"]}>
                    {fee?.transport_fee_master?.name ||
                      fee?.fees_name_master?.name}
                  </Td>
                  <Td fontSize={["xs", "sm"]}>
                    <Flex align={"center"} justify={"flex-end"}>
                      <MdCurrencyRupee />
                      {fee.amount}
                    </Flex>
                  </Td>
                  <Td fontSize={["xs", "sm"]}>
                    <Flex align={"center"} justify={"flex-end"}>
                      <MdCurrencyRupee />
                      {fee.discount || 0}
                    </Flex>
                  </Td>
                  <Td fontSize={["xs", "sm"]}>
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
      </Box>

      <Flex flexDir={["column", "row"]} mt={4}>
        <Box w={["100%", "70%"]}>
          <Flex fontSize={[10, 12]}>
            <Text>IN WORDS :</Text>
            <Text fontWeight={"bold"} ml={1}>
              {NumberToWords(total)}&nbsp;Only
            </Text>
          </Flex>
          <Flex fontSize={[10, 12]}>
            <Text>Remark :</Text>
            <Text fontWeight={"bold"} ml={1}>
              {fees.remark}
            </Text>
          </Flex>
        </Box>
        <Box w={["100%", "30%"]} mt={[4, 0]}>
          <Flex fontSize={[10, 12]}>
            <Text>Total :</Text>
            <Flex fontWeight={"bold"} align={"center"}>
              <MdCurrencyRupee />
              {total}
            </Flex>
          </Flex>
          <Flex fontSize={[10, 12]}>
            <Text>Total Fees Deposit :</Text>
            <Flex fontWeight={"bold"} align={"center"}>
              <MdCurrencyRupee />
              {totalFees}
            </Flex>
          </Flex>
          <Flex fontSize={[10, 12]}>
            <Text>Payment Mode :</Text>
            <Text fontWeight={"bold"} ml={1}>
              {toUpper(fees.type)}
            </Text>
          </Flex>
          {fees.chequeNo && (
            <Flex fontSize={[10, 12]}>
              <Text>Cheque No :</Text>
              <Text fontWeight={"bold"} ml={1}>
                {fees.chequeNo}
              </Text>
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default FeesReceipt;
