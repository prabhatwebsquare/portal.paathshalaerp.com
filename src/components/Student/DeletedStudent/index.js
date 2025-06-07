import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { useStudentStore } from "@/store/studentStore";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { LoadingContainer } from "@/common/LoadingContainer";
import { URL } from "@/services/apis";
import Pagination from "@/common/Pagination";
import CustomInput from "@/common/CustomInput";
import { GrPowerReset } from "react-icons/gr";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { DeleteButton } from "@/common/DeleteButton";
import { RestrictStudentModal } from "@/common/RestrictStudentModal";

export const DeletedStudentList = ({ themeColor, sessionMasterId }) => {
  const reset = () => {};

  const {
    getFilterStudentsAction,
    filterStudents,
    getFilterStudentsStatus,
    hardDeleteStudentsAction,
    hardDeleteStatus,
    restoreStudentAction,
  } = useStudentStore((s) => ({
    getFilterStudentsAction: s.getFilterStudentsAction,
    getFilterStudentsStatus: s.getFilterStudentsStatus,
    filterStudents: s.filterStudents,
    hardDeleteStudentsAction: s.hardDeleteStudentsAction,
    hardDeleteStatus: s.hardDeleteStatus,
    restoreStudentAction: s.restoreStudentAction,
  }));
  useEffect(() => {
    getFilterStudentsAction({
      sessionMasterId,
      status: 1,
      classMasterId: "all",
      streamMasterId: "all",
      sectionMasterId: "all",
    });

    return () => {};
  }, []);
  const confirmDelete = (id) => {
    hardDeleteStudentsAction(id);
  };
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const handleRestriction = (data) => {
    restoreStudentAction({
      type: "active",
      status: 0,
      promotionId: selectedStudentId,
      sessionMasterId,
      remark: data.remark,
      date: data.date,
    });
    setShowModal(false);
  };

  return (
    <Box h={"100%"}>
      <PageHeader heading={"Deleted Student Records's List"} />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getFilterStudentsStatus}>
            {filterStudents?.length ? (
              <TableContainer mt={5}>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>SR No.</Th>
                      <Th>Name</Th>
                      <Th>Father&apos;s Name</Th>
                      <Th>Contact</Th>
                      <Th>Class/ Stream/ Section</Th>
                      <Th>Gender</Th>
                      <Th>Address</Th>
                      {HasPermission(PERMISSIONS.STUDENT_LIST_DELETE) && (
                        <>
                          <Th>Action</Th>
                          <Th>Restore</Th>
                        </>
                      )}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(filterStudents, (std) => (
                      <Tr>
                        <Td>{std.student_master?.srNo}</Td>
                        <Td
                          color={"blue.400"}
                          fontWeight={"semibold"}
                          cursor={"pointer"}
                          onClick={() => selectStudent(std)}
                        >
                          <Flex>
                            <Avatar
                              mr={3}
                              size={"xs"}
                              src={`${URL}${std.student_master?.photo}`}
                            />
                            {std.student_master?.studentName}
                          </Flex>
                        </Td>
                        <Td>{std.student_master?.fatherName}</Td>
                        <Td>{std.student_master?.fatherContact}</Td>
                        <Td>
                          {std.class_master?.name} - {std.stream_master?.name} -{" "}
                          {std.section_master?.name}
                        </Td>
                        <Td>{std.student_master?.gender}</Td>
                        <Td>{std.student_master?.address}</Td>
                        {HasPermission(PERMISSIONS.STUDENT_LIST_DELETE) && (
                          <Td>
                            <DeleteButton
                              description={
                                "Are you sure? Do you want to delete?"
                              }
                              confirm={() => confirmDelete(std.id)}
                              label={"Permanent Delete"}
                            />
                          </Td>
                        )}
                        <Td>
                          <Button
                            size="xs"
                            colorScheme={themeColor}
                            onClick={() => {
                              setShowModal(true);
                              setSelectedStudentId(std.id);
                            }}
                          >
                            Restore
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Deleted Student Records Found"} />
            )}
          </LoadingContainer>
        </Box>
      </Box>
      {showModal && (
        <RestrictStudentModal
          heading="Restore Student"
          description="Please provide the Restore details below."
          closeAlert={() => setShowModal(false)}
          confirm={(data) => handleRestriction(data)} // handleRestriction is the function to process the restriction
          loading={false}
          button="Restore"
        />
      )}
    </Box>
  );
};
