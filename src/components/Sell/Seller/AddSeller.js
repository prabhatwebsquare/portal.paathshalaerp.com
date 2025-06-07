import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
import { useAccountStore } from "@/store/Account";
import { useLibraryStore } from "@/store/Library";
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
  Text,
  VStack,
} from "@chakra-ui/react";
import { toUpper } from "lodash";
import React, { useEffect, useState } from "react";

const openingType = [
  { name: "CR", value: "CR" },
  { name: "DR", value: "DR" },
];
export const AddSupplier = ({ data, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,
          name: data.name,
          contact: data.contact,
          email: data.email,
          address: data.address,
          pan: data.pan,
          gst: data.gst,
        }
      : {}
  );

  useEffect(() => {
    if (inputValue?.pan) {
      setInputValue((pre) => ({ ...pre, pan: toUpper(inputValue?.pan) }));
    }
    if (inputValue?.ifsc) {
      setInputValue((pre) => ({ ...pre, ifsc: toUpper(inputValue?.ifsc) }));
    }
  }, [inputValue?.ifsc, inputValue?.pan]);

  const submitData = (e) => {
    e.preventDefault();
  };

  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitData}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Seller" : "Add New Seller"}
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={3}>
              <Flex flexWrap={"wrap"} gap={3}>
                <CustomInput
                  w={"98%"}
                  type={"text"}
                  name="name"
                  label={"Seller Name"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <CustomInput
                  w={"48%"}
                  type={"number"}
                  name="contact"
                  limit={10}
                  isInvalid={inputValue?.contact?.length !== 10 ? true : false}
                  errorBorderColor="crimson"
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
                <CustomTextarea
                  w={"98%"}
                  rows={2}
                  top={"30%"}
                  type={"text"}
                  name="address"
                  label={"Address"}
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
            <Button size={"sm"} type="submit" colorScheme={themeColor}>
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
