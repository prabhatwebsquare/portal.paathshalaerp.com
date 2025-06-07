import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useAdminBiometricStore } from "@/store/Biometric";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  DrawerFooter,
  VStack,
  HStack,
  Icon,
  Text,
  Box,
  useToast,
  Flex,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaFingerprint } from "react-icons/fa";
import { FiBook, FiSmile, FiUser } from "react-icons/fi";
import SearchSchool from "./SearchSchool";

export const AddBiometric = ({ data, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          ...data,
          type: data.type === "student" ? "Student" : "Teacher",
          biometricType: data.biometricType || "Face", // Default to Face if undefined
        }
      : {
          schoolName: "",
          type: "Teacher",
          biometricType: "Face",
          deviceId: "",
          schoolCode: "",
        }
  );

  const toast = useToast();
  const {
    addBiometricAction,
    addBiometricStatus,
    updateBiometricAction,
    updateBiometricStatus,
    resetBiometricStatus,
  } = useAdminBiometricStore((s) => ({
    addBiometricAction: s.addBiometricAction,
    addBiometricStatus: s.addBiometricStatus,
    updateBiometricAction: s.updateBiometricAction,
    updateBiometricStatus: s.updateBiometricStatus,
    resetBiometricStatus: s.resetBiometricStatus,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...inputValue,
      // Ensure biometricType is sent as selected
    };
    if (data?.id) {
      updateBiometricAction(formattedData);
    } else {
      addBiometricAction(formattedData);
    }
  };

  useEffect(() => {
    if (
      addBiometricStatus === STATUS.SUCCESS ||
      updateBiometricStatus === STATUS.SUCCESS
    ) {
      resetBiometricStatus();
      closeDrawer();
      toast({
        title: data?.id ? "Biometric Updated" : "Biometric Added",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [
    addBiometricStatus,
    updateBiometricStatus,
    resetBiometricStatus,
    closeDrawer,
    toast,
    data,
  ]);

 

  return (
    <Drawer isOpen={!!data} placement="right" size={"md"} onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={handleSubmit}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {data?.id ? "Edit Biometric School" : "Add New Biometric School"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={6} py={4}>
              <SearchSchool setInputValue={setInputValue} />
              {inputValue.schoolName && (
                <CustomInput
                  type="text"
                  name="schoolName"
                  label="School Name"
                  isDisabled
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
              )}
              <Box width="100%">
                <Text fontWeight="semibold" mb={2}>
                  Select User Type & Biometric Type
                </Text>
                <VStack spacing={4} align="stretch">
                  {["Teacher", "Student"].map((userType) => (
                    <Box
                      key={userType}
                      p={4}
                      borderWidth="1px"
                      borderRadius="lg"
                      borderColor={
                        inputValue.type === userType ? "blue.500" : "gray.200"
                      }
                      bg={inputValue.type === userType ? "blue.50" : "white"}
                      cursor="pointer"
                      onClick={() =>
                        setInputValue((prev) => ({
                          ...prev,
                          type: userType,
                          // Reset biometricType to default for new userType if needed
                          biometricType:
                            prev.biometricType || "Face",
                        }))
                      }
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Flex align="center">
                        <Icon
                          as={userType === "Teacher" ? FiUser : FiBook}
                          boxSize={6}
                          color={
                            inputValue.type === userType
                              ? "blue.500"
                              : "gray.500"
                          }
                          mr={3}
                        />
                        <Text fontWeight="semibold">{userType}</Text>
                      </Flex>
                      <HStack spacing={3}>
                        {["Face", "Fingerprint"].map((bioType) => (
                          <Box
                            key={bioType}
                            p={2}
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor={
                              inputValue.biometricType === bioType
                                ? "blue.500"
                                : "gray.300"
                            }
                            bg={
                              inputValue.biometricType === bioType
                                ? "blue.50"
                                : "white"
                            }
                            cursor="pointer"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent userType click
                              setInputValue((prev) => ({
                                ...prev,
                                biometricType: bioType,
                              }));
                            }}
                          >
                            <Icon
                              as={bioType === "Face" ? FiSmile : FaFingerprint}
                              boxSize={5}
                              color={
                                inputValue.biometricType === bioType
                                  ? "blue.500"
                                  : "gray.500"
                              }
                            />
                          </Box>
                        ))}
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
              <CustomInput
                type="text"
                name="deviceId"
                label="Cloud ID"
                placeholder="Cloud ID"
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
            </VStack>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Button
              size="sm"
              variant="outline"
              mr={3}
              colorScheme="red"
              onClick={closeDrawer}
            >
              Cancel
            </Button>
            <Button size="sm" type="submit" colorScheme={themeColor}>
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};