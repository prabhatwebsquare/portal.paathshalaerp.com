import { MultiSelectDropdown } from "@/common/MultiSelectDropdown";
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
  Select,
  VStack,
} from "@chakra-ui/react";
import { map } from "lodash";
import React, { useState } from "react";

export const AddRouteStation = ({ data, closeDrawer }) => {
  const [inputValue, setInputValue] = useState({});

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };
  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {data?.id ? "Edit Route Station" : "Add Route Station"}
        </DrawerHeader>

        <DrawerBody>
          <VStack spacing={3}>
            <Select
              isRequired
              fontSize={13}
              fontWeight={"semibold"}
              focusBorderColor="green.400"
              placeholder="Select Route"
              value={inputValue?.route}
              onChange={(e) => inputHandler("route", e.target.value)}
            >
              {map(new Array(12), (d, index) => (
                <option value={"Route" + (index + 1)}>Route{index + 1}</option>
              ))}
            </Select>
            <Box w={"100%"}>
              <MultiSelectDropdown
                name={"subjects"}
                label={"Select Subjects"}
                selected={inputHandler}
              />
            </Box>
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
            {data?.id ? "Update" : "Add"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
