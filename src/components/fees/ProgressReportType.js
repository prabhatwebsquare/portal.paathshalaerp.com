import Progressreport from "@/pages/fees/Progressreport";
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

const ProgressReportType = () => {
  return (
    <Box
      width="794px"
      // height="1123px"
      height="auto"
      mx="auto"
      p="6"
      border="2px solid black"
      bg="white"
      boxShadow="xl"
    >
      <Flex justify="space-between" align="center" mb="6">
        <Image src="/assets/slogo1.jpg" alt="School Logo" boxSize="100px" />
        <Box textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" color="purple.600">
            Paathshala Smart
          </Text>
          <Text fontSize="md" fontWeight="bold">
            (Affiliated to RAJASTHAN UNIVERSITY)
          </Text>
          <Text fontSize="md" fontWeight="bold" color="purple.600">
            HALENA, TEH- WEIR, BHARATPUR (RAJ.)
          </Text>
        </Box>
        <Box textAlign="right">
          <Text fontSize="md">
            DISE CODE: <b>999898</b>
          </Text>
          <Text fontSize="md">
            Reg No: <b>00000</b>
          </Text>
        </Box>
      </Flex>

      <Text
        fontSize="1xl"
        fontWeight="bold"
        textAlign="center"
        bg="purple.500"
        color="white"
        py="1"
        borderRadius="md"
      >
        ANNUAL PROGRESS REPORT : 2024-2025
      </Text>
      <Box border="1px solid black" p="3" my="4">
        <Flex justify="space-between">
          <Box>
            <Text fontSize="sm">
              SR No.: <strong>216</strong>
            </Text>
            <Text fontSize="sm">
              Name: <strong>Komal Dubey</strong>
            </Text>
            <Text fontSize="sm">
              Mother&apos;s Name: <strong>Misses Sanju Dubey</strong>
            </Text>
            <Text fontSize="sm">
              Class: <strong>1st (Commmon)</strong>
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm">
              Roll No.: <strong>21</strong>
            </Text>
            <Text fontSize="sm">
              Father&apos;s Name: <strong>Mr. Suresh Dubey</strong>
            </Text>
            <Text fontSize="sm">
              Date of Birth: <strong>31/07/2003</strong>
            </Text>
            <Text fontSize="sm">
              Faculty: <strong>Common / Section C</strong>
            </Text>
          </Box>
          <Image
            src="/assets/student_image.jpg"
            alt="Student Photo"
            boxSize="100px"
            borderRadius="md"
          />
        </Flex>
      </Box>

      <Table variant="simple" size="md" border="1px solid black">
        <Thead bg="gray.300">
          <Tr>
            <Th>SUBJECT NAME</Th>
            <Th>FIRST TEST</Th>
            <Th>SECOND TEST</Th>
            <Th>HALF YEARLY EXAM</Th>
            <Th>THIRD TEST</Th>
            <Th>ANNUAL EXAM</Th>
            <Th>GRADE</Th>
            <Th>TOTAL</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>MARKS</Td>
            <Td>50</Td>
            <Td>100</Td>
            <Td>100</Td>
            <Td>99</Td>
            <Td>60</Td>
            <Td>A</Td>
            <Td>409</Td>
          </Tr>
          <Tr>
            <Td>ENGLISH</Td>
            <Td>98</Td>
            <Td>95</Td>
            <Td>70</Td>
            <Td>75</Td>
            <Td>80</Td>
            <Td>A</Td>
            <Td>418</Td>
          </Tr>
          <Tr>
            <Td>HINDI</Td>
            <Td>75</Td>
            <Td>87</Td>
            <Td>79</Td>
            <Td>91</Td>
            <Td>85</Td>
            <Td>A</Td>
            <Td>417</Td>
          </Tr>
          <Tr>
            <Td>MATHS</Td>
            <Td>79</Td>
            <Td>88</Td>
            <Td>98</Td>
            <Td>80</Td>
            <Td>69</Td>
            <Td>A</Td>
            <Td>414</Td>
          </Tr>
          <Tr bg="purple.200" fontWeight="bold">
            <Td>GRAND TOTAL</Td>
            <Td>90</Td>
            <Td>100</Td>
            <Td>80</Td>
            <Td>77</Td>
            <Td>60</Td>
            <Td>A</Td>
            <Td>407</Td>
          </Tr>
          <Tr>
            <Td>Computer</Td>
            <Td>90</Td>
            <Td>100</Td>
            <Td>83</Td>
            <Td>97</Td>
            <Td>65</Td>
            <Td>A</Td>
            <Td>435</Td>
          </Tr>
        </Tbody>
      </Table>

      <Box my="6" p="4" border="1px solid black">
        <Flex justify="space-between">
          <Box>
            <Text fontSize="md">
              Result: <strong>Pass</strong>
            </Text>
            <Text fontSize="md">
              Attendance: <strong>12 Out of 18</strong>
            </Text>
          </Box>
          <Box>
            <Text fontSize="md">
              No. of Students: <strong>200</strong>
            </Text>
            <Text fontSize="md">
              Percentage: <strong>90%</strong>
            </Text>
          </Box>
          <Box>
            <Text fontSize="md">
              Rank in Class: <strong>1</strong>
            </Text>
            <Text fontSize="md">
              Overall Grade: <strong>A</strong>
            </Text>
          </Box>
        </Flex>
      </Box>
      <Box
        fontSize="1xl"
        textAlign="center"
        bg="purple.300"
        color="black"
        py="1"
        borderRadius="md"
      >
        60.00 To 100.00 = A &nbsp;&nbsp; 45.00 To 59.99 = B &nbsp;&nbsp; 36.00
        To 44.99 = C &nbsp;&nbsp; 0.00 To 35.99 = D<br></br>60.00 To 100.00 = A
        &nbsp;&nbsp; 45.00 To 59.99 = B &nbsp;&nbsp; 36.00 To 44.99 = C
        &nbsp;&nbsp; 0.00 To 35.99 = D
      </Box>
      <Flex justify="space-between" my="6">
        <Text fontSize="md">Class Teacher Signature</Text>
        <Text fontSize="md">Exam Incharge Signature</Text>
        <Text fontSize="md">Principal Signature</Text>
      </Flex>
    </Box>
  );
};

export default ProgressReportType;
