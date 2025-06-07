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
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { map } from "lodash";
import React, { useEffect, useState } from "react";

export const AddReceiptVoucher = ({
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
          incomeTypeId: data.incomeTypeId,
          amount: data.amount,
          chequeBank: data.chequeBank,
          paymentMode: data.paymentMode,
          chequeNo: data.chequeNo,
          chequeDate: data.chequeDate
            ? dayjs(data.chequeDate).format("YYYY-MM-DD")
            : "",
          transactionNo: data.transactionNo,
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

  useEffect(() => {
    if (inputValue?.pan) {
      setInputValue((pre) => ({ ...pre, pan: toUpper(inputValue?.pan) }));
    }
    if (inputValue?.ifsc) {
      setInputValue((pre) => ({ ...pre, ifsc: toUpper(inputValue?.ifsc) }));
    }
  }, [inputValue?.ifsc, inputValue?.pan]);

  const {
    addReceiptVoucherAction,
    addReceiptVoucherStatus,
    updateReceiptVoucherAction,
    updateReceiptVoucherStatus,
    resetReceiptVoucherStatus,
  } = useAccountStore((s) => ({
    addReceiptVoucherAction: s.addReceiptVoucherAction,
    addReceiptVoucherStatus: s.addReceiptVoucherStatus,
    updateReceiptVoucherAction: s.updateReceiptVoucherAction,
    updateReceiptVoucherStatus: s.updateReceiptVoucherStatus,
    resetReceiptVoucherStatus: s.resetReceiptVoucherStatus,
  }));

  const {
    getLedgerAction,
    getLedgerStatus,
    allLedgers,
    getIncomeTypeAction,
    getIncomeTypeStatus,
    allIncomeTypes,
  } = useAccountStore((s) => ({
    getLedgerAction: s.getLedgerAction,
    getLedgerStatus: s.getLedgerStatus,
    allLedgers: s.allLedgers,
    getIncomeTypeAction: s.getIncomeTypeAction,
    getIncomeTypeStatus: s.getIncomeTypeStatus,
    allIncomeTypes: s.allIncomeTypes,
  }));

  const {
    getVoucherNoAction,
    getVoucherNoStatus,
    voucherNo,
    resetVoucherNoStatus,
  } = useAccountStore((s) => ({
    getVoucherNoAction: s.getVoucherNoAction,
    getVoucherNoStatus: s.getVoucherNoStatus,
    voucherNo: s.voucherNo,
    resetVoucherNoStatus: s.resetVoucherNoStatus,
  }));

  useEffect(() => {
    if ((getVoucherNoStatus || 1) === STATUS.NOT_STARTED && !data?.id) {
      getVoucherNoAction({
        entryType: "Receipt",
        sessionMasterId,
      });
    }
  }, [data?.id, getVoucherNoAction, getVoucherNoStatus, sessionMasterId]);

  const nothing = () => {};
  useEffect(() => {
    return () => resetVoucherNoStatus();
  }, [resetVoucherNoStatus]);

  useEffect(() => {
    if ((getLedgerStatus || 1) === STATUS.NOT_STARTED) {
      getLedgerAction();
    }
    if ((getIncomeTypeStatus || 1) === STATUS.NOT_STARTED) {
      getIncomeTypeAction();
    }
  }, [
    getIncomeTypeAction,
    getIncomeTypeStatus,
    getLedgerAction,
    getLedgerStatus,
  ]);

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

  const submitData = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateReceiptVoucherAction({
        ...inputValue,
        anotherLedgerMasterId:
          inputValue.type === "Cash"
            ? 1
            : inputValue.type === "Cheque"
            ? ""
            : inputValue?.anotherLedgerMasterId,
      });
    } else {
      addReceiptVoucherAction({
        ...inputValue,
        anotherLedgerMasterId:
          inputValue.type === "Cash"
            ? 1
            : inputValue.type === "Cheque"
            ? ""
            : inputValue?.anotherLedgerMasterId,
      });
    }
  };

  useEffect(() => {
    if (
      addReceiptVoucherStatus === STATUS.SUCCESS ||
      updateReceiptVoucherStatus === STATUS.SUCCESS
    ) {
      resetReceiptVoucherStatus();
      closeDrawer();
    }
  }, [
    addReceiptVoucherStatus,
    closeDrawer,
    resetReceiptVoucherStatus,
    updateReceiptVoucherStatus,
  ]);

  return (
    <Drawer size={"md"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitData}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Receipt Voucher" : "Add Receipt Voucher"}
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
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomSelect
                  name={"ledgerMasterId"}
                  label={"Select Ledger"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(allLedgers, (l) => ({ value: l.id, name: l.name }))}
                />
                <CustomSelect
                  name={"incomeTypeId"}
                  label={"Select Income Type"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(allIncomeTypes, (income) => ({
                    value: income.id,
                    name: income.type,
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
                      { name: "Credit Card", value: "CreditCard" },
                      { name: "Debit Card", value: "DebitCard" },
                      { name: "Payment Gateway", value: "PaymentGateway" },
                      { name: "Other", value: "Other" },
                    ]}
                  />
                  {inputValue?.paymentMode ? (
                    inputValue?.paymentMode === "Cash" ? (
                      <></>
                    ) : inputValue?.paymentMode === "Cheque" ? (
                      <>
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
                addReceiptVoucherStatus === STATUS.FETCHING ||
                updateReceiptVoucherStatus === STATUS.FETCHING
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
