import { PageHeader } from "@/common/PageHeader";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Select,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { find, groupBy, map, uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { DownloadExcel } from "@/common/DownloadExcel";
import { useClassSetupStore } from "@/store/classSetup";
import { useStudentStore } from "@/store/studentStore";
import { useExamStore } from "@/store/Exam";
import ExcelDataUpload from "./UploadExcelData";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { LoadingContainer } from "@/common/LoadingContainer";
import { CustomSelect } from "@/common/CustomSelect";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { HasPermission } from "@/common/HasPermission";

export const MarksEntry = ({ themeColor, sessionMasterId }) => {
  const [inputValue, setInputValue] = useState({});
  const [selectedFilter, setSelectedFilter] = useState({});
  const [studentData, setStudentData] = useState([]);
  const [isPractical, setIsPractical] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [newExcelData, setNewExcelData] = useState([]);

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
    getAssignExamAction,
    getAssignExamStatus,
    allAssignExams,
    getExamMarksAction,
    getExamMarksStatus,
    examMarks,
    addExamMarksAction,
    addExamMarksStatus,
    resetExamMarks,
  } = useExamStore((s) => ({
    getAssignExamAction: s.getAssignExamAction,
    getAssignExamStatus: s.getAssignExamStatus,
    allAssignExams: s.allAssignExams,
    getExamMarksAction: s.getExamMarksAction,
    getExamMarksStatus: s.getExamMarksStatus,
    examMarks: s.examMarks,
    addExamMarksAction: s.addExamMarksAction,
    addExamMarksStatus: s.addExamMarksStatus,
    resetExamMarks: s.resetExamMarks,
  }));

  useEffect(() => {
    if (newExcelData?.length) {
      setExcelData([
        newExcelData[0],
        ...newExcelData.slice(1).map((row) => {
          const baseRow = [
            row[0],
            row[1],
            row[2],
            row[3],
            typeof row[4] === "number" ? row[4] : 0,
            typeof row[5] === "number" ? row[5] : 0,
          ];

          if (isPractical) {
            return [...baseRow, typeof row[6] === "number" ? row[6] : 0];
          } else {
            return baseRow;
          }
        }),
      ]);
    }
  }, [newExcelData, isPractical]);

  const [marksArray, setMarksArray] = useState([]);

  useEffect(() => {
    setMarksArray(
      map(examMarks?.studentList, (std) => {
        const score = find(examMarks?.data, (d) => d.promotionId === std.id);
        const data = {
          rollNo: std.rollNo,
          theoryMarks: score?.theoryMarks || "",
          practicalMarks: score?.practicalMarks || "",
          oralMarks: score?.oralMarks || "",
          total: score?.total || "",
        };
        if (isPractical) {
          return { ...data, practicalMarks: score?.practicalMarks || "" };
        } else {
          return data;
        }
      })
    );
    setInputValue((pre) => ({
      ...pre,
      markLock: find(examMarks?.data, (d) => d.isLock === 1) ? true : false,
    }));
  }, [examMarks?.data, examMarks?.studentList, isPractical]);

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
    inputValue?.classMasterId,
    inputValue?.streamMasterId,
    sessionMasterId,
  ]);

  useEffect(() => {
    return () => resetExamMarks();
  }, [resetExamMarks]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const examSubject = useMemo(() => {
    return find(
      allAssignExams,
      (s) => s.examMasterId === parseInt(inputValue?.examMasterId)
    )?.assign_exam_marks;
  }, [allAssignExams, inputValue?.examMasterId]);

  const getFilterStudent = (e) => {
    e.preventDefault();
    setSelectedFilter(inputValue);
    setExcelData([]);
    setNewExcelData([]);
    getExamMarksAction({
      ...inputValue,
      sessionMasterId,
      assignExamId: find(
        allAssignExams,
        (s) => s.examMasterId === parseInt(inputValue?.examMasterId)
      )?.id,
    });
  };
  const selectedClassSub = useMemo(() => {
    const subject = find(
      allClassSubjects,
      (sub) =>
        sub.classMasterId === parseInt(selectedFilter.classMasterId) &&
        sub.streamMasterId === parseInt(selectedFilter?.streamMasterId)
    )?.assign_class_subjects;
    return find(
      subject,
      (s) => s.subjectMasterId === parseInt(selectedFilter?.subjectMasterId)
    );
  }, [allClassSubjects, selectedFilter]);

  const subject = useMemo(() => {
    return find(
      examSubject,
      (s) => s.subjectMasterId === parseInt(selectedFilter?.subjectMasterId)
    );
  }, [examSubject, selectedFilter?.subjectMasterId]);
  const nothing = () => {};
  const marksInput = (name, val, index) => {
    setMarksArray((prevState) => {
      const updatedArray = [...prevState];
      updatedArray[index] = {
        ...updatedArray[index],
        [name]: val > subject[name] ? 0 : val,
      };
      return updatedArray;
    });
  };

  useEffect(() => {
    if (examMarks?.studentList?.length) {
      const classSub = selectedClassSub;
      const data = examMarks.studentList.map((std) => {
        const score = find(examMarks?.data, (d) => d.promotionId === std.id);
        const studentData = {
          "Sr No.": std.student_master?.srNo,
          "Roll No.": std.rollNo || "-",
          Name: std.student_master?.studentName,
          "Father Name": std.student_master?.fatherName,
          [`Theory Marks (${subject?.theoryMarks})`]: score?.theoryMarks || "",
          [`Oral Marks (${subject?.oralMarks})`]: score?.oralMarks || "",
        };

        if (classSub?.practical === "1") {
          // Replace `condition` with your actual condition
          studentData[`Practical Marks (${subject.practicalMarks})`] =
            score?.practicalMarks || "";
        }

        return studentData;
      });
      setIsPractical(selectedClassSub?.practical === "1" ? true : false);
      setStudentData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allClassSubjects, examMarks, examSubject]);

  const saveUploaded = () => {
    const data = excelData.slice(1).map((row) => ({
      rollNo: row[1],
      theoryMarks: row[4],
      practicalMarks: row[6],
      oralMarks: row[5],
      total:
        parseInt(row[4] || 0) + parseInt(row[5] || 0) + parseInt(row[6] || 0),
      isLock: inputValue?.markLock,
    }));
    addExamMarksAction({
      data,
      ...selectedFilter,
      sessionMasterId,
      assignExamId: find(
        allAssignExams,
        (s) => s.examMasterId === parseInt(selectedFilter?.examMasterId)
      )?.id,
    });
  };

  const saveEditMarks = () => {
    addExamMarksAction({
      data: map(marksArray, (m) => ({
        ...m,
        isLock: inputValue?.markLock,
        total:
          (parseInt(m.theoryMarks) || 0) +
          (parseInt(m.practicalMarks) || 0) +
          (parseInt(m.oralMarks) || 0),
      })),
      ...selectedFilter,
      sessionMasterId,
      assignExamId: find(
        allAssignExams,
        (s) => s.examMasterId === parseInt(selectedFilter?.examMasterId)
      )?.id,
    });
  };

  useEffect(() => {
    if (addExamMarksStatus === STATUS.SUCCESS) {
      resetExamMarks();
      setExcelData([]);
      setNewExcelData([]);
      setStudentData([]);
      setInputValue((prev) => ({
        ...prev, // Spread previous state
        subjectMasterId: "", // Update subjectMasterId
      }));
    }
  }, [addExamMarksStatus, resetExamMarks]);

  return (
    <Box h={"100%"}>
      <PageHeader heading={"Marks Entry"} />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <Flex justify={"space-between"}>
            <form style={{ width: "70%" }} onSubmit={getFilterStudent}>
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
                <CustomSelect
                  size={"sm"}
                  name={"subjectMasterId"}
                  label={"Select Subject"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(examSubject, (d) => ({
                    value: d?.subject_master?.id,
                    name: d?.subject_master?.name,
                  }))}
                />
                <Button
                  type="submit"
                  size={"sm"}
                  isLoading={getExamMarksStatus === STATUS.FETCHING}
                  colorScheme={themeColor}
                >
                  Get
                </Button>
              </Flex>
            </form>
            <Flex gap={3}>
              <DownloadExcel
                disabled={getExamMarksStatus !== STATUS.SUCCESS}
                data={studentData}
                name={`${
                  find(
                    allClassSubjects,
                    (c) =>
                      c.classMasterId === parseInt(inputValue.classMasterId)
                  )?.class_master?.name
                } Class ${
                  find(
                    examSubject,
                    (c) =>
                      c.subjectMasterId === parseInt(inputValue.subjectMasterId)
                  )?.subject_master?.name
                } Marks`}
              />
              {HasPermission(PERMISSIONS.MARKS_ENTRY_ADD) && (
                <ExcelDataUpload
                  disabled={
                    getExamMarksStatus !== STATUS.SUCCESS ||
                    inputValue?.markLock
                  }
                  setExcelData={setNewExcelData}
                />
              )}
            </Flex>
          </Flex>
          <LoadingContainer status={getExamMarksStatus}>
            {excelData.length > 0 ? (
              <>
                <Table variant="simple" mt={4}>
                  <Thead>
                    <Tr>
                      {excelData[0]?.map((header, index) => (
                        <Th key={index}>{header}</Th>
                      ))}
                      <Th>Total Marks</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {excelData.slice(1).map((row, rowIndex) => (
                      <Tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <Td key={cellIndex}>{cell}</Td>
                        ))}
                        <Td>
                          {parseInt(row[4] || 0) +
                            parseInt(row[5] || 0) +
                            parseInt(row[6] || 0)}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Flex justify={"flex-end"}>
                  <Button
                    mt={5}
                    size={"sm"}
                    isDisabled={excelData.length > 0 ? false : true}
                    colorScheme={themeColor}
                    onClick={saveUploaded}
                  >
                    Save
                  </Button>
                </Flex>
              </>
            ) : examMarks?.studentList?.length ? (
              <>
                <Flex my={2} justify={"flex-end"} align={"center"}>
                  <Switch
                    textAlign={"center"}
                    isChecked={inputValue?.markLock}
                    onChange={(e) => inputHandler("markLock", e.target.checked)}
                  />
                  <Text ml={2} fontWeight={"semibold"}>
                    Marks Lock
                  </Text>
                </Flex>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Sr No.</Th>
                      <Th>Roll No.</Th>
                      <Th>Name</Th>
                      <Th>Father Name</Th>
                      <Th>{"Theory Marks (" + [subject?.theoryMarks] + ")"}</Th>
                      <Th>{"Oral Marks (" + [subject?.oralMarks] + ")"}</Th>
                      {isPractical ? (
                        <Th>
                          {"Practical Marks (" +
                            [subject?.practicalMarks] +
                            ")"}
                        </Th>
                      ) : null}
                      <Th>Total Marks</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {examMarks?.studentList?.map((std, index) => {
                      const score = find(
                        examMarks?.data,
                        (d) => d.promotionId === std.id
                      );
                      const mark = marksArray[index];
                      const total =
                        mark?.theoryMarks +
                        mark?.oralMarks +
                        mark?.practicalMarks;
                      return (
                        <Tr key={std.id}>
                          <Td>{std.student_master?.srNo}</Td>
                          <Td>{std.rollNo}</Td>
                          <Td>{std.student_master?.studentName}</Td>
                          <Td>{std.student_master?.fatherName}</Td>
                          <Td>
                            <FormControl>
                              <Input
                                bg={"gray.100"}
                                type="number"
                                size={"sm"}
                                fontWeight={"bold"}
                                color={"blue.600"}
                                isDisabled={inputValue?.markLock ? true : false}
                                focusBorderColor={`${themeColor}.400`}
                                placeholder="Marks"
                                value={mark?.theoryMarks || ""}
                                onChange={(e) =>
                                  marksInput(
                                    "theoryMarks",
                                    parseInt(e.target.value),
                                    index
                                  )
                                }
                              />
                            </FormControl>
                          </Td>
                          <Td>
                            <FormControl>
                              <Input
                                bg={"gray.100"}
                                type="number"
                                size={"sm"}
                                fontWeight={"bold"}
                                color={"blue.600"}
                                isDisabled={inputValue?.markLock ? true : false}
                                focusBorderColor={`${themeColor}.400`}
                                placeholder="Marks"
                                value={mark?.oralMarks || ""}
                                onChange={(e) =>
                                  marksInput(
                                    "oralMarks",
                                    parseInt(e.target.value),
                                    index
                                  )
                                }
                              />
                            </FormControl>
                          </Td>
                          {isPractical ? (
                            <Td>
                              <FormControl>
                                <Input
                                  bg={"gray.100"}
                                  type="number"
                                  size={"sm"}
                                  fontWeight={"bold"}
                                  color={"blue.600"}
                                  isDisabled={
                                    inputValue?.markLock ? true : false
                                  }
                                  focusBorderColor={`${themeColor}.400`}
                                  placeholder="Marks"
                                  value={mark?.practicalMarks || ""}
                                  onChange={(e) =>
                                    marksInput(
                                      "practicalMarks",
                                      parseInt(e.target.value),
                                      index
                                    )
                                  }
                                />
                              </FormControl>
                            </Td>
                          ) : null}
                          <Td>
                            <Flex w="100%" justify={"center"}>
                              <Text
                                w="fit-content"
                                color={"white"}
                                p={0.5}
                                px={2}
                                py={total?.toString().length > 1 ? 1 : 0.5}
                                borderRadius={"50%"}
                                bg="green.500"
                              >
                                {total || 0}
                              </Text>
                            </Flex>
                          </Td>
                          {/* <Td style={{ textAlign: "center", fontWeight: "bold", color: "blue" }}>{mark?.theoryMarks + mark?.oralMarks + mark?.practicalMarks}</Td> */}
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                {HasPermission(PERMISSIONS.MARKS_ENTRY_EDIT) && (
                  <Flex justify={"flex-end"}>
                    <Button
                      mt={5}
                      size={"sm"}
                      colorScheme={themeColor}
                      onClick={saveEditMarks}
                    >
                      Save
                    </Button>
                  </Flex>
                )}
              </>
            ) : (
              <NoData title={"Select Details First"} />
            )}
          </LoadingContainer>
        </Box>
      </Box>
    </Box>
  );
};
