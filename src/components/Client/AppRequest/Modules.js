import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Text,
  VStack,
  Divider,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { map, filter, findIndex } from "lodash";
import {
  ADMIN_MODULES,
  COORDINATOR_MODULES,
  DRIVER_MODULES,
  PRINCIPAL_MODULES,
  STUDENT_MODULES,
  TEACHERS_MODULES,
} from "@/constant/Modules";

const APPS = [
  { name: "adminApp", label: "Admin App", modules: ADMIN_MODULES },
  { name: "principalApp", label: "Principal App", modules: PRINCIPAL_MODULES },
  {
    name: "coordinatorApp",
    label: "Coordinator App",
    modules: COORDINATOR_MODULES,
  },
  { name: "teacherApp", label: "Teacher App", modules: TEACHERS_MODULES },
  { name: "studentApp", label: "Student App", modules: STUDENT_MODULES },
  { name: "driverApp", label: "Driver App", modules: DRIVER_MODULES },
];

export const Modules = ({
  handleBackStep,
  handleNextStep,
  themeColor,
  inputValue,
  setInputValue,
}) => {
  const [activeApp, setActiveApp] = useState(APPS[0].name);

  const handleCheck = (appName, id) => {
    setInputValue((prev) => {
      const currentModules = prev[appName] || [];
      return {
        ...prev,
        [appName]:
          findIndex(currentModules, (s) => s === id) !== -1
            ? filter(currentModules, (s) => s !== id)
            : [...currentModules, id],
      };
    });
  };

  const handleCheckAll = (appName, modules) => {
    setInputValue((prev) => ({
      ...prev,
      [appName]:
        prev[appName]?.length === modules.length ? [] : map(modules, "id"),
    }));
  };
  const submitDetails =  () => {
    handleNextStep();
  };

  const cardBg = useColorModeValue("white", "gray.700");
  const cardBorder = useColorModeValue("gray.200", "gray.600");
  const activeAppBg = useColorModeValue(
    `${themeColor}.100`,
    `${themeColor}.700`
  );
  const hoverBg = useColorModeValue(`${themeColor}.50`, `${themeColor}.600`);

  return (
    <>
      <Box
        bg={`${themeColor}.50`}
        p={6}
        borderRadius="md"
        boxShadow="md"
        mt={5}
        height="60vh"
        display="flex"
        flexDirection="column"
      >
        <Heading
          as="h2"
          size="md"
          textAlign="center"
          color={`${themeColor}.600`}
          mb={4}
        >
          Manage App Modules
        </Heading>
        <Divider mb={6} borderColor={`${themeColor}.300`} />

        {/* App Selection Buttons */}
        <Flex wrap="wrap" gap={4} justify="center">
          {APPS.map((app) => (
            <Box
              key={app.name}
              bg={activeApp === app.name ? activeAppBg : cardBg}
              p={3}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={
                activeApp === app.name ? `${themeColor}.500` : cardBorder
              }
              cursor="pointer"
              onClick={() => setActiveApp(app.name)}
              _hover={{ bg: hoverBg, borderColor: `${themeColor}.500` }}
              transition="all 0.2s"
            >
              <HStack spacing={2}>
                <Icon
                  as={
                    inputValue[app.name]?.length
                      ? FaCheckCircle
                      : FaRegCircle
                  }
                  color={
                    inputValue[app.name]?.length
                      ? `${themeColor}.500`
                      : "gray.400"
                  }
                  boxSize={5}
                />
                <Text
                  fontWeight="semibold"
                  color={
                    activeApp === app.name ? `${themeColor}.700` : "gray.700"
                  }
                >
                  {app.name}
                </Text>
                <Badge colorScheme={themeColor} variant="subtle">
                  {app.modules.length} Modules
                </Badge>
              </HStack>
            </Box>
          ))}
        </Flex>

        <Divider my={6} borderColor={`${themeColor}.300`} />

        {/* Module Selection */}
        <Box flex="1" overflowY="auto" mt={4} pb={16}>
          <Checkbox
            isChecked={
              APPS.find((app) => app.name === activeApp)?.modules.length ===
              (inputValue[activeApp]?.length || 0)
            }
            colorScheme={themeColor}
            mb={4}
            onChange={() =>
              handleCheckAll(
                activeApp,
                APPS.find((app) => app.name === activeApp)?.modules || []
              )
            }
          >
            <Text fontWeight="bold" color={`${themeColor}.700`}>
              Select All Modules
            </Text>
          </Checkbox>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {map(
              APPS.find((app) => app.name === activeApp)?.modules,
              (module) => (
                <Box
                  key={module.id}
                  bg={cardBg}
                  p={4}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor={
                    findIndex(
                      inputValue[activeApp] || [],
                      (s) => s === module.id
                    ) !== -1
                      ? `${themeColor}.500`
                      : cardBorder
                  }
                  boxShadow="sm"
                  cursor="pointer"
                  onClick={() => handleCheck(activeApp, module.id)}
                  _hover={{
                    borderColor: `${themeColor}.500`,
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s"
                >
                  <Flex align="center" justify="space-between">
                    <Text fontWeight="semibold" color={`${themeColor}.700`}>
                      {module.label}
                    </Text>
                    <Icon
                      as={
                        findIndex(
                          inputValue[activeApp] || [],
                          (s) => s === module.id
                        ) !== -1
                          ? FaCheckCircle
                          : FaRegCircle
                      }
                      color={
                        findIndex(
                          inputValue[activeApp] || [],
                          (s) => s === module.id
                        ) !== -1
                          ? `${themeColor}.500`
                          : "gray.300"
                      }
                      boxSize={5}
                    />
                  </Flex>
                </Box>
              )
            )}
          </SimpleGrid>
        </Box>
      </Box>

      {/* Navigation Buttons */}
      <Button
        bottom={10}
        position="absolute"
        size="md"
        variant="outline"
        colorScheme={themeColor}
        onClick={() => handleBackStep()}
      >
        Previous
      </Button>
      <Button
        bottom={10}
        position="absolute"
        disabled={!Object.keys(inputValue).length}
        size="md"
        right={10}
        colorScheme={themeColor}
        onClick={() => submitDetails()}
      >
        Finish
      </Button>
    </>
  );
};
