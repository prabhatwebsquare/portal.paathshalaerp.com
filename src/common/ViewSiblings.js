import { STATUS } from "@/constant";
import { useStdFeesStore } from "@/store/stdFees";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect } from "react";
import { NoData } from "./NoData";
import { URL } from "@/services/apis";
import { SiGoogleclassroom } from "react-icons/si";
import { PhoneIcon } from "@chakra-ui/icons";
import { LoadingContainer } from "./LoadingContainer";

export const ViewSiblings = ({ id, closeModal, themeColor, selectSibling }) => {
  const { getSiblingsAction, getSiblingsStatus, siblings, resetSiblingStatus } =
    useStdFeesStore((s) => ({
      getSiblingsAction: s.getSiblingsAction,
      getSiblingsStatus: s.getSiblingsStatus,
      siblings: s.siblings,
      resetSiblingStatus: s.resetSiblingStatus,
    }));

  useEffect(() => {
    if ((getSiblingsStatus || 1) === STATUS.NOT_STARTED) {
      getSiblingsAction(id);
    }
  }, [getSiblingsAction, getSiblingsStatus, id]);

  useEffect(() => {
    return () => resetSiblingStatus();
  }, [resetSiblingStatus]);


  
  return (
    <Modal size={"2xl"} isOpen={true} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Siblings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <LoadingContainer status={getSiblingsStatus}>
            {siblings?.length ? (
              <Box>
                {map(siblings, (sib) => {
                  const std = sib?.promotion?.student_master;
                  const data = sib?.promotion;
                  return (
                    <Box
                      cursor={"pointer"}
                      onClick={() => selectSibling(std?.id, sib?.promotionId)}
                      position="relative"
                      overflow="hidden"
                    >
                      <Flex
                        p={4}
                        mb={4}
                        align={"center"}
                        gap={4}
                        borderRadius="lg"
                        bg="white"
                        boxShadow="md"
                        transition="all 0.3s"
                        _hover={{ 
                          transform: "translateY(-2px)",
                          boxShadow: "lg",
                          borderLeft: `4px solid ${themeColor}.500`
                        }}
                      >
                        <Box position="relative">
                          <Avatar 
                            src={URL + std.photo} 
                            size="xl"
                            border={`2px solid ${themeColor}.200`}
                          />
                          <Box
                            position="absolute"
                            bottom={0}
                            right={0}
                            bg={`${themeColor}.500`}
                            color="white"
                            p={1}
                            borderRadius="full"
                            fontSize="xs"
                          >
                            {data.class_master.name}
                          </Box>
                        </Box>
                        
                        <Box flex={1}>
                          <Flex direction="column" gap={2}>
                            <Box>
                              <Text fontSize="xl" fontWeight="bold" color={`${themeColor}.600`}>
                                {std.studentName}
                              </Text>
                              <Flex align="center" color="gray.600" fontSize="sm">
                                <SiGoogleclassroom />
                                <Text ml={2}>{data.stream_master.name}</Text>
                              </Flex>
                            </Box>
                            
                            <Box>
                              <Text fontSize="sm" color="gray.600">
                                {std.fatherName}
                              </Text>
                              {std.fatherContact && (
                                <Flex align="center" color="gray.600" fontSize="sm">
                                  <PhoneIcon />
                                  <Text ml={2}>{std.fatherContact}</Text>
                                </Flex>
                              )}
                           
                            </Box>
                          </Flex>
                        </Box>

                        <Box 
                          bg={`${themeColor}.50`} 
                          p={3} 
                          borderRadius="md"
                          minW="200px"
                        >
                          <Flex direction="column" gap={0}>
                            <Flex justify="space-between" align="center">
                              <Text fontSize="sm" color="gray.600">Total Fees</Text>
                              <Text fontWeight="bold">₹{sib.feesInfo?.totalFees || 0}</Text>
                            </Flex>
                            <Flex justify="space-between" align="center">
                              <Text fontSize="sm" color="gray.600">Late Fees</Text>
                              <Text color="orange.500">₹{sib.feesInfo?.totalLateFees || 0}</Text>
                            </Flex>
                            <Flex justify="space-between" align="center">
                              <Text fontSize="sm" color="gray.600">Paid</Text>
                              <Text color="green.500">₹{sib.feesInfo?.totalFeesCollect || 0}</Text>
                            </Flex>
                            <Flex justify="space-between" align="center">
                              <Text fontSize="sm" color="gray.600">Due</Text>
                              <Text color="red.500" fontWeight="bold">₹{sib.feesInfo?.totalDue || 0}</Text>
                            </Flex>
                          </Flex>
                        </Box>
                      </Flex>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <NoData title={"No Sibling Found"} />
            )}
          </LoadingContainer>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            variant={"outline"}
            colorScheme={"blue"}
            mr={3}
            onClick={closeModal}
          >
            Close
          </Button>
          {/* <Button size="sm" colorScheme={color || "red"} isLoading={loading || false} onClick={confirm}>{button || "Delete"}</Button> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
