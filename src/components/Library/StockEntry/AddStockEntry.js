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
          bookVendorId: data.bookVendorId,
          stockDate: data.stockDate
            ? dayjs(data.stockDate).format("YYYY-MM-DD")
            : "",
          billNo: data.billNo,
          billDate: data.billDate
            ? dayjs(data.billDate).format("YYYY-MM-DD")
            : "",
          total: data.total,
          discount: data.discount,
          id: data.id,
        }
      : {}
  );

  const [stock, setStock] = useState(data.total ? true : false);

  const {
    getVendorAction,
    getVendorStatus,
    allVendors,
    resetVendorData,
    getCatalogAction,
    getCatalogStatus,
    allCatalogs,
    resetCatalogData,
  } = useLibraryStore((s) => ({
    getVendorAction: s.getVendorAction,
    getVendorStatus: s.getVendorStatus,
    allVendors: s.allVendors,
    resetVendorData: s.resetVendorData,
    getCatalogAction: s.getCatalogAction,
    getCatalogStatus: s.getCatalogStatus,
    allCatalogs: s.allCatalogs,
    resetCatalogData: s.resetCatalogData,
  }));

  useEffect(() => {
    if ((getVendorStatus || 1) === STATUS.NOT_STARTED) {
      getVendorAction();
    }
    if ((getCatalogStatus || 1) === STATUS.NOT_STARTED) {
      getCatalogAction();
    }
  }, [getCatalogAction, getCatalogStatus, getVendorAction, getVendorStatus]);

  useEffect(() => {
    return () => resetCatalogData();
  }, [resetCatalogData]);
  useEffect(() => {
    return () => resetVendorData();
  }, [resetVendorData]);

  const [itemList, setItemList] = useState(
    data?.id
      ? map(data.purchase_book_details, (b) => ({
          catelogId: b.catelogId,
          quantity: b.quantity,
          price: b.price,
        }))
      : [{}]
  );

  const bookHandler = (name, val, index) => {
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

  const unSelectedSubjects = useMemo(() => {
    return reject(allCatalogs?.data, (sub) =>
      includes(
        map(itemList, (s) => s.catelogId),
        sub.id
      )
    );
  }, [allCatalogs, itemList]);

  const {
    addPurchaseEntryAction,
    addPurchaseEntryStatus,
    updatePurchaseEntryAction,
    updatePurchaseEntryStatus,
    resetPurchaseEntryStatus,
  } = useLibraryStore((s) => ({
    addPurchaseEntryAction: s.addPurchaseEntryAction,
    addPurchaseEntryStatus: s.addPurchaseEntryStatus,
    updatePurchaseEntryAction: s.updatePurchaseEntryAction,
    updatePurchaseEntryStatus: s.updatePurchaseEntryStatus,
    resetPurchaseEntryStatus: s.resetPurchaseEntryStatus,
  }));

  const addPurchaseEntry = (e) => {
    e.preventDefault();
    if (data?.id) {
      updatePurchaseEntryAction({
        ...inputValue,
        bookData: itemList,
      });
    } else {
      addPurchaseEntryAction({
        ...inputValue,
        bookData: itemList,
      });
    }
  };

  useEffect(() => {
    if (
      addPurchaseEntryStatus === STATUS.SUCCESS ||
      updatePurchaseEntryStatus === STATUS.SUCCESS
    ) {
      resetPurchaseEntryStatus();
      closeDrawer();
    }
  }, [
    addPurchaseEntryStatus,
    closeDrawer,
    resetPurchaseEntryStatus,
    updatePurchaseEntryStatus,
  ]);

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
                name="bookVendorId"
                label={"Select Book Vender"}
                autoFocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(allVendors, (vendor) => ({
                  name: vendor?.name,
                  value: vendor?.id,
                }))}
              />
              <Table my={2} w="100%" size={"sm"} variant={"simple"}>
                <Thead>
                  <Tr bg="gray.100">
                    <Th width={"45%"}>Book</Th>
                    <Th>Quantity</Th>
                    <Th>Price</Th>
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
                              focusBorderColor="green.400"
                              placeholder="Select Book"
                              value={item?.catelogId}
                              onChange={(e) =>
                                bookHandler(
                                  "catelogId",
                                  parseInt(e.target.value),
                                  index
                                )
                              }
                            >
                              {map(
                                concat(
                                  find(
                                    allCatalogs?.data,
                                    (s) => s?.id === item?.catelogId
                                  ) || [],
                                  unSelectedSubjects
                                ),
                                (c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.name}
                                  </option>
                                )
                              )}
                            </Select>
                          </FormControl>
                        </Td>
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
                            name="price"
                            label={"Price"}
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
                    type={"date"}
                    name="stockDate"
                    label={"Stock Date"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
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
                    w={"32%"}
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
            <Button
              size={"sm"}
              type={"submit"}
              isLoading={
                addPurchaseEntryStatus === STATUS.FETCHING ||
                updatePurchaseEntryStatus === STATUS.FETCHING
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
