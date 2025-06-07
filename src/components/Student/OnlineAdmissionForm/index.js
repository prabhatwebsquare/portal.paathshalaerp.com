import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import CustomTextarea from "@/common/CustomTextarea";
import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import {
  ADMISSIONTYPE,
  BLOODGROUP,
  CATEGORY,
  OCCUPATIONTYPE,
  RELIGION,
} from "@/constant/AdmissionConstant";
import { useClassSetupStore } from "@/store/classSetup";
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
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { filter, find, groupBy, map } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

export const OnlineAdmissionForm = ({ themeColor }) => {
  const router = useRouter();

  const [guardian, setGuardian] = useState(false);
  const [inputValue, setInputValue] = useState({
    admissionDate: dayjs().format("YYYY-MM-DD"),
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

  // const { addStudentAction, addStudentStatus, resetAdmissionStatus, checkExistAction, checkExistStatus, checkExist } = useStudentStore(s => ({
  //     addStudentAction: s.addStudentAction,
  //     addStudentStatus: s.addStudentStatus,
  //     resetAdmissionStatus: s.resetAdmissionStatus,
  //     checkExistAction: s.checkExistAction,
  //     checkExistStatus: s.checkExistStatus,
  //     checkExist: s.checkExist
  // }))

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



  return (
    <Box p={5}>
      <Flex bg={`${themeColor}.200`} p={3} borderRadius={10}>
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
      <Accordion mt={5} defaultIndex={[0, 1, 2]} allowMultiple>
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
                        autoFocus={true}
                        type={"text"}
                        name="studentName"
                        label={"Student Name"}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                      <Flex h={3} />
                      <CustomInput
                        type={"date"}
                        name="dob"
                        label={"Date of Birth"}
                        max={dayjs().year(2022).format("YYYY-MM-DD")}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                    </Box>
                    <Box w={"32%"}>
                      <CustomInput
                        type={"number"}
                        limit={14}
                        notRequire={true}
                        name="aadharNo"
                        label={"Aadhar No."}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                      <Flex h={3} />
                      <CustomSelect
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
                    </Box>
                  </Flex>
                  <Flex w={"100%"} flexWrap={"wrap"} align={"center"} gap={4}>
           
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
                      name="fatherContact"
                      label={"Father's Contact"}
                      limit={10}
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
                      notRequire={true}
                      label={"Mother's Contact"}
                      inputValue={inputValue}
                      limit={10}
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
                    <Checkbox
                      size={"lg"}
                      value={guardian}
                      colorScheme={themeColor}
                      onChange={(e) => setGuardian(e.target.checked)}
                    >
                      Guardian Details
                    </Checkbox>
                  </Flex>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
            {guardian ? (
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
                    <Flex w={"100%"} flexWrap={"wrap"} align={"center"} gap={3}>
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
                        limit={10}
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
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ) : null}
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
        ) : (
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
              </AccordionPanel>
            </AccordionItem>
            <Flex my={4} justify={"flex-end"}>
              <Button size={"sm"} onClick={handleBackStep}>
                Back
              </Button>
              <Button ml={4} size={"sm"} type="submit" colorScheme={themeColor}>
                Submit
              </Button>
            </Flex>
          </form>
        )}
      </Accordion>
    </Box>
  );
};
