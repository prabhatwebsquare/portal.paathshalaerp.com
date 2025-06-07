import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Select,
  Input,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  Text,
  IconButton,
  Flex,
  Icon,
  Tooltip,
  Link,
  Badge,
  Divider,
  ScaleFade,
} from "@chakra-ui/react";
import { MainLayout } from "@/layout/MainLayout";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { DeleteIcon, DownloadIcon, EditIcon } from "@chakra-ui/icons";
import { PageHeader } from "@/common/PageHeader";
import { CustomSelect } from "@/common/CustomSelect";
import { useClassSetupStore } from "@/store/classSetup";
import { find, groupBy, map, uniqBy } from "lodash";
import { STATUS } from "@/constant";
import { FiFileText, FiUpload } from "react-icons/fi";
import { useMobileAppStore } from "@/store/MobileApp";
import { FILE_URL } from "@/services/apis";

const CreateSyllabus = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
  );
  const {
    getSyllabusAction,
    getSyllabusStatus,
    allSyllabus,
    deleteSyllabusAction,
    deleteSyllabusStatus,
    addSyllabusAction,
    addSyllabusStatus,
    updateSyllabusAction,
    updateSyllabusStatus,
  } = useMobileAppStore((s) => ({
    getSyllabusAction: s.getSyllabusAction,
    getSyllabusStatus: s.getSyllabusStatus,
    allSyllabus: s.allSyllabus,
    deleteSyllabusAction: s.deleteSyllabusAction,
    deleteSyllabusStatus: s.deleteSyllabusStatus,
    addSyllabusAction: s.addSyllabusAction,
    addSyllabusStatus: s.addSyllabusStatus,
    updateSyllabusAction: s.updateSyllabusAction,
    updateSyllabusStatus: s.updateSyllabusStatus,
  }));
  const handleCreateSyllabus = async () => {
    const data = {
      ...inputValue,
      sessionMasterId,
    };
    if (inputValue.id) {
      await updateSyllabusAction(data);
    } else {
      await addSyllabusAction(data);
    }
    getSyllabusAction({ sessionMasterId });
  };

  useEffect(() => {
    getSyllabusAction({ sessionMasterId });
    return () => {};
  }, []);
  useEffect(() => {
    if (
      addSyllabusStatus == STATUS.SUCCESS ||
      updateSyllabusStatus == STATUS.SUCCESS
    ) {
      onClose();
    }
    return () => {};
  }, [addSyllabusStatus, updateSyllabusStatus]);

  const themeColor = getLocalStorageItem("themeColor") || "blue";
  const handleDeleteSyllabus = (id) => {
    deleteSyllabusAction(id);
  };
  const [inputValue, setInputValue] = useState({});

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
  }, [getClassSubjectStatus]);
  const [stdPhoto, setStdPhoto] = useState(null);
  const selectedFile = (file) => {
    setInputValue((prev) => ({ ...prev, file: file }));
    setStdPhoto(file);
  };
  const inputRef = useRef();

  const handleEditSyllabus = (syllabus) => {
    inputValue.id = syllabus?.id;
    inputValue.classMasterId = syllabus?.class_master.id;
    inputValue.streamMasterId = syllabus?.stream_master.id;
    inputValue.file = syllabus?.file;
    inputValue.subjectMasterId = syllabus?.subject_master.id;
    onOpen();
  };

  return (
    <MainLayout>
      <Box bg={"white"}>
        <PageHeader
          heading={"Syllabus"}
          extra={
            <HStack justifyContent={"end"}>
              <Button size={"sm"} colorScheme={themeColor} onClick={onOpen}>
                Create Syllabus
              </Button>
            </HStack>
          }
        />

        <Box p={4} bg="white">
          <Flex
            maxH={"75vh"}
            overflow={"auto"}
            className="scrollBar"
            width="100%"
            pt={10}
            gap={12}
            justifyContent={allSyllabus?.length <= 2 ? "center" : "flex-start"} // Center align for fewer items
            flexWrap="wrap" // Allow wrapping for better spacing
          >
            {allSyllabus?.map((syllabus, index) => (
              <Box
                key={index}
                w={allSyllabus?.length <= 2 ? "800px" : "280px"} // Use fixed width for clarity
                borderWidth="2px"
                borderRadius="xl"
                overflow="hidden"
                boxShadow="2xl"
                bg="white"
                _hover={{
                  transform: "scale(1.05)",
                  boxShadow: "xl",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                transition="transform 0.3s, box-shadow 0.3s"
              >
                {/* Header */}
                <Box
                  bg={`${themeColor}.500`}
                  p={5}
                  color="white"
                  textAlign="center"
                >
                  <Text fontSize="xl" fontWeight="bold">
                    {syllabus?.class_master.name}
                  </Text>
                </Box>

                {/* Content */}
                <VStack align="start" spacing={4} p={8}>
                  <Text fontSize="lg" color="gray.700">
                    <b>Class:</b> {syllabus?.class_master.name}
                  </Text>
                  <Text fontSize="lg" color="gray.700">
                    <b>Faculty:</b> {syllabus?.stream_master.name}
                  </Text>
                  <Text fontSize="lg" color="gray.700">
                    <b>Subject:</b> {syllabus?.subject_master.name}
                  </Text>

                  <Divider />
                  <Flex justifyContent="space-between" w="full" mt={4}>
                    <Tooltip label="Edit Syllabus" aria-label="Edit Syllabus">
                      <Button
                        size="md"
                        colorScheme="yellow"
                        leftIcon={<EditIcon />}
                        onClick={() => handleEditSyllabus(syllabus)}
                      >
                        Edit
                      </Button>
                    </Tooltip>
                    <Tooltip
                      label="Delete Syllabus"
                      aria-label="Delete Syllabus"
                    >
                      <IconButton
                        aria-label="Delete Syllabus"
                        icon={<DeleteIcon />}
                        size="md"
                        colorScheme="red"
                        onClick={() => handleDeleteSyllabus(syllabus.id)}
                      />
                    </Tooltip>
                  </Flex>

                  {/* Download PDF */}
                  <Flex justifyContent="center" w="full" mt={6}>
                    <Link
                      href={`${FILE_URL}${syllabus?.file}`}
                      target="_blank"
                      textDecoration="none"
                      fontWeight="medium"
                    >
                      <Button
                        size="md"
                        colorScheme={themeColor}
                        leftIcon={<DownloadIcon />}
                      >
                        Download PDF
                      </Button>
                    </Link>
                  </Flex>
                </VStack>
              </Box>
            ))}
          </Flex>
        </Box>
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Create Syllabus</DrawerHeader>

            <DrawerBody>
              <VStack spacing={4} align="stretch">
                <CustomSelect
                  size={"md"}
                  name={"classMasterId"}
                  label={"Select Class"}
                  notRequire={true}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(classes, (d, key) => ({
                    value: key,
                    name: d?.[0]?.class_master?.name,
                  }))}
                />
                <CustomSelect
                  size={"md"}
                  name={"streamMasterId"}
                  label={"Select Stream"}
                  notRequire={true}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(
                    uniqBy(
                      classes?.[inputValue?.classMasterId],
                      "streamMasterId"
                    ),
                    (d) => ({
                      value: d.stream_master?.id,
                      name: d.stream_master.name,
                    })
                  )}
                />
                <CustomSelect
                  size={"md"}
                  name={"subjectMasterId"}
                  label={"Select Subject"}
                  notRequire={true}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(
                    find(
                      allClassSubjects,
                      (s) =>
                        s.classMasterId == inputValue?.classMasterId &&
                        s.streamMasterId == inputValue?.streamMasterId
                    )?.assign_class_subjects,
                    (c) => ({
                      value: c.subjectMasterId,
                      name: c.subject_master?.name,
                    })
                  )}
                />

                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  w="100%"
                  onClick={() => inputRef.current?.click()}
                  p={4}
                >
                  {/* Display PDF Info or Placeholder */}
                  {stdPhoto || inputValue?.file ? (
                    <Box
                      p={4}
                      bg={`${themeColor}.50`}
                      borderRadius="md"
                      border="1px solid"
                      borderColor={`${themeColor}.300`}
                      textAlign="center"
                      w="100%"
                    >
                      <Icon
                        as={FiFileText}
                        boxSize={12}
                        color={themeColor}
                        mb={3}
                      />
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color={`${themeColor}.600`}
                      >
                        {stdPhoto ? stdPhoto.name : inputValue?.file}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        PDF file uploaded successfully
                      </Text>
                    </Box>
                  ) : (
                    <Box
                      p={6}
                      bg="gray.50"
                      borderRadius="md"
                      border="2px dashed"
                      borderColor="gray.300"
                      textAlign="center"
                      _hover={{
                        bg: "gray.100",
                        borderColor: `${themeColor}.400`,
                      }}
                      w="100%" // Ensures the Box takes full width
                    >
                      <Icon
                        as={FiUpload}
                        boxSize={10}
                        color={themeColor}
                        mb={4}
                      />
                      <Text fontSize="lg" fontWeight="medium" color="gray.600">
                        Click to Upload PDF
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        Only PDF files are accepted
                      </Text>
                    </Box>
                  )}

                  {/* Hidden File Input */}
                  <Input
                    ref={inputRef}
                    id="pdf-upload"
                    type="file"
                    display="none"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        selectedFile(file);
                      }
                    }}
                  />
                </Flex>
              </VStack>
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme={themeColor} onClick={handleCreateSyllabus}>
                Create Syllabus
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Box>
    </MainLayout>
  );
};

export default CreateSyllabus;
