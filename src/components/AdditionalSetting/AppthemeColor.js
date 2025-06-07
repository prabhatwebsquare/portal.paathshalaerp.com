import { getLocalStorageItem } from "@/utils/LocalStorage";
import {
  Box,
  Grid,
  Text,
  Button,
  VStack,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { keyframes } from "@chakra-ui/system";

const colorThemes = [
  { name: "Dark Blue", color: "#003366", lighterColor: "#80B3CC" },
  { name: "Charcoal", color: "#2F4F4F", lighterColor: "#A8B8B8" },
  { name: "Dark Green", color: "#006400", lighterColor: "#66B366" },
  { name: "Dark Red", color: "#8B0000", lighterColor: "#D08C8C" },
  { name: "Midnight", color: "#191970", lighterColor: "#5C6F9C" },
  { name: "Olive", color: "#556B2F", lighterColor: "#A3C48D" },
  { name: "Dark Brown", color: "#4B0082", lighterColor: "#8B66B3" },
  { name: "Deep Purple", color: "#800080", lighterColor: "#CC66CC" },
  { name: "Crimson", color: "#DC143C", lighterColor: "#F2A1B7" },
  { name: "Teal", color: "#008080", lighterColor: "#66B3B3" },
  { name: "Indigo", color: "#4B0082", lighterColor: "#9A66B3" },
  { name: "Royal Blue", color: "#4169E1", lighterColor: "#7CA8F4" },
  { name: "Firebrick", color: "#B22222", lighterColor: "#F99F9F" },
  { name: "Dark Slate Blue", color: "#483D8B", lighterColor: "#7C6BAF" },
];

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.7); }
  50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.9); }
  100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.7); }
`;

export const AppthemeColor = () => {
  const [selectedColor, setSelectedColor] = useState("#003366");
  const [lighterColor, setLighterColor] = useState("#80B3CC");
  const toast = useToast();

  const handleColorSelect = (color, lighter) => {
    setSelectedColor(color);
    setLighterColor(lighter);
    toast({
      title: "Color selected",
      description: `You have selected ${color}`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const themeColor = useMemo(() => getLocalStorageItem("themeColor"), []);

  return (
    <Box
      height="75vh"
      className="scrollBar"
      overflow={"scroll"}
      p={8}
      bgGradient="linear(to-b, gray.50, white)"
    >
      <VStack spacing={6} align="center">
        <Text
          fontSize="4xl"
          fontWeight="bold"
          textAlign="center"
          color={selectedColor}
          mb={5}
          animation={`${fadeIn} 0.8s ease`}
          textShadow={`0 0 5px ${selectedColor}, 0 0 20px ${selectedColor}`}
        >
          Choose Your App Color Theme
        </Text>

        {/* Color Grid */}
        <Grid
          templateColumns={useBreakpointValue({
            base: "repeat(3, 1fr)",
            md: "repeat(5, 1fr)",
            lg: "repeat(7, 1fr)",
          })}
          gap={6}
          justifyItems="center"
          mb={10}
        >
          {colorThemes.map((theme, index) => (
            <Box
              key={index}
              w="90px"
              h="90px"
              bg={theme.color}
              borderRadius="lg"
              boxShadow="md"
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{
                transform: "scale(1.15)",
                boxShadow: `0 0 20px ${theme.color}`,
                transition: "all 0.3s ease",
                _after: {
                  opacity: 1,
                },
              }}
              onClick={() => handleColorSelect(theme.color, theme.lighterColor)}
              borderWidth="3px"
              borderColor={
                theme.color === selectedColor ? "white" : "transparent"
              }
              animation={`${fadeIn} 0.5s ease ${index * 0.1}s`}
              position="relative"
              _after={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: "lg",
                bg: "rgba(255, 255, 255, 0.1)",
                opacity: 0,
                transition: "opacity 0.3s ease",
              }}
             
            />
          ))}
        </Grid>

        {/* Selected Color Display */}
        <Box
          display="flex"
          gap={6}
          flexDirection={{ base: "column", md: "row" }}
          alignItems="center"
        >
          <Box
            p={6}
            textAlign="center"
            bg={selectedColor}
            color="white"
            borderRadius="lg"
            shadow="xl"
            borderWidth="3px"
            borderColor="gray.200"
            transition="background-color 0.3s ease"
            animation={`${pulse} 2s infinite`}
            backdropFilter="blur(10px)"
            bgGradient={`linear(to-b, ${selectedColor}, ${lighterColor})`}
          >
            <Text fontSize="xl" fontWeight="semibold">
              Selected Color
            </Text>
            <Text fontSize="lg">{selectedColor}</Text>
          </Box>

     
        </Box>

        {/* Apply Theme Button */}
        <Box mt={6} textAlign="center">
          <Button
            colorScheme={themeColor}
            size="lg"
            onClick={() => alert("Theme applied!")}
            variant="solid"
            borderRadius="full"
            boxShadow="lg"
            _hover={{
              bg: selectedColor,
              transform: "scale(1.05)",
              boxShadow: `0 0 20px ${selectedColor}`,
            }}
            animation={`${fadeIn} 1s ease`}
            backdropFilter="blur(10px)"
            bgGradient={`linear(to-b, ${selectedColor}, ${lighterColor})`}
          >
            Apply Theme
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};