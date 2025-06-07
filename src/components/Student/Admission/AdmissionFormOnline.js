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
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  Heading,
  Image,
  Input,
  Select,
  SimpleGrid,
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
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import _, {
  compact,
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
import { FILE_URL, URL } from "@/services/apis";
import { FaPrint } from "react-icons/fa";
import { MdPerson, MdSchool } from "react-icons/md";

export const AdmissionFormOnline = ({
  SCHOOLDATA,
  admissionId,
  themeColor,
  sessionMasterId ,
}) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState({
    admissionDate: dayjs().format("YYYY-MM-DD"),
    openingAmount: "0",
    sessionMasterId,
    selectedSubject: [],
  });

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

  const { getStreamOnlineAction, getStreamOnlineStatus, allStreamsOnline } =
    useClassSetupStore((s) => ({
      getStreamOnlineAction: s.getStreamOnlineAction,
      getStreamOnlineStatus: s.getStreamOnlineStatus,
      allStreamsOnline: s.allStreamsOnline,
    }));

  useEffect(() => {
    if ((getStreamOnlineStatus || 1) === STATUS.NOT_STARTED) {
      getStreamOnlineAction({
        orgCode: admissionId,
      });
    }
  }, [getStreamOnlineAction, getStreamOnlineStatus, admissionId]);

  const [stdPhoto, setStdPhoto] = useState(null);
  const steps = [
    { title: "First", description: "Basic Information" },
    { title: "Second", description: "Parent's Information" },
    { title: "fourth", description: "Previous Details" },
    { title: "five", description: "Review" },
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

  const { addStudentOnlineAction, addStudentStatus, resetAdmissionStatus } =
    useStudentStore((s) => ({
      addStudentOnlineAction: s.addStudentOnlineAction,
      addStudentStatus: s.addStudentStatus,
      resetAdmissionStatus: s.resetAdmissionStatus,
    }));

  const {
    getClassSubjecOnlinetAction,
    getClassSubjectOnlineStatus,
    allClassSubjectsOnline,
  } = useClassSetupStore((s) => ({
    getClassSubjecOnlinetAction: s.getClassSubjecOnlinetAction,
    getClassSubjectOnlineStatus: s.getClassSubjectOnlineStatus,
    allClassSubjectsOnline: s.allClassSubjectsOnline,
  }));
  const { getSectionOnlineAction, getSectionOnlineStatus, allSectionsOnline } =
    useClassSetupStore((s) => ({
      getSectionOnlineAction: s.getSectionOnlineAction,
      getSectionOnlineStatus: s.getSectionOnlineStatus,
      allSectionsOnline: s.allSectionsOnline,
    }));

  const { getHouseOnlineAction, getHouseOnlineStatus, allHousesOnline } =
    useAdditionalSetupStore((s) => ({
      getHouseOnlineAction: s.getHouseOnlineAction,
      getHouseOnlineStatus: s.getHouseOnlineStatus,
      allHousesOnline: s.allHousesOnline,
    }));

  useEffect(() => {
    if ((getClassSubjectOnlineStatus || 1) === STATUS.NOT_STARTED  && sessionMasterId) {
      getClassSubjecOnlinetAction({
        orgCode: admissionId,
        sessionMasterId
      });
    }
    if ((getSectionOnlineStatus || 1) === STATUS.NOT_STARTED ) {
      getSectionOnlineAction({
        orgCode: admissionId,
      });
    }
    if ((getHouseOnlineStatus || 1) === STATUS.NOT_STARTED) {
      getHouseOnlineAction({
        orgCode: admissionId,
      });
    }
  }, [
    activeStep,
    getClassSubjecOnlinetAction,
    getClassSubjectOnlineStatus,
    getHouseOnlineAction,
    getHouseOnlineStatus,
    getSectionOnlineAction,
    getSectionOnlineStatus,
    sessionMasterId,
    admissionId,
  ]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjectsOnline, "classMasterId");
  }, [allClassSubjectsOnline]);
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
    addStudentOnlineAction({
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
      orgCode: admissionId,
      selectedSubject: [
        ...classSub.map((s) => s.subject_master.id),
        ...(inputValue?.selectedSubject || []),
      ],
      applicationType: "New",
    });
  };

  useEffect(() => {
    if (addStudentStatus === STATUS.SUCCESS) {
      setActiveStep(0)
      resetAdmissionStatus();
      setInputValue({
        admissionDate: dayjs().format("YYYY-MM-DD"),
        sessionMasterId,
        openingAmount: 0,
      });
    }
  }, [addStudentStatus, resetAdmissionStatus, router, sessionMasterId]);
  const { getShiftOnlineAction, getShiftOnlineStatus, allShiftsOnline } =
    useAdditionalSetupStore((s) => ({
      getShiftOnlineAction: s.getShiftOnlineAction,
      getShiftOnlineStatus: s.getShiftOnlineStatus,
      allShiftsOnline: s.allShiftsOnline,
    }));

  useEffect(() => {
    if ((getShiftOnlineStatus || 1) === STATUS.NOT_STARTED && sessionMasterId) {
      getShiftOnlineAction({
        orgCode: admissionId,
        sessionMasterId
      });
    }
  }, [
    getShiftOnlineAction,
    getShiftOnlineStatus,
    admissionId,
    sessionMasterId,
  ]);
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
              <Flex w={"100%"} justify={"center"} align={"center"} mb={4}>
                <Flex pos={"relative"}>
                  <Avatar
                    size={"2xl"}
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
              <Flex flexWrap={"wrap"} align={"center"} gap={4}>
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
                  data={map(allSectionsOnline, (d, index) => ({
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
                {/* <CustomSelect
                  w={"32%"}
                  name={"applicationType"}
                  label={"Select Admission Type"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={[
                    { name: "New Admission", value: "new" },
                    { name: "Old Admission", value: "old" },
                  ]}
                /> */}
                <CustomSelect
                  w={"32%"}
                  name={"houseMasterId"}
                  label={"Select House"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(allHousesOnline, (house) => ({
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
                  data={map(allShiftsOnline, (d, key) => ({
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
                  themeColor={themeColor}
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
                <CustomInput
                  w={"32%"}
                  type={"email"}
                  notRequire={true}
                  name="guardianEmail"
                  label={"Guardian's Email"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
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
                  data={map(allStreamsOnline, (d, index) => ({
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
            {/* <StudentFees
              admissionId={admissionId}
              IsOnlineAdmission={true}
              classMasterId={inputValue?.classMasterId}
              streamMasterId={inputValue?.streamMasterId}
              sessionMasterId={sessionMasterId || 2}
              themeColor={themeColor}
              inputValue={inputValue}
              setInputValue={setInputValue}
            /> */}
            <Box id="printableForm" p={4} borderWidth={1} borderRadius="md" bg={`${themeColor}.50`}>

              <Flex justify="flex-end" mb={4}>
                <Button 
                  leftIcon={<FaPrint />} 
                  size="sm" 
                  colorScheme={themeColor}
                  onClick={() => window.print()}
                >
                  Print Form
                </Button>
              </Flex>
              <Flex direction={{ base: "column", md: "row" }} align="center" gap={4}>
            {/* School Logo */}
            <Box>
              <Image
                src={ URL + SCHOOLDATA?.logo || "https://via.placeholder.com/150"}
                alt="School Logo"
                h="120px"
                w="120px"
                borderRadius="lg"
                boxShadow="sm"
                p={1}
                bg="white"
                objectFit="contain"
              />
            </Box>

            <VStack flex={1} align="center" spacing={2}>
              {/* School Name */}
              <Heading
                size="lg"
                bgGradient={`linear(to-r, ${themeColor}.600, ${themeColor}.400)`}
                bgClip="text"
                textAlign="center"
              >
                {SCHOOLDATA?.name}
              </Heading>
              
              {/* School Address */}
              <Text
                fontSize="sm"
                color="gray.600"
                fontStyle="italic"
                textAlign="center"
              >
                {compact([
                  SCHOOLDATA?.address,
                  SCHOOLDATA?.district,
                  SCHOOLDATA?.state,
                ]).join(", ")}
              </Text>

              {/* School Info Badges */}
              <Flex gap={2} wrap="wrap" justify="center">
                {/* School Code Badge */}
                <Badge
                  colorScheme={themeColor}
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  fontSize="xs"
                >
                  <Flex align="center" gap={1}>
                    <MdSchool size={14} />
                    <Text>School Code: {SCHOOLDATA?.schoolCode}</Text>
                  </Flex>
                </Badge>

                {/* Registration Number Badge */}
                <Badge
                  colorScheme={themeColor}
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  fontSize="xs"
                >
                  <Flex align="center" gap={1}>
                    <MdSchool size={14} />
                    <Text>Reg No: {SCHOOLDATA?.regNo}</Text>
                  </Flex>
                </Badge>

                {/* Affiliation Badge */}
                <Badge
                  colorScheme={themeColor}
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  fontSize="xs"
                >
                  <Flex align="center" gap={1}>
                    <MdSchool size={14} />
                    <Text>Affiliation: {SCHOOLDATA?.affiliationNo}</Text>
                  </Flex>
                </Badge>

                {/* Contact Badge */}
                <Badge
                  colorScheme={themeColor}
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  fontSize="xs"
                >
                  <Flex align="center" gap={1}>
                    <MdPerson size={14} />
                    <Text>Contact: {SCHOOLDATA?.mobileNo}</Text>
                  </Flex>
                </Badge>

                {/* Academic Year Badge */}
              
              </Flex>

              {/* Form Title Box */}
              {/* <Box
                p={2}
                bg={`${themeColor}.50`}
                borderRadius="md"
                textAlign="center"
                border="1px dashed"
                borderColor={`${themeColor}.200`}
              >
                <Heading
                  size="sm"
                  color={`${themeColor}.700`}
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Online Student Admission Form   {session?.name}
                </Heading>
              </Box> */}
            </VStack>
          </Flex>
              <Box className="print-content">
                <Heading size="md" mb={4} color={`${themeColor}.600`}>
                  Basic Information
                </Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box p={3} bg="white" borderRadius="md" shadow="sm">
                    <Text fontWeight="bold" color={`${themeColor}.600`}>Student Name:</Text>
                    <Text>{inputValue.studentName || "Not provided"}</Text>
                  </Box>
                  <Box p={3} bg="white" borderRadius="md" shadow="sm">
                    <Text fontWeight="bold" color={`${themeColor}.600`}>Date of Birth:</Text>
                    <Text>{inputValue.dob || "Not provided"}</Text>
                  </Box>
                  <Box p={3} bg="white" borderRadius="md" shadow="sm">
                    <Text fontWeight="bold" color={`${themeColor}.600`}>Gender:</Text>
                    <Text>{inputValue.gender || "Not provided"}</Text>
                  </Box>
                  <Box p={3} bg="white" borderRadius="md" shadow="sm">
                    <Text fontWeight="bold" color={`${themeColor}.600`}>Class:</Text>
                    <Text>
                      {find(
                        classes?.[inputValue?.classMasterId],
                        (c) => c.class_master?.id === parseInt(inputValue?.classMasterId)
                      )?.class_master?.name || "Not provided"}
                    </Text>
                  </Box>
                  <Box p={3} bg="white" borderRadius="md" shadow="sm">
                    <Text fontWeight="bold" color={`${themeColor}.600`}>Stream:</Text>
                    <Text>
                      {find(
                        allStreamsOnline,
                        (s) => s.id === parseInt(inputValue?.streamMasterId)
                      )?.name || "Not provided"}
                    </Text>
                  </Box>
                  <Box p={3} bg="white" borderRadius="md" shadow="sm">
                    <Text fontWeight="bold" color={`${themeColor}.600`}>Section:</Text>
                    <Text>
                      {find(
                        allSectionsOnline,
                        (s) => s.id === parseInt(inputValue?.sectionMasterId)
                      )?.name || "Not provided"}
                    </Text>
                  </Box>
                </Grid>

                <Heading size="md" mb={4} mt={6} color={`${themeColor}.600`}>
                  Parents Information
                </Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box p={3} bg="white" borderRadius="md" shadow="sm">
                    <Text fontWeight="bold" color={`${themeColor}.600`}>Father Name:</Text>
                    <Text>{inputValue.fatherName || "Not provided"}</Text>
                  </Box>
                  <Box p={3} bg="white" borderRadius="md" shadow="sm">
                    <Text fontWeight="bold" color={`${themeColor}.600`}>Father Contact:</Text>
                    <Text>{inputValue.fatherContact || "Not provided"}</Text>
                  </Box>
                  <Box p={3} bg="white" borderRadius="md" shadow="sm">
                    <Text fontWeight="bold" color={`${themeColor}.600`}>Mother Name:</Text>
                    <Text>{inputValue.motherName || "Not provided"}</Text>
                  </Box>
                  <Box p={3} bg="white" borderRadius="md" shadow="sm">
                    <Text fontWeight="bold" color={`${themeColor}.600`}>Mother Contact:</Text>
                    <Text>{inputValue.motherContact || "Not provided"}</Text>
                  </Box>
                  <Box p={3} bg="white" borderRadius="md" shadow="sm" gridColumn="span 2">
                    <Text fontWeight="bold" color={`${themeColor}.600`}>Address:</Text>
                    <Text>{inputValue.address || "Not provided"}</Text>
                  </Box>
                </Grid>

                <Heading size="md" mb={4} mt={6} color={`${themeColor}.600`}>
                  Previous Details
                </Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box p={3} bg="white" borderRadius="md" shadow="sm">
                    <Text fontWeight="bold" color={`${themeColor}.600`}>Previous School:</Text>
                    <Text>{inputValue.prevSchool || "Not provided"}</Text>
                  </Box>
                  <Box p={3} bg="white" borderRadius="md" shadow="sm">
                    <Text fontWeight="bold" color={`${themeColor}.600`}>Previous Class:</Text>
                    <Text>{inputValue.prevClass || "Not provided"}</Text>
                  </Box>
                  <Box p={3} bg="white" borderRadius="md" shadow="sm">
                    <Text fontWeight="bold" color={`${themeColor}.600`}>Previous Stream:</Text>
                    <Text>
                      {find(
                        allStreamsOnline,
                        (s) => s.id === parseInt(inputValue?.prevStream)
                      )?.name || "Not provided"}
                    </Text>
                  </Box>
                  <Box p={3} bg="white" borderRadius="md" shadow="sm">
                    <Text fontWeight="bold" color={`${themeColor}.600`}>Previous Marks:</Text>
                    <Text>
                      {inputValue.prevObtainmarks && inputValue.prevMaxmarks ? 
                        `${inputValue.prevObtainmarks} / ${inputValue.prevMaxmarks} (${inputValue.prevPercentmarks}%)` : 
                        "Not provided"}
                    </Text>
                  </Box>
                </Grid>

                <Heading size="md" mb={4} mt={6} color={`${themeColor}.600`}>
                  Selected Subjects
                </Heading>
                <SimpleGrid columns={3} spacing={4}>
                  {optionalSubject?.length > 0 ? (
                    [...optionalSubject].map((subject, index) => (
                      <Box key={index} p={3} bg="white" borderRadius="md" shadow="sm">
                        <Checkbox
                          isChecked={inputValue.selectedSubject.includes(
                            subject.subject_master.id
                          )}
                          isReadOnly
                          colorScheme={themeColor}
                        >
                          {subject.subject_master.name}
                        </Checkbox>
                      </Box>
                    ))
                  ) : (
                    <Text gridColumn="span 3" textAlign="center">No subjects selected</Text>
                  )}
                </SimpleGrid>
              </Box>
            </Box>

            <style>
              {`
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  #printableForm, #printableForm * {
                    visibility: visible;
                  }
                  #printableForm {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                  }
                  .print-content {
                    padding: 20px;
                  }
                  /* Preserve theme colors in print */
                  #printableForm [class*="chakra-"] {
                    color: var(--chakra-colors-${themeColor}-600) !important;
                    background-color: inherit !important;
                    border-color: inherit !important;
                  }
                  /* Ensure theme colors print properly */
                  #printableForm [class*="chakra-"] * {
                    color: var(--chakra-colors-${themeColor}-600) !important;
                    background-color: inherit !important;
                    border-color: inherit !important;
                  }
                  /* Force background colors to print */
                  @media print and (color) {
                    * {
                      -webkit-print-color-adjust: exact !important;
                      print-color-adjust: exact !important;
                    }
                  }
                }
              `}
            </style>
            <Flex my={4} justify={"flex-end"}>
              <Button size={"sm"} onClick={handleBackStep}>
                Back
              </Button>
              <Button
                ml={4}
                type="submit"
                size={"sm"}
                isLoading={addStudentStatus === STATUS.FETCHING}
                // isDisabled={inputValue?.selectedFees?.length ? false : true}
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
