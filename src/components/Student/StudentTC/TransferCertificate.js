import { Box, Flex, Text, Divider, Image, useColorModeValue } from "@chakra-ui/react";
import { useEffect } from "react";
import moment from "moment";
import { SchoolHeader } from "@/common/SchoolHeader";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { URL } from "@/services/apis";

export const TransferCertificate = ({ printTcProps,  themeColor = "blue" }) => {
 

  const schoolData = getLocalStorageItem("user");
  const student = printTcProps || {};
  const cls = student?.class || "N/A";
  const section = student?.section || "N/A";
  const stream = student?.stream || "N/A";
  const dob = student.dob ? moment(student.dob).format("DD-MMM-YYYY") : "N/A";
  const admissionDate = student.admissionDate ? moment(student.admissionDate).format("DD-MMM-YYYY") : "N/A";
  const genderPrefix = student?.gender === "Male" ? "Mr." : "Ms.";
  const parentLabel = student?.gender === "Male" ? "Son" : "Daughter";
  const pronoun = student?.gender === "Male" ? "He" : "She";
  const possessivePronoun = student?.gender === "Male" ? "His" : "Her";

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");

  // Convert DOB to words (simplified example, can use a library like 'number-to-words' for accuracy)
  const dobInWords = student.dob
    ? moment(student.dob).format("Do MMMM, YYYY").replace(/\d+/g, (num) => {
        const numberToWords = {
          1: "First",
          2: "Second",
          3: "Third",
          4: "Fourth",
          5: "Fifth",
          6: "Sixth",
          7: "Seventh",
          8: "Eighth",
          9: "Ninth",
          10: "Tenth",
          11: "Eleventh",
          12: "Twelfth",
          13: "Thirteenth",
          14: "Fourteenth",
          15: "Fifteenth",
          16: "Sixteenth",
          17: "Seventeenth",
          18: "Eighteenth",
          19: "Nineteenth",
          20: "Twentieth",
          21: "Twenty-First",
          22: "Twenty-Second",
          23: "Twenty-Third",
          24: "Twenty-Fourth",
          25: "Twenty-Fifth",
          26: "Twenty-Sixth",
          27: "Twenty-Seventh",
          28: "Twenty-Eighth",
          29: "Twenty-Ninth",
          30: "Thirtieth",
          31: "Thirty-First",
        };
        return numberToWords[num] || num;
      })
    : "N/A";
  return (
    <Box
      m={0}
      p={0}
      border={`3px double ${themeColor}.700`}
      borderRadius="lg"
      bg={bgColor}
      boxShadow={`0 6px 12px ${themeColor}.100`}
      position="relative"
      _hover={{
        borderColor: `${themeColor}.800`,
        boxShadow: `0 8px 16px ${themeColor}.200`,
      }}
      transition="all 0.3s"
      fontFamily="'Inter', sans-serif"
      sx={{
        '@media print': {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          pageBreakAfter: 'always',
          pageBreakInside: 'avoid'
        }
      }}
    >

  

      {/* Background Pattern */}
   

      {/* Content */}
      <Box p={0} position="relative" zIndex={2}>
          <SchoolHeader title="TRANSFER CERTIFICATE" themeColor={themeColor} />
       
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
        <Flex
          justify="space-between"
          my={6}
          fontSize="sm"
          color={textColor}
          fontFamily="'Merriweather', serif"
        >
          <Text fontWeight="bold">
            <strong>TC Serial:</strong> {student.srNo || "N/A"}
          </Text>
          <Text fontWeight="bold">
            <strong>Admission No.:</strong> {student.admissionNo || "N/A"}
          </Text>
          <Text fontWeight="bold">
            <strong>Date:</strong> {moment().format("DD-MMM-YYYY")}
          </Text>
        </Flex>

        <Divider borderColor={`${themeColor}.700`} borderWidth="4px" my={6} borderRadius="2px" />

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
          mb={4}
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
            {student.studentName || "N/A"}
          </strong>
          , {parentLabel} of <strong>{student.fatherName || "N/A"}</strong> and{" "}
          <strong>{student.motherName || "N/A"}</strong>, residing at{" "}
          <strong>{student.address || "N/A"}</strong>, was admitted into this
          institution on <strong>{admissionDate}</strong> on a transfer from{" "}
          <strong>{student.prevSchool || "N/A"}</strong>.
        </Text>

        <Text
          fontSize="md"
          lineHeight="2.2"
          mb={4}
          textAlign="justify"
          color={textColor}
          fontFamily="'Merriweather', serif"
        >
          {pronoun} was studying in Class <strong>{cls}</strong>, Section{" "}
          <strong>{section}</strong> of the <strong>{stream}</strong> stream during
          the academic session.
        </Text>

        <Text
          fontSize="md"
          lineHeight="2.2"
          mb={4}
          textAlign="justify"
          color={textColor}
          fontFamily="'Merriweather', serif"
        >
          {possessivePronoun} Date of Birth, according to the Scholar Register, is{" "}
          <strong>{dob}</strong> (in words: <strong>{dobInWords}</strong>).
        </Text>

        <Text
          fontSize="md"
          lineHeight="2.2"
          mb={4}
          textAlign="justify"
          color={textColor}
          fontFamily="'Merriweather', serif"
        >
          {possessivePronoun} religion is <strong>{student.religion || "N/A"}</strong>, and{" "}
          {possessivePronoun.toLowerCase()} category is <strong>{student.category || "N/A"}</strong>.
        </Text>

        {/* <Text
          fontSize="md"
          lineHeight="2.2"
          mb={4}
          textAlign="justify"
          color={textColor}
          fontFamily="'Merriweather', serif"
        >
          {pronoun} obtained <strong>{student.prevObtainmarks || "N/A"}</strong> out of{" "}
          <strong>{student.prevMaxmarks || "N/A"}</strong> marks in the previous class{" "}
          <strong>{student.prevClass || "N/A"}</strong> at{" "}
          <strong>{student.prevSchool || "N/A"}</strong>, achieving a percentage of{" "}
          <strong>{student.prevPercentmarks || "N/A"}%</strong>.
        </Text> */}

        <Text
          fontSize="md"
          lineHeight="2.2"
          mb={10}
          textAlign="justify"
          color={textColor}
          fontFamily="'Merriweather', serif"
        >
          This certificate is issued upon request for any purpose it may serve.
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
              alt="Head of Institution Signature"
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
              Head of the Institution
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};