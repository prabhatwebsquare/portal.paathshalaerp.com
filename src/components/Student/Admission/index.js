import { PageHeader } from "@/common/PageHeader";
import { Box, Button, Flex, Icon, IconButton, Input, InputGroup, InputRightElement, Text, Toast } from "@chakra-ui/react";
import { AdmissionForm } from "./AdmissionForm";
import { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { AdmissionFormPrint } from "./AdmissionFormPrint";
import { useRouter } from "next/router";
import { PiStudentFill } from "react-icons/pi";
import { MdContentCopy, MdGroupAdd, MdGroups, MdLocalPrintshop } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/LocalStorage";
import { FiExternalLink } from "react-icons/fi";

export const StudentAdmission = ({ path, themeColor, sessionMasterId }) => {
  const router = useRouter();
  const printRef = useRef(null);
  const [origin, setOrigin] = useState('');
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const schoolData = getLocalStorageItem("user");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <Box h="100%">
      <PageHeader heading={"Student Admission"} />
      <Flex
        p={5}
        bg="white"
        height="90%"
        w="100%"
        justify="space-between"
        align="start"
        gap={2}
      >
        <Flex
          justify="center"
          align="center"
          w={{ base: "100%", md: "30%", lg: "20%" }}
          h="auto"
          minH="250px"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          fontSize={16}
          fontWeight="semibold"
          flexDir="column"
          cursor="pointer"
          bgGradient="linear(to-br, red.100, red.200)"
          _hover={{
            transform: "scale(1.05)",
            boxShadow: "lg",
            bgGradient: "linear(to-br, red.200, red.300)",
          }}
          transition="all 0.3s ease"
          onClick={() =>
            router.push("/student/student-admission/admission-form")
          }
        >
          <Icon as={PiStudentFill} w={16} h={16} color="red.600" />
          <Text mt={4} textAlign="center" color="red.800" fontSize="xl" fontWeight="bold">
            New Student Admission
          </Text>
        </Flex>

        {/* New Student Online Admission */}
        <Flex
          justify="center"
          align="center"
          w={{ base: "100%", md: "30%", lg: "20%" }}
          h="auto"
          minH="250px"
          position="relative"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          fontSize={16}
          fontWeight="semibold"
          flexDir="column"
          cursor="pointer"
          bgGradient="linear(to-br, blue.100, blue.200)"
          _hover={{
            transform: "scale(1.05)",
            boxShadow: "2xl",
            bgGradient: "linear(to-br, blue.200, blue.300)",
          }}
          transition="all 0.3s ease"
        >
          {/* Decorative background elements */}
          <Box
            position="absolute"
            top="-20px"
            right="-20px"
            w="100px"
            h="100px"
            borderRadius="full"
            bg="blue.200"
            opacity="0.3"
            transform="rotate(45deg)"
          />
          <Box
            position="absolute"
            bottom="-30px"
            left="-30px"
            w="120px"
            h="120px"
            borderRadius="full"
            bg="blue.300"
            opacity="0.2"
          />

          <Icon 
            as={PiStudentFill} 
            w={16} 
            h={16} 
            color="blue.600"
            transform="rotate(-5deg)"
            transition="transform 0.3s ease"
            _groupHover={{ transform: "rotate(5deg)" }}
          />
          <Text 
            mt={4} 
            textAlign="center" 
            color="blue.800"
            fontSize="lg"
            fontWeight="bold"
            textShadow="1px 1px 2px rgba(0,0,0,0.1)"
          >
            Student Online Admission
          </Text>
          
          <Flex 
            mt={4} 
            w="90%" 
            align="center" 
            gap={2}
            bg="white"
            p={2}
            borderRadius="lg"
            boxShadow="sm"
          >
            <Input
              value={`${origin}/student/student-admission/admission-form-online/${schoolData?.schoolData?.schoolCode}`}
              isReadOnly
              size="sm"
              bg="white"
              borderRadius="md"
              _hover={{ borderColor: "blue.400" }}
              fontSize="xs"
            />
            <IconButton
              aria-label="Copy link"
              icon={<Icon as={MdContentCopy} />}
              size="sm"
              colorScheme="blue"
              variant="solid"
              _hover={{
                transform: "scale(1.1)",
                bg: "blue.500"
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(`${origin}/student/student-admission/admission-form-online/${schoolData?.schoolData?.schoolCode}`);
              }}
            />
          </Flex>
        </Flex>
        {/* Student Bulk Admission */}
        <Flex
          justify="center"
          align="center"
          w={{ base: "100%", md: "30%", lg: "20%" }}
          h="auto"
          minH="250px"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          fontSize={16}
          fontWeight="semibold"
          flexDir="column"
          cursor="pointer"
          bgGradient="linear(to-br, purple.100, purple.200)"
          _hover={{
            transform: "scale(1.05)",
            boxShadow: "lg",
            bgGradient: "linear(to-br, purple.200, purple.300)",
          }}
          transition="all 0.3s ease"
          onClick={() =>
            router.push("/student/student-admission/bulk-admission")
          }
        >
          <Icon as={MdGroupAdd} w={16} h={16} color="purple.600" />
          <Text mt={4} textAlign="center" color="purple.800" fontSize="xl" fontWeight="bold">
            Student Bulk Admission
          </Text>
        </Flex>


        {/* Upload Student Image/Picture */}
        <Flex
          justify="center"
          align="center"
          w={{ base: "100%", md: "30%", lg: "20%" }}
          h="auto"
          minH="250px"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          fontSize={16}
          fontWeight="semibold"
          flexDir="column"
          cursor="pointer"
          bgGradient="linear(to-br, orange.100, orange.200)"
          _hover={{
            transform: "scale(1.05)",
            boxShadow: "lg",
            bgGradient: "linear(to-br, orange.200, orange.300)",
          }}
          transition="all 0.3s ease"
          onClick={() =>
            router.push("/student/student-admission/upload-students-Picture")
          }
        >
          <Icon as={CgProfile} w={16} h={16} color="orange.600" />
          <Text mt={4} textAlign="center" color="orange.800" fontSize="xl" fontWeight="bold">
            Upload Student Image/Picture
          </Text>
        </Flex>

        {/* Download Blank Form */}
        <Flex
          justify="center"
          align="center"
          w={{ base: "100%", md: "30%", lg: "20%" }}
          h="auto"
          minH="250px"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          fontSize={16}
          fontWeight="semibold"
          flexDir="column"
          cursor="pointer"
          bgGradient="linear(to-br, pink.100, pink.200)"
          _hover={{
            transform: "scale(1.05)",
            boxShadow: "lg",
            bgGradient: "linear(to-br, orange.200, orange.300)",
          }}
          transition="all 0.3s ease"
          onClick={handlePrint}
        >
          <Icon as={MdLocalPrintshop} w={16} h={16} color="pink.600" />
          <Text mt={4} textAlign="center" color="pink.800" fontSize="xl" fontWeight="bold">
            Download Blank Form
          </Text>
        </Flex>
      </Flex>
      <Box display={"none"}>
        <Box ref={printRef}>
          <AdmissionFormPrint themeColor={themeColor} />
        </Box>
      </Box>
    </Box>
  );
};
