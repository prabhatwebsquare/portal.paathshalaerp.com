import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Input,
  Select,
  Text,
  VStack,
  Heading,
  Divider,
  useColorModeValue,
  ScaleFade,
} from "@chakra-ui/react";
import { find, map } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { STATUS } from "@/constant";
import CustomInput from "@/common/CustomInput";
import CustomTextarea from "@/common/CustomTextarea";
import { useAdminStore } from "@/store/AdminStore";
import { useCommonStore } from "@/store/CommonStore";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/LocalStorage";
import { FILE_URL } from "@/services/apis";
import { useLoginStore } from "@/store/Login";
import dayjs from "dayjs";

export const UpdateSchool = ({ themeColor }) => {
  const [stdPhoto, setStdPhoto] = useState(null);
  const [principalSignature, setPrincipalSignature] = useState(null);
  const [examCoordinatorSignature, setExamCoordinatorSignature] =
    useState(null);
  const [inputValue, setInputValue] = useState();
  const { findMeAction, userLoginStatus, userLogin, resetStatus } =
    useLoginStore((s) => ({
      findMeAction: s.findMeAction,
      userLoginStatus: s.userLoginStatus,
      userLogin: s.userLogin,
      resetStatus: s.resetLoginStatus,
    }));

  const school = getLocalStorageItem("user");

  useEffect(() => {
    setInputValue({
      ...school?.schoolData,
    });
    return () => {};
  }, []);

  useEffect(() => {
    if (userLoginStatus === STATUS.SUCCESS && userLogin) {
      resetStatus();
      if (
        dayjs(userLogin?.schoolData?.expireDate).format("YYYY-MM-DD") >
        dayjs().format("YYYY-MM-DD")
      ) {
        setLocalStorageItem("bulkMessageStatus", userLogin?.bulkMessageStatus);
        setLocalStorageItem("user", userLogin);
        setLocalStorageItem("sessionMasterId", userLogin?.sessionData?.id);
        setLocalStorageItem("sessionMaster", userLogin?.sessionData);
        setLocalStorageItem("themeColor", "blue");
        setLocalStorageItem("masterCheck", userLogin?.masterCheck);
        window.location.reload();
      } else {
        setToggleRenewal(true);
      }
    }
  }, [userLoginStatus]);

  const inputHandler = (name, val) => {
    setInputValue((prev) => ({ ...prev, [name]: val }));
  };

  const inputRef = useRef(null);
  const principalSigRef = useRef(null);
  const examSigRef = useRef(null);

  const labelClick = () => inputRef.current.click();
  const principalSigClick = () => principalSigRef.current.click();
  const examSigClick = () => examSigRef.current.click();

  const selectedFile = (file) => {
    if (file?.length) {
      setInputValue((prev) => ({ ...prev, logo: file[0] }));
      setStdPhoto(file[0]);
    }
  };

  const selectedPrincipalSig = (file) => {
    if (file?.length) {
      setInputValue((prev) => ({ ...prev, principalSignature: file[0] }));
      setPrincipalSignature(file[0]);
    }
  };

  const selectedExamSig = (file) => {
    if (file?.length) {
      setInputValue((prev) => ({ ...prev, examCoordinatorSignature: file[0] }));
      setExamCoordinatorSignature(file[0]);
    }
  };

  const { updateSchoolAction, updateSchoolStatus } = useAdminStore((s) => ({
    updateSchoolAction: s.updateSchoolAction,
    updateSchoolStatus: s.updateSchoolStatus,
  }));

  const {
    getStateAction,
    getStateStatus,
    allStates,
    getDistrictAction,
    getDistrictStatus,
    allDistricts,
  } = useCommonStore((s) => ({
    getStateAction: s.getStateAction,
    getStateStatus: s.getStateStatus,
    allStates: s.allStates,
    getDistrictAction: s.getDistrictAction,
    getDistrictStatus: s.getDistrictStatus,
    allDistricts: s.allDistricts,
  }));

  useEffect(() => {
    if ((getStateStatus || 1) === STATUS.NOT_STARTED) {
      getStateAction();
    }
  }, [getStateAction, getStateStatus]);

  useEffect(() => {
    const selectedState = inputValue?.state;
    if (selectedState && selectedState !== "") {
      const stateId = find(
        allStates,
        (state) => state.SName === selectedState
      )?.id;
      if (stateId) {
        getDistrictAction(stateId);
      }
    }
  }, [inputValue?.state, allStates, getDistrictAction]);

  const getDistrict = (name, val) => {
    getDistrictAction(find(allStates, (state) => state.SName === val)?.id);
    inputHandler(name, val);
  };

  const submitDetails = (e) => {
    e.preventDefault();
    updateSchoolAction(inputValue);
  };

  const bgColor = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  useEffect(() => {
    if (updateSchoolStatus === STATUS.SUCCESS) {
      findMeAction();
    }
    return () => {};
  }, [updateSchoolStatus]);

  return (
    <ScaleFade initialScale={0.95} in={true}>
      <Box h="100%" p={{ base: 4, md: 6 }} bg={bgColor}>
        <Box
          bg={cardBg}
          borderRadius="2xl"
          boxShadow={`0 6px 12px ${themeColor}.100`}
          maxH="80vh"
          overflowY="auto"
          className="scrollBar"
          p={{ base: 4, md: 6 }}
        >
          <form onSubmit={submitDetails}>
            <VStack spacing={6} align="stretch">
              {/* Header */}

              {/* Logo and Signatures Section */}
              <Box>
                <Flex
                  flexWrap="wrap"
                  gap={1}
                  align="center"
                  justify="space-around"
                >
                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color={textColor}
                      mb={2}
                    >
                      School Logo
                    </Text>
                    <Flex pos="relative" align="center">
                      <Avatar
                        size="xl"
                        onClick={labelClick}
                        cursor="pointer"
                        src={
                          stdPhoto
                            ? URL.createObjectURL(stdPhoto)
                            : inputValue?.logo
                            ? `${FILE_URL}${inputValue.logo}`
                            : undefined
                        }
                        showBorder
                        borderColor={`${themeColor}.400`}
                        bg="gray.100"
                        _hover={{
                          borderColor: `${themeColor}.500`,
                          boxShadow: `0 0 0 3px ${themeColor}.200`,
                        }}
                        transition="all 0.2s"
                      />
                      <Flex
                        pos="absolute"
                        onClick={labelClick}
                        cursor="pointer"
                        p={2}
                        bottom={0}
                        right={0}
                        borderRadius="full"
                        bg={`${themeColor}.600`}
                        color="white"
                        _hover={{ bg: `${themeColor}.700` }}
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

                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color={textColor}
                      mb={2}
                    >
                      Principal Signature
                    </Text>
                    <Flex pos="relative" align="center">
                      <Avatar
                        size="xl"
                        src={
                          principalSignature
                            ? URL.createObjectURL(principalSignature)
                            : inputValue?.principalSignature
                            ? `${FILE_URL}${inputValue.principalSignature}`
                            : undefined
                        }
                        cursor="pointer"
                        onClick={principalSigClick}
                        border="2px solid"
                        borderColor={`${themeColor}.300`}
                        bg="gray.100"
                        _hover={{
                          borderColor: `${themeColor}.500`,
                          boxShadow: `0 0 0 3px ${themeColor}.200`,
                        }}
                        transition="all 0.2s"
                      />
                      <Flex
                        pos="absolute"
                        onClick={principalSigClick}
                        cursor="pointer"
                        p={1.5}
                        bottom={0}
                        right={0}
                        borderRadius="full"
                        bg={`${themeColor}.600`}
                        color="white"
                        _hover={{ bg: `${themeColor}.700` }}
                      >
                        <AddIcon boxSize={2.5} />
                      </Flex>
                    </Flex>
                    <Input
                      ref={principalSigRef}
                      type="file"
                      accept="image/*"
                      display="none"
                      onChange={(e) => selectedPrincipalSig(e.target.files)}
                    />
                  </Box>

                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color={textColor}
                      mb={2}
                    >
                      Exam Coordinator Signature
                    </Text>
                    <Flex pos="relative" align="center">
                      <Avatar
                        size="xl"
                        src={
                          examCoordinatorSignature
                            ? URL.createObjectURL(examCoordinatorSignature)
                            : inputValue?.examCoordinatorSignature
                            ? `${FILE_URL}${inputValue.examCoordinatorSignature}`
                            : undefined
                        }
                        cursor="pointer"
                        onClick={examSigClick}
                        border="2px solid"
                        borderColor={`${themeColor}.300`}
                        bg="gray.100"
                        _hover={{
                          borderColor: `${themeColor}.500`,
                          boxShadow: `0 0 0 3px ${themeColor}.200`,
                        }}
                        transition="all 0.2s"
                      />
                      <Flex
                        pos="absolute"
                        onClick={examSigClick}
                        cursor="pointer"
                        p={1.5}
                        bottom={0}
                        right={0}
                        borderRadius="full"
                        bg={`${themeColor}.600`}
                        color="white"
                        _hover={{ bg: `${themeColor}.700` }}
                      >
                        <AddIcon boxSize={2.5} />
                      </Flex>
                    </Flex>
                    <Input
                      ref={examSigRef}
                      type="file"
                      accept="image/*"
                      display="none"
                      onChange={(e) => selectedExamSig(e.target.files)}
                    />
                  </Box>
                </Flex>
              </Box>

              <Divider
                borderColor={`${themeColor}.200`}
                borderWidth="2px"
                borderRadius="full"
                my={4}
              />
              <Box>
                <Text fontSize="md" fontWeight="bold" color={textColor} mb={3}>
                  School Information
                </Text>
                <Flex flexWrap="wrap" gap={2} justify="space-between">
                  <CustomInput
                    type="text"
                    name="name"
                    label="Name of School/Institute"
                    disabled
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    w={{ base: "100%", md: "19%" }}
                    focusBorderColor={`${themeColor}.400`}
                    bg={inputValue?.name ? "gray.50" : "white"}
                    _disabled={{ opacity: 0.7, cursor: "not-allowed" }}
                  />
                  <CustomInput
                    type="text"
                    notRequire={true}
                    name="regNo"
                    label="Registration No."
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    w={{ base: "100%", md: "19%" }}
                    focusBorderColor={`${themeColor}.400`}
                  />

                  <CustomInput
                    type="text"
                    notRequire={true}
                    name="affiliationNo"
                    label="Affiliation No."
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    w={{ base: "100%", md: "19%" }}
                    focusBorderColor={`${themeColor}.400`}
                  />
                  <CustomInput
                    type="text"
                    notRequire={true}
                    name="diseCode"
                    label="Dise Code/School Code"
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    w={{ base: "100%", md: "19%" }}
                    focusBorderColor={`${themeColor}.400`}
                  />
                  <CustomInput
                    type="number"
                    notRequire={true}
                    name="telephoneNo"
                    label="Telephone No."
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    w={{ base: "100%", md: "19%" }}
                    focusBorderColor={`${themeColor}.400`}
                  />
                  <CustomTextarea
                    rows={2}
                    type="text"
                    notRequire={true}
                    // disabled
                    name="address"
                    label="Address"
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    w={{ base: "100%", md: "100%" }}
                    focusBorderColor={`${themeColor}.400`}
                    bg={inputValue?.address ? "gray.50" : "white"}
                    // _disabled={{ opacity: 0.7, cursor: "not-allowed" }}
                  />
                </Flex>
              </Box>

              <Divider
                borderColor={`${themeColor}.200`}
                borderWidth="2px"
                borderRadius="full"
                my={2}
              />

              {/* Contact and Affiliation Section */}
              <Box>
                <Text fontSize="md" fontWeight="bold" color={textColor} mb={2}>
                  Contact & Affiliation Details
                </Text>
                <Flex flexWrap="wrap" gap={4} justify="space-between">
                  <CustomInput
                    type="number"
                    name="mobileNo"
                    limit={10}
                    label="Mobile No."
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    w={{ base: "100%", md: "15%" }}
                    focusBorderColor={`${themeColor}.400`}
                  />
                  <CustomInput
                    type="email"
                    name="email"
                    label="Email"
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    w={{ base: "100%", md: "15%" }}
                    focusBorderColor={`${themeColor}.400`}
                  />
                  <CustomInput
                    type="text"
                    notRequire={true}
                    name="website"
                    label="Website"
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    w={{ base: "100%", md: "15%" }}
                    focusBorderColor={`${themeColor}.400`}
                  />
                  <CustomInput
                    type="text"
                    notRequire={true}
                    name="board"
                    label="Board/University"
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    w={{ base: "100%", md: "15%" }}
                    focusBorderColor={`${themeColor}.400`}
                  />
                  <Select
                    w={{ base: "100%", md: "15%" }}
                    // disabled
                    fontSize="sm"
                    color={`${themeColor}.800`}
                    fontWeight="medium"
                    focusBorderColor={`${themeColor}.400`}
                    placeholder="Select State"
                    value={inputValue?.state}
                    onChange={(e) => getDistrict("state", e.target.value)}
                    bg={inputValue?.state ? "gray.50" : "white"}
                    // _disabled={{ opacity: 0.7, cursor: "not-allowed" }}
                    _hover={{ borderColor: `${themeColor}.300` }}
                  >
                    {map(allStates, (state) => (
                      <option key={state.id} value={state.SName}>
                        {state.SName}
                      </option>
                    ))}
                  </Select>
                  <Select
                    w={{ base: "100%", md: "15%" }}
                    // disabled
                    fontSize="sm"
                    color={`${themeColor}.800`}
                    fontWeight="medium"
                    focusBorderColor={`${themeColor}.400`}
                    placeholder="Select District"
                    value={inputValue?.district}
                    onChange={(e) => inputHandler("district", e.target.value)}
                    bg={inputValue?.district ? "gray.50" : "white"}
                    // _disabled={{ opacity: 0.7, cursor: "not-allowed" }}
                    _hover={{ borderColor: `${themeColor}.300` }}
                  >
                    {getDistrictStatus === STATUS.FETCHING ? (
                      <option value="">Loading...</option>
                    ) : (
                      map(allDistricts, (dis) => (
                        <option key={dis.id} value={dis.DistrictName}>
                          {dis.DistrictName}
                        </option>
                      ))
                    )}
                  </Select>
                </Flex>
              </Box>

              {/* Submit Button */}
              <Flex justify="flex-end" mt={6}>
                <Button
                  size="lg"
                  isLoading={updateSchoolStatus === STATUS.FETCHING}
                  colorScheme={themeColor}
                  type="submit"
                  borderRadius="full"
                  px={8}
                  bg={`${themeColor}.600`}
                  _hover={{
                    bg: `${themeColor}.700`,
                    transform: "scale(1.05)",
                    boxShadow: `0 4px 8px ${themeColor}.200`,
                  }}
                  transition="all 0.3s"
                >
                  Update School
                </Button>
              </Flex>
            </VStack>
          </form>
        </Box>
      </Box>
    </ScaleFade>
  );
};
