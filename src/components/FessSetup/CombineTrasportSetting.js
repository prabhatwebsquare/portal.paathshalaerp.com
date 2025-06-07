import React, { useMemo, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Fade,
  ScaleFade,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { FaBus, FaMoneyBillWave, FaLink, FaUnlink } from "react-icons/fa";
import { useFeesSetupStore } from "@/store/feesSetup";
import { useAdminStore } from "@/store/AdminStore";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/LocalStorage";

export const CombineTransportSetting = ({ themeColor }) => {
  const isTransportCombine = useMemo(() => getLocalStorageItem("isTransportCombine"), []);
  const [selection, setSelection] = useState(null); 
  const [confirmedSelection, setConfirmedSelection] = useState(isTransportCombine == 1 ?  "combined" : "separate"); 
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const { updateSchoolAction, updateSchoolStatus, resetUpdateSchool } =
    useAdminStore((s) => ({
      updateSchoolAction: s.updateSchoolAction,
      updateSchoolStatus: s.updateSchoolStatus,
      resetUpdateSchool: s.resetUpdateSchool,
    }));
  const handleSelection = (choice) => {
    setSelection(choice); 
  };
  
  const confirmSelection = () => {
    updateSchoolAction({
        isTransportCombine : isTransportCombine == 1 ? 0 : 1,
    })
    setLocalStorageItem("isTransportCombine", isTransportCombine == 1 ? 0 : 1);
    setConfirmedSelection(selection); 
    setSelection(null);
    window.location.reload();
  };

  const closeModal = () => {
    setSelection(null); 
  };

  return (
    <Box
      minH="75vh"
      p={8}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={bgColor}
    >
      <VStack spacing={10} maxW="800px" w="full" textAlign="center">
        {/* Header */}
        <ScaleFade initialScale={0.9} in={true}>
          <Heading
            fontSize={{ base: "2xl", md: "4xl" }}
            color={`${themeColor}.600`}
            fontWeight="extrabold"
            letterSpacing="tight"
            mb={5}
          >
            Transport Fees Configuration
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color={textColor}
            maxW="600px"
          >
            Tell us how you’d like to manage your transport and fees. Combine them for simplicity or keep them separate for flexibility!
          </Text>
        </ScaleFade>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full" >
          {/* Combined Option */}
          <Fade in={true}>
            <Card
              bg={confirmedSelection === "combined" ? `${themeColor}.200` : cardBg}
              borderRadius="xl"
              boxShadow="lg"
              p={6}
              borderWidth={confirmedSelection === "combined" ? 2 : 0}
              borderColor={`${themeColor}.400`}
              transform={confirmedSelection === "combined" ? "scale(1.05)" : "scale(1)"}
              transition="all 0.3s ease"
              _hover={{
                boxShadow: "xl",
                transform: "scale(1.05)",
                cursor: "pointer",
              }}
              onClick={() => handleSelection("combined")}
            >
              <CardHeader>
                <Flex align="center" justify="center" mb={4}>
                  <Icon
                    as={FaLink}
                    w={10}
                    h={10}
                    color={confirmedSelection === "combined" ? `${themeColor}.700` : `${themeColor}.500`}
                  />
                </Flex>
                <Heading
                  size="md"
                  color={confirmedSelection === "combined" ? `${themeColor}.800` : `${themeColor}.600`}
                >
                  Combined
                </Heading>
              </CardHeader>
              <CardBody>
                <Text
                  fontSize="sm"
                  color={confirmedSelection === "combined" ? `${themeColor}.800` : textColor}
                >
                  Transport and fees are managed together. One unified fee collection process for both modules.
                </Text>
              </CardBody>
              <CardFooter justify="center">
                  <Button
                    colorScheme={themeColor}
                    size="sm"
                    variant="outline"
                    disabled={confirmedSelection === "combined"}
                    leftIcon={<FaBus />}
                  >
                  { confirmedSelection === "combined" ? "Currently Selected" : "Select Combined"}  
                  </Button>
          
              </CardFooter>
            </Card>
          </Fade>

          {/* Separate Option */}
          <Fade in={true}>
            <Card
              bg={confirmedSelection === "separate" ? `${themeColor}.200` : cardBg}
              borderRadius="xl"
              boxShadow="lg"
              p={6}
              borderWidth={confirmedSelection === "separate" ? 2 : 0}
              borderColor={`${themeColor}.400`}
              transform={confirmedSelection === "separate" ? "scale(1.05)" : "scale(1)"}
              transition="all 0.3s ease"
              _hover={{
                boxShadow: "xl",
                transform: "scale(1.05)",
                cursor: "pointer",
              }}
              onClick={() => handleSelection("separate")}
            >
              <CardHeader>
                <Flex align="center" justify="center" mb={4}>
                  <Icon
                    as={FaUnlink}
                    w={10}
                    h={10}
                    color={confirmedSelection === "separate" ? `${themeColor}.700` : `${themeColor}.500`}
                  />
                </Flex>
                <Heading
                  size="md"
                  color={confirmedSelection === "separate" ? `${themeColor}.800` : `${themeColor}.600`}
                >
                  Separate
                </Heading>
              </CardHeader>
              <CardBody>
                <Text
                  fontSize="sm"
                  color={confirmedSelection === "separate" ? `${themeColor}.800` : textColor}
                >
                  Transport and fees are managed independently. Separate fee collection for each module.
                </Text>
              </CardBody>
              <CardFooter justify="center">
                  <Button
                    colorScheme={themeColor}
                    size="sm"
                    variant="outline"
                    disabled={confirmedSelection === "separate"}
                    leftIcon={<FaMoneyBillWave />}
                  >
                    { confirmedSelection === "separate" ? "Currently Selected" : "Select Separate"}  
                  </Button>
              </CardFooter>
            </Card>
          </Fade>
        </SimpleGrid>

        {/* Confirmation Modal */}
        {selection && (
          <Modal isOpen={!!selection} onClose={closeModal} isCentered>
            <ModalOverlay bg="rgba(0, 0, 0, 0.4)" />
            <ModalContent
              bg={cardBg}
              borderRadius="lg"
              boxShadow="lg"
              p={6}
              borderWidth={1}
              borderColor={`${themeColor}.200`}
            >
              <ModalHeader>
                <Heading size="md" color={`${themeColor}.600`}>
                  Your Selection: {selection === "combined" ? "Combined" : "Separate"}
                </Heading>
              </ModalHeader>
              <ModalBody>
                <Text fontSize="md" color={textColor}>
                  {selection === "combined"
                    ? "You've chosen to combine transport and fees. The fee collection process will be unified for both."
                    : "You've chosen to keep transport and fees separate. Each module will have its own fee collection process."}
                </Text>
              </ModalBody>
              <ModalFooter justify="center" gap={4}>
                <Button
                  colorScheme={themeColor}
                  size="lg"
                  px={8}
                  onClick={confirmSelection}
                  _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                  transition="all 0.2s"
                >
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  colorScheme={themeColor}
                  size="lg"
                  px={8}
                  onClick={closeModal}
                  _hover={{ bg: `${themeColor}.50` }}
                  transition="all 0.2s"
                >
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </VStack>
    </Box>
  );
};