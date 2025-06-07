import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
import { useAccountStore } from "@/store/Account";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { getLocalStorageItem } from "@/utils/LocalStorage";
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
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { filter, map } from "lodash";
import React, { useEffect, useMemo, useState } from "react";

export const AddGeneralVoucher = ({
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
          voucherDate: data?.voucherDate
            ? dayjs(data.voucherDate).format("YYYY-MM-DD")
            : "",
          anotherLedgerMasterId: parseInt(data.anotherLedgerMasterId),
          ledgerMasterId: parseInt(data.ledgerMasterId),
          amount: data.amount,
          remark: data.remark,
        }
      : {
          voucherDate: dayjs().format("YYYY-MM-DD"),
        }
  );

  const { getLedgerAction, getLedgerStatus, allLedgers } = useAccountStore(
    (s) => ({
      getLedgerAction: s.getLedgerAction,
      getLedgerStatus: s.getLedgerStatus,
      allLedgers: s.allLedgers,
    })
  );

  useEffect(() => {
    if ((getLedgerStatus || 1) === STATUS.NOT_STARTED) {
      getLedgerAction();
    }
  }, [getLedgerAction, getLedgerStatus]);

  const ledgers = useMemo(() => {
    return filter(
      allLedgers,
      (led) => led.type !== "CASH" && led.type !== "BANK"
    );
  }, [allLedgers]);

  const {
    addGeneralVoucherAction,
    addGeneralVoucherStatus,
    updateGeneralVoucherAction,
    updateGeneralVoucherStatus,
    resetGeneralVoucherStatus,
  } = useAccountStore((s) => ({
    addGeneralVoucherAction: s.addGeneralVoucherAction,
    addGeneralVoucherStatus: s.addGeneralVoucherStatus,
    updateGeneralVoucherAction: s.updateGeneralVoucherAction,
    updateGeneralVoucherStatus: s.updateGeneralVoucherStatus,
    resetGeneralVoucherStatus: s.resetGeneralVoucherStatus,
  }));

  const submitData = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateGeneralVoucherAction({
        ...inputValue,
        sessionMasterId,
        anotherLedgerMasterId: inputValue?.anotherLedgerMasterId || "1",
        ledgerMasterId: inputValue?.ledgerMasterId || "1",
      });
    } else {
      addGeneralVoucherAction({
        ...inputValue,
        sessionMasterId,
        anotherLedgerMasterId: inputValue?.anotherLedgerMasterId || "1",
        ledgerMasterId: inputValue?.ledgerMasterId || "1",
      });
    }
  };

  useEffect(() => {
    if (
      addGeneralVoucherStatus === STATUS.SUCCESS ||
      updateGeneralVoucherStatus === STATUS.SUCCESS
    ) {
      resetGeneralVoucherStatus();
      closeDrawer();
    }
  }, [
    addGeneralVoucherStatus,
    closeDrawer,
    resetGeneralVoucherStatus,
    updateGeneralVoucherStatus,
  ]);

  return (
    <Drawer size={"md"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitData}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Voucher" : "Add New Voucher"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <Flex flexWrap={"wrap"} gap={3} justify={"space-between"}>
                <CustomInput
                  w={"48%"}
                  type={"number"}
                  name={"voucherNo"}
                  label={"Voucher No"}
                  autoFocus={true}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomInput
                  w={"48%"}
                  type={"date"}
                  name="voucherDate"
                  label={"Date"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomSelect
                  name={"anotherLedgerMasterId"}
                  label={"Select DR Account"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(ledgers, (led) => ({
                    name: led.name,
                    value: led.id,
                  }))}
                />
                <CustomSelect
                  name={"ledgerMasterId"}
                  label={"Select CR Account"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(ledgers, (led) => ({
                    name: led.name,
                    value: led.id,
                  }))}
                />
                <CustomInput
                  type={"number"}
                  name="amount"
                  label={"Amount"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomTextarea
                  w={"100%"}
                  rows={2}
                  top={"30%"}
                  type={"text"}
                  notRequire={true}
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
            <Button size={"sm"} type="submit" colorScheme={themeColor}>
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
