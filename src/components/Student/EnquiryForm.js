import { PageHeader } from "@/common/PageHeader";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { Box, Text, VStack, HStack, Grid, GridItem, Button } from "@chakra-ui/react";
import React from "react";
import { useReactToPrint } from "react-to-print";
function EnquiryForm() {
  const DottedLine = ({ width = "100%", children }) => (
    <Box
      borderBottom="1px dotted black"
      width={width}
      height="1.2em"
      display="inline-block"
    >
      {children}
    </Box>
  );
      const themeColor = getLocalStorageItem("themeColor") || "purple"
    const formEnquiry = React.useRef();
    const handlePrint = useReactToPrint({
      content: () => formEnquiry.current,
      pageStyle: `
          @page {
              size: A4 portrait;
              margin: 10mm; /* Ensure proper spacing */
          }
          * {
              font-family: Arial, sans-serif;
              font-size: 14px;
              line-height: 1.2;
          }
          .print-container {
              width: 100%;
              max-width: 780px;
              margin: auto;
              padding: 10px;
              border: 1px solid black;
          }
          .dotted-line {
              display: inline-block;
              width: 100px;
              border-bottom: 1px dashed black;
              text-align: center;
              vertical-align: middle;
          }
          .grid-container {
              display: grid;
              grid-template-columns: 200px 1fr;
              align-items: center;
          }
      `,
    });
  return (
    <Box h="90%">
      <PageHeader
        heading={"Enquiry List"}
        extra={
          <Button
            px={4}
            size={"sm"}
            colorScheme={themeColor}
            // isDisabled={selectedStudent?.length ? false : true}
            onClick={handlePrint}
          >
            Print
          </Button>
        }
      />
      <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
        <Box
        ref={formEnquiry} 
          width={{ base: "100%", md: "780px" }}
          mx="auto"
          p="4"
          border="1px solid black"
          fontSize="14px"
          lineHeight="1"
          fontFamily="Arial, sans-serif"
        >
          <VStack spacing="1" textAlign="center" mb="4">
            <Text fontSize="md" fontWeight="bold">
              SONY ACADEMY PUBLIC SENIOR SECONDARY SCHOOL
            </Text>
            <Text fontSize="xs">
              NIEMDA GATE BHARATPUR, BHARATPUR. HELPLINE: 7944115555
            </Text>
            <Text fontSize="xs">Session: 2024-2025</Text>
            <Text fontSize="md" fontWeight="bold">
              Enquiry Form
            </Text>
          </VStack>
          <HStack justifyContent="space-between" mb="4">
            <Box></Box>
            <HStack>
              <Text>Token No:</Text>
              <DottedLine width="60px">12345</DottedLine>
            </HStack>
          </HStack>
          <VStack align="stretch" spacing="4" mb="6">
            <Text fontWeight="bold">Student Details</Text>
            <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }}>
              <GridItem>
                <Text>Student Name:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>John Doe</DottedLine>
              </GridItem>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }}>
              <GridItem>
                <Text>Date of Birth:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>01/01/2010</DottedLine>
              </GridItem>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }}>
              <GridItem>
                <Text>Age Till 31st March:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>14</DottedLine>
              </GridItem>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }}>
              <GridItem>
                <Text>Address:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>123 Main St, Some City, Some State</DottedLine>
              </GridItem>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "200px 1fr 100px 1fr" }}>
              <GridItem>
                <Text>City:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>Sultanpur</DottedLine>
              </GridItem>
              <GridItem>
                <Text>State:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>Uttar Pradesh</DottedLine>
              </GridItem>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "200px 1fr 100px 1fr" }}>
              <GridItem>
                <Text>Pincode:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>123456</DottedLine>
              </GridItem>
              <GridItem>
                <Text>Reference By:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>Mr. A</DottedLine>
              </GridItem>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "200px 1fr 100px 1fr" }}>
              <GridItem>
                <Text>Counsellor:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>Ms. B</DottedLine>
              </GridItem>
              <GridItem>
                <Text>Entrance Test Result:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>85%</DottedLine>
              </GridItem>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "200px 1fr 100px 1fr" }}>
              <GridItem>
                <Text>Interested Standard:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>10th</DottedLine>
              </GridItem>
              <GridItem>
                <Text>Enquiry Origin:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>Online</DottedLine>
              </GridItem>
            </Grid>
          </VStack>
          <VStack align="stretch" spacing="4" mb="6">
            <Text fontWeight="bold">Parent/Guardian Details</Text>
            <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }}>
              <GridItem>
                <Text>Name:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>Jane Doe</DottedLine>
              </GridItem>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "200px 1fr 100px 1fr" }}>
              <GridItem>
                <Text>Occupation:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>Teacher</DottedLine>
              </GridItem>
              <GridItem>
                <Text>Contact:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>9876543210</DottedLine>
              </GridItem>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }}>
              <GridItem>
                <Text>Name:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>John Doe</DottedLine>
              </GridItem>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "200px 1fr 100px 1fr" }}>
              <GridItem>
                <Text>Occupation:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>Engineer</DottedLine>
              </GridItem>
              <GridItem>
                <Text>Contact:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>9876543211</DottedLine>
              </GridItem>
            </Grid>
          </VStack>
          <VStack align="stretch" spacing="4" mb="6">
            <Text fontWeight="bold">Previous School Details</Text>
            <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }}>
              <GridItem>
                <Text>Last School Name:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>ABC School</DottedLine>
              </GridItem>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "200px 1fr 100px 1fr" }}>
              <GridItem>
                <Text>Last Class:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>9th</DottedLine>
              </GridItem>
              <GridItem>
                <Text>Board:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>CBSE</DottedLine>
              </GridItem>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "200px 1fr 100px 1fr" }}>
              <GridItem>
                <Text>Percentage/Grade:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>90%</DottedLine>
              </GridItem>
              <GridItem>
                <Text>Last Result:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>Passed</DottedLine>
              </GridItem>
            </Grid>
          </VStack>
          <HStack justify="space-between" mt="10">
            <Text>Student Signature</Text>
            <Text>Parent/Guardian Signature</Text>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}

export default EnquiryForm;
