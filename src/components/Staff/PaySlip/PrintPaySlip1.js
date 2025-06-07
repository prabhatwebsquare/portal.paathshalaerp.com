import { Box, Flex, Image, Text } from "@chakra-ui/react"
import dayjs from "dayjs"

export const PrintPaySlip1 = ({ themeColor, data, school }) => {
    return (
        <Box px={10} py={5}>
            <Flex align={"end"} justify={"space-between"}>
                <Text w={"150pt"}></Text>
                <Text w={"30%"} fontSize={22} textAlign={"center"}
                    sx={{
                        borderBottom: '1px solid',
                        borderImage: 'linear-gradient(to right,#ebf8ff, #90cdf4, #ebf8ff) 1',
                        borderImageSlice: 1,
                    }}
                >
                    Salary Slip
                </Text>
                <Image w={"150pt"} h={"60pt"} src="/assets/SmartPaathshala.png" alt="logo" />
            </Flex>
            <Box m={"40pt"} fontFamily={"serif"} fontSize={20}>
                <Flex>
                    <Text>Employee Name: </Text>
                    <Text ml={2}>Ashok Kumar</Text>
                </Flex>
                <Flex>
                    <Text>Designation: </Text>
                    <Text ml={2}>Management Head</Text>
                </Flex>
                <Flex>
                    <Text>Month: </Text>
                    <Text ml={2}>{dayjs().format("MMMM YYYY") + "  -  " + dayjs().format("MMMM YYYY")}</Text>
                </Flex>
            </Box>
            <Box boxShadow={"lg"}>
                <Flex pl={"40pt"} py={"10pt"} color={"gray.700"} bg={`${themeColor}.50`}>
                    <Text w={"22.5%"}>Salary</Text>
                    <Text w={"22.5%"}>Deduction</Text>
                    <Text w={"22.5%"}>PF Deduction</Text>
                    <Text w={"22.5%"}>Net Payable</Text>
                    <Text w={"10%"}>Status</Text>
                </Flex>
                <Flex pl={"40pt"} py={"10pt"} color={"gray.700"}>
                    <Text w={"22.5%"}>1,00,000</Text>
                    <Text w={"22.5%"}>2,000</Text>
                    <Text w={"22.5%"}>1,000</Text>
                    <Text w={"22.5%"}>97,000</Text>
                    <Text w={"10%"} color={"green.600"}>Paid</Text>
                </Flex>
            </Box>
            <Flex pl={"40pt"} mt={"15pt"} fontSize={14}>
                <Text>Salary Slip Issued Month: </Text>
                <Text ml={2}>{dayjs().format("MMMM YYYY")}</Text>
            </Flex>
            <Flex mt={"50pt"} pl={"40pt"}>
                {school ?
                    <Box w={"50%"} fontSize={14}>
                        <Text>For any Queries, Please Call at {school.mobileNo} {school.email ? "or" : ""}</Text>
                        {school.email ?
                            <Text>mail at {school.email} or</Text>
                            :
                            null
                        }
                        <Text mt={"10pt"}>Regards,</Text>
                        {data?.userData.name ?
                            <Text>{data?.userData.name}</Text>
                            :
                            null
                        }
                    </Box>
                    :
                    <Box w={"50%"}>
                    </Box>
                }
                <Flex w={"50%"} align={"center"} justify={"center"}>
                    <Image w={"60%"} h={"70pt"} src="/assets/sign.png" alt={"Signature"} />
                </Flex>
            </Flex>
        </Box>
    )
}