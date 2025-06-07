'use client';

import { PageHeader } from "@/common/PageHeader";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { Box, Text, VStack, HStack, Grid, GridItem, Button, Image } from "@chakra-ui/react";
import React from "react";
import { useReactToPrint } from "react-to-print";

function GatePass() {
  const DottedLine = ({ width = "100%", children }) => (
    <Box
      borderBottom="1px dotted black"
      width={width}
      height="1em"
      display="inline-block"
    >
      {children}
    </Box>
  );

  const themeColor = getLocalStorageItem("themeColor") || "purple";
  const gatePassRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => gatePassRef.current,
    pageStyle: `
      @page {
          size: A4 portrait;
          margin: 10mm;
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
    `,
  });

  return (
    <Box h="90%">
      <PageHeader
        heading={"Gate Pass"}
        extra={
          <Button
            px={4}
            size={"sm"}
            colorScheme={themeColor}
            onClick={handlePrint}
          >
            Print
          </Button>
        }
      />
      <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
        <Box
          ref={gatePassRef}
          width={{ base: "100%", md: "800px" }}
          mx="auto"
        //   p="2"
          border="1px solid black"
          fontSize="14px"
          lineHeight="1"
          fontFamily="Arial, sans-serif"
        >
          <HStack  align="center" mb="2" borderBottom="1px solid black">
            <Box>
              <Image
                src="/assets/slogo1.jpg"
                alt="School Logo"
                boxSize="100px"
                ml={18}
              />
            </Box>
            <Box textAlign="center" justify="center" ml={20}>
              <Text fontSize="xsm">
                (Affiliated to RAJASTHAN UNIVERSITY)
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="purple.600" mt={1} >
                paathshala Smart
              </Text>
              <Text fontSize="sm" mt={1}>
                HALENA, TEH.- WEIR, BHARATPUR (RAJ)   Ph: 09414375436
              </Text>
              <Text fontSize="md" fontWeight="bold" mt={3}  color="purple.600">
                Gate Pass
              </Text>
            </Box>
            
          </HStack>

          <HStack justify="space-between" align="center" mb="2" p={2}>
            <Text fontSize="sm" >
              Gate Pass No : <strong><u>GP12345</u></strong>
            </Text>
            <Text fontSize="sm" mt={1}>
              Date : <strong><u>03/02/2025</u></strong>
            </Text>
          </HStack>

          <VStack align="stretch" spacing="4" mb="4" p={2} letterSpacing={0.8} lineHeight={0.7}>
            <Grid templateColumns={{ base: "1fr", md: "250px 2fr" }}>
              <GridItem>
                <Text>Name</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>Sneha Sinha</strong>
                </DottedLine>
              </GridItem>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }}>
              <GridItem>
                <Text>Designation (Student/Teacher)</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>Student</strong>
                </DottedLine>
              </GridItem>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }}>
              <GridItem>
                <Text>ID Number</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>35111</strong>
                </DottedLine>
              </GridItem>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }}>
              <GridItem>
                <Text>Department/Class</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>10th Grade</strong>
                </DottedLine>
              </GridItem>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }}>
              <GridItem>
                <Text>Reason for Exit</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>Medical Appointment</strong>
                </DottedLine>
              </GridItem>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }}>
              <GridItem>
                <Text>Exit Time</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>10:30 AM</strong>
                </DottedLine>
              </GridItem>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }}>
              <GridItem>
                <Text>Expected Return Time</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>1:00 PM</strong>
                </DottedLine>
              </GridItem>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }}>
              <GridItem>
                <Text>Approved By</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>Principal</strong>
                </DottedLine>
              </GridItem>
            </Grid>
          </VStack>
          <HStack justify="space-between" mt="3" mb={8} p={2}>
            <Text>Issued By: <strong><u>Admin Office</u></strong></Text>
            <Text><strong>Signature of Approver</strong></Text>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}

export default GatePass;
