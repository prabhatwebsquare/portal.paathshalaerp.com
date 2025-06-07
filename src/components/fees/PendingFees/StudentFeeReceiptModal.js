import React, { useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Box,
  Divider,
  Text,
  Flex,
  useColorModeValue,
  ScaleFade,
} from "@chakra-ui/react";
import { useReactToPrint } from "react-to-print";
import { FiPrinter } from "react-icons/fi";
import { SchoolHeader } from "@/common/SchoolHeader";
import { getLocalStorageItem } from "@/utils/LocalStorage";

const StudentFeeNoticeModal = ({ isOpen, onClose, feeData, themeColor = "blue" }) => {
  const printRef = useRef();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const session = getLocalStorageItem("sessionMaster");

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Student Fee Notice",
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .no-print {
          display: none !important;
        }

        .print-container {
          width: 100%;
        }

        .notice-box {
          border: 1px solid #000 !important;
          box-shadow: none !important;
          width: 100%;
          max-width: 190mm;
          height: 90mm;
          margin: 2mm auto;
          padding: 2mm;
          font-size: 8pt;
          font-family: 'Georgia', serif;
          background: white;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .notice-box:nth-child(3n) {
          page-break-after: always;
        }

        .notice-box:last-child {
          margin-bottom: 10mm;
        }

        .divider {
          height: 1px;
          background: #ccc;
          border: none;
          margin: 2px 0;
        }
      }
    `,
  });

  const formatGenderPrefix = (gender) => gender === "Male" ? "Master" : "Miss";
  const formatParentLabel = (gender) => gender === "Male" ? "son" : "daughter";

  return (
    <ScaleFade initialScale={0.95} in={isOpen}>
      <Modal
        size={{ base: "full", md: "5xl" }}
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        isCentered
      >
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent
          bg={bgColor}
          borderRadius="2xl"
          border={`2px solid ${themeColor}.700`}
          boxShadow={`0 8px 16px ${themeColor}.200`}
          maxW={{ base: "95%", md: "900px" }}
          mx={2}
          fontFamily="'Inter', sans-serif"
        >
          <ModalHeader
            bgGradient={`linear(to-r, ${themeColor}.600, ${themeColor}.800)`}
            color="white"
            fontSize="xl"
            fontWeight="bold"
            textAlign="center"
            borderTopRadius="2xl"
            py={4}
            className="no-print"
          >
            Student Fee Notice
          </ModalHeader>
          <ModalCloseButton
            bg={`${themeColor}.700`}
            color="white"
            borderRadius="full"
            _hover={{ bg: `${themeColor}.800`, transform: "scale(1.1)" }}
            _focus={{ boxShadow: `0 0 0 3px ${themeColor}.300` }}
            size="md"
            mt={3}
            mr={3}
            aria-label="Close modal"
            className="no-print"
          />
          <ModalBody maxHeight="80vh" overflowY="auto" p={{ base: 4, md: 6 }}>
            <Box ref={printRef} className="print-container">
              <VStack spacing={2} align="stretch">
                {feeData.map((item, index) => {
                  const student = item.student_master;
                  const prefix = formatGenderPrefix(student.gender);
                  const parentLabel = formatParentLabel(student.gender);
                  const pendingAmount =
                    item.totalFees +
                    item.totalLateFees -
                    (item.totalCollectFees + item.totalCollectLateFees);

                  return (
                    <Box
                      key={index}
                      className="notice-box"
                      border={`2px solid ${themeColor}.600`}
                      borderRadius="xl"
                      p={{ base: 3, md: 4 }}
                      bg={`${themeColor}.50`}
                      boxShadow={`0 6px 12px ${themeColor}.200`}
                      width="100%"
                      minHeight={{ base: "auto", md: "350px" }}
                      fontSize={{ base: "xs", md: "sm" }}
                      display="flex"
                      flexDirection="column"
                    >
                      <Box className="notice-content">
                        <SchoolHeader
                          title={`Pending Fee Notice`}
                          themeColor={themeColor}
                          haveToShowMoreInfo={false}
                        />
                        <Divider className="divider" borderColor="transparent" my={2} />
                        <Box flex="1" fontSize={{ base: "xs", md: "sm" }}>
                          <Text lineHeight="1.6" textAlign="justify">
                            {prefix} <strong>{student.studentName}</strong>,{" "}
                            {parentLabel} of <strong>{student.fatherName}</strong>, whose S.R. No is{" "}
                            <strong>{student.srNo || "N/A"}</strong> of class{" "}
                            <strong>{item.Class || "N/A"}</strong>, is hereby
                            informed to deposit dues <strong>₹{pendingAmount.toLocaleString("en-IN")}</strong> for the academic session{" "}
                            <strong>{session?.name || "N/A"}</strong> within three days.
                          </Text>
                          <Text
                            mt={2}
                            color="red.600"
                            fontSize={{ base: "xs", md: "sm" }}
                            fontWeight="medium"
                            textAlign="justify"
                          >
                            You are requested to contact the school office or deposit the fee.
                            Otherwise, the student will not be allowed to attend class.
                          </Text>
                        </Box>
                        <Divider className="divider" borderColor="transparent" my={2} />
                        <Flex direction="column" align="flex-end" mt={1} pt={1}>
                          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color={`${themeColor}.700`}>
                            Authorized Signatory
                          </Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                            Date: {new Date().toLocaleDateString("en-IN")}
                          </Text>
                        </Flex>
                      </Box>
                    </Box>
                  );
                })}
              </VStack>
            </Box>
          </ModalBody>
          <ModalFooter className="no-print">
            <Button
              colorScheme={themeColor}
              bg={`${themeColor}.700`}
              color="white"
              borderRadius="full"
              leftIcon={<FiPrinter />}
              onClick={handlePrint}
              _hover={{
                bg: `${themeColor}.800`,
                transform: "scale(1.05)",
                boxShadow: `0 4px 8px ${themeColor}.300`,
              }}
              transition="all 0.3s"
              size="lg"
              mr={3}
            >
              Print Notices
            </Button>
            <Button
              colorScheme="red"
              variant="outline"
              borderRadius="full"
              borderWidth="2px"
              onClick={onClose}
              _hover={{
                bg: "red.100",
                borderColor: "red.600",
                color: "red.700",
              }}
              transition="all 0.3s"
              size="lg"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ScaleFade>
  );
};

export default StudentFeeNoticeModal;
