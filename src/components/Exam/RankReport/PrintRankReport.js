import { SchoolHeader } from "@/common/SchoolHeader";
import { URL } from "@/services/apis";
import { Avatar, Box, Flex, Image, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr, Grid, Divider, } from "@chakra-ui/react";
import dayjs from "dayjs";
import { compact, find, map } from "lodash";
import { useEffect } from "react";

export const PrintRankReport = ({ data, setPrintProps, allAssignExams, inputValue, examSubject, themeColor }) => {

  useEffect(() => {
    return () => setPrintProps(null)
  }, [setPrintProps])

  return (
    <Box p={5}>
      <SchoolHeader title={"Rank Report"} extra={
        <>
          <Text>{data?.[0]?.class_master?.name} - {data?.[0]?.stream_master?.name}</Text>
          {compact(map(inputValue?.examMasterId, ex => find(allAssignExams, exam => exam.exam_master?.id === ex)?.exam_master?.name)).join(", ")}
          <Text>Subject : {inputValue?.subjectMasterId === "all" ? "ALL" : find(examSubject, sub => sub.subject_master?.id === parseInt(inputValue?.subjectMasterId))?.subject_master?.name}</Text>
        </>
      } />
      <TableContainer mt={2}>
        <Table w="100%" size={"sm"} variant={"simple"}>
          <Thead>
            <Tr bg="gray.100">
              <Th>Roll No.</Th>
              <Th>Name</Th>
              <Th>Father Name</Th>
              <Th>Total Marks</Th>
              <Th>Obt. Marks</Th>
              <Th>Rank</Th>
            </Tr>
          </Thead>
          <Tbody>
            {map(data, (std, index) => {
              return (
                <Tr key={index} _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                  <Td>{std.rollNo}</Td>
                  <Td>{std.student_master.studentName}</Td>
                  <Td>{std.student_master.fatherName}</Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box >
  );
}
