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
  VStack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";

export const AddDiscountMaster = ({ data, closeDrawer, themeColor }) => {
  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
  );
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          dis_value: data.dis_value,
          is_percent: data.is_percent || 1,
          id: data.id,
          sessionMasterId,
        }
      : { is_percent: 1 , sessionMasterId}
  );

  const {
    addDiscountMasterAction,
    addDiscountMasterStatus,
    updateDiscountMasterAction,
    updateDiscountMasterStatus,
    resetDiscountMasterStatus,
  } = useFeesSetupStore((s) => ({
    addDiscountMasterAction: s.addDiscountMasterAction,
    addDiscountMasterStatus: s.addDiscountMasterStatus,
    updateDiscountMasterAction: s.updateDiscountMasterAction,
    updateDiscountMasterStatus: s.updateDiscountMasterStatus,
    resetDiscountMasterStatus: s.resetDiscountMasterStatus,
  }));

  const submitDiscountMaster = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateDiscountMasterAction(inputValue);
    } else {
      addDiscountMasterAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addDiscountMasterStatus === STATUS.SUCCESS ||
      updateDiscountMasterStatus === STATUS.SUCCESS
    ) {
      resetDiscountMasterStatus();
      closeDrawer();
    }
  }, [
    addDiscountMasterStatus,
    closeDrawer,
    resetDiscountMasterStatus,
    updateDiscountMasterStatus,
  ]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitDiscountMaster}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Discount Name" : "Add New Discount Name"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={4}>
              <CustomInput
                type={"text"}
                name="name"
                label={"Name"}
                autoFocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />

              <RadioGroup
                name="is_percent"
                onChange={(value) =>
                  setInputValue((prev) => ({
                    ...prev,
                    is_percent: Number(value),
                  }))
                }
                value={String(inputValue.is_percent)}
              >
                <Flex justifyContent="space-between" gap={5} w="100%">
                  <Radio value="1">Percentage</Radio>
                  <Radio value="0">Fixed Value</Radio>
                </Flex>
              </RadioGroup>

              <CustomInput
                type={"number"}
                max={inputValue.is_percent === 1 ? 100 : undefined}
                name="dis_value"
                label={
                  inputValue.is_percent === 1
                    ? "Discount Percentage"
                    : "Discount Value (₹)"
                }
                placeholder={
                  inputValue.is_percent === 1
                    ? "Discount Percentage"
                    : "Discount Value (₹)"
                }
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              {inputValue.is_percent === 1 && (
                <Text fontSize="sm" color="gray.500">
                  Value should not exceed 100%
                </Text>
              )}
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
                addDiscountMasterStatus === STATUS.FETCHING ||
                updateDiscountMasterStatus === STATUS.FETCHING
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
