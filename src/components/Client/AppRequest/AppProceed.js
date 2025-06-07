import { v4 as uuidv4 } from "uuid";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
} from "@chakra-ui/react";
import { map, uniqueId } from "lodash";
import { useEffect, useState } from "react";
import { BasicDetails } from "./BasicDetails";
import { Modules } from "./Modules";
import dayjs from "dayjs";
import { useClientStore } from "@/store/client";
import { STATUS } from "@/constant";

export const AppProceed = ({ data, closeDrawer, themeColor }) => {
  const steps = [
    { title: "First", description: "App Registration" },
    { title: "Second", description: "App Modules" },
  ];
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          studentLimit: data.studentCount,
        }
      : {
          teacherModules: "",
          studentModules: "",
          name: data.name,
          contact: data.contact,
          orgCode: data.orgCode,
        }
  );



  
  useEffect(() => {
    if (inputValue?.studentLimit && inputValue?.perStudentPlan) {
      setInputValue((pre) => ({
        ...pre,
        totalAmount: parseInt(inputValue?.studentLimit) * parseInt(inputValue?.perStudentPlan),
      }));
    }
  }, [inputValue?.perStudentPlan, inputValue?.studentLimit]);

  const [activeStep, setActiveStep] = useState(0);
  const handleNextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBackStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const {
    addAppRequestAction,
    addAppRequestStatus,
    resetAppRequestStatus,
    getAppRequestAction,
  } = useClientStore((s) => ({
    addAppRequestAction: s.addAppRequestAction,
    addAppRequestStatus: s.addAppRequestStatus,
    resetAppRequestStatus: s.resetAppRequestStatus,
    getAppRequestAction: s.getAppRequestAction,
  }));
  const finishSubmit = async () => {
    const payload = {
      mobileAppRequestId: data.id,
      ...inputValue,
    };       await addAppRequestAction(payload);
    setInputValue({});
    getAppRequestAction();
  };

  useEffect(() => {
    if (addAppRequestStatus === STATUS.SUCCESS) {
      resetAppRequestStatus();
      closeDrawer();
    }
  }, [addAppRequestStatus, closeDrawer, resetAppRequestStatus]);

  return (
    <Drawer size={"xl"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Profile</DrawerHeader>

        <DrawerBody>
          <Box bg={"white"}>
            <Flex
              flexWrap={"wrap"}
              borderleft={"1px solid"}
              borderColor="gray.100"
              gap={7}
            >
              <ClientDetail
                heading={"Orgnization Code"}
                detail={data?.orgCode}
              />
              <ClientDetail heading={"School/Institute"} detail={data?.name} />
              <ClientDetail heading={"School Contact"} detail={data?.contact} />
            </Flex>
            <Flex mt={5} p={3} borderRadius={10}>
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
            {activeStep === 0 ? (
              <BasicDetails
                themeColor={themeColor}
                handleNextStep={handleNextStep}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
            ) : activeStep === 1 ? (
              <Modules
                themeColor={themeColor}
                handleBackStep={handleBackStep}
                handleNextStep={finishSubmit}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
            ) : null}
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const ClientDetail = ({ heading, detail }) => {
  return (
    <Box w={"25%"} mb={2}>
      <Text fontSize={14}>{heading}</Text>
      <Text fontSize={16} fontWeight={"semibold"}>
        {detail || " - "}
      </Text>
    </Box>
  );
};
