import CustomInput from "@/common/CustomInput";
import CustomTextarea from "@/common/CustomTextarea";
import { UploadFile } from "@/common/UploadFile";
import { STATUS } from "@/constant";
import { useTransportStore } from "@/store/Transport";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export const AddTransporter = ({ data, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          mobileNo: data.mobileNo,
          licenceNo: data.licenceNo,
          address: data.address,
          id: data.id,
          logo: data.logo,
        }
      : {}
  );

  const {
    addTransporterAction,
    addTransporterStatus,
    updateTransporterAction,
    updateTransporterStatus,
    resetTransporterStatus,
  } = useTransportStore((s) => ({
    addTransporterAction: s.addTransporterAction,
    addTransporterStatus: s.addTransporterStatus,
    updateTransporterAction: s.updateTransporterAction,
    updateTransporterStatus: s.updateTransporterStatus,
    resetTransporterStatus: s.resetTransporterStatus,
  }));

  const addTransporter = (e) => {
    e.preventDefault();
    addTransporterAction(inputValue);
  };

  useEffect(() => {
    if (
      addTransporterStatus === STATUS.SUCCESS ||
      updateTransporterStatus === STATUS.SUCCESS
    ) {
      resetTransporterStatus();
      closeDrawer();
    }
  }, [
    addTransporterStatus,
    closeDrawer,
    resetTransporterStatus,
    updateTransporterStatus,
  ]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer} size={"sm"}>
      <DrawerOverlay />
      <form onSubmit={addTransporter}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Transporter" : "Add New Transporter"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <UploadFile
                data={{ label: "Logo", name: "logo" }}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                type={"text"}
                name="name"
                label={"Transporter Name"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                type={"number"}
                name="mobileNo"
                label={"Mobile No"}
                limit={10}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomTextarea
                type={"text"}
                name="address"
                label={"Address"}
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
                addTransporterStatus === STATUS.FETCHING ||
                updateTransporterStatus === STATUS.FETCHING
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
