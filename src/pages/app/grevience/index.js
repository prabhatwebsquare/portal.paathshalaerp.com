import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Input,
} from "@chakra-ui/react";
import { PageHeader } from "@/common/PageHeader";
import { MainLayout } from "@/layout/MainLayout";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { LoadingContainer } from "@/common/LoadingContainer";
import { FILE_URL } from "@/services/apis";
import { useMobileAppStore } from "@/store/MobileApp";
import { STATUS } from "@/constant";

function GreviencePage() {
  const PAGE_SIZE = 10;
  const themeColor = useMemo(() => getLocalStorageItem("themeColor"), []);
  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    getGrevienceAction,
    getgreviencetatus,
    allgrevience = [],
    updategreviencetatus,
    updateGrevienceAction,
  } = useMobileAppStore((s) => ({
    getGrevienceAction: s.getGrevienceAction,
    getgreviencetatus: s.getgreviencetatus,
    allgrevience: s.allgrevience,
    updategreviencetatus: s.updategreviencetatus,
    updateGrevienceAction: s.updateGrevienceAction,
  }));
  useEffect(() => {
    if ((getgreviencetatus || 1) === STATUS.NOT_STARTED) {
      getGrevienceAction({
        page: currentPage,
        limit: PAGE_SIZE,
        status: 0,
        sessionMasterId,
      });
    }
  }, [getGrevienceAction, getgreviencetatus, currentPage]);

  useEffect(() => {
    if (allgrevience?.length) {
      setTotalPages(Math.ceil(allgrevience.length / PAGE_SIZE));
    }
  }, [allgrevience]);

  const handleStatusChange = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    updateGrevienceAction({
      status: newStatus,
      id,
    });
  };

  useEffect(() => {
    if (updategreviencetatus === STATUS.SUCCESS) {
      getGrevienceAction({
        page: currentPage,
        limit: PAGE_SIZE,
        status: 0,
        sessionMasterId,
      });
    }
  }, [updategreviencetatus]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <MainLayout>
      <PageHeader heading="Grievance" />
      <Box className="scrollBar" h="100%" maxH="80%" overflowY="scroll">
        <LoadingContainer status={getgreviencetatus}>
          <TableContainer mt={2}>
            <Table w="100%" size="sm" variant="simple">
              <Thead>
                <Tr bg="gray.100">
                  <Th>S.No.</Th>
                  <Th>Student Name</Th>
                  <Th>Father Name</Th>
                  <Th>Class</Th>
                  <Th>Stream</Th>
                  <Th>Section</Th>
                  <Th>Mobile No</Th>
                  <Th>Reason</Th>
                  <Th>Message</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Array.isArray(allgrevience) &&
                  allgrevience
                    .slice(
                      (currentPage - 1) * PAGE_SIZE,
                      currentPage * PAGE_SIZE
                    )
                    .map((item, index) => {
                      const student = item?.promotion?.student_master;
                      const classDetails =
                        item?.promotion?.class_master?.name || "-";
                      const stream =
                        item?.promotion?.stream_master?.name || "-";
                      const section =
                        item?.promotion?.section_master?.name || "-";

                      return (
                        <Tr key={item.id}>
                          <Td>{(currentPage - 1) * PAGE_SIZE + index + 1}</Td>
                          <Td>
                            <Flex alignItems="center">
                              <Avatar
                                src={FILE_URL + student?.photo || "default.png"}
                                mr={2}
                              />
                              <Text
                                fontSize="sm"
                                fontWeight="semibold"
                                color="gray.700"
                              >
                                {student?.studentName || "-"}
                              </Text>
                            </Flex>
                          </Td>
                          <Td>{student?.fatherName || "-"}</Td>
                          <Td>{classDetails}</Td>
                          <Td>{stream}</Td>
                          <Td>{section}</Td>
                          <Td>{student?.studentContact || "-"}</Td>
                          <Td>{item.reason || "-"}</Td>
                          <Td>{item.message?.replace("\n", " ") || "-"}</Td>
                          <Td>{item.date || "-"}</Td>
                          <Td>
                            <Text
                              fontSize="sm"
                              color={
                                item.status === 1 ? "green.500" : "red.500"
                              }
                              fontWeight="bold"
                            >
                              {item.status === 1 ? "Active" : "Inactive"}
                            </Text>
                          </Td>
                          <Td>
                            <Switch
                              size="md"
                              isChecked={item.status === 1}
                              colorScheme={item.status === 1 ? "green" : "red"}
                              onChange={() =>
                                handleStatusChange(item.id, item.status)
                              }
                              aria-label="Change Status"
                            />
                          </Td>
                        </Tr>
                      );
                    })}
              </Tbody>
            </Table>
          </TableContainer>

          {/* Pagination Controls */}
          <Flex mt={4} justify="center" align="center" gap={2}>
            <Button
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              isDisabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                size="sm"
                colorScheme={i + 1 === currentPage ? themeColor : "gray"}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              isDisabled={currentPage === totalPages}
            >
              Next
            </Button>
          </Flex>
        </LoadingContainer>
      </Box>
    </MainLayout>
  );
}

export default GreviencePage;
