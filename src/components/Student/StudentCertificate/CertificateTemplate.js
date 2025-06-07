import CustomInput from "@/common/CustomInput";
import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
import { useStudentStore } from "@/store/studentStore";
import { AddIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, VStack } from "@chakra-ui/react"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RxDragHandleDots2 } from "react-icons/rx";

export const CertificateTemplate = ({ closeModal, data, sessionMasterId, themeColor }) => {
    const router = useRouter()
    const [inputValue, setInputValue] = useState({ id: data.id })
    const [toggleModal, setToggleModal] = useState(null)

    const inputHandler = (name, val) => {
        setInputValue(pre => ({ ...pre, [name]: val }))
    }

    return (
        <Modal size={"3xl"} isOpen={data} onClose={closeModal}>
            <ModalOverlay />
            {/* <form onSubmit={updateStatus}> */}
            <ModalContent>
                <ModalHeader>Change Template</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box>
                        <Text fontWeight={"semibold"}>My Templates</Text>
                        <Flex mt={3} gap={5}>
                            <Flex w={"30%"} h={"150px"} bg={"gray.100"} borderRadius={10} />
                            <Flex w={"30%"} h={"150px"} bg={"gray.100"} borderRadius={10}
                                flexDir={"column"} gap={2} justify={"center"} align={"center"}
                                cursor={"pointer"} onClick={() => setToggleModal([])}
                            >
                                <IconButton size={"sm"} colorScheme={themeColor} icon={<AddIcon />} />
                                <Text>Create New Template</Text>
                            </Flex>
                        </Flex>
                        {toggleModal && <NewCertificate data={toggleModal} themeColor={themeColor} closeModal={() => setToggleModal(null)} />}
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <Button size={"sm"} mr={3} onClick={closeModal}>
                        Close
                    </Button>
                    <Button size={"sm"} colorScheme={themeColor} type="submit">Update</Button>
                </ModalFooter>
            </ModalContent>
            {/* </form> */}
        </Modal>
    )
}

const NewCertificate = ({ closeModal, data, themeColor }) => {
    const router = useRouter()
    const [inputValue, setInputValue] = useState({ orientation: "portrait" })
    const [toggleModal, setToggleModal] = useState(null)

    const inputHandler = (name, val) => {
        setInputValue(pre => ({ ...pre, [name]: val }))
    }

    const goToEditor = (e) => {
        e.preventDefault()
        router.push(`/student/certificate/create-template?name=${inputValue.templateName}&${inputValue.orientation}`)
    }
    return (
        <Modal size={"lg"} isOpen={data} onClose={closeModal}>
            <ModalOverlay />
            <form onSubmit={goToEditor}>
                <ModalContent>
                    <ModalHeader>Change Template</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex flexDir={"column"} gap={3}>
                            <CustomInput type={"text"} name="templateName" label={"Template Name"} autofocus={true} inputValue={inputValue} setInputValue={setInputValue} />
                            <Box>
                                <Text fontWeight={"semibold"}>Orientation</Text>
                                <Flex mt={2} gap={5}>
                                    <Box w={"110px"} align={"center"} cursor={"pointer"} onClick={() => inputHandler("orientation", "portrait")}>
                                        <Flex h={"120px"}
                                            justify={"center"}
                                            align={"center"}
                                            borderRadius={10}
                                            bg={inputValue?.orientation === "portrait" ? "blue.100" : "gray.100"}
                                            border={"1px dashed"}
                                            borderColor={"gray.300"}
                                        >
                                            <RxDragHandleDots2 fontSize={32} />
                                        </Flex>
                                        <Flex w={"fit-content"} mt={1} gap={1} align={"center"}>{inputValue?.orientation === "portrait" ? <CheckCircleIcon fontSize={13} color={"green"} /> : null}  Portrait</Flex>
                                    </Box>
                                    <Box w={"110px"} align={"center"} cursor={"pointer"} onClick={() => inputHandler("orientation", "landscape")}>
                                        <Flex h={"120px"}
                                            justify={"center"}
                                            align={"center"}
                                            borderRadius={10}
                                            bg={inputValue?.orientation === "landscape" ? "blue.100" : "gray.100"}
                                            border={"1px dashed"}
                                            borderColor={"gray.300"}
                                        >
                                            <Flex transform="rotate(90deg)">
                                                <RxDragHandleDots2 fontSize={32} />
                                            </Flex>
                                        </Flex>
                                        <Flex w={"fit-content"} mt={1} gap={1} align={"center"}>{inputValue?.orientation === "landscape" ? <CheckCircleIcon fontSize={13} color={"green"} /> : null}  LandScape</Flex>
                                    </Box>
                                </Flex>
                            </Box>
                        </Flex>
                    </ModalBody>

                    <ModalFooter>
                        <Button size={"sm"} mr={3} onClick={closeModal}>
                            Close
                        </Button>
                        <Button size={"sm"} colorScheme={themeColor} type="submit">Next</Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    )
}