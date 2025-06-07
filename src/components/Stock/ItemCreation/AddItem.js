import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import {
  Button,
  Checkbox,
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

export const AddItem = ({ data, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          price: data.price,
          forSell: data.price ? true : false,
          id: data.id,
        }
      : {}
  );

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  const addItem = (e) => {
    e.preventDefault();
  };

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addItem}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{data?.id ? "Edit Item" : "Add Item"}</DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"Item Name"}
                autoFocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <Checkbox
                w={"100%"}
                size={"md"}
                value={inputValue?.forSell}
                colorScheme={themeColor}
                onChange={(e) => inputHandler("forSell", e.target.checked)}
              >
                For Sell
              </Checkbox>
              {inputValue?.forSell ? (
                <CustomInput
                  type={"number"}
                  name="price"
                  label={"Price"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
              ) : null}
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
