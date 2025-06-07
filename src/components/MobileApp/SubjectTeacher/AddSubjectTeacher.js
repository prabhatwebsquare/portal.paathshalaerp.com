import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import { useStaffStore } from "@/store/StaffStore";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import {
  cloneDeep,
  concat,
  find,
  groupBy,
  includes,
  map,
  reject,
  uniqBy,
} from "lodash";
import React, { useEffect, useMemo, useState } from "react";

export const AddSubjectTeacher = ({
  themeColor,
  data,
  closeDrawer,
  sessionMasterId,
}) => {
  const [inputValue, setInputValue] = useState(
    data?.length
      ? {
          staffId: data[0].staffId,
          id: data.id,
        }
      : {}
  );

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  const [subjectsArray, setSubjectsArray] = useState(
    data?.length
      ? map(data, (d) => ({
          classMasterId: d.classMasterId,
          streamMasterId: d.streamMasterId,
          subjectMasterId: d.subjectMasterId,
          sectionMasterId : d.sectionMasterId
        }))
      : [{}]
  );

  const {
    getStaffAction,
    getStaffStatus,
    allStaffs,
    addSubTeachAction,
    addSubTeachStatus,
    updateSubTeachAction,
    updateSubTeachStatus,
    resetSubTeachStatus,
  } = useStaffStore((s) => ({
    getStaffAction: s.getStaffAction,
    getStaffStatus: s.getStaffStatus,
    allStaffs: s.allStaffs,
    addSubTeachAction: s.addSubTeachAction,
    addSubTeachStatus: s.addSubTeachStatus,
    updateSubTeachAction: s.updateSubTeachAction,
    updateSubTeachStatus: s.updateSubTeachStatus,
    resetSubTeachStatus: s.resetSubTeachStatus,
  }));

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  const { getSectionAction, getSectionStatus, allSections } =
    useClassSetupStore((s) => ({
      getSectionAction: s.getSectionAction,
      getSectionStatus: s.getSectionStatus,
      allSections: s.allSections,
    }));

  useEffect(() => {
    if ((getStaffStatus || 1) === STATUS.NOT_STARTED) {
      getStaffAction();
    }
  }, [getStaffAction, getStaffStatus]);

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
    getSectionStatus,
    getSectionAction,
  ]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const subInput = (name, val, index) => {
    setSubjectsArray((prevState) => {
      const updatedArray = [...prevState];
      updatedArray[index] = {
        ...updatedArray[index],
        [name]: val,
      };
      return updatedArray;
    });
  };

  const deleteSubArray = (index) => {
    const newData = cloneDeep(subjectsArray);
    newData.splice(index, 1);
    setSubjectsArray(newData);
  };

  const unSelectedSubjects = (allSubjects) => {
    return reject(allSubjects, (sub) =>
      includes(
        map(subjectsArray, (s) => s.subjectMasterId),
        sub.id
      )
    );
  };

  const addSubTeach = (e) => {
    e.preventDefault();
    addSubTeachAction({
      ...inputValue,
      classData: subjectsArray,
      sessionMasterId,
    });
  };

  useEffect(() => {
    if (
      addSubTeachStatus === STATUS.SUCCESS ||
      updateSubTeachStatus === STATUS.SUCCESS
    ) {
      resetSubTeachStatus();
      closeDrawer();
    }
  }, [
    addSubTeachStatus,
    closeDrawer,
    resetSubTeachStatus,
    updateSubTeachStatus,
  ]);

  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addSubTeach}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.length ? "Edit Subject Teacher" : "Add Subject Teacher"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomSelect
                size={"sm"}
                name={"staffId"}
                label={"Select Staff"}
                notRequire={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(allStaffs, (d, key) => ({
                  value: d.id,
                  name: d?.name,
                }))}
              />
              <Table mt={3} w="100%" size={"sm"} variant={"simple"}>
                <Thead>
                  <Tr bg="gray.100">
                    <Th>Class</Th>
                    <Th>Stream</Th>
                    <Th>Section</Th>
                    <Th>Subject</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {map(subjectsArray, (sub, index) => {
                    const allSubjects = find(
                      allClassSubjects,
                      (s) =>
                        s.classMasterId === sub.classMasterId &&
                        s.streamMasterId === sub.streamMasterId
                    )?.assign_class_subjects;


                    // {map(
                    //   concat(
                    //     find(
                    //       allSubjects,
                    //       (s) => s?.id === sub?.subjectMasterId
                    //     ) || [],
                    //     unSelectedSubjects(allSubjects)
                    //   ),
                    
                    return (
                      <Tr key={index}>
                        <Td>
                          <Select
                            size={"sm"}
                            fontSize={13}
                            fontWeight={"bold"}
                            color={"blue.800"}
                            focusBorderColor={`${themeColor}.400`}
                            placeholder="Select Class"
                            value={sub?.classMasterId}
                            onChange={(e) =>
                              subInput(
                                "classMasterId",
                                parseInt(e.target.value),
                                index
                              )
                            }
                          >
                            {map(classes, (d, key) => (
                              <option value={d?.[0]?.class_master?.id}>
                                {d?.[0]?.class_master?.name}
                              </option>
                            ))}
                          </Select>
                        </Td>
                       
                        <Td>
                          <Select
                            size={"sm"}
                            fontSize={13}
                            fontWeight={"bold"}
                            color={"blue.800"}
                            focusBorderColor={`${themeColor}.400`}
                            placeholder="Select Stream"
                            value={sub?.streamMasterId}
                            onChange={(e) =>
                              subInput(
                                "streamMasterId",
                                parseInt(e.target.value),
                                index
                              )
                            }
                          >
                            {map(
                              uniqBy(
                                classes?.[sub?.classMasterId],
                                "streamMasterId"
                              ),
                              (d, index) => (
                                <option value={d.stream_master?.id}>
                                  {d.stream_master.name}
                                </option>
                              )
                            )}
                          </Select>
                        </Td>
                        <Td>
                        <Select
                            size={"sm"}
                            fontSize={13}
                            fontWeight={"bold"}
                            color={"blue.800"}
                            focusBorderColor={`${themeColor}.400`}
                            placeholder="Select Section"
                            value={sub?.sectionMasterId}
                            onChange={(e) =>
                              subInput(
                                "sectionMasterId",
                                parseInt(e.target.value),
                                index
                              )
                            }
                          >
                            {map(allSections, (d, key) => (
                              <option value={d.id}>
                                {d?.name}
                              </option>
                            ))}
                          </Select>
                          </Td>
                        <Td>
                          <Select
                            size={"sm"}
                            fontWeight={"semibold"}
                            focusBorderColor={`${themeColor}.400`}
                            placeholder="Select Subject"
                            value={sub?.subjectMasterId || ""}
                            onChange={(e) =>
                              subInput(
                                "subjectMasterId",
                                parseInt(e.target.value),
                                index
                              )
                            }
                          >
                            {map(
                              allSubjects,
                              (c) => (
                                <option
                                  key={c.subjectMasterId}
                                  value={c.subjectMasterId}
                                >
                                  {c.subject_master?.name}
                                </option>
                              )
                            )}
                          </Select>
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
                  <Tr>
                    <Td colSpan={5} textAlign={"center"}>
                      <Button
                        variant={"ghost"}
                        colorScheme={themeColor}
                        leftIcon={<AddIcon />}
                        onClick={() => setSubjectsArray((pre) => [...pre, {}])}
                      >
                        Add More
                      </Button>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
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
            {/* <Button size={"sm"} type={"submit"} isLoading={addStaffStatus === STATUS.FETCHING || updateStaffStatus === STATUS.FETCHING} colorScheme={themeColor}>{data?.id ? "Update" : "Add"}</Button> */}
            <Button size={"sm"} type={"submit"} colorScheme={themeColor}>
              {data?.length ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
