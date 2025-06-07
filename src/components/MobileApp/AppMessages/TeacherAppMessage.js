import {
  Box,
  Flex,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ScaleFade,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { PhoneIcon, EmailIcon } from "@chakra-ui/icons";
import { IoBriefcase, IoCodeWorking, IoSchool } from "react-icons/io5";
import { AddIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { useAppStore } from "@/store/App";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { DeleteButton } from "@/common/DeleteButton";
import { AddTeacherAppMessage } from "./AddTeacherAppMessage";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const TeacherAppMessage = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const {
    getTeachMessageAction,
    getTeachMessageStatus,
    allTeachMessages,
    deleteMessageAction,
    deleteMessageStatus,
    resetMessageStatus,
  } = useAppStore((s) => ({
    getTeachMessageAction: s.getTeachMessageAction,
    getTeachMessageStatus: s.getTeachMessageStatus,
    allTeachMessages: s.allTeachMessages,
    deleteMessageAction: s.deleteMessageAction,
    deleteMessageStatus: s.deleteMessageStatus,
    resetMessageStatus: s.resetMessageStatus,
  }));

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    getTeachMessageAction({ sessionMasterId });
  }, [getTeachMessageAction, sessionMasterId]);

  const deleteMessage = async (id) => {
    await deleteMessageAction(id);
    getTeachMessageAction({ sessionMasterId });
  };

  const handleView = (staff) => {
    setSelectedStaff(staff);
    onOpen();
  };
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headerBg = useColorModeValue(`${themeColor}.600`, `${themeColor}.900`);
  return (
    <Box pos={"relative"} h={"60vh"}>
      <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
        <LoadingContainer status={getTeachMessageStatus}>
          {allTeachMessages?.length ? (
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead bg={`${themeColor}.100`}>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Message</Th>
                    <Th>Staffs</Th>
                    <Th textAlign="center">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {map(allTeachMessages, (msg, index) => (
                    <Tr key={index}>
                      <Td>{new Date(msg.date).toLocaleDateString()}</Td>
                      <Td>{msg.message}</Td>
                      <Td>
                        {/* {msg.staff_messages?.map((s) => (
                          <Text key={s.id}>{s.staff?.name}</Text>
                        ))} */}
                        {msg.staff_messages?.length} Staffs
                      </Td>
                      <Td>
                        <Flex justify={"center"} gap={2}>
                
                          <Tooltip label="Delete">
                            <DeleteButton
                              size="sm"
                              variant="solid"
                              description="Are you sure you want to delete this message?"
                              confirm={() => deleteMessage(msg.id)}
                              status={deleteMessageStatus}
                              reset={resetMessageStatus}
                            />
                          </Tooltip>
                          <Tooltip label="View Staffs">
                            <IconButton
                              size="sm"
                              icon={<ViewIcon />}
                              colorScheme="blue"
                              onClick={() => handleView(msg.staff_messages)}
                              aria-label="View"
                            />
                          </Tooltip>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <NoData title="No Teacher Message Found" />
          )}
        </LoadingContainer>

        {HasPermission(PERMISSIONS.APP_MESSAGE_ADD) && (
          <Tooltip placement="top" label={"Add Teacher Message"}>
            <Flex
              pos={"absolute"}
              bottom={10}
              right={10}
              w={"50px"}
              h={"50px"}
              bg={`${themeColor}.500`}
              justify={"center"}
              align={"center"}
              borderRadius={"50%"}
              color={"white"}
              onClick={() => setToggleDrawer([])}
              cursor="pointer"
            >
              <AddIcon />
            </Flex>
          </Tooltip>
        )}

        {toggleDrawer && (
          <AddTeacherAppMessage
            type="exam"
            themeColor={themeColor}
            sessionMasterId={sessionMasterId}
            data={toggleDrawer}
            closeDrawer={() => setToggleDrawer(null)}
          />
        )}

<ScaleFade initialScale={0.95} in={isOpen}>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "lg" }} isCentered>
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent
          bg={cardBg}
          borderRadius="xl"
          border={`2px solid ${themeColor}.700`}
          boxShadow={`0 6px 12px ${themeColor}.300`}
          maxW={{ base: "95%", md: "600px" }}
          mx={2}
        >
          <ModalHeader
            bgGradient={`linear(to-r, ${themeColor}.600, ${themeColor}.700)`}
            color="white"
            fontSize="xl"
            fontWeight="bold"
            textAlign="center"
            borderTopRadius="xl"
            py={3}
          >
            Teacher Details
          </ModalHeader>
          <ModalCloseButton
            bg={`${themeColor}.700`}
            color="white"
            borderRadius="full"
            _hover={{ bg: `${themeColor}.800` }}
            _focus={{ boxShadow: `0 0 0 3px ${themeColor}.300` }}
            size="sm"
            mt={3}
            mr={3}
            aria-label="Close modal"
          />
          <ModalBody
            maxH="60vh"
            overflowY="auto"
            pr={2}
            py={4}
            px={{ base: 3, md: 4 }}
            className="scrollBar"
          >
            {selectedStaff?.length > 0 ? (
              selectedStaff.map((staffMsg, i) => (
                <Box
                  key={i}
                  p={4}
                  bg={`${themeColor}.50`}
                  borderRadius="lg"
                  mb={3}
                  border="1px solid"
                  borderColor={`${themeColor}.100`}
                  _hover={{
                    bg: `${themeColor}.100`,
                    boxShadow: `0 4px 8px ${themeColor}.200`,
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s ease"
                >
                  <Flex direction="column" gap={2} fontSize={{ base: "sm", md: "md" }} color={textColor}>
                    <Flex align="center" gap={2}>
                      <Icon as={IoSchool} color={`${themeColor}.600`} boxSize={5} />
                      <Text fontWeight="bold">
                        Name: <Text as="span" fontWeight="medium">{staffMsg.staff?.name || "N/A"}</Text>
                      </Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                      <Icon as={PhoneIcon} color={`${themeColor}.600`} boxSize={5} />
                      <Text fontWeight="bold">
                        Mobile: <Text as="span" fontWeight="medium">{staffMsg.staff?.mobileNo || "N/A"}</Text>
                      </Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                      <Icon as={EmailIcon} color={`${themeColor}.600`} boxSize={5} />
                      <Text fontWeight="bold">
                        Email: <Text as="span" fontWeight="medium">{staffMsg.staff?.email || "N/A"}</Text>
                      </Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                      <Icon as={IoBriefcase} color={`${themeColor}.600`} boxSize={5} />
                      <Text fontWeight="bold">
                        Department: <Text as="span" fontWeight="medium">{staffMsg.staff?.department || "N/A"}</Text>
                      </Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                      <Icon as={IoCodeWorking} color={`${themeColor}.600`} boxSize={5} />
                      <Text fontWeight="bold">
                        Designation: <Text as="span" fontWeight="medium">{staffMsg.staff?.designation || "N/A"}</Text>
                      </Text>
                    </Flex>
                    <Flex align="center" gap={2}>
                      <Icon as={IoSchool} color={`${themeColor}.600`} boxSize={5} />
                      <Text fontWeight="bold">
                        Employee Code: <Text as="span" fontWeight="medium">{staffMsg.staff?.employeeCode || "N/A"}</Text>
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              ))
            ) : (
              <Text textAlign="center" color={textColor} fontSize="md">
                No teacher details available.
              </Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </ScaleFade>
      </Box>
    </Box>
  );
};
