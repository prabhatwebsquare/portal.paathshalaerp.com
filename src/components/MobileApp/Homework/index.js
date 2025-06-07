import {
  Badge,
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { find, groupBy, map, uniqBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { AddIcon } from "@chakra-ui/icons";
import { MdDriveFolderUpload } from "react-icons/md";
import { useStaffStore } from "@/store/StaffStore";
import { STATUS } from "@/constant";
import { AddHomework } from "./AddHomework";
import { MdPublish } from "react-icons/md";
import { useMobileAppStore } from "@/store/MobileApp";
import { LoadingContainer } from "@/common/LoadingContainer";
import { CustomSelect } from "@/common/CustomSelect";
import { useClassSetupStore } from "@/store/classSetup";
import { FILE_URL } from "@/services/apis";
import { FiFileText } from "react-icons/fi";

export const Homework = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [inputValue, setInputValue] = useState();
  const {
    getHomeWorkAction,
    getHomeWorkStatus,
    allHomework,
    deleteHomeWorkAction,
  } = useMobileAppStore((s) => ({
    getHomeWorkAction: s.getHomeWorkAction,
    getHomeWorkStatus: s.getHomeWorkStatus,
    allHomework: s.allHomework,
    deleteHomeWorkAction: s.deleteHomeWorkAction,
  }));

  const deleteChapter = (id) => {
    deleteHomeWorkAction(id);
  };

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const getData = () => {
    getHomeWorkAction({
      sessionMasterId,
      classMasterId: inputValue.classMasterId,
      streamMasterId: inputValue.streamMasterId,
      subjectMasterId: inputValue.subjectMasterId,
      sectionMasterId: inputValue.sectionMasterId,
    });
  };

  const { getSectionAction, getSectionStatus, allSections } =
    useClassSetupStore((s) => ({
      getSectionAction: s.getSectionAction,
      getSectionStatus: s.getSectionStatus,
      allSections: s.allSections,
    }));

  useEffect(() => {
    // this effect should only run once on mount if it's fetching data initially
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
    if ((getSectionStatus || 1) === STATUS.NOT_STARTED) {
      getSectionAction();
    }
  }, []); // Empty dependency array will run this effect once on component mount

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const openDetailsModal = (chapter) => {
    setSelectedChapter(chapter);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedChapter(null);
    setIsModalOpen(false);
  };

  return (
    <Box>
      {/* Page Header */}
      <PageHeader
        heading={"Homework"}
        extra={
          <Button
            size={"sm"}
            colorScheme={themeColor}
            onClick={() => setToggleDrawer([])}
            leftIcon={<AddIcon />}
          >
            Add Homework
          </Button>
        }
      />

      {/* Filter Section */}
      <Box bg={"white"} boxShadow={"lg"} borderRadius={"md"} p={5} mb={5}>
        <HStack spacing={5} mb={10}>
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
              uniqBy(classes?.[inputValue?.classMasterId], "streamMasterId"),
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
          <CustomSelect
            size={"md"}
            name={"sectionMasterId"}
            label={"Select Section"}
            inputValue={inputValue}
            setInputValue={setInputValue}
            data={map(allSections, (d) => ({
              value: d.id,
              name: d.name,
            }))}
          />
          <Button
            size={"sm"}
            width={"15%"}
            colorScheme={themeColor}
            onClick={() => {
              // Make sure inputValue is valid before calling getData
              if (
                inputValue?.classMasterId &&
                inputValue?.streamMasterId &&
                inputValue?.subjectMasterId
              ) {
                getData();
              }
            }}
          >
            Get
          </Button>
        </HStack>
        <Box className="scrollBar" p={0} bg={"white"}>
          <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
            <LoadingContainer status={getHomeWorkStatus}>
              <TableContainer
                mt={2}
                h={"63vh"}
                overflowY="auto"
                className="scrollBar"
              >
                <Table w="100%" size="lg" variant="simple" colorScheme="gray">
                  {allHomework?.length > 0 && (
                    <>
                      <Thead>
                        <Tr>
                          <Th
                            textAlign="center"
                            position="sticky"
                            top={0}
                            bg="white"
                            zIndex="1"
                          >
                            Sr. No.
                          </Th>
                          <Th
                            textAlign="center"
                            position="sticky"
                            top={0}
                            bg="white"
                            zIndex="1"
                          >
                            Staff
                          </Th>
                          <Th
                            textAlign="center"
                            position="sticky"
                            top={0}
                            bg="white"
                            zIndex="1"
                          >
                            Class
                          </Th>
                          <Th
                            textAlign="center"
                            position="sticky"
                            top={0}
                            bg="white"
                            zIndex="1"
                          >
                            Stream
                          </Th>
                          <Th
                            textAlign="center"
                            position="sticky"
                            top={0}
                            bg="white"
                            zIndex="1"
                          >
                            Subject
                          </Th>
                          <Th
                            textAlign="center"
                            position="sticky"
                            top={0}
                            bg="white"
                            zIndex="1"
                          >
                            Topic
                          </Th>
                          <Th
                            textAlign="center"
                            position="sticky"
                            top={0}
                            bg="white"
                            zIndex="1"
                          >
                            Status
                          </Th>
                          <Th
                            textAlign="center"
                            position="sticky"
                            top={0}
                            bg="white"
                            zIndex="1"
                          >
                            Action
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {allHomework?.map((chapter, index) => (
                          <Tr key={chapter?.id}>
                            <Td textAlign="center">{index + 1}</Td>
                            <Td textAlign="center">{chapter?.staff.name}</Td>
                            <Td textAlign="center">
                              {chapter?.class_master.name}
                            </Td>
                            <Td textAlign="center">
                              {chapter?.stream_master.name}
                            </Td>
                            <Td textAlign="center">
                              {chapter?.subject_master.name}
                            </Td>
                            <Td textAlign="center">{chapter?.topic}</Td>
                            <Td textAlign="center">
                              <Badge
                                colorScheme={
                                  chapter?.isPublish == 1 ? "green" : "red"
                                }
                                variant="outline"
                              >
                                {chapter?.isPublish == 1
                                  ? "Published"
                                  : "Not Published"}
                              </Badge>
                            </Td>
                            <Td textAlign="center">
                              <HStack spacing={2} justify="center">
                                <Button
                                  size="sm"
                                  colorScheme={themeColor}
                                  variant="solid"
                                  onClick={() => setToggleDrawer(chapter)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  colorScheme={themeColor}
                                  variant="solid"
                                  onClick={() => openDetailsModal(chapter)}
                                >
                                  View Details
                                </Button>
                                <Button
                                  size="sm"
                                  colorScheme="red"
                                  variant="outline"
                                  onClick={() => deleteChapter(chapter?.id)}
                                >
                                  Delete
                                </Button>
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </>
                  )}
                </Table>
              </TableContainer>
            </LoadingContainer>
          </Box>
        </Box>
      </Box>
      <Modal size={"2xl"} isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent bg="gray.50" borderRadius="lg" shadow="xl">
          <ModalHeader
            bg={`${themeColor}.500`}
            color="white"
            borderTopRadius="lg"
            py={4}
            textAlign="center"
          >
            Homework Details
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody py={6} px={8}>
            {selectedChapter && (
              <VStack align="start" spacing={5}>
                <HStack>
                  <Box w="100px" fontWeight="bold">
                    Staff:
                  </Box>
                  <Text>{selectedChapter.staff.name}</Text>
                </HStack>
                <HStack>
                  <Box w="100px" fontWeight="bold">
                    Class:
                  </Box>
                  <Text>{selectedChapter.class_master.name}</Text>
                </HStack>
                <HStack>
                  <Box w="100px" fontWeight="bold">
                    Stream:
                  </Box>
                  <Text>{selectedChapter.stream_master.name}</Text>
                </HStack>
                <HStack>
                  <Box w="100px" fontWeight="bold">
                    Subject:
                  </Box>
                  <Text>{selectedChapter.subject_master.name}</Text>
                </HStack>
                <HStack>
                  <Box w="100px" fontWeight="bold">
                    Topic:
                  </Box>
                  <Text>{selectedChapter.topic}</Text>
                </HStack>
                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Description:
                  </Text>
                  <Text>{selectedChapter.description}</Text>
                </Box>
                <HStack>
                  <Box w="100px" fontWeight="bold">
                    Date:
                  </Box>
                  <Text>
                    {new Date(selectedChapter.date).toLocaleDateString()}
                  </Text>
                </HStack>
                {selectedChapter.file && (
                  <Box
                    w="full"
                    py={4}
                    px={6}
                    borderWidth={1}
                    borderColor={`${themeColor}.300`}
                    bg={`${themeColor}.50`}
                    borderRadius="md"
                    shadow="sm"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box display="flex" alignItems="center">
                      <Icon
                        as={FiFileText}
                        boxSize={6}
                        color={`${themeColor}.500`}
                        mr={3}
                      />
                      <Text
                        fontSize="md"
                        fontWeight="semibold"
                        color={`${themeColor}.700`}
                      >
                        Attached File
                      </Text>
                    </Box>
                    <Link
                      href={`${FILE_URL}${selectedChapter.file}`}
                      color={`${themeColor}.600`}
                      fontWeight="bold"
                      fontSize="sm"
                      textDecoration="none"
                      isExternal
                      _hover={{
                        textDecoration: "underline",
                        color: `${themeColor}.700`,
                      }}
                    >
                      Download
                    </Link>
                  </Box>
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter bg="gray.100" borderBottomRadius="lg" py={4}>
            <Button colorScheme={themeColor} onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {toggleDrawer && (
        <AddHomework
          sessionMasterId={sessionMasterId}
          themeColor={themeColor}
          data={toggleDrawer}
          closeDrawer={() => setToggleDrawer(null)}
        />
      )}
    </Box>
  );
};
