import { SchoolHeader } from "@/common/SchoolHeader";
import { URL } from "@/services/apis";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { map } from "lodash";
import { useEffect } from "react";

export const PrintOneAdmitCard = ({ exam, examTimeTable, data, setPrintProps }) => {
    const timeTable = examTimeTable?.[0]?.exam_time_tables

    useEffect(() => {
        return () => setPrintProps(null)
    }, [setPrintProps])

    return (
        <Flex m={3} flexDir={"column"} justify={"space-between"} border={"1px solid"} borderColor={"gray.200"} borderRadius={5}>
            <Flex flexDir={"column"} h="fit-content">
                {/* <Flex h={"105px"} borderBottom={"1px solid"} borderColor={"gray.200"} align={"center"}>
                    <Box w={"25%"} align={"flex-start"}>
                        <Image w="60%" src="/assets/SmartPaathshala.png" alt="" />
                    </Box>
                    <Box w={"50%"} align={"center"}>
                        <Text fontSize={22} fontWeight={"semibold"}>Paathshala Smart</Text>
                        <Text fontSize={12}>{"311,3rd Floor, Center Tower, Central Spine, Vidhyadhar Nagar, Jaipur-302023"}</Text>
                        <Text mt={2} fontSize={18} fontWeight={"semibold"}>Admit Card</Text>
                    </Box>
                    <Box w={"25%"}>
                        <Text fontSize={12} textAlign={"right"}></Text>
                    </Box>
                </Flex> */}
                <SchoolHeader title={"Admit Card"} />
                <Flex p={2} borderBottom={"1px solid"} borderColor={"gray.200"}>
                    <Box w="50%" fontSize={12}>
                        <Flex align={"center"}>
                            <Text w="40%">Roll No. </Text>
                            <Text ml={2} fontWeight={"semibold"}>: {data.rollNo}</Text>
                        </Flex>
                        <Flex align={"center"}>
                            <Text w="40%">Student Name </Text>
                            <Text ml={2} fontWeight={"semibold"}>: {data.student_master.studentName}</Text>
                        </Flex>
                        <Flex align={"center"}>
                            <Text w="40%">Father&apos;s Name </Text>
                            <Text ml={2} fontWeight={"semibold"}>: {data.student_master.fatherName}</Text>
                        </Flex>
                        <Flex align={"center"}>
                            <Text w="40%">Mother&apos;s Name </Text>
                            <Text ml={2} fontWeight={"semibold"}>:  {data.student_master.motherName}</Text>
                        </Flex>
                        <Flex align={"center"}>
                            <Text w="40%">DOB </Text>
                            <Text ml={2} fontWeight={"semibold"}>: {dayjs(data.student_master.dob).format("DD-MM-YYYY")}</Text>
                        </Flex>
                    </Box>
                    <Box w="35%" fontSize={12}>
                        <Flex align={"center"}>
                            <Text w="40%">Sr No. </Text>
                            <Text ml={2} fontWeight={"semibold"}>: {data.student_master.srNo}</Text>
                        </Flex>
                        <Flex align={"center"}>
                            <Text w="40%">Class </Text>
                            <Text ml={2} fontWeight={"semibold"}>: {data.class_master.name}</Text>
                        </Flex>
                        <Flex align={"center"}>
                            <Text w="40%">Stream </Text>
                            <Text ml={2} fontWeight={"semibold"}>:  {data.stream_master.name}</Text>
                        </Flex>
                        <Flex align={"center"}>
                            <Text w="40%">Section </Text>
                            <Text ml={2} fontWeight={"semibold"}>:  {data.section_master.name}</Text>
                        </Flex>
                        <Flex align={"center"}>
                            <Text w="40%">Exam </Text>
                            <Text ml={2} fontWeight={"semibold"}>:  {exam?.exam_master.name}</Text>
                        </Flex>
                    </Box>
                    <Box w="15%" fontSize={12}>
                        <Flex h={"100%"} border={"1px solid"} borderColor={"gray.200"}>
                            <Image h={"100%"} src={`${URL}${data.student_master.photo}`} alt={""} />
                        </Flex>
                    </Box>
                </Flex>
                {timeTable?.length ?
                    <Flex w={"100%"} p={2} borderBottom={"1px solid"} borderColor={"gray.200"}>
                        <Flex w={"100%"} flexWrap={"wrap"} border={"1px solid"} borderColor={"gray.300"} fontSize={12} fontWeight={"semibold"}>
                            <Flex w={"50%"} bg={"gray.100"} px={2} borderRight={"1px solid"} borderBottom={"1px solid"} borderColor={"gray.300"}>
                                <Text w={"45%"}>Subject</Text>
                                <Text w={"55%"} pl={2}>Date & Time</Text>
                            </Flex>
                            <Flex w={"50%"} bg={"gray.100"} px={2} borderRight={"1px solid"} borderBottom={"1px solid"} borderColor={"gray.300"}>
                                <Text w={"45%"}>Subject</Text>
                                <Text w={"55%"} pl={2}>Date & Time</Text>
                            </Flex>
                            {map(timeTable, sub => (
                                <SubjectUI subName={sub.subject_master?.name} time={sub.examDate} />
                            ))}
                        </Flex>
                    </Flex>
                    :
                    null
                }
                {/* <Flex p={2}>
                    <Text>Note:- </Text>
                    <Box textAlign={"justify"}>{"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}</Box>
                </Flex> */}
            </Flex>
            <Flex h={"fit-content"} justify={"space-between"} mt={20} p={2} fontSize={13} fontWeight={"semibold"}>
                <Text borderTop={"1px solid"} borderColor={"gray.200"} px={3}>Signature</Text>
                <Text borderTop={"1px solid"} borderColor={"gray.200"} px={3}>Signature</Text>
            </Flex>
        </Flex>
    );
}
const SubjectUI = ({ subName, time }) => {
    return (
        <Flex w={"50%"} px={2} borderRight={"1px solid"} borderColor={"gray.300"} >
            <Text w={"40%"}>{subName}</Text>
            <Text w={"60%"}>: &nbsp;{dayjs(time).format("DD-MM-YYYY")}&nbsp; {dayjs(time).format("hh:mm A")}</Text>
        </Flex>
    )
}