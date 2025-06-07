import {
  Avatar,
  Box,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { groupBy, map, uniqBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { CustomSelect } from "@/common/CustomSelect";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import { useStudentStore } from "@/store/studentStore";
import { NoData } from "@/common/NoData";

export const StudentList = ({ themeColor, sessionMasterId }) => {
  const [inputValue, setInputValue] = useState({});

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };
  const { getSectionAction, getSectionStatus, allSections } =
    useClassSetupStore((s) => ({
      getSectionAction: s.getSectionAction,
      getSectionStatus: s.getSectionStatus,
      allSections: s.allSections,
    }));

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  const {
    getFilterStudentsAction,
    getFilterStudentsStatus,
    filterStudents,
    resetFilterStdStatus,
  } = useStudentStore((s) => ({
    getFilterStudentsAction: s.getFilterStudentsAction,
    getFilterStudentsStatus: s.getFilterStudentsStatus,
    filterStudents: s.filterStudents,
    resetFilterStdStatus: s.resetFilterStdStatus,
  }));

  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
    if ((getSectionStatus || 1) === STATUS.NOT_STARTED) {
      getSectionAction();
    }
  }, [
    getClassSubjectAction,
    getClassSubjectStatus,
    getSectionAction,
    getSectionStatus,
  ]);

  useEffect(() => {
    return () => resetFilterStdStatus();
  }, [resetFilterStdStatus]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const getFilterStudent = (e) => {
    e.preventDefault();
    getFilterStudentsAction({ ...inputValue, sessionMasterId });
  };
  return (
    <Box>
      <PageHeader heading={"Student List"} />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box
          pt={2}
          className="scrollBar"
          h={"100%"}
          maxH={"100%"}
          overflowY={"scroll"}
        >
          <Flex justify={"space-between"}>
            <form style={{ width: "60%" }} onSubmit={getFilterStudent}>
              <Flex pb={3} gap={4}>
                <CustomSelect
                  size={"sm"}
                  name={"classMasterId"}
                  label={"Select Class"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(classes, (d, key) => ({
                    value: key,
                    name: d?.[0]?.class_master?.name,
                  }))}
                />
                <CustomSelect
                  size={"sm"}
                  name={"streamMasterId"}
                  label={"Select Stream"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(
                    uniqBy(
                      classes?.[inputValue?.classMasterId],
                      "streamMasterId"
                    ),
                    (d, index) => ({
                      value: d.stream_master.id,
                      name: d.stream_master.name,
                    })
                  )}
                />
                <CustomSelect
                  size={"sm"}
                  name={"sectionMasterId"}
                  label={"Select Section"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(allSections, (d) => ({
                    value: d.id,
                    name: d.name,
                  }))}
                />
                <Button type="submit" size={"sm"} colorScheme={themeColor}>
                  Get
                </Button>
              </Flex>
            </form>
          </Flex>
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
                      <Th>Class</Th>
                      <Th>Gender</Th>
                      <Th>Room - Bed</Th>
                      <Th>Address</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(filterStudents, (std) => (
                      <Tr>
                        <Td>{std.student_master.srNo}</Td>
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
                              src={std.student_master.photo}
                            />
                            {std.student_master.studentName}
                          </Flex>
                        </Td>
                        <Td>{std.student_master.fatherName}</Td>
                        <Td>{std.student_master.fatherContact}</Td>
                        <Td>
                          {std.class_master.name} - {std.stream_master.name}
                        </Td>
                        <Td>{std.student_master.gender}</Td>
                        <Td>101-A</Td>
                        <Td>{std.student_master.address}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Student Found"} />
            )}
          </LoadingContainer>
        </Box>
      </Box>
    </Box>
  );
};
