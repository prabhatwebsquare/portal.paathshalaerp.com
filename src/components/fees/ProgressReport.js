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

const ProgressReport = () => {
  return (
    <Box
      maxW="900px"
      mx="auto"
      p="4"
      border="2px solid black"
      bg="white"
      boxShadow="lg"
    >
      <Flex justify="space-between" align="center" mb="4">
        <Image src="/assets/slogo1.jpg" alt="School Logo" boxSize="80px" />
        <Box textAlign="center">
          <Text fontSize="lg" fontWeight="bold" color="purple.600">
            paathshala Smart
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            (Affiliated to RAJASTHAN UNIVERSITY)
          </Text>
          <Text fontSize="sm" fontWeight="bold" color="purple.600">
            HALENA, TEH- WEIR, BHARATPUR (RAJ.)
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm">
            DISE CODE: <b>999898</b>
          </Text>
          <Text fontSize="sm">
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
        PROGRESS REPORT : 2024-2025
      </Text>

      <Box border="1px solid black" p="2" my="4">
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
              Class: <strong>1st (Common)</strong>
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
              Faculty: <strong>Common/ Section C</strong>
            </Text>
          </Box>
          <Image
            src="/assets/student_image.jpg"
            alt="Student Photo"
            boxSize="80px"
            borderRadius="md"
          />
        </Flex>
      </Box>

      <Table variant="simple" size="sm" border="1px solid black">
        <Thead bg="gray.200">
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
      <Box my="4" p="2" border="1px solid black">
        <Flex justify="space-between">
          <Box>
            <Text fontSize="sm">
              Result: <strong>Pass</strong>
            </Text>
            <Text fontSize="sm">
              Attendance: <strong>12 Out of 18</strong>
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm">
              No. of Students: <strong>200</strong>
            </Text>
            <Text fontSize="sm">
              Percentage: <strong>90</strong>
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm">
              Rank in Class: <strong>1</strong>
            </Text>
            <Text fontSize="sm">
              Overall Grade: <strong>A</strong>
            </Text>
          </Box>
        </Flex>
      </Box>
      <Flex justify="space-between" my="4">
        <Text fontSize="sm">Class Teacher Signature</Text>
        <Text fontSize="sm">Exam Incharge Signature</Text>
        <Text fontSize="sm">Principal Signature</Text>
      </Flex>
    </Box>
  );
};

export default ProgressReport;
