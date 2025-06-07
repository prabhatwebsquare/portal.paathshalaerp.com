import CustomArrayInput from "@/common/CustomArrayInput";
import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { STATUS } from "@/constant";
import { useLibraryStore } from "@/store/Library";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
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
  FormControl,
  IconButton,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { cloneDeep, concat, find, includes, map, reject } from "lodash";
import React, { useEffect, useMemo, useState } from "react";

export const AddStockEntry = ({ data, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,
        }
      : {}
  );

  const [stock, setStock] = useState(data.total ? true : false);

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

  const addPurchaseEntry = (e) => {
    e.preventDefault();
  };

  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addPurchaseEntry}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Stock Entry" : "Add Stock Entry"}
          </DrawerHeader>

          <DrawerBody>
            <Flex flexWrap={"wrap"} gap={3}>
              <CustomSelect
                w={"98%"}
                name="supplierId"
                label={"Select Supplier"}
                autoFocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[{ name: "ABC Pvt. Ltd.", value: "ABC Pvt. Ltd." }]}
              />
              <Table my={2} w="100%" size={"sm"} variant={"simple"}>
                <Thead>
                  <Tr bg="gray.100">
                    <Th width={"40%"}>Item</Th>
                    <Th>Quantity</Th>
                    <Th>Amount</Th>
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
                          <CustomArrayInput
                            size={"sm"}
                            type={"number"}
                            index={index}
                            name="amount"
                            label={"Amount"}
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
              <Checkbox
                w={"100%"}
                size={"md"}
                isChecked={stock}
                value={stock}
                colorScheme={themeColor}
                onChange={(e) => setStock(e.target.checked)}
              >
                Invoice Details (Optional)
              </Checkbox>
              {stock ? (
                <>
                  <CustomInput
                    w={"32%"}
                    type={"number"}
                    name="billNo"
                    label={"Bill No."}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                  <CustomInput
                    w={"32%"}
                    type={"date"}
                    name="billDate"
                    label={"Bill Date"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                  <CustomInput
                    w={"32%"}
                    type={"number"}
                    name="total"
                    label={"Total"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                  <CustomInput
                    w={"32%"}
                    type={"number"}
                    name="discount"
                    label={"Discount"}
                    notRequire={true}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                  <CustomInput
                    w={"66%"}
                    type={"number"}
                    name="description"
                    label={"Description"}
                    notRequire={true}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                </>
              ) : null}
            </Flex>
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
