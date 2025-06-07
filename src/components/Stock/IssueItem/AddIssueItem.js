import CustomArrayInput from "@/common/CustomArrayInput";
import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { URL } from "@/services/apis";
import { useLibraryStore } from "@/store/Library";
import { useStdFeesStore } from "@/store/stdFees";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Avatar,
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
  IconButton,
  Image,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { cloneDeep, map } from "lodash";
import React, { useEffect, useState } from "react";

export const AddIssueItem = ({
  data,
  closeDrawer,
  themeColor,
  sessionMasterId,
}) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          issueDate: data.issueDate
            ? dayjs(data.issueDate).format("YYYY-MM-DD")
            : "",
          id: data.id,
        }
      : {
          issueDate: dayjs().format("YYYY-MM-DD"),
        }
  );

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  const [itemList, setItemList] = useState(
    data?.id
      ? map(data.purchase_book_details, (b) => ({
          catelogId: b.catelogId,
          quantity: b.quantity,
          price: b.price,
        }))
      : [{}]
  );

  const itemHandler = (name, val, index) => {
    setItemList((prevState) => {
      const updatedArray = [...prevState];
      updatedArray[index] = {
        ...updatedArray[index],
        [name]: val,
      };
      return updatedArray;
    });
  };

  const deleteItemArray = (index) => {
    const newData = cloneDeep(itemList);
    newData.splice(index, 1);
    setItemList(newData);
  };

  const addItemIssue = () => {};

  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      {/* <form onSubmit={addBookIssue}> */}
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {data?.id ? "Edit Issue Item" : "Issue Item"}
        </DrawerHeader>

        <DrawerBody>
          <VStack spacing={3}>
            <RadioGroup
              mb={2}
              w={"100%"}
              colorScheme={themeColor}
              onChange={(e) => inputHandler("type", e)}
              value={inputValue?.type}
            >
              <Stack direction="row" fontWeight={"semibold"}>
                <Radio
                  borderColor={`${themeColor}.400`}
                  fontWeight={"bold"}
                  value="Department"
                  autoFocus={true}
                >
                  Issue to department
                </Radio>
                <Radio
                  borderColor={`${themeColor}.400`}
                  fontWeight={"bold"}
                  value="Seller"
                >
                  Issue to seller
                </Radio>
              </Stack>
            </RadioGroup>
            {inputValue?.type === "Department" ? (
              <CustomSelect
                w={"98%"}
                name="departmentId"
                label={"Select Department"}
                autoFocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[{ name: "ABC Pvt. Ltd.", value: "ABC Pvt. Ltd." }]}
              />
            ) : null}
            {inputValue?.type === "Seller" ? (
              <CustomSelect
                w={"98%"}
                name="sellerId"
                label={"Select Seller"}
                autoFocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[{ name: "ABC Pvt. Ltd.", value: "ABC Pvt. Ltd." }]}
              />
            ) : null}
            <Table my={2} w="100%" size={"sm"} variant={"simple"}>
              <Thead>
                <Tr bg="gray.100">
                  <Th width={"50%"}>Item</Th>
                  <Th>Quantity</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {map(itemList, (item, index) => {
                  return (
                    <Tr key={index}>
                      <Td>
                        <FormControl isRequired>
                          <Select
                            size={"sm"}
                            fontWeight={"semibold"}
                            focusBorderColor={`${themeColor}.400`}
                            placeholder="Select Item"
                            value={item?.itemId}
                            onChange={(e) =>
                              itemHandler(
                                "itemId",
                                parseInt(e.target.value),
                                index
                              )
                            }
                          >
                            <option value={"Beaker"}>Beaker</option>
                          </Select>
                        </FormControl>
                      </Td>
                      {/* <Td>
                                                    <FormControl isRequired>
                                                        <Select size={"sm"} fontWeight={"semibold"} focusBorderColor={`${themeColor}.400`} placeholder="Select Department"
                                                            value={item?.departmentId}
                                                            onChange={(e) => itemHandler("departmentId", parseInt(e.target.value), index)}>
                                                            <option value={"Department"}>Science</option>
                                                        </Select>
                                                    </FormControl>
                                                </Td> */}
                      <Td>
                        <CustomArrayInput
                          size={"sm"}
                          type={"number"}
                          index={index}
                          name="quantity"
                          label={"Quantity"}
                          inputValue={item}
                          setInputValue={setItemList}
                        />
                      </Td>
                      <Td>
                        <IconButton
                          size={"xs"}
                          variant={"ghost"}
                          colorScheme={"red"}
                          onClick={() => deleteItemArray(index)}
                          icon={<DeleteIcon />}
                        />
                      </Td>
                    </Tr>
                  );
                })}
                <Tr>
                  <Td colSpan={6} textAlign={"center"}>
                    <Button
                      size={"sm"}
                      variant={"ghost"}
                      colorScheme={themeColor}
                      leftIcon={<AddIcon />}
                      onClick={() => setItemList((pre) => [...pre, {}])}
                    >
                      Add More
                    </Button>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
            <CustomInput
              w={"48%"}
              type={"date"}
              name="issueDate"
              label={"Issue Date"}
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
            onClick={addItemIssue}
            isDisabled={itemList?.length ? false : true}
            colorScheme={themeColor}
          >
            {data?.id ? "Update" : "Add"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
      {/* </form> */}
    </Drawer>
  );
};
