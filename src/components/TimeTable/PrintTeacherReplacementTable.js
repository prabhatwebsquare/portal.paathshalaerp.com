import React, { forwardRef } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from "@chakra-ui/react";

const PrintTeacherReplacementTable = forwardRef(({ data }, ref) => (
  <Box ref={ref} p={6} width="100%">
    <Text fontSize="xl" mb={4} fontWeight="bold" textAlign="center">
      Teacher Replacement Timetable
    </Text>
    <Table variant="simple" size="md" borderWidth="1px" borderColor="gray.200">
      <Thead bg="gray.100">
        <Tr>
          <Th>Date</Th>
          <Th>Period</Th>
          <Th>Class</Th>
          <Th>Section</Th>
          <Th>Subject</Th>
          <Th>Old Teacher</Th>
          <Th>New Teacher</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data?.map((row, index) => (
          <Tr key={index}>
            <Td>{row.date}</Td>
            <Td>{row.period_master?.name || "-"}</Td>
            <Td>{row.class_master?.name || "-"}</Td>
            <Td>{row.section_master?.name || "-"}</Td>
            <Td>{row.subject_master?.name || "-"}</Td>
            <Td>{row.oldStaff?.name || "-"}</Td>
            <Td>{row.staff?.name || "-"}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>
));

// Set a display name to resolve the warning
PrintTeacherReplacementTable.displayName = "PrintTeacherReplacementTable";

export default PrintTeacherReplacementTable;
