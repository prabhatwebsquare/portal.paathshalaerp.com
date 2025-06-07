import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
import { useAccountStore } from "@/store/Account";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import {
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
  Text,
  VStack,
} from "@chakra-ui/react";
import { toUpper } from "lodash";
import React, { useEffect, useState } from "react";

const openingType = [
  { name: "CR", value: "CR" },
  { name: "DR", value: "DR" },
];
export const AddLedger = ({
  data,
  closeDrawer,
  sessionMasterId,
  themeColor,
}) => {
  const [tax, setTax] = useState(false);
  const [openingAmount, setOpeningAmount] = useState(false)
  const [bank, setBank] = useState(false);
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,
          openingBalance: data.openingBalance,
          type: (data?.type === 'CASH' || data?.type === 'BANK') ? 'DR' : data.type,
          name: data.name,
          contact: data.contact,
          email: data.email,
          address: data.address,
          pan: data.pan,
          gst: data.gst,
          bank: data.bank,
          accountNumber: data.accountNumber,
          ifsc: data.ifsc,
          branch: data.branch,
          sessionMasterId,
        }
      : {
          sessionMasterId,
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
    addLedgerAction,
    addLedgerStatus,
    updateLedgerAction,
    updateLedgerStatus,
    resetLedgerStatus,
  } = useAccountStore((s) => ({
    addLedgerAction: s.addLedgerAction,
    addLedgerStatus: s.addLedgerStatus,
    updateLedgerAction: s.updateLedgerAction,
    updateLedgerStatus: s.updateLedgerStatus,
    resetLedgerStatus: s.resetLedgerStatus,
  }));

  const submitData = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateLedgerAction(inputValue);
    } else {
      addLedgerAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addLedgerStatus === STATUS.SUCCESS ||
      updateLedgerStatus === STATUS.SUCCESS
    ) {
      resetLedgerStatus();
      closeDrawer();
    }
  }, [addLedgerStatus, closeDrawer, resetLedgerStatus, updateLedgerStatus]);

  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitData}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Ledger" : "Add New Ledger"}
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={3}>
              {(data?.type === 'CASH' || data?.type === 'BANK') && 
                <Flex mt={5} gap={3}>
                  <CustomInput
                    w={"48%"}
                    type={"text"}
                    name="name"
                    label={"Party Name"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                  <CustomInput
                    w={"48%"}
                    type={"number"}
                    name="openingBalance"
                    notRequire={true}
                    label={"Opening Balance"}
                    autoFocus={true}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                </Flex>
              }
              {data?.type !== 'CASH' && data?.type !== 'BANK' && 
                <Flex flexWrap={"wrap"} gap={3}>
                  <CustomInput
                    w={"98%"}
                    type={"text"}
                    name="name"
                    label={"Party Name"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                  <CustomInput
                    w={"48%"}
                    type={"number"}
                    name="contact"
                    notRequire={true}
                    limit={10}
                    label={"Contact Number"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                  <CustomInput
                    w={"48%"}
                    type={"text"}
                    notRequire={true}
                    name="email"
                    label={"Email"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                  <CustomTextarea
                    w={"98%"}
                    rows={2}
                    top={"30%"}
                    type={"text"}
                    notRequire={true}
                    name="address"
                    label={"Address"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                  <Checkbox
                    mt={3}
                    w={"100%"}
                    fontWeight={"semibold"}
                    value={openingAmount}
                    colorScheme={themeColor}
                    onChange={(e) => setOpeningAmount(e.target.checked)}
                  >
                    Opening Details
                  </Checkbox>
                  {openingAmount ? (
                    <>
                      <CustomInput
                        w={"48%"}
                        type={"number"}
                        name="openingBalance"
                        notRequire={true}
                        label={"Opening Balance"}
                        autoFocus={true}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                      <CustomSelect
                        w={"48%"}
                        name="type"
                        notRequire={true}
                        label={"Select Type "}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        data={openingType}
                      />
                    </>
                  ) : null}
                  <Checkbox
                    mt={3}
                    w={"100%"}
                    fontWeight={"semibold"}
                    value={tax}
                    colorScheme={themeColor}
                    onChange={(e) => setTax(e.target.checked)}
                  >
                    Tax Details
                  </Checkbox>
                  {tax ? (
                    <>
                      <CustomInput
                        w={"48%"}
                        type={"text"}
                        notRequire={true}
                        name="pan"
                        label={"PAN"}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                      <CustomInput
                        w={"48%"}
                        type={"text"}
                        notRequire={true}
                        name="gst"
                        label={"GST No."}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                    </>
                  ) : null}
                  <Checkbox
                    mt={3}
                    w={"100%"}
                    fontWeight={"semibold"}
                    value={bank}
                    colorScheme={themeColor}
                    onChange={(e) => setBank(e.target.checked)}
                  >
                    Bank Details
                  </Checkbox>
                  {bank ? (
                    <>
                      <Text
                        w={"100%"}
                        fontSize={14}
                        mt={5}
                        fontWeight={"semibold"}
                      >
                        Bank Details
                      </Text>
                      <CustomInput
                        w={"48%"}
                        type={"text"}
                        notRequire={true}
                        name="bank"
                        label={"Bank Name"}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                      <CustomInput
                        w={"48%"}
                        type={"number"}
                        notRequire={true}
                        limit={14}
                        name="accountNumber"
                        label={"Account Number"}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                      <CustomInput
                        w={"48%"}
                        type={"text"}
                        notRequire={true}
                        name="ifsc"
                        label={"IFSC Code"}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                      <CustomInput
                        w={"48%"}
                        type={"text"}
                        notRequire={true}
                        name="branch"
                        label={"Branch"}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      />
                    </>
                  ) : null}
                </Flex>
              }
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
                addLedgerStatus === STATUS.FETCHING ||
                updateLedgerStatus === STATUS.FETCHING
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
