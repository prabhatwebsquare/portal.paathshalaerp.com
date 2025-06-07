import { Box, Flex, Image, Text } from "@chakra-ui/react";

const StudentCC = () => {
  return (
    <Box
      maxW="800px"
      mx="auto"
      p="3"
      border="2px solid black"
      bg="white"
      boxShadow="lg"
      borderRadius="md"
    >
      <Flex justify="space-between" align="center" mb="1">
        <Image src="/assets/slogo1.jpg" alt="School Logo" boxSize="100px" />
        <Box textAlign="center">
          <Text fontSize="xl" fontWeight="bold" color="purple.600">
            paathshala Smart
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            Affiliation No: 989898
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            HALENA, TEH- WEIR, BHARATPUR (RAJ)
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            Phone No: 09414375346
          </Text>
        </Box>
        <Image
          src="/assets/student_image.jpg"
          alt="School Logo"
          boxSize="100px"
        />
      </Flex>

      <Text
        fontSize="md"
        fontWeight="bold"
        textAlign="center"
        mb="2"
        px="4"
        py="1"
        color="purple.600"
      >
        Session : 2024-2025
      </Text>

      <Text
        fontSize="1xl"
        fontWeight="bold"
        textAlign="center"
        bg="purple.400"
        color="white"
        py="1"
        borderRadius="md"
        mb="4"
      >
        Character Certificate
      </Text>

      <Box
        mb="6"
        fontSize="lg"
        fontFamily="'Times New Roman', serif"
        px="6"
        py="4"
       lineHeight={1}
        letterSpacing={1}
      >
        <Text mb="6" textAlign="justify" fontWeight="medium">
          This is to certify that Mr./Miss  <strong> <u>Avika Pandey</u> </strong> , Son/Daughter of <strong><u>Avinash Pandey</u></strong>,
        </Text>

        <Flex mb="6" px="4">
          <Text>
            Sr No.:&nbsp;
            <strong>
              <u>35111</u> &nbsp;
            </strong> 
          </Text>
          <Text>
            Date of Birth:&nbsp;
            <strong>
              <u>09/05/2018</u>
            </strong> &nbsp;
            has been a bonafide student   of this
          </Text>
        </Flex>
        <Flex  mb="6" px="4">
          <Text>
          school during the period &nbsp;From: 
            <strong>
            &nbsp;<u>01/04/2024</u>
            </strong>
          </Text>
          <Text>
          &nbsp; To:&nbsp;
            <strong>
              <u>19/12/2025</u>
            </strong>
          </Text>
        </Flex>

        <Text mb="6" textAlign="justify" fontWeight="medium">
          During this period, his <strong>Behavior and Character</strong> were
          found to be <strong>good and satisfactory</strong>.
        </Text>

        <Text textAlign="center" fontWeight="bold" fontSize="md">
          We wish him a bright future ahead.
        </Text>
      </Box>

      <Flex justify="space-between" mt="4">
        <Text fontSize="sm">
          <strong>Issue Date:</strong>&nbsp;
          ............................................
        </Text>
        <Text fontSize="sm">
          <strong>Authorized Signatory:</strong>&nbsp;
          ............................................
        </Text>
      </Flex>
    </Box>
  );
};

export default StudentCC;
