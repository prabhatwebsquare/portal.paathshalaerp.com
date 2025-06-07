import { URL } from "@/services/apis";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Text,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import { map } from "lodash";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { FiPrinter } from "react-icons/fi";
import Barcode from "react-barcode";
import { SchoolHeaderSmall } from "@/common/SchoolHeaderSmall";
import { SchoolHeaderSmallIdCard } from "@/common/SchoolHeaderSmallIdCard";

export const PrintIdCard = ({ allData, school, isOpen, onClose, themeColor = "blue" }) => {
  const printRef = useRef();
  const bgColor = useColorModeValue("white", "gray.800");

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Student ID Cards",
    pageStyle: `
      @page {
        size: A4;
        margin: 2mm;
      }
      @media print {
        .no-print {
          display: none !important;
        }
        .print-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10pt;
          padding: 0;
          margin: 0;
          width: 100%;
        }
    .id-card {
  background-image: url('/assets/id_bg2.jpg') !important;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

      }
    `,
  });

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
            Student ID Cards
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
            <Box ref={printRef}>
              <SimpleGrid columns={3} spacing={4} className="print-container">
                {map(allData, (student, i) =>
                  student ? (
                    <Box
                      key={i}
                      className="id-card"
                      h={"243.78pt"}
                      w={"153pt"}
                      px={"10pt"}
                      py={"5pt"}
                      border={"1px solid"}
                      borderColor={"gray.200"}
                      borderRadius={10}
                      bgImage={"url('../../assets/id_bg2.jpg')"}
                      bgPosition="center"
                      bgRepeat="no-repeat"
                      bgSize="cover"
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      style={{
                        pageBreakInside: "avoid",
                        breakInside: "avoid",
                        pageBreakAfter: "auto",
                        marginTop: "10pt",
                      }}
                    >
                      <Box>
                        <Flex align={"center"} mx={"-7pt"}>
                          <SchoolHeaderSmallIdCard
                            title={"Student ID Card"}
                            schoolData={school}
                          />
                        </Flex>

                        <Box align={"center"} my={2}>
                          <Image
                            borderRadius="full"
                            boxSize="50px"
                            src={`${URL}${student.student_master.photo}`}
                            alt="Student Avatar"
                          />
                          <Text mt={"5pt"} fontSize={10} fontWeight={"bold"}>
                            {student.student_master.studentName}
                          </Text>
                          <Text fontSize={9} fontWeight={"semibold"}>
                            {student.student_master.fatherName}
                          </Text>
                        </Box>

                        <Flex display={"flex"} flexDir={"column"} fontSize={9}>
                          <Flex>
                            <Text w={"30%"} fontWeight={"semibold"} fontSize={9}>
                              SR No.
                            </Text>
                            <Text w={"70%"} fontWeight={"bold"} fontSize={9}>
                              :&nbsp;{student.student_master.srNo}
                            </Text>
                          </Flex>
                          <Flex>
                            <Text w={"30%"} fontWeight={"semibold"} fontSize={9}>
                              Contact
                            </Text>
                            <Text w={"70%"} fontWeight={"bold"} fontSize={9}>
                              :&nbsp;{student.student_master.fatherContact}
                            </Text>
                          </Flex>
                          <Flex>
                            <Text w={"30%"} fontWeight={"semibold"} fontSize={9}>
                              Class
                            </Text>
                            <Text w={"70%"} fontWeight={"bold"} fontSize={9}>
                              :&nbsp;{student.class_master.name}&nbsp;&nbsp;(
                              {student.stream_master.name})
                            </Text>
                          </Flex>
                          <Flex>
                            <Text w={"30%"} fontWeight={"semibold"} fontSize={9}>
                              Address
                            </Text>
                            <Text w={"70%"} fontWeight={"bold"} fontSize={9}>
                              :&nbsp;{student.student_master.address}
                            </Text>
                          </Flex>
                        </Flex>
                      </Box>

                      <Flex justify={"center"} mt={1}>
                        <Box align={"center"}>
                          <Image w={"40pt"} h={"15"} src="/assets/sign.png" alt={""} />
                          <Text fontSize={8}>Authorised Signature</Text>
                          <Barcode
                            height={15}
                            displayValue={false}
                            value={student.student_master.srNo}
                            width={1}
                            background={"transparent"}
                          />
                        </Box>
                      </Flex>
                    </Box>
                  ) : null
                )}
              </SimpleGrid>
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
              Print ID Cards
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
