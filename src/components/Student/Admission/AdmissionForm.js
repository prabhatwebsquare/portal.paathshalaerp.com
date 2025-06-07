import CustomInput from "@/common/CustomInput";
import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { useClassSetupStore } from "@/store/classSetup";
import { useStudentStore } from "@/store/studentStore";
import { AddIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Checkbox,
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
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import _, {
  filter,
  find,
  findIndex,
  groupBy,
  map,
  round,
  uniqBy,
} from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { StudentFees } from "../StudentProfile/StudentFees";
import { useRouter } from "next/router";
import {
  ADMISSIONTYPE,
  BLOODGROUP,
  CATEGORY,
  OCCUPATIONTYPE,
  RELIGION,
} from "@/constant/AdmissionConstant";
import { CustomSelect } from "@/common/CustomSelect";
import SubjectSelectionModal from "./SubjectSelectionModal ";
import { FILE_URL } from "@/services/apis";

export const AdmissionForm = ({ data, themeColor, sessionMasterId }) => {
  const router = useRouter();

  const [guardian, setGuardian] = useState(false);
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          admissionDate: dayjs(data.admissionDate).format("YYYY-MM-DD"),
          studentName: data.name,
          classMasterId: data.classMasterId,
          streamMasterId: data.streamMasterId,
          fatherName: data.fatherName,
          fatherContact: data.fatherContact,
          motherName: data.motherName,
          motherContact: data.motherContact,
          sessionMasterId: data.sessionMasterId,
          address: data.address,
          openingAmount: data.openingAmount,
          selectedSubject: [],
        }
      : {
          admissionDate: dayjs().format("YYYY-MM-DD"),
          openingAmount: "0",
          sessionMasterId,
          selectedSubject: [],
        }
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

  const {
    getSingleEnquiryAction,
    getSingleEnquiryStatus,
    enquiryDetails,
    getStudentDetailsAction,
    getStudentDetailsStatus,
    studentDetails,
    resetStdDetailsStatus,
  } = useStudentStore((s) => ({
    getSingleEnquiryAction: s.getSingleEnquiryAction,
    getSingleEnquiryStatus: s.getSingleEnquiryStatus,
    enquiryDetails: s.enquiryDetails,
    getStudentDetailsAction: s.getStudentDetailsAction,
    getStudentDetailsStatus: s.getStudentDetailsStatus,
    studentDetails: s.studentDetails,
    resetStdDetailsStatus: s.resetStdDetailsStatus,
  }));

  const { getStreamAction, getStreamStatus, allStreams } = useClassSetupStore(
    (s) => ({
      getStreamAction: s.getStreamAction,
      getStreamStatus: s.getStreamStatus,
      allStreams: s.allStreams,
    })
  );

  useEffect(() => {
    if ((getStreamStatus || 1) === STATUS.NOT_STARTED) {
      getStreamAction();
    }
  }, [getStreamAction, getStreamStatus]);

  useEffect(() => {
    if (router?.query?.enquiry) {
      getSingleEnquiryAction(router.query.enquiry);
    }
  }, [getSingleEnquiryAction, router?.query?.enquiry]);

  useEffect(() => {
    if (router?.query?.student) {
      getStudentDetailsAction({
        id : router?.query?.student,
        sessionMasterId
      });
    }
  }, [getStudentDetailsAction, router?.query?.student ,sessionMasterId]);

  useEffect(() => {
    return () => resetStdDetailsStatus();
  }, [resetStdDetailsStatus]);

  useEffect(() => {
    if (enquiryDetails?.length) {
      const data = { ...enquiryDetails[0] };
      setInputValue({
        admissionDate: dayjs(data.admissionDate).format("YYYY-MM-DD"),
        studentName: data.name,
        classMasterId: data.classMasterId,
        streamMasterId: data.streamMasterId,
        fatherName: data.fatherName,
        fatherContact: data.fatherContact,
        motherName: data.motherName,
        motherContact: data.motherContact,
        sessionMasterId: data.sessionMasterId,
        address: data.address,
        openingAmount: "0",
        selectedSubject: [],
        enquiryId: data.id,
      });
    }
  }, [enquiryDetails, enquiryDetails?.length]);

  useEffect(() => {
    if (studentDetails && getStudentDetailsStatus === STATUS.SUCCESS) {
      const data = { ...studentDetails, ...studentDetails.student_master };
      setInputValue({
        ...data,
      });
    }
  }, [studentDetails, enquiryDetails, getStudentDetailsStatus]);

  const [stdPhoto, setStdPhoto] = useState(null);
  const steps = [
    { title: "First", description: "Basic Information" },
    { title: "Second", description: "Parent's Information" },
    // { title: "Third", description: "Guardian Information" },
    { title: "fourth", description: "Previous Details" },
    { title: "five", description: "Fees" },
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
    addStudentAction,
    addStudentStatus,
    resetAdmissionStatus,
    checkExistAction,
    checkExistStatus,
    checkExist,
  } = useStudentStore((s) => ({
    addStudentAction: s.addStudentAction,
    addStudentStatus: s.addStudentStatus,
    resetAdmissionStatus: s.resetAdmissionStatus,
    checkExistAction: s.checkExistAction,
    checkExistStatus: s.checkExistStatus,
    checkExist: s.checkExist,
  }));

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
      getSectionAction: s.getSectionAction,
    }));
  const { getSectionAction, getSectionStatus, allSections } =
    useClassSetupStore((s) => ({
      getSectionAction: s.getSectionAction,
      getSectionStatus: s.getSectionStatus,
      allSections: s.allSections,
    }));

  const { getHouseAction, getHouseStatus, allHouses } = useAdditionalSetupStore(
    (s) => ({
      getHouseAction: s.getHouseAction,
      getHouseStatus: s.getHouseStatus,
      allHouses: s.allHouses,
    })
  );

  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
    if ((getSectionStatus || 1) === STATUS.NOT_STARTED) {
      getSectionAction();
    }
    if ((getHouseStatus || 1) === STATUS.NOT_STARTED) {
      getHouseAction();
    }
  }, [
    activeStep,
    getClassSubjectAction,
    getClassSubjectStatus,
    getHouseAction,
    getHouseStatus,
    getSectionAction,
    getSectionStatus,
    sessionMasterId,
  ]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

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

  const [admissionNo, setAdmissionNo] = useState(null);
  const [srNo, setSrNo] = useState(null);

  useEffect(() => {
    if (checkExistStatus === STATUS.SUCCESS) {
      if (checkExist?.name === "srNo") {
        setSrNo(checkExist?.message === "allright" ? true : false);
      } else if (checkExist?.name === "admissionNo") {
        setAdmissionNo(checkExist?.message === "allright" ? true : false);
      }
    }
  }, [checkExist, checkExistStatus]);

  const srNoRef = useRef(null);
  useEffect(() => {
    if (srNoRef.current) {
      clearTimeout(srNoRef.current);
    }
    if (inputValue?.srNo) {
      srNoRef.current = setTimeout(() => {
        checkExistAction({ srNo: inputValue.srNo });
      }, 1000);
    }
    return () => {
      if (srNoRef.current) {
        clearTimeout(srNoRef.current);
      }
    };
  }, [inputValue?.srNo, checkExistAction]);

  const admissNoRef = useRef(null);
  useEffect(() => {
    if (admissNoRef.current) {
      clearTimeout(admissNoRef.current);
    }
    if (inputValue?.admissionNo) {
      admissNoRef.current = setTimeout(() => {
        checkExistAction({ admissionNo: inputValue.admissionNo });
      }, 1000);
    }
    return () => {
      if (admissNoRef.current) {
        clearTimeout(admissNoRef.current);
      }
    };
  }, [inputValue?.admissionNo, checkExistAction]);

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

  const optionalSubject = useMemo(() => {
    return filter(
      find(
        classes?.[inputValue?.classMasterId],
        (c) => c.streamMasterId === parseInt(inputValue?.streamMasterId)
      )?.assign_class_subjects,
      (s) => s.subjectType === "Optional"
    );
  }, [classes, inputValue?.classMasterId, inputValue?.streamMasterId]);

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
  const save = (e) => {
    e.preventDefault();
    addStudentAction({
      ..._.omit(inputValue, [
        "id",
        "class_master",
        "section_master",
        "stream_master",
        "student_master",
        "isDelete",
        "rollNo",
        "studentMasterId",
        "uUserId",
        "updatedAt",
        "userId",
      ]),
      selectedSubject: [
        ...classSub.map((s) => s.subject_master.id),
        ...(inputValue?.selectedSubject || []),
      ],
      applicationType: "New",
    });
    if (addStudentStatus === STATUS.SUCCESS) {
      router.push("/student/student-list");
    }
  };

  useEffect(() => {
    if (addStudentStatus === STATUS.SUCCESS) {
      resetAdmissionStatus();
      setInputValue({
        admissionDate: dayjs().format("YYYY-MM-DD"),
        sessionMasterId,
        openingAmount: 0,
      });
      router.push("/student/student-list");
      // window.location.reload();
    }
  }, [addStudentStatus, resetAdmissionStatus, router, sessionMasterId]);
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
  return (
    <Box>
      <Flex p={3} borderRadius={10}>
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
                {/* <StepTitle>{step.title}</StepTitle> */}
                <StepDescription>{step.description}</StepDescription>
              </Box>
              <StepSeparator colorScheme={"purple"} />
            </Step>
          ))}
        </Stepper>
      </Flex>
      <Accordion mt={5} defaultIndex={[0, 1, 2]} allowMultiple>
        {activeStep === 0 ? (
          <form onSubmit={handleNextStep}>
            <VStack spacing={5} w="100%" mt={2}>
              <Flex w={"100%"} align={"center"} gap={3}>
                <Flex w={"32%"}>
                  <Flex pos={"relative"} ml={5}>
                    <Avatar
                      size={"xl"}
                      onClick={labelClick}
                      cursor={"pointer"}
                      src={stdPhoto ? URL.createObjectURL(stdPhoto) : ""}
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
                    withCheck={true}
                    validate={srNo}
                    autoFocus={true}
                    type={"number"}
                    name="srNo"
                    label={"Sr No."}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />

                  <Flex h={3} />
                  <CustomInput
                    withCheck={true}
                    validate={admissionNo}
                    type={"number"}
                    name="admissionNo"
                    notRequire={true}
                    label={"Device No."}
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
                    notRequire={true}
                    label={"Form No."}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                </Box>
              </Flex>
              <Flex flexWrap={"wrap"} align={"center"} gap={4}>
                <CustomInput
                  autoFocus={true}
                  notRequire
                  type={"text"}
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
                  autoFocus={true}
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
                  // max={dayjs().year(2022).format("YYYY-MM-DD")}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomInput
                  w={"32%"}
                  type={"number"}
                  limit={14}
                  notRequire={true}
                  name="aadharNo"
                  label={"Aadhar No."}
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
                  name={"applicationType"}
                  label={"Select Admission Type"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={[
                    { name: "New Admission", value: "new" },
                    { name: "Old Admission", value: "old" },
                  ]}
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
                  w="32%"
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
                  w="32%"
                  name={"bloodGroup"}
                  label={"Select Blood Group"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(BLOODGROUP, (blood) => ({
                    value: blood.id,
                    name: blood.label,
                  }))}
                />

                <SubjectSelectionModal
                  subjects={subjects}
                  inputValue={inputValue}
                  selectAllSubject={selectAllSubject}
                  checkHandler={checkHandler}
                  classSub={classSub}
                />
              </Flex>
            </VStack>

            <Flex my={4} justify={"flex-end"}>
              <Button
                ml={4}
                size={"sm"}
                isDisabled={checkExistStatus === STATUS.FAILED ? true : false}
                colorScheme={`${themeColor}`}
                type={"submit"}
              >
                {" "}
                Next
              </Button>
            </Flex>
          </form>
        ) : activeStep === 1 ? (
          <form onSubmit={handleNextStep}>
            <VStack spacing={3} w={"100%"}>
              <Flex flexWrap={"wrap"} align={"center"} gap={4}>
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
                  limit={10}
                  name="fatherContact"
                  label={"Father's Contact"}
                  inputValue={inputValue}
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
                  notRequire={true}
                  label={"Income"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomInput
                  w={"32%"}
                  type={"text"}
                  name="motherName"
                  notRequire={true}
                  label={"Mother's Name"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomInput
                  w={"32%"}
                  type={"number"}
                  name="motherContact"
                  limit={10}
                  notRequire={true}
                  label={"Mother's Contact"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
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
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                {/* <CustomInput
                  w={"32%"}
                  type={"email"}
                  notRequire={true}
                  name="guardianEmail"
                  label={"Guardian's Email"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                /> */}
              </Flex>
              <Flex w={"100%"} align={"center"} gap={3}>
                <CustomTextarea
                  w={"50%"}
                  type={"text"}
                  name="address"
                  label={"Address"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomTextarea
                  w={"50%"}
                  type={"text"}
                  notRequire={true}
                  name="correspondingAddress"
                  label={"Corresponding Address"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
              </Flex>
            </VStack>

            <Flex my={4} justify={"flex-end"}>
              <Button size={"sm"} onClick={handleBackStep}>
                Back
              </Button>
              <Button
                ml={4}
                size={"sm"}
                isDisabled={checkExistStatus === STATUS.FAILED ? true : false}
                colorScheme={`${themeColor}`}
                type={"submit"}
              >
                {" "}
                Next
              </Button>
            </Flex>
          </form>
        ) : activeStep === 2 ? (
          <form onSubmit={handleNextStep}>
            <VStack spacing={3} w={"100%"}>
              <Flex flexWrap={"wrap"} align={"center"} gap={3}>
                <CustomInput
                  w={"32%"}
                  type={"text"}
                  notRequire={true}
                  name="prevSchool"
                  label={"School Name"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
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
                <CustomSelect
                  w="32%"
                  name={"prevStream"}
                  label={"Select Stream"}
                  notRequire={true}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(allStreams, (d, index) => ({
                    value: d.id,
                    name: d.name,
                  }))}
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
                  limit={3}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomInput
                  w={"32%"}
                  type={"number"}
                  notRequire={true}
                  name="prevObtainmarks"
                  label={"Obtained Marks"}
                  limit={3}
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
                  setInputValue={setInputValue}
                />
                {/* <CustomTextarea w={"64%"} type={"text"} notRequire={true} name="prevAddress" label={"Address"} inputValue={inputValue} setInputValue={setInputValue} /> */}
              </Flex>
            </VStack>

            <Flex my={4} justify={"flex-end"}>
              <Button size={"sm"} onClick={handleBackStep}>
                Back
              </Button>
              <Button ml={4} size={"sm"} type="submit" colorScheme={themeColor}>
                Next
              </Button>
            </Flex>
          </form>
        ) : (
          <form onSubmit={save}>
            <CustomInput
              w={"32%"}
              type={"number"}
              defultValue={"0"}
              name="openingAmount"
              label={"Opening Fees Amount"}
              // inputValue={inputValue?.isRTE ? "0" : inputValue}
              inputValue={inputValue}
              // disabled={inputValue?.isRTE ? true : false}
              setInputValue={setInputValue}
            />
            <StudentFees
              classMasterId={inputValue?.classMasterId}
              streamMasterId={inputValue?.streamMasterId}
              sessionMasterId={sessionMasterId}
              themeColor={themeColor}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />

            <Flex my={4} justify={"flex-end"}>
              <Button size={"sm"} onClick={handleBackStep}>
                Back
              </Button>
              <Button
                ml={4}
                type="submit"
                size={"sm"}
                isLoading={addStudentStatus === STATUS.FETCHING}
                isDisabled={
                  inputValue?.isRTE
                    ? false
                    : inputValue?.selectedFees?.length
                    ? false
                    : true
                }
                colorScheme={themeColor}
              >
                Submit
              </Button>
            </Flex>
          </form>
        )}
      </Accordion>
    </Box>
  );
};
