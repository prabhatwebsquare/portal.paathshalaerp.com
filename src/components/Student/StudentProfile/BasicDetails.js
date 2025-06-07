import { Box, Flex, Text } from "@chakra-ui/react"
import dayjs from "dayjs";
import { PiDotsThreeVertical } from "react-icons/pi";

export const BasicDetails = ({ studentDetails }) => {
    const stdData = studentDetails?.student_master
    return (
        studentDetails ?
            <Flex flexWrap={"wrap"} borderleft={"1px solid"} borderColor="gray.100">
                <StudentDetail heading={"Sr No."} detail={studentDetails.srNo} />
                <StudentDetail heading={"Admission No."} detail={stdData.admissionNo} />
                <StudentDetail heading={"Admission Date"} detail={stdData.admissionDate ? dayjs(stdData.admissionDate).format("DD-MM-YYYY") : ""} />
                <StudentDetail heading={"Form No."} detail={stdData.formNo} />
                <StudentDetail heading={"Name"} detail={stdData.studentName} />
                <StudentDetail heading={"Contact"} detail={stdData.studentContact} />
                <StudentDetail heading={"Email"} detail={stdData.studentEmail} />
                <StudentDetail heading={"Gender"} detail={"MALE"} />
                <StudentDetail heading={"Class"} detail={studentDetails.class_master.name} />
                <StudentDetail heading={"Stream"} detail={studentDetails.stream_master.name} />
                <StudentDetail heading={"Section"} detail={studentDetails.section_master.name} />
                <StudentDetail heading={"Address"} detail={stdData.address} />
                <StudentDetail heading={"Aadhar No."} detail={stdData.aadharNo} />
                <StudentDetail heading={"Religion"} detail={stdData.religion} />
                <StudentDetail heading={"Category"} detail={stdData.category} />
                <StudentDetail heading={"Caste"} detail={stdData.caste} />
                <StudentDetail heading={"Father's Name"} detail={stdData.fatherName} />
                <StudentDetail heading={"Father's Contact"} detail={stdData.fatherContact} />
                <StudentDetail heading={"Father's Occupation"} detail={stdData.occupation} />
                <StudentDetail heading={"Father's Income"} detail={stdData.income} />
                <StudentDetail heading={"Mother's Name"} detail={stdData.motherName} />
                <StudentDetail heading={"Mother's Contact"} detail={stdData.motherContact} />
            </Flex>
            :
            null
    )
}


const StudentDetail = ({ heading, detail }) => {
    return (
        <Box w={"25%"} mb={2}>
            <Text fontSize={14}>{heading}</Text>
            <Text fontSize={16} fontWeight={"semibold"}>{detail || " - "}</Text>
        </Box>
    )
}