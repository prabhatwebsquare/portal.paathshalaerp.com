import { PageHeader } from "@/common/PageHeader";
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
import {
  filter,
  find,
  findIndex,
  groupBy,
  intersectionBy,
  map,
  uniqBy,
} from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { ExamDateTime } from "./ExamDateTime";
import { MdLocalPrintshop } from "react-icons/md";
import { PrintAdmitCard } from "./PrintAdmitCard";
import { useReactToPrint } from "react-to-print";
import { useClassSetupStore } from "@/store/classSetup";
import { useStudentStore } from "@/store/studentStore";
import { STATUS } from "@/constant";
import { PrintOneAdmitCard } from "./PrintOneAdmitCard";
import { LoadingContainer } from "@/common/LoadingContainer";
import { useExamStore } from "@/store/Exam";
import { CustomSelect } from "@/common/CustomSelect";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const AdmitCard = ({ themeColor, sessionMasterId }) => {
  const [inputValue, setInputValue] = useState({});
  const [toggleExamDrawer, setToggleExamDrawer] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState([]);

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

  const {
    getAssignExamAction,
    getAssignExamStatus,
    allAssignExams,
    getExamTimeTableAction,
    getExamTimeTableStatus,
    examTimeTable,
  } = useExamStore((s) => ({
    getAssignExamAction: s.getAssignExamAction,
    getAssignExamStatus: s.getAssignExamStatus,
    allAssignExams: s.allAssignExams,
    getExamTimeTableAction: s.getExamTimeTableAction,
    getExamTimeTableStatus: s.getExamTimeTableStatus,
    examTimeTable: s.examTimeTable,
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
    if (inputValue?.streamMasterId) {
      getAssignExamAction({
        classMasterId: inputValue.classMasterId,
        streamMasterId: inputValue.streamMasterId,
        sessionMasterId,
      });
    }
  }, [
    getAssignExamAction,
    inputValue.classMasterId,
    inputValue.streamMasterId,
    sessionMasterId,
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
    getExamTimeTableAction({ ...inputValue, sessionMasterId });
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

  const [allPrintProps, setAllPrintProps] = useState(null);
  const printAllRef = useRef(null);

  const handlePrintAllClick = () => {
    const temp = intersectionBy(filterStudents, selectedStudent, "id");
    setAllPrintProps(temp);
  };

  const handleAllPrint = useReactToPrint({
    content: () => printAllRef.current,
    documentTitle: "Admit_Cards",
    onAfterPrint: () => {
      setAllPrintProps(null);
    },
  });

  useEffect(() => {
    if (allPrintProps && allPrintProps.length > 0) {
      setTimeout(() => {
        handleAllPrint();
      }, 100);
    }
  }, [allPrintProps]);

  const [printProps, setPrintProps] = useState(null);
  const printRef = useRef(null);

  const handlePrintClick = (props) => {
    setPrintProps(props);
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
  }, [printProps, handlePrint]);

  return (
    <Box h={"100%"}>
      <PageHeader heading={"Admit Card"} />
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
                <CustomSelect
                  size={"sm"}
                  name={"examMasterId"}
                  label={"Select Exam"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(allAssignExams, (d) => ({
                    value: d?.exam_master?.id,
                    name: d?.exam_master?.name,
                  }))}
                />
                <Button type="submit" size={"sm"} colorScheme={themeColor}>
                  Get
                </Button>
              </Flex>
            </form>
            <Flex gap={3}>
              {HasPermission(PERMISSIONS.ADMIT_CARD_ADD) ? (
                <Button
                  px={4}
                  size={"sm"}
                  colorScheme={themeColor}
                  isDisabled={
                    getFilterStudentsStatus === STATUS.SUCCESS ? false : true
                  }
                  onClick={() => setToggleExamDrawer(inputValue)}
                >
                  Exam Date Time
                </Button>
              ) : null}
              <Button
                onClick={handlePrintAllClick}
                leftIcon={<MdLocalPrintshop />}
                colorScheme={themeColor}
                size={"sm"}
                isDisabled={selectedStudent.length === 0}
              >
                Print Admit Cards
              </Button>
            </Flex>
          </Flex>
          {(getFilterStudentsStatus || 1) === STATUS.NOT_STARTED ? (
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
                      {/* <Th>Action</Th> */}
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
                          {/* <Td>
                                                        <Tooltip placement="top" label={"Print Admit Card"}>
                                                            <IconButton
                                                                size="xs"
                                                                variant={"ghost"}
                                                                icon={<MdLocalPrintshop fontSize={18} />}
                                                                onClick={() => handlePrintClick(std)}
                                                            />
                                                        </Tooltip>
                                                    </Td> */}
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </LoadingContainer>
          )}
        </Box>

        {toggleExamDrawer && (
          <ExamDateTime
            exam={find(
              allAssignExams,
              (d) => d.examMasterId === parseInt(inputValue?.examMasterId)
            )}
            examTimeTable={examTimeTable}
            sessionMasterId={sessionMasterId}
            themeColor={themeColor}
            filterData={toggleExamDrawer}
            closeDrawer={() => setToggleExamDrawer(null)}
          />
        )}

        <Box display={"none"}>
          {printProps && (
            <Box ref={printRef}>
              <PrintOneAdmitCard
                exam={find(
                  allAssignExams,
                  (d) => d.examMasterId === parseInt(inputValue?.examMasterId)
                )}
                examTimeTable={examTimeTable}
                data={printProps}
                setPrintProps={setPrintProps}
              />
            </Box>
          )}
        </Box>
        <div style={{ display: "none" }}>
          {allPrintProps && (
            <Box ref={printAllRef}>
              <PrintAdmitCard
                exam={find(allAssignExams, { id: inputValue.examMasterId })}
                examTimeTable={examTimeTable}
                allData={allPrintProps}
                setAllPrintProps={setAllPrintProps}
              />
            </Box>
          )}
        </div>
      </Box>
    </Box>
  );
};
