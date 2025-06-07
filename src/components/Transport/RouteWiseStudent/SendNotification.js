import CustomInput from "@/common/CustomInput";
import CustomTextarea from "@/common/CustomTextarea";
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
  Radio,
  RadioGroup,
  Stack,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";

export const SendNotification = ({ data, closeDrawer }) => {
  const [inputValue, setInputValue] = useState({});
  const [value, setValue] = useState({});

  return (
    <Drawer size={"md"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Send Notification</DrawerHeader>

        <DrawerBody>
          <VStack spacing={3}>
            <RadioGroup mb={3} w={"100%"} onChange={setValue} value={value}>
              <Stack direction="row">
                <Radio value="App Notification">App Notification</Radio>
                <Radio value="Email">Email</Radio>
              </Stack>
            </RadioGroup>
            <CustomTextarea
              w={"100%"}
              type={"text"}
              name="message"
              label={"Write Message Here..."}
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
          <Button size={"sm"} colorScheme="green">
            Send
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
