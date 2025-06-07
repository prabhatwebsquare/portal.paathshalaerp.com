import { SchoolHeader } from "@/common/SchoolHeader"
import { Box, Checkbox, Flex, Text } from "@chakra-ui/react"

export const AdmissionFormPrint = ({ path, themeColor, sessionMasterId }) => {
    return (
        // <Box h="100%">
        <Flex p={5} h={"800pt"} flexDir={"column"} w={"100%"} justify={"space-between"}>
            <Flex flexDir={"column"} h="fit-content">
                <SchoolHeader title={"Admission Form"} />
                <Flex w={"100%"}>
                    <Flex w={"80%"} px={5} mt={5} flexWrap={"wrap"} gap={4} fontSize={13}>
                        <Flex w={"48%"}>
                            <Text fontWeight={"semibold"}>Sr No. :</Text>
                            <Flex flex={1} borderBottom={"1px dashed"} borderColor={"gray.300"} />
                        </Flex>
                        <Flex w={"48%"}>
                            <Text fontWeight={"semibold"}>Admission No :</Text>
                            <Flex flex={1} borderBottom={"1px dashed"} borderColor={"gray.300"} />
                        </Flex>
                        <Flex w={"48%"}>
                            <Text fontWeight={"semibold"}>Admission Date :</Text>
                            <Flex flex={1} borderBottom={"1px dashed"} borderColor={"gray.300"} />
                        </Flex>
                        <Flex w={"48%"}>
                            <Text fontWeight={"semibold"}>Class :</Text>
                            <Flex flex={1} borderBottom={"1px dashed"} borderColor={"gray.300"} />
                        </Flex>
                        <Flex w={"48%"}>
                            <Text fontWeight={"semibold"}>Stream :</Text>
                            <Flex flex={1} borderBottom={"1px dashed"} borderColor={"gray.300"} />
                        </Flex>
                    </Flex>
                    <Flex mt={3} flexDir={"column"} mb={-5} w={"15%"} justifyContent={"center"} align={"center"} border={"1px solid"} borderColor={`${themeColor}.200`}>
                        <Text>Student</Text>
                        <Text>Passport</Text>
                        <Text>Picture</Text>
                    </Flex>
                </Flex>
                <Flex mt={8} p={3} pos={"relative"} flexWrap={"wrap"} gap={5} fontSize={13} border={"1px solid"} borderColor={`${themeColor}.200`}>
                    <Flex pos={"absolute"} top={-3} justify={"center"} w={"100%"}>
                        <Text px={2} py={0.5} color={"white"} bg={`${themeColor}.500`} fontSize={11} fontWeight={"semibold"}>STUDENT&apos;S DETAIL</Text>
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>Name :</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>Contact :</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>Email :</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>DOB :</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>Gender :</Text>
                        <Flex ml={2} align={"center"}>
                            <Text h={"15pt"} w={"25pt"} border={"1px solid"} borderColor={"gray.200"} />
                            <Text ml={2}>Male</Text>
                            <Text ml={"20pt"} h={"15pt"} w={"25pt"} border={"1px solid"} borderColor={"gray.200"} />
                            <Text ml={2}>Female</Text>
                        </Flex>
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>Religion :</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>Category :</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>Caste :</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                </Flex>
                <Flex mt={8} p={3} pos={"relative"} flexWrap={"wrap"} gap={4} fontSize={12} border={"1px solid"} borderColor={`${themeColor}.200`}>
                    <Flex pos={"absolute"} top={-3} justify={"center"} w={"100%"}>
                        <Text px={2} py={0.5} color={"white"} bg={`${themeColor}.500`} fontSize={11} fontWeight={"semibold"}>PARENT&apos;S DETAIL</Text>
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>Father&apos;s Name :</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>Father&apos;s Contact :</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>Father&apos;s Occupation :</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>Income :</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>Mother&apos;s Name :</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>Mother&apos;s Contact</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                    <Flex w={"100%"}>
                        <Text fontWeight={"semibold"}>Address :</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                </Flex>
                <Flex mt={8} p={3} pos={"relative"} flexWrap={"wrap"} gap={4} fontSize={12} border={"1px solid"} borderColor={`${themeColor}.200`}>
                    <Flex pos={"absolute"} top={-3} justify={"center"} w={"100%"}>
                        <Text px={2} py={0.5} color={"white"} bg={`${themeColor}.500`} fontSize={11} fontWeight={"semibold"}>PREVIOUS SCHOOL DETAIL</Text>
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>SR / Enroll No. :</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>Class :</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>School / Board :</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>Max Marks :</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>Obtained Marks</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>Percentage</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                    <Flex w={"100%"}>
                        <Text fontWeight={"semibold"}>Address :</Text>
                        <Flex ml={2} borderBottom={"1px dashed"} borderColor={"gray.300"} flex={1} />
                    </Flex>
                </Flex>
            </Flex>
            <Flex h={"fit-content"} justify={"space-between"} mt={20} p={2} fontSize={13} fontWeight={"semibold"}>
                <Text borderTop={"1px solid"} borderColor={"gray.200"} px={3}>Signature</Text>
                <Text borderTop={"1px solid"} borderColor={"gray.200"} px={3}>Signature</Text>
            </Flex>
        </Flex>
    )
}