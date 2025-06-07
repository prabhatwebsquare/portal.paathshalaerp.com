import CustomArrayInput from "@/common/CustomArrayInput";
import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { DownloadExcel } from "@/common/DownloadExcel";
import UploadExcel from "@/common/UploadExcel";
import { STATUS } from "@/constant";
import { STOCKFIELDS } from "@/constant/StockField";
import { useLibraryStore } from "@/store/Library";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Flex,
  FormControl,
  IconButton,
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
import dayjs from "dayjs";
import {
  cloneDeep,
  concat,
  filter,
  find,
  findIndex,
  includes,
  map,
  reject,
  uniqBy,
} from "lodash";
import React, { useEffect, useMemo, useState } from "react";

export const BulkStockEntry = ({ data, closeModal, themeColor }) => {
  const stockField = STOCKFIELDS.reduce((obj, field) => {
    obj[field.name] = "";
    return obj;
  }, {});

  const isMac = process.platform === "darwin";
  const excelEpoch = isMac ? 24107 : 25569;
  const [excelData, setExcelData] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const allData = useMemo(() => {
    return excelData?.slice(1);
  }, [excelData]);

  const handleCheck = (row) => {
    if (findIndex(selectedData, (s) => s[0] === row[0]) !== -1) {
      setSelectedData(filter(selectedData, (s) => s[0] !== row[0]));
    } else {
      setSelectedData(concat(selectedData, [row]));
    }
  };

  const handleCheckAll = () => {
    if (allData?.length === selectedData?.length) {
      setSelectedData([]);
    } else {
      setSelectedData(allData);
    }
  };

  const {
    bulkUploadCatalogAction,
    bulkUploadCatalogStatus,
    resetBulkUploadCatalogData,
  } = useLibraryStore((s) => ({
    bulkUploadCatalogAction: s.bulkUploadCatalogAction,
    bulkUploadCatalogStatus: s.bulkUploadCatalogStatus,
    resetBulkUploadCatalogData: s.resetBulkUploadCatalogData,
  }));

  const addPurchaseEntry = (e) => {
    e.preventDefault();


    bulkUploadCatalogAction({
      data: map(selectedData, (data) => {
        return {
          ...STOCKFIELDS.reduce((obj, field, index) => {
            obj[field.id] =
              field.id === "stockDate" || field.id === "billDate"
                ? data[index]
                  ? dayjs
                      .unix((data[index] - excelEpoch) * 24 * 60 * 60)
                      .format("YYYY-MM-DD")
                  : null
                : data[index];
            return obj;
          }, {}),
          catelogType: "Book",
        };
      }),
    });
  };

  useEffect(() => {
    if (bulkUploadCatalogStatus === STATUS.SUCCESS) {
      resetBulkUploadCatalogData();
      closeModal();
    }
  }, [bulkUploadCatalogStatus, closeModal, resetBulkUploadCatalogData]);

  return (
    <Modal size={"5xl"} isOpen={data} placement="right" onClose={closeModal}>
      <ModalOverlay />
      <form onSubmit={addPurchaseEntry}>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Bulk Stock Entry</ModalHeader>

          <ModalBody>
            <Flex mb={5}>
              <Flex gap={3} w={"100%"} justify={"flex-end"}>
                <DownloadExcel data={[stockField]} name={"Bulk Stock Entry"} />
                <UploadExcel
                  themeColor={themeColor}
                  setExcelData={setExcelData}
                />
              </Flex>
            </Flex>
            {excelData?.length ? (
              <Box
                w={"100%"}
                className="scrollBar"
                maxH={"50vh"}
                overflowY={"scroll"}
              >
                <TableContainer>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>
                          <Checkbox
                            isChecked={
                              allData?.length === selectedData?.length
                                ? true
                                : false
                            }
                            onChange={handleCheckAll}
                          />
                        </Th>
                        {excelData[0].map((header, index) => (
                          <Th key={index}>{header}</Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {excelData.slice(1)?.map((row, rowIndex) => {
                        const selected = find(
                          selectedData,
                          (s) => s[0] === row[0]
                        );
                        return (
                          <Tr key={rowIndex}>
                            <Td>
                              <Checkbox
                                isChecked={selected ? true : false}
                                onChange={() => handleCheck(row)}
                              />
                            </Td>
                            {map(new Array(17), (a, cellIndex) => {
                              const cell = row[cellIndex];
                              return (
                                <Td key={cellIndex}>
                                  {cell}
                                  {/* {(cellIndex === 2 || cellIndex === 7) ? (cell ? dayjs.unix((cell - excelEpoch) * 24 * 60 * 60).format("DD-MM-YYYY") : "")
                                                                        : cellIndex === 12 ?
                                                                            (cell === true ? "TRUE" : cell === false ? "FALSE" : cell)
                                                                            : cell
                                                                    } */}
                                </Td>
                              );
                            })}
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            ) : null}
          </ModalBody>

          <ModalFooter>
            <Button
              size={"sm"}
              variant="outline"
              mr={3}
              colorScheme={"red"}
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              size={"sm"}
              type={"submit"}
              isDisabled={selectedData?.length ? false : true}
              isLoading={bulkUploadCatalogStatus === STATUS.FETCHING}
              colorScheme={themeColor}
            >
              {data?.id ? "Update" : "Upload"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
