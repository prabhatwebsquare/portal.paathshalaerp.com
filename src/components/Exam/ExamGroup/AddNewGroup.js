import CustomInput from "@/common/CustomInput";
import { MultiSelectDropdown } from "@/common/MultiSelectDropdown";
import { STATUS } from "@/constant";
import { useExamStore } from "@/store/Exam";
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
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  filter,
  findIndex,
  flatMap,
  includes,
  map,
  orderBy,
  reject,
} from "lodash";
import React, { useEffect, useMemo, useState } from "react";

export const AddExamGroup = ({
  allExams,
  allExamGroups,
  data,
  closeDrawer,
  themeColor,
}) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          data: map(data.exam_arrays, "examMasterId"),
          id: data.id,
        }
      : { data: [] }
  );

  const assignedExams = flatMap(
    filter(allExamGroups, (e) => e.id !== data?.id),
    (g) => map(g.exam_arrays, "examMasterId")
  );

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
    addExamGroupAction,
    addExamGroupStatus,
    updateExamGroupAction,
    updateExamGroupStatus,
    resetGroupStatus,
  } = useExamStore((s) => ({
    addExamGroupAction: s.addExamGroupAction,
    addExamGroupStatus: s.addExamGroupStatus,
    updateExamGroupAction: s.updateExamGroupAction,
    updateExamGroupStatus: s.updateExamGroupStatus,
    resetGroupStatus: s.resetGroupStatus,
  }));

  const addExam = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateExamGroupAction(inputValue);
    } else {
      addExamGroupAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addExamGroupStatus === STATUS.SUCCESS ||
      updateExamGroupStatus === STATUS.SUCCESS
    ) {
      resetGroupStatus();
      closeDrawer();
    }
  }, [
    addExamGroupStatus,
    closeDrawer,
    resetGroupStatus,
    updateExamGroupStatus,
  ]);

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
                label={"Group Name"}
                autofocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
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
                addExamGroupStatus === STATUS.FETCHING ||
                updateExamGroupStatus === STATUS.FETCHING
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
