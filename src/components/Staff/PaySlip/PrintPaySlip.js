import { URL } from "@/services/apis"
import { Box, Flex, Image, Text } from "@chakra-ui/react"
import dayjs from "dayjs"
import { map } from "lodash"
import { LiaMoneyBillWaveSolid } from "react-icons/lia"

export const PrintPaySlip = ({ themeColor, data, school }) => {
    return (
        <Flex h={"842pt"} flexDir={"column"} justify={"space-between"}>
            <Box h={"fit-content"}>
                <Flex p={"20pt"} align={"end"} justify={"space-between"} bg={"gray.900"} color={"white"} h={"140pt"}>
                    <Flex w={"50%"} h={"100%"} flexDir={"column"} justify={"space-between"}>
                        <Box>
                            <LiaMoneyBillWaveSolid fontSize={40} />
                            <Text fontSize={13}>PaySlip / www.paathshalaerp.com</Text>
                        </Box>
                        <Text mt={2} fontSize={36} fontWeight={"bold"}>Salary Slip</Text>
                    </Flex>
                    {school ?
                        <Flex w={"50%"} h={"100%"} flexDir={"column"} align={"center"} justify={"space-between"}>
                            <Box align={"center"} fontSize={13}>
                                <Text>{school.address}, {school.district},</Text>
                                <Text> {school.state}</Text>
                                <Text>{school.mobileNo}</Text>
                            </Box>
                            <Text fontSize={24} fontWeight={"semibold"}>{school?.name}</Text>
                        </Flex>
                        :
                        null
                    }
                </Flex>
                <Flex justify={"flex-end"} align={"center"}>
                    <Flex
                        mt={"-10pt"}
                        pos={"relative"}
                        borderBottom={"24pt solid #f5a698"}
                        borderLeft={"15px solid"}
                        borderLeftColor={"transparent"}
                    />
                    <Flex mt={"-10pt"} h={"24pt"} w={"50%"} bg={"#f5a698"} fontWeight={"semibold"} justify={"center"} color={"white"}>
                        <Text fontSize={18} fontWeight={"semibold"}>{dayjs().format("DD-MMM-YYYY")}</Text>
                    </Flex>
                </Flex>
                <Flex mt={8} align={"center"}>
                    <Flex pl={"40pt"} h={"24pt"} w={"60%"} bg={"#bd7895"} align={"center"} color={"white"}>
                        <Text letterSpacing={"2px"}>{dayjs().format("MMMM YYYY")}</Text>
                    </Flex>
                    <Flex
                        pos={"relative"}
                        borderTop={"24pt solid #bd7895"}
                        borderRight={"15px solid"}
                        borderRightColor={"transparent"}
                    ></Flex>
                    <Text w={"40%"} ml={"-10pt"} border={"1px solid"} borderColor={"#bd7895"} />
                </Flex>


                <Box my={"10pt"} ml={"35pt"} fontSize={14} fontWeight={"semibold"}>
                    <Flex>
                        <Text>Employee Name: </Text>
                        <Text ml={2}>Ashok Kumar</Text>
                    </Flex>
                    <Flex>
                        <Text>Employee Contact: </Text>
                        <Text ml={2}>9876543210</Text>
                    </Flex>
                    <Flex>
                        <Text>Designation: </Text>
                        <Text ml={2}>Management Head</Text>
                    </Flex>
                    <Flex>
                        <Text>Department: </Text>
                        <Text ml={2}>Non-Teaching</Text>
                    </Flex>
                </Box>
                <Box mt={"30pt"} px={"35pt"}>
                    <Flex bg={"#bd7895"} color={"white"}>
                        <Text pl={"7pt"} py={"2pt"} w={"25%"}>Earnings</Text>
                        <Text pl={"7pt"} py={"2pt"} w={"25%"} borderLeft={"2px solid"} borderColor={"white"}>Amount</Text>
                        <Text pl={"7pt"} py={"2pt"} w={"25%"} borderLeft={"2px solid"} borderColor={"white"}>Deductions</Text>
                        <Text pl={"7pt"} py={"2pt"} w={"25%"} borderLeft={"2px solid"} borderColor={"white"}>Amount</Text>
                    </Flex>
                    <Flex fontSize={14} fontWeight={"semibold"} pt={"10pt"}>
                        <Box w={"50%"}>
                            {map(new Array(4), (earn, i) => (
                                <Flex w={"100%"}>
                                    <Text borderLeft={"2px solid"} borderColor={"#bd7895"} pl={"7pt"} py={"2pt"} w={"50%"}>Earnings</Text>
                                    <Text borderLeft={"2px solid"} borderColor={"#bd7895"} pl={"7pt"} py={"2pt"} w={"50%"}>Amount</Text>
                                </Flex>
                            ))}
                        </Box>
                        <Box w={"50%"}>
                            {map(new Array(4), (earn, i) => (
                                <Flex w={"100%"}>
                                    <Text borderLeft={"2px solid"} borderColor={"#bd7895"} pl={"7pt"} py={"2pt"} w={"50%"}>PF Deducion</Text>
                                    <Text borderLeft={"2px solid"} borderColor={"#bd7895"} pl={"7pt"} py={"2pt"} w={"50%"}>Amount</Text>
                                </Flex>
                            ))}
                        </Box>
                    </Flex>
                </Box>
                <Box mt={"30pt"} px={"35pt"}>
                    <Flex bg={"#f5a698"} color={"white"}>
                        <Text pl={"7pt"} py={"2pt"} w={"25%"}>Total Addition</Text>
                        <Text pl={"7pt"} py={"2pt"} w={"25%"}>100000</Text>
                        <Text pl={"7pt"} py={"2pt"} w={"25%"} borderLeft={"2px solid"} borderColor={"white"}>Total Deduction</Text>
                        <Text pl={"7pt"} py={"2pt"} w={"25%"}>50000</Text>
                    </Flex>
                    <Flex fontSize={14} fontWeight={"semibold"} borderBottom={"2px solid #f5a698"}>
                        <Box w={"50%"}>
                            <Flex w={"100%"}>
                                <Text pl={"7pt"} py={"2pt"} w={"50%"}>Earnings</Text>
                                <Text pl={"7pt"} py={"2pt"} w={"50%"}>Amount</Text>
                            </Flex>
                        </Box>
                        <Box w={"50%"}>
                            <Flex w={"100%"}>
                                <Text pl={"7pt"} py={"2pt"} w={"50%"}>PF Deducion</Text>
                                <Text pl={"7pt"} py={"2pt"} w={"50%"}>Amount</Text>
                            </Flex>
                        </Box>
                    </Flex>
                </Box>
                <Flex px={"35pt"} mt={"30pt"} fontSize={14} fontWeight={"semibold"}>
                    <Flex w={"100%"} bg={"gray.100"} py={"8pt"} px={"5pt"} borderRadius={5}>
                        <Text>Total Salary in Words:  </Text>
                        <Text ml={3}>Fifty Thousands Rupees Only  </Text>
                    </Flex>
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
                            {data?.userData?.name ?
                                <Text>{data?.userData?.name}</Text>
                                :
                                null
                            }
                        </Box>
                        :
                        <Box w={"50%"}>
                        </Box>
                    }
                    <Flex w={"50%"} align={"center"} justify={"center"}>
                        {/* <Image w={"60%"} h={"70pt"} src="/assets/sign.png" alt={"Signature"} /> */}
                    </Flex>
                </Flex>
            </Box>
            <Box h={"fit-content"}>
                <Flex justify={"space-around"} align={"end"} pb={"10pt"}>
                    <Text fontSize={14} fontStyle={"italic"} borderTop={"1px solid"} borderColor={"gray.400"}>Signature of the Employee</Text>
                    <Image h={"50pt"} border={"1px solid white"} mt={2} src={school?.logo ? `${URL}${school.logo}` : "/assets/SmartPaathshala.png"} alt={school?.name} />
                    <Text fontSize={14} fontStyle={"italic"} borderTop={"1px solid"} borderColor={"gray.400"}>Signature of the Employee</Text>
                </Flex>
                <Flex>
                    <Flex h={"24pt"} w={"100%"} bg={"#bd7895"}>
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    )
}