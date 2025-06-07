import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { FixedSizeList as List } from "react-window";
import { useDispatch, useSelector } from "react-redux";
import { find, findIndex, map } from "lodash";
import { PageHeader } from "@/common/PageHeader";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { AddAccession } from "./AddAccession";
import { useLibraryStore } from "@/store/Library";
import { MdLocalPrintshop } from "react-icons/md";
import { BarcodeUi } from "./BarcodeUi";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { CustomSelect } from "@/common/CustomSelect";
import { EditIcon } from "@chakra-ui/icons";
import { EditAccession } from "./EditAccession";
import { wrapper } from "@/store";
import { fetchCatalogLimitRequest } from "@/Redux/catalogSlice";
import VirtualizedMenu from "./VirtualizedMen";
import { selectAllCatalogLimit } from "@/Redux/catalogSelectors";

export const Accession = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [toggleEditDrawer, setToggleEditDrawer] = useState(null);
  const [toggleModal, setToggleModal] = useState(null);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [inputValue, setInputValue] = useState({});
  const [isCatalogLimitLoading, setIsCatalogLimitLoading] = useState(true);

  const {
    getCatalogLimitAction,
    getCatalogLimitStatus,
    allCatalogLimit,
    resetCatalogData,
    getAccessionAction,
    getAccessionStatus,
    allAccessions,
    resetAccessionData,
  } = useLibraryStore((s) => ({
    getCatalogLimitAction: s.getCatalogLimitAction,
    getCatalogLimitStatus: s.getCatalogLimitStatus,
    allCatalogLimit: s.allCatalogLimit,
    resetCatalogData: s.resetCatalogData,
    getAccessionAction: s.getAccessionAction,
    getAccessionStatus: s.getAccessionStatus,
    allAccessions: s.allAccessions,
    resetAccessionData: s.resetAccessionData,
  }));

  // Fetch catalog limit data initially
  useEffect(() => {
    if ((getCatalogLimitStatus || 1) === STATUS.NOT_STARTED) {
      getCatalogLimitAction({ limit: 1000000, page: 1 }).finally(() => {
        setIsCatalogLimitLoading(false); // Stop loading once data is fetched
      });
    } else {
      setIsCatalogLimitLoading(false); // Stop loading if already fetched
    }
  }, [getCatalogLimitAction, getCatalogLimitStatus]);

  // Reset catalog data on component unmount
  useEffect(() => {
    return () => resetCatalogData();
  }, [resetCatalogData]);

  const getAccession = () => {
    getAccessionAction(inputValue);
  };
  useEffect(() => {
    return () => resetAccessionData();
  }, [resetAccessionData]);

  const selectAllBooks = () => {
    if (selectedBooks?.length === allAccessions?.length) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(map(allAccessions, "accessionFormNo"));
    }
  };

  const handleCheck = (id) => {
    if (findIndex(selectedBooks, (s) => s === id) !== -1) {
      setSelectedBooks(filter(selectedBooks, (s) => s !== id));
    } else {
      setSelectedBooks([...selectedBooks, id]);
    }
  };
  const catalogData = useSelector(selectAllCatalogLimit);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCatalogLimitRequest(1000000, 1));

    return () => {};
  }, []);
  // Handler for item selection
  const onSelect = (id, isChecked) => {
    let updatedCatalogIds = [...(inputValue?.catelogId || [])];
    if (isChecked) {
      updatedCatalogIds.push(id);
    } else {
      updatedCatalogIds = updatedCatalogIds.filter((itemId) => itemId !== id);
    }
    inputHandler("catelogId", updatedCatalogIds);
  };

  // Handler for 'Select All' checkbox
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const allIds = catalogData?.data.map((item) => item.id); // Assuming catalogData is available

    inputHandler("catelogId", isChecked ? allIds : []);
  };

  // Handler to update input values
  const inputHandler = (name, val) => {
    setInputValue((prevValue) => ({ ...prevValue, [name]: val }));
  };

  return (
    <Box>
      <PageHeader
        heading={"Accession"}
        extra={
          <Flex gap={3}>
            {HasPermission(PERMISSIONS.ACCESSION_ADD) && (
              <Button
                size={"sm"}
                colorScheme={themeColor}
                onClick={() => setToggleDrawer([])}
              >
                Add Accession
              </Button>
            )}
            {allAccessions?.length > 0 && (
              <Button
                size={"sm"}
                colorScheme={themeColor}
                leftIcon={<MdLocalPrintshop />}
                onClick={() => setToggleModal(selectedBooks)}
              >
                Barcode
              </Button>
            )}
          </Flex>
        }
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box
          className="scrollBar"
          h={"100%"}
          maxH={"100%"}
          overflowY={"scroll"}
        >
          <Flex w={"40vw"} className="container" gap={3}>
            <Menu closeOnSelect={false}>
              <MenuButton w={"30vw"} colorScheme="blue">
                <Flex
                  px={3}
                  py={1}
                  border={"1px solid"}
                  borderColor={"gray.200"}
                  fontSize={13}
                  fontWeight={"bold"}
                  color={"blue.800"}
                >
                  Select Book
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuOptionGroup
                  title="Select Book"
                  type="checkbox"
                  onChange={handleSelectAll}
                >
                  <VirtualizedMenu
                    data={catalogData?.data || []}
                    inputValue={inputValue}
                    onSelect={onSelect}
                  />
                </MenuOptionGroup>
              </MenuList>
            </Menu>
            <Button
              size={"sm"}
              isDisabled={inputValue?.catelogId ? false : true}
              colorScheme={themeColor}
              onClick={getAccession}
            >
              Get
            </Button>
          </Flex>
          <LoadingContainer status={getAccessionStatus}>
            {allAccessions?.length ? (
              <TableContainer mt={2}>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>
                        <Checkbox
                          colorScheme={themeColor}
                          isChecked={
                            selectedBooks?.length === allAccessions?.length
                              ? true
                              : false
                          }
                          onChange={selectAllBooks}
                        />
                      </Th>
                      <Th>S.No.</Th>
                      <Th>Book Name</Th>
                      <Th>Book Type</Th>
                      <Th>Author</Th>
                      <Th>Publisher</Th>
                      <Th>Accession No</Th>
                      <Th>Shelf</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(allAccessions, (accession, index) => {
                      const isChecked =
                        findIndex(
                          selectedBooks,
                          (s) => s === accession?.accessionFormNo
                        ) !== -1
                          ? true
                          : false;
                      return accession ? (
                        <Tr key={index}>
                          <Td>
                            <Checkbox
                              colorScheme={themeColor}
                              isChecked={isChecked}
                              onChange={() =>
                                handleCheck(accession?.accessionFormNo)
                              }
                            />
                          </Td>
                          <Td>{index + 1}</Td>
                          <Td>{accession?.catelog?.name}</Td>
                          <Td>{accession.catelog?.catelogType}</Td>
                          <Td>{accession.catelog?.author}</Td>
                          <Td>{accession.catelog?.publisher}</Td>
                          <Td>{accession?.accessionFormNo}</Td>
                          <Td>{accession.shelf_location?.name}</Td>
                          <Td>
                            <Tooltip placement="top" label="Edit">
                              <IconButton
                                mr={3}
                                size={"sm"}
                                variant={"ghost"}
                                icon={<EditIcon />}
                                colorScheme={themeColor}
                                onClick={() => setToggleEditDrawer(accession)}
                              />
                            </Tooltip>
                          </Td>
                        </Tr>
                      ) : null;
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Accession Found"} />
            )}
          </LoadingContainer>
        </Box>
        {toggleDrawer && (
          <AddAccession
            allCatalogs={allCatalogLimit}
            data={toggleDrawer}
            closeDrawer={() => setToggleDrawer(null)}
            themeColor={themeColor}
          />
        )}
        {toggleEditDrawer && (
          <EditAccession
            allCatalogs={allCatalogLimit}
            data={toggleEditDrawer}
            closeDrawer={() => setToggleEditDrawer(null)}
            themeColor={themeColor}
          />
        )}
        {toggleModal && (
          <BarcodeUi
            data={toggleModal}
            closeModal={() => setToggleModal(null)}
            themeColor={themeColor}
          />
        )}
      </Box>
    </Box>
  );
};
