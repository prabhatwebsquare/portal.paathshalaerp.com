import { SchoolHeader } from "@/common/SchoolHeader";
import {
  Box,
  Text,
  Flex,
  Divider,
  Stack,
} from "@chakra-ui/react";
import { format, parseISO } from "date-fns";

// Utility function to convert date to words
const dateToWords = (dateString) => {
  const date = parseISO(dateString);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Convert day to ordinal (e.g., 1 -> First)
  const ordinalDay = (day) => {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1: return `${day}st`;
      case 2: return `${day}nd`;
      case 3: return `${day}rd`;
      default: return `${day}th`;
    }
  };

  // Convert year to words
  const yearToWords = (year) => {
    const thousands = Math.floor(year / 1000);
    const hundreds = Math.floor((year % 1000) / 100);
    const tens = year % 100;

    const ones = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen"
    ];
    const tensWords = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];

    let yearText = "";
    if (thousands > 0) {
      yearText += `${ones[thousands]} Thousand `;
    }
    if (hundreds > 0) {
      yearText += `${ones[hundreds]} Hundred `;
    }
    if (tens >= 20) {
      yearText += tensWords[Math.floor(tens / 10)];
      if (tens % 10 > 0) {
        yearText += `-${ones[tens % 10]}`;
      }
    } else if (tens > 0) {
      yearText += ones[tens];
    }

    return yearText.trim();
  };

  return `${ordinalDay(day)} ${month} ${yearToWords(year)}`;
};

// LinedField component for consistent formatting
const LinedField = ({ label, value }) => (
  <Box mb={2}>
    <Flex align="flex-start">
      <Text as="span" fontWeight="bold" minW="200px" mr={2}>
        {label}
      </Text>
      <Box
        flex="1"
        borderBottom="1px dotted black"
        pb="2px"
        whiteSpace="pre-line"
        fontSize="14px"
        lineHeight="1.1"
      >
        {value || "N/A"}
      </Box>
    </Flex>
  </Box>
);

export default function Tcformatpage({ printTcProps }) {
  // Format dates
  const admissionDate = printTcProps.admissionDate
    ? format(parseISO(printTcProps.admissionDate), "dd/MM/yyyy")
    : "N/A";
  const dob = printTcProps.dob
    ? format(parseISO(printTcProps.dob), "dd/MM/yyyy")
    : "N/A";
  const dobInWords = printTcProps.dob
    ? dateToWords(printTcProps.dob)
    : "N/A";

  // Determine category for Schedule Caste/Schedule Tribe
  const isSCorST = printTcProps.category && printTcProps.category !== "GENERAL" ? "Yes" : "No";

  return (
    <Box
      // w="210mm"
      // h="297mm"
      // p="7mm"
      // mx="auto"
      // bg="white"
      // color="black"
      // fontSize="14px"
      // fontFamily="Times New Roman, serif"
      // border="1px solid black"
      // boxShadow="0 0 10px rgba(0,0,0,0.1)"
      // position="relative"
      // overflow="hidden"
      // className="print-page"
    >
      {/* <style>
        {`
          @media print {
            .print-page {
              box-shadow: none;
              border: none;
              margin: 0;
              padding: 7mm;
            }
            @page {
              size: A4;
              margin: 0;
            }
          }
        `}
      </style> */}

      <SchoolHeader />

      <Divider borderColor="black" my={3} />

      {/* Title */}
      <Box 
        textAlign="center" 
        bg="gray.200" 
        fontWeight="bold" 
        py={2} 
        mb={3}
        border="1px solid black"
      >
        TRANSFER CERTIFICATE (TC)
      </Box>

      {/* Certificate Info */}
      <Flex justify="space-between" mb={4}>
        <Text>
          <b>Admission No:</b> {printTcProps.admissionNo || "N/A"}
        </Text>
      </Flex>

      {/* Body Content */}
      <Stack spacing={1}>
        <LinedField label="1. Name Of Pupil :" value={printTcProps.studentName} />
        <LinedField label="2. Mother's Name :" value={printTcProps.motherName} />
        <LinedField label="3. Father's Name :" value={printTcProps.fatherName} />
        <LinedField label="4. Nationality :" value="Indian" />
        <LinedField
          label="5. Whether the candidate belongs to Schedule Caste or Schedule Tribe :"
          value={isSCorST}
        />
        <LinedField
          label="6. Date of first admission in the school :"
          value={admissionDate}
        />
        <LinedField
          label="7. Date of Birth (in Christian Era) according to Admission Register (in Figures) :"
          value={dob}
        />
        <LinedField
          label="(In Words) :"
          value={dobInWords}
        />
        <LinedField
          label="8. Class In Which Pupil Last Studied :"
          value={`${printTcProps.class} - ${printTcProps.section}`}
        />
        <LinedField
          label="9. School/Board Annual Examination Last taken with result :"
          value={`${printTcProps.prevClass} - ${printTcProps.prevPercentmarks}%`}
        />
        <LinedField
          label="10. Promoted to Class :"
          value={printTcProps.class}
        />
        <LinedField
          label="11. Whether failed. if so once/twice in the same class :"
          value="NO"
        />
        <LinedField
          label="12. Any fee concession availed of, if so, the nature of such concession :"
          value="No"
        />
        <LinedField
          label="13. Subjects studied :"
          value="ENGLISH, HINDI, MATHS, SCIENCE, SOCIAL STUDIES, GENERAL KNOWLEDGE, SANSKRIT, COMPUTER, DRAWING, MORAL SCIENCE"
        />
        <LinedField label="14. Total number of working days :" value="0" />
        <LinedField
          label="15. Total number of working days present :"
          value="0"
        />
        <LinedField
          label="16. Whether NCC cadet/ Boy Scout/ Girl Guide (Detail is may be Given) :"
          value="No"
        />
        <LinedField label="17. General conduct :" value="Good" />
        <LinedField
          label="18. Games played/ Extracurricular activities in which the pupil usually part :"
          value="No"
        />
        <LinedField
          label="19. Date of issue of certificate :"
          value="01/06/2025"
        />
        <LinedField
          label="20. Date of application of Certificate :"
          value="27/03/2025"
        />
        <LinedField
          label="21. Reason for Leaving the school :"
          value="Take Admission in Another School"
        />
        <LinedField label="22. Any Other remarks :" value="N/A" />
      </Stack>

      {/* Footer */}
      <Flex 
        justify="space-between" 
        mt={6} 
        fontWeight="bold"
        position="absolute"
        bottom="20px"
        left="7mm"
        right="7mm"
      >
        <Text>Signature of Class Teacher</Text>
        <Box textAlign="center">
          <Text>Checked by</Text>
          <Text fontSize="sm">(State Full Name & Designation)</Text>
        </Box>
        <Text>Principal Signature & Seal</Text>
      </Flex>
    </Box>
  );
}