import {
  Box,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  Container,
  Image,
  TableContainer,
} from "@chakra-ui/react";

const Marksheet = () => {
  const tableData = [
    {
      subject: "Maths",
      F1: 3,
      F2: 5,
      F3: 2,
      F4: 5,
      F5: 4,
      F6: 1,
      totalFA: 20,
      coCurricular: 15,
      summative: 45,
      total: 80,
    },
    {
      subject: "English",
      F1: 5,
      F2: 5,
      F3: 5,
      F4: 5,
      F5: 5,
      F6: 5,
      totalFA: 30,
      coCurricular: 17,
      summative: 49,
      total: 96,
    },
    {
      subject: "Hindi",
      F1: 2,
      F2: 3,
      F3: 4,
      F4: 5,
      F5: 3,
      F6: 22,
      totalFA: 22,
      coCurricular: 12,
      summative: 33,
      total: 67,
    },
    {
      subject: "EVS",
      F1: 4,
      F2: 5,
      F3: 4,
      F4: 4,
      F5: 25,
      F6: 20,
      totalFA: 50,
      coCurricular: 50,
      summative: 50,
      total: 95,
    },
    {
      subject: "UOLO ACTIVITY",
      F1: "A",
      F2: "A",
      F3: "B",
      F4: "B",
      F5: "B",
      F6: "E",
      totalFA: "A",
      coCurricular: "B",
      summative: "A",
      total: "E",
    },
    {
      subject: "I.Q/COMP",
      F1: "C",
      F2: "D",
      F3: "A",
      F4: "B",
      F5: "B",
      F6: "D",
      totalFA: "C",
      coCurricular: "D",
      summative: "C",
      total: "D",
    },
  ];

  return (
    <Container
      maxW="container.md"
      p={5}
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
    >
      <Box p={5} m={5} rounded="md">
        <Flex
          justify="space-between"
          align="center"
          mb={2}
          borderBottom="2px"
          borderColor="gray.400"
          pb={3}
        >
          {/* Left Image */}
          <Image
            src="./assets/school-logo.png"
            alt="Left Logo"
            boxSize={{ base: "40px", md: "50px" }}
            objectFit="cover"
            mr={4}
          />

          {/* Center Text */}
          <VStack spacing={0} align="center">
            <Text
              fontSize={{ base: "sm", md: "2xl" }}
              fontWeight="bold"
              fontFamily="Arial, sans-serif"
              textAlign="center"
              lineHeight="short"
            >
              Nav Jagriti Niketan Hr. Sec. School
            </Text>
            <Text
              textAlign="center"
              fontSize={{ base: "xs", md: "sm" }}
              mt={0}
              fontWeight="bold"
            >
              Kharote More Kathua
            </Text>
          </VStack>

          <Image
            src="./assets/school-logo.png"
            alt="Right Logo"
            boxSize={{ base: "40px", md: "50px" }}
            objectFit="cover"
            ml={4}
          />
        </Flex>

        <VStack spacing={0} align="center">
          <Text fontWeight="bold" fontSize={{ base: "xx-small", md: "xs" }}>
            Academic Session: 2024-2025
          </Text>
          <Text fontSize={{ base: "xx-small", md: "xs" }} fontWeight="bold">
            Report Card for Class I
          </Text>
        </VStack>

        <Box>
          <Flex direction="column" width={{ base: "100%", md: "50%" }}>
            {[
              { label: "Admission No.", value: "U-11" },
              { label: "Student Name", value: "AMAN KUMAR" },
              { label: "Father Name", value: "DHANJAY" },
              { label: "Mother Name", value: "MAMTA DEVI" },
              { label: "Date of Birth", value: "25/08/2015" },
              { label: "Class/Section", value: "I / A" },
            ].map((item, index) => (
              <Flex
                direction="row"
                fontSize={{ base: "8px", md: "10px" }}
                mb={2}
                key={index}
              >
                <Box width={"40%"}>
                  <b>{item.label}</b>
                </Box>
                <Box>{item.value}</Box>
              </Flex>
            ))}
          </Flex>
        </Box>

        <Box overflowX="auto" mt={5}>
          <Table variant="simple" size="sm" border="1px" borderColor="black">
            <Thead>
              <Tr>
                <Th
                  colSpan={1}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                    padding: "0",
                  }}
                >
                  <Text fontSize="8px">Scholastic Areas</Text>
                </Th>
                <Th
                  colSpan={7}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                    padding: "0",
                  }}
                >
                  <Text fontSize="8px">Formative Assessment (30)</Text>
                </Th>
                <Th
                  colSpan={1}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                    padding: "0",
                  }}
                >
                  <Text fontSize="8px">Co-Curricular</Text>
                </Th>
                <Th
                  rowSpan={2}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                    padding: "0",
                  }}
                >
                  <Text fontSize="8px">Summative Assessment (50)</Text>
                </Th>
                <Th
                  rowSpan={2}
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                    padding: "0",
                  }}
                >
                  <Text fontSize="8px">Total (FA+CC+SA)</Text>
                </Th>
              </Tr>
              <Tr>
                <Th
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                    padding: "0",
                  }}
                >
                  <Text fontSize="8px">Sub Name</Text>
                </Th>
                <Th
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                    padding: "0",
                  }}
                >
                  <Text fontSize="8px">F1 (5)</Text>
                </Th>
                <Th
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                    padding: "0",
                  }}
                >
                  <Text fontSize="8px">F2 (5)</Text>
                </Th>
                <Th
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                    padding: "0",
                  }}
                >
                  <Text fontSize="8px">F3 (5)</Text>
                </Th>
                <Th
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                    padding: "0",
                  }}
                >
                  <Text fontSize="8px">F4 (5)</Text>
                </Th>
                <Th
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                    padding: "0",
                  }}
                >
                  <Text fontSize="8px">F5 (5)</Text>
                </Th>
                <Th
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                    padding: "0",
                  }}
                >
                  <Text fontSize="8px">F6 (5)</Text>
                </Th>
                <Th
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                    padding: "0",
                  }}
                >
                  <Text fontSize="8px">Total (30)</Text>
                </Th>
                <Th
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    textAlign: "center",
                    border: "1px solid black",
                    padding: "0",
                  }}
                >
                  <Text fontSize="8px">(20)</Text>
                </Th>
              </Tr>
            </Thead>

            <Tbody>
              {tableData.map((row, index) => (
                <Tr key={index}>
                  {Object.values(row).map((value, index) => (
                    <Td
                      key={index}
                      style={{
                        border: "1px solid black",
                      }}
                    >
                      <Text fontSize="8px">{value}</Text>
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Box mt={5} marginBottom={10}>
          <Text fontSize={"11px"}>
            <b>Class Teacher remarks :</b> ___________________________________
          </Text>
          <Text fontSize={"11px"}>
            <b>Final Result : </b>{" "}
            _______________________________________________
          </Text>
        </Box>
        <Flex
          justify="space-between"
          marginTop={10}
          alignItems={"end"}
          direction={{ base: "column", sm: "row" }} // Stack vertically on smaller screens
        >
          <Text fontSize={{ base: "8px", md: "9px" }}>
            <b>Place: </b>________________ <br />
            <b>Date: </b> ____________________
          </Text>
          <Text fontSize={{ base: "8px", md: "9px" }} mt={{ base: 2, sm: 0 }}>
            <b>Signature of Class Teacher</b>
          </Text>
          <Text fontSize={{ base: "8px", md: "9px" }} mt={{ base: 2, sm: 0 }}>
            <b>Signature of Principal</b>
          </Text>
        </Flex>

        <Box mt={5} borderTop="1px" borderColor="gray.300" pt={3}>
          <Text fontSize={{ base: "10px", md: "12px" }}>
            <b>Grading scale for scholastic areas:</b> Grades are awarded on a
            5-point grading scale as follows:
          </Text>
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center">
          <Box
            w={{ base: "100%", sm: "80%", md: "60%" }}
            maxW="800px"
            marginTop={"5"}
          >
            <Table
              size="xs"
              variant="simple"
              textAlign={"center"}
              border="1px solid black"
            >
              <Thead>
                <Tr>
                  <Th
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      textAlign: "center",
                      border: "1px solid black",
                    }}
                  >
                    <Text fontSize={{ base: "8px", md: "9px" }}>Grade</Text>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td style={{ border: "1px solid black" }}>
                    <Text
                      fontSize={{ base: "8px", md: "9px" }}
                      textAlign={"center"}
                    >
                      A
                    </Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td style={{ border: "1px solid black" }}>
                    <Text
                      fontSize={{ base: "8px", md: "9px" }}
                      textAlign={"center"}
                    >
                      B
                    </Text>
                  </Td>
                </Tr>
                <Tr>
                  <Td style={{ border: "1px solid black" }}>
                    <Text
                      fontSize={{ base: "8px", md: "9px" }}
                      textAlign={"center"}
                    >
                      C
                    </Text>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Marksheet;
