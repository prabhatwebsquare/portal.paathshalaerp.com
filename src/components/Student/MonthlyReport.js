import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from "@chakra-ui/react";

function Home() {
  const data = [
    {
        SrNo:"1",
      date: "11-01-2025",
      tuitionFee: 63600,
      paymentMode: "Cash",
      total: 63600,
    },
    {
        SrNo:"2",
      date: "12-01-2025",
      tuitionFee: 63445,
      paymentMode: "Card",
      total: 63445,
    },
    {
        SrNo:"3",
      date: "13-01-2025",
      tuitionFee: 132790,
      paymentMode: "Online",
      total: 132790,
    },
    {
        SrNo:"4",
      date: "14-01-2025",
      tuitionFee: 84600,
      paymentMode: "Cash",
      total: 84600,
    },
    {
        SrNo:"5",
      date: "15-01-2025",
      tuitionFee: 34400,
      paymentMode: "Card",
      total: 34400,
    },
    {
        SrNo:"6",
      date: "16-01-2025",
      tuitionFee: 246290,
      paymentMode: "Online",
      total: 246290,
    },
    {
        SrNo:"7",
      date: "17-01-2025",
      tuitionFee: 118200,
      paymentMode: "Cash",
      total: 118200,
    },
    {
        SrNo:"8",
      date: "18-01-2025",
      tuitionFee: 179445,
      paymentMode: "Online",
      total: 179445,
    },
    {
        SrNo:"9",
      date: "19-01-2025",
      tuitionFee: 180190,
      paymentMode: "Card",
      total: 180190,
    },
    {
        SrNo:"10",
      date: "20-01-2025",
      tuitionFee: 141866,
      paymentMode: "Cash",
      total: 141866,
    },
    {
        SrNo:"11",
      date: "21-01-2025",
      tuitionFee: 319260,
      paymentMode: "Online",
      total: 319260,
    },
    {
        SrNo:"12",
      date: "22-01-2025",
      tuitionFee: 481125,
      paymentMode: "Online",
      total: 481125,
    },
    {
        SrNo:"13",
      date: "23-01-2025",
      tuitionFee: 415101,
      paymentMode: "Cash",
      total: 415101,
    },
    {
        SrNo:"14",
      date: "24-01-2025",
      tuitionFee: 552975,
      paymentMode: "Card",
      total: 552975,
    },
    {
        SrNo:"15",
      date: "25-01-2025",
      tuitionFee: 139600,
      paymentMode: "Online",
      total: 139600,
    },
    {
        SrNo:"16",
      date: "26-01-2025",
      tuitionFee: 100405,
      paymentMode: "Cash",
      total: 100405,
    },
  ];

  const total = {
    tuitionFee: 228292,
    total: 4580292,
  };
  return (
    <Box
      p={8}
      bg="white"
      color="#2D2B2B"
      width="770px"
      margin="0 auto"
      fontFamily="Arial, sans-serif"
      fontSize="12px"
      border="1px solid black"
    >
      <Text fontSize="16px" fontWeight="bold" textAlign="center" mb={1}>
        Monthly Report: 11-01-2025 to 26-01-2025 <br />
        SONY ACADEMY PUBLIC SENIOR SECONDARY SCHOOL <br />
      </Text>
      <Text fontSize="12px"  textAlign="center" mb={4}>
       NEEMDA GATE BHARATPUR, BHARATPUR, HELPLINE: 9314115555
      </Text>
      <Table
        variant="unstyled"
        size="sm"
        border="1px solid black"
        borderCollapse="collapse"
        width="100%"
      >
        <Thead>
          <Tr>
            <Th   
             border="1px solid black"
            textAlign="center" 
            fontWeight="bold"
            color="black"
            >
                Sr No
            </Th>
            <Th
              border="1px solid black"
              textAlign="center"
              fontWeight="bold"
              color="black"
            >
              Date
            </Th>
             
            <Th
              border="1px solid black"
              textAlign="center"
              fontWeight="bold"
              color="black"
            >
              Tuition Fee
            </Th>
            <Th
              border="1px solid black"
              textAlign="center"
              fontWeight="bold"
              color="black"
            >
              Payment Mode
            </Th>
            <Th
              border="1px solid black"
              textAlign="center"
              fontWeight="bold"
              color="black"
            >
              Total
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, index) => (
            <Tr key={index}>
                <Td
                border="1px solid black"
                textAlign="center"
                bg="white"
                color="#2A2828"
              >
                {row.SrNo}
              </Td>
              <Td
                border="1px solid black"
                textAlign="center"
                bg="white"
                color="#2A2828"
              >
                {row.date}
              </Td>
              <Td
                border="1px solid black"
                textAlign="center"
                bg="white"
                color="#2A2828"
              >
                {row.tuitionFee}
              </Td>
              <Td
                border="1px solid black"
                textAlign="center"
                bg="white"
                color="#2A2828"
              >
                {row.paymentMode}
              </Td>
              <Td
                border="1px solid black"
                textAlign="center"
                bg="white"
                color="#2A2828"
              >
                {row.total}
              </Td>
            </Tr>
          ))}
          <Tr fontWeight="bold">
          <Td
              border="1px solid black"
              textAlign="center"
              bg="white"
              color="black"
            >
              -
            </Td>
            <Td
              border="1px solid black"
              textAlign="center"
              bg="white"
              color="black"
            >
              Total
            </Td>
            <Td
              border="1px solid black"
              textAlign="center"
              bg="white"
              color="black"
            >
              {total.tuitionFee}
            </Td>
            <Td
              border="1px solid black"
              textAlign="center"
              bg="white"
              color="black"
            >
              -
            </Td>
            <Td
              border="1px solid black"
              textAlign="center"
              bg="white"
              color="black"
            >
              {total.total}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
}
export default Home;
