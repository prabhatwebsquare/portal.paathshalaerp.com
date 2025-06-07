import {
  Box,
  Flex,
  Text,
  Divider,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  useColorModeValue,
  ScaleFade,
} from "@chakra-ui/react";
import { useRef } from "react";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { SchoolHeader } from "@/common/SchoolHeader";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { URL } from "@/services/apis";

const BonafideCertificateNew = ({
  studentData,
  isOpen,
  onClose,
  themeColor = "blue",
}) => {
  const session = getLocalStorageItem("sessionMaster");
  const schoolData = getLocalStorageItem("user");
  const student = studentData?.student_master || {};
  const className = studentData?.class_master?.name || "N/A";
  const sectionName = studentData?.section_master?.name || "N/A";
  const streamName = studentData?.stream_master?.name || "N/A";
  const sessionYear = session?.name || "N/A";
  const srNo = studentData?.srNo || "N/A";
  const dob = student?.dob ? moment(student.dob).format("DD-MMM-YYYY") : "N/A";
  const admissionNo = student?.admissionNo || "N/A";
  const admissionDate = student?.admissionDate
    ? moment(student.admissionDate).format("DD-MMM-YYYY")
    : "N/A";
  const genderPrefix = student?.gender === "Male" ? "Mr." : "Ms.";
  const parentLabel = student?.gender === "Male" ? "Son" : "Daughter";
  const pronoun = student?.gender === "Male" ? "He" : "She";

  const printRef = useRef();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Bonafide_Certificate_${student?.studentName || "Student"}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 15mm;
      }
    `,
  });

  return (
    <ScaleFade initialScale={0.9} in={isOpen}>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
        <ModalOverlay bg="blackAlpha.700" />
        <ModalContent
          bg={bgColor}
          borderRadius="2xl"
          border={`3px double ${themeColor}.700`}
          boxShadow={`0 10px 20px ${themeColor}.200`}
          maxW={{ base: "95%", md: "595pt" }}
          mx={2}
          fontFamily="'Inter', sans-serif"
        >
          <ModalHeader
            bgGradient={`linear(to-r, ${themeColor}.700, ${themeColor}.900)`}
            color="white"
            fontSize="xl"
            fontWeight="bold"
            textAlign="center"
            borderTopRadius="2xl"
            py={4}
            fontFamily="'Cinzel', serif"
          >
            Bonafide Certificate
          </ModalHeader>
          <ModalCloseButton
            bg={`${themeColor}.800`}
            color="white"
            borderRadius="full"
            _hover={{ bg: `${themeColor}.900`, transform: "scale(1.2)" }}
            _focus={{ boxShadow: `0 0 0 4px ${themeColor}.300` }}
            size="lg"
            mt={3}
            mr={3}
            aria-label="Close modal"
          />
          <ModalBody p={{ base: 4, md: 8 }}>
            <Box
              ref={printRef}
              className="certificate-box"
           
              border={`3px double ${themeColor}.700`}
              borderRadius="lg"
              bg="white"
              boxShadow={`0 6px 12px ${themeColor}.100`}
              position="relative"
              _hover={{
                borderColor: `${themeColor}.800`,
                boxShadow: `0 8px 16px ${themeColor}.200`,
              }}
              transition="all 0.3s"
            >
              {/* Background Watermark */}
              <Box
                position="absolute"
                top="20%"
                left="50%"
                transform="translateX(-50%)"
                opacity={0.1}
                zIndex={1}
              >
                <Image
                  src={`${URL}${schoolData?.schoolData?.logo}`}
                  alt="School Watermark"
                  maxW="300pt"
                  maxH="300pt"
                  filter="grayscale(100%)"
                  fallbackSrc="https://via.placeholder.com/300?text=School+Logo"
                />
              </Box>

              {/* Background Pattern */}
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg={`linear-gradient(to bottom, ${themeColor}.100, white)`}
                opacity={0.1}
                zIndex={0}
                borderRadius="lg"
                _before={{
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')`,
                  opacity: 0.05,
                }}
              />

              {/* Content */}
              <Box
                className="certificate-content"
                p={10}
                position="relative"
                zIndex={2}
              >
                <Box borderBottom={`4px solid ${themeColor}.700`} pb={2} mb={6}>
                  <SchoolHeader
                    title="BONAFIDE CERTIFICATE"
                    themeColor={themeColor}
                  />
                </Box>

                <Flex
                  justify="space-between"
                  my={6}
                  fontSize="sm"
                  color={textColor}
                  fontFamily="'Merriweather', serif"
                >
                  <Text fontWeight="bold">
                    <strong>S.No:</strong> {srNo}
                  </Text>
                  <Text fontWeight="bold">
                    <strong>Admission No.:</strong> {admissionNo}
                  </Text>
                  <Text fontWeight="bold">
                    <strong>Date:</strong> {moment().format("DD-MMM-YYYY")}
                  </Text>
                </Flex>

                <Divider
                  borderColor={`${themeColor}.700`}
                  borderWidth="4px"
                  my={6}
                  borderRadius="2px"
                />

                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  mb={6}
                  textAlign="center"
                  color={`${themeColor}.800`}
                  fontFamily="'Cinzel', serif"
                  textTransform="uppercase"
                  letterSpacing="1px"
                  textShadow={`1px 1px 2px ${themeColor}.200`}
                >
                  To Whom It May Concern
                </Text>

                <Text
                  fontSize="md"
                  lineHeight="2.2"
                  mb={6}
                  textAlign="justify"
                  color={textColor}
                  fontFamily="'Merriweather', serif"
                >
                  This is to certify that {genderPrefix}{" "}
                  <strong
                    style={{
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      textShadow: `0.5px 0.5px 1px ${themeColor}.200`,
                    }}
                  >
                    {student?.studentName || "N/A"}
                  </strong>
                  , {parentLabel} of{" "}
                  <strong>{student?.fatherName || "N/A"}</strong> and{" "}
                  <strong>{student?.motherName || "N/A"}</strong>, residing at{" "}
                  <strong>{student?.address || "N/A"}</strong>, is a bonafide
                  student of this institution.
                </Text>

                <Text
                  fontSize="md"
                  lineHeight="2.2"
                  mb={6}
                  textAlign="justify"
                  color={textColor}
                  fontFamily="'Merriweather', serif"
                >
                  {pronoun} was admitted to this school on{" "}
                  <strong>{admissionDate}</strong> with Admission Number{" "}
                  <strong>{admissionNo}</strong>. {pronoun} is currently studying
                  in Class <strong>{className}</strong>, Section{" "}
                  <strong>{sectionName}</strong>, Stream{" "}
                  <strong>{streamName}</strong> during the academic session{" "}
                  <strong>{sessionYear}</strong>.
                </Text>

                <Text
                  fontSize="md"
                  lineHeight="2.2"
                  mb={6}
                  textAlign="justify"
                  color={textColor}
                  fontFamily="'Merriweather', serif"
                >
                  {pronoun} Date of Birth, as per school records, is{" "}
                  <strong>{dob}</strong>.
                </Text>

                <Text
                  fontSize="md"
                  lineHeight="2.2"
                  mb={10}
                  textAlign="justify"
                  color={textColor}
                  fontFamily="'Merriweather', serif"
                >
                  This certificate is issued upon the request of the student/parent
                  for any purpose it may serve.
                </Text>

                <Flex justify="space-between" align="flex-end" mt={10}>
                  <Box textAlign="center">
                    <Text
                      fontSize="sm"
                      color={`${themeColor}.700`}
                      mt={2}
                      fontFamily="'Great Vibes', cursive"
                    >
                      Official Seal
                    </Text>
                  </Box>
                  <Box textAlign="center">
                    <Image
                      src={`${URL}${schoolData?.schoolData?.principalSignature}`}
                      alt="Principal Signature"
                      maxH="60px"
                      borderRadius="sm"
                      border={`2px solid ${themeColor}.300`}
                      fallbackSrc="https://via.placeholder.com/120x60?text=Signature"
                      _hover={{ borderColor: `${themeColor}.500` }}
                      transition="all 0.2s"
                    />
                    <Text
                      fontSize="lg"
                      fontWeight="normal"
                      color={`${themeColor}.800`}
                      mt={2}
                      fontFamily="'Great Vibes', cursive"
                    >
                      Principal
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Box>

            <Flex justify="flex-end" mt={6} gap={4}>
              <Button
                colorScheme={themeColor}
                bg={`${themeColor}.700`}
                color="white"
                borderRadius="full"
                size="lg"
                px={8}
                onClick={handlePrint}
                _hover={{
                  bg: `${themeColor}.800`,
                  transform: "scale(1.05)",
                  boxShadow: `0 6px 12px ${themeColor}.300`,
                }}
                transition="all 0.3s"
                fontFamily="'Cinzel', serif"
              >
                Print Certificate
              </Button>
              <Button
                variant="outline"
                colorScheme={themeColor}
                borderRadius="full"
                size="lg"
                px={8}
                onClick={onClose}
                _hover={{
                  bg: `${themeColor}.100`,
                  transform: "scale(1.05)",
                }}
                transition="all 0.3s"
                fontFamily="'Cinzel', serif"
              >
                Close
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </ScaleFade>
  );
};

export default BonafideCertificateNew;