import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  Image,
  Divider,
  VStack,
} from "@chakra-ui/react";
const PtmList = () => {
  const feeData = [
    ["Fee", 500, 500, 0, 1000],
    ["Exam Fees", 1000, 500, 0, 500],
    ["Last Year Dues", 500, 0, 0, 500],
    ["Admission", 1000, 0, 0, 1000],
  ];
  const totalFee = feeData.reduce(
    (acc, row) => acc.map((val, i) => val + (row[i + 1] || 0)),
    [0, 0, 0, 0]
  );
  const attendanceData = [
    ["January/2025", 3, 0, 1, 1, 2],
    ["June/2024", 2, 0, 1, 0, 1],
    ["July/2024", 2, 0, 1, 0, 1],
    ["August/2024", 9, 0, 22, 0, 22],
  ];
  const totalAttendance = attendanceData.reduce(
    (acc, row) => acc.map((val, i) => val + (row[i + 1] || 0)),
    [0, 0, 0, 0, 0, 0]
  );
  const examData = [
    ["First Test", "HINDI", 10, 0, 1],
    ["First Test", "MATHS", 10, 0, 2],
    ["First Test", "Computer", 10, 0, 3],
    ["First Test", "ENGLISH", 10, 0, 4],
    ["Second Test", "MATHS", 10, 0, 5],
  ];
  const totalExam = examData.reduce(
    (acc, row) => acc.map((val, i) => val + (row[i + 2] || 0)),
    [0, 0, 0]
  );
  return (
    <Box maxW="850px" mx="auto" p="2" border="1px solid black" bg="white">
      <Flex justify="space-between" align="center" mb="4">
        <Image
          src="/assets/slogo1.jpg"
          alt="School Logo"
          boxSize="100px"
          ml={10}
        />
        <Box mr={20}>
          <Text fontSize="lg" fontWeight="bold" color="purple.600">
            paathshala Smart
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            (Affiliated to: RAJASTHAN UNIVERSITY)
          </Text>
          <Text fontSize="sm" fontWeight="bold" color="purple.600">
            HALENA, TEH- WEIR, BHARATPUR (RAJ.), Ph: 0941437546
          </Text>
        </Box>
      </Flex>
      <Divider my="2" />

      <Text fontSize="lg" fontWeight="bold" align="center" color="purple.600">
        PTM Report (Session: 2024-2025)
      </Text>

      <Flex justify="space-between" mb="4">
        <Box>
          <Text>
            Student Name:&nbsp;&nbsp;
            <b style={{ fontSize: "13px" }}>Komal Dubey</b>{" "}
          </Text>
          <Text>
            Father&apos;s Name:&nbsp;&nbsp;
            <b style={{ fontSize: "13px" }}>Mr. Suresh Dubey</b>{" "}
          </Text>
          <Text>
            Mother&apos;s Name:&nbsp;&nbsp;
            <b style={{ fontSize: "13px" }}>Misses Sanju Dubey</b>{" "}
          </Text>
          <Text>
            Address:&nbsp;&nbsp;<b style={{ fontSize: "13px" }}>Not</b>{" "}
          </Text>
          <Text>
            Telephone No.:&nbsp;&nbsp;<b style={{ fontSize: "13px" }}>Not</b>{" "}
          </Text>
          <Text>
            Category:&nbsp;&nbsp;<b style={{ fontSize: "13px" }}>General</b>{" "}
          </Text>
        </Box>
        <Box>
          <Text>
            Sr No.:&nbsp;&nbsp;<b style={{ fontSize: "13px" }}>5115</b>{" "}
          </Text>
          <Text>
            Roll No.:&nbsp;&nbsp;<b style={{ fontSize: "13px" }}>56</b>{" "}
          </Text>
          <Text>
            Class & Section:&nbsp;&nbsp;
            <b style={{ fontSize: "13px" }}>1st - A</b>{" "}
          </Text>
          <Text>
            House:&nbsp;&nbsp;<b style={{ fontSize: "13px" }}>Not Given</b>{" "}
          </Text>
          <Text>
            Date of Birth:&nbsp;&nbsp;
            <b style={{ fontSize: "13px" }}>Jul 31, 2003</b>{" "}
          </Text>
          <Text>
            Admission No.:&nbsp;&nbsp;<b style={{ fontSize: "13px" }}>52</b>{" "}
          </Text>
        </Box>
        <Box>
          <Text>
            Session:&nbsp;&nbsp;<b style={{ fontSize: "13px" }}> 2024-2025</b>
          </Text>
          <Text>
            Promoted Date:&nbsp;&nbsp;
            <b style={{ fontSize: "13px" }}>Jul 31, 2007</b>{" "}
          </Text>
          <Text>
            Gender:&nbsp;&nbsp;<b style={{ fontSize: "13px" }}>Female</b>{" "}
          </Text>
          <Text>
            Admission Date:&nbsp;&nbsp;
            <b style={{ fontSize: "13px" }}>Jul 01, 2018</b>{" "}
          </Text>
          <Text>
            Author No:&nbsp;&nbsp;<b style={{ fontSize: "13px" }}>Max Marks</b>{" "}
          </Text>
          <Text>
            Caste:&nbsp;&nbsp;<b style={{ fontSize: "13px" }}>uhfs</b>{" "}
          </Text>
        </Box>
      </Flex>

      <Divider />
      <Text fontSize="lg" fontWeight="bold" my="3">
        Fee Summary
      </Text>
      <Table variant="simple">
        <Thead bg="gray.200">
          <Tr>
            <Th>S.No</Th>
            <Th>Fees</Th>
            <Th>Amount</Th>
            <Th>Deposit</Th>
            <Th>Discount</Th>
            <Th>Balance</Th>
          </Tr>
        </Thead>
        <Tbody>
          {[
            ["Fee", 500, 500, 0, 1000],
            ["Exam Fees", 1000, 500, 0, 500],
            ["Last Year Dues", 500, 0, 0, 500],
            ["Admission", 1000, 0, 0, 1000],
          ].map((row, i) => (
            <Tr key={i}>
              <Td>{i + 1}</Td>
              <Td>{row[0]}</Td>
              <Td>{row[1]}</Td>
              <Td>{row[2]}</Td>
              <Td>{row[3]}</Td>
              <Td>{row[4]}</Td>
            </Tr>
          ))}
          <Tr fontWeight="bold" bg="gray.100">
            <Td colSpan={2}>Total</Td>
            <Td>{totalFee[0]}</Td>
            <Td>{totalFee[1]}</Td>
            <Td>{totalFee[2]}</Td>
            <Td>{totalFee[3]}</Td>
          </Tr>
        </Tbody>
      </Table>
      <Text fontSize="lg" fontWeight="bold" my="3">
        Attendance Summary
      </Text>
      <Table variant="simple">
        <Thead bg="gray.200">
          <Tr>
            <Th>Sr No.</Th>
            <Th>Month</Th>
            <Th>C.M.</Th>
            <Th>C.P.</Th>
            <Th>C.A.</Th>
            <Th>T.</Th>
            <Th>T.P.</Th>
            <Th>T.A.</Th>
          </Tr>
        </Thead>
        <Tbody>
          {[
            ["January/2025", 3, 0, 1, 1, 1, 2],
            ["June/2024", 2, 0, 1, 0, 0, 1],
            ["July/2024", 2, 0, 1, 0, 0, 1],
            ["August/2024", 9, 0, 22, 0, 0, 22],
          ].map((row, i) => (
            <Tr key={i}>
              <Td>{i + 1}</Td>
              <Td>{row[0]}</Td>
              <Td>{row[1]}</Td>
              <Td>{row[2]}</Td>
              <Td>{row[3]}</Td>
              <Td>{row[4]}</Td>
              <Td>{row[5]}</Td>
              <Td>{row[6]}</Td>
            </Tr>
          ))}
          <Tr fontWeight="bold" bg="gray.100">
            <Td colSpan={2}>Total</Td>
            <Td>{totalAttendance[0]}</Td>
            <Td>{totalAttendance[1]}</Td>
            <Td>{totalAttendance[2]}</Td>
            <Td>{totalAttendance[3]}</Td>
            <Td>{totalAttendance[4]}</Td>
            <Td>{totalAttendance[5]}</Td>
          </Tr>
        </Tbody>
      </Table>
      <Text fontSize="lg" fontWeight="bold" my="3">
        Exam Summary
      </Text>
      <Table variant="simple">
        <Thead bg="gray.200">
          <Tr>
            <Th>Sr No.</Th>
            <Th>Month</Th>
            <Th>C.M.</Th>
            <Th>C.P.</Th>
            <Th>C.A.</Th>
            <Th>T.P.</Th>
            <Th>T.A.</Th>
          </Tr>
        </Thead>
        <Tbody>
          {[
            ["January/2025", 3, 0, 1, 1, 2],
            ["June/2024", 2, 0, 1, 0, 1],
            ["July/2024", 2, 0, 1, 0, 1],
            ["August/2024", 9, 0, 22, 0, 22],
          ].map((row, i) => (
            <Tr key={i}>
              <Td>{i + 1}</Td>
              <Td>{row[0]}</Td>
              <Td>{row[1]}</Td>
              <Td>{row[2]}</Td>
              <Td>{row[3]}</Td>
              <Td>{row[4]}</Td>
              <Td>{row[5]}</Td>
            </Tr>
          ))}
          <Tr fontWeight="bold" bg="gray.100">
            <Td colSpan={3}>Total</Td>
            <Td>{totalExam[0]}</Td>
            <Td>{totalExam[1]}</Td>
            <Td></Td>
            <Td>-</Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};
export default PtmList;
