import CustomArrayInput from "@/common/CustomArrayInput";
import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useExamStore } from "@/store/Exam";
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
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { filter, find, map, some } from "lodash";
import { useEffect, useState } from "react";
import { BiError } from "react-icons/bi";

export const ExamDateTime = ({
  exam,
  examTimeTable,
  filterData,
  closeDrawer,
  sessionMasterId,
  themeColor,
}) => {
  const [showError, setShowError] = useState(false);
  const [inputValue, setInputValue] = useState(
    examTimeTable?.[0]?.id
      ? map(examTimeTable[0]?.exam_time_tables, (sub) => ({
          subjectMasterId: sub.subjectMasterId,
          subName: sub.subject_master.name,
          examDate: dayjs(sub.examDate).format("YYYY-MM-DD HH:mm"),
        }))
      : map(exam?.assign_exam_marks, (sub) => ({
          subjectMasterId: sub.subjectMasterId,
          subName: sub.subject_master.name,
        }))
  );

  const inputHandler = (name, val) => {};

  useEffect(() => {
    const newData = filter(inputValue, (i) => i.examDate);
    const data = find(newData, (obj) => {
      return some(
        newData,
        (other) => obj !== other && obj.examDate === other.examDate
      );
    });
    setShowError(data ? true : false);
  }, [inputValue]);

  const {
    addExamTimeTableAction,
    addExamTimeTableStatus,
    editExamTimeTableAction,
    editExamTimeTableStatus,
    getExamTimeTableStatus,
    resetExamTimeTableStatus,
  } = useExamStore((s) => ({
    addExamTimeTableAction: s.addExamTimeTableAction,
    addExamTimeTableStatus: s.addExamTimeTableStatus,
    editExamTimeTableAction: s.editExamTimeTableAction,
    editExamTimeTableStatus: s.editExamTimeTableStatus,
    getExamTimeTableStatus: s.getExamTimeTableStatus,
    resetExamTimeTableStatus: s.resetExamTimeTableStatus,
  }));

  const addExamTime = (e) => {
    e.preventDefault();
    const temp = {
      sessionMasterId,
      ...filterData,
      assignExamId: exam.id,
      data: inputValue,
    };
    if (examTimeTable?.[0]?.id) {
      editExamTimeTableAction({ ...temp, id: examTimeTable?.[0]?.id });
    } else {
      addExamTimeTableAction(temp);
    }
  };

  useEffect(() => {
    if (
      addExamTimeTableStatus === STATUS.SUCCESS ||
      editExamTimeTableStatus === STATUS.SUCCESS
    ) {
      resetExamTimeTableStatus();
      closeDrawer();
    }
  }, [
    addExamTimeTableStatus,
    closeDrawer,
    editExamTimeTableStatus,
    resetExamTimeTableStatus,
  ]);

  return (
    <Drawer
      size={"md"}
      isOpen={filterData}
      placement="right"
      onClose={closeDrawer}
    >
      <DrawerOverlay />
      <form onSubmit={addExamTime}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Exam Time Table</DrawerHeader>

          <DrawerBody>
            <Table mt={3} w="100%" size={"sm"} variant={"simple"}>
              <Thead>
                <Tr bg="gray.100">
                  <Th width={"35%"}>Subject</Th>
                  <Th>Sub Date Time</Th>
                </Tr>
              </Thead>
              <Tbody>
                {map(inputValue, (sub, index) => (
                  <Tr key={index}>
                    <Td>
                      <CustomArrayInput
                        size={"sm"}
                        type={"text"}
                        index={index}
                        name="subName"
                        label={"Subject"}
                        inputValue={sub}
                        setInputValue={inputHandler}
                      />
                    </Td>
                    <Td>
                      <CustomArrayInput
                        size={"sm"}
                        type={"datetime-local"}
                        index={index}
                        name="examDate"
                        label={"Date Time"}
                        inputValue={sub}
                        setInputValue={setInputValue}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {showError ? (
              <Flex
                mt={3}
                gap={2}
                fontSize={13}
                color={"red.600"}
                align={"center"}
              >
                <BiError fontSize={18} />
                <Text>Date & Time must not be same</Text>
              </Flex>
            ) : null}
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
              isDisabled={showError}
              isLoading={
                addExamTimeTableStatus === STATUS.FETCHING ||
                editExamTimeTableStatus === STATUS.FETCHING
              }
              type="submit"
            >
              {filterData?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
