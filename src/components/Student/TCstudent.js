import { PageHeader } from "@/common/PageHeader";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import {
  Box,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  Button,
  Image,
} from "@chakra-ui/react";
import React from "react";
import { useReactToPrint } from "react-to-print";

function TCstudent() {
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
  const tccertificate = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => tccertificate.current,
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
        heading={"Transfer Certificate"}
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
          ref={tccertificate}
          width={{ base: "100%", md: "800px" }}
          mx="auto"
          p="2"
          border="1px solid black"
          fontSize="14px"
          lineHeight="1"
          fontFamily="Arial, sans-serif"
        >
          <HStack
            justify="space-between"
            align="center"
            mb="3"
            borderBottom="1px solid black"
          >
            <Box>
              <Image
                src="/assets/slogo1.jpg"
                alt="School Logo"
                boxSize="100px"
              />
            </Box>
            <Box textAlign="center">
              <Text fontSize="xsm" fontWeight="bold">
                (Affiliated to RAJASTHAN UNIVERSITY)
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="purple.600" mt={1}>
                paathshala Smart
              </Text>
              <Text fontSize="sm" mt={1}>
                HALENA, TEH.- WEIR, BHARATPUR (RAJ)
              </Text>
              <Text fontSize="xsm" mt={1}>
                Ph: 09414375436
              </Text>
              <Text
                fontSize="md"
                fontWeight="bold"
                mt={3}
                mb={2}
                color="purple.600"
              >
                Transfer Certificate (TC)
              </Text>
            </Box>

            <Box>
              <Image
                src="/assets/student_image.jpg"
                alt="School Logo"
                boxSize="100px"
              />
            </Box>
          </HStack>

          <HStack justify="space-between" align="center" mb="4">
            <Text fontSize="sm" mt={3}>
              Reg No :<strong>000000</strong>
            </Text>
            <Text fontSize="sm" mt={3}>
              Dise Code : <strong>989898</strong>
            </Text>
          </HStack>
          <HStack justifyContent="space-between" mb="2">
            <Box></Box>
            <HStack>
              <Text>TC No:</Text>
              <DottedLine width="60px">
                <strong>12345</strong>
              </DottedLine>
            </HStack>
          </HStack>

          <VStack align="stretch" spacing="4" mb="6">
            <Grid templateColumns={{ base: "1fr", md: "250px 2fr" }}>
              <GridItem>
                <Text>Certified That</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>Sneha sinha</strong>
                </DottedLine>
              </GridItem>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }}>
              <GridItem>
                <Text>Son/Daughter of Father&apos;s Name</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>Sachidev Sinha</strong>
                </DottedLine>
              </GridItem>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }}>
              <GridItem>
                <Text>Mother&apos;s Name </Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>Sunaina Sinha</strong>
                </DottedLine>
              </GridItem>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }}>
              <GridItem>
                <Text>Resident of</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>NOT</strong>
                </DottedLine>
              </GridItem>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }}>
              <GridItem>
                <Text>Date of birth ( In Words)</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>Ninth May Two Thousand Eighteen</strong>
                </DottedLine>
              </GridItem>
            </Grid>
          </VStack>

          <VStack align="stretch" spacing="4" mb="6">
            <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }}>
              <GridItem>
                <Text>Dob in Figures</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>09/05/2018</strong>
                </DottedLine>
              </GridItem>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }}>
              <GridItem>
                <Text>Joined that school/college in Class</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>1st</strong>
                </DottedLine>
              </GridItem>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "250px 1fr 130px 1fr" }}>
              <GridItem>
                <Text>on date:</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>01/04/2023</strong>
                </DottedLine>
              </GridItem>
              <GridItem>
                <Text>vide Admission no</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>35111</strong>
                </DottedLine>
              </GridItem>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "250px 1fr 60px 1fr" }}>
              <GridItem>
                <Text>and Left From Class</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>1st</strong>
                </DottedLine>
              </GridItem>
              <GridItem>
                <Text>on date</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>19/12/2024</strong>
                </DottedLine>
              </GridItem>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }}>
              <GridItem>
                <Text>In Order to</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>fhbftjfgc</strong>
                </DottedLine>
              </GridItem>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }}>
              <GridItem>
                <Text>
                  His/Her Conduct as for as know to the undersigned was
                </Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>Good</strong>
                </DottedLine>
              </GridItem>
            </Grid>
            <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }}>
              <GridItem>
                <Text>He / She has paid all school/college dues</Text>
              </GridItem>
              <GridItem>
                <DottedLine>
                  <strong>YES/No</strong>
                </DottedLine>
              </GridItem>
            </Grid>
          </VStack>

          <HStack justify="space-between" mt="10">
            <Text>Tc Issue Date : - 03/01/2025 </Text>
            <Text>Headmaster/Principal/Headmistress</Text>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}

export default TCstudent;
