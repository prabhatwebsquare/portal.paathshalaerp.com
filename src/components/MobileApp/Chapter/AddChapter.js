import React, { useState, useEffect, useMemo } from "react";
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
  IconButton,
  VStack,
  HStack,
  Box,
  FormControl,
  InputGroup,
  Input,
  FormLabel,
} from "@chakra-ui/react";
import { find, groupBy, map, uniqBy } from "lodash";
import { CustomSelect } from "@/common/CustomSelect";
import { useMobileAppStore } from "@/store/MobileApp";
import { useClassSetupStore } from "@/store/classSetup";
import { STATUS } from "@/constant";

import { Divider, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { useStaffStore } from "@/store/StaffStore";

export const AddChapter = ({
  sessionMasterId,
  themeColor,
  data,
  closeDrawer,
}) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          id: data.id,
          classMasterId: data.classMasterId,
          streamMasterId: data.streamMasterId,
          subjectMasterId: data.subjectMasterId,
          staffId: data.staffId,
        }
      : {}
  );

  const [chapter, setChapters] = useState(data?.chapter || [{ title: "" }]);

  const handleChapterChange = (index, value) => {
    const updatedChapters = [...chapter];
    updatedChapters[index].title = value;
    setChapters(updatedChapters);
  };

  const addNewChapter = () => {
    setChapters([...chapter, { title: "" }]);
  };

  useEffect(() => {
    setChapters([{ title: data.title }]);
    return () => {};
  }, [data.title]);

  const removeChapter = (index) => {
    const updatedChapters = chapter.filter((_, i) => i !== index);
    setChapters(updatedChapters);
  };
  const {
    addChapterAction,
    addChapterStatus,
    updateChapterAction,
    updateChapterStatus,
    resetChapterStatus,
  } = useMobileAppStore((s) => ({
    addChapterAction: s.addChapterAction,
    addChapterStatus: s.addChapterStatus,
    updateChapterAction: s.updateChapterAction,
    updateChapterStatus: s.updateChapterStatus,
    resetChapterStatus: s.resetChapterStatus,
  }));

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
  }, [getClassSubjectAction, getClassSubjectStatus]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);
  const addChapter = (e) => {
    e.preventDefault();
    const updateData = {
      ...inputValue,
      sessionMasterId,
      title: chapter[0].title,
    };
    const chapterData = { ...inputValue, chapter, sessionMasterId };
    if (data?.id) {
      updateChapterAction(updateData);
    } else {
      addChapterAction(chapterData);
    }
  };

  useEffect(() => {
    if (
      addChapterStatus === STATUS.SUCCESS ||
      updateChapterStatus === STATUS.SUCCESS
    ) {
      resetChapterStatus();
      closeDrawer();
    }
  }, [addChapterStatus, closeDrawer, resetChapterStatus, updateChapterStatus]);

  const { getStaffAction, getStaffStatus, allStaffs } = useStaffStore((s) => ({
    getStaffAction: s.getStaffAction,
    getStaffStatus: s.getStaffStatus,
    allStaffs: s.allStaffs,
  }));

  useEffect(() => {
    if ((getStaffStatus || 1) === STATUS.NOT_STARTED) {
      getStaffAction();
    }
  }, [getStaffAction, getStaffStatus]);
  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addChapter}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Chapter" : "Add Chapter"}
          </DrawerHeader>

          <DrawerBody>
            {/* Outer Card */}
            <Box
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={4}
              boxShadow="lg"
              bg={useColorModeValue(`${themeColor}.50`, `${themeColor}.900`)}
            >
              {/* Inner Card for Basic Details */}
              <Box
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
                p={4}
                boxShadow="md"
                mb={6}
                bg={useColorModeValue("white", "gray.800")}
              >
                <FormLabel fontSize="lg" fontWeight="bold" mb={4}>
                  Basic Details
                </FormLabel>
                <Divider mb={4} />
                <VStack spacing={3}>
                  <CustomSelect
                    size={"md"}
                    name={"classMasterId"}
                    label={"Select Class"}
                    notRequire={true}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    data={map(classes, (d, key) => ({
                      value: key,
                      name: d?.[0]?.class_master?.name,
                    }))}
                  />
                  <CustomSelect
                    size={"md"}
                    name={"streamMasterId"}
                    label={"Select Stream"}
                    notRequire={true}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    data={map(
                      uniqBy(
                        classes?.[inputValue?.classMasterId],
                        "streamMasterId"
                      ),
                      (d) => ({
                        value: d.stream_master?.id,
                        name: d.stream_master.name,
                      })
                    )}
                  />
                  <CustomSelect
                    size={"md"}
                    name={"subjectMasterId"}
                    label={"Select Subject"}
                    notRequire={true}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    data={map(
                      find(
                        allClassSubjects,
                        (s) =>
                          s.classMasterId == inputValue?.classMasterId &&
                          s.streamMasterId == inputValue?.streamMasterId
                      )?.assign_class_subjects,
                      (c) => ({
                        value: c.subjectMasterId,
                        name: c.subject_master?.name,
                      })
                    )}
                  />
                  <CustomSelect
                    size={"md"}
                    name={"staffId"}
                    label={"Select Staff"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    data={map(allStaffs, (staff) => ({
                      name: staff.name,
                      value: staff.id,
                    }))}
                  />
                </VStack>
              </Box>

              {/* Inner Card for Chapter Details */}
              <Box
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
                p={4}
                boxShadow="md"
                bg={useColorModeValue("white", "gray.800")}
              >
                <FormLabel fontSize="lg" fontWeight="bold" mb={4}>
                  Chapter Details
                </FormLabel>
                <Divider mb={4} />
                <VStack spacing={4}>
                  {chapter.map((chapter, index) => (
                    <HStack
                      key={`chapter_${index}`}
                      align="center"
                      spacing={3}
                      width={"100%"}
                    >
                      <FormControl isRequired>
                        <Input
                          placeholder={`${index + 1} Chapter Title`}
                          value={chapter.title}
                          onChange={(e) =>
                            handleChapterChange(index, e.target.value)
                          }
                          focusBorderColor={`${themeColor}.400`}
                        />
                      </FormControl>
                      {!data?.id && (
                        <Tooltip
                          label="Delete Chapter"
                          aria-label="Delete Tooltip"
                        >
                          <IconButton
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            size="sm"
                            onClick={() => removeChapter(index)}
                            aria-label={`Delete Chapter ${index + 1}`}
                          />
                        </Tooltip>
                      )}
                    </HStack>
                  ))}
                  {!data?.id && (
                    <Button
                      leftIcon={<AddIcon />}
                      colorScheme={themeColor}
                      variant="outline"
                      size="sm"
                      onClick={addNewChapter}
                    >
                      Add Another Chapter
                    </Button>
                  )}
                </VStack>
              </Box>
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button
              size="sm"
              variant="outline"
              mr={3}
              colorScheme="red"
              onClick={closeDrawer}
            >
              Cancel
            </Button>
            <Button size="sm" type="submit" colorScheme={themeColor}>
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
