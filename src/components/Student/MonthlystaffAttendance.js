// import React, { useMemo, useState } from "react";
// import {
//   Box,
//   Button,
//   Input,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   TableContainer,
//   Heading,
//   Flex,
//   Text,
//   HStack,
//   Spacer,
//   Select,
//   Tooltip,
// } from "@chakra-ui/react";
// import { AddSession } from "../AdditionalSetting/AddSession";
// import { getLocalStorageItem } from "@/utils/LocalStorage";
// import { PageHeader } from "@/common/PageHeader";
// import CustomInput from "@/common/CustomInput";
// import dayjs from "dayjs";
// import { MdLocalPrintshop } from "react-icons/md";
// import { RiFileExcel2Fill } from "react-icons/ri";
// import { DownloadExcel } from "@/common/DownloadExcel";

// const MonthlystaffAttendance = () => {
//   const [startDate, setStartDate] = useState("2025-01-01");
//   const [endDate, setEndDate] = useState("2025-01-18");
//   const [rows, setRows] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const attendanceData = [
//     {
//       name: "John Doe",
//       daysPresent: 20,
//       daysAbsent: 2,
//       month: "January",
//       year: 2025,
//     },
//   ];

//   const handlePageChange = (newPage) => setPage(newPage);
//   const handleRowsPerPageChange = (event) =>
//     setRowsPerPage(+event.target.value);
//   const paginatedData = attendanceData.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );
//   const themeColor = useMemo(() => getLocalStorageItem("themeColor"), []);
//   const [inputValue, setInputValue] = useState({
//     startDate: dayjs().format("YYYY-MM-DD"),
//     endDate: dayjs().format("YYYY-MM-DD"),
//   });

//   return (
//     <Box p={0}>
//       <PageHeader
//         heading={" Monthly Staff Attendance"}
//         extra={
//           <Flex>
//             <Tooltip label="Print" placement="top">
//               <Button
//                 mr={3}
//                 size={"sm"}
//                 // onClick={handlePrint}
//                 colorScheme={themeColor}
//               >
//                 <MdLocalPrintshop fontSize={18} />
//               </Button>
//             </Tooltip>
//             <Tooltip label="Download Excel" placement="top">
//               <DownloadExcel
//                 button={<RiFileExcel2Fill />}
//                 // data={excelData}
//                 name={"UserWise Fees Collection"}
//               />
//             </Tooltip>
//           </Flex>
//         }
//       />

//       <Flex wrap="wrap" gap={4} mb={6}>
//         <CustomInput
//           w={"20%"}
//           size={"sm"}
//           notRequire={true}
//           type={"date"}
//           name="startDate"
//           label={"Select Start Date"}
//           inputValue={inputValue}
//           setInputValue={setInputValue}
//         />
//         <CustomInput
//           w={"20%"}
//           size={"sm"}
//           notRequire={true}
//           type={"date"}
//           name="endDate"
//           label={"Select End Date"}
//           inputValue={inputValue}
//           setInputValue={setInputValue}
//         />
//         <Button size={"sm"} colorScheme={themeColor}>
//           Fetch
//         </Button>
//         <Button size={"sm"} colorScheme={themeColor}>
//           All GatePass History
//         </Button>
//       </Flex>
//       <TableContainer
//         border="1px solid"
//         borderColor="gray.200"
//         borderRadius="md"
//       >
//         <Table variant="striped" colorScheme="gray">
//           <Thead>
//             <Tr>
//               <Th>Name</Th>
//               <Th>Days Present</Th>
//               <Th>Days Absent</Th>
//               <Th>Month</Th>
//               <Th>Year</Th>
//             </Tr>
//           </Thead>
//           <Tbody>
//             {paginatedData.map((data, index) => (
//               <Tr key={index}>
//                 <Td>{data.name}</Td>
//                 <Td>{data.daysPresent}</Td>
//                 <Td>{data.daysAbsent}</Td>
//                 <Td>{data.month}</Td>
//                 <Td>{data.year}</Td>
//               </Tr>
//             ))}
//           </Tbody>
//         </Table>
//       </TableContainer>

