import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useFeesSetupStore } from "@/store/feesSetup";
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
  Radio,
  RadioGroup,
  Stack,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";

export const AddProspectusFees = ({ data, closeDrawer, themeColor }) => {
  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
  );
  const [inputValue, setInputValue] = useState({
    id: data?.id,
    name: data?.name,
    amount: data?.amount,
    status: data?.status?.toString(),
    sessionMasterId
  });

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  const {
    editBrocherFeesAction,
    editBrocherFeesStatus,
    resetBrocherFeesStatus,
  } = useFeesSetupStore((s) => ({
    editBrocherFeesAction: s.editBrocherFeesAction,
    editBrocherFeesStatus: s.editBrocherFeesStatus,
    resetBrocherFeesStatus: s.resetBrocherFeesStatus,
  }));

  const submitProspectusFees = (e) => {
    e.preventDefault();
    editBrocherFeesAction(inputValue);
  };

  useEffect(() => {
    if (editBrocherFeesStatus === STATUS.SUCCESS) {
      resetBrocherFeesStatus();
      closeDrawer();
    }
  }, [editBrocherFeesStatus, closeDrawer, resetBrocherFeesStatus]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitProspectusFees}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Edit Prospectus/Form Fees</DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"Prospectus/Form Name"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                type={"number"}
                min={1}
                name="amount"
                label={"Fees"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <RadioGroup
                w={"100%"}
                onChange={(e) => inputHandler("status", e)}
                value={inputValue.status}
              >
                <Stack direction="row">
                  <Radio value="1" colorScheme={"green"}>
                    Active
                  </Radio>
                  <Radio value="0" colorScheme={"red"}>
                    InActive
                  </Radio>
                </Stack>
              </RadioGroup>
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
              isLoading={editBrocherFeesStatus === STATUS.FETCHING}
              colorScheme={themeColor}
            >
              Update
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
