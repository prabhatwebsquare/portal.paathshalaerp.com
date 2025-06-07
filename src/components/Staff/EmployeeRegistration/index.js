import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
import { useStaffStore } from "@/store/StaffStore";
import { AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { map } from "lodash";
import { useEffect, useRef, useState } from "react";
import { BLOODGROUP, CATEGORY, RELIGION } from "@/constant/AdmissionConstant";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { FILE_URL } from "@/services/apis";

export const EmployeeRegistration = ({
  data,
  closeDrawer,
  themeColor,
  isOpen,
  sessionMasterId,
}) => {
  const [inputValue, setInputValue] = useState(() => {
    return data
      ? { ...data, sessionMasterId }
      : {
          name: "", //d
          dob: "",
          gender: "",
          maritalStatus: "",
          email: "", //d
          mobileNo: "",
          guardianName: "",
          bloodGroup: "",
          religion: "",
          category: "",
          address: "",
          hireDate: "",
          department: "",
          shiftMasterId: "",
          panNo: "",
          guardianContact: "",
          salaryType: "",
          pfNo: "",
          deviceId: "",
          StaffSalutation: "",
          guardianSalutation: "",
          designation: "",
          payrollType: "",
          sessionMasterId,
        };
  });
  const [stdPhoto, setStdPhoto] = useState(null);
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

  const {
    empRegistrationAction,
    empRegistrationStatus,
    updateStaffAction,
    updateStaffStatus,
    resetStaffStatus,
  } = useStaffStore((s) => ({
    empRegistrationAction: s.empRegistrationAction,
    empRegistrationStatus: s.empRegistrationStatus,
    updateStaffAction: s.updateStaffAction,
    updateStaffStatus: s.updateStaffStatus,
    resetStaffStatus: s.resetStaffStatus,
  }));

  const empRegistration = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateStaffAction(inputValue);
    } else {
      empRegistrationAction(inputValue);
    }
  };

  const router = useRouter();

  useEffect(() => {
    if (
      empRegistrationStatus === STATUS.SUCCESS ||
      updateStaffStatus === STATUS.SUCCESS
    ) {
      closeDrawer();
      resetStaffStatus();
      setInputValue({});
      setStdPhoto(null);
    }
  }, [ empRegistrationStatus,  updateStaffStatus]);

  const { getdesignationAction, getdesignationStatus, alldesignations } =
    useAdditionalSetupStore((s) => ({
      getdesignationAction: s.getdesignationAction,
      getdesignationStatus: s.getdesignationStatus,
      alldesignations: s.alldesignations,
    }));

  useEffect(() => {
    if ((getdesignationStatus || 1) === STATUS.NOT_STARTED) {
      getdesignationAction();
    }
  }, [getdesignationAction, getdesignationStatus]);
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
    <Drawer size={"xl"} isOpen={isOpen} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody>
          <Box p={5} bg={"white"} h={"100%"}>
            <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
              <form onSubmit={empRegistration}>
                <VStack spacing={3} w="100%" height={"80vh"}>
                  <Box w="100%">
                    <Heading size="md" mb={3}>
                      Personal Information
                    </Heading>
                    <Flex w="100%" align="center" gap={2} flexWrap="wrap">
                      <Box w="32%">
                        <Flex pos="relative" ml={5}>
                          <Avatar
                            size="xl"
                            onClick={labelClick}
                            cursor="pointer"
                            src={stdPhoto ? URL.createObjectURL(stdPhoto) : `${FILE_URL}${inputValue?.photo}`}
                            showBorder
                            borderColor={`${themeColor}.400`}
                          />
                          <Flex
                            pos="absolute"
                            onClick={labelClick}
                            cursor="pointer"
                            p={1}
                            bottom={1}
                            right={1}
                            borderRadius="50%"
                            bg={`${themeColor}.600`}
                            color="white"
                          >
                            <AddIcon boxSize={3} />
                          </Flex>
                        </Flex>
                        <Input
                          type="file"
                          ref={inputRef}
                          accept="image/*"
                          display="none"
                          onChange={(e) => selectedFile(e.target.files)}
                        />
                      </Box>
                      <CustomInput
                        w="32%"
                        type="number"
                        notRequire={true}
                        name="deviceId"
                        label="Device Id"
                        autoFocus
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                      <CustomInput
                        w="32%"
                        type="date"
                        name="hireDate"
                        label="Date of Hire"
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                      <CustomSelect
                        w="32%"
                        name="StaffSalutation"
                        label="Staff Salutation"
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        data={[
                          { name: "Mr.", value: "Mr" },
                          { name: "Mrs.", value: "Mrs" },
                          { name: "Ms.", value: "Ms" },
                          { name: "Dr.", value: "Dr" },
                          { name: "Prof.", value: "Prof" },
                        ]}
                      />
                      <CustomInput
                        w="65%"
                        type="text"
                        name="name"
                        label="Full Name"
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                      <CustomSelect
                        w="32%"
                        name="guardianSalutation"
                        label="Guardian Salutation"
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        data={[
                          { name: "Mr.", value: "Mr" },
                          { name: "Mrs.", value: "Mrs" },
                          { name: "Miss", value: "Miss" },
                          { name: "Dr.", value: "Dr" },
                          { name: "Prof.", value: "Prof" },
                        ]}
                      />
                      <CustomInput
                        w="65%"
                        type="text"
                        name="guardianName"
                        label="Father Name/Guardian Name/Husband Name"
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                      <CustomInput
                        w="32%"
                        type="email"
                        name="email"
                        label="Email"
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                      <CustomInput
                        w="32%"
                        type="date"
                        name="dob"
                        label="Date of Birth"
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                      <CustomSelect
                        w="32%"
                        name="gender"
                        label="Select Gender"
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        data={[
                          { name: "Male", value: "Male" },
                          { name: "Female", value: "Female" },
                          { name: "Other", value: "Other" },
                        ]}
                      />
                      <CustomSelect
                        w="32%"
                        name="maritalStatus"
                        label="Marital Status"
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        data={[
                          { name: "Married", value: "Married" },
                          { name: "Unmarried", value: "Unmarried" },
                          { name: "Other", value: "Other" },
                        ]}
                      />
                      <CustomInput
                        w="32%"
                        type="number"
                        name="mobileNo"
                        label="Contact"
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                      <CustomSelect
                        w="32%"
                        name="bloodGroup"
                        label="Select Blood Group"
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        data={map(BLOODGROUP, (blood) => ({
                          value: blood.id,
                          name: blood.label,
                        }))}
                      />
                      <CustomSelect
                        w="32%"
                        name="religion"
                        label="Select Religion"
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        data={map(RELIGION, (rele) => ({
                          value: rele.id,
                          name: rele.label,
                        }))}
                      />
                      <CustomSelect
                        w="32%"
                        name="category"
                        label="Select Category"
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        data={map(CATEGORY, (cat) => ({
                          value: cat.id,
                          name: cat.label,
                        }))}
                      />
                      <CustomInput
                        w="32%"
                        type="number"
                        notRequire={true}
                        name="yearlyCl"
                        label="Yearly CL"
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                    </Flex>
                    <CustomTextarea
                      w="100%"
                      type="text"
                      name="address"
                      label="Address"
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                    />
                  </Box>

                  {/* Employment Details */}
                  <Box w="100%">
                    <Heading size="md" mb={3}>
                      Employment Details
                    </Heading>
                    <Flex w="100%" flexWrap="wrap" gap={2}>
                      <CustomSelect
                        w={"24%"}
                        name={"designation"}
                        label={"Select Designation"}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        data={map(alldesignations, (data) => ({
                          value: data.name,
                          name: data.name,
                        }))}
                      />
                      <CustomSelect
                        w={"24%"}
                        name="department"
                        label="Department"
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        data={[
                          { name: "Teaching", value: "teaching" },
                          { name: "Non-Teaching", value: "non-teaching" },
                        ]}
                      />
                      <CustomSelect
                        w={"24%"}
                        name="payrollType"
                        label="Pay Role Type"
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        data={[
                          { name: "Full-Time", value: "full-time" },
                          { name: "Part-Time", value: "part-time" },
                          // { name: "Contract", value: "contract" },
                        ]}
                      />
                      <CustomSelect
                        w={"24%"}
                        name={"shiftMasterId"}
                        label={"Select Shift"}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        data={map(allShifts, (d, key) => ({
                          value: d?.id,
                          name: d?.name,
                        }))}
                      />
                    </Flex>
                  </Box>

                  <Box w="100%">
                    <Heading size="md" mb={3}>
                      Financial Details
                    </Heading>
                    <Flex w="100%" flexWrap="wrap" gap={2}>
                      <CustomSelect
                        w="49%"
                        name="salaryType"
                        label="Salary Type"
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        data={[
                          { name: "Monthly", value: "Monthly" },
                          { name: "Daily", value: "Daily" },
                        ]}
                      />
                      <CustomInput
                        w="49%"
                        type="number"
                        name="guardianContact"
                        label="Gross Salary"
                        notRequire
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                      <CustomInput
                        w="49%"
                        type="text"
                        name="pfNo"
                        label="PF No."
                        notRequire
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                      <CustomInput
                        w="49%"
                        type="text"
                        name="panNo"
                        notRequire
                        label="PAN No."
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                    </Flex>
                  </Box>
                </VStack>
                <Button
                  position={"absolute"}
                  bottom={5}
                  width={"90%"}
                  loadingText={"Saving..."}
                  isLoading={
                    empRegistrationStatus === STATUS.FETCHING ||
                    updateStaffStatus === STATUS.FETCHING
                  }
                  size={"sm"}
                  colorScheme={themeColor}
                  type={"submit"} // Ensure this is set correctly
                >
                  Save
                </Button>
              </form>
            </Box>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