//       <Flex align="center" justify="space-between" mt={4}>
//         <Text>
//           Page {page + 1} of {Math.ceil(rows.length / rowsPerPage) || 1}
//         </Text>
//         <Spacer />
//         <HStack spacing={4}>
//           <Button
//             isDisabled={page === 0}
//             onClick={() => handlePageChange(page - 1)}
//           >
//             Previous
//           </Button>
//           <Select
//             width="100px"
//             value={rowsPerPage}
//             onChange={handleRowsPerPageChange}
//           >
//             {[5, 10, 15].map((value) => (
//               <option key={value} value={value}>
//                 {value} rows
//               </option>
//             ))}
//           </Select>
//           <Button
//             isDisabled={page + 1 === Math.ceil(rows.length / rowsPerPage)}
//             onClick={() => handlePageChange(page + 1)}
//           >
//             Next
//           </Button>
//         </HStack>
//       </Flex>
//     </Box>
//   );
// };
// export default MonthlystaffAttendance;

import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Text,
  HStack,
  Spacer,
  Select,
  Tooltip,
} from "@chakra-ui/react";
import { MdLocalPrintshop } from "react-icons/md";
import { RiFileExcel2Fill } from "react-icons/ri";
import { DownloadExcel } from "@/common/DownloadExcel";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { PageHeader } from "@/common/PageHeader";
import CustomInput from "@/common/CustomInput";
import dayjs from "dayjs";

const MonthlystaffAttendance = () => {
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-01-18");
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // const attendanceData = [
  //   {
  //     name: "John Doe",
  //     empCode: "EMP001",
  //     present: 20,
  //     absent: 2,
  //     halfday: 1,
  //     leave: 2,
  //     month: "January",
  //     year: 2025,
  //   },
  // ];

  const handlePageChange = (newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) =>
    setRowsPerPage(+event.target.value);
  // const paginatedData = attendanceData.slice(
  //   page * rowsPerPage,
  //   page * rowsPerPage + rowsPerPage
  // );
  const themeColor = useMemo(() => getLocalStorageItem("themeColor"), []);
  const [inputValue, setInputValue] = useState({
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });
  return (
    <Box p={3}>
      <PageHeader
        heading={"Monthly Staff Attendance"}
        extra={
          <Flex>
            <Tooltip label="Print" placement="top">
              <Button
                mr={3}
                size={"sm"}
                // onClick={handlePrint}
                colorScheme={themeColor}
              >
                <MdLocalPrintshop fontSize={18} />
              </Button>
            </Tooltip>
            <Tooltip label="Download Excel" placement="top">
              <DownloadExcel
                button={<RiFileExcel2Fill />}
                // data={excelData}
                name={"UserWise Fees Collection"}
              />
            </Tooltip>
          </Flex>
        }
      />

      <Flex wrap="wrap" gap={4} mb={6} mt={10}>
        <CustomInput
          w={"20%"}
          size={"sm"}
          notRequire={true}
          type={"date"}
          name="startDate"
          label={"Select Start Date"}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
        <CustomInput
          w={"20%"}
          size={"sm"}
          notRequire={true}
          type={"date"}
          name="endDate"
          label={"Select End Date"}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
        <Button size={"sm"} colorScheme={themeColor}>
          Fetch
        </Button>
        <Button size={"sm"} colorScheme={themeColor}>
          All GatePass History
        </Button>
      </Flex>
      <TableContainer
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
      >
        <Table variant="striped" colorScheme="gray">
          <Thead>     
            <Tr>
              <Th>Name</Th>
              <Th>Emp Code</Th>
              <Th>Present</Th>
              <Th>Absent</Th>
              <Th>Halfday</Th>
              <Th>Leave</Th>
              <Th>Month</Th>
              <Th>Year</Th>
            </Tr>
          </Thead>
          {/* <Tbody>
            {paginatedData.map((data, index) => (
              <Tr key={index}>
                <Td>{data.name}</Td>
                <Td>{data.empCode}</Td>
                <Td>{data.present}</Td>
                <Td>{data.absent}</Td>
                <Td>{data.halfday}</Td>
                <Td>{data.leave}</Td>
                <Td>{data.month}</Td>
                <Td>{data.year}</Td>
              </Tr>
            ))}
          </Tbody> */}
        </Table>
      </TableContainer>

      {/* <Flex align="center" justify="space-between" mt={4}>
        <Text>
          Page {page + 1} of {Math.ceil(rows.length / rowsPerPage) || 1}
        </Text>
        <Spacer />
        <HStack spacing={4}>
          <Button
            isDisabled={page === 0}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </Button>
          <Select
            width="100px"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            {[5, 10, 15].map((value) => (
              <option key={value} value={value}>
                {value} rows
              </option>
            ))}
          </Select>
          <Button
            isDisabled={page + 1 === Math.ceil(rows.length / rowsPerPage)}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </Button>
        </HStack>
      </Flex> */}
    </Box>
  );
};

export default MonthlystaffAttendance;
