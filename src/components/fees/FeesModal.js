import { Box, Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react"
import { MdCurrencyRupee } from "react-icons/md";

export const FeesModal = ({ fee, closeModal }) => {

    return (
        <Modal size={"3xl"} isOpen={fee} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{fee?.fees_name_master?.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex gap={2} w="100%">
                        <Box w={"33%"}>
                            <Flex pl={5} fontWeight={"semibold"} fontSize={14}>
                                <Text w={"60%"}>Total Fees</Text>
                                <Flex ml={3} align={"center"} color={"blue.500"}>: &nbsp;<MdCurrencyRupee /> {fee.totalFees}</Flex>
                            </Flex>
                            <Flex pl={5} fontWeight={"semibold"} fontSize={14}>
                                <Text w={"60%"}>Fees</Text>
                                <Flex ml={3} align={"center"} color={"blue.500"}>: &nbsp;<MdCurrencyRupee /> {fee.tutionFees}</Flex>
                            </Flex>
                            <Flex pl={5} fontWeight={"semibold"} fontSize={14}>
                                <Text w={"60%"}>Total Late Fees</Text>
                                <Flex ml={3} align={"center"} color={"blue.500"}>: &nbsp;<MdCurrencyRupee /> {fee.totalLateFees}</Flex>
                            </Flex>
                        </Box>
                        <Box w={"33%"} borderLeft={"1px solid"} borderColor={"gray.200"}>
                            <Flex pl={5} fontWeight={"semibold"} fontSize={14}>
                                <Text w={"60%"}>Total Deposite</Text>
                                <Flex ml={3} align={"center"} color={"green.500"}>: &nbsp;<MdCurrencyRupee /> {fee.deposite + fee.lateFeesCollected + fee.discountReceived}</Flex>
                            </Flex>
                            <Flex pl={5} fontWeight={"semibold"} fontSize={14}>
                                <Text w={"60%"}>Deposite</Text>
                                <Flex ml={3} align={"center"} color={"green.500"}>: &nbsp;<MdCurrencyRupee /> {fee.deposite}</Flex>
                            </Flex>
                            <Flex pl={5} fontWeight={"semibold"} fontSize={14}>
                                <Text w={"60%"}>Late Fees</Text>
                                <Flex ml={3} align={"center"} color={"green.500"}>: &nbsp;<MdCurrencyRupee /> {fee.lateFeesCollected}</Flex>
                            </Flex>
                            <Flex pl={5} fontWeight={"semibold"} fontSize={14}>
                                <Text w={"60%"}>Discount</Text>
                                <Flex ml={3} align={"center"} color={"green.500"}>: &nbsp;<MdCurrencyRupee /> {fee.discountReceived}</Flex>
                            </Flex>
                        </Box>
                        <Box w={"33%"} borderLeft={"1px solid"} borderColor={"gray.200"}>
                            <Flex pl={5} fontWeight={"semibold"} fontSize={14}>
                                <Text w={"60%"}>Total Due</Text>
                                <Flex ml={3} align={"center"} color={"red.500"}>: &nbsp;<MdCurrencyRupee /> {fee.amount + fee.dueLateFees}</Flex>
                            </Flex>
                            <Flex pl={5} fontWeight={"semibold"} fontSize={14}>
                                <Text w={"60%"}>Due Fees</Text>
                                <Flex ml={3} align={"center"} color={"red.500"}>: &nbsp;<MdCurrencyRupee /> {fee.amount}</Flex>
                            </Flex>
                            <Flex pl={5} fontWeight={"semibold"} fontSize={14}>
                                <Text w={"60%"}>Due Late Fees</Text>
                                <Flex ml={3} align={"center"} color={"red.500"}>: &nbsp;<MdCurrencyRupee /> {fee.dueLateFees}</Flex>
                            </Flex>
                        </Box>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Button size={"sm"} colorScheme='blue' mr={3} onClick={closeModal}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
