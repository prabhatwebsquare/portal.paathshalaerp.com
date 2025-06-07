import { PageHeader } from "@/common/PageHeader";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { groupBy, map, uniqBy } from "lodash";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useEffect, useMemo, useState } from "react";
import { AddNewExam } from "./AddNewExam";
import { DeleteButton } from "@/common/DeleteButton";
import { useClassSetupStore } from "@/store/classSetup";
import { STATUS } from "@/constant";
import { useExamStore } from "@/store/Exam";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { CustomSelect } from "@/common/CustomSelect";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const AssignExam = ({ sessionMasterId, themeColor }) => {
  const [inputValue, setInputValue] = useState({});
  const [toggleExamDrawer, setToggleExamDrawer] = useState(null);

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

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
    deleteAssignExamAction,
    deleteAssignExamStatus,
    resetAssignStatus,
  } = useExamStore((s) => ({
    getAssignExamAction: s.getAssignExamAction,
    getAssignExamStatus: s.getAssignExamStatus,
    allAssignExams: s.allAssignExams,
    deleteAssignExamAction: s.deleteAssignExamAction,
    deleteAssignExamStatus: s.deleteAssignExamStatus,
    resetAssignStatus: s.resetAssignStatus,
  }));

  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
  }, [getClassSubjectAction, getClassSubjectStatus]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const getExamDetails = (e) => {
    e.preventDefault();
    getAssignExamAction({ ...inputValue, sessionMasterId });
  };

  const deleteExam = (id) => {
    deleteAssignExamAction(id);
  };
  return (
    <Box h={"100%"}>
      <PageHeader
        heading={"Assign Marks"}
        extra={
          HasPermission(PERMISSIONS.ASSIGN_EXAM_ADD) && (
            <Button
              px={4}
              size={"sm"}
              colorScheme={themeColor}
              onClick={() => setToggleExamDrawer({})}
            >
              Assign Marks
            </Button>
          )
        }
      />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <Flex justify={"space-between"}>
            <form style={{ width: "40%" }} onSubmit={getExamDetails}>
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
                <Button type="submit" size={"sm"} colorScheme={themeColor}>
                  Get
                </Button>
              </Flex>
            </form>
          </Flex>
          <LoadingContainer status={getAssignExamStatus}>
            {allAssignExams?.length ? (
              <TableContainer>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>S. No.</Th>
                      <Th>Class</Th>
                      <Th>Stream</Th>
                      <Th>Exam Name</Th>
                      <Th>Mark Structure</Th>
                      {HasPermission(PERMISSIONS.ASSIGN_EXAM_EDIT) ||
                      HasPermission(PERMISSIONS.ASSIGN_EXAM_DELETE) ? (
                        <Th>Action</Th>
                      ) : null}
                      <Th>App Show Marks</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(allAssignExams, (exam, index) => (
                      <Tr
                        key={index}
                        _hover={{ bg: "gray.50" }}
                        cursor={"pointer"}
                      >
                        <Td>{index + 1}</Td>
                        <Td>{exam?.class_master?.name}</Td>
                        <Td>{exam?.stream_master?.name}</Td>
                        <Td>{exam?.exam_master?.name}</Td>
                        <Td>
                          <Popover
                            w={"auto"}
                            size={"xl"}
                            trigger={"hover"}
                            placement={"right"}
                          >
                            <PopoverTrigger>
                              <Button
                                size={"xs"}
                                variant={"ghost"}
                                colorScheme={themeColor}
                              >
                                Mark Structure
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent width={"auto"}>
                              <PopoverArrow />
                              <PopoverHeader>Marks Structure</PopoverHeader>
                              <PopoverBody>
                                <Box>
                                  <table>
                                    <thead>
                                      <tr>
                                        <th>Subject</th>
                                        <th>Theory</th>
                                        <th>Oral</th>
                                        <th>Practical</th>
                                        <th>Max Marks</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {map(exam?.assign_exam_marks, (marks) => (
                                        <tr>
                                          <td>{marks.subject_master.name}</td>
                                          <td>{marks.theoryMarks}</td>
                                          <td>{marks.oralMarks}</td>
                                          <td>{marks.practicalMarks}</td>
                                          <td style={{ fontWeight: "bold" }}>
                                            {marks.maxMarks}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </Box>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </Td>
                        {HasPermission(PERMISSIONS.ASSIGN_EXAM_EDIT) ||
                        HasPermission(PERMISSIONS.ASSIGN_EXAM_DELETE) ? (
                          <Td>
                            {HasPermission(PERMISSIONS.ASSIGN_EXAM_EDIT) && (
                              <Tooltip placement="top" label="Edit">
                                <IconButton
                                  size={"sm"}
                                  variant={"ghost"}
                                  icon={<EditIcon />}
                                  onClick={() => setToggleExamDrawer(exam)}
                                  colorScheme={"blue"}
                                />
                              </Tooltip>
                            )}
                            {HasPermission(PERMISSIONS.ASSIGN_EXAM_DELETE) && (
                              <DeleteButton
                                description={
                                  "Are you sure? Do you want to delete?"
                                }
                                confirm={() => deleteExam(exam.id)}
                                status={deleteAssignExamStatus}
                                reset={resetAssignStatus}
                              />
                            )}
                          </Td>
                        ) : null}
                        <Td>
                          <Switch variant="raised" colorScheme={themeColor} />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Assign Marks Found"} />
            )}
          </LoadingContainer>
          {toggleExamDrawer && (
            <AddNewExam
              classes={classes}
              inp={inputValue}
              data={toggleExamDrawer}
              allClassSubjects={allClassSubjects}
              closeDrawer={() => setToggleExamDrawer(null)}
              sessionMasterId={sessionMasterId}
              themeColor={themeColor}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
