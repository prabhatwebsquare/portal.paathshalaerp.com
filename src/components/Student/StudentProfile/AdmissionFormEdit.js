import CustomInput from "@/common/CustomInput";
import CustomTextarea from "@/common/CustomTextarea";
import { MultiSelectDropdown } from "@/common/MultiSelectDropdown";
import { UploadFile } from "@/common/UploadFile";
import { STATUS } from "@/constant";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { useClassSetupStore } from "@/store/classSetup";
import { useStudentStore } from "@/store/studentStore";
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
  Select,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import _, {
  filter,
  find,
  findIndex,
  groupBy,
  map,
  omit,
  omitBy,
  round,
  uniqBy,
} from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { StudentFees } from "./StudentFees";
import { useRouter } from "next/router";
import {
  ADMISSIONTYPE,
  BLOODGROUP,
  CATEGORY,
  OCCUPATIONTYPE,
  RELIGION,
} from "@/constant/AdmissionConstant";
import { CustomSelect } from "@/common/CustomSelect";
import SubjectSelectionModal from "../Admission/SubjectSelectionModal ";

export const AdmissionFormEdit = ({
  path,
  closeDrawer,
  data,
  themeColor,
  sessionMasterId,
}) => {
  const router = useRouter();

  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          ...data,
          ...data.student_master,
          admissionDate: data.student_master?.admissionDate
            ? dayjs(data.student_master.admissionDate).format("YYYY-MM-DD")
            : "",
          dob: data.student_master?.dob
            ? dayjs(data.student_master.dob).format("YYYY-MM-DD")
            : "",
        }
      : { admissionDate: dayjs().format("YYYY-MM-DD"), sessionMasterId }
  );

  useEffect(() => {
    if (inputValue?.prevMaxmarks && inputValue?.prevObtainmarks) {
      setInputValue((pre) => ({
        ...pre,
        prevPercentmarks: round(
          (inputValue?.prevObtainmarks / inputValue?.prevMaxmarks) * 100,
          2
        ),
      }));
    }
  }, [inputValue?.prevMaxmarks, inputValue?.prevObtainmarks]);

  const [stdPhoto, setStdPhoto] = useState(null);
  const steps = [
    { title: "First", description: "Basic Information" },
    { title: "Second", description: "Previous Details" },
  ];
  const [activeStep, setActiveStep] = useState(0);

  const handleNextStep = (e) => {
    e.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBackStep = (e) => {
    e.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const {
    editStudentAction,
    editStudentStatus,
    resetAdmissionStatus,
    getAllStudentAction,
  } = useStudentStore((s) => ({
    editStudentAction: s.editStudentAction,
    editStudentStatus: s.editStudentStatus,
    resetAdmissionStatus: s.resetAdmissionStatus,
    getAllStudentAction: s.getAllStudentAction,
  }));

  const { getHouseAction, getHouseStatus, allHouses } = useAdditionalSetupStore(
    (s) => ({
      getHouseAction: s.getHouseAction,
      getHouseStatus: s.getHouseStatus,
      allHouses: s.allHouses,
    })
  );

  useEffect(() => {
    if ((getHouseStatus || 1) === STATUS.NOT_STARTED) {
      getHouseAction();
    }
  }, [getHouseAction, getHouseStatus]);

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };
  const inputRef = useRef(null);

  const labelClick = () => {
    inputRef.current.click();
  };

  const selectedFile = (file) => {
    if (file?.length) {
      setInputValue((pre) => ({ ...pre, photo: file[0] }));
      setStdPhoto(file[0]);
    }
  };

  const docList = [
    { label: "Aadhar Card", name: "aadharCard" },
    { label: "10th Marksheet", name: "tenMarksheets" },
    { label: "12th Marksheet", name: "twelveMarksheets" },
    { label: "Address Proof", name: "addressProof" },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;
  const totalItems = docList.length;
  const itemWidthPercentage = 100 / itemsPerPage;

  const handleNext = () => {
    if (startIndex + itemsPerPage < docList?.length) {
      setStartIndex(startIndex + 4);
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 4);
    }
  };

  const save = (e) => {
    e.preventDefault();
    editStudentAction({
      ..._.omit(inputValue, [
        "id",
        "class_master",
        "section_master",
        "stream_master",
        "student_master",
        "studentMasterId",
        "uUserId",
        "updatedAt",
        "userId",
        "student_subjects",
      ]),
      promotionId: data.id,
      studentMasterId: data.student_master?.id,
    });
  };
  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
      getSectionAction: s.getSectionAction,
    }));
  useEffect(() => {
    if (editStudentStatus === STATUS.SUCCESS) {
      resetAdmissionStatus();
      setInputValue({
        admissionDate: dayjs().format("YYYY-MM-DD"),
        sessionMasterId,
      });
      getAllStudentAction({ page: 1, limit: 25, sessionMasterId });
      closeDrawer();
    }
  }, [
    closeDrawer,
    editStudentStatus,
    getAllStudentAction,
    resetAdmissionStatus,
    sessionMasterId,
  ]);
  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);
  const classSub = useMemo(() => {
    return filter(
      find(
        classes?.[inputValue?.classMasterId],
        (c) => c.streamMasterId === parseInt(inputValue?.streamMasterId)
      )?.assign_class_subjects,
      (s) => s.subjectType !== "Optional"
    );
  }, [classes, inputValue?.classMasterId, inputValue?.streamMasterId]);
  const subjects = useMemo(() => {
    return find(
      classes?.[inputValue?.classMasterId],
      (c) => c.streamMasterId === parseInt(inputValue?.streamMasterId)
    )?.assign_class_subjects;
  }, [classes, inputValue?.classMasterId, inputValue?.streamMasterId]);

  const { getSectionAction, getSectionStatus, allSections } =
    useClassSetupStore((s) => ({
      getSectionAction: s.getSectionAction,
      getSectionStatus: s.getSectionStatus,
      allSections: s.allSections,
    }));

  const { getShiftAction, getShiftStatus, allShifts } = useAdditionalSetupStore(
    (s) => ({
      getShiftAction: s.getShiftAction,
      getShiftStatus: s.getShiftStatus,
      allShifts: s.allShifts,
    })
  );
  useEffect(() => {
    if ((getShiftStatus || 1) === STATUS.NOT_STARTED) {
      getShiftAction();
    }
  }, [getShiftAction, getShiftStatus]);

  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
    if ((getSectionStatus || 1) === STATUS.NOT_STARTED) {
      getSectionAction();
    }
  }, [
    activeStep,
    getClassSubjectAction,
    getClassSubjectStatus,
    getSectionAction,
    getSectionStatus,
    sessionMasterId,
  ]);
  const optionalSubject = useMemo(() => {
    return filter(
      find(
        classes?.[inputValue?.classMasterId],
        (c) => c.streamMasterId === parseInt(inputValue?.streamMasterId)
      )?.assign_class_subjects,
      (s) => s.subjectType === "Optional"
    );
  }, [classes, inputValue?.classMasterId, inputValue?.streamMasterId]);
  const selectAllSubject = () => {
    if (inputValue.selectedSubject?.length === optionalSubject?.length) {
      setInputValue((pre) => ({ ...pre, selectedSubject: [] }));
    } else {
      setInputValue((pre) => ({
        ...pre,
        selectedSubject: map(optionalSubject, (s) => s.subject_master?.id),
      }));
    }
  };
  const checkHandler = (val) => {
    if (findIndex(inputValue.selectedSubject, (f) => f === val) !== -1) {
      setInputValue((pre) => ({
        ...pre,
        selectedSubject: filter(inputValue.selectedSubject, (f) => f !== val),
      }));
    } else {
      setInputValue((pre) => ({
        ...pre,
        selectedSubject: [...inputValue.selectedSubject, val],
      }));
    }
  };

  useEffect(() => {
    const compulsary_Subject = subjects
      ?.filter((data) => data.subjectType !== "Optional")
      .map((data) => {
        return data.subject_master.id;
      });
    setInputValue((prev) => ({
      ...prev,
      selectedSubject: data?.student_subjects.length > 0
        ? data?.student_subjects.map((s) => s.subject_master.id)
        : compulsary_Subject,
    }));
    return () => {};
  }, [data, subjects]);

  return (
    <Drawer size={"xl"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Edit Student Details</DrawerHeader>
        <DrawerBody>
          <Box>
            <Flex bg={"blue.100"} p={3} borderRadius={10}>
              <Stepper w="100%" index={activeStep} colorScheme={themeColor}>
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>

                    <Box flexShrink="0">
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </Box>

                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>
            </Flex>
            <Accordion mt={5} defaultIndex={[0, 1, 2, 3, 4]} allowMultiple>
              {activeStep === 0 ? (
                <form onSubmit={handleNextStep}>
                  <AccordionItem>
                    <h2>
                      <AccordionButton
                        bg={`${themeColor}.400`}
                        fontWeight={"semibold"}
                        color="white"
                        _hover={"none"}
                      >
                        <Box as="span" flex="1" textAlign="left">
                          Basic Details
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <VStack spacing={3} w="100%">
                        <Flex w={"100%"} align={"center"} gap={3}>
                          <Flex w={"32%"}>
                            <Flex pos={"relative"} ml={5}>
                              <Avatar
                                size={"xl"}
                                onClick={labelClick}
                                cursor={"pointer"}
                                src={
                                  stdPhoto ? URL.createObjectURL(stdPhoto) : ""
                                }
                                showBorder
                                borderColor={`${themeColor}.400`}
                              />
                              <Flex
                                pos={"absolute"}
                                onClick={labelClick}
                                cursor={"pointer"}
                                p={1}
                                bottom={1}
                                right={1}
                                borderRadius={"50%"}
                                bg={`${themeColor}.600`}
                                color={"white"}
                              >
                                <AddIcon boxSize={3} />
                              </Flex>
                            </Flex>
                            <Input
                              type="file"
                              ref={inputRef}
                              accept="image/*"
                              display={"none"}
                              onChange={(e) => selectedFile(e.target.files)}
                            />
                          </Flex>
                          <Box w={"32%"}>
                            <CustomInput
                              type={"text"}
                              name="srNo"
                              label={"Sr No."}
                              inputValue={inputValue}
                              setInputValue={setInputValue}
                            />
                            <Flex h={3} />
                            <CustomInput
                              type={"number"}
                              name="admissionNo"
                              label={"Admission No."}
                              notRequire={true}
                              inputValue={inputValue}
                              setInputValue={setInputValue}
                            />
                          </Box>
                          <Box w={"32%"}>
                            <CustomInput
                              type={"date"}
                              name="admissionDate"
                              label={"Admission Date"}
                              inputValue={inputValue}
                              setInputValue={setInputValue}
                            />
                            <Flex h={3} />
                            <CustomInput
                              type={"text"}
                              name="formNo"
                              label={"Form No."}
                              notRequire={true}
                              inputValue={inputValue}
                              setInputValue={setInputValue}
                            />
                          </Box>
                        </Flex>
                        <Flex flexWrap={"wrap"} align={"center"} gap={3}>
                          <CustomInput
                            type={"text"}
                            notRequire
                            w={"32%"}
                            name="apparId"
                            label={"Appar Id"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomInput
                            notRequire={true}
                            type={"text"}
                            w={"32%"}
                            name="penNo"
                            label={"Enter Pen No."}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomInput
                            w={"32%"}
                            type={"text"}
                            name="studentName"
                            label={"Student Name"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomInput
                            w={"32%"}
                            type={"date"}
                            name="dob"
                            label={"Date of Birth"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomInput
                            w={"32%"}
                            type={"number"}
                            limit={14}
                            name="aadharNo"
                            label={"Aadhar No."}
                            notRequire={true}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomSelect
                            w={"32%"}
                            name={"gender"}
                            label={"Select Gender"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            data={[
                              { name: "Male", value: "Male" },
                              { name: "Female", value: "Female" },
                              { name: "Other", value: "Other" },
                            ]}
                          />
                          <CustomSelect
                            w={"32%"}
                            name={"admissionSource"}
                            label={"Select Admission Source"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            data={map(ADMISSIONTYPE, (admiss) => ({
                              value: admiss.id,
                              name: admiss.label,
                            }))}
                          />
                          <CustomSelect
                            w={"32%"}
                            name={"houseMasterId"}
                            label={"Select House"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            data={map(allHouses, (house) => ({
                              value: house.id,
                              name: house.name,
                            }))}
                          />
                          <CustomSelect
                            w={"32%"}
                            name={"shiftId"}
                            label={"Select Shift"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            data={map(allShifts, (d, key) => ({
                              value: d?.id,
                              name: d?.name,
                            }))}
                          />
                          <CustomSelect
                            w={"32%"}
                            name={"religion"}
                            label={"Select Religion"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            data={map(RELIGION, (rele) => ({
                              value: rele.id,
                              name: rele.label,
                            }))}
                          />
                          <CustomSelect
                            w={"32%"}
                            name={"category"}
                            label={"Select Category"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            data={map(CATEGORY, (cat) => ({
                              value: cat.id,
                              name: cat.label,
                            }))}
                          />
                          <CustomSelect
                            w={"32%"}
                            name={"handicap"}
                            label={"Select Handicap"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            data={[
                              { name: "YES", value: "YES" },
                              { name: "NO", value: "NO" },
                            ]}
                          />
                          <CustomSelect
                            w={"32%"}
                            name={"applicationType"}
                            label={"Select Application Type"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            data={[
                              { name: "New Application", value: "New" },
                              { name: "Old Student", value: "Old" },
                            ]}
                          />
                          <CustomSelect
                            w={"32%"}
                            name={"bloodGroup"}
                            label={"Select Blood Group"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            data={map(BLOODGROUP, (blood) => ({
                              value: blood.id,
                              name: blood.label,
                            }))}
                          />
                          <CustomSelect
                            w={"32%"}
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
                            w={"32%"}
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
                            w={"32%"}
                            name={"sectionMasterId"}
                            label={"Select Section"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            data={map(allSections, (d, index) => ({
                              value: d.id,
                              name: d.name,
                            }))}
                          />
                        </Flex>
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem>
                    <h2>
                      <AccordionButton
                        bg={`${themeColor}.400`}
                        fontWeight={"semibold"}
                        color="white"
                        _hover={"none"}
                      >
                        <Box as="span" flex="1" textAlign="left">
                          Parent&apos;s Details
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <VStack spacing={3} w={"100%"}>
                        <Flex flexWrap={"wrap"} align={"center"} gap={3}>
                          <CustomInput
                            w={"32%"}
                            type={"text"}
                            name="fatherName"
                            label={"Father's Name"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomInput
                            w={"32%"}
                            type={"number"}
                            name="fatherContact"
                            label={"Father's Contact"}
                            inputValue={inputValue}
                            limit={10}
                            setInputValue={setInputValue}
                          />
                          <CustomInput
                            w={"32%"}
                            type={"email"}
                            notRequire={true}
                            name="studentEmail"
                            label={"Email"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomSelect
                            w={"32%"}
                            name={"occupation"}
                            label={"Select Father's Occupation"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            data={map(OCCUPATIONTYPE, (occup) => ({
                              value: occup.id,
                              name: occup.label,
                            }))}
                          />
                          <CustomInput
                            w={"32%"}
                            type={"number"}
                            name="income"
                            label={"Income"}
                            notRequire={true}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomInput
                            w={"32%"}
                            type={"text"}
                            name="motherName"
                            label={"Mother's Name"}
                            notRequire={true}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomInput
                            w={"32%"}
                            type={"number"}
                            name="motherContact"
                            label={"Mother's Contact"}
                            notRequire={true}
                            limit={10}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomTextarea
                            w={"100%"}
                            type={"text"}
                            name="address"
                            label={"Address"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                        </Flex>
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem>
                    <h2>
                      <AccordionButton
                        bg={`${themeColor}.400`}
                        fontWeight={"semibold"}
                        color="white"
                        _hover={"none"}
                      >
                        <Box as="span" flex="1" textAlign="left">
                          Guardian&apos;s Details
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <VStack spacing={3} w={"100%"}>
                        <Flex
                          w={"100%"}
                          flexWrap={"wrap"}
                          align={"center"}
                          gap={3}
                        >
                          <CustomInput
                            w={"32%"}
                            type={"text"}
                            notRequire={true}
                            name="guardianName"
                            label={"Guardian's Name"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomInput
                            w={"32%"}
                            type={"number"}
                            notRequire={true}
                            name="guardianContact"
                            label={"Guardian's Contact"}
                            limit={10}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomInput
                            w={"32%"}
                            type={"email"}
                            notRequire={true}
                            name="guardianEmail"
                            label={"Guardian's Email"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomTextarea
                            w={"100%"}
                            type={"text"}
                            notRequire={true}
                            name="correspondingAddress"
                            label={"Corresponding Address"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                        </Flex>
                        <SubjectSelectionModal
                          heading={"Update Student Subjects"}
                          subjects={subjects}
                          inputValue={inputValue}
                          selectAllSubject={selectAllSubject}
                          checkHandler={checkHandler}
                          classSub={classSub}
                        />
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                  <Flex my={4} justify={"flex-end"}>
                    <Button
                      ml={4}
                      size={"sm"}
                      colorScheme={`${themeColor}`}
                      type={"submit"}
                    >
                      {" "}
                      Next
                    </Button>
                  </Flex>
                </form>
              ) : activeStep === 1 ? (
                <form onSubmit={save}>
                  <AccordionItem>
                    <h2>
                      <AccordionButton
                        bg={`${themeColor}.400`}
                        fontWeight={"semibold"}
                        color="white"
                        _hover={"none"}
                      >
                        <Box as="span" flex="1" textAlign="left">
                          Previous School Information
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <VStack spacing={3} w={"100%"}>
                        <Flex flexWrap={"wrap"} align={"center"} gap={3}>
                          <CustomInput
                            w={"32%"}
                            type={"number"}
                            notRequire={true}
                            name="prevSrNo"
                            label={"SR / Enroll no"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomInput
                            w={"32%"}
                            type={"text"}
                            notRequire={true}
                            name="prevClass"
                            label={"Class"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomInput
                            w={"32%"}
                            type={"text"}
                            notRequire={true}
                            name="prevStream"
                            label={"Stream"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomInput
                            w={"32%"}
                            type={"text"}
                            notRequire={true}
                            name="prevSchool"
                            label={"School / Board"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomInput
                            w={"32%"}
                            type={"number"}
                            notRequire={true}
                            name="prevMaxmarks"
                            label={"Max Marks"}
                            limit={4}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomInput
                            w={"32%"}
                            type={"number"}
                            notRequire={true}
                            name="prevObtainmarks"
                            label={"Obtaines Marks"}
                            limit={4}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomInput
                            w={"32%"}
                            type={"text"}
                            notRequire={true}
                            name="prevPercentmarks"
                            label={"Percentage"}
                            inputValue={inputValue}
                            setInputValue={() => console.log()}
                          />
                          <CustomTextarea
                            w={"64%"}
                            type={"text"}
                            notRequire={true}
                            name="prevAddress"
                            label={"Address"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                        </Flex>
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                  {/* <AccordionItem>
                                            <h2>
                                                <AccordionButton bg={`${themeColor}.400`} fontWeight={"semibold"} color='white' _hover={"none"}>
                                                    <Box as="span" flex='1' textAlign='left'>
                                                        Upload Documents
                                                    </Box>
                                                    <AccordionIcon />
                                                </AccordionButton>
                                            </h2>
                                            <AccordionPanel pb={4}>
                                                <Flex w="100%" flexWrap={"wrap"} pos={"relative"}>
                                                    <Flex
                                                        w={`${totalItems * itemWidthPercentage}%`}
                                                    >
                                                        {docList.slice(startIndex, startIndex + itemsPerPage).map((obj, index) => (
                                                            <UploadFile key={index} data={obj} w="25%" inputValue={inputValue} setInputValue={setInputValue} />
                                                        ))}
                                                    </Flex>
                                                    <Flex top={"50%"} left={0} ml={-3} cursor={"pointer"} onClick={handlePrevious} _hover={{ bg: (startIndex === 0) ? "gray.100" : "gray.300" }} borderRadius={"50%"} pos={"absolute"} bg="gray.100" p={3} transition="background-color 0.3s">
                                                        <ArrowLeftIcon />
                                                    </Flex>
                                                    <Flex top={"50%"} right={0} mr={-3} cursor={"pointer"} onClick={handleNext} _hover={{ bg: (startIndex + itemsPerPage >= docList?.length) ? "gray.100" : "gray.300" }} borderRadius={"50%"} pos={"absolute"} bg="gray.100" p={3} transition="background-color 0.3s">
                                                        <ArrowRightIcon />
                                                    </Flex>
                                                </Flex>
                                            </AccordionPanel>
                                        </AccordionItem> */}
                  <Flex my={4} justify={"flex-end"}>
                    <Button size={"sm"} onClick={handleBackStep}>
                      Back
                    </Button>
                    <Button
                      ml={4}
                      size={"sm"}
                      type="submit"
                      colorScheme={themeColor}
                    >
                      Update
                    </Button>
                  </Flex>
                </form>
              ) : null}
            </Accordion>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
