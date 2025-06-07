import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { useAdminBankStore } from "@/store/Banks";
import { useClassSetupStore } from "@/store/classSetup";
import { useFeesSetupStore } from "@/store/feesSetup";
import { useStudentStore } from "@/store/studentStore";
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
  Flex,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { groupBy, map, uniqBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";

export const AddNewEnquiry = ({
  data,
  closeDrawer,
  sessionMasterId,
  themeColor,
}) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,
          classMasterId: data.classMasterId,
          streamMasterId: data.streamMasterId,
          date: dayjs(data.date).format("YYYY-MM-DD"),
          name: data.name,
          contact: data.contact,
          fatherName: data.fatherName,
          fatherContact: data.fatherContact,
          motherName: data.motherName,
          motherContact: data.motherContact,
          address: data.address,
          remark: data.remark,
          sessionMasterId: sessionMasterId,
          brocherAmount: Number(data.brocherAmount),
          discount: data.discount,
          lateFees: data.lateFees,
          type: data.type,
        }
      : {
          sessionMasterId: sessionMasterId,
          fatherContact: data.contact,
          date: dayjs().format("YYYY-MM-DD"),
          classMasterId: "",
          streamMasterId: "",
          name: "",
          contact: "",
          fatherName: "",
          motherName: "",
          motherContact: "",
          address: "",
          remark: "",
          brocherAmount: 0,
          discount: 0,
          lateFees: 0,
          type: "Cash",
        }
  );

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  const {
    addEnquiryAction,
    addEnquiryStatus,
    resetAddEnquiry,
    editEnquiryAction,
    editEnquiryStatus,
    getEnquiryAction,
  } = useStudentStore((s) => ({
    getEnquiryAction: s.getEnquiryAction,
    addEnquiryAction: s.addEnquiryAction,
    addEnquiryStatus: s.addEnquiryStatus,
    resetAddEnquiry: s.resetAddEnquiry,
    editEnquiryAction: s.editEnquiryAction,
    editEnquiryStatus: s.editEnquiryStatus,
  }));

  const {
    getClassDetailAction,
    getClassDetailStatus,
    allClassDetails,
    getClassSubjectAction,
    getClassSubjectStatus,
    allClassSubjects,
  } = useClassSetupStore((s) => ({
    getClassDetailAction: s.getClassDetailAction,
    getClassDetailStatus: s.getClassDetailStatus,
    allClassDetails: s.allClassDetails,
    getClassSubjectAction: s.getClassSubjectAction,
    getClassSubjectStatus: s.getClassSubjectStatus,
    allClassSubjects: s.allClassSubjects,
  }));

  const { getBrocherFeesAction, getBrocherFeesStatus, brocherFees } =
    useFeesSetupStore((s) => ({
      getBrocherFeesAction: s.getBrocherFeesAction,
      getBrocherFeesStatus: s.getBrocherFeesStatus,
      brocherFees: s.brocherFees,
    }));

  useEffect(() => {
    if ((getBrocherFeesStatus || 1) === STATUS.NOT_STARTED) {
      getBrocherFeesAction();
    }
  }, [getBrocherFeesAction, getBrocherFeesStatus]);

  useEffect(() => {
    if ((getClassDetailStatus || 1) === STATUS.NOT_STARTED) {
      getClassDetailAction();
    }
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
  }, [
    getClassDetailAction,
    getClassDetailStatus,
    getClassSubjectAction,
    getClassSubjectStatus,
  ]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const addEnquiry = (e) => {
    e.preventDefault();
    if (data?.id) {
      editEnquiryAction(inputValue);
    } else {
      addEnquiryAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addEnquiryStatus === STATUS.SUCCESS ||
      editEnquiryStatus === STATUS.SUCCESS
    ) {
      resetAddEnquiry();
      getEnquiryAction({
        type: "all",
        userId: "all",
        sessionMasterId,
        fatherContact: data.contact,
      });
      closeDrawer();
    }
  }, [addEnquiryStatus, closeDrawer, editEnquiryStatus, resetAddEnquiry]);
  // const collectFees = (e) => {
  //   e.preventDefault();
  //   const feesType =
  //     inputValue?.feesType === "transport-fees"
  //       ? transportFeesDetails
  //       : studentFeesDetails;
  //   let remainingAmount = inputValue?.amount || 0;
  //   let remainingDiscount = inputValue?.discount || 0;
  //   let remainingLateFees = inputValue?.lateFees || 0;

  //   const feesDetail = feesType.map((f) => {
  //     const fee = Math.min(remainingAmount, f.amount);
  //     remainingAmount -= fee;
  //     const dis = Math.min(remainingDiscount, f.amount - fee);
  //     remainingDiscount -= dis;
  //     const lateFee = Math.min(remainingLateFees, f.lateFees || 0);
  //     remainingLateFees -= lateFee;

  //     return {
  //       studentFeesId: f.id,
  //       amount: fee,
  //       discount: dis,
  //       lateFees: lateFee,
  //     };
  //   });
  // };
  const { getBankAction, getBankStatus, allBanks } = useAdditionalSetupStore(
    (s) => ({
      getBankAction: s.getBankAction,
      getBankStatus: s.getBankStatus,
      allBanks: s.allBanks,
    })
  );

  useEffect(() => {
    if ((getBankStatus || 1) === STATUS.NOT_STARTED) {
      getBankAction();
    }
  }, [getBankAction, getBankStatus]);
  const { getAdminBankAction, getAdminBanksStatus, allAdminBanks } =
    useAdminBankStore((s) => ({
      getAdminBankAction: s.getAdminBankAction,
      getAdminBanksStatus: s.getAdminBanksStatus,
      allAdminBanks: s.allAdminBanks,
    }));

  useEffect(() => {
    if ((getAdminBanksStatus || 1) === STATUS.NOT_STARTED) {
      getAdminBankAction();
    }
  }, [getAdminBankAction, getAdminBanksStatus]);
  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addEnquiry}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Enquiry" : "Add New Enquiry"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3} w="100%">
              <Flex w="100%" align={"baseline"} justify={"space-between"}>
                <Box w="49%">
                  <CustomSelect
                    style={{
                      marginBottom: "10px",
                    }}
                    name={"classMasterId"}
                    label={"Select Class"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    data={map(classes, (d, key) => ({
                      value: key,
                      name: d?.[0]?.class_master?.name,
                    }))}
                  />
                  <CustomSelect
                   style={{
                    marginBottom: "10px",
                  }}
                    name={"streamMasterId"}
                    label={"Select Stream"}
                    notRequire={true}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    data={map(
                      uniqBy(
                        classes?.[inputValue?.classMasterId],
                        "streamMasterId"
                      ),
                      (d, index) => ({
                        value: d.stream_master.id,
                        name: d.stream_master.name,
                      })
                    )}
                  />
                     <CustomInput
                    type={"text"}
                    name="formNo"
                    label={"Form No."}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                </Box>
                <Box w="49%">
                  <CustomInput
                    type={"date"}
                    name="date"
                    label={"Enquiry Date"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
               
                  {brocherFees !== null && (
                    <Flex
                      mt={5}
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      bg="white"
                      shadow="sm"
                      _hover={{
                        shadow: "md",
                        borderColor: "blue.200",
                      }}
                      transition="all 0.2s"
                      cursor="pointer"
                    >
                      <Checkbox
                        isChecked={inputValue.brocherAmount ? true : false}
                        onChange={(e) =>
                          inputHandler(
                            "brocherAmount",
                            inputValue.brocherAmount ? 0 : brocherFees?.amount
                          )
                        }
                        colorScheme="blue"
                        size="lg"
                      >
                        <Flex direction="column">
                          <Text fontWeight="bold" color="gray.700">
                            {brocherFees?.name}
                          </Text>
                          <Text
                            color="blue.500"
                            fontSize="lg"
                            fontWeight="semibold"
                          >
                            ₹{brocherFees?.amount}
                          </Text>
                        </Flex>
                      </Checkbox>
                    </Flex>
                  )}
                </Box>
              </Flex>
              {inputValue.brocherAmount && (
                <Flex w="100%" align={"baseline"} justify={"space-between"}>
                  <Flex w={"100%"} gap={3} flexWrap={"wrap"}>
                    <Select
                      w={
                        inputValue?.type && inputValue?.type !== "cash"
                          ? { lg: "47%", xl: "48.5%" }
                          : "100%"
                      }
                      size="md"
                      isRequired
                      fontSize={13}
                      fontWeight={"bold"}
                      color={"blue.800"}
                      focusBorderColor={`${themeColor}.400`}
                      placeholder="Select Payment Mode"
                      value={inputValue?.type}
                      onChange={(e) => inputHandler("type", e.target.value)}
                    >
                      <option value={"Cash"}>Cash</option>
                      <option value={"NetBanking"}>Net Banking</option>
                      <option value={"Upi"}>UPI</option>
                      <option value={"CreditCard"}>Credit Card</option>
                      <option value={"DebitCard"}>Debit Card</option>
                      <option value={"PaymentGateway"}>Payment Gateway</option>
                      <option value={"Other"}>Other</option>
                    </Select>
                    {inputValue?.type ? (
                      inputValue?.type === "Cash" ? (
                        <></>
                      ) : inputValue?.type === "Cheque" ? (
                        <>
                          <Select
                            w={{ lg: "47%", xl: "48.5%" }}
                            size="md"
                            isRequired
                            fontSize={13}
                            fontWeight={"bold"}
                            color={"blue.800"}
                            focusBorderColor={`${themeColor}.400`}
                            placeholder="Select Bank Name"
                            value={inputValue?.bank}
                            onChange={(e) =>
                              inputHandler("bank", e.target.value)
                            }
                          >
                            {map(allAdminBanks, (bank) => (
                              <option value={bank.name}>{bank.name}</option>
                            ))}
                          </Select>
                          {/* <CustomInput w={{lg:"47%",xl:"48.5%"}} type={"text"} name="bank" label={"Bank Details"} inputValue={inputValue} setInputValue={setInputValue} /> */}
                          <CustomInput
                            w={{ lg: "47%", xl: "48.5%" }}
                            type={"text"}
                            name="chequeNo"
                            label={"Cheque No./DD"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomInput
                            w={{ lg: "47%", xl: "48.5%" }}
                            type={"date"}
                            name="chequeDate"
                            label={"Cheque Date"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                        </>
                      ) : (
                        <>
                          <CustomInput
                            w={{ lg: "47%", xl: "48.5%" }}
                            type={"text"}
                            name="transitionNo"
                            label={"Transaction No."}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <CustomInput
                            w={{ lg: "47%", xl: "48.5%" }}
                            type={"date"}
                            name="transactionDate"
                            label={"Transaction Date"}
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                          />
                          <Select
                            w={{ lg: "47%", xl: "48.5%" }}
                            size="md"
                            isRequired
                            fontSize={13}
                            fontWeight={"bold"}
                            color={"blue.800"}
                            focusBorderColor={`${themeColor}.400`}
                            placeholder="Select Transfer Bank"
                            value={inputValue?.ledgerMasterId}
                            onChange={(e) =>
                              inputHandler("ledgerMasterId", e.target.value)
                            }
                          >
                            {map(allBanks, (bank) => (
                              <option value={bank.id}>
                                {bank.name + " - " + bank.accountNumber}
                              </option>
                            ))}
                          </Select>
                        </>
                      )
                    ) : (
                      <></>
                    )}
                  </Flex>
                </Flex>
              )}

              <Text w="100%" textAlign={"left"} mt={5} fontWeight={"semibold"}>
                Student Details
              </Text>
              <Flex
                flexWrap={"wrap"}
                justify={"space-between"}
                align={"center"}
                gap={3}
              >
                <CustomInput
                  w={"49%"}
                  type={"text"}
                  name="name"
                  label={"Student Name"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                {/* <CustomInput w={"49%"} type={"number"} name="contact" notRequire={true} label={"Student Contact"} inputValue={inputValue} setInputValue={setInputValue} /> */}
                <CustomInput
                  w={"49%"}
                  type={"text"}
                  name="fatherName"
                  label={"Father's Name"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomInput
                  w={"49%"}
                  type={"number"}
                  name="fatherContact"
                  limit={10}
                  label={"Father's Contact"}
                  inputValue={inputValue}
                  setInputValue={data?.id ? setInputValue : console.log()}
                />
                <CustomInput
                  w={"49%"}
                  type={"text"}
                  name="motherName"
                  notRequire={true}
                  label={"Mother's Name"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomInput
                  w={"49%"}
                  type={"number"}
                  name="motherContact"
                  limit={10}
                  notRequire={true}
                  label={"Mother's Contact"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomTextarea
                  w={"100%"}
                  type={"text"}
                  name="address"
                  label={"Address"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomTextarea
                  w={"100%"}
                  type={"text"}
                  name="remark"
                  notRequire={true}
                  label={"Remark"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
              </Flex>
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
              colorScheme={themeColor}
              type="submit"
              isLoading={
                addEnquiryStatus === STATUS.FETCHING ||
                editEnquiryStatus === STATUS.FETCHING
              }
            >
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
