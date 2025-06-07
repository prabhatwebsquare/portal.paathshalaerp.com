import CustomInput from "@/common/CustomInput";
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
import React, { useEffect, useState } from "react";

export const AddRole = ({ themeColor, data, closeDrawer }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,
          name: data.name,
          permission: data.permission,
        }
      : {}
  );

  const {
    addRoleSuperAdminAction,
    addRoleSuperAdminStatus,
    updateRoleSuperAdminAction,
    updateRoleSuperAdminStatus,
    resetRoleSuperAdminStatus,
  } = useAdminStore((s) => ({
    addRoleSuperAdminAction: s.addRoleSuperAdminAction,
    addRoleSuperAdminStatus: s.addRoleSuperAdminStatus,
    updateRoleSuperAdminAction: s.updateRoleSuperAdminAction,
    updateRoleSuperAdminStatus: s.updateRoleSuperAdminStatus,
    resetRoleSuperAdminStatus: s.resetRoleSuperAdminStatus,
  }));

  const addRole = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateRoleSuperAdminAction(inputValue);
    } else {
      addRoleSuperAdminAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addRoleSuperAdminStatus === STATUS.SUCCESS ||
      updateRoleSuperAdminStatus === STATUS.SUCCESS
    ) {
      resetRoleSuperAdminStatus();
      closeDrawer();
    }
  }, [addRoleSuperAdminStatus, closeDrawer, resetRoleSuperAdminStatus, updateRoleSuperAdminStatus]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addRole}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{data?.id ? "Edit Role" : "Add New Role"}</DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"Role"}
                inputValue={inputValue}
                autoFocus={true}
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
            <Button
              size={"sm"}
              type={"submit"}
              isLoading={
                addRoleSuperAdminStatus === STATUS.FETCHING ||
                updateRoleSuperAdminStatus === STATUS.FETCHING
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
