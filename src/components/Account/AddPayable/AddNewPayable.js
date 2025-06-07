import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
import { useAccountStore } from "@/store/Account";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import {
  Button,
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
import { format } from "date-fns";
import dayjs from "dayjs";
import { filter, map } from "lodash";
import React, { useEffect, useState } from "react";

export const AddNewPayable = ({
  data,
  closeDrawer,
  sessionMasterId,
  themeColor,
}) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
        id: data.id,
        voucherNo: data.voucherNo,
        referenceVoucherNo: data.referenceVoucherNo,
        voucherDate: dayjs(data.voucherDate).format("YYYY-MM-DD"),
        ledgerMasterId: data.ledgerMasterId,
        expenseTypeId: data.expenseTypeId.toString(),
        amount: data.amount,
        chequeBank: data.chequeBank,
        paymentMode: data.paymentMode,
        chequeNo: data.chequeNo,
        transactionNo: data.transactionNo,
        chequeDate: data.chequeDate
          ? dayjs(data.chequeDate).format("YYYY-MM-DD")
          : "",
        transactionDate: data.transactionDate
          ? dayjs(data.transactionDate).format("YYYY-MM-DD")
          : "",
        ledgerMasterId: data.ledgerMasterId,
        anotherLedgerMasterId: data.anotherLedgerMasterId,
        remark: data.remark,
        sessionMasterId,
      }
      : {
        sessionMasterId,
        voucherDate: dayjs().format("YYYY-MM-DD"),
      }
  );

  const {
    getVoucherNoAction,
    getVoucherNoStatus,
    voucherNo,
    resetVoucherNoStatus,
    getLedgerAction,
    getLedgerStatus,
    allLedgers,
    getExpenseTypeAction,
    getExpenseTypeStatus,
    allExpenseTypes,
  } = useAccountStore((s) => ({
    getVoucherNoAction: s.getVoucherNoAction,
    getVoucherNoStatus: s.getVoucherNoStatus,
    voucherNo: s.voucherNo,
    resetVoucherNoStatus: s.resetVoucherNoStatus,
    getLedgerAction: s.getLedgerAction,
    getLedgerStatus: s.getLedgerStatus,
    allLedgers: s.allLedgers,
    getExpenseTypeAction: s.getExpenseTypeAction,
    getExpenseTypeStatus: s.getExpenseTypeStatus,
    allExpenseTypes: s.allExpenseTypes,
  }));

  useEffect(() => {
    if ((getVoucherNoStatus || 1) === STATUS.NOT_STARTED && !data?.id) {
      getVoucherNoAction({
        entryType: "Payble",
        sessionMasterId,
      });
    }
    if ((getLedgerStatus || 1) === STATUS.NOT_STARTED) {
      getLedgerAction();
    }
    if ((getExpenseTypeStatus || 1) === STATUS.NOT_STARTED) {
      getExpenseTypeAction();
    }
  }, [
    data?.id,
    getExpenseTypeAction,
    getExpenseTypeStatus,
    getLedgerAction,
    getLedgerStatus,
    getVoucherNoAction,
    getVoucherNoStatus,
    sessionMasterId,
  ]);

  const {
    addPayableAction,
    addPayableStatus,
    updatePayableAction,
    updatePayableStatus,
    resetPayableStatus,
    getLedgerDetailAction,
    ledgerDetail,
    MainLedgerDetail,
  } = useAccountStore((s) => ({
    addPayableAction: s.addPayableAction,
    addPayableStatus: s.addPayableStatus,
    updatePayableAction: s.updatePayableAction,
    updatePayableStatus: s.updatePayableStatus,
    resetPayableStatus: s.resetPayableStatus,
    getLedgerDetailAction: s.getLedgerDetailAction,
    ledgerDetail: s.ledgerDetail,
    MainLedgerDetail: s.MainLedgerDetail,
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

  const nothing = () => { };
  useEffect(() => {
    return () => resetVoucherNoStatus();
  }, [resetVoucherNoStatus]);

  const submitData = (e) => {
    e.preventDefault();
    if (data?.id) {
      updatePayableAction({
        ...inputValue,
        anotherLedgerMasterId:
          inputValue.paymentMode === "Cash"
            ? 1
            : inputValue.paymentMode === "Cheque"
              ? inputValue.chequeBank
              : inputValue?.anotherLedgerMasterId,
      });
    } else {
      addPayableAction({
        ...inputValue,
        voucherNo: voucherNo.voucherNo,
        anotherLedgerMasterId:
          inputValue.paymentMode === "Cash"
            ? 1
            : inputValue.paymentMode === "Cheque"
              ? inputValue.chequeBank
              : inputValue?.anotherLedgerMasterId,
      });
    }
  };
  useEffect(() => {
    if (
      addPayableStatus === STATUS.SUCCESS ||
      updatePayableStatus === STATUS.SUCCESS
    ) {
      resetPayableStatus();
      closeDrawer();
    }
  }, [addPayableStatus, closeDrawer, resetPayableStatus, updatePayableStatus]);

  useEffect(() => {
    if (inputValue?.chequeBank && inputValue?.paymentMode == "Cheque") {
      setInputValue((prev) => ({
        ...prev,
        ledgerId: inputValue.chequeBank,
      }));
    } else if (
      inputValue?.paymentMode !== "Cash" 
    ) {
      setInputValue((prev) => ({
        ...prev,
        ledgerId: inputValue.anotherLedgerMasterId,
      }));
    } else if (inputValue?.paymentMode === "Cash") {
      setInputValue((prev) => ({
        ...prev,
        ledgerId: 1,
      }));
    }
  }, [
    inputValue.paymentMode,
    inputValue.chequeBank,
    inputValue.anotherLedgerMasterId,
  ]);

  useEffect(() => {
    if (inputValue?.ledgerId) {
      getLedgerDetailAction({
        ledgerMasterId: inputValue.ledgerId,
        sessionMasterId,
        type: "mode",
      });
    }
  }, [inputValue.ledgerId, sessionMasterId]);

  useEffect(() => {
    if (inputValue?.ledgerMasterId) {
      getLedgerDetailAction({
        ledgerMasterId: inputValue.ledgerMasterId,
        sessionMasterId,
        type: "ledger",
      });
    }
  }, [inputValue.ledgerMasterId, sessionMasterId]);
  const today = format(new Date(), "yyyy-MM-dd");
  const { closingBalance, balanceType } = ledgerDetail?.data || {};
  const { closingBalance: close, balanceType: type } = MainLedgerDetail?.data || {};
  return (
    <Drawer size={"md"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitData}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Voucher" : "Payment Voucher"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <Flex flexWrap={"wrap"} gap={3}>
                <CustomInput
                  w={"31%"}
                  type={"number"}
                  name={"voucherNo"}
                  label={"Voucher No"}
                  autoFocus={true}
                  inputValue={data?.id ? inputValue : voucherNo}
                  setInputValue={nothing}
                />
                <CustomInput
                  w={"31%"}
                  type={"number"}
                  notRequire={true}
                  name={"referenceVoucherNo"}
                  label={"Ref No."}
                  autoFocus={true}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomInput
                  w={"31%"}
                  type={"date"}
                  name="voucherDate"
                  label={"Vo. Date"}
                         setInputValue={setInputValue}
                        max={today}
                  inputValue={inputValue}
                />
                <CustomSelect
                  name={"ledgerMasterId"}
                  label={"Select Ledger"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  // data={map(allLedgers, (l) => ({ value: l.id, name: l.name }))}
                  data={map(
                    filter(allLedgers, (l) => l.type !== "CASH" && l.type !== "BANK"),
                    (l) => ({ value: l.id, name: l.name })
                  )}
                />
                {/* {inputValue.ledgerMasterId &&
                  <Flex align="center">
                    <Text fontSize="sm" fontWeight="semibold" mr={2}>
                      Closing Balance:
                    </Text>
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      color={type === "CR" ? "green.400" : "red.400"}
                    >
                      {close} {type}
                    </Text>
                  </Flex>
                } */}

                <CustomSelect
                  name={"expenseTypeId"}
                  label={"Select Expense Type"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(allExpenseTypes, (expense) => ({
                    value: expense.id,
                    name: expense.type,
                  }))}
                />
                <CustomInput
                  type={"number"}
                  name="amount"
                  label={"Amount"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <Flex w={"100%"} gap={3} flexWrap={"wrap"}>
                  <CustomSelect
                    size={"md"}
                    name={"paymentMode"}
                    label={" Payment Mode"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    data={[
                      { name: "Cash", value: "Cash" },
                      { name: "Cheque", value: "Cheque" },
                      { name: "Net Banking", value: "NetBanking" },
                      { name: "UPI", value: "Upi" },
                      // { name: "Credit Card", value: "CreditCard" },
                      // { name: "Debit Card", value: "DebitCard" },
                    ]}
                  />
                  {inputValue?.paymentMode ? (
                    inputValue?.paymentMode === "Cash" ? (
                      <></>
                    ) : inputValue?.paymentMode === "Cheque" ? (
                      <>
                        <CustomInput
                          w={{ lg: "47%", xl: "48.5%" }}
                          type={"number"}
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
                        <CustomSelect
                          name={"chequeBank"}
                          label={"Select Cheque Bank"}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                          data={map(allBanks, (bank) => ({
                            value: bank.id,
                            name: bank.name + " - " + bank.accountNumber,
                          }))}
                        />

                      </>
                    ) : (
                      <>
                        <CustomInput
                          w={{ lg: "47%", xl: "48.5%" }}
                          type={"text"}
                          name="transactionNo"
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
                        <CustomSelect
                          w={{ lg: "47%", xl: "48.5%" }}
                          size={"sm"}
                          name={"anotherLedgerMasterId"}
                          label={"Select Transfer Bank"}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                          data={map(allBanks, (bank) => ({
                            value: bank.id,
                            name: bank.name + " - " + bank.accountNumber,
                          }))}
                        />
                      </>
                    )
                  ) : (
                    <></>
                  )}
                </Flex>
                {inputValue?.paymentMode &&

                  <Flex align="center">
                    <Text fontSize="sm" fontWeight="semibold" mr={2}>
                      Closing Balance:
                    </Text>
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      color={balanceType === "CR" ? "green.400" : "red.400"}
                    >
                      {closingBalance} {balanceType}
                    </Text>
                  </Flex>
                }

                <CustomTextarea
                  w={"100%"}
                  notRequire={true}
                  rows={2}
                  top={"30%"}
                  type={"text"}
                  name="remark"
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
              type="submit"
              colorScheme={themeColor}
              isLoading={
                addPayableStatus === STATUS.FETCHING ||
                updatePayableStatus === STATUS.FETCHING
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
