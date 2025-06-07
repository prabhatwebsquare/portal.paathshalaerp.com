import { FILE_URL } from "@/services/apis";
import { Box, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";

const TransportPasses = ({ allData }) => {
  const collegeLogo = "https://i.pinimg.com/474x/81/50/35/815035e3fcb3bfb7b5aa4f36ff683a01.jpg";
  const busImage = "https://cms.eichertrucksandbuses.com/uploads/ib/exterior/SKYLINE_20.15_SCHOOL_BUS3.png";
  
  // Gradient colors for the pass
  const passGradient = "linear-gradient(135deg, #1a365d 0%, #153e75 50%, #1a365d 100%)";
  const accentColor = "#FFD700"; // Gold accent color

  return (
    <Box>
      {allData.map((data, index) => (
        <Flex key={index} justify="center" align="center" p={4} mb={4}>
          <Box
            w="380px"
            h="280px"
            bg={passGradient}
            borderRadius="lg"
            p={4}
            boxShadow="xl"
            position="relative"
            overflow="hidden"
            color="white"
            border={`2px solid ${accentColor}`}
          >
            {/* Decorative elements */}
            <Box
              position="absolute"
              top="-50px"
              right="-50px"
              w="150px"
              h="150px"
              borderRadius="full"
              bg="rgba(255, 215, 0, 0.1)"
              border={`1px solid ${accentColor}`}
            />
            
            {/* Header */}
            <Flex justify="space-between" align="center" mb={3}>
              <Image 
                src={collegeLogo} 
                alt="College Logo" 
                boxSize="60px" 
                border={`2px solid ${accentColor}`}
                borderRadius="md"
                p={1}
                bg="white"
              />
              
              <VStack spacing={0} textAlign="center">
                <Text 
                  fontWeight="extrabold" 
                  fontSize="14px" 
                  color={accentColor}
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Transport Authority
                </Text>
                <Text fontSize="10px" fontStyle="italic">
                  Valid Student Bus Pass
                </Text>
                <Text fontSize="8px" mt={1}>
                  Valid until: August 2030
                </Text>
              </VStack>
              
              <Box
                w="60px"
                h="30px"
                bg="rgba(0,0,0,0.3)"
                borderRadius="sm"
                display="flex"
                alignItems="center"
                justifyContent="center"
                border={`1px solid ${accentColor}`}
              >
                <Text fontSize="10px" fontWeight="bold">
                  #{data?.promotion?.student_master?.srNo || "N/A"}
                </Text>
              </Box>
            </Flex>

            {/* Decorative divider */}
            <Flex justify="center" my={2}>
              <Box w="90%" h="2px" bg={accentColor} borderRadius="full" />
            </Flex>

            {/* Main Content */}
            <HStack spacing={4} align="flex-start">
              {/* Student Photo */}
              <Box position="relative">
                <Image
                  src={FILE_URL + data?.promotion?.student_master?.photo}
                  alt="Student"
                  boxSize="80px"
                  borderRadius="md"
                  border={`2px solid ${accentColor}`}
                  objectFit="cover"
                />
                <Box
                  position="absolute"
                  bottom="-8px"
                  left="50%"
                  transform="translateX(-50%)"
                  bg={accentColor}
                  color="black"
                  px={2}
                  py={0.5}
                  borderRadius="sm"
                  fontSize="8px"
                  fontWeight="bold"
                >
                  STUDENT
                </Box>
              </Box>
              
              {/* Student Details */}
              <VStack align="flex-start" spacing={1} flex={1}>
                <Text fontSize="12px" fontWeight="bold">
                  {data?.promotion?.student_master?.studentName || "N/A"}
                </Text>
                
                <Box bg="rgba(255,255,255,0.1)" p={1.5} borderRadius="sm" w="full">
                  <Text fontSize="10px">
                    <Text as="span" color={accentColor} fontWeight="bold">Route: </Text>
                    {data?.transport_route?.name || "N/A"}
                  </Text>
                   <Text fontSize="10px">
                    <Text as="span" color={accentColor} fontWeight="bold">Vehicle: </Text>
                    {data?.vehicle?.vehicle || "N/A"}
                  </Text>
                  <Text fontSize="10px">
                    <Text as="span" color={accentColor} fontWeight="bold">Father: </Text>
                    {data?.promotion?.student_master?.fatherName || "N/A"}
                  </Text>
                </Box>
                
                <HStack spacing={2} mt={1}>
                  <Image
                    src={busImage}
                    alt="Bus"
                    boxSize="50px"
                    opacity="0.8"
                  />
                  <Text fontSize="9px" fontStyle="italic" flex={1}>
                    This pass must be shown to the driver upon boarding
                  </Text>
                </HStack>
              </VStack>
            </HStack>

            {/* Footer */}
            <Flex 
              position="absolute" 
              bottom="0" 
              left="0" 
              right="0" 
              bg="rgba(0,0,0,0.4)" 
              p={1.5} 
              justify="center"
              borderTop={`1px solid ${accentColor}`}
            >
              <Text fontSize="8px" textAlign="center">
                Issued by World College of Technology & Management • Farukh Nagar, Gurgaon
              </Text>
            </Flex>
            
            {/* Security features */}
            <Box
              position="absolute"
              top="50%"
              left="0"
              w="full"
              opacity="0.1"
              transform="rotate(-15deg)"
            >
              <Text fontSize="20px" fontWeight="bold" textAlign="center">
                WCTM OFFICIAL TRANSPORT
              </Text>
            </Box>
          </Box>
        </Flex>
      ))}
    </Box>
  );
};

export default TransportPasses;