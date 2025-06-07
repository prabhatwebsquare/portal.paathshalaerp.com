import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import * as XLSX from "xlsx";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { AddCatalog } from "./AddCatalog";
import { LoadingContainer } from "@/common/LoadingContainer";
import { DeleteButton } from "@/common/DeleteButton";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { useLibraryStore } from "@/store/Library";
import { URL } from "@/services/apis";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import Pagination from "@/common/Pagination";
import CustomInput from "@/common/CustomInput";
import { GrPowerReset } from "react-icons/gr";

export const Catalog = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [inputValue, setInputValue] = useState({ search: "" });
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    getCatalogAction,
    getCatalogStatus,
    allCatalogs,
    resetCatalogData,
    deleteCatalogAction,
    deleteCatalogStatus,
    resetCatalogStatus,
  } = useLibraryStore((s) => ({
    getCatalogAction: s.getCatalogAction,
    getCatalogStatus: s.getCatalogStatus,
    allCatalogs: s.allCatalogs,
    resetCatalogData: s.resetCatalogData,
    resetTransportData: s.resetTransportData,
    deleteCatalogAction: s.deleteCatalogAction,
    deleteCatalogStatus: s.deleteCatalogStatus,
    resetCatalogStatus: s.resetCatalogStatus,
  }));

  useEffect(() => {
    if ((getCatalogStatus || 1) === STATUS.NOT_STARTED) {
      getCatalogAction({ page: 1, limit: 10 });
    }
  }, [getCatalogAction, getCatalogStatus]);

  useEffect(() => {
    if (currentPage && limit)
      getCatalogAction({
        page: currentPage,
        limit: parseInt(limit),
        ...inputValue,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, getCatalogAction, limit, sessionMasterId]);

  const searchBook = () => {
    setCurrentPage(1);
    getCatalogAction({ page: 1, limit: 10, ...inputValue });
  };

  const reset = () => {
    setCurrentPage(1);
    setInputValue({ search: "" });
    getCatalogAction({ page: 1, limit: 10, search: "" });
  };

  useEffect(() => {
    return () => resetCatalogData();
  }, [resetCatalogData]);

  const deleteCatalog = (id) => {
    deleteCatalogAction(id);
  };
  const exportToExcel = () => {
    const headers = [
      "S.No.",
      "Name",
      "Author",
      "ISBN",
      "Catalog Type",
      "Type",
      "Genre",
      "Publisher",
      "Year of Publication",
      "Edition",
      "Language",
      "Damage Amount",
      "Lost Amount",
      "Description",
    ];

    const data = allCatalogs?.data?.map((catalog, index) => [
      index + 1,
      catalog.name,
      catalog.author,
      catalog.isbn,
      catalog.catelogType,
      catalog.book_type?.name,
      catalog.genre,
      catalog.publisher,
      catalog.yearOfPublication,
      catalog.edition,
      catalog.language,
      catalog.damageAmount,
      catalog.lostAmount,
      catalog.description,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Catalogs");
    XLSX.writeFile(workbook, "Catalogs.xlsx");
  };

  return (
    <Box>
      <PageHeader
        heading={"Catalogs"}
        extra={
          <Flex>
            {HasPermission(PERMISSIONS.CATALOG_ADD) && (
              <Button
                size={"sm"}
                colorScheme={themeColor}
                leftIcon={<AddIcon />}
                onClick={() => setToggleDrawer([])}
              >
                Add Catalog
              </Button>
            )}
            <Button
              size={"sm"}
              colorScheme={"green"}
              ml={3}
              onClick={exportToExcel}
            >
              Export to Excel
            </Button>
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
          <Flex mt={2} justify={"space-between"}>
            <Flex w={"45%"}>
              <CustomInput
                autoFocus={true}
                size={"sm"}
                type={"text"}
                name="search"
                label={"Search By Name/Author"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <Button
                ml={2}
                size={"sm"}
                colorScheme={themeColor}
                isDisabled={inputValue?.search ? false : true}
                onClick={searchBook}
              >
                Get
              </Button>
              <Button
                ml={2}
                size={"sm"}
                leftIcon={<GrPowerReset />}
                onClick={reset}
              >
                Reset
              </Button>
            </Flex>
            <Pagination
              totalItems={allCatalogs?.catesCount}
              limit={limit}
              setLimit={setLimit}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              themeColor={themeColor}
            />
          </Flex>
          <LoadingContainer status={getCatalogStatus}>
            {allCatalogs?.data?.length ? (
              <TableContainer mt={2}>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>S.No.</Th>
                      <Th>Name</Th>
                      <Th>Author</Th>
                      <Th>ISBN</Th>
                      <Th>Catalog Type</Th>
                      <Th>Type</Th>
                      <Th>Genre</Th>
                      <Th>Publisher</Th>
                      <Th>Year of Publication</Th>
                      <Th>Edition</Th>
                      <Th>Language</Th>
                      <Th>Damage Amount</Th>
                      <Th>Lost Amount</Th>
                      <Th>Description</Th>
                      {HasPermission(PERMISSIONS.CATALOG_EDIT) ||
                      HasPermission(PERMISSIONS.CATALOG_DELETE) ? (
                        <Th>Action</Th>
                      ) : null}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(allCatalogs.data, (catalog, index) => (
                      <Tr key={catalog.id}>
                        <Td>{index + 1}</Td>
                        <Td>{catalog.name}</Td>
                        <Td>{catalog.author}</Td>
                        <Td>{catalog.isbn}</Td>
                        <Td>{catalog.catelogType}</Td>
                        <Td>{catalog.book_type?.name}</Td>
                        <Td>{catalog.genre}</Td>
                        <Td>{catalog.publisher}</Td>
                        <Td>{catalog.yearOfPublication}</Td>
                        <Td>{catalog.edition}</Td>
                        <Td>{catalog.language}</Td>
                        <Td>{catalog.damageAmount}</Td>
                        <Td>{catalog.lostAmount}</Td>
                        <Td>{catalog.description}</Td>
                        {HasPermission(PERMISSIONS.CATALOG_EDIT) ||
                        HasPermission(PERMISSIONS.CATALOG_DELETE) ? (
                          <Td>
                            {HasPermission(PERMISSIONS.CATALOG_EDIT) && (
                              <Tooltip placement="top" label="Edit">
                                <IconButton
                                  mr={3}
                                  size={"sm"}
                                  variant={"ghost"}
                                  icon={<EditIcon />}
                                  colorScheme={themeColor}
                                  onClick={() => setToggleDrawer(catalog)}
                                />
                              </Tooltip>
                            )}
                            {HasPermission(PERMISSIONS.CATALOG_DELETE) && (
                              <DeleteButton
                                description={
                                  "Are you sure? Do you want to delete?"
                                }
                                confirm={() => deleteCatalog(catalog.id)}
                                status={deleteCatalogStatus}
                                reset={resetCatalogStatus}
                              />
                            )}
                          </Td>
                        ) : null}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Catalog Found"} />
            )}
          </LoadingContainer>
        </Box>
        {toggleDrawer && (
          <AddCatalog
            data={toggleDrawer}
            closeDrawer={() => setToggleDrawer(null)}
            themeColor={themeColor}
          />
        )}
      </Box>
    </Box>
  );
};
