import {
    Box,
    Grid,
    GridItem,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    VStack,
    Flex,
  } from "@chakra-ui/react";
  
  function ScholarRegister() {
    return (
      <Box
        width="210mm"
        height="297mm"
        margin="auto"
        border="2px solid black"
        fontFamily="Arial, sans-serif"
        fontSize="12px"
        lineHeight="1.5"
        p={4}
      >
        <VStack spacing={0} textAlign="center" mb={4}>
          <Text fontSize="18px" fontWeight="bold" color="purple.600">
            paathshala Smart
          </Text>
          <Text fontSize="10px" fontWeight="bold">
            HALENA, TEH.- WEIR, BHARATPUR (RAJ) Phone No: 09414375436
          </Text>
        </VStack>
  
        <Text textAlign="center" fontWeight="bold" fontSize="16px" mb={2}>
          Scholar Register (SR Sheet)
        </Text>
  
        <Grid templateColumns="repeat(3, 1fr)" border="1px solid black" mb={4} font>
          <GridItem borderRight="1px solid black" p={2}>
            <Text>Affiliation No : 989898</Text>
          </GridItem>
          <GridItem borderRight="1px solid black" p={2}>
            <Text textAlign="center">Disc Code : 989898</Text>
          </GridItem>
          <GridItem p={2}>
            <Text textAlign="right">SCHOLAR REGISTER : 2</Text>
          </GridItem>
        </Grid>
  
        <Box mb={2} border="1px solid black">
          <Text
            fontWeight="bold"
            textAlign="center"
            borderBottom="1px solid black"
          >
            RECORD (A)
          </Text>
          <Table variant="simple" size="sm" border="1px solid black" >
            <Thead >
              <Tr >
                <Th fontWeight="bold" bg="transparent"  >Date of Admission</Th>
                <Th fontWeight="bold" bg="transparent">Date of Removal</Th>
                <Th fontWeight="bold" bg="transparent">Cause of Removal</Th>
              </Tr>
            </Thead>
            <Tbody>
              {[...Array(5)].map((_, index) => (
                <Tr key={index}>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
  
        <Box mb={2} border="1px solid black">
          <Text
            fontWeight="bold"
            textAlign="center"
            borderBottom="1px solid black"
          >
            RECORD (B)
          </Text>
          <Table variant="simple" size="sm" border="1px solid black">
            <Thead>
              <Tr>
                <Th fontWeight="bold" bg="transparent">Name of Scholar & Religion</Th>
                <Th fontWeight="bold" bg="transparent">Age at Date of First Admission</Th>
                <Th fontWeight="bold" bg="transparent">
                  Name, Address & Occupation of Father’s or Guardian
                </Th>
                <Th fontWeight="bold" bg="transparent">
                  The last School, if any, which the scholar attended before
                  joining the school
                </Th>
                <Th fontWeight="bold" bg="transparent">
                  The highest class from which the scholar was promoted or was fit
                  for promotion on leaving his last school
                </Th>
                <Th fontWeight="bold" bg="transparent">Date of Marriage, if married</Th>
              </Tr>
            </Thead>
            <Tbody>
              {[...Array(8)].map((_, index) => (
                <Tr key={index}>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Box borderTop="1px solid black" p={2}>
            <Text>
              Date of Birth: 01/01/2022 First January Two Thousand Twenty Two
            </Text>
            <Text></Text>
          </Box>
        </Box>
        <Box border="1px solid black">
          <Grid templateColumns="repeat(2, 1fr)">
            <GridItem borderRight="1px solid black">
              <Text
                fontWeight="bold"
                textAlign="center"
                borderBottom="1px solid black"
              >
                RECORD (C)
              </Text>
              <Table variant="simple" size="sm" border="1px solid black">
                <Thead>
                  <Tr>
                    <Th bg="transparent">Class</Th>
                    <Th bg="transparent">Date</Th>
                    <Th bg="transparent">Passing Standard of Class from this School</Th>
                    <Th bg="transparent">Number of School Meetings</Th>
                    <Th bg="transparent">Number of School Meetings at Which Present</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {[...Array(15)].map((_, index) => (
                    <Tr key={index}>
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </GridItem>
  
            <GridItem>
              <Text
                fontWeight="bold"
                textAlign="center"
                borderBottom="1px solid black"
              >
                RECORD (D)
              </Text>
              <Table variant="simple" size="sm" border="1px solid black">
                <Thead>
                  <Tr>
                    <Th bg="transparent">Number of Scholars in Class</Th>
                    <Th bg="transparent">Place as Shown by Final Examination in Class</Th>
                    <Th bg="transparent">Subjects Taken</Th>
                    <Th bg="transparent">Conduct and Work During School Year</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {[...Array(15)].map((_, index) => (
                    <Tr key={index}>
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </GridItem>
          </Grid>
        </Box>
        <Text mt={3}>
          This is certified that this Student Register is completed with
          information till the leaving date of school according Education
          Department Certified that there is no due fees for this student.
        </Text>
        <Flex justifyContent={"space-between"} mt={5} fontWeight="bold">
          <Text>Date</Text>
          <Text>Copy Given / Sent Through Post </Text>
          <Text>Initials of the Head of the Institution </Text>
        </Flex>
      </Box>
    );
  }
  
  export default ScholarRegister;
  