import { CustomSelect } from "@/common/CustomSelect";
import { LoadingContainer } from "@/common/LoadingContainer";
import { MultiSelectDropdown } from "@/common/MultiSelectDropdown";
import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { useExamStore } from "@/store/Exam";
import { useClassSetupStore } from "@/store/classSetup";
import { useStudentStore } from "@/store/studentStore";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  Select,
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
import { find, findIndex, groupBy, intersectionBy, map, uniqBy } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { PrintRankReport } from "./PrintRankReport";
import { useReactToPrint } from "react-to-print";

export const RankReport = ({ themeColor, sessionMasterId }) => {
  const [inputValue, setInputValue] = useState({});
  const [selectedStudent, setSelectedStudent] = useState([]);

  const inputHandler = (name, val) => {
    if (name === "classMasterId") {
      setInputValue({
        [name]: val,
        streamMasterId: "",
        sectionMasterId: "",
        examMasterId: [],
      });
    } else {
      setInputValue((pre) => ({ ...pre, [name]: val }));
    }
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

  const { getAssignExamAction, getAssignExamStatus, allAssignExams } =
    useExamStore((s) => ({
      getAssignExamAction: s.getAssignExamAction,
      getAssignExamStatus: s.getAssignExamStatus,
      allAssignExams: s.allAssignExams,
    }));

  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
    if ((getSectionStatus || 1) === STATUS.NOT_STARTED) {
      getSectionAction();
    }
  }, [
    
    getClassSubjectStatus,
    getSectionStatus,
  ]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const examSubject = useMemo(() => {
    if (!inputValue?.examMasterId?.[0] || !allAssignExams) return null;
    return find(
      allAssignExams,
      (s) => s.examMasterId === parseInt(inputValue.examMasterId[0])
    )?.assign_exam_marks;
  }, [allAssignExams, inputValue?.examMasterId]);

  useEffect(() => {
    if (inputValue?.streamMasterId && inputValue?.classMasterId && sessionMasterId) {
      getAssignExamAction({
        sessionMasterId,
        classMasterId: inputValue.classMasterId,
        streamMasterId: inputValue.streamMasterId,
      });
    }
  }, [
    inputValue?.classMasterId,
    inputValue?.streamMasterId,
    sessionMasterId,
  ]);

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

  const [printProps, setPrintProps] = useState(null);
  const printRef = useRef(null);

  const handlePrintClick = () => {
    const temp = intersectionBy(filterStudents, selectedStudent, "id");
    setPrintProps(temp);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => setPrintProps(null),
    onPrintError: () => setPrintProps(null),
  });

  useEffect(() => {
    if (printProps) {
      handlePrint();
    }
  }, [printProps]);

  return (
    <Box h={"100%"}>
      <PageHeader heading={"Rank Report"} extra={<Button
        px={4}
        colorScheme={themeColor}
        isDisabled={selectedStudent?.length ? false : true}
        onClick={handlePrintClick}
      >
        Print
      </Button>} />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <form style={{ width: "90%" }} onSubmit={getFilterStudent}>
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
              <MultiSelectDropdown
                name={"sectionMasterId"}
                label={"Select Section"}
                value={inputValue?.sectionMasterId}
                selected={inputHandler}
                options={map(allSections || [], (d) => ({
                  value: d.id,
                  label: d.name,
                }))}
              />
              <MultiSelectDropdown
                name={"examMasterId"}
                label={"Select Exam"}
                value={inputValue?.examMasterId}
                selected={inputHandler}
                options={map(allAssignExams || [], (s) => ({
                  value: s?.exam_master?.id,
                  label: s?.exam_master?.name,
                }))}
              />
              <CustomSelect
                size={"sm"}
                name={"subjectMasterId"}
                label={"Select Subject"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(examSubject|| [], (d) => ({
                  value: d?.subject_master?.id,
                  name: d?.subject_master?.name,
                }))}
              />
              <Button type="submit" colorScheme={themeColor}>
                Get
              </Button>
            </Flex>
          </form>


          {getFilterStudentsStatus  === STATUS.NOT_STARTED ? (
            <Flex justify={"center"} mt={7}>
              <Text>Get Class Student First</Text>
            </Flex>
          ) : (
            <LoadingContainer status={getFilterStudentsStatus}>
              <TableContainer>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>
                        <Checkbox
                          colorScheme={themeColor}
                          isChecked={selectedStudent?.length === filterStudents?.length}
                          onChange={() => selectAllStd()}
                        />
                      </Th>
                      <Th>Sr No.</Th>
                      <Th>Roll No.</Th>
                      <Th>Name</Th>
                      <Th>Father Name</Th>
                      <Th>Total Marks</Th>
                      <Th>Obt. Marks</Th>
                      <Th>Rank</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(filterStudents, (std, index) => {
                      const isChecked = findIndex(selectedStudent, (s) => s.id === std.id) !== -1;
                      const totalMarks = examSubject?.find(s => s.subject_master?.id === parseInt(inputValue?.subjectMasterId))?.totalMarks || 0;
                      const obtainedMarks = std.marks?.find(m => m.subject_master?.id === parseInt(inputValue?.subjectMasterId))?.obtainedMarks || 0;
                      const rank = std.rank || '-';

                      return (
                        <Tr
                          key={std.id}
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
                          <Td>{index + 1}</Td>
                          <Td>{std.rollNo}</Td>
                          <Td>{std.student_master?.studentName}</Td>
                          <Td>{std.student_master?.fatherName}</Td>
                          <Td>{totalMarks}</Td>
                          <Td>{obtainedMarks}</Td>
                          <Td>{rank}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </LoadingContainer>
          )}
          <Box display={"none"}>
            {printProps && (
              <Box ref={printRef}>
                <PrintRankReport
                  data={printProps}
                  setPrintProps={setPrintProps}
                  allAssignExams={allAssignExams}
                  inputValue={inputValue}
                  examSubject={examSubject}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
