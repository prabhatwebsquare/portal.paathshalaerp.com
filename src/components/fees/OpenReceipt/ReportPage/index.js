import { useStdFeesStore } from "@/store/stdFees";
import {
  Box,
  Container,
  Grid,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Image,
  Badge,
} from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
const ReportPage = () => {
  const studentData = {
    srNo: "16788",
    name: "AADITYA DEV",
    rollNo: "101",
    class: "EM / Section A",
    motherName: "NEETA CHAUDHARY",
    fatherName: "DEVENDRA KUMAR GURJAR",
    dob: "20/12/2017",
    photo: "/path-to-student-photo.jpg",
  };
  const route = useRouter();
  const printRef = useRef();
  const { getMarksheetAction, getMarksheetStatus, getMarksheetdata } =
    useStdFeesStore((s) => ({
      getMarksheetAction: s.getMarksheetAction,
      getMarksheetStatus: s.getMarksheetStatus,
      getMarksheetdata: s.getMarksheetdata,
    }));
  useEffect(() => {
    if (
      route?.query?.orgCode &&
      route?.query?.promotionId &&
      route?.query?.sessionMasterId &&
      route?.query?.marksheetGroupId
    ) {
      getMarksheetAction({
        promotionId: route?.query?.promotionId,
        sessionMasterId: route?.query?.sessionMasterId,
        marksheetGroupId: route?.query?.marksheetGroupId,
        orgCode: route?.query?.orgCode,
      });
    }
  }, [route.query]);


  return (
    <Container maxW="container.md" backgroundColor={"#4794ae"} p={5}>
      <SchoolHeader data={getMarksheetdata} />
      <StudentInfo student={studentData} />
      <MarksTable />
      <Footer />
    </Container>
  );
};

export default ReportPage;

const Footer = () => {
  return (
    <Flex justify="space-between" bg={"#e6f5f8"} p={1}>
      <Text fontSize="xs" color="gray.900" fontWeight="medium">
        Class Teacher
      </Text>
      <Text fontSize="xs" color="gray.900" fontWeight="medium">
        Exam. Incharge
      </Text>
      <Text fontSize="xs" color="gray.900" fontWeight="medium">
        Principal
      </Text>
    </Flex>
  );
};

