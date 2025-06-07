import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { MultiSelectDropdown } from "@/common/MultiSelectDropdown";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import { useExamStore } from "@/store/Exam";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  filter,
  findIndex,
  flatMap,
  groupBy,
  includes,
  map,
  orderBy,
  reject,
  uniqBy,
} from "lodash";
import React, { useEffect, useMemo, useState } from "react";

export const PublishMarksheet = ({
  allExams,
  allExamGroups,
  data,
  closeDrawer,
  sessionMasterId,
}) => {

  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          data: map(data.marksheet_exam_arrays, "examMasterId"),
          id: data.id,
          isPublish: data.isPublish,
          classMasterId: data.classMasterId,
          streamMasterId: data.streamMasterId,
          sectionMasterId: data.sectionMasterId,
        }
      : { data: [], sessionMasterId }
  );

  const assignedExams = flatMap(
    filter(allExamGroups, (e) => e.id !== data?.id),
    (g) => map(g.exam_arrays, "examMasterId")
  );
  const themeColor = getLocalStorageItem("themeColor") || "blue";

  const unSelectedExam = useMemo(() => {
    return reject(allExams, (exam) => includes(assignedExams, exam.id));
  }, [allExams, assignedExams]);

  const inputHandler = (val, d) => {
    if (findIndex(inputValue.data, (eid) => eid === val) !== -1) {
      setInputValue((pre) => ({
        ...pre,
        data: filter(inputValue.data, (i) => i !== val),
      }));
    } else {
      setInputValue((pre) => ({ ...pre, data: [...inputValue.data, val] }));
    }
  };

  const {
    addpublishMarksheetGroupAction,
    publishMarksheetGroupStatus,
    updatepublishMarksheetGroupAction,
    updatepublishMarksheetGroupStatus,
    resetPublishMarksheetStatus,
  } = useExamStore((s) => ({
    addpublishMarksheetGroupAction: s.addpublishMarksheetGroupAction,
    publishMarksheetGroupStatus: s.publishMarksheetGroupStatus,
    updatepublishMarksheetGroupAction: s.updatepublishMarksheetGroupAction,
    updatepublishMarksheetGroupStatus: s.updatepublishMarksheetGroupStatus,
    resetPublishMarksheetStatus: s.resetPublishMarksheetStatus,
  }));

  const addExam = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (data?.id) {
      updatepublishMarksheetGroupAction(inputValue);
    } else {
      addpublishMarksheetGroupAction(inputValue);
      closeDrawer();
    }
  };

  useEffect(() => {
    if (
      publishMarksheetGroupStatus === STATUS.SUCCESS ||
      updatepublishMarksheetGroupStatus === STATUS.SUCCESS
    ) {
      resetPublishMarksheetStatus();
      closeDrawer();
    }
  }, [
    publishMarksheetGroupStatus,
    closeDrawer,
    resetPublishMarksheetStatus,
    updatepublishMarksheetGroupStatus,
  ]);
  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));
  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);
  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
  }, [getClassSubjectAction, getClassSubjectStatus]);
  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addExam}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Group" : "Add New Group"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"Name"}
                autofocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
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
              <Box
                w={"100%"}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                borderColor={`${themeColor}.200`}
                bg={`${themeColor}.50`}
              >
                <Text
                  fontWeight="bold"
                  fontSize="md"
                  mb={3}
                  color={`${themeColor}.700`}
                >
                  Publish Status
                </Text>
                <RadioGroup
                  value={inputValue.isPublish}
                  onChange={(val) =>
                    setInputValue((prev) => ({
                      ...prev,
                      isPublish: Number(val),
                    }))
                  }
                >
                  <Stack direction={{ base: "column", sm: "row" }} spacing={5}>
                    <Radio
                      value={1}
                      size="lg"
                      colorScheme={themeColor}
                      _hover={{ bg: `${themeColor}.100`, borderRadius: "md" }}
                    >
                      <Text fontSize="sm" fontWeight="semibold">
                        Publish
                      </Text>
                    </Radio>
                    <Radio
                      value={0}
                      size="lg"
                      colorScheme={themeColor}
                      _hover={{ bg: `${themeColor}.100`, borderRadius: "md" }}
                    >
                      <Text fontSize="sm" fontWeight="semibold">
                        Do Not Publish
                      </Text>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Box>

              <Box w={"100%"} p={1}>
                <Text fontWeight={"semibold"}>Select Exams</Text>
                {unSelectedExam?.length ? (
                  map(orderBy(unSelectedExam, "orderNo", "asc"), (exam) => {
                    const isChecked =
                      findIndex(inputValue.data, (eid) => eid === exam.id) !==
                      -1
                        ? true
                        : false;
                    return (
                      <Checkbox
                        colorScheme={themeColor}
                        _hover={{ bg: `${themeColor}.100`, borderRadius: "md" }}
                        w={"100%"}
                        isChecked={isChecked}
                        onChange={() => inputHandler(exam.id)}
                      >
                        {exam.name}
                      </Checkbox>
                    );
                  })
                ) : (
                  <Text mt={3} fontSize={12}>
                    No UnAssigned Exam Found
                  </Text>
                )}
              </Box>
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
              type={"submit"}
              isLoading={
                publishMarksheetGroupStatus === STATUS.FETCHING ||
                updatepublishMarksheetGroupStatus === STATUS.FETCHING
              }
              colorScheme={themeColor}
            >
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
