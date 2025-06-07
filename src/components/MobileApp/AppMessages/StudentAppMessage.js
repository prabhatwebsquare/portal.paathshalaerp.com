import { DeleteButton } from "@/common/DeleteButton";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { AddIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
  Image,
  Text,
  ScaleFade,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAppStore } from "@/store/App";
import { AddAppMessage } from "./AddAppMessage";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { FILE_URL } from "@/services/apis";

export const StudentAppMessage = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [selectedStudentMessage, setSelectedStudentMessage] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  const {
    getMessageAction,
    getMessageStatus,
    allMessages,
    deleteMessageAction,
    deleteMessageStatus,
    resetMessageStatus,
  } = useAppStore((s) => ({
    getMessageAction: s.getMessageAction,
    getMessageStatus: s.getMessageStatus,
    allMessages: s.allMessages,
    deleteMessageAction: s.deleteMessageAction,
    deleteMessageStatus: s.deleteMessageStatus,
    resetMessageStatus: s.resetMessageStatus,
  }));

  useEffect(() => {
    getMessageAction({ sessionMasterId });
  }, [getMessageAction, sessionMasterId]);

  const deleteMessage = async (id) => {
    await deleteMessageAction(id);
    getMessageAction({ sessionMasterId });
  };

  const handleShowMore = (message) => {
    setSelectedMessage(message);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMessage("");
    setModalOpen(false);
  };

  const handleViewStudents = (notice) => {
    setSelectedStudentMessage(notice);
    setIsStudentModalOpen(true);
  };

  const closeStudentModal = () => {
    setIsStudentModalOpen(false);
    setSelectedStudentMessage(null);
  };

  const getTruncatedMessage = (message) => {
    const words = message.split(" ");
    if (words.length <= 8) return message;
    return words.slice(0, 8).join(" ") + "...";
  };

  return (
    <Box pos="relative" h="70vh">
      <Box className="scrollBar" h="100%" maxH="90%" overflowY="scroll">
        <LoadingContainer status={getMessageStatus}>
          <Box mt={4}>
            <Heading size="md" color={`${themeColor}.600`} mb={4}>
              All Messages
            </Heading>
            <Table variant="striped" colorScheme={themeColor}>
              <Thead>
                <Tr>
                  <Th>Sr. No.</Th>
                  <Th>Class</Th>
                  <Th>Stream</Th>
                  <Th>Title</Th>
                  <Th>Date</Th>
                  <Th>Message</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {allMessages?.map((notice, index) => (
                  <Tr key={notice?.id}>
                    <Td>{allMessages.length - index}</Td>
                    <Td>{notice?.class_master?.name || "All"}</Td>
                    <Td>{notice?.stream_master?.name || "All"}</Td>
                    <Td>{notice?.subject || "N/A"}</Td>
                    <Td>{new Date(notice?.date).toLocaleDateString()}</Td>
                    <Td>
                      {getTruncatedMessage(notice?.message)}
                      {notice.message.split(" ").length > 8 && (
                        <Button
                          variant="link"
                          size="xs"
                          ml={2}
                          onClick={() => handleShowMore(notice?.message)}
                        >
                          Show More
                        </Button>
                      )}
                    </Td>
                    <Td>
                      <Flex gap={2}>
                       
                        {/* <IconButton
                          size="sm"
                          icon={<EditIcon />}
                          colorScheme={themeColor}
                          onClick={() => setToggleDrawer(notice)}
                          aria-label="Edit Message"
                        /> */}
                        <DeleteButton
                          size="sm"
                          description="Are you sure you want to delete this message?"
                          confirm={() => deleteMessage(notice?.id)}
                          status={deleteMessageStatus}
                          reset={resetMessageStatus}
                        />
                         {notice?.student_messages?.length > 0 && (
                          <Tooltip label="View Students">
                            <IconButton
                              size="sm"
                              icon={<ViewIcon />}
                              colorScheme="blue"
                              onClick={() => handleViewStudents(notice)}
                              aria-label="View Students"
                            />
                          </Tooltip>
                        )}
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </LoadingContainer>

        <Modal
          isOpen={isStudentModalOpen}
          onClose={closeStudentModal}
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>All Student Details</ModalHeader>
            <ModalCloseButton />

            <ModalBody maxH="60vh" overflowY="auto" pr={2}>
              <Table size="sm">
                <Thead position="sticky" top={0} bg="white" zIndex="docked">
                  <Tr>
                    <Th>Photo</Th>
                    <Th>Name</Th>
                    <Th>Admission No</Th>
                    <Th>Father Name</Th>
                    <Th>Contact</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {selectedStudentMessage?.student_messages?.map((s, idx) => {
                    const student = s?.promotion?.student_master;
                    return (
                      <Tr key={idx}>
                        <Td>
                          <Image
                            src={
                              FILE_URL + (student?.photo || "default-photo.png")
                            }
                            alt={student?.studentName}
                            boxSize="40px"
                            borderRadius="full"
                          />
                        </Td>
                        <Td>{student?.studentName || "N/A"}</Td>
                        <Td>{student?.admissionNo || "N/A"}</Td>
                        <Td>{student?.fatherName || "N/A"}</Td>
                        <Td>{student?.studentContact || "N/A"}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <Button onClick={closeStudentModal}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Add Button */}
        {HasPermission(PERMISSIONS.APP_MESSAGE_ADD) && (
          <Tooltip placement="top" label={"Add New Message"}>
            <Flex
              pos="absolute"
              bottom={8}
              right={8}
              w="50px"
              h="50px"
              bg={`${themeColor}.500`}
              justify="center"
              align="center"
              borderRadius="50%"
              color="white"
              cursor="pointer"
              onClick={() => setToggleDrawer([])}
            >
              <AddIcon />
            </Flex>
          </Tooltip>
        )}

        {/* Drawer to Add/Edit Message */}
        {toggleDrawer && (
          <AddAppMessage
            themeColor={themeColor}
            sessionMasterId={sessionMasterId}
            data={toggleDrawer}
            closeDrawer={() => setToggleDrawer(null)}
          />
        )}

        {/* Full Message Modal */}
        <FullMessageModal
          themeColor={themeColor}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          message={selectedMessage}
        />
      </Box>
    </Box>
  );
};

const FullMessageModal = ({ themeColor, isOpen, onClose, message }) => {
  return (
    <ScaleFade initialScale={0.95} in={isOpen}>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent
          border={`2px solid ${themeColor}.700`}
          borderRadius="lg"
          boxShadow={`0 4px 12px ${themeColor}.500`}
          bg="white"
          maxW={{ base: "90%", md: "500px" }}
        >
          <ModalHeader
            bgGradient={`linear(to-r, ${themeColor}.600, ${themeColor}.700)`}
            color="white"
            fontSize="xl"
            fontWeight="bold"
            textAlign="center"
            borderTopRadius="lg"
            py={3}
          >
            🚀 Message
          </ModalHeader>
          <ModalCloseButton
            bg={`${themeColor}.700`}
            color="white"
            borderRadius="full"
            _hover={{ bg: `${themeColor}.800` }}
            _focus={{ boxShadow: `0 0 0 3px ${themeColor}.300` }}
            size="sm"
            mt={2}
            mr={2}
            aria-label="Close modal"
          />
          <ModalBody
            bg={`${themeColor}.50`}
            // color="white"
            p={4}
            borderRadius="md"
            fontSize="md"
            lineHeight="1.8"
          >
            <Text>{message || "No message provided."}</Text>
          </ModalBody>
          <ModalFooter
            bg={`${themeColor}.50`}
            borderTop={`1px solid ${themeColor}.600`}
            borderBottomRadius="lg"
            p={4}
            justifyContent="center"
          >
            <Button
              colorScheme={themeColor}
              bg={`${themeColor}.700`}
              color="white"
              borderRadius="full"
              px={6}
              _hover={{ bg: `${themeColor}.800`, transform: "translateY(-2px)" }}
              _focus={{ boxShadow: `0 0 0 3px ${themeColor}.300` }}
              transition="all 0.2s"
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ScaleFade>
  );
};
