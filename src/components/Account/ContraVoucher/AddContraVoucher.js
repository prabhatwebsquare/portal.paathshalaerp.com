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
  Text,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { map } from "lodash";
import React, { useEffect, useState } from "react";

export const AddContraVoucher = ({
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
          ledgerMasterId: parseInt(data.ledgerMasterId),
          anotherLedgerMasterId: parseInt(data.anotherLedgerMasterId),
          transactionType:
            parseInt(data.ledgerMasterId) === 1
              ? "cashToBank"
              : parseInt(data.anotherLedgerMasterId) === 1
              ? "bankToCash"
              : "bankToBank",
          amount: data.amount,
          remark: data.remark,
        }
      : {
          voucherDate: dayjs().format("YYYY-MM-DD"),
          transactionType: "cashToBank",
        }
  );

  const {
    getVoucherNoAction,
    getVoucherNoStatus,
    voucherNo,
    resetVoucherNoStatus,
    getLedgerDetailAction,
    ledgerDetail,
    MainLedgerDetail,
    addContraVoucherAction,
    addContraVoucherStatus,
    updateContraVoucherAction,
    updateContraVoucherStatus,
    resetContraVoucherStatus,
  } = useAccountStore((s) => ({
    getVoucherNoAction: s.getVoucherNoAction,
    getVoucherNoStatus: s.getVoucherNoStatus,
    voucherNo: s.voucherNo,
    resetVoucherNoStatus: s.resetVoucherNoStatus,
    getLedgerDetailAction: s.getLedgerDetailAction,
    ledgerDetail: s.ledgerDetail,
    MainLedgerDetail: s.MainLedgerDetail,
    addContraVoucherAction: s.addContraVoucherAction,
    addContraVoucherStatus: s.addContraVoucherStatus,
    updateContraVoucherAction: s.updateContraVoucherAction,
    updateContraVoucherStatus: s.updateContraVoucherStatus,
    resetContraVoucherStatus: s.resetContraVoucherStatus,
  }));

  const { getBankAction, getBankStatus, allBanks } = useAdditionalSetupStore(
    (s) => ({
      getBankAction: s.getBankAction,
      getBankStatus: s.getBankStatus,
      allBanks: s.allBanks,
    })
  );

  useEffect(() => {
    if ((getVoucherNoStatus || 1) === STATUS.NOT_STARTED && !data?.id) {
      getVoucherNoAction({ entryType: "Contra", sessionMasterId });
    }
    return () => resetVoucherNoStatus();
  }, []);

  useEffect(() => {
    if ((getBankStatus || 1) === STATUS.NOT_STARTED) getBankAction();
  }, []);

  useEffect(() => {
    if (inputValue.transactionType === "cashToBank") {
      const id = 1;
      setInputValue((prev) => ({ ...prev, ledgerMasterId: id }));
      getLedgerDetailAction({
        ledgerMasterId: id,
        sessionMasterId,
        type: "ledger",
      });
    } else if (inputValue.transactionType === "bankToCash") {
      const id = 1;
      setInputValue((prev) => ({ ...prev, anotherLedgerMasterId: id }));
      getLedgerDetailAction({
        ledgerMasterId: id,
        sessionMasterId,
        type: "mode",
      });
    }
  }, [inputValue.transactionType]);

  useEffect(() => {
    if (
      inputValue.ledgerMasterId &&
      inputValue.transactionType !== "cashToBank"
    ) {
      getLedgerDetailAction({
        ledgerMasterId: inputValue.ledgerMasterId,
        sessionMasterId,
        type: "ledger",
      });
    }
  }, [inputValue.ledgerMasterId]);

  useEffect(() => {
    if (
      inputValue.anotherLedgerMasterId &&
      inputValue.transactionType !== "bankToCash"
    ) {
      getLedgerDetailAction({
        ledgerMasterId: inputValue.anotherLedgerMasterId,
        sessionMasterId,
        type: "mode",
      });
    }
  }, [inputValue.anotherLedgerMasterId]);

  useEffect(() => {
    if (
      addContraVoucherStatus === STATUS.SUCCESS ||
      updateContraVoucherStatus === STATUS.SUCCESS
    ) {
      resetContraVoucherStatus();
      closeDrawer();
    }
  }, [addContraVoucherStatus, updateContraVoucherStatus]);

  const submitData = (e) => {
    e.preventDefault();
    const payload = { ...inputValue, sessionMasterId };
    if (data?.id) {
      updateContraVoucherAction(payload);
    } else {
      addContraVoucherAction({ ...payload, voucherNo: voucherNo.voucherNo });
    }
  };

  const { closingBalance, balanceType } = ledgerDetail?.data || {};
  const { closingBalance: close, balanceType: type } =
    MainLedgerDetail?.data || {};

  return (
    <Drawer size="md" isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitData}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Voucher" : "Contra Voucher"}
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={3}>
              <Flex flexWrap="wrap" gap={3} justify="space-between">
                <CustomInput
                  w="31%"
                  type="number"
                  name="voucherNo"
                  label="Voucher No"
                  disabled
                  inputValue={data?.id ? inputValue : voucherNo}
                  setInputValue={() => {}}
                />
                <CustomInput
                  w="31%"
                  type="number"
                  notRequire
                  name="referenceVoucherNo"
                  label="Ref No."
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomInput
                  w="31%"
                  type="date"
                  name="voucherDate"
                  label="Vo. Date"
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />

                <CustomSelect
                  name="transactionType"
                  label="Transaction Type"
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={[
                    { name: "Cash To Bank", value: "cashToBank" },
                    { name: "Bank To Cash", value: "bankToCash" },
                    { name: "Bank To Bank", value: "bankToBank" },
                  ]}
                />

                {/* Dynamic Selects Based on Transaction Type */}
                {inputValue.transactionType === "cashToBank" && (
                  <>
                    <Flex align="center" pl={2}>
                      <Text fontSize="sm" fontWeight="semibold" mr={2}>
                        Cash Closing Balance:
                      </Text>
                      <Text
                        fontSize="md"
                        fontWeight="bold"
                        color={type === "CR" ? "green.400" : "red.400"}
                      >
                        {close} {type}
                      </Text>
                    </Flex>
                    <CustomSelect
                      name="anotherLedgerMasterId"
                      label="Receiver Bank Account"
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      data={map(allBanks, (bank) => ({
                        name: `${bank.name} - ${bank.accountNumber}`,
                        value: bank.id,
                      }))}
                    />
                    {inputValue.anotherLedgerMasterId && (
                      <Flex align="center" pl={2}>
                        <Text fontSize="sm" fontWeight="semibold" mr={2}>
                          Bank Closing Balance:
                        </Text>
                        <Text
                          fontSize="md"
                          fontWeight="bold"
                          color={balanceType === "CR" ? "green.400" : "red.400"}
                        >
                          {closingBalance} {balanceType}
                        </Text>
                      </Flex>
                    )}
                  </>
                )}

                {inputValue.transactionType === "bankToCash" && (
                  <>
                    <Flex align="center" pl={2}>
                      <Text fontSize="sm" fontWeight="semibold" mr={2}>
                        Cash Closing Balance:
                      </Text>
                      <Text
                        fontSize="md"
                        fontWeight="bold"
                        color={balanceType === "CR" ? "green.400" : "red.400"}
                      >
                        {closingBalance} {balanceType}
                      </Text>
                    </Flex>
                    <CustomSelect
                      name="ledgerMasterId"
                      label="Giver Bank Account"
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      data={map(allBanks, (bank) => ({
                        name: `${bank.name} - ${bank.accountNumber}`,
                        value: bank.id,
                      }))}
                    />
                    {inputValue.ledgerMasterId && (
                      <Flex align="center" pl={2}>
                        <Text fontSize="sm" fontWeight="semibold" mr={2}>
                          Bank Closing Balance:
                        </Text>
                        <Text
                          fontSize="md"
                          fontWeight="bold"
                          color={type === "CR" ? "green.400" : "red.400"}
                        >
                          {close} {type}
                        </Text>
                      </Flex>
                    )}
                  </>
                )}

                {inputValue.transactionType === "bankToBank" && (
                  <>
                    <CustomSelect
                      name="ledgerMasterId"
                      label="Giver Bank Account"
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      data={map(allBanks, (bank) => ({
                        name: `${bank.name} - ${bank.accountNumber}`,
                        value: bank.id,
                      }))}
                    />
                    {inputValue.ledgerMasterId && (
                      <Flex align="center" pl={2}>
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
                    )}
                    <CustomSelect
                      name="anotherLedgerMasterId"
                      label="Receiver Bank Account"
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      data={map(allBanks, (bank) => ({
                        name: `${bank.name} - ${bank.accountNumber}`,
                        value: bank.id,
                      }))}
                    />
                    {inputValue.anotherLedgerMasterId && (
                      <Flex align="center" pl={2}>
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
                    )}
                  </>
                )}

                <CustomInput
                  type="number"
                  name="amount"
                  label="Amount"
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomTextarea
                  w="100%"
                  rows={2}
                  name="remark"
                  label="Remark"
                  notRequire
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
              </Flex>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
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
