import CustomInput from "@/common/CustomInput";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { differenceBy, filter, groupBy, map, orderBy, uniqBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { MdCurrencyRupee, MdPercent } from "react-icons/md";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/react";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { useFeesSetupStore } from "@/store/feesSetup";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import dayjs from "dayjs";
import { CustomSelect } from "@/common/CustomSelect";

export const AddAssignFees = ({
  data,
  allAssignFees,
  closeDrawer,
  themeColor,
  sessionMasterId,
}) => {
  const sessionMaster = useMemo(() => getLocalStorageItem("sessionMaster"), []);
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,
          isPercent: data.isPercent.toString(),
          classMasterId: data.classMasterId,
          streamMasterId: data.streamMasterId,
          feesNameMasterId: data.feesNameMasterId,
          feesGroupMasterId: data.feesGroupMasterId,
          feeAmount: data.feeAmount,
          dueDate: dayjs(data.dueDate).format("YYYY-MM-DD"),
          lateFees: data.lateFees,
          isDaily: data.isDaily.toString(),
          isLateFees: data.lateFees ? data.lateFees : false,
          sessionMasterId: data.sessionMasterId,
        }
      : {
          isPercent: "0",
          dueDate: dayjs(sessionMaster.endDate).format("YYYY-MM-DD"),
          feesGroupMasterId: 1,
        }
  );
  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };


  const {
    addAssignFeesAction,
    addAssignFeesStatus,
    updateAssignFeesAction,
    updateAssignFeesStatus,
    resetAssignFeesStatus,
    getFeesNameAction,
    getFeesNameStatus,
    allFeesNames,
  } = useFeesSetupStore((s) => ({
    addAssignFeesAction: s.addAssignFeesAction,
    addAssignFeesStatus: s.addAssignFeesStatus,
    updateAssignFeesAction: s.updateAssignFeesAction,
    updateAssignFeesStatus: s.updateAssignFeesStatus,
    resetAssignFeesStatus: s.resetAssignFeesStatus,
    getFeesNameAction: s.getFeesNameAction,
    getFeesNameStatus: s.getFeesNameStatus,
    allFeesNames: s.allFeesNames,
  }));

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
    if ((getFeesNameStatus || 1) === STATUS.NOT_STARTED) {
      getFeesNameAction({ sessionMasterId: 3 });
    }
  }, [
    getClassSubjectAction,
    getClassSubjectStatus,
    getFeesNameAction,
    getFeesNameStatus,
  ]);

  const feesNames = useMemo(() => {
    return map(allFeesNames, (f) => ({ ...f, feesNameMasterId: f.id }));
  }, [allFeesNames]);

  const existedData = useMemo(() => {
    return inputValue?.streamMasterId
      ? groupBy(
          groupBy(allAssignFees, "classMasterId")[inputValue?.classMasterId],
          "streamMasterId"
        )
      : {};
  }, [allAssignFees, inputValue?.classMasterId, inputValue?.streamMasterId]);

  const submitAssignFees = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateAssignFeesAction({
        ...inputValue,
        sessionMasterId,
        lateFees: inputValue.lateFees || 0,
        isPercent: inputValue.isPercent || "0",
        isDaily: inputValue.isDaily || "0",
        isUpdate: inputValue.isUpdate === "2" ? "1" : inputValue.isUpdate,
      });
    } else {
      addAssignFeesAction({
        ...inputValue,
        sessionMasterId,
        lateFees: inputValue.lateFees || 0,
        isPercent: inputValue.isPercent || "0",
        isDaily: inputValue.isDaily || "0",
        isUpdate: inputValue.isUpdate === "2" ? "1" : inputValue.isUpdate,
      });
    }
  };

  useEffect(() => {
    if (
      addAssignFeesStatus === STATUS.SUCCESS ||
      updateAssignFeesStatus === STATUS.SUCCESS
    ) {
      resetAssignFeesStatus();
      if (data?.id) {
        closeDrawer();
      } else {
        setInputValue({
          classMasterId: inputValue.classMasterId,
          streamMasterId: inputValue.streamMasterId,
          isPercent: "0",
          dueDate: dayjs(sessionMaster.endDate).format("YYYY-MM-DD"),
          feesGroupMasterId: 1,
        });
      }
    }
  }, [
    addAssignFeesStatus,
    closeDrawer,
    data?.id,
    inputValue.classMasterId,
    inputValue.streamMasterId,
    resetAssignFeesStatus,
    sessionMaster,
    updateAssignFeesStatus,
  ]);
  const {
    getClassAction,
    getClassStatus,
    allClasses,
    getStreamStatus,
    allStreams,
    getStreamAction,
  } = useClassSetupStore((s) => ({
    getClassAction: s.getClassAction,
    getStreamStatus: s.getStreamStatus,
    getClassStatus: s.getClassStatus,
    allClasses: s.allClasses,
    getStreamAction: s.getStreamAction,
    allStreams: s.allStreams,
  }));
  useEffect(() => {
    if ((getStreamStatus || 1) === STATUS.NOT_STARTED) {
      getStreamAction();
    }
  }, [getStreamAction, getStreamStatus]);
  useEffect(() => {
    if ((getClassStatus || 1) === STATUS.NOT_STARTED) {
      getClassAction();
    }
  }, [getClassAction, getClassStatus]);

  const Classdata = map(orderBy(allClasses, "orderNo", "asc"), (c, index) => ({
    value: c.id,
    name: c.name,
  }));

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitAssignFees}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Assigned Fees" : "Assign Fees"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomSelect
                size={"sm"}
                name={"classMasterId"}
                label={"Select Class"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={Classdata}
              />
              <CustomSelect
                size={"sm"}
                name={"streamMasterId"}
                label={"Select Stream"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(allStreams, (d, index) => ({
                  value: d.id,
                  name: d.name,
                }))}
              />
              <Select
                size="sm"
                isRequired
                fontSize={13}
                fontWeight={"bold"}
                color={"blue.800"}
                focusBorderColor={`${themeColor}.400`}
                placeholder="Select Fees Name"
                value={inputValue?.feesNameMasterId}
                onChange={(e) =>
                  inputHandler("feesNameMasterId", e.target.value)
                }
              >
                {map(
                  differenceBy(
                    feesNames,
                    filter(
                      existedData[inputValue?.streamMasterId],
                      (ex) => ex.feesNameMasterId !== data.feesNameMasterId
                    ),
                    "feesNameMasterId"
                  ),
                  (fee) =>
                    fee.id === 1 ? null : (
                      <option
                        style={{ fontWeight: "bold", fontSize: "14px" }}
                        value={fee.id}
                      >
                        {fee.name}
                      </option>
                    )
                )}
              </Select>
              <CustomInput
                size={"sm"}
                type={"number"}
                name="feeAmount"
                label={"Fees Amount"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                size={"sm"}
                type={"date"}
                name="dueDate"
                label={"Select Due Date"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <Checkbox
                size="sm"
                colorScheme={themeColor}
                w="100%"
                defaultChecked={data?.lateFees}
                isChecked={inputValue?.isLateFees}
                onChange={(e) => inputHandler("isLateFees", e.target.checked)}
              >
                <Text fontSize="sm" color="gray.700">
                  Late Fees Apply
                </Text>
              </Checkbox>

              {inputValue?.isLateFees ? (
                <>
                  <InputGroup size="md">
                    <CustomInput
                      size={"sm"}
                      type={"number"}
                      min={1}
                      name="lateFees"
                      label={"Late Fees Amount"}
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                    />
                    <InputRightElement>
                      <Popover>
                        <PopoverTrigger>
                          <Button
                            mr={8}
                            mt={-2}
                            _hover={"none"}
                            variant={"ghost"}
                            leftIcon={
                              inputValue?.isPercent === "1" ? (
                                <MdPercent style={{ marginLeft: 10 }} />
                              ) : (
                                <MdCurrencyRupee style={{ marginLeft: 10 }} />
                              )
                            }
                            rightIcon={
                              <ChevronDownIcon
                                boxSize={5}
                                mr={2}
                                _hover={{ bg: "gray.100" }}
                              />
                            }
                          />
                        </PopoverTrigger>
                        <PopoverContent w="65px">
                          <PopoverBody>
                            <Text
                              px={2}
                              py={1}
                              mt={1}
                              border={"1px solid"}
                              borderColor={"gray.200"}
                              _hover={{
                                bg: `${themeColor}.400`,
                                color: "white",
                              }}
                              onClick={() => inputHandler("isPercent", "0")}
                            >
                              <MdCurrencyRupee />
                            </Text>
                            <Text
                              px={2}
                              py={1}
                              mt={1}
                              border={"1px solid"}
                              borderColor={"gray.200"}
                              _hover={{
                                bg: `${themeColor}.400`,
                                color: "white",
                              }}
                              onClick={() => inputHandler("isPercent", "1")}
                            >
                              <MdPercent />
                            </Text>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </InputRightElement>
                  </InputGroup>
                  {inputValue?.lateFees ? (
                    <RadioGroup
                      size="sm"
                      w="100%"
                      onChange={(e) => inputHandler("isDaily", e)}
                      value={inputValue?.isDaily}
                    >
                      <HStack
                        spacing={2}
                        align="start"
                        bg="gray.50"
                        p={4}
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        boxShadow="sm"
                      >
                        <Radio value="1" size="sm" colorScheme={themeColor}>
                          <Text fontSize="sm" color="gray.700">
                            Daily
                          </Text>
                        </Radio>
                        <Radio value="0" size="sm" colorScheme={themeColor}>
                          <Text fontSize="sm" color="gray.700">
                            Monthly
                          </Text>
                        </Radio>
                      </HStack>
                    </RadioGroup>
                  ) : null}
                </>
              ) : null}
              {data?.id ? (
                <RadioGroup
                  size="sm"
                  w="100%"
                  fontWeight="medium"
                  onChange={(e) => inputHandler("isUpdate", e)}
                  value={inputValue?.isUpdate}
                >
                  <VStack
                    spacing={2}
                    align="start"
                    bg="gray.50"
                    p={4}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    boxShadow="sm"
                  >
                    <Radio value="2" size="sm" colorScheme={themeColor}>
                      <Text fontSize="sm" color="gray.700">
                        Apply to All Students
                      </Text>
                    </Radio>
                    <Radio value="0" size="sm" colorScheme={themeColor}>
                      <Text fontSize="sm" color="gray.700">
                        Apply to New Students
                      </Text>
                    </Radio>
                  </VStack>
                </RadioGroup>
              ) : null}
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              size={"sm"}
              variant="outline"
              mr={3}
              colorScheme={"red"}
              onClick={closeDrawer}
            >
              Cancel
            </Button>
            <Button
              size={"sm"}
              type={"submit"}
              isLoading={
                addAssignFeesStatus === STATUS.FETCHING ||
                updateAssignFeesStatus === STATUS.FETCHING
              }
              colorScheme={themeColor}
            >
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
