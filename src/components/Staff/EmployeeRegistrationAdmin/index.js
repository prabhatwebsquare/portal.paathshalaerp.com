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
  Select,
  VStack,
} from "@chakra-ui/react";
import { map } from "lodash";
import { useEffect, useRef, useState } from "react";
import { BLOODGROUP, CATEGORY, RELIGION } from "@/constant/AdmissionConstant";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { useAdminStore } from "@/store/AdminStore";

export const EmployeeRegistrationAdmin = ({
  sessionMasterId,
  themeColor,
  data,
  closeDrawer,
}) => {
  const [inputValue, setInputValue] = useState(() => {
    return data
      ? { ...data, sessionMasterId }
      : {
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
    empRegistrationSuperAdminAction,
    empRegistrationSuperAdminStatus,
    updateStaffSuperAdminAction,
    updateStaffSuperAdminStatus,
    resetStaffSuperAdminStatus,
    getStaffSuperAdminAction
  } = useStaffStore((s) => ({
    empRegistrationSuperAdminAction: s.empRegistrationSuperAdminAction,
    empRegistrationSuperAdminStatus: s.empRegistrationSuperAdminStatus,
    updateStaffSuperAdminAction: s.updateStaffSuperAdminAction,
    updateStaffSuperAdminStatus: s.updateStaffSuperAdminStatus,
    resetStaffSuperAdminStatus: s.resetStaffSuperAdminStatus,
    getStaffSuperAdminAction: s.getStaffSuperAdminAction
  }));

  const empRegistration = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateStaffSuperAdminAction(inputValue);
    } else {
      empRegistrationSuperAdminAction(inputValue);
    }
  };

  const router = useRouter();
  const {
    getdesignationSuperAdminAction,
    getdesignationSuperAdminStatus,
    alldesignationsSuperAdmin,
    resetdesignationSuperAdminStatus,
  } = useAdditionalSetupStore((s) => ({
    getdesignationSuperAdminAction: s.getdesignationSuperAdminAction,
    getdesignationSuperAdminStatus: s.getdesignationSuperAdminStatus,
    alldesignationsSuperAdmin: s.alldesignationsSuperAdmin,
    resetdesignationSuperAdminStatus: s.resetdesignationSuperAdminStatus,
  }));
  const {
    getRoleSuperAdminAction,
    getRoleSuperAdminStatus,
    allRolesSuperAdmin,
    resetRoleSuperAdminStatus,
  } = useAdminStore((s) => ({
    getRoleSuperAdminAction: s.getRoleSuperAdminAction,
    getRoleSuperAdminStatus: s.getRoleSuperAdminStatus,
    allRolesSuperAdmin: s.allRolesSuperAdmin,
    resetRoleSuperAdminStatus: s.resetRoleSuperAdminStatus,
  }));
  useEffect(() => {
    if (
      empRegistrationSuperAdminStatus === STATUS.SUCCESS ||
      updateStaffSuperAdminStatus === STATUS.SUCCESS
    ) {
      closeDrawer();
      resetStaffSuperAdminStatus();
      getStaffSuperAdminAction();
    }
  }, [ empRegistrationSuperAdminStatus, getdesignationSuperAdminAction, resetStaffSuperAdminStatus, updateStaffSuperAdminStatus]);


  useEffect(() => {
    if ((getdesignationSuperAdminStatus || 1) === STATUS.NOT_STARTED) {
      getdesignationSuperAdminAction();
    }
  }, [getdesignationSuperAdminAction, getdesignationSuperAdminStatus]);



  useEffect(() => {
    if ((getRoleSuperAdminStatus || 1) === STATUS.NOT_STARTED) {
      getRoleSuperAdminAction();
    }
  }, [getRoleSuperAdminAction, getRoleSuperAdminStatus]);
  return (
    <Drawer size={"xl"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody>
          <Box h={"100%"}>
            <Box p={5} bg={"white"} h={"100%"}>
              <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                <form onSubmit={empRegistration}>
                  <VStack spacing={3} w="100%" height={"80vh"}>
                    {/* Personal Information */}
                    <Box w="100%">
                      <Heading size="md" mb={3}>
                        Personal Information
                      </Heading>
                      <Flex w="100%" align="center" gap={2} flexWrap="wrap">
                        {/* Profile Picture */}
                        <Box w="32%">
                          <Flex pos="relative" ml={5}>
                            <Avatar
                              size="xl"
                              onClick={labelClick}
                              cursor="pointer"
                              src={
                                stdPhoto ? URL.createObjectURL(stdPhoto) : ""
                              }
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
                        {/* Basic Details */}
                        <CustomInput
                          w="32%"
                          type="text"
                          name="fullName"
                          label="Full Name"
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                        />

                        <CustomInput
                          w="32%"
                          type="number"
                          name="mobileNo"
                          label="Mobile Number"
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
                          w={"32%"}
                          name={"designationId"}
                          label={"Select Designation"}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                          data={map(alldesignationsSuperAdmin, (data) => ({
                            value: data.id,
                            name: data.name,
                          }))}
                        />
                        <CustomSelect
                          w={"32%"}
                          name={"roleMasterId"}
                          label={"Select Role"}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                          data={map(allRolesSuperAdmin, (data) => ({
                            value: data.id,
                            name: data.name,
                          }))}
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
                          name="isActive"
                          label="Active Status"
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                          data={[
                            { value: 1, name: "Active" },
                            { value: 0, name: "In-Active" },
                          ]}
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
                  </VStack>
                  <Button
                    position={"absolute"}
                    bottom={5}
                    width={"90%"}
                    size={"sm"}
                    colorScheme={themeColor}
                    type={"submit"} // Ensure this is set correctly
                  >
                    Save
                  </Button>
                </form>
              </Box>
            </Box>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
