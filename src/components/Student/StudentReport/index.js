import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import { useStudentStore } from "@/store/studentStore";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Text,
  Tr,
  Button,
  Checkbox,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Tooltip,
} from "@chakra-ui/react";
import { find, findIndex, groupBy, map, uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { CustomSelect } from "@/common/CustomSelect";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { DownloadExcel } from "@/common/DownloadExcel";
import { RiFileExcel2Fill } from "react-icons/ri";
import dayjs from "dayjs";

export const StudentReport = ({ themeColor, sessionMasterId }) => {
  const [inputValue, setInputValue] = useState({});
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [toggleModal, setToggleModal] = useState(null);

  const inputHandler = (name, val) => {
    if (name == "subjectMasterId" && val[0] == "all") {
      setInputValue((pre) => ({ ...pre, [name]: "all" }));
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
    getsubjectWiseStudentAction,
    getSubjectWiseStatus,
    SubjectWise,
    resetSubjectWiseStatus,
  } = useStudentStore((s) => ({
    getsubjectWiseStudentAction: s.getsubjectWiseStudentAction,
    getSubjectWiseStatus: s.getSubjectWiseStatus,
    SubjectWise: s.SubjectWise,
    resetSubjectWiseStatus: s.resetSubjectWiseStatus,
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
    return () => resetSubjectWiseStatus();
  }, [resetSubjectWiseStatus]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const getFilterStudent = () => {
    if (
      !inputValue?.classMasterId ||
      !inputValue?.streamMasterId ||
      !inputValue?.sectionMasterId ||
      !inputValue?.subjectMasterId?.length
    ) {
      return; // Stop execution if any required value is missing
    }
    getsubjectWiseStudentAction({ ...inputValue, sessionMasterId });
  };

  // const selectAllStd = () => {
  //     if (selectedStudent?.length === SubjectWise?.length) {
  //         setSelectedStudent([])
  //     }
  //     else {
  //         setSelectedStudent(map(SubjectWise, s => ({ id: s.id })))
  //     }
  // }


  const [excelData, setExcelData] = useState(null);
  
useEffect(() => {
  if (SubjectWise) {  
    const data = SubjectWise.map((item) => {
      return {
        "Student Name": item.student_master?.studentName,
        "Father Name": item.student_master?.fatherName,
        "Father Contact": item.student_master?.fatherContact,
        Class: item.class_master?.name,
        Section: item.section_master?.name,
        Stream: item.stream_master?.name,
        "Admission No": item.student_master?.admissionNo,
        "Admission Date": dayjs(item.student_master?.admissionDate).format("DD-MM-YYYY"),
        "Date of Birth": dayjs(item.student_master?.dob).format("DD-MM-YYYY"),
        "Blood Group": item.student_master?.bloodGroup,
        "Handicap": item.student_master?.handicap,
        "Religion": item.student_master?.religion,
        "Category": item.student_master?.category,
        Subjects: item.student_subjects?.map((subj) => subj.subject_master?.name).join(", "),
      };
    });
    setExcelData(data);
  }
}, [SubjectWise]);
  return (
    <Box h={"100%"}>
      <PageHeader heading={"Student Subject Wise Report"} />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <Flex justify={"space-between"}>
            <Flex w={"80%"} pb={3} gap={4}>
              <CustomSelect
                w={"23%"}
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
                w={"23%"}
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
                w={"23%"}
                size={"sm"}
                name={"sectionMasterId"}
                label={"Select Section"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[
                  { value: "all", name: "All Section" },
                  ...map(allSections, (d) => ({ value: d.id, name: d.name })),
                ]}
              />
              <Menu w={"23%"} closeOnSelect={false}>
                <MenuButton w={"23%"} colorScheme="blue">
                  <Flex
                    px={3}
                    py={1}
                    border={"1px solid"}
                    borderColor={"gray.200"}
                    fontSize={13}
                    fontWeight={"bold"}
                    color={"blue.800"}
                    overflow={"hidden"}
                    whiteSpace={"nowrap"}
                    textOverflow={"ellipsis"}
                  >
                    {inputValue?.subjectMasterId?.length
                      ? inputValue?.subjectMasterId.includes("all")
                        ? "All Subjects"
                        : map(inputValue.subjectMasterId, (sub) => {
                            const subjectMasterId = find(
                              find(
                                allClassSubjects,
                                (s) =>
                                  s.classMasterId ===
                                    parseInt(inputValue?.classMasterId) &&
                                  s.streamMasterId ===
                                    parseInt(inputValue?.streamMasterId)
                              )?.assign_class_subjects,
                              (s) => s.subjectMasterId === sub
                            );
                            return subjectMasterId?.subject_master?.name || sub;
                          }).join(", ")
                      : "Select Subject"}
                  </Flex>
                </MenuButton>
                <MenuList minWidth="240px">
                  <MenuOptionGroup
                    title="Select Subject"
                    type="checkbox"
                    onChange={(e) => inputHandler("subjectMasterId", e)}
                  >
                    <MenuItemOption
                      isDisabled={
                        inputValue?.subjectMasterId !== "all" &&
                        inputValue?.subjectMasterId?.length
                      }
                      value="all"
                    >
                      All
                    </MenuItemOption>
                    {map(
                      find(
                        allClassSubjects,
                        (s) =>
                          s.classMasterId ===
                            parseInt(inputValue?.classMasterId) &&
                          s.streamMasterId ===
                            parseInt(inputValue?.streamMasterId)
                      )?.assign_class_subjects,
                      (c) => (
                        <MenuItemOption
                          isDisabled={
                            inputValue?.subjectMasterId == "all" ? true : false
                          }
                          value={c.subjectMasterId}
                        >
                          {c.subject_master?.name}
                        </MenuItemOption>
                      )
                    )}
                  </MenuOptionGroup>
                </MenuList>
              </Menu>

              <Button
                type="submit"
                size={"sm"}
                colorScheme={themeColor}
                onClick={getFilterStudent}
                isDisabled={
                  !inputValue?.classMasterId ||
                  !inputValue?.streamMasterId ||
                  !inputValue?.sectionMasterId ||
                  !inputValue?.subjectMasterId?.length
                }
              >
                Get
              </Button>
              <Tooltip label="Download Excel" placement="top">
                <DownloadExcel
                  button={<RiFileExcel2Fill />}
                  data={excelData}
                  name={"SubjectWise List"}
                  disabled={SubjectWise?.length > 0 ? false : true}
                />
              </Tooltip>
         
            </Flex>
          </Flex>
          {(getSubjectWiseStatus || 1) === STATUS.NOT_STARTED ||
          !SubjectWise ? (
            <Flex justify={"center"} mt={7}>
              <NoData />
            </Flex>
          ) : (
            <LoadingContainer status={getSubjectWiseStatus}>
              <Box
                p={4}
                bg="white"
                borderRadius="lg"
                boxShadow="md"
                borderWidth="1px"
                borderColor="gray.300"
              >
                <TableContainer>
                  <Table w="100%" size="md" variant="simple" colorScheme="blue">
                    <Thead>
                      <Tr>
                        <Th textAlign="center">Sr No.</Th>
                        <Th textAlign="center">Roll No.</Th>
                        <Th textAlign="center">Father Name</Th>
                        <Th textAlign="center">Father Contact</Th>
                        <Th textAlign="center">Name</Th>
                        <Th textAlign="center">Email</Th>
                        <Th textAlign="center">Subject Name</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {map(SubjectWise, (std, index) => (
                        <Tr key={index}>
                          <Td textAlign="center">{std.srNo}</Td>
                          <Td textAlign="center">{std.rollNo}</Td>
                          <Td textAlign="center">
                            {std.student_master.fatherName}
                          </Td>
                          <Td textAlign="center">
                            {std.student_master.fatherContact}
                          </Td>
                          <Td textAlign="center">
                            {std.student_master.studentName}
                          </Td>
                          <Td textAlign="center">
                            {std.student_master.studentEmail}
                          </Td>
                          <Td textAlign="center">
                            {std.student_subjects
                              .map((subject) => subject.subject_master.name)
                              .join(", ")}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </LoadingContainer>
          )}
          {/* {toggleModal && <PrintPreview data={toggleModal} themeColor={themeColor} closeModal={close} />} */}
        </Box>
      </Box>
    </Box>
  );
};
