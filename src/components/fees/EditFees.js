import CustomInput from "@/common/CustomInput";
import CustomTextarea from "@/common/CustomTextarea";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useAdminBankStore } from "@/store/Banks";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { useClassSetupStore } from "@/store/classSetup";
import { useStdFeesStore } from "@/store/stdFees";
import { DeleteIcon } from "@chakra-ui/icons";
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
  IconButton,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { concat, filter, find, includes, map, reject, sumBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
export const EditFees = ({
  getData,
  themeColor,
  sessionMasterId,
  feesData,
  closeDrawer,
  isForTrasnport,
}) => {
  const [toggleHeadWise, setToggleHeadWise] = useState(true);

  const [inputFeesValue, setInputFeesValue] = useState({
    feesMode: isForTrasnport ? 2 : 1,
    feesType:
      feesData.feesTypeMasterId === 2 ? "transport-fees" : "school-fees",
    feesTypeMasterId: feesData?.feesTypeMasterId,
    feesReportId: feesData.id,
    type: feesData.type,
    sessionMasterId: feesData.sessionMasterId,
    remark: feesData.remark,
    bank: feesData.bank,
    chequeNo: feesData.chequeNo,
    chequeDate: feesData.chequeDate,
    transitionNo: feesData.transitionNo,
    transactionDate: feesData.transactionDate,
    ledgerMasterId: feesData.ledgerMasterId,
    date: feesData?.date ? dayjs(feesData?.date).format("YYYY-MM-DD") : "",
    amount: toggleHeadWise ? 0 : sumBy(feesData.fees_collects, "amount") || 0,
    discount: toggleHeadWise
      ? 0
      : sumBy(feesData.fees_collects, "discount") || 0,
    lateFees: toggleHeadWise
      ? 0
      : sumBy(feesData.fees_collects, "lateFees") || 0,
  });
  const [headFees, setHeadFees] = useState([]);

  useEffect(() => {
    if (feesData?.fees_collects?.length) {
      setHeadFees(
        map(feesData?.fees_collects, (fee) => ({
          feesId:
            fee.feesTypeMasterId == 1
              ? fee?.fees_name_master?.id
              : fee.feesTypeMasterId == 2
              ? fee?.transport_fee_master?.id
              : "Hostal",
          studentFeesId: fee.studentFeesId,
          amount: fee.amount || 0,
          discount: fee.discount || 0,
          lateFees: fee.lateFees || 0,
        }))
      );
      setInputFeesValue((pre) => ({
        ...pre,
        studentFeesId: "",
        amount: "",
        discount: "",
        lateFees: "",
      }));
    }
  }, [feesData?.fees_collects]);

  const {
    getStudentFeesAction,
    getStudentFeesStatus,
    studentFees,
    resetStudentFee,
    updateCollectFees,
    updateCollectFeesStatus,
    collectStdFees,
    resetCollectFee,
    getCollectionsAction,
  } = useStdFeesStore((s) => ({
    getStudentFeesAction: s.getStudentFeesAction,
    getStudentFeesStatus: s.getStudentFeesStatus,
    studentFees: s.studentFees,
    resetStudentFee: s.resetStudentFee,
    updateCollectFees: s.updateCollectFees,
    updateCollectFeesStatus: s.updateCollectFeesStatus,
    collectStdFees: s.collectStdFees,
    resetCollectFee: s.resetCollectFee,
    getCollectionsAction: s.getCollectionsAction,
  }));

  const { getAdminBankAction, getAdminBanksStatus, allAdminBanks } =
    useAdminBankStore((s) => ({
      getAdminBankAction: s.getAdminBankAction,
      getAdminBanksStatus: s.getAdminBanksStatus,
      allAdminBanks: s.allAdminBanks,
    }));

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

  useEffect(() => {
    if ((getAdminBanksStatus || 1) === STATUS.NOT_STARTED) {
      getAdminBankAction();
    }
  }, [getAdminBankAction, getAdminBanksStatus]);

  useEffect(() => {
    getStudentFeesAction({
      feesMode: isForTrasnport ? 2 : 1,
      promotionId: feesData.promotionId,
      studentMasterId: feesData.studentMasterId,
    });
  }, [feesData, getStudentFeesAction, isForTrasnport]);

  const inputHandler = (name, val) => {
    setInputFeesValue((pre) => ({ ...pre, [name]: val }));
  };

  const addHeadFees = (e) => {
    e.preventDefault();
    setHeadFees((pre) => [
      ...pre,
      {
        studentFeesId: inputFeesValue.studentFeesId,
        amount: parseFloat(inputFeesValue.amount) || 0,
        discount: parseFloat(inputFeesValue.discount) || 0,
        lateFees: parseFloat(inputFeesValue.lateFees) || 0,
      },
    ]);
    setInputFeesValue((pre) => ({
      ...pre,
      studentFeesId: "",
      amount: "",
      discount: "",
      lateFees: "",
    }));
  };

  const selectHeadHandler = (name, val) => {
    setInputFeesValue((pre) => ({
      ...pre,
      [name]: val,
      amount: "",
      discount: "",
      lateFees: "",
    }));
  };

  const studentFeesDetails = useMemo(() => {
    return map(studentFees?.studentFees, (f) => {
      const paid = find(
        feesData.fees_collects,
        (fee) => fee.studentFeesId === f.id
      );
      return {
        ...f,
        totalFees: f.amount,
        amount:
          f.amount -
          (sumBy(f.fees_collects, "amount") +
            sumBy(f.fees_collects, "discount") -
            ((paid?.amount || 0) + (paid?.discount || 0))),
        lateFees:
          f.lateFees -
          (sumBy(f.fees_collects, "lateFees") - (paid?.lateFees || 0)),
      };
    });
  }, [
    feesData.feesTypeMasterId,
    feesData.fees_collects,
    studentFees?.studentFees,
  ]);

  const feesHandler = (name, val) => {
    if (name === "amount" && val > sumBy(studentFeesDetails, "amount")) {
      setInputFeesValue((pre) => ({
        ...pre,
        [name]: sumBy(studentFeesDetails, "amount"),
      }));
    } else if (
      name === "discount" &&
      val > sumBy(studentFeesDetails, "amount") - (inputFeesValue?.amount || 0)
    ) {
      setInputFeesValue((pre) => ({ ...pre, [name]: 0 }));
    } else if (
      name === "lateFees" &&
      val > (sumBy(studentFeesDetails, "lateFees") || 0)
    ) {
      setInputFeesValue((pre) => ({
        ...pre,
        [name]: sumBy(studentFeesDetails, "lateFees") || 0,
      }));
    } else {
      setInputFeesValue((pre) => ({ ...pre, [name]: val }));
    }
  };

  const headFeesHandler = (name, val) => {
    const stdFees = find(
      studentFeesDetails,
      (f) => f.id === parseInt(inputFeesValue.studentFeesId)
    );
    if (name === "amount" && val > stdFees.amount) {
      setInputFeesValue((pre) => ({ ...pre, [name]: stdFees.amount }));
    } else if (
      name === "discount" &&
      val > stdFees.amount - (inputFeesValue?.amount || 0)
    ) {
      setInputFeesValue((pre) => ({ ...pre, [name]: 0 }));
    } else if (name === "lateFees" && val > (stdFees.lateFees || 0)) {
      setInputFeesValue((pre) => ({ ...pre, [name]: stdFees.lateFees }));
    } else {
      setInputFeesValue((pre) => ({ ...pre, [name]: val }));
    }
  };
  const feesDetailState = useMemo(() => {
    return find(
      studentFees?.studentFees,
      (f) => f.id === parseInt(inputFeesValue?.studentFeesId)
    );
  }, [inputFeesValue?.studentFeesId, studentFees?.studentFees]);
  const [feesDetail, setfeesDetail] = useState(feesDetailState);

  useEffect(() => {
    setfeesDetail(feesDetailState);
  }, [feesDetailState]);

  const deleteHeadFee = async (index, head) => {
    const updatedFeesValue = {
      ...inputFeesValue,
      studentFeesId: head?.studentFeesId,
    };

    await setInputFeesValue(updatedFeesValue);
    await setHeadFees(filter(headFees, (f, i) => i !== index));
    const updatedFeesDetail = find(
      studentFees?.studentFees,
      (f) => f.id === parseInt(head?.studentFeesId)
    );

    if (updatedFeesDetail) {
      updatedFeesDetail.newDueFees =
        updatedFeesDetail.newDueFees + (head?.amount || 0);
    }


    setfeesDetail(updatedFeesDetail);
  };
  const unSelectedFee = useMemo(() => {
    return reject(studentFeesDetails, (std) =>
      includes(
        map(headFees, (s) => parseInt(s.studentFeesId)),
        std.id
      )
    );
  }, [headFees, studentFeesDetails]);

  const collectFees = async (e) => {
    e.preventDefault();
    let remainingAmount = inputFeesValue?.amount || 0;
    let remainingDiscount = inputFeesValue?.discount || 0;
    let remainingLateFees = inputFeesValue?.lateFees || 0;

    const feesDetail = studentFeesDetails.map((f) => {
      const fee = Math.min(remainingAmount, f.amount);
      remainingAmount -= fee;
      const dis = Math.min(remainingDiscount, f.amount - fee);
      remainingDiscount -= dis;
      const lateFee = Math.min(remainingLateFees, f.lateFees || 0);
      remainingLateFees -= lateFee;

      return {
        studentFeesId: f.id,
        amount: fee,
        discount: dis,
        lateFees: lateFee,
      };
    });

    const temp = {
      feesReportId: feesData.id,
      type: inputFeesValue.type,
      feesMode: inputFeesValue.feesMode,
      feesTypeMasterId: inputFeesValue.feesTypeMasterId,
      sessionMasterId: sessionMasterId,
      promotionId: studentFeesDetails[0]?.promotionId,
      totalAmount: toggleHeadWise
        ? sumBy(headFees, "amount") || 0
        : sumBy(feesDetail, "amount") || 0,
      totalDiscount: toggleHeadWise
        ? sumBy(headFees, "discount") || 0
        : sumBy(feesDetail, "discount") || 0,
      totalLateFees: toggleHeadWise
        ? sumBy(headFees, "lateFees") || 0
        : sumBy(feesDetail, "lateFees") || 0,
      studentMasterId: studentFees?.student?.id,
      classMasterId: studentFees?.classData?.id,
      sectionMasterId: studentFees?.sectionData?.id,
      streamMasterId: studentFees?.streamData?.id,
      bank: inputFeesValue.bank,
      chequeNo: inputFeesValue.chequeNo,
      chequeDate: inputFeesValue.chequeDate,
      transitionNo: inputFeesValue.transactionNo,
      transactionDate: inputFeesValue.transactionDate,
      ledgerMasterId:
        inputFeesValue?.type === "Cash"
          ? 1
          : inputFeesValue?.type === "Cheque"
          ? ""
          : inputFeesValue.ledgerMasterId,
      remark: inputFeesValue.remark,
      date: inputFeesValue?.date
        ? dayjs(inputFeesValue?.date).format("YYYY-MM-DD")
        : "",
      data: toggleHeadWise
        ? headFees
        : filter(
            feesDetail,
            (f) => !(f.amount === 0 && f.discount === 0 && f.lateFees === 0)
          ),
    };
    await updateCollectFees(temp);
    getCollectionsAction({
      type: "all",
      userId: "all",
      sessionMasterId,
      feesMode: isForTrasnport ? 2 : 1,
      page: 1,
      limit: 10,
    });
  };

  useEffect(() => {
    if (updateCollectFeesStatus === STATUS.FETCHING) {
      resetCollectFee();
      getData();
      closeDrawer();
    }
  }, [closeDrawer, getData, resetCollectFee, updateCollectFeesStatus]);
  const today = () => dayjs();
  return (
    <Drawer
      size={"lg"}
      isOpen={feesData}
      placement="right"
      onClose={closeDrawer}
    >
      <DrawerOverlay />
      <form onSubmit={collectFees}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Fees</DrawerHeader>

          <DrawerBody>
            <LoadingContainer status={getStudentFeesStatus}>
              <Box
                w={"100%"}
                border={"1px solid"}
                borderColor={"gray.200"}
                align={"center"}
                py={10}
                borderRightRadius={5}
              >
                <Text fontSize={20} fontWeight={"semibold"}>
                  Fees Collection Details
                </Text>
                <Flex w={"90%"} mt={4} gap={2} flexWrap={"wrap"}>
                  <CustomInput
                    w={"47%"}
                    type={"date"}
                    name="date"
                    label={"Date"}
                    inputValue={inputFeesValue}
                    setInputValue={setInputFeesValue}
                    min={
                      HasPermission(PERMISSIONS.CAN_ADD_FEE_PREVIOUS_DATE)
                        ? null
                        : today().format("YYYY-MM-DD")
                    }
                    max={
                      HasPermission(PERMISSIONS.CAN_ADD_FEE_PREVIOUS_DATE)
                        ? null
                        : today().format("YYYY-MM-DD")
                    }
                  />

                  {toggleHeadWise ? (
                    <>
                      <Select
                        w={"100%"}
                        size="md"
                        fontSize={13}
                        fontWeight={"bold"}
                        color={"blue.800"}
                        focusBorderColor={`${themeColor}.400`}
                        placeholder="Select Fees Head"
                        value={inputFeesValue?.studentFeesId}
                        onChange={(e) =>
                          selectHeadHandler("studentFeesId", e.target.value)
                        }
                      >
                        {map(
                          concat(
                            find(
                              studentFeesDetails,
                              (f) => f?.id === inputFeesValue?.studentFeesId
                            ) || [],
                            unSelectedFee
                          ),
                          (fee) => {
                            return (
                              <option value={fee.id}>
                                {fee.feesTypeMasterId == 1
                                  ? fee?.fees_name_master?.name +
                                    " -  " +
                                    "( Academic Fees )"
                                  : fee.feesTypeMasterId == 2
                                  ? fee?.transport_fee_master?.name +
                                    " -  " +
                                    "( Transport Fees )"
                                  : "Hostal"}
                              </option>
                            );
                          }
                        )}
                      </Select>
                      <Flex w={"100%"}>
                        {inputFeesValue?.studentFeesId && (
                          <>
                            <Flex
                              p={2}
                              mt={-4}
                              mb={-2}
                              w={"50%"}
                              fontSize={12}
                              color={"red.500"}
                              fontWeight={"bold"}
                              fontStyle={"italic"}
                            >
                              <Text>Due Fees: </Text>
                              <Text ml={1}>{feesDetail?.newDueFees}</Text>
                            </Flex>
                            <Flex
                              p={2}
                              mt={-4}
                              mb={-2}
                              w={"50%"}
                              fontSize={12}
                              color={"red.500"}
                              fontWeight={"bold"}
                              fontStyle={"italic"}
                            >
                              <Text>Due Late Fees: </Text>
                              <Text ml={1}>{feesDetail?.newLateFees}</Text>
                            </Flex>
                          </>
                        )}
                      </Flex>
                      {inputFeesValue?.studentFeesId && (
                        <>
                          <CustomInput
                            w={"47%"}
                            type={"number"}
                            fees={true}
                            notRequire={true}
                            name="amount"
                            label={"Fees Amount"}
                            inputValue={inputFeesValue}
                            setInputValue={headFeesHandler}
                          />
                          {/* <CustomInput
                            w={"47%"}
                            type={"number"}
                            fees={true}
                            notRequire={true}
                            name="discount"
                            label={"Discount"}
                            inputValue={inputFeesValue}
                            setInputValue={headFeesHandler}
                          /> */}
                          <CustomInput
                            w={"47%"}
                            type={"number"}
                            fees={true}
                            notRequire={true}
                            name="lateFees"
                            label={"Late Fees"}
                            inputValue={inputFeesValue}
                            setInputValue={headFeesHandler}
                          />
                          <Button
                            w={"47%"}
                            isDisabled={
                              inputFeesValue?.studentFeesId &&
                              inputFeesValue.amount &&
                              (inputFeesValue.amount > 0 ||
                                inputFeesValue.discount > 0 ||
                                inputFeesValue.lateFees > 0)
                                ? false
                                : true
                            }
                            colorScheme={themeColor}
                            size={"md"}
                            onClick={addHeadFees}
                          >
                            Add
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <CustomInput
                        w={"47%"}
                        type={"number"}
                        fees={true}
                        name="amount"
                        label={"Fees Amount"}
                        inputValue={inputFeesValue}
                        setInputValue={feesHandler}
                      />
                      {/* <CustomInput
                        w={"47%"}
                        type={"number"}
                        fees={true}
                        name="discount"
                        label={"Discount"}
                        inputValue={inputFeesValue}
                        setInputValue={feesHandler}
                      /> */}
                      <CustomInput
                        w={"47%"}
                        type={"number"}
                        fees={true}
                        name="lateFees"
                        label={"Late Fees"}
                        inputValue={inputFeesValue}
                        setInputValue={feesHandler}
                      />
                    </>
                  )}
                  {headFees?.length ? (
                    <TableContainer w={"100%"} mt={2} mb={5}>
                      <Table w={"100%"}>
                        <Thead>
                          <Tr>
                            <Th>Fees Head</Th>
                            <Th>Fees Type</Th>
                            <Th>Amount</Th>
                            <Th>Discount</Th>
                            <Th>LateFees</Th>
                            <Th>Action</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {map(headFees, (head, index) => {
                            const name =
                              find(
                                studentFeesDetails,
                                (f) => f.id === parseInt(head.studentFeesId)
                              )?.transport_fee_master?.name ||
                              find(
                                studentFeesDetails,
                                (f) => f.id === parseInt(head.studentFeesId)
                              )?.fees_name_master?.name;

                              const type = find(
                                studentFeesDetails,
                                (f) => f.id === parseInt(head.studentFeesId)
                              )?.transport_fee_master?.name ? "Transport Fees" : "Academic Fees";
                            
                            return (
                              <Tr>
                                <Td>{name}</Td>
                                <Td>{name ? `(${type})` : ""}</Td>
                                <Td>{head.amount}</Td>
                                <Td>{head.discount}</Td>
                                <Td>{head.lateFees}</Td>
                                <Td>
                                  <IconButton
                                    size={"xs"}
                                    variant={"ghost"}
                                    icon={<DeleteIcon />}
                                    onClick={() => deleteHeadFee(index, head)}
                                  />
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  ) : null}
                  <Select
                    w={"47%"}
                    size="md"
                    isRequired
                    fontSize={13}
                    fontWeight={"bold"}
                    color={"blue.800"}
                    focusBorderColor={`${themeColor}.400`}
                    placeholder="Select Payment Mode"
                    value={inputFeesValue?.type}
                    onChange={(e) => inputHandler("type", e.target.value)}
                  >
                    <option value={"Cash"}>Cash</option>
                    <option value={"Cheque"}>Cheque</option>
                    <option value={"NetBanking"}>Net Banking</option>
                    <option value={"Upi"}>UPI</option>
                    <option value={"CreditCard"}>Credit Card</option>
                    <option value={"DebitCard"}>Debit Card</option>
                    <option value={"PaymentGateway"}>Payment Gateway</option>
                    <option value={"Other"}>Other</option>
                  </Select>
                  {inputFeesValue?.type ? (
                    inputFeesValue?.type === "Cash" ? (
                      <></>
                    ) : inputFeesValue?.type === "Cheque" ? (
                      <>
                        <Select
                          w={"47%"}
                          size="md"
                          isRequired
                          fontSize={13}
                          fontWeight={"bold"}
                          color={"blue.800"}
                          focusBorderColor={`${themeColor}.400`}
                          placeholder="Select Bank Name"
                          value={inputFeesValue?.bank}
                          onChange={(e) => inputHandler("bank", e.target.value)}
                        >
                          {map(allAdminBanks, (bank) => (
                            <option value={bank.name}>{bank.name}</option>
                          ))}
                        </Select>
                        <CustomInput
                          w={"47%"}
                          type={"number"}
                          name="chequeNo"
                          label={"Cheque No./DD"}
                          inputValue={inputFeesValue}
                          setInputValue={setInputFeesValue}
                        />
                        <CustomInput
                          w={"47%"}
                          type={"date"}
                          name="chequeDate"
                          label={"Cheque Date"}
                          inputValue={inputFeesValue}
                          setInputValue={setInputFeesValue}
                        />
                      </>
                    ) : (
                      <>
                        <CustomInput
                          w={"47%"}
                          type={"text"}
                          name="transactionNo"
                          label={"Transaction No."}
                          inputValue={inputFeesValue}
                          setInputValue={setInputFeesValue}
                        />
                        <CustomInput
                          w={"47%"}
                          type={"date"}
                          name="transactionDate"
                          label={"Transaction Date"}
                          inputValue={inputFeesValue}
                          setInputValue={setInputFeesValue}
                        />
                        <Select
                          w={"47%"}
                          size="md"
                          isRequired
                          fontSize={13}
                          fontWeight={"bold"}
                          color={"blue.800"}
                          focusBorderColor={`${themeColor}.400`}
                          placeholder="Select Transfer Bank"
                          value={inputFeesValue?.ledgerMasterId}
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
                  <CustomTextarea
                    type={"text"}
                    notRequire={true}
                    name="remark"
                    label={"Remark"}
                    inputValue={inputFeesValue}
                    setInputValue={setInputFeesValue}
                  />
                </Flex>
              </Box>
            </LoadingContainer>
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
              isLoading={updateCollectFeesStatus === STATUS.FETCHING}
              type="submit"
            >
              Update
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
