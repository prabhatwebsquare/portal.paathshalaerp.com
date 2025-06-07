import CustomInput from "@/common/CustomInput";
import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
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
import React, { useState } from "react";

export const AddTeacherNotice = ({
  themeColor,
  sessionMasterId,
  type,
  data,
  closeDrawer,
}) => {
  const [inputValue, setInputValue] = useState({});
  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };
  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      {/* <form onSubmit={addNoticeBoard}> */}
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{data?.id ? "Edit Event" : "Add Event"}</DrawerHeader>

        <DrawerBody>
          <VStack spacing={3}>
            <CustomInput
              type={"text"}
              name="event"
              label={"Event Name"}
              inputValue={inputValue}
              autoFocus={true}
              setInputValue={setInputValue}
            />
            <CustomInput
              type={"date"}
              name="date"
              label={"Date"}
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
          <Button size={"sm"} type={"submit"} colorScheme="green">
            {data?.id ? "Update" : "Add"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
      {/* </form> */}
    </Drawer>
  );
};
