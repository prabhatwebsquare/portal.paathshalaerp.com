import {
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Icon,
  VStack,
  Text,
  ModalFooter,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuSheet } from "react-icons/lu";
import { CheckIcon } from "@chakra-ui/icons";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/LocalStorage";

const tcLayouts = [
    {
      id: 1,
      src: "../assets/tcformat1.png",
      name: "TC Format 1",
      selectedId: 1,
      isActive: true
    },
    {
      id: 2,
      src: "../assets/tcformat2.png", 
      name: "TC Format 2",
      selectedId: 2,
      isActive: false
    },
];

export const TcFormatTheme = ({ themeColor, Data, closeModal }) => {
  const tcLayout = getLocalStorageItem("tcLayout")
  const [selectedLayout, setSelectedLayout] = useState(tcLayout);
  
  const handleSelectLayout = (id) => {
    const layout = tcLayouts.find(l => l.id === id);
    if (layout?.isActive) {
      setSelectedLayout(id);
    }
  };

  return (
    <Modal size="6xl" isOpen={Data} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent
        borderRadius="lg"
        boxShadow="2xl"
        p={6}
        bgGradient="linear(to-br, gray.50, gray.100)"
        position="relative"
        overflow="hidden"
      >
        {/* Decorative Elements */}
        <Box
          position="absolute"
          top="-50px"
          right="-50px"
          w="200px"
          h="200px"
          bg={`${themeColor}.900`}
          opacity="0.3"
          borderRadius="full"
          filter="blur(80px)"
        />
        <Box
          position="absolute"
          bottom="-50px"
          left="-50px"
          w="200px"
          h="200px"
          bg={`${themeColor}.900`}
          opacity="0.4"
          borderRadius="full"
          filter="blur(80px)"
        />

        <ModalHeader
          textAlign="center"
          fontSize="3xl"
          fontWeight="bold"
          color="gray.700"
        >
          TC Format Layouts
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={10}>
          <VStack spacing={6}>
            <Flex wrap="wrap" justify="center" gap={8}>
              {tcLayouts.map((layout) => (
                <Box
                  key={layout.id}
                  position="relative"
                  w="300px"
                  h="250px"
                  borderRadius="lg"
                  overflow="hidden"
                  cursor={layout.isActive ? "pointer" : "not-allowed"}
                  onClick={() => handleSelectLayout(layout.id)}
                  transition="all 0.3s ease-in-out"
                  _hover={layout.isActive ? { transform: "scale(1.05)", boxShadow: "lg" } : {}}
                  boxShadow={
                    selectedLayout === layout.id
                      ? "0px 0px 15px rgba(0, 0, 0, 0.3)"
                      : "md"
                  }
                  border={
                    selectedLayout === layout.id
                      ? `2px solid black`
                      : `none`
                  }
                >
                  <Image
                    src={layout.src}
                    alt={`TC Layout ${layout.id}`}
                    w="100%"
                    h="100%"
                    filter={
                      selectedLayout === layout.id ? "brightness(90%)" : 
                      !layout.isActive ? "grayscale(100%)" : "none"
                    }
                  />
                  {selectedLayout === layout.id && (
                    <Icon
                      as={CheckIcon}
                      position="absolute"
                      top={4}
                      right={4}
                      color="white"
                      bg={`${themeColor}.500`}
                      borderRadius="full"
                      boxSize={8}
                      p={1.5}
                    />
                  )}
                  {!layout.isActive && (
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      bg="rgba(0,0,0,0.7)"
                      color="white"
                      px={4}
                      py={2}
                      borderRadius="md"
                      fontWeight="bold"
                      textAlign="center"
                      width="80%"
                    >
                      Under Development
                    </Box>
                  )}
                  <Text
                    position="absolute"
                    bottom={2}
                    left={2}
                    fontSize="sm"
                    fontWeight="semibold"
                    color="white"
                    bg={`${themeColor}.900`}
                    px={3}
                    py={1}
                    borderRadius="full"
                    boxShadow="sm"
                  >
                    {layout.name}
                  </Text>
                </Box>
              ))}
            </Flex>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Flex align="center" gap={4} mt={10} w="full" justifyContent="center">
            <Button
              size="lg"
              colorScheme="red"
              variant="outline"
              onClick={closeModal}
              _hover={{ bg: "red.50" }}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setLocalStorageItem("tcLayout", selectedLayout);
                closeModal();
              }}
              size="lg"
              colorScheme={themeColor}
              leftIcon={<LuSheet fontSize={20} />}
              isDisabled={!selectedLayout}
              _hover={{ transform: "scale(1.05)", bg: `${themeColor}.600` }}
            >
              Change TC Format
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};