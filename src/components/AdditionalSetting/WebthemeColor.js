import { STATUS } from "@/constant";
import { useAppStore } from "@/store/App";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/LocalStorage";
import {
  Box,
  Grid,
  Text,
  Button,
  VStack,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

// Color themes with names only
const colorThemes = [
  { name: "cyan", lighterColor: "Light Green" },
  { name: "red", lighterColor: "Light Red" },
  { name: "gray", lighterColor: "Light Slate Gray" },
  { name: "blue", lighterColor: "Light Olive" },
  { name: "teal", lighterColor: "Light Brown" },
  { name: "green", lighterColor: "Light Purple" },
  { name: "yellow", lighterColor: "Light Crimson" },
  { name: "orange", lighterColor: "Light Teal" },
  { name: "purple", lighterColor: "Light Indigo" },
  { name: "pink", lighterColor: "Light Indigo" },
];

export const WebthemeColor = () => {
  const toast = useToast();
  const { addColorCodeAction, addColorCodeStatus, allColor } = useAppStore(
    (s) => ({
      addColorCodeAction: s.addColorCodeAction,
      addColorCodeStatus: s.addColorCodeStatus,
      allColor: s.allColor,
    })
  );
  const handleColorSelect = (color, lighter) => {
    setSelectedColor(color);
  };

  const [selectedColor, setSelectedColor] = useState("");

  const handleUpdate = () => {
    addColorCodeAction({
      webColor: selectedColor,
    });
  };

  const [themeColor, setThemeColor] = useState(() =>
    getLocalStorageItem("themeColor")
  );

  useEffect(() => {
    if (addColorCodeStatus === STATUS.SUCCESS) {
      const newColor = allColor.webColor;
      setLocalStorageItem("themeColor", newColor);
      window.location.reload();
    }
  }, [addColorCodeStatus, allColor?.webColor]);

  useEffect(() => {
    setSelectedColor(themeColor);
    return () => {};
  }, [themeColor]);
  return (
    <Box height="75vh" className="scrollBar" overflow={"scroll"} p={8}>
      <VStack spacing={8} align="center">
        <Text
          fontSize="3xl"
          fontWeight="bold"
          textAlign="center"
          color="black"
          mb={6}
        >
          Choose Your ERP Color Theme
        </Text>

        {/* Color Grid */}
        <Grid
          templateColumns={useBreakpointValue({
            base: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(5, 1fr)",
          })}
          gap={6}
          justifyItems="center"
          mb={0}
        >
          {colorThemes.map((theme, index) => (
            <Box
              key={index}
              w="90px"
              h="90px"
              bg={theme.name}
              borderRadius="lg"
              boxShadow="md"
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{
                transform: "scale(1.15)",
                boxShadow: "lg",
                transition: "all 0.3s ease",
              }}
              onClick={() => handleColorSelect(theme.name, theme.lighterColor)}
              borderWidth="3px"
              borderColor={
                theme.name === selectedColor ? "white" : "transparent"
              }
            />
          ))}
        </Grid>

        <Box
          mt={0}
          p={6}
          textAlign="center"
          bg={selectedColor} // Placeholder color
          color="white"
          borderRadius="lg"
          shadow="xl"
          width="80%"
          maxW="300px"
          mx="auto"
          borderWidth="3px"
          borderColor="gray.200"
          transition="background-color 0.3s ease"
        >
          <Text fontSize="2xl" fontWeight="semibold">
            Selected Color
          </Text>
          <Text fontSize="lg">{selectedColor}</Text>
        </Box>

        {/* Apply Theme Button */}
        <Box mt={0} textAlign="center">
          <Button
            colorScheme={themeColor}
            size="lg"
            onClick={handleUpdate}
            variant="solid"
            borderRadius="full"
            boxShadow="lg"
            _hover={{
              transform: "scale(1.05)",
            }}
          >
            Apply Theme
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};