const MarksTable = () => {
  const data = [
    {
      subject: "HINDI",
      marks: [
        { mm: 10, mo: 10 },
        { mm: 10, mo: 9 },
        { mm: "-", mo: "-" },
        { mm: "-", mo: "-" },
        { mm: 20, mo: 19 },
        { mm: 20 },
      ],
    },
    {
      subject: "ENGLISH",
      marks: [
        { mm: 10, mo: 10 },
        { mm: 10, mo: 9 },
        { mm: "-", mo: "-" },
        { mm: "-", mo: "-" },
        { mm: 20, mo: 19 },
        { mm: 20 },
      ],
    },
    {
      subject: "MATHS",
      marks: [
        { mm: 10, mo: 10 },
        { mm: 10, mo: 10 },
        { mm: "-", mo: "-" },
        { mm: "-", mo: "-" },
        { mm: 20, mo: 20 },
        { mm: 20 },
      ],
    },
    {
      subject: "EVS",
      marks: [
        { mm: 10, mo: 10 },
        { mm: 10, mo: 10 },
        { mm: "-", mo: "-" },
        { mm: "-", mo: "-" },
        { mm: 20, mo: 20 },
        { mm: 20 },
      ],
    },
    {
      subject: "GRAND TOTAL",
      marks: [
        { mm: 40, mo: 40 },
        { mm: 40, mo: 38 },
        { mm: 80, mo: 78 },
        { mm: "-", mo: "-" },
        { mm: "-", mo: "-" },
        { mm: 20 },
      ],
    },
  ];

  return (
    <Box borderWidth="1px" bg="white" overflowX="auto">
      <Table variant="simple" size="sm">
        {/* Table Header */}
        <Thead>
          <Tr>
            <Th
              rowSpan="2"
              bg="black"
              color="white"
              textAlign="center"
              fontWeight="bold"
            >
              SUBJECT NAME
            </Th>
            <Th colSpan="2" bg="black" color="white" textAlign="center">
              I UNIT TEST
            </Th>
            <Th colSpan="2" bg="black" color="white" textAlign="center">
              II UNIT TEST
            </Th>
            <Th colSpan="2" bg="black" color="white" textAlign="center">
              III UNIT TEST
            </Th>
            <Th colSpan="2" bg="black" color="white" textAlign="center">
              HALF YEARLY EXAMINATION
            </Th>
            <Th colSpan="2" bg="black" color="white" textAlign="center">
              ANNUAL EXAM
            </Th>
            <Th bg="black" color="white" textAlign="center" fontWeight="bold">
              OVERALL GRADE
            </Th>
          </Tr>
          <Tr bg="black">
            <Th color="white" textAlign="center">
              M.M.
            </Th>
            <Th color="white" textAlign="center">
              M.O.
            </Th>
            <Th color="white" textAlign="center">
              M.M.
            </Th>
            <Th color="white" textAlign="center">
              M.O.
            </Th>
            <Th color="white" textAlign="center">
              M.M.
            </Th>
            <Th color="white" textAlign="center">
              M.O.
            </Th>
            <Th color="white" textAlign="center">
              M.M.
            </Th>
            <Th color="white" textAlign="center">
              M.O.
            </Th>
            <Th color="white" textAlign="center">
              M.M.
            </Th>
            <Th color="white" textAlign="center">
              M.O.
            </Th>
            <Th color="white" textAlign="center"></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, index) => (
            <Tr key={index}>
              <Td>{row.subject}</Td>
              {row.marks.map((mark, idx) => (
                <React.Fragment key={idx}>
                  <Td>{mark.mm}</Td>
                  {mark?.mo && <Td>{mark.mo}</Td>}
                </React.Fragment>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

const StudentInfo = ({ student }) => {
  return (
    <Box p={4} borderWidth="1px" bg="white">
      <Grid templateColumns={["1fr", "40% 60%"]} gap={4}>
        <Box>
          <Box display="flex" mb={1}>
            <Text fontSize="xs" fontWeight="bold" minWidth="90px">
              SR. No.
            </Text>
            <Text fontSize="xs">{student.srNo}</Text>
          </Box>
          <Box display="flex" mb={1}>
            <Text fontSize="xs" fontWeight="bold" minWidth="90px">
              Name
            </Text>
            <Text fontSize="xs">{student.name}</Text>
          </Box>
          <Box display="flex" mb={1}>
            <Text fontSize="xs" fontWeight="bold" minWidth="90px">
              Mother Name
            </Text>
            <Text fontSize="xs">{student.motherName}</Text>
          </Box>
          <Box display="flex" mb={1}>
            <Text fontSize="xs" fontWeight="bold" minWidth="90px">
              Class
            </Text>
            <Text fontSize="xs">{student.class}</Text>
          </Box>
        </Box>
        <Box>
          <Grid templateColumns={["1fr", "60% 40%"]} gap={4}>
            <Box>
              <Box display="flex" mb={1}>
                <Text fontSize="xs" fontWeight="bold" minWidth="90px">
                  Roll No.
                </Text>
                <Text fontSize="xs">{student.rollNo}</Text>
              </Box>
              <Box display="flex" mb={1}>
                <Text fontSize="xs" fontWeight="bold" minWidth="90px">
                  Father Name
                </Text>
                <Text fontSize="xs">{student.fatherName}</Text>
              </Box>
              <Box display="flex" mb={1}>
                <Text fontSize="xs" fontWeight="bold" minWidth="90px">
                  Date of Birth
                </Text>
                <Text fontSize="xs">{student.dob}</Text>
              </Box>
              <Box display="flex" mb={1}>
                <Text fontSize="xs" fontWeight="bold" minWidth="90px">
                  Faculty
                </Text>
                <Text fontSize="xs">ALL SUBJECT</Text>
              </Box>
            </Box>
            <Box>
              <Image
                src="./assets/student_image.jpg"
                alt="Student Photo"
                boxSize="80px" // Reduced box size for the photo
                borderWidth="1px"
              />
            </Box>
          </Grid>
        </Box>
      </Grid>
    </Box>
  );
};
const SchoolHeader = ({ data }) => {
  return (
    <Box
      border="1px solid #ddd"
      // borderRadius="md"
      overflow="hidden"
      w="100%"
      // p={4}
      bg="white"
      align="center"
    >
      <Flex justify="space-between" bg={"#e6f5f8"} p={1}>
        <Text fontSize="xs" color="gray.900" fontWeight="medium">
          DISE CODE: 08070502003
        </Text>
        <Text fontSize="xs" color="gray.900" fontWeight="medium">
          (Recognized by Govt.of Rajasthan / Affiliated to RBSE Ajmer (Raj.))
        </Text>
        <Text fontSize="xs" color="gray.900" fontWeight="medium">
          Reg No:- {data?.schoolData?.regNo}
        </Text>
      </Flex>
      <Flex
        align="center"
        justify="space-between"
        w="100%"
        bg="#25738a"
        height={"39px"}
      >
        <Image
          src="./assets/school-logo.png" // Replace with your logo path
          alt="School Logo"
          height="60px"
        />
        <Box textAlign="center">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="white"
            fontFamily="'Oswald', sans-serif"
          >
            {data?.schoolData?.name}
          </Text>
        </Box>
        <Image
          src="./assets/school-logo.png" // Replace with your logo path
          alt="School Logo"
          height="60px"
        />
      </Flex>
      <Flex
        align="center"
        justify="center"
        w="100%"
        height={"30px"}
        bg={"#e6f5f8"}
        textAlign={"center"}
      >
        <Text
          fontSize="xs"
          color="black"
          fontWeight={"medium"}
          fontFamily="'Oswald', sans-serif"
        >
          KALI KI BAGICHI,BHARATPUR {data?.schoolData?.district.toUpperCase()} (
          {data?.schoolData?.state.toUpperCase()}), 321001
        </Text>
      </Flex>

      <Flex
        align="center"
        justify="center"
        w="100%"
        height={"30px"}
        bg={"#e6f5f8"}
        textAlign={"center"}
      >
        <Text
          fontSize="md"
          color="#25738a"
          fontWeight={"semibold"}
          fontFamily="'Oswald', sans-serif"
          letterSpacing="wider"
        >
          ANNUAL CUMULATIVE PROGRESS REPORT :{" "}
          {moment(data?.sessionData?.startDate).format("YYYY")} -{" "}
          {moment(data?.sessionData?.endDate).format("YYYY")}
        </Text>
      </Flex>
    </Box>
  );
};
