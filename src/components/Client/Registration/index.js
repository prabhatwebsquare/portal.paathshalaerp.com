import CustomInput from "@/common/CustomInput";
import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Input,
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
  VStack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BasicDetails } from "./BasicDetails";
import { Modules } from "./Modules";
import { ClientVerification } from "./ClientVerification";

export const ClientRegistration = ({ sessionMasterId, themeColor }) => {
  const [inputValue, setInputValue] = useState();
  const [selected, setSelected] = useState([]);

  const steps = [
    { title: "First", description: "Client Registration" },
    { title: "Second", description: "Client Modules" },
    { title: "Third", description: "Client Verification" },
  ];
  const [activeStep, setActiveStep] = useState(0);
  const handleNextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBackStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box
      bg={"white"}
      h={"100%"}
      className="scrollBar"
      maxH={"100%"}
      overflowY={"scroll"}
    >
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
      {activeStep === 0 ? (
        <BasicDetails
          themeColor={themeColor}
          sessionMasterId={sessionMasterId}
          handleNextStep={handleNextStep}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      ) : activeStep === 1 ? (
        <Modules
          themeColor={themeColor}
          sessionMasterId={sessionMasterId}
          handleBackStep={handleBackStep}
          handleNextStep={handleNextStep}
          inputValue={inputValue}
          selected={selected}
          setInputValue={setInputValue}
          setSelected={setSelected}
        />
      ) : (
        <ClientVerification
          themeColor={themeColor}
          sessionMasterId={sessionMasterId}
          handleBackStep={handleBackStep}
          handleNextStep={handleNextStep}
        />
      )}
    </Box>
  );
};
