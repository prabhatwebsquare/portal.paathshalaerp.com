import { SchoolHeader } from "@/common/SchoolHeader"
import { NumberToWords } from "@/constant/NumToWords"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { Box, Flex, Image, Text } from "@chakra-ui/react"

export const FeesCertificate = ({ data, stdDetails, setPrintProps }) => {
    const session = getLocalStorageItem("sessionMaster")


    return (
        <Box p={5} h={"421pt"}>
            <SchoolHeader title={"Fees Certificate"} />
            <Box border={"1px solid"} borderTop={"none"} borderColor={"gray.200"}>
                <Box px={"50pt"} py={"30pt"} fontSize={16}>
                    <Flex mt={1} w={"100%"}>
                        <Text w={"30pt"}></Text>
                        <Text>This is to certify that Mr./Miss</Text>
                        <Text flex={1} textAlign={"center"} fontWeight={"semibold"} borderBottom={"1px solid"} borderColor={"gray.200"}>{stdDetails?.studentName}</Text>
                    </Flex>
                    <Flex mt={1} w={"100%"}>
                        <Text>Son/Daughter of </Text>
                        <Text flex={1} textAlign={"center"} fontWeight={"semibold"} borderBottom={"1px solid"} borderColor={"gray.200"}>{stdDetails?.fatherName}</Text>
                        <Text> SR No.</Text>
                        <Text flex={1} textAlign={"center"} fontWeight={"semibold"} borderBottom={"1px solid"} borderColor={"gray.200"}>{stdDetails?.srNo}</Text>
                    </Flex>
                    <Flex mt={1} w={"100%"}>
                        <Text>of Class</Text>
                        <Text flex={1} textAlign={"center"} fontWeight={"semibold"} borderBottom={"1px solid"} borderColor={"gray.200"}>{data?.student?.class_master?.name} - {data?.student?.stream_master?.name}</Text>
                        <Text> He/She had paid fees (Rs)</Text>
                        <Text flex={1} textAlign={"center"} fontWeight={"semibold"} borderBottom={"1px solid"} borderColor={"gray.200"}>{data?.totalFeesCollect}</Text>
                    </Flex>
                    <Flex mt={1} w={"100%"}>
                        <Text> (in words : </Text>
                        <Text flex={3} textAlign={"center"} fontWeight={"semibold"} borderBottom={"1px solid"} borderColor={"gray.200"}>{NumberToWords(data.totalFeesCollect)}&nbsp;Only</Text>
                        <Text> ) </Text>
                    </Flex>
                    <Flex mt={1} w={"100%"}>
                        <Text> towards Tution Fees for academic session </Text>
                        <Text px={3} textAlign={"center"} fontWeight={"semibold"} borderBottom={"1px solid"} borderColor={"gray.200"}> {session?.name}</Text>
                        <Text> .</Text>
                    </Flex>
                    <Flex my={"10pt"}>
                        This certificate is being issued on request in order to enable him/her to claim Income Tax Deduction under 80C of Income Tax Act.
                    </Flex>

                    <Flex mt={5} justify={"flex-end"}>
                        <Box align={"center"}>
                            <Flex w={"80pt"} h={"30pt"} />
                            <Text fontWeight={"semibold"}>Principal Sign</Text>
                        </Box>
                    </Flex>
                </Box>
            </Box>
        </Box>
    )
}