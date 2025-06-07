import { CustomSelect } from "@/common/CustomSelect";
import { DownloadExcel } from "@/common/DownloadExcel";
import { LoadingContainer } from "@/common/LoadingContainer";
import { MultiSelectDropdown } from "@/common/MultiSelectDropdown";
// import { MultiSelectDropdown } from "@/common/MultiSelectDropdown";
import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { STDFIELDS } from "@/constant/StdFields";
import { useClassSetupStore } from "@/store/classSetup";
import { useStudentStore } from "@/store/studentStore";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { compact, filter, findIndex, groupBy, map, uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";

export const CustomReport = ({ sessionMasterId, themeColor }) => {
  const [selectedField, setSelectedField] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [step, setStep] = useState(0);
  const [inputValue, setInputValue] = useState({
    applicationType: "all",
    classMasterId: "all",
    streamMasterId: "all",
  });

  const students = filter(
    STDFIELDS,
    (s) =>
      s.id !== "classMasterId" &&
      s.id !== "streamMasterId" &&
      s.id !== "sectionMasterId"
  );
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

  const { getCustomStudentAction, getCustomStudentStatus, customStudents } =
    useStudentStore((s) => ({
      getCustomStudentAction: s.getCustomStudentAction,
      getCustomStudentStatus: s.getCustomStudentStatus,
      customStudents: s.customStudents,
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

  const handleCheckAll = () => {
    if (selectedField?.length === students?.length) {
      setSelectedField([]);
    } else {
      setSelectedField(students);
    }
  };

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };
  const handleCheck = (data) => {
    if (findIndex(selectedField, (s) => s.id === data.id) !== -1) {
      setSelectedField(filter(selectedField, (s) => s.id !== data.id));
    } else {
      setSelectedField([...selectedField, data]);
    }
  };

  const getStudentData = () => {
    setStep(1);
    getCustomStudentAction({ sessionMasterId, ...inputValue });
  };

  const defaultFields = [
    { id: "classMasterId", name: "Class" },
    { id: "streamMasterId", name: "Stream" },
    { id: "sectionMasterId", name: "Section" },
  ];

  const finalFields = uniqBy([...defaultFields, ...selectedField], "id");
  useEffect(() => {
    if (customStudents?.length) {
      const formattedData = customStudents.map((student) => {
        const std = { ...student, ...student.student_master };

        const studentRow = {};

        finalFields.forEach((field) => {
          const { id, name } = field;

          switch (id) {
            case "admissionDate":
            case "dob":
              studentRow[name] = std[id]
                ? dayjs(std[id]).format("DD-MM-YYYY")
                : "N/A";
              break;

            case "classMasterId":
              studentRow[name] = std.class_master?.name || "N/A";
              break;

            case "streamMasterId":
              studentRow[name] = std.stream_master?.name || "N/A";
              break;

            case "sectionMasterId":
              studentRow[name] = std.section_master?.name || "N/A";
              break;

            case "selectedSubjects":
              studentRow[name] = std.student_subjects?.length
                ? std.student_subjects
                    .map((s) => s.subject_master?.name)
                    .filter(Boolean)
                    .join(", ")
                : "N/A";
              break;

            case "fees":
              studentRow[name] = std.student_fees?.length
                ? std.student_fees
                    .map((s) => s.fees_name_master?.name)
                    .filter(Boolean)
                    .join(", ")
                : "N/A";
              break;

            default:
              studentRow[name] = std[id] ?? "N/A";
              break;
          }
        });

        return studentRow;
      });

      setStudentData(formattedData);
    }
  }, [customStudents, selectedField]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  return (
    <Box h="100%">
      <PageHeader
        heading={"Custom Report"}
        extra={
          step === 1 ? (
            <DownloadExcel
              button={"Export Excel"}
              disabled={getCustomStudentStatus !== STATUS.SUCCESS}
              data={studentData}
              name={"Custom Report"}
            />
          ) : null
        }
      />
      {step === 0 ? (
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <form onSubmit={getStudentData}>
          
            <Flex pb={3} gap={4} mt={3} w={"90%"}>
              <CustomSelect
                size={"sm"}
                name={"classMasterId"}
                label={"Select Class"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[
                  { value: "all", name: "All Classes" },
                  ...map(classes || [], (d, key) => ({
                    value: key,
                    name: d?.[0]?.class_master?.name,
                  })),
                ]}
              />

              <CustomSelect
                size={"sm"}
                name={"streamMasterId"}
                label={"Select Stream"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[
                  { value: "all", name: "All Stream" },
                  ...map(
                    uniqBy(
                      classes?.[inputValue?.classMasterId],
                      "streamMasterId"
                    ),
                    (d, index) => ({
                      value: d.stream_master.id,
                      name: d.stream_master.name,
                    })
                  ),
                ]}
              />
              <CustomSelect
                size={"sm"}
                name={"applicationType"}
                label={"Select Admission Type"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[
                  { name: "All Admission", value: "all" },
                  { name: "New Admission", value: "new" },
                  { name: "Old Admission", value: "old" },
                ]}
              />

              <MultiSelectDropdown
                name={"sectionMasterId"}
                label={"Select Sections"}
                value={inputValue?.sectionMasterId}
                selected={inputHandler}
                options={map(allSections, (s) => ({
                  value: s?.id,
                  label: s?.name,
                }))}
              />
              <CustomSelect
                size={"sm"}
                name={"sortBy"}
                label={"Select Sort By"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={
                  map(selectedField, (field) => ({
                    name: field.name,
                    value: field.id,
                  })) || []
                }
              />
              <Button
              px={10}
                size={"sm"}
                mt={2}
                type="submit"
                isDisabled={selectedField?.length ? false : true}
                colorScheme={themeColor}
              >
                Next
              </Button>
            </Flex>
          </form>
          {inputValue?.classMasterId &&
            inputValue?.streamMasterId &&
            inputValue?.sectionMasterId && (
              <Flex mt={3} gap={3} flexWrap={"wrap"} p={2}>
                <Checkbox
                  size={"lg"}
                  isChecked={
                    students?.length === selectedField?.length ? true : false
                  }
                  w={"20%"}
                  color={"blue.600"}
                  fontWeight={"bold"}
                  bg="blue.50"
                  borderColor="blue.500"
                  boxShadow="inset 0 2px 4px rgba(0, 0, 0, 0.1)"
                  p={3}
                  borderRadius="md"
                  transition="all 0.2s"
                  onChange={handleCheckAll}
                >
                  <Text
                    fontSize="md"
                    letterSpacing="wide"
                    fontWeight="bold"
                    bgGradient="linear(to-r, blue.400, blue.600)"
                    bgClip="text"
                    _hover={{
                      bgGradient: "linear(to-r, blue.500, blue.700)",
                    }}
                  >
                    Select All
                  </Text>
                </Checkbox>
                {map(students, (field) => {
                  const checked =
                    findIndex(selectedField, (s) => s.id === field.id) !== -1
                      ? true
                      : false;
                  return (
                    <Checkbox
                      size={"md"}
                      isChecked={checked}
                      w={"20%"}
                      color={"gray.600"}
                      fontWeight={"semibold"}
                      onChange={() => handleCheck(field)}
                    >
                      {field.name}
                    </Checkbox>
                  );
                })}
              </Flex>
            )}
        </Box>
      ) : (
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getCustomStudentStatus}>
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    {map(finalFields, (field) => (
                      <Th key={field.id}>{field.name}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {map(customStudents, (student) => {
                    const std = { ...student, ...student.student_master };
                    return (
                      <Tr key={student.id}>
                        {map(finalFields, (field) => {
                          let value = "";

                          if (
                            field.id === "admissionDate" ||
                            field.id === "dob"
                          ) {
                            value = std[field.id]
                              ? dayjs(std[field.id]).format("DD-MM-YYYY")
                              : "N/A";
                          } else if (field.id === "classMasterId") {
                            value = std?.class_master?.name || "N/A";
                          } else if (field.id === "streamMasterId") {
                            value = std?.stream_master?.name || "N/A";
                          } else if (field.id === "sectionMasterId") {
                            value = std?.section_master?.name || "N/A";
                          } else if (field.id === "selectedSubjects") {
                            value = std?.student_subjects?.length
                              ? map(
                                  std.student_subjects,
                                  (s) => s.subject_master?.name
                                ).join(", ")
                              : "N/A";
                          } else if (field.id === "fees") {
                            value = std?.student_fees?.length
                              ? map(
                                  std.student_fees,
                                  (f) => f.fees_name_master?.name
                                ).join(", ")
                              : "N/A";
                          } else {
                            value = std[field.id] ?? "N/A";
                          }

                          return <Td key={field.id}>{value}</Td>;
                        })}
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
            <Flex mt={7} justify={"flex-end"}>
              <Button ml={4} size={"sm"} onClick={() => setStep(0)}>
                Back
              </Button>
              {/* <Button ml={4} size={"sm"} onClick={() => setStep(1)} colorScheme={themeColor}>Next</Button> */}
            </Flex>
          </LoadingContainer>
        </Box>
      )}
    </Box>
  );
};
