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
  Heading,
  Flex,
  Text,
  HStack,
  Spacer,
  Select,
  Tooltip,
} from "@chakra-ui/react";
import { AddSession } from "../AdditionalSetting/AddSession";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { PageHeader } from "@/common/PageHeader";
import CustomInput from "@/common/CustomInput";
import dayjs from "dayjs";
import { MdLocalPrintshop } from "react-icons/md";
import { RiFileExcel2Fill } from "react-icons/ri";
import { DownloadExcel } from "@/common/DownloadExcel";

const StaffGatePassHistory = () => {
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-01-18");
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // const gatePassData = [
  //   {
  //     name: "ABHAYPAL SINGH",
  //     reason: "Udise work going to sewer block shift",
  //     issuedBy: "Mr. V K SONI",
  //     dateTime: "18 Jan 2025 09:58 am",
  //   },
  // ];

  const handlePageChange = (newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) =>
    setRowsPerPage(+event.target.value);
  const themeColor = useMemo(() => getLocalStorageItem("themeColor"), []);
  const [inputValue, setInputValue] = useState({
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });

  return (
    <Box p={3}>
      <PageHeader
        heading={" Staff Gate Pass History"}
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
              <Th>Reason</Th>
              <Th>Issued By</Th>
              <Th>Date Time</Th>
            </Tr>
          </Thead>
          {/* <Tbody>
            {gatePassData.map((data, index) => (
              <Tr key={index}>
                <Td>{data.name}</Td>
                <Td>{data.reason}</Td>
                <Td>{data.issuedBy}</Td>
                <Td>{data.dateTime}</Td>
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
export default StaffGatePassHistory;
