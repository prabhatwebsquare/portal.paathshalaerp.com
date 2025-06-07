import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useCommonStore } from "@/store/CommonStore";
import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
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
  Text,
  VStack,
} from "@chakra-ui/react";
import { find, map } from "lodash";
import { useEffect, useRef, useState } from "react";
import CustomTextarea from "@/common/CustomTextarea";
import { CustomSelect } from "@/common/CustomSelect";

export const BasicDetails = ({
  themeColor,
  handleNextStep,
  inputValue,
  setInputValue,
  noButtons,
}) => {
  const [stdPhoto, setStdPhoto] = useState(null);

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

  const getDistrict = (name, val) => {
    getDistrictAction(find(allStates, (state) => state.SName === val)?.id);
    inputHandler(name, val);
  };

  const submitDetails = (e) => {
    e.preventDefault();
    handleNextStep();
  };

  return (
    <form onSubmit={submitDetails}>
      <VStack spacing={3} w="100%" p={5} mt={3}>
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
              type={"text"}
              name="schoolName"
              label={"Name of School/Institute"}
              autoFocus={true}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
            <Flex h={3} />
            <CustomInput
              type={"text"}
              notRequire={true}
              name="regNo"
              label={"Registration No."}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
          </Box>
          <Box w={"32%"}>
            <CustomTextarea
              rows={4}
              type={"text"}
              name="address"
              label={"Address"}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
          </Box>
        </Flex>
        <Flex w={"100%"} flexWrap={"wrap"} align={"center"} gap={3}>
          <CustomInput
            type={"text"}
            w={"32%"}
            notRequire={true}
            name="affNo"
            label={"Affiliation No."}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          <CustomInput
            type={"text"}
            w={"32%"}
            notRequire={true}
            name="diseCode"
            label={"Dise Code/School Code"}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          <CustomInput
            w={"32%"}
            type={"number"}
            notRequire={true}
            name="telephoneNo"
            label={"Telephone No."}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          <CustomInput
            w={"32%"}
            type={"number"}
            limit={10}
            name="contactNo"
            label={"Mobile No."}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          <CustomInput
            w={"32%"}
            type={"email"}
            name="schoolEmail"
            label={"Email"}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          <CustomInput
            w={"32%"}
            type={"text"}
            notRequire={true}
            name="website"
            label={"Website"}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          {/* <CustomInput w={"32%"} type={"text"} name="activationKey" label={"Activation Key"} inputValue={inputValue} setInputValue={setInputValue} /> */}
          <CustomInput
            w={"32%"}
            type={"text"}
            notRequire={true}
            name="board"
            label={"Board/University"}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          {/* <CustomInput w={"32%"} type={"text"} name="address" label={"Address"} inputValue={inputValue} setInputValue={setInputValue} /> */}
          <Select
            w="32%"
            isRequired
            fontSize={13}
            color={"blue.800"}
            fontWeight={"bold"}
            focusBorderColor={`${themeColor}.400`}
            placeholder="Select State"
            value={inputValue?.state}
            onChange={(e) => getDistrict("state", e.target.value)}
          >
            {map(allStates, (state) => (
              <option
                style={{ fontWeight: "bold", fontSize: "14px" }}
                value={state.SName}
              >
                {state.SName}
              </option>
            ))}
          </Select>
          <Select
            w="32%"
            isRequired
            fontSize={13}
            color={"blue.800"}
            fontWeight={"bold"}
            focusBorderColor={`${themeColor}.400`}
            placeholder="Select District"
            value={inputValue?.district}
            onChange={(e) => inputHandler("district", e.target.value)}
          >
            {getDistrictStatus === STATUS.FETCHING ? (
              <option
                style={{ fontWeight: "bold", fontSize: "14px" }}
                value={""}
              >
                Loading ...
              </option>
            ) : (
              map(allDistricts, (dis) => (
                <option
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  value={dis.DistrictName}
                >
                  {dis.DistrictName}
                </option>
              ))
            )}
          </Select>
          {noButtons ? (
            <CustomInput
              w={"32%"}
              type={"date"}
              name="expDate"
              label={"Expired Date"}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
          ) : null}
        </Flex>

        <Text
          w={"100%"}
          textAlign={"left"}
          my={4}
          fontSize={"xl"}
          color={`${themeColor}.600`}
          fontWeight={"bold"}
        >
          Login Details
        </Text>
        <Flex w={"100%"} flexWrap={"wrap"} align={"center"} gap={3}>
          <CustomInput
            w={"32%"}
            type={"text"}
            name="name"
            label={"Admin Name"}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          <CustomInput
            w={"32%"}
            type={"number"}
            name="mobileNo"
            limit={10}
            label={"Mobile No. use for login"}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          <CustomInput
            w={"32%"}
            type={"email"}
            notRequire={true}
            name="email"
            label={"Email"}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          {/* <CustomInput w={"32%"} type={"password"} name="password" label={"Password"} inputValue={inputValue} setInputValue={setInputValue} /> */}
        </Flex>
      </VStack>
      {noButtons ? null : (
        <Flex p={4} justify={"flex-end"}>
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
      )}
    </form>
  );
};
