import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
import { useAdminStore } from "@/store/AdminStore";
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
import { map } from "lodash";
import React, { useEffect, useState } from "react";

export const AddUser = ({ data, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,
          name: data.name,
          mobileNo: data.mobileNo,
          email: data.email,
          roleMasterId: data.roleMasterId,
          password: data.authCode,
        }
      : {}
  );

  const {
    getRoleAction,
    getRoleStatus,
    allRoles,
    addUserAction,
    addUserStatus,
    updateUserAction,
    updateUserStatus,
    resetUserStatus,
  } = useAdminStore((s) => ({
    getRoleAction: s.getRoleAction,
    getRoleStatus: s.getRoleStatus,
    allRoles: s.allRoles,
    addUserAction: s.addUserAction,
    addUserStatus: s.addUserStatus,
    updateUserAction: s.updateUserAction,
    updateUserStatus: s.updateUserStatus,
    resetUserStatus: s.resetUserStatus,
  }));

  useEffect(() => {
    if ((getRoleStatus || 1) === STATUS.NOT_STARTED) {
      getRoleAction();
    }
  }, [getRoleAction, getRoleStatus]);

  const addUser = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateUserAction(inputValue);
    } else {
      addUserAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addUserStatus === STATUS.SUCCESS ||
      updateUserStatus === STATUS.SUCCESS
    ) {
      resetUserStatus();
      closeDrawer();
    }
  }, [addUserStatus, closeDrawer, resetUserStatus, updateUserStatus]);
  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addUser}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{data?.id ? "Edit User" : "Add New User"}</DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <Flex flexWrap={"wrap"} gap={3}>
                <CustomInput
                  type={"text"}
                  name="name"
                  label={"Name"}
                  autoFocus={true}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomInput
                  type={"number"}
                  name="mobileNo"
                  limit={10}
                  label={"Contact"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomInput
                  type={"email"}
                  name="email"
                  label={"Email"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomSelect
                  name={"roleMasterId"}
                  label={"Role"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(allRoles, (r) => ({ value: r.id, name: r.name }))}
                />
                <CustomInput
                  type={"password"}
                  name="password"
                  label={"Password"}
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
              type={"submit"}
              isLoading={
                addUserStatus === STATUS.FETCHING ||
                updateUserStatus === STATUS.FETCHING
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
