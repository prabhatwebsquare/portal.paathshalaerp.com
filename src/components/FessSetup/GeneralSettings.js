import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Checkbox,
  FormControl,
  Button,
  useToast,
  useColorModeValue,
  Text,
  Divider,
  Input,
  FormLabel,
} from "@chakra-ui/react";
import { useFeesSetupStore } from "@/store/feesSetup";
import { STATUS } from "@/constant";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { FeeReciept } from "./FeeReciept";

export const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    showPendingAmount: false,
    showLateFee: false,
    showDiscountDetails: false,
    enableSMSNotifications: false,
    receiptNumberStart: "",
  });

  const toast = useToast();
  const themeColor = getLocalStorageItem("themeColor") || "blue";
  const cardBg = useColorModeValue("white", "gray.700");

  const {
    getGeneralSettingsAction,
    getGeneralSettingsStatus,
    GeneralSettings,
    updateGeneralSettingsAction,
    updateGeneralSettingsStatus,
    resetGeneralSettingStatus,
  } = useFeesSetupStore((s) => ({
    getGeneralSettingsAction: s.getGeneralSettingsAction,
    getGeneralSettingsStatus: s.getGeneralSettingsStatus,
    updateGeneralSettingsAction: s.updateGeneralSettingsAction,
    updateGeneralSettingsStatus: s.updateGeneralSettingsStatus,
    GeneralSettings: s.GeneralSettings,
    resetGeneralSettingStatus: s.resetGeneralSettingStatus,
  }));

  useEffect(() => {
    if (getGeneralSettingsStatus === STATUS.NOT_STARTED) {
      getGeneralSettingsAction();
    }
  }, [getGeneralSettingsStatus, getGeneralSettingsAction]);

  const handleChange = (key, e) => {
    const newValue = e.target.checked;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: newValue,
    }));
  };
  useEffect(() => {
    resetGeneralSettingStatus();

    return () => {};
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setSettings((prevSettings) => ({
        ...prevSettings,
        receiptNumberStart: value,
      }));
    }
  };

  const handleSave = async () => {
    updateGeneralSettingsAction(settings);
  };

  const renderCheckbox = (key, label) => (
    <Box
      p={4}
      borderRadius="md"
      borderWidth="1px"
      borderColor={`${themeColor}.100`}
      _hover={{ bg: `${themeColor}.50` }}
    >
      <Checkbox
        isChecked={settings[key]}
        name={key}
        id={key}
        onChange={(e) => handleChange(key, e)}
        colorScheme={themeColor}
        size="lg"
      >
        {label}
      </Checkbox>
    </Box>
  );

  return (
    <Box pos={"relative"} h={"79vh"}>
      <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
        <VStack spacing={6} align="stretch">
          <Box
            p={8}
            bg={cardBg}
            borderRadius="xl"
            boxShadow="lg"
            borderWidth="1px"
            borderColor={`${themeColor}.200`}
          >
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color={`${themeColor}.600`}
              mb={0}
              textAlign="center"
            >
              School Management Settings
            </Text>
            <Text fontSize="md" color="gray.600" mb={2} textAlign="center">
              Configure general settings and fee management preferences
            </Text>

            <FormControl>
              <VStack spacing={3} align="stretch">
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color={`${themeColor}.600`}
                >
                  Fee Management Settings
                </Text>
                {renderCheckbox(
                  "showPendingAmount",
                  "Show Pending Amount in Receipt",
                  "Want To Office Copy of The Receipt"
                )}
                {renderCheckbox("showLateFee", "Show Late Fee Details")}
                {renderCheckbox("showDiscountDetails", "Show Discount Details")}
                {renderCheckbox("receiptDoubleCopy", "Receipt Double Copy")}
                <FormLabel>Receipt Number Start With</FormLabel>
                <Input
                  type="text"
                  value={settings.receiptNumberStart}
                  onChange={handleInputChange}
                  placeholder="Enter starting number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                />

                <FeeReciept />
                <Divider my={4} />
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color={`${themeColor}.600`}
                >
                  General Settings
                </Text>

                {renderCheckbox(
                  "enableSMSNotifications",
                  "Enable SMS Notifications"
                )}
              </VStack>
            </FormControl>
          </Box>

          <Button
            colorScheme={themeColor}
            onClick={handleSave}
            size="lg"
            width="full"
            height="50px"
            fontSize="lg"
            fontWeight="bold"
            boxShadow="md"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            loadingText={"Saving..."}
            disabled={updateGeneralSettingsStatus === STATUS.FETCHING}
            isLoading={updateGeneralSettingsStatus === STATUS.FETCHING}
            transition="all 0.2s"
          >
            Save Settings
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};
