import { ConfirmAlert } from "@/common/ConfirmationAlert";
import { MODULES } from "@/constant/Modules";
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
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
} from "@chakra-ui/react";
import { map } from "lodash";
import { useEffect, useState } from "react";
import { BasicDetails } from "../Registration/BasicDetails";
import { Modules } from "../Registration/Modules";
import { useClientStore } from "@/store/client";
import { STATUS } from "@/constant";
import dayjs from "dayjs";

export const EditClient = ({ data, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,
          schoolName: data.schoolName,
          regNo: data.regNo,
          affNo: data.affNo,
          diseCode: data.diseCode,
          contactNo: data.contactNo,
          telephoneNo: data.telephoneNo,
          schoolEmail: data.schoolEmail,
          website: data.website,
          board: data.board,
          address: data.address,
          district: data.district,
          state: data.state,
          name: data.name,
          email: data.email,
          mobileNo: data.mobileNo,
          package: parseInt(data.package),
          expDate: data?.expDate
            ? dayjs(data.expDate).format("YYYY-MM-DD")
            : "",
        }
      : {}
  );
  const [selected, setSelected] = useState(
    data?.permission ? JSON.parse(data?.permission) : []
  );

  useEffect(() => {
    setSelected(data?.permission ? JSON.parse(data?.permission) : []);
  }, [data?.permission]);

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

  const { updateClientRegAction, updateClientRegStatus, resetClientRegStatus } =
    useClientStore((s) => ({
      updateClientRegAction: s.updateClientRegAction,
      updateClientRegStatus: s.updateClientRegStatus,
      resetClientRegStatus: s.resetClientRegStatus,
    }));

  const updateData = () => {
    updateClientRegAction({
      ...inputValue,
      permission: JSON.stringify(selected),
    });
  };

  useEffect(() => {
    if (updateClientRegStatus === STATUS.SUCCESS) {
      resetClientRegStatus();
      setInputValue({});
      closeDrawer();
    }
  }, [closeDrawer, resetClientRegStatus, updateClientRegStatus]);

  const [toggleConfirm, setToggleConfirm] = useState(null);
  const [toggleReject, setToggleReject] = useState(null);

  const reject = () => {};
  const confirm = () => {};
  return (
    <Drawer size={"xl"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Profile</DrawerHeader>

        <DrawerBody>
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
                handleNextStep={handleNextStep}
                inputValue={inputValue}
                setInputValue={setInputValue}
                noButtons={true}
              />
            ) : (
              <Modules
                themeColor={themeColor}
                handleBackStep={handleBackStep}
                handleNextStep={handleNextStep}
                inputValue={inputValue}
                setInputValue={setInputValue}
                noButtons={true}
                selected={selected}
                setSelected={setSelected}
              />
            )}
          </Box>
        </DrawerBody>

        <DrawerFooter>
          {activeStep === 0 ? (
            <>
              <Button
                size={"sm"}
                variant="outline"
                mr={3}
                colorScheme={"red"}
                onClick={closeDrawer}
              >
                Cancel{" "}
              </Button>
              <Button
                size={"sm"}
                colorScheme={themeColor}
                onClick={() => handleNextStep([])}
              >
                Next
              </Button>
            </>
          ) : (
            <>
              <Button
                size={"sm"}
                variant="outline"
                mr={3}
                colorScheme={"red"}
                onClick={() => handleBackStep([])}
              >
                Back{" "}
              </Button>
              <Button
                size={"sm"}
                colorScheme={themeColor}
                isLoading={updateClientRegStatus === STATUS.FETCHING}
                onClick={updateData}
              >
                Update
              </Button>
            </>
          )}
        </DrawerFooter>

        {/* {toggleReject &&
                    <ConfirmAlert
                        heading={"Reject Confirmation"}
                        description={"Are you sure? Do you want to reject client"}
                        closeAlert={() => setToggleReject(null)}
                        button={"Reject"}
                        color={"red"}
                        confirm={() => reject(toggleReject)}
                        status={status}
                    />
                }
                {toggleConfirm &&
                    <ConfirmAlert
                        heading={"Activate Confirmation"}
                        description={"Are you sure? Do you want to activate client"}
                        closeAlert={() => setToggleConfirm(null)}
                        button={"Activate"}
                        color={"green"}
                        confirm={() => confirm(toggleConfirm)}
                        status={status}
                    />
                } */}
      </DrawerContent>
    </Drawer>
  );
};
