import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
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
import React, { useEffect, useState } from "react";

export const AddEmailSetting = ({ data, school, themeColor, closeDrawer }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,
        }
      : {}
  );

  const isRead = () => {};
  // const { addBankAction, addBankStatus, updateBankAction, updateBankStatus, resetBankStatus } = useAdditionalSetupStore(s => ({
  //     addBankAction: s.addBankAction,
  //     addBankStatus: s.addBankStatus,
  //     updateBankAction: s.updateBankAction,
  //     updateBankStatus: s.updateBankStatus,
  //     resetBankStatus: s.resetBankStatus
  // }))

  const submitSetting = (e) => {
    e.preventDefault();
    if (data?.id) {
      // updateBankAction(inputValue)
    } else {
      // addBankAction(inputValue)
    }
  };

  // useEffect(() => {
  //     if (addBankStatus === STATUS.SUCCESS || updateBankStatus === STATUS.SUCCESS) {
  //         resetBankStatus()
  //         closeDrawer()
  //     }
  // }, [addBankStatus, closeDrawer, resetBankStatus, updateBankStatus])

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitSetting}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Email Setting" : "Add Email Setting"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"email"}
                name="email"
                label={"Email"}
                inputValue={inputValue}
                setInputValue={isRead}
              />
              <CustomInput
                type={"text"}
                name="appPassword"
                label={"App Password"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
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
            <Button size={"sm"} type={"submit"} colorScheme={themeColor}>
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
