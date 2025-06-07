import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { useStaffStore } from "@/store/StaffStore";
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

export const AddStaff = ({ themeColor, data, closeDrawer }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,
          name: data.name,
          mobileNo: data.mobileNo,
          email: data.email,
          designation: data.designation,
          address: data.address,
        }
      : {}
  );

  const {
    addStaffAction,
    addStaffStatus,
    updateStaffAction,
    updateStaffStatus,
    resetStaffStatus,
  } = useStaffStore((s) => ({
    addStaffAction: s.addStaffAction,
    addStaffStatus: s.addStaffStatus,
    updateStaffAction: s.updateStaffAction,
    updateStaffStatus: s.updateStaffStatus,
    resetStaffStatus: s.resetStaffStatus,
  }));

  const addStaff = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateStaffAction(inputValue);
    } else {
      addStaffAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addStaffStatus === STATUS.SUCCESS ||
      updateStaffStatus === STATUS.SUCCESS
    ) {
      resetStaffStatus();
      closeDrawer();
    }
  }, [addStaffStatus, closeDrawer, resetStaffStatus, updateStaffStatus]);

  const { getdesignationAction, getdesignationStatus, alldesignations } =
    useAdditionalSetupStore((s) => ({
      getdesignationAction: s.getdesignationAction,
      getdesignationStatus: s.getdesignationStatus,
      alldesignations: s.alldesignations,
    }));

  useEffect(() => {
    if ((getdesignationStatus || 1) === STATUS.NOT_STARTED) {
      getdesignationAction();
    }
  }, [getdesignationAction, getdesignationStatus]);
  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addStaff}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Staff" : "Add New Staff"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"Name"}
                inputValue={inputValue}
                autoFocus={true}
                setInputValue={setInputValue}
              />
              <CustomInput
                type={"number"}
                name="mobileNo"
                limit={10}
                label={"Mobile No."}
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
                name={"designation"}
                label={"Select Designation"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(alldesignations?.slice(-6), (data) => ({
                  value: data.name,
                  name: data.name,
                }))}                
              />
              <CustomTextarea
                w="100%"
                type="text"
                name="address"
                label="Address"
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
            <Button
              size={"sm"}
              type={"submit"}
              isLoading={
                addStaffStatus === STATUS.FETCHING ||
                updateStaffStatus === STATUS.FETCHING
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
