import { useState, useEffect } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { SiGoogleclassroom } from "react-icons/si";
import { DeleteIcon, PhoneIcon } from "@chakra-ui/icons";
import { URL } from "@/services/apis";
import { map } from "lodash";
import { useStdFeesStore } from "@/store/stdFees";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { LoadingContainer } from "@/common/LoadingContainer";
import { PageHeader } from "@/common/PageHeader";
import { AddSiblings } from "./AddSiblings";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const SiblingsRelation = ({ sessionMasterId, themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);

  const {
    getAllSiblingsAction,
    getAllSiblingsStatus,
    allSiblings,
    deleteSibling,
    deleteSiblingStatus,
  } = useStdFeesStore((s) => ({
    getAllSiblingsAction: s.getAllSiblingsAction,
    getAllSiblingsStatus: s.getAllSiblingsStatus,
    allSiblings: s.allSiblings,
    deleteSibling: s.deleteSibling,
    deleteSiblingStatus: s.deleteSiblingStatus,
  }));

  useEffect(() => {
    if ((getAllSiblingsStatus || 1) === STATUS.NOT_STARTED) {
      getAllSiblingsAction({ sessionMasterId });
    }
  }, [getAllSiblingsAction, getAllSiblingsStatus, sessionMasterId]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSibling, setSelectedSibling] = useState(null);

  const handleOpen = (sibling) => {
    setSelectedSibling(sibling);
    onOpen();
  };

  const handleDeleteSibling = async (data) => {
    await deleteSibling(data);
    onClose()
    setSelectedSibling(null);
    getAllSiblingsAction({ sessionMasterId });
  };

  return (
    <Box h={"100%"}>
      <PageHeader
        heading={"Sibling Relation"}
        extra={
          HasPermission(PERMISSIONS.SIBLINGS_ADD) && (
            <Button
              size={"sm"}
              colorScheme={themeColor}
              onClick={() => setToggleDrawer([])}
            >
              Add Sibling
            </Button>
          )
        }
      />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getAllSiblingsStatus}>
            {allSiblings?.length ? (
              <Flex flexWrap="wrap" gap={6} p={4}>
                {map(allSiblings, (sibling, index) => {
                  const data = sibling?.promotion;
                  const std = sibling?.promotion?.student_master;
                  const siblingsCount = sibling?.moreSibling?.length || 0;

                  return (
                    <Box
                      key={index}
                      w={{ base: "100%", md: "48%" }}
                      p={6}
                      bg={"white"}
                      borderRadius="2xl"
                      boxShadow="lg"
                      position="relative"
                    >
                      <Badge
                        position="absolute"
                        top={-2}
                        right={-2}
                        bg="teal.500"
                        color="white"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="sm"
                        cursor={"pointer"}
                        onClick={() => handleOpen(sibling)}
                      >
                        {siblingsCount} Sibling{siblingsCount > 1 && "s"}
                      </Badge>

                      <Flex align="center" mb={6}>
                        <Avatar
                          size="xl"
                          src={`${URL}${std.photo}`}
                          mr={6}
                          border="4px solid"
                          borderColor="teal.200"
                        />
                        <Box flex={1}>
                          <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            color="teal.600"
                            mb={1}
                          >
                            {std.studentName}
                          </Text>
                          <Flex align="center" color="gray.500" mb={2}>
                            <SiGoogleclassroom />
                            <Text ml={2} fontSize="md">
                              {data.class_master.name} -{" "}
                              {data.stream_master.name}
                            </Text>
                          </Flex>
                          <Flex align="center" color="gray.500">
                            <PhoneIcon />
                            <Text ml={2} fontSize="sm">
                              {std.fatherContact}
                            </Text>
                          </Flex>
                        </Box>
                      </Flex>
                   
                    </Box>
                  );
                })}
              </Flex>
            ) : (
              <NoData title="No Siblings Found" />
            )}
          </LoadingContainer>
        </Box>
      </Box>

      {/* Sibling Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sibling Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedSibling?.moreSibling?.map((sub, idx) => {
              const subStudent = sub?.promotion?.student_master;

              return (
                <Flex
                  key={idx}
                  align="center"
                  bg="gray.100"
                  p={3}
                  borderRadius="md"
                  mb={3}
                  justify="space-between"
                >
                  <Flex align="center">
                    <Avatar
                      size="md"
                      src={`${URL}${subStudent?.photo}`}
                      mr={3}
                      border="2px solid"
                      borderColor="teal.300"
                    />
                    <Box>
                      <Text fontSize="md" fontWeight="medium" color="teal.700">
                        {subStudent?.studentName}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {sub?.promotion?.class_master?.name} -{" "}
                        {sub?.promotion?.section_master?.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Contact: {subStudent?.fatherContact || "N/A"}
                      </Text>
                    </Box>
                  </Flex>

                  <IconButton
                    size="sm"
                    colorScheme="red"
                    icon={<DeleteIcon />}
                    aria-label="Delete Sibling"
                    onClick={() => handleDeleteSibling(sub.id)}
                  />
                </Flex>
              );
            })}
          </ModalBody>
        </ModalContent>
      </Modal>
      {toggleDrawer && (
        <AddSiblings
          data={toggleDrawer}
          closeDrawer={() => setToggleDrawer(null)}
          sessionMasterId={sessionMasterId}
          themeColor={themeColor}
        />
      )}
    </Box>
  );
};
