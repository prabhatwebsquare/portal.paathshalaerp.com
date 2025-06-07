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
import { LoadingContainer } from "@/common/LoadingContainer";
import { useTransportStore } from "@/store/Transport";
import MultiSelectSelector from "@/common/MultiSelectSelector";

export const DefineFees = ({
  data,
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
          classMasterId: [data.classMasterId],
          streamMasterId: data.streamMasterId,
          feesNameMasterId: data.feesNameMasterId,
          feesGroupMasterId: data.feesGroupMasterId,
          feeAmount: data.feeAmount,
          dueDate: dayjs(data.dueDate).format("YYYY-MM-DD"),
          lateFees: data.lateFees,
          isDaily: data.isDaily.toString(),
          isLateFees: data.lateFees ? data.lateFees : false,
          sessionMasterId: data.sessionMasterId,
          isUpdate: data.isUpdate,
          stationMasterId: data.stationMasterId,
          transportFeeMasterId: data.transportFeeMasterId,
          isLateFees: data.isLateFees,
          dueDate: data.dueDate ? dayjs(data.dueDate).format("YYYY-MM-DD") : "",
        }
      : {
          isPercent: "0",
          dueDate: dayjs(sessionMaster.endDate).format("YYYY-MM-DD"),
          feesGroupMasterId: 1,
          isUpdate: "2",
        }
  );
  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  const {
    getStationAction,
    getStationStatus,
    allStations,
    getFeesHeadAction,
    getFeesHeadStatus,
    allFeesHeads,
    addFeesDefineAction,
    addFeesDefineStatus,
    resetFeesDefineStatus,
    updateFeesDefineAction,
    updateFeesDefineStatus,
  } = useTransportStore((s) => ({
    getStationAction: s.getStationAction,
    getStationStatus: s.getStationStatus,
    allStations: s.allStations,
    getFeesHeadAction: s.getFeesHeadAction,
    getFeesHeadStatus: s.getFeesHeadStatus,
    allFeesHeads: s.allFeesHeads,
    addFeesDefineAction: s.addFeesDefineAction,
    addFeesDefineStatus: s.addFeesDefineStatus,
    resetFeesDefineStatus: s.resetFeesDefineStatus,
    updateFeesDefineAction: s.updateFeesDefineAction,
    updateFeesDefineStatus: s.updateFeesDefineStatus,
  }));

  useEffect(() => {
    if ((getStationStatus || 1) === STATUS.NOT_STARTED) {
      getStationAction();
    }
    if ((getFeesHeadStatus || 1) === STATUS.NOT_STARTED) {
      getFeesHeadAction();
    }
  }, [
    getFeesHeadAction,
    getFeesHeadStatus,
    getStationAction,
    getStationStatus,
  ]);

  const assighFees = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateFeesDefineAction({
        ...inputValue,
        sessionMasterId,
        lateFees: inputValue.lateFees || 0,
        isPercent: inputValue.isPercent || "0",
        isDaily: inputValue.isDaily || "0",
        isUpdate: inputValue.isUpdate,
      });
    } else {
      addFeesDefineAction({
        ...inputValue,
        sessionMasterId,
        lateFees: inputValue.lateFees || 0,
        isPercent: inputValue.isPercent || "0",
        isDaily: inputValue.isDaily || "0",
        isUpdate: inputValue.isUpdate,
      });
    }
  };

  useEffect(() => {
    if (
      addFeesDefineStatus === STATUS.SUCCESS ||
      updateFeesDefineStatus === STATUS.SUCCESS
    ) {
      resetFeesDefineStatus();
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
    addFeesDefineStatus,
    closeDrawer,
    resetFeesDefineStatus,
    updateFeesDefineStatus,
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

  const Classdata = map(orderBy(allClasses, "orderNo", "asc"), (c) => ({
    value: c.id,
    name: c.name,
  }));

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer} size={"md"}>
      <DrawerOverlay />
      <form onSubmit={assighFees}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Fees Define" : "Fees Define"}
          </DrawerHeader>

          <DrawerBody>
            <LoadingContainer
              status={getStationStatus || getClassStatus || getFeesHeadStatus}
            >
              <VStack spacing={4}>
                <CustomSelect
                  size={"md"}
                  name={"stationMasterId"}
                  label={"Select Station"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(allStations, (stat, index) => ({
                    value: stat.id,
                    name: stat.name,
                  }))}
                />
                <CustomSelect
                  size={"md"}
                  name={"transportFeeMasterId"}
                  label={"Select Transport Fees"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(
                    filter(allFeesHeads, (f) => f.id !== 1),
                    (fee) => ({ value: fee.id, name: fee.name })
                  )}
                />
                <MultiSelectSelector
                  label="Select Class"
                  name="classMasterId"
                  options={Classdata}
                  selectedValues={inputValue.classMasterId}
                  setSelectedValues={(classMasterId) => {
                    if (classMasterId?.includes("all")) {
                      setInputValue((prev) => ({
                        ...prev,
                        classMasterId: "all",
                      }));
                    } else {
                      setInputValue((prev) => ({
                        ...prev,
                        classMasterId: classMasterId,
                      }));
                    }
                  }}
                />
                <CustomInput
                  size={"md"}
                  type={"number"}
                  name="feeAmount"
                  label={"Fees Amount"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomInput
                  size={"md"}
                  type={"date"}
                  name="dueDate"
                  label={"Select Due Date"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                {/* {data?.id ? ( */}
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
                {/* ) : null} */}
                <Checkbox
                  size="lg"
                  colorScheme={themeColor}
                  w="100%"
                  defaultChecked={data?.lateFees}
                  isChecked={inputValue?.isLateFees}
                  onChange={(e) => inputHandler("isLateFees", e.target.checked)}
                >
                  <Text fontSize="md" color="gray.700" ml={1}>
                    Late Fees
                  </Text>
                </Checkbox>

                {inputValue?.isLateFees ? (
                  <>
                    <InputGroup size="md">
                      <CustomInput
                        size={"md"}
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
              </VStack>
            </LoadingContainer>
          </DrawerBody>

          <DrawerFooter>
            <Button
              size={"md"}
              variant="outline"
              mr={3}
              colorScheme={"red"}
              onClick={closeDrawer}
            >
              Cancel
            </Button>
            <Button size={"md"} colorScheme={themeColor} type="submit">
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
