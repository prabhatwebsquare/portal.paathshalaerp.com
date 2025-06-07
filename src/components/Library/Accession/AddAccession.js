import CustomArrayInput from "@/common/CustomArrayInput";
import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useLibraryStore } from "@/store/Library";
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
  FormControl,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { find, map } from "lodash";
import React, { useEffect, useState } from "react";

export const AddAccession = ({
  allCatalogs,
  data,
  closeDrawer,
  themeColor,
}) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          id: data.id,
        }
      : {}
  );

  const nothing = () => {};
  const { getShelfLocationAction, getShelfLocationStatus, allShelfLocations } =
    useLibraryStore((s) => ({
      getShelfLocationAction: s.getShelfLocationAction,
      getShelfLocationStatus: s.getShelfLocationStatus,
      allShelfLocations: s.allShelfLocations,
    }));

  useEffect(() => {
    if ((getShelfLocationStatus || 1) === STATUS.NOT_STARTED) {
      getShelfLocationAction();
    }
  }, [getShelfLocationAction, getShelfLocationStatus]);

  const {
    getCatalogDataAction,
    getCatalogDataStatus,
    allCatalogDatas,
    addAccessionAction,
    addAccessionStatus,
    updateAccessionAction,
    updateAccessionStatus,
    resetAccessionStatus,
  } = useLibraryStore((s) => ({
    getCatalogDataAction: s.getCatalogDataAction,
    getCatalogDataStatus: s.getCatalogDataStatus,
    allCatalogDatas: s.allCatalogDatas,
    addAccessionAction: s.addAccessionAction,
    addAccessionStatus: s.addAccessionStatus,
    updateAccessionAction: s.updateAccessionAction,
    updateAccessionStatus: s.updateAccessionStatus,
    resetAccessionStatus: s.resetAccessionStatus,
  }));

  useEffect(() => {
    if (inputValue?.catelogId) {
      getCatalogDataAction(inputValue.catelogId);
    }
  }, [getCatalogDataAction, inputValue?.catelogId]);

  useEffect(() => {
    if (allCatalogDatas) {
      setInputValue((pre) => ({
        ...pre,
        accessionFormNo: (parseInt(allCatalogDatas.accessionFormNo, 10) + 1)
          .toString()
          .padStart(8, "0"),
        quantity: parseInt(allCatalogDatas.quantity).toString(),
      }));
    }
  }, [allCatalogDatas]);

  const [itemList, setItemList] = useState();

  const generateData = () => {
    const book = find(
      allCatalogs?.data,
      (c) => c.id === parseInt(inputValue.catelogId)
    )?.name;
    setItemList(
      map(new Array(allCatalogDatas.quantity), (a, i) => ({
        catelogId: inputValue?.catelogId,
        bookName: book,
        accessionFormNo: (parseInt(inputValue?.accessionFormNo, 10) + i)
          .toString()
          .padStart(8, "0"),
        shelfLocationId: inputValue?.shelfLocationId,
      }))
    );
  };

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

  const addAccession = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateAccessionAction(inputValue);
    } else {
      addAccessionAction({ accessionData: itemList });
    }
  };

  useEffect(() => {
    if (
      addAccessionStatus === STATUS.SUCCESS ||
      updateAccessionStatus === STATUS.SUCCESS
    ) {
      resetAccessionStatus();
      closeDrawer();
    }
  }, [
    addAccessionStatus,
    closeDrawer,
    resetAccessionStatus,
    updateAccessionStatus,
  ]);

  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addAccession}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Accession" : "Add New Accession"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomSelect
                name="catelogId"
                label={"Select Book"}
                inputValue={inputValue}
                autoFocus={true}
                setInputValue={setInputValue}
                data={map(allCatalogs?.data, (c) => ({
                  name: c.name,
                  value: c.id,
                }))}
              />
              <LoadingContainer status={getCatalogDataStatus}>
                <CustomInput
                  type={"text"}
                  name="quantity"
                  label={"Quantity"}
                  inputValue={inputValue}
                  setInputValue={nothing}
                />
                <CustomInput
                  type={"text"}
                  name="accessionFormNo"
                  label={"Accession No From"}
                  inputValue={inputValue}
                  setInputValue={nothing}
                />
              </LoadingContainer>
              <CustomSelect
                name="shelfLocationId"
                label={"Select Shelf"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(allShelfLocations, (s) => ({
                  name: s.name,
                  value: s.id,
                }))}
              />
              <Flex w={"100%"} justify={"flex-end"}>
                <Button
                  size={"sm"}
                  colorScheme={themeColor}
                  isDisabled={
                    inputValue?.catelogId && inputValue?.shelfLocationId
                      ? false
                      : true
                  }
                  onClick={generateData}
                >
                  Generate
                </Button>
              </Flex>
              {itemList?.length ? (
                <TableContainer w={"100%"}>
                  <Table mt={3} w="100%" size={"sm"} variant={"simple"}>
                    <Thead>
                      <Tr bg="gray.100">
                        <Th width={"25%"}>S No.</Th>
                        <Th>Book Name</Th>
                        <Th>Accession No</Th>
                        <Th>Rack</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {map(itemList, (sub, index) => {
                        return (
                          <Tr key={index}>
                            <Td>{index + 1}</Td>
                            <Td>{sub.bookName}</Td>
                            <Td>{sub.accessionFormNo}</Td>
                            <Td>
                              {/* <CustomArrayInput size={"sm"} type={"number"} index={index} name="shelfLocationId" label={"Shelf"} inputValue={sub} setInputValue={setItemList} /> */}
                              <FormControl isRequired>
                                <Select
                                  size={"sm"}
                                  fontWeight={"semibold"}
                                  focusBorderColor={`${themeColor}.400`}
                                  placeholder="Select Shelf"
                                  value={sub?.shelfLocationId || ""}
                                  onChange={(e) =>
                                    itemHandler(
                                      "shelfLocationId",
                                      parseInt(e.target.value),
                                      index
                                    )
                                  }
                                >
                                  {map(allShelfLocations, (c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.name}
                                    </option>
                                  ))}
                                </Select>
                              </FormControl>
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
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
            <Button
              size={"sm"}
              type={"submit"}
              isDisabled={itemList?.length ? false : true}
              isLoading={
                addAccessionStatus === STATUS.FETCHING ||
                updateAccessionStatus === STATUS.FETCHING
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
