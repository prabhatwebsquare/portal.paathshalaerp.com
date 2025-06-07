import { PageHeader } from "@/common/PageHeader";
import {
  Box,
  Button,
  Checkbox,
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
import {
  filter,
  findIndex,
  groupBy,
  intersectionBy,
  map,
  uniqBy,
} from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useClassSetupStore } from "@/store/classSetup";
import { useStudentStore } from "@/store/studentStore";
import { STATUS } from "@/constant";
import { LoadingContainer } from "@/common/LoadingContainer";
import { PrintIdCard } from "./PrintIdCard";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { CustomSelect } from "@/common/CustomSelect";

export const IdCard = ({ themeColor, sessionMasterId }) => {
  const [inputValue, setInputValue] = useState({});
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const school = getLocalStorageItem("user");

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

  const selectAllStd = () => {
    if (selectedStudent?.length === filterStudents?.length) {
      setSelectedStudent([]);
    } else {
      setSelectedStudent(map(filterStudents, (s) => ({ id: s.id })));
    }
  };

  const handleCheck = (id) => {
    if (findIndex(selectedStudent, (s) => s.id === id) !== -1) {
      setSelectedStudent(filter(selectedStudent, (s) => s.id !== id));
    } else {
      setSelectedStudent([...selectedStudent, { id }]);
    }
  };

  const handlePrintClick = () => {
    const selectedStudents = intersectionBy(filterStudents, selectedStudent, "id");
    setIsPrintModalOpen(true);
  };

  return (
    <Box>
      <PageHeader heading={"ID Card"} />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
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
            <Button
              px={4}
              size={"sm"}
              colorScheme={themeColor}
              isDisabled={selectedStudent?.length ? false : true}
              onClick={handlePrintClick}
            >
              Print
            </Button>
          </Flex>
          {(getFilterStudentsStatus || 1) === STATUS.NOT_STARTED ? (
            <Flex justify={"center"} mt={7}>
              <Text>Get Class Student First</Text>
            </Flex>
          ) : (
            <LoadingContainer status={getFilterStudentsStatus}>
              <TableContainer>
                {Array.isArray(filterStudents) && filterStudents.length > 0 && (
                  <Table w="100%" size={"sm"} variant={"simple"}>
                    <Thead>
                      <Tr bg="gray.100">
                        <Th>
                          <Checkbox
                            colorScheme={themeColor}
                            isChecked={
                              selectedStudent?.length === filterStudents?.length
                                ? true
                                : false
                            }
                            onChange={selectAllStd}
                          />
                        </Th>
                        <Th>Sr No.</Th>
                        <Th>Roll No.</Th>
                        <Th>Name</Th>
                        <Th>Father Name</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {map(filterStudents, (std, index) => {
                        const isChecked =
                          findIndex(selectedStudent, (s) => s.id === std.id) !==
                          -1
                            ? true
                            : false;
                        return (
                          <Tr
                            key={index}
                            _hover={{ bg: "gray.50" }}
                            cursor={"pointer"}
                          >
                            <Td>
                              <Checkbox
                                colorScheme={themeColor}
                                isChecked={isChecked}
                                onChange={() => handleCheck(std.id)}
                              />
                            </Td>
                            <Td>{std.srNo}</Td>
                            <Td>{std.rollNo}</Td>
                            <Td>{std.student_master.studentName}</Td>
                            <Td>{std.student_master.fatherName}</Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                )}
              </TableContainer>
            </LoadingContainer>
          )}
        </Box>
      </Box>
      {isPrintModalOpen && (
        <PrintIdCard
          allData={intersectionBy(filterStudents, selectedStudent, "id")}
          school={school?.schoolData}
          onClose={() => setIsPrintModalOpen(false)}
          isOpen={isPrintModalOpen}
        />
      )}
    </Box>
  );
};
