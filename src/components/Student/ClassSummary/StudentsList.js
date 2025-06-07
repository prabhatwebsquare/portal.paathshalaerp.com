import { DownloadExcel } from "@/common/DownloadExcel";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { PageHeader } from "@/common/PageHeader";
import Pagination from "@/common/Pagination";
import { STATUS } from "@/constant";
import { useStdFeesStore } from "@/store/stdFees";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { map, split, sum, sumBy } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { RiFileExcel2Fill } from "react-icons/ri";

export const StudentsList = ({ id }) => {
  const { query } = useRouter();
  const router = useRouter();

  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
  );
  const themeColor = useMemo(() => getLocalStorageItem("themeColor"), []);
  const [limit, setLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    getClassStudentAction,
    getClassStudentStatus,
    ClassStudent,
    resetClassSummary,
  } = useStdFeesStore((s) => ({
    getClassStudentAction: s.getClassStudentAction,
    getClassStudentStatus: s.getClassStudentStatus,
    ClassStudent: s.ClassStudent,
    resetClassSummary: s.resetClassSummary,
  }));

  useEffect(() => {
    if (
      sessionMasterId &&
      (getClassStudentStatus || 1) === STATUS.NOT_STARTED
    ) {
      const ids = split(query.slug, "_");
      getClassStudentAction({
        sessionMasterId,
        classMasterId: ids[0],
        streamMasterId: ids[1],
        sectionMasterId: ids[2] || null,
        page: currentPage,
        limit: parseInt(limit),
      });
    }
  }, [
    getClassStudentAction,
    getClassStudentStatus,
    query.slug,
    sessionMasterId,
    currentPage,
    limit,
  ]);
  useEffect(() => {
    const ids = split(query?.slug, "_");
    getClassStudentAction({
      sessionMasterId,
      classMasterId: ids[0],
      streamMasterId: ids[1],
      sectionMasterId: ids[2] || null,
      page: currentPage,
      limit: parseInt(limit),
    });
  }, [currentPage, limit]);

  useEffect(() => {
    return () => {
      resetClassSummary();
      setCurrentPage(1);
      setLimit(20);
    };
  }, [resetClassSummary]);

  const [excelData, setExcelData] = useState(null);
  useEffect(() => {
    if (ClassStudent?.data?.length > 0) {
      setExcelData(ClassStudent?.data);
    }
  }, [ClassStudent?.data]);

  console.log(ClassStudent, "ClassStudent");

  return (
    <Box h="100%">
      <PageHeader
        heading={`Student Summary`}
        extra={
          <DownloadExcel
            button={<RiFileExcel2Fill />}
            data={excelData}
            name={`Student Summary`}
          />
        }
      />
      <Box className="scrollBar" maxH={"90%"} overflowY={"scroll"}>
        <LoadingContainer status={getClassStudentStatus}>
          <Pagination
            totalItems={ClassStudent?.totalCount}
            limit={limit}
            setLimit={setLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            themeColor={themeColor}
          />
          {ClassStudent?.data?.length ? (
            <TableContainer mt={2}>
              <Table w="100%" size={"sm"} variant={"simple"}>
                <Thead>
                  <Tr bg="gray.100">
                    <Th>Sr No.</Th>
                    <Th>Student</Th>
                    <Th>Class</Th>
                    <Th>Stream</Th>
                    <Th>Section</Th>
                    <Th>Father Name</Th>
                    <Th>Contact</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {map(ClassStudent?.data, (std, index) => (
                    <Tr key={std.id}>
                      <Td>{std.student_master?.srNo}</Td>
                      <Td>
                        <Flex
                        
                        >
                          {std.student_master?.studentName}
                        </Flex>
                      </Td>
                      <Td>{std.class_master?.name}</Td>
                      <Td>{std.stream_master?.name}</Td>
                      <Td>{std.section_master?.name}</Td>
                      <Td>{std.student_master?.fatherName}</Td>
                      <Td>{std.student_master?.fatherContact}</Td>
                    </Tr>
                  ))}
                  <Tr fontWeight={"bold"} bg="gray.100">
                    <Td colSpan={2}>Total</Td>
                    <Td colSpan={5}>{ClassStudent?.totalCount}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <NoData title={"No Student Fees Found"} />
          )}
        </LoadingContainer>
      </Box>
    </Box>
  );
};
