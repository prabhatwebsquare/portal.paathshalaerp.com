import {
    Box,
    VStack,
    HStack,
    Text,
    Grid,
    GridItem,
    Divider,
  } from "@chakra-ui/react";
  
  function DottedLine({ width, children }) {
    return (
      <Box
        as="span"
        display="inline-block"
        width={width || "90%"}
        borderBottom="1px dotted black"
        pb="2px"
        mx="2"
      >
        {children}
      </Box>
    );
  }
  export default function AdmissionForm() {
    return (
      <Box
        width={{ base: "100%", md: "700px" }}
        mx="auto"
        p="6"
        bg="white"
        border="1px solid black"
        fontSize="14px"
        lineHeight="1.6"
        fontFamily="Arial, sans-serif"
      >
        <HStack justify="space-between" align="center" mb={4}> 
          <Box>
            <img src="/assets/slogo1.jpg" alt="School Logo" width="100px" />
          </Box>
          <VStack spacing={0} textAlign="center">
            <Text fontSize="lg" fontWeight="bold">
              SONY ACADEMY PUBLIC
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="blue.800">
              SENIOR SECONDARY SCHOOL
            </Text>
            <Text fontSize="sm">Registration No: ______________________</Text>
          </VStack>
          <Box width="100px" height="100px" border="1px solid black" />
        </HStack>
  
        <Box textAlign="center" bg="blue.800" color="white" py={0} fontWeight="bold" mb={6}>
          <Text fontSize="lg">ADMISSION FORM</Text>
        </Box>
        <VStack align="stretch" spacing="4" mb="6">
          <Text fontWeight="bold" color="blue.800">
            Student Information
          </Text>
          <Grid templateColumns="200px 1fr" gap="2">
            <GridItem>
              <Text>Sr No:</Text>
            </GridItem>
            <GridItem>
              <DottedLine>001</DottedLine>
            </GridItem>
            <GridItem>
              <Text>Admission Date:</Text>
            </GridItem>
            <GridItem>
              <DottedLine>20/01/2025</DottedLine>
            </GridItem>
  
            <GridItem>
              <Text>Admission No:</Text>
            </GridItem>
            <GridItem>
              <DottedLine>12345</DottedLine>
            </GridItem>
  
            <GridItem>
              <Text>Form No:</Text>
            </GridItem>
            <GridItem>
              <DottedLine>56789</DottedLine>
            </GridItem>
  
            <GridItem>
              <Text>Student Name:</Text>
            </GridItem>
            <GridItem>
              <DottedLine>John Doe</DottedLine>
            </GridItem>
  
            <GridItem>
              <Text>Date of Birth:</Text>
            </GridItem>
            <GridItem>
              <DottedLine>01/01/2010</DottedLine>
            </GridItem>
  
            <GridItem>
              <Text>Aadhar No:</Text>
            </GridItem>
            <GridItem>
              <DottedLine>1234-5678-9012</DottedLine>
            </GridItem>
  
            <GridItem>
              <Text>Gender:</Text>
            </GridItem>
            <GridItem>
              <DottedLine>Male</DottedLine>
            </GridItem>
  
            <GridItem>
              <Text>Class:</Text>
            </GridItem>
            <GridItem>
              <DottedLine>10th</DottedLine>
            </GridItem>
            <GridItem>
              <Text>Stream:</Text>
            </GridItem>
            <GridItem>
              <DottedLine>Science</DottedLine>
            </GridItem>
            <GridItem>
              <Text>Section:</Text>
            </GridItem>
            <GridItem>
              <DottedLine>A</DottedLine>
            </GridItem>
          </Grid>
        </VStack>
        <VStack align="stretch" spacing="4" mb="6">
          <Text fontWeight="bold" color="blue.800">
            Parent Details
          </Text>
          <Grid templateColumns="200px 1fr" gap="2">
            <GridItem>
              <Text>Father Name:</Text>
            </GridItem>
            <GridItem>
              <DottedLine>Mr. John Doe Sr.</DottedLine>
            </GridItem>
  
            <GridItem>
              <Text>Father Contact:</Text>
            </GridItem>
            <GridItem>
              <DottedLine>9876543210</DottedLine>
            </GridItem>
  
            <GridItem>
              <Text>Mother Name:</Text>
            </GridItem>
            <GridItem>
              <DottedLine>Mrs. Jane Doe</DottedLine>
            </GridItem>
            <GridItem>
              <Text>Address:</Text>
            </GridItem>
            <GridItem>
              <DottedLine>123 Main St, Some City, Some State</DottedLine>
            </GridItem>
          </Grid>
        </VStack>
        <HStack justify="space-between" mt="10">
          <Text>Principal Signature</Text>
        </HStack>

      </Box>
    );
  }
  