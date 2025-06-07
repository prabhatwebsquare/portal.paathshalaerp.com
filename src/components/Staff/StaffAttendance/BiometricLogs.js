import { Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react"
import dayjs from "dayjs"

export const BiometricLogs = ({ data, closeModal }) => {
    return (
        <Modal isOpen={data} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{data?.[0]?.date ? dayjs(data[0]?.date).format("DD-MM-YYYY") : null}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={4}>
                    <Flex justify={"space-between"} align={"center"} color={"green.400"}>
                        <Text w={"45%"} textAlign={"right"}>IN</Text>
                        <Flex w={"15px"} h={"15px"} bg={"green.400"} borderRadius={"50%"}> </Flex>
                        <Text w={"45%"}>{data?.[0]?.date ? dayjs(data[0]?.date).format("hh:mm A") : "-"}</Text>
                    </Flex>
                    {data.slice(1).map((d, rowIndex) => {
                        const isEven = rowIndex % 2 !== 0 ? true : false
                        return (
                            <>
                                <Flex justify={"center"}>
                                    <Text h={"30px"} borderRight={"1px solid"} borderColor={"gray.200"} />
                                </Flex>
                                <Flex justify={"space-between"} align={"center"} color={isEven ? "green.400" : "red.400"}>
                                    <Text w={"45%"} textAlign={"right"}>{isEven ? "IN" : "OUT"}</Text>
                                    <Flex w={"15px"} h={"15px"} bg={isEven ? "green.400" : "red.400"} borderRadius={"50%"}> </Flex>
                                    <Text w={"45%"}>{d?.date ? dayjs(d?.date).format("hh:mm A") : "-"}</Text>
                                </Flex>
                            </>
                        )
                    })}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}