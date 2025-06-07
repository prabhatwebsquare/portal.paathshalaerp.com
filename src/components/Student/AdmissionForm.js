/* eslint-disable @next/next/no-img-element */
import { URL } from "@/services/apis";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import {
  Box,
  VStack,
  HStack,
  Text,
  Grid,
  GridItem,
  Divider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

// function DottedLine({ width, children }) {
//   return (
//     <Box
//       as="span"
//       display="inline-block"
//       width={width || "90%"}
//       borderBottom="1px dotted black"
//       pb="2px"
//       mx="2"
//     >
//       {children}
//     </Box>
//   );
// }

function DottedLine({ width, children, type }) {
  // Define number of boxes based on type
  const getBoxCount = () => {
    switch(type) {
      case 'name':
        return 24; 
      case 'address':
        return 45;
      case 'fatherName':
        return 16;
      case 'fatherContact':
        return 12;
      case 'motherName':
        return 16;
      case 'motherContact':
        return 12;
case 'aadhar':
        return 12;
      case 'gender':
        return 7;
      case 'class':
        return 5;
      case 'stream':
        return 7;
      case 'section':
        return 5;
        
      default:
        return 15;
    }
  };

  // For address type, split into 3 rows of 15 boxes each
  if (type === 'address') {
    return (
      <VStack align="flex-start" spacing={1} width={width || "90%"} mx="2">
        {[0, 1, 2].map(row => (
          <Box key={row} display="flex">
            {[...Array(15)].map((_, index) => (
              <Box
                key={index}
                width="30px"
                height="30px"
                border="1px solid black"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="0.5px"
                fontWeight={800}
              >
                {children?.[row * 15 + index] || ''}
              </Box>
            ))}
          </Box>
        ))}
      </VStack>
    );
  }
  if (type === 'name') {
    return (
      <VStack align="flex-start" spacing={1} width={width || "90%"} mx="2">
        {[0, 1].map(row => (
          <Box key={row} display="flex">
            {[...Array(15)].map((_, index) => (
              <Box
                key={index}
                width="30px"
                height="30px"
                border="1px solid black"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="0.5px"
                fontWeight={800}
              >
                {children?.[row * 15 + index] || ''}
              </Box>
            ))}
          </Box>
        ))}
      </VStack>
    );
  }
  // For other types, single row with dynamic box count
  return (
    <Box
      display="flex"
      width={width || "90%"}
      mx="2"
    >
      {[...Array(getBoxCount())].map((_, index) => (
        <Box
          key={index}
          width="30px"
          height="30px"
          border="1px solid black"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mx="0.5px"
          fontWeight={800}
        >
          {children?.[index] || ''}
        </Box>
      ))}
    </Box>
  );
}

export default function AdmissionForm({ themeColor, sessionMasterId, data, closeDrawer }) {
  const school = getLocalStorageItem("user");
  return (
    <Drawer isOpen={true} placement="right" size="xl" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Admission Form</DrawerHeader>
        <DrawerBody>
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
              <Text fontSize="2xl" fontWeight="bold" color="blue.800">
         
                  {school?.userData.name}
                </Text>
                <Text fontSize="md" fontWeight="bold">
             {school.schoolData.address}   {school.schoolData.district}  {school.schoolData.state} - {school.schoolData.mobileNo}
                </Text>
                {/* <Text fontSize="sm">Registration No: {data?.apparId || "______________________"}</Text> */}
              </VStack>
              <Box width="100px" height="100px">
                <img src={URL + data?.student_master?.photo || "/assets/student.png"} alt="Student Photo" width="100%" height="100%" style={{objectFit: "cover"}} />
              </Box>
            </HStack>

            <Box textAlign="center" bg="blue.800" color="white" py={0} fontWeight="bold" mb={6}>
              <Text fontSize="lg">ADMISSION FORM</Text>
            </Box>
            <VStack align="stretch" spacing="4" mb="6">
              <Text fontWeight="bold" color="blue.800">
                Student Information
              </Text>
              <Grid templateColumns="150px 1fr" gap="2">
               
                <GridItem>
                  <Text>Admission Date:</Text>
                </GridItem>
                <GridItem>
                  <DottedLine>{new Date(data?.student_master?.admissionDate).toLocaleDateString() || ""}</DottedLine>
                </GridItem>
                <GridItem>
                  <Text>Admission No:</Text>
                </GridItem>
                <GridItem>
                  <DottedLine>{data?.student_master?.admissionNo || ""}</DottedLine>
                </GridItem>
                <GridItem>
                  <Text>Form No:</Text>
                </GridItem>
                <GridItem>
                  <DottedLine>{data?.student_master?.formNo || ""}</DottedLine>
                </GridItem>
                <GridItem>
                  <Text>Sr No:</Text>
                </GridItem>
                <GridItem>
                  <DottedLine>{data?.srNo || "001"}</DottedLine>
                </GridItem>
                

                

                <GridItem>
                  <Text>Student Name:</Text>
                </GridItem>
                <GridItem>
                  <DottedLine type="name">{data?.student_master?.studentName || ""}</DottedLine>
                </GridItem>

                <GridItem>
                  <Text>Date of Birth:</Text>
                </GridItem>
                <GridItem>
                  <DottedLine type="dob">{new Date(data?.student_master?.dob).toLocaleDateString() || ""}</DottedLine>
                </GridItem>

                <GridItem>
                  <Text>Aadhar No:</Text>
                </GridItem>
                <GridItem>
                  <DottedLine type="aadhar">{data?.student_master?.aadharNo || ""}</DottedLine>
                </GridItem>

                <GridItem>
                  <Text>Gender:</Text>
                </GridItem>
                <GridItem>
                  <DottedLine type="gender">{data?.student_master?.gender || ""}</DottedLine>
                </GridItem>

                <GridItem>
                  <Text>Class:</Text>
                </GridItem>
                <GridItem>
                  <DottedLine type="class">{data?.class_master?.name || ""}</DottedLine>
                </GridItem>
                <GridItem>
                  <Text>Stream:</Text>
                </GridItem>
                <GridItem>
                  <DottedLine type="stream">{data?.stream_master?.name || ""}</DottedLine>
                </GridItem>
                <GridItem>
                  <Text>Section:</Text>
                </GridItem>
                <GridItem>
                  <DottedLine type="section">{data?.section_master?.name || ""}</DottedLine>
                </GridItem>
              </Grid>
            </VStack>
            <VStack align="stretch" spacing="4" mb="6">
              <Text fontWeight="bold" color="blue.800">
                Parent Details
              </Text>
              <Grid templateColumns="150px 1fr" gap="2">
                <GridItem>
                  <Text>Father Name:</Text>
                </GridItem>
                <GridItem>
                  <DottedLine type="fatherName">{data?.student_master?.fatherName || ""}</DottedLine>
                </GridItem>

                <GridItem>
                  <Text>Father Contact:</Text>
                </GridItem>
                <GridItem>
                  <DottedLine type="fatherContact">{data?.student_master?.fatherContact || ""}</DottedLine>
                </GridItem>

                <GridItem>
                  <Text>Mother Name:</Text>
                </GridItem>
                <GridItem>
                  <DottedLine type="motherName">{data?.student_master?.motherName || ""}</DottedLine>
                </GridItem>
                <GridItem>
                  <Text>Mother Contact:</Text>
                </GridItem>
                <GridItem>
                  <DottedLine type="motherContact">{data?.student_master?.motherContact || ""}</DottedLine>
                </GridItem>
                <GridItem>
                  <Text>Address:</Text>
                </GridItem>
                <GridItem>
                  <DottedLine type="address">{data?.student_master?.address || ""}</DottedLine>
                </GridItem>
              </Grid>
            </VStack>
            <HStack justify="space-between" mt="10">
              <Text>Principal Signature</Text>
            </HStack>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}