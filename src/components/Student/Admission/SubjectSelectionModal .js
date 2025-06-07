import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Checkbox,
  Box,
  Flex,
  Button,
  Card,
  Text,
  useDisclosure,
  VStack,
  HStack,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";

const SubjectSelectionModal = ({
  themeColor,
  subjects,
  inputValue,
  selectAllSubject,
  checkHandler,
  classSub,
  heading,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        width="100%"
        color="white"
        fontWeight="bold"
        onClick={onOpen}
        bgGradient={`linear(to-r, ${themeColor}.900, ${themeColor}.500)`}
        _hover={{ bgGradient: `linear(to-r, ${themeColor}.600, ${themeColor}.50)` }}
      >
        {heading || "Choose Subjects"}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" borderRadius={"2xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            boxShadow={"lg"}
            borderRadius={"md"}
            color="black"
            fontWeight="bold"
            onClick={onOpen}
            bgGradient={`linear(to-r, ${themeColor}.50, ${themeColor}.600)`}
          >
            {heading || "Choose Subjects"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {subjects?.length ? (
              <Box>
                {["Optional"].map((type) => (
                  <Box key={type} my={3}>
                    <Card
                      p={4}
                      mb={4}
                      shadow="md"
                      border="1px solid #e2e8f0"
                      bgGradient={`linear(to-b, ${themeColor}.50, white)`}
                      borderRadius="lg"
                      transition="all 0.3s ease"
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                      }}
                    >
                      <Flex align="center" mb={4}>
                        <Checkbox
                          isChecked={
                            inputValue.selectedSubject?.length +
                              classSub?.length ===
                            subjects?.length
                          }
                          onChange={selectAllSubject}
                          colorScheme={themeColor}
                          size="lg"
                        >
                          <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            color={`${themeColor}.700`}
                            textTransform="uppercase"
                            ml={2}
                          >
                            Select All {type} Subjects
                          </Text>
                        </Checkbox>
                      </Flex>

                      <SimpleGrid
                        columns={{ base: 1, md: 2 }}
                        spacing={4}
                        w="100%"
                      >
                        {subjects
                          .filter((data) => data.subjectType === type)
                          .map((s) => {
                            const checked =
                              inputValue.selectedSubject?.includes(
                                s.subject_master.id
                              );
                            const notOptional = classSub.some(
                              (f) => f.subject_master.id === s.subject_master.id
                            );

                            return (
                              <HStack
                                key={s.subject_master.id}
                                p={3}
                                borderWidth="1px"
                                borderRadius="md"
                                shadow="sm"
                                bg="white"
                                transition="all 0.3s ease"
                                _hover={{
                                  transform: "translateX(5px)",
                                  boxShadow: "md",
                                  borderColor: `${themeColor}.200`,
                                }}
                              >
                                <Checkbox
                                  isChecked={notOptional || checked}
                                  isDisabled={s.subjectType !== "Optional"}
                                  colorScheme={themeColor}
                                  onChange={() =>
                                    checkHandler(s.subject_master.id)
                                  }
                                  size="lg"
                                />
                                <Box flex="1">
                                  <Text fontWeight="bold" color="gray.700">
                                    {s.subject_master?.name}
                                  </Text>
                                </Box>
                              </HStack>
                            );
                          })}
                      </SimpleGrid>
                    </Card>
                  </Box>
                ))}

                <Box my={3}>
                  <Card
                    p={4}
                    mb={4}
                    shadow="md"
                    border="1px solid #e2e8f0"
                    bgGradient={`linear(to-b, ${themeColor}.50, white)`}
                    borderRadius="lg"
                    transition="all 0.3s ease"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                  >
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      mb={2}
                      color={`${themeColor}.700`}
                      textTransform="uppercase"
                    >
                      Additional & Compulsory Subjects
                    </Text>
                    <SimpleGrid
                      columns={{ base: 1, md: 2 }}
                      spacing={4}
                      w="100%"
                    >
                      {subjects
                        .filter((data) => data.subjectType !== "Optional")
                        .map((s) => {
                          const checked = inputValue.selectedSubject?.includes(
                            s.subject_master.id
                          );
                          const notOptional = classSub.some(
                            (f) => f.subject_master.id === s.subject_master.id
                          );

                          return (
                            <HStack
                              key={s.subject_master.id}
                              p={3}
                              borderWidth="1px"
                              borderRadius="md"
                              shadow="sm"
                              bg="white"
                              transition="all 0.3s ease"
                              _hover={{
                                transform: "translateX(5px)",
                                boxShadow: "md",
                                borderColor: `${themeColor}.200`,
                              }}
                            >
                              <Checkbox
                                isChecked={notOptional || checked}
                                isDisabled={s.subjectType !== "Optional"}
                                colorScheme={themeColor}
                                onChange={() =>
                                  checkHandler(s.subject_master.id)
                                }
                                size="lg"
                              />
                              <Box flex="1">
                                <Text fontWeight="bold" color="gray.700">
                                  {s.subject_master?.name}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                  {s.subjectType}
                                </Text>
                              </Box>
                            </HStack>
                          );
                        })}
                    </SimpleGrid>
                  </Card>
                </Box>
              </Box>
            ) : (
              <Text>No subjects available.</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SubjectSelectionModal;
