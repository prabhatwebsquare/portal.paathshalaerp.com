import CustomArrayInput from "@/common/CustomArrayInput";
import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { STATUS } from "@/constant";
import { useExamStore } from "@/store/Exam";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  IconButton,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import {
  cloneDeep,
  concat,
  filter,
  find,
  includes,
  map,
  reject,
  sumBy,
  uniqBy,
} from "lodash";
import { useEffect, useMemo, useState } from "react";

export const AddNewExam = ({
  classes,
  inp,
  data,
  allClassSubjects,
  closeDrawer,
  sessionMasterId,
  themeColor,
}) => {
  const selectedClass = find(
    uniqBy(classes?.[inp?.classMasterId], "streamMasterId"),
    (c) => c.streamMasterId === parseInt(inp.streamMasterId)
  );

  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,
          type: data.exam_master.type,
          exam: data.exam_master.id,
          classMasterId: data.class_master.id,
          streamMasterId: data.stream_master.id,
        }
      : {}
  );

  const allSubjects = useMemo(() => {
    return find(
      allClassSubjects,
      (s) =>
        s.classMasterId === parseInt(inputValue?.classMasterId) &&
        s.streamMasterId === parseInt(inputValue?.streamMasterId)
    )?.assign_class_subjects;
  }, [allClassSubjects, inputValue?.classMasterId, inputValue?.streamMasterId]);

  const {
    getExamAction,
    getExamStatus,
    allExams,
    addAssignExamAction,
    addAssignExamStatus,
    resetAssignStatus,
    editAssignExamAction,
    editAssignExamStatus,
  } = useExamStore((s) => ({
    getExamAction: s.getExamAction,
    getExamStatus: s.getExamStatus,
    allExams: s.allExams,
    addAssignExamAction: s.addAssignExamAction,
    addAssignExamStatus: s.addAssignExamStatus,
    resetAssignStatus: s.resetAssignStatus,
    editAssignExamAction: s.editAssignExamAction,
    editAssignExamStatus: s.editAssignExamStatus,
  }));

  useEffect(() => {
    if (inputValue?.type) {
      getExamAction({ type: inputValue.type });
    }
  }, [getExamAction, inputValue?.type]);

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  const [subjectList, setSubjectList] = useState(
    data?.id
      ? map(data.assign_exam_marks, (s) => ({
          subjectMasterId: s.subjectMasterId,
          theoryMarks: s.theoryMarks || '',
          oralMarks: s.oralMarks || '',
          practicalMarks: s.practicalMarks || '',
          maxMarks: s.maxMarks || '',
        }))
      : []
  );

  // Auto-populate subjects when allSubjects changes
  useEffect(() => {
    if (allSubjects?.length > 0 && !data?.id) {
      const initialSubjects = allSubjects.map(subject => ({
        subjectMasterId: subject.subjectMasterId,
        theoryMarks: '',
        oralMarks: '',
        practicalMarks: '',
        maxMarks: ''
      }));
      setSubjectList(initialSubjects);
    }
  }, [allSubjects, data?.id]);

  const handle = () => {};
  
  const subjectHandler = (name, val, index) => {
    setSubjectList((prevState) => {
      const updatedArray = [...prevState];
      updatedArray[index] = {
        ...updatedArray[index],
        [name]: val,
      };
      return updatedArray;
    });
  };

  const deleteSubArray = (index) => {
    const newData = cloneDeep(subjectList);
    newData.splice(index, 1);
    setSubjectList(newData);
  };

  const unSelectedSubjects = useMemo(() => {
    return reject(allSubjects, (sub) =>
      includes(
        map(subjectList, (s) => s.subjectMasterId),
        sub.subjectMasterId
      )
    );
  }, [allSubjects, subjectList]);

  const assignExam = (e) => {
    e.preventDefault();
    if (data?.id) {
      editAssignExamAction({
        sessionMasterId,
        id: inputValue.id,
        classMasterId: inputValue.classMasterId,
        streamMasterId: inputValue.streamMasterId,
        examMasterId: inputValue.exam,
        data: map(subjectList, (sub) => ({
          ...sub,
          theoryMarks: inputValue.examType === "type" ? sub.maxMarks : sub.theoryMarks,
          maxMarks: inputValue.examType === "type" ? 
            parseInt(sub.theoryMarks || 0) +
            parseInt(sub.oralMarks || 0) +
            parseInt(sub.practicalMarks || 0) : 
            sub.maxMarks
        })),
      });
    } else {
      addAssignExamAction({
        sessionMasterId,
        classMasterId: inputValue.classMasterId,
        streamMasterId: inputValue.streamMasterId,
        examMasterId: inputValue.exam,
        data: map(subjectList, (sub) => ({
          ...sub,
          theoryMarks: inputValue.examType === "type" ? sub.maxMarks : sub.theoryMarks,
          maxMarks: inputValue.examType === "type" ? 
            parseInt(sub.theoryMarks || 0) +
            parseInt(sub.oralMarks || 0) +
            parseInt(sub.practicalMarks || 0) : 
            sub.maxMarks
        })),
      });
    }
  };

  useEffect(() => {
    if (
      addAssignExamStatus === STATUS.SUCCESS ||
      editAssignExamStatus === STATUS.SUCCESS
    ) {
      resetAssignStatus();
      closeDrawer();
    }
  }, [
    addAssignExamStatus,
    closeDrawer,
    editAssignExamStatus,
    resetAssignStatus,
  ]);

  return (
    <Drawer size={"xl"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={assignExam}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{data?.id ? "Edit Exam" : "Assign Marks"}</DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <Flex w={"100%"} flexWrap={"wrap"} gap={3}>
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
                  name={"type"}
                  label={"Select Type"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={[
                    { name: "Exam", value: "exam" },
                    { name: "Test", value: "test" },
                  ]}
                />
                <CustomSelect
                  w={"23%"}
                  size={"sm"}
                  name={"exam"}
                  label={`Select ${
                    inputValue?.type === "test" ? "Test" : "Exam"
                  }`}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(allExams, (exam, index) => ({
                    value: exam.id,
                    name: exam.name,
                  }))}
                />
              </Flex>
              {allSubjects?.length > 0 &&
              inputValue?.type &&
              inputValue?.exam &&
              inputValue?.classMasterId &&
              inputValue?.streamMasterId ? (
                <Box w={"100%"} mt={5}>
                  <Flex w={"100%"} justify={"space-between"}>
                    <Text>Mark Structure</Text>
                  </Flex>
                  <Table mt={3} w="100%" size={"sm"} variant={"simple"}>
                    <Thead>
                      <Tr bg="gray.100">
                        <Th width={"25%"}>Subject</Th>
                        {inputValue?.type !== "test" && (
                          <>
                            <Th>Theory</Th>
                            <Th>Oral</Th>
                            <Th>Practical</Th>
                          </>
                        )}
                        <Th>Max Marks</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {map(subjectList, (sub, index) => {
                        const subject = find(
                          allSubjects,
                          (s) => s.subjectMasterId === sub.subjectMasterId
                        );
                        const isPractical = subject?.practical === "1";
                        return (
                          <Tr key={index}>
                            <Td>
                              <Text>{subject?.subject_master?.name}</Text>
                            </Td>
                            {inputValue?.type !== "test" && (
                              <>
                                <Td>
                                  <CustomArrayInput
                                    size={"sm"}
                                    type={"number"}
                                    index={index}
                                    name="theoryMarks"
                                    label={"Theory"}
                                    inputValue={sub}
                                    setInputValue={setSubjectList}
                                  />
                                </Td>
                                <Td>
                                  <CustomArrayInput
                                    size={"sm"}
                                    notRequire={true}
                                    type={"number"}
                                    index={index}
                                    name="oralMarks"
                                    label={"Oral"}
                                    inputValue={sub}
                                    setInputValue={setSubjectList}
                                  />
                                </Td>
                                <Td>
                                  {isPractical ? (
                                    <CustomArrayInput
                                      size={"sm"}
                                      type={"number"}
                                      index={index}
                                      name="practicalMarks"
                                      label={"Practical"}
                                      inputValue={sub}
                                      setInputValue={setSubjectList}
                                    />
                                  ) : (
                                    <Text fontSize={18} textAlign={"center"}>
                                      -
                                    </Text>
                                  )}
                                </Td>
                              </>
                            )}
                            <Td>
                            {inputValue?.type === "test" ? (
  <CustomArrayInput
    size={"sm"}
    type={"number"}
    fontWeight={"bold"}
    index={index}
    name="maxMarks"
    label={"Max Marks"}
    inputValue={sub}
    setInputValue={setSubjectList}
  />
) : (
  <Text fontWeight={"bold"}>
    {parseInt(sub.theoryMarks || 0) +
      parseInt(sub.oralMarks || 0) +
      parseInt(sub.practicalMarks || 0)}
  </Text>
)}

                            </Td>
                            <Td>
                              <IconButton
                                size={"xs"}
                                variant={"ghost"}
                                colorScheme={"red"}
                                onClick={() => deleteSubArray(index)}
                                icon={<DeleteIcon />}
                              />
                            </Td>
                          </Tr>
                        );
                      })}
                      {subjectList?.length < allSubjects?.length && (
                        <Tr>
                          <Td colSpan={6} textAlign={"center"}>
                            <Button
                              variant={"ghost"}
                              colorScheme={themeColor}
                              leftIcon={<AddIcon />}
                              onClick={() =>
                                setSubjectList((pre) => [
                                  ...pre,
                                  {
                                    subjectMasterId: unSelectedSubjects[0]?.subjectMasterId,
                                    theoryMarks: '',
                                    oralMarks: '',
                                    practicalMarks: '',
                                    maxMarks: ''
                                  }
                                ])
                              }
                            >
                              Add More
                            </Button>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </Box>
              ) : null}
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              size={"sm"}
              variant="outline"
              mr={3}
              colorScheme={"red"}
              onClick={closeDrawer}
            >
              Cancel
            </Button>
            <Button
              size={"sm"}
              colorScheme={themeColor}
              type={"submit"}
              isDisabled={
                subjectList?.length && allSubjects?.length ? false : true
              }
              isLoading={
                addAssignExamStatus === STATUS.FETCHING ||
                editAssignExamStatus === STATUS.FETCHING
              }
            >
              {data?.id ? "Update" : "Submit"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
