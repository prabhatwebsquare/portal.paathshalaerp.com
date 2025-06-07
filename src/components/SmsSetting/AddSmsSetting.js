import CustomInput from "@/common/CustomInput";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { useSmsStore } from "@/store/SmsStore";
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
import React, { useEffect, useState } from "react";

export const AddSmsSetting = ({ data, themeColor, closeDrawer }) => {
  const [inputValue, setInputValue] = useState({});

  const isRead = () => {};

  const {
    addSmsSettingAction,
    addSmsSettingStatus,
    allSmsSettings,
    getSmsSettingAction,
    getSmsSettingStatus,
    resetSmsSettingStatus,
    resetSmsSettingData,
  } = useSmsStore((s) => ({
    addSmsSettingAction: s.addSmsSettingAction,
    addSmsSettingStatus: s.addSmsSettingStatus,
    allSmsSettings: s.allSmsSettings,
    getSmsSettingAction: s.getSmsSettingAction,
    getSmsSettingStatus: s.getSmsSettingStatus,
    resetSmsSettingStatus: s.resetSmsSettingStatus,
    resetSmsSettingData: s.resetSmsSettingData,
  }));

  useEffect(() => {
    if ((getSmsSettingStatus || 1) === STATUS.NOT_STARTED) {
      getSmsSettingAction();
    }
  }, [getSmsSettingAction, getSmsSettingStatus]);

  useEffect(() => {
    if (allSmsSettings) {
      setInputValue(allSmsSettings);
    }
  }, [allSmsSettings]);

  const submitSetting = (e) => {
    e.preventDefault();
    addSmsSettingAction(inputValue);
  };

  useEffect(() => {
    if (addSmsSettingStatus === STATUS.SUCCESS) {
      resetSmsSettingStatus();
      closeDrawer();
    }
  }, [addSmsSettingStatus, closeDrawer, resetSmsSettingStatus]);

  useEffect(() => {
    return () => resetSmsSettingData();
  }, [resetSmsSettingData]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitSetting}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{"SMS Setting"}</DrawerHeader>

          <DrawerBody>
            <LoadingContainer status={getSmsSettingStatus}>
              <VStack spacing={3}>
                <CustomInput
                  type={"text"}
                  name="url"
                  label={"Url"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomInput
                  type={"text"}
                  name="userId"
                  label={"User Id"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomInput
                  type={"password"}
                  name="password"
                  label={"Password"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomInput
                  type={"text"}
                  name="senderId"
                  label={"Sender Id"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomInput
                  type={"text"}
                  name="schoolName"
                  label={"School/Institute Name"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomInput
                  type={"text"}
                  name="pId"
                  label={"PID"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
              </VStack>
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
            <Button size={"sm"} type={"submit"} colorScheme={themeColor}>
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
