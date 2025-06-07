import CustomInput from "@/common/CustomInput";
import CustomTextarea from "@/common/CustomTextarea";
import { UploadFile } from "@/common/UploadFile";
import { STATUS } from "@/constant";
import { useTransportStore } from "@/store/Transport";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export const AddDriver = ({ data, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          mobileNo: data.mobileNo,
          licenceNo: data.licenceNo,
          address: data.address,
          id: data.id,
          status: data.status,
        }
      : {}
  );

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  const {
    addDriverAction,
    addDriverStatus,
    updateDriverAction,
    updateDriverStatus,
    resetDriverStatus,
  } = useTransportStore((s) => ({
    addDriverAction: s.addDriverAction,
    addDriverStatus: s.addDriverStatus,
    updateDriverAction: s.updateDriverAction,
    updateDriverStatus: s.updateDriverStatus,
    resetDriverStatus: s.resetDriverStatus,
  }));

  const addDriver = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateDriverAction(inputValue);
    } else {
      addDriverAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addDriverStatus === STATUS.SUCCESS ||
      updateDriverStatus === STATUS.SUCCESS
    ) {
      resetDriverStatus();
      closeDrawer();
    }
  }, [addDriverStatus, closeDrawer, resetDriverStatus, updateDriverStatus]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addDriver}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Driver" : "Add New Driver"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"Driver Name"}
                autofocus={true}
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
              <CustomInput
                type={"text"}
                name="licenceNo"
                label={"Licence No"}
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

              <UploadFile
                data={{ label: "", name: "photo" }}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <FormControl isRequired>
                <Box
                  w={"100%"}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor={`${themeColor}.200`}
                  bg={`${themeColor}.50`}
                >
                  <Text
                    fontWeight="bold"
                    fontSize="md"
                    mb={3}
                    color={`${themeColor}.700`}
                  >
                    Publish Status
                  </Text>
                  <RadioGroup
                    value={Number(inputValue?.status)}
                    onChange={(e) => inputHandler("status", e)}
                  >
                    <Stack
                      direction={{ base: "column", sm: "row" }}
                      spacing={5}
                    >
                      <Radio
                        value={1}
                        size="lg"
                        colorScheme={themeColor}
                        _hover={{ bg: `${themeColor}.100`, borderRadius: "md" }}
                      >
                        <Text fontSize="sm" fontWeight="semibold">
                          Active
                        </Text>
                      </Radio>
                      <Radio
                        value={0}
                        size="lg"
                        colorScheme={themeColor}
                        _hover={{ bg: `${themeColor}.100`, borderRadius: "md" }}
                      >
                        <Text fontSize="sm" fontWeight="semibold">
                          InActive
                        </Text>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </Box>
              </FormControl>
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
                addDriverStatus === STATUS.FETCHING ||
                updateDriverStatus === STATUS.FETCHING
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
