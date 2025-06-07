import { Box, Flex, Text, Divider, Image, useColorModeValue } from "@chakra-ui/react";
import { useEffect } from "react";
import moment from "moment";
import { SchoolHeader } from "@/common/SchoolHeader";
import { URL } from "@/services/apis";

export const CharacterCertificate = ({ school, setPrintProps, themeColor = "blue" }) => {
  useEffect(() => {
    return () => setPrintProps(null);
  }, [setPrintProps]);

  const student = school || {};
  const cls = student?.class || "N/A";
  const section = student?.section || "N/A";
  const dob = student.dob ? moment(student.dob).format("DD-MMM-YYYY") : "N/A";
  const admissionDate = student.admissionDate ? moment(student.admissionDate).format("DD-MMM-YYYY") : "N/A";
  const genderPrefix = student?.gender === "Male" ? "Mr." : "Ms.";
  const parentLabel = student?.gender === "Male" ? "Son" : "Daughter";
  const pronoun = student?.gender === "Male" ? "He" : "She";
  const possessivePronoun = student?.gender === "Male" ? "His" : "Her";

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");

  const dobInWords = student.dob
    ? moment(student.dob).format("Do MMMM, YYYY").replace(/\d+/g, (num) => {
        const numberToWords = {
          1: "First", 2: "Second", 3: "Third", 4: "Fourth", 5: "Fifth",
          6: "Sixth", 7: "Seventh", 8: "Eighth", 9: "Ninth", 10: "Tenth",
          11: "Eleventh", 12: "Twelfth", 13: "Thirteenth", 14: "Fourteenth",
          15: "Fifteenth", 16: "Sixteenth", 17: "Seventeenth", 18: "Eighteenth",
          19: "Nineteenth", 20: "Twentieth", 21: "Twenty-First", 22: "Twenty-Second",
          23: "Twenty-Third", 24: "Twenty-Fourth", 25: "Twenty-Fifth", 26: "Twenty-Sixth",
          27: "Twenty-Seventh", 28: "Twenty-Eighth", 29: "Twenty-Ninth", 30: "Thirtieth",
          31: "Thirty-First",
        };
        return numberToWords[num] || num;
      })
    : "N/A";

  return (
    <Box
      className="print-container"
      m="auto"
      w="100%"
      maxW="1050pt"
      p="40px"
      border={`10px solid `}
      borderRadius="lg"
      bg={bgColor}
      borderColor={`${themeColor}.800`}
      boxShadow={`0 8px 16px ${themeColor}.100`}
      position="relative"
      boxSizing="border-box"
      overflowX="hidden"
      fontFamily="'Merriweather', serif"
    >
      <Box
        position="relative"
        zIndex={2}
        bg="rgba(255, 255, 255, 0.9)"
        borderRadius="md"
        h="100%"
        boxSizing="border-box"
      >
        <Box borderBottom={`4px solid ${themeColor}.700`} pb={2} mb={4}>
          <SchoolHeader title="CHARACTER CERTIFICATE" themeColor={themeColor} />
        </Box>

        <Flex justify="space-between" mb={3} fontSize="sm" color={textColor}>
          <Text fontWeight="bold">
            Certificate No.: {student.srNo || "N/A"}
          </Text>
          <Text fontWeight="bold">
            Admission No.: {student.admissionNo || "N/A"}
          </Text>
          <Text fontWeight="bold">
            Date: {moment().format("DD-MMM-YYYY")}
          </Text>
        </Flex>

        <Divider borderColor={`${themeColor}.700`} borderWidth="3px" my={4} borderRadius="2px" />

        <Text
          fontSize="2xl"
          fontWeight="bold"
          mb={4}
          textAlign="center"
          color={`${themeColor}.800`}
          fontFamily="'Cinzel', serif"
          textTransform="uppercase"
          letterSpacing="1.5px"
        >
          To Whom It May Concern
        </Text>

        <Text fontSize="md" lineHeight="1.8" mb={3} textAlign="justify" color={textColor}>
          This is to certify that {genderPrefix}{" "}
          <strong style={{ textTransform: "uppercase" }}>
            {student.studentName || "N/A"}
          </strong>
          , {parentLabel} of <strong>{student.fatherName || "N/A"}</strong>, 
          
          {/* residing at{" "}
          <strong>{student.address || "N/A"}</strong>,  */}
          
          
          has been a student of this institution.
        </Text>

        <Text fontSize="md" lineHeight="1.8" mb={3} textAlign="justify" color={textColor}>
          {pronoun} was admitted on <strong>{admissionDate}</strong> and studied in Class{" "}
          <strong>{cls}</strong>, Section <strong>{section}</strong> ,   {possessivePronoun} Date of Birth, as per school records, is{" "}
          <strong>{dob}</strong> 
        </Text>



        <Text fontSize="md" lineHeight="1.8" mb={4} textAlign="justify" color={textColor}>
          {pronoun} has exhibited good moral character and discipline during{" "}
          {possessivePronoun.toLowerCase()} tenure at the school.
        </Text>

        <Text fontSize="md" lineHeight="1.8" mb={4} textAlign="justify" color={textColor}>
          We wish {genderPrefix} {student.studentName || "N/A"} every success in{" "}
          {possessivePronoun.toLowerCase()} future endeavors. This certificate is issued upon request.
        </Text>

        <Flex justify="space-between" align="flex-end" mt={6}>
          <Box textAlign="center">
            <Text fontSize="lg" color={`${themeColor}.700`} mt={2} fontFamily="'Great Vibes', cursive">
              Official Seal
            </Text>
          </Box>
          <Box textAlign="center">
            <Image
              src={`${URL}${school?.principalSignature}`}
              alt="Head of Institution Signature"
              maxH="50px"
              borderRadius="sm"
              border={`2px solid ${themeColor}.300`}
              fallbackSrc="https://via.placeholder.com/100x50?text=Signature"
            />
            <Text fontSize="lg" fontWeight="normal" color={`${themeColor}.800`} mt={2} fontFamily="'Great Vibes', cursive">
              Head of the Institution
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};
