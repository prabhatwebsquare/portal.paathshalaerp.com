import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import { useMobileAppStore } from "@/store/MobileApp";
import { useStaffStore } from "@/store/StaffStore";
import { FiFileText, FiUpload } from "react-icons/fi";

import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Input,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { cloneDeep, find, groupBy, map, uniqBy } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MultiSelectDropdown } from "@/common/MultiSelectDropdown";
import MultiSelectSelector from "@/common/MultiSelectSelector";

export const AddHomework = ({
  themeColor,
  data,
  closeDrawer,
  sessionMasterId,
}) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,
          sessionMasterId: data.sessionMasterId,
          classMasterId: data.classMasterId,
          streamMasterId: data.streamMasterId,
          subjectMasterId: data.subjectMasterId,
          sectionMasterId: data.sectionMasterId,
          staffId: data.staffId,
          homeworkChapterId: data.homeworkChapterId,
          topic: data.topic,
          description: data.description,
          type: data.type,
          url: data.url,
          file: data.file,
          isPublish: data.isPublish,
        }
      : {
          sessionMasterId,
          sectionMasterId: [],
        }
  );

  const inputRef = useRef();
  const { getStaffAction, getStaffStatus, allStaffs } = useStaffStore((s) => ({
    getStaffAction: s.getStaffAction,
    getStaffStatus: s.getStaffStatus,
    allStaffs: s.allStaffs,
  }));

  useEffect(() => {
    if ((getStaffStatus || 1) === STATUS.NOT_STARTED) {
      getStaffAction();
    }
  }, [getStaffStatus]);
  const {
    addHomeWorkAction,
    addHomeWorkStatus,
    updateHomeWorkAction,
    updateHomeWorktatus,
    resetHomeWorkStatus,
  } = useMobileAppStore((s) => ({
    addHomeWorkAction: s.addHomeWorkAction,
    addHomeWorkStatus: s.addHomeWorkStatus,
    updateHomeWorkAction: s.updateHomeWorkAction,
    updateHomeWorktatus: s.updateHomeWorktatus,
    resetHomeWorkStatus: s.resetHomeWorkStatus,
  }));

  const addStaff = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateHomeWorkAction(inputValue);
    } else {
      addHomeWorkAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addHomeWorkStatus === STATUS.SUCCESS ||
      updateHomeWorktatus === STATUS.SUCCESS
    ) {
      resetHomeWorkStatus();
      closeDrawer();
    }
  }, [
    addHomeWorkStatus,
    closeDrawer,
    resetHomeWorkStatus,
    updateHomeWorktatus,
  ]);

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

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const { getChapterAction, getChapterStatus, allChapters } = useMobileAppStore(
    (s) => ({
      getChapterAction: s.getChapterAction,
      getChapterStatus: s.getChapterStatus,
      allChapters: s.allChapters,
    })
  );
  useEffect(() => {
    if (
      inputValue.classMasterId &&
      inputValue.streamMasterId &&
      inputValue.subjectMasterId
    ) {
      getChapterAction({
        sessionMasterId,
        classMasterId: inputValue.classMasterId,
        streamMasterId: inputValue.streamMasterId,
        subjectMasterId: inputValue.subjectMasterId,
      });
    }
  }, [
    inputValue.classMasterId,
    inputValue.streamMasterId,
    inputValue.subjectMasterId,
    sessionMasterId,
  ]);

  const [stdPhoto, setStdPhoto] = useState(null);
  const selectedFile = (file) => {
    setInputValue((prev) => ({ ...prev, file: file }));
    setStdPhoto(file);
  };
  useEffect(() => {
    if (!inputValue.classMasterId || !inputValue.sectionMasterId) {
      setInputValue((prev) => ({
        ...prev,
        streamMasterId: null,
      }));
    }
  }, [inputValue.classMasterId, inputValue.sectionMasterId]);

  return (
    <Drawer
      size={"lg"}
      isOpen={data}
      placement="right"
      onClose={closeDrawer}
      closeOnOverlayClick={false}
    >
      <DrawerOverlay />
      <form onSubmit={addStaff}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Homework" : "Add Homework"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <Box
                width={"100%"}
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
                p={4}
                boxShadow="md"
                mb={6}
                bg={useColorModeValue("white", "gray.800")}
              >
                <Divider mb={4} />
                <VStack spacing={3}>
                  <CustomSelect
                    size={"md"}
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
                    size={"md"}
                    name={"streamMasterId"}
                    label={"Select Stream"}
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
                  <MultiSelectSelector
                    label="Select Section"
                    name="sectionMasterId"
                    options={allSections.map((d) => ({
                      value: d.id,
                      name: d.name,
                    }))}
                    selectedValues={inputValue.sectionMasterId}
                    setSelectedValues={(selectedSections) => {
                      if (selectedSections?.includes("all")) {
                        setInputValue((prev) => ({
                          ...prev,
                          sectionMasterId: "all",
                          streamMasterId: prev.classMasterId
                          ? prev.streamMasterId
                          : null,
                        }));
                      } else {
                        setInputValue((prev) => ({
                          ...prev,
                          sectionMasterId: selectedSections,
                          streamMasterId: prev.classMasterId
                            ? prev.streamMasterId
                            : null,
                        }));
                      }
                    }}
                  />

                  <CustomSelect
                    size={"md"}
                    name={"subjectMasterId"}
                    label={"Select Subject"}
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
                    name={"homeworkChapterId"}
                    label={"Select Chapter"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    data={map(allChapters, (chapter, key) => ({
                      value: chapter.id,
                      name: chapter.title,
                    }))}
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

                  <CustomSelect
                    size={"md"}
                    name={"type"}
                    label={"Select Homework Type"}
                    notRequire={true}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    data={[
                      { name: "File", value: "File" },
                      { name: "Youtube URL", value: "url" },
                    ]}
                  />
                  {inputValue?.type === "url" ? (
                    <CustomInput
                      type={"url"}
                      name="url"
                      label={"Youtube URl"}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                    />
                  ) : inputValue?.type === "File" ? (
                    <>
                      <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        w="100%"
                        onClick={() => inputRef.current?.click()}
                        p={4}
                      >
                        {/* Display PDF Info or Placeholder */}
                        {stdPhoto || inputValue?.file ? (
                          <Box
                            p={4}
                            bg={`${themeColor}.50`}
                            borderRadius="md"
                            border="1px solid"
                            borderColor={`${themeColor}.300`}
                            textAlign="center"
                            w="100%"
                          >
                            <Icon
                              as={FiFileText}
                              boxSize={12}
                              color={themeColor}
                              mb={3}
                            />
                            <Text
                              fontSize="lg"
                              fontWeight="bold"
                              color={`${themeColor}.600`}
                            >
                              {stdPhoto ? stdPhoto.name : inputValue?.file}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              PDF file uploaded successfully
                            </Text>
                          </Box>
                        ) : (
                          <Box
                            p={6}
                            bg="gray.50"
                            borderRadius="md"
                            border="2px dashed"
                            borderColor="gray.300"
                            textAlign="center"
                            _hover={{
                              bg: "gray.100",
                              borderColor: `${themeColor}.400`,
                            }}
                            w="100%" // Ensures the Box takes full width
                          >
                            <Icon
                              as={FiUpload}
                              boxSize={10}
                              color={themeColor}
                              mb={4}
                            />
                            <Text
                              fontSize="lg"
                              fontWeight="medium"
                              color="gray.600"
                            >
                              Click to Upload PDF
                            </Text>
                            <Text fontSize="sm" color="gray.400">
                              Only PDF files are accepted
                            </Text>
                          </Box>
                        )}

                        {/* Hidden File Input */}
                        <Input
                          ref={inputRef}
                          id="pdf-upload"
                          type="file"
                          display="none"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              selectedFile(file);
                            }
                          }}
                        />
                      </Flex>
                    </>
                  ) : null}
                  <CustomInput
                    type={"text"}
                    name="topic"
                    label={"Topic"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                  <CustomTextarea
                    type={"text"}
                    rows={5}
                    name="description"
                    label={"Description"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                  <CustomSelect
                    size={"md"}
                    name={"isPublish"}
                    label={"Select Publish Type"}
                    notRequire={true}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    data={[
                      { name: "Publish", value: 1 },
                      { name: "Not now", value: 0 },
                    ]}
                  />
                </VStack>
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
            {/* <Button size={"sm"} type={"submit"} isLoading={addHomeWorkStatus === STATUS.FETCHING || updateHomeWorktatus === STATUS.FETCHING} colorScheme={themeColor}>{data?.id ? "Update" : "Add"}</Button> */}
            <Button size={"sm"} type={"submit"} colorScheme={themeColor}>
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
