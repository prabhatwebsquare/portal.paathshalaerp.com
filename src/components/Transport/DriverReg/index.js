import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
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
import React, { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { LoadingContainer } from "@/common/LoadingContainer";
import { DeleteButton } from "@/common/DeleteButton";
import { useTransportStore } from "@/store/Transport";
import { AddDriver } from "./AddDriver";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { FILE_URL } from "@/services/apis";
import { MdLocalPrintshop } from "react-icons/md";
import { DownloadExcel } from "@/common/DownloadExcel";
import { RiFileExcel2Fill } from "react-icons/ri";
import { SchoolHeader } from "@/common/SchoolHeader";
import { useReactToPrint } from "react-to-print";

export const DriverRegistration = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const {
    getDriverAction,
    getDriverStatus,
    allDrivers,
    resetTransportData,
    deleteDriverAction,
    deleteDriverStatus,
    resetDriverStatus,
  } = useTransportStore((s) => ({
    getDriverAction: s.getDriverAction,
    getDriverStatus: s.getDriverStatus,
    allDrivers: s.allDrivers,
    resetTransportData: s.resetTransportData,
    deleteDriverAction: s.deleteDriverAction,
    deleteDriverStatus: s.deleteDriverStatus,
    resetDriverStatus: s.resetDriverStatus,
  }));

  useEffect(() => {
    if ((getDriverStatus || 1) === STATUS.NOT_STARTED) {
      getDriverAction();
    }
  }, [getDriverAction, getDriverStatus]);

  useEffect(() => {
    return () => resetTransportData();
  }, [resetTransportData]);

  const deleteDriver = (id) => {
    deleteDriverAction(id);
  };
  const [excelData, setExcelData] = useState(null);

  useEffect(() => {
    if (allDrivers?.length) {
      const driverExcelData = allDrivers.map((driver, index) => ({
        SNo: index + 1,
        Name: driver?.name || "N/A",
        MobileNo: driver?.mobileNo || "N/A",
        LicenceNo: driver?.licenceNo || "N/A",
        Address: driver?.address || "N/A",
        Status: driver?.status === 1 ? "Active" : "Inactive",
      }));

      setExcelData(driverExcelData);
    }
  }, [allDrivers]);
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Registered Driver",
  });
  return (
    <Box>
      <PageHeader
        heading={"Drivers"}
        extra={
          <Flex>
            {HasPermission(PERMISSIONS.DRIVER_REG_ADD) && (
              <Button
                size={"sm"}
                mr={3}
                colorScheme={themeColor}
                onClick={() => setToggleDrawer([])}
              >
                Add New Driver
              </Button>
            )}
            <Tooltip label="Print" placement="top">
              <Button
                mr={3}
                size={"sm"}
                onClick={handlePrint}
                colorScheme={themeColor}
              >
                <MdLocalPrintshop fontSize={18} />
              </Button>
            </Tooltip>
            <Tooltip label="Download Excel" placement="top">
              <DownloadExcel
                button={<RiFileExcel2Fill />}
                data={excelData}
                name={"Registered Driver"}
              />
            </Tooltip>
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
          <LoadingContainer status={getDriverStatus}>
            <TableContainer mt={2}>
              <Table w="100%" size={"sm"} variant={"simple"}>
                <Thead>
                  <Tr bg="gray.100">
                    <Th>S.No.</Th>
                    <Th>Driver Name</Th>
                    <Th>Mobile No</Th>
                    <Th>Licence No.</Th>
                    <Th>Address</Th>
                    <Th>Status</Th>
                    {HasPermission(PERMISSIONS.DRIVER_REG_EDIT) ||
                    HasPermission(PERMISSIONS.DRIVER_REG_DELETE) ? (
                      <Th>Action</Th>
                    ) : null}
                  </Tr>
                </Thead>
                <Tbody>
                  {allDrivers?.length ? (
                    allDrivers.map((driver, index) => (
                      <Tr key={driver.id}>
                        <Td>{index + 1}</Td>
                        <Td>
                          <Flex align="center" gap={3}>
                            <Avatar size="sm" src={FILE_URL + driver?.photo} />
                            <Text>{driver?.name || "N/A"}</Text>
                          </Flex>
                        </Td>
                        <Td>{driver?.mobileNo || "N/A"}</Td>
                        <Td>{driver?.licenceNo || "N/A"}</Td>
                        <Td>{driver?.address || "N/A"}</Td>
                        <Td>
                          <Badge
                            variant="outline"
                            colorScheme={driver?.status === 1 ? "green" : "red"}
                          >
                            {driver?.status === 1 ? "Active" : "Inactive"}
                          </Badge>
                        </Td>
                        {(HasPermission(PERMISSIONS.DRIVER_REG_EDIT) ||
                          HasPermission(PERMISSIONS.DRIVER_REG_DELETE)) && (
                          <Td>
                            <HStack spacing={3}>
                              {HasPermission(PERMISSIONS.DRIVER_REG_EDIT) && (
                                <Tooltip label="Edit" placement="top">
                                  <IconButton
                                    size="sm"
                                    variant="ghost"
                                    icon={<EditIcon />}
                                    colorScheme={themeColor}
                                    onClick={() => setToggleDrawer(driver)}
                                  />
                                </Tooltip>
                              )}
                              {HasPermission(PERMISSIONS.DRIVER_REG_DELETE) && (
                                <DeleteButton
                                  description="Are you sure? Do you want to delete?"
                                  confirm={() => deleteDriver(driver?.id)}
                                  status={deleteDriverStatus}
                                  reset={resetDriverStatus}
                                />
                              )}
                            </HStack>
                          </Td>
                        )}
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={7}>
                        <NoData title="No Driver Found" />
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </LoadingContainer>
        </Box>
        {toggleDrawer && (
          <AddDriver
            data={toggleDrawer}
            closeDrawer={() => setToggleDrawer(null)}
            themeColor={themeColor}
          />
        )}
      </Box>

      <Box display="none">
        <Box ref={printRef} p={5}>
          <style>{`
                  @media print {
                    @page { size: A4 portrait; margin: 1cm; }
                  }
                `}</style>

          <SchoolHeader
            title="Cash Book"
          />
          <TableContainer mt={2}>
            <Table w="100%" size={"sm"} variant={"simple"}>
              <Thead>
                <Tr bg="gray.100">
                  <Th>S.No.</Th>
                  <Th>Driver Name</Th>
                  <Th>Mobile No</Th>
                  <Th>Licence No.</Th>
                  <Th>Address</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {allDrivers?.length ? (
                  allDrivers.map((driver, index) => (
                    <Tr key={driver.id}>
                      <Td>{index + 1}</Td>
                      <Td>
                        <Flex align="center" gap={3}>
                          <Avatar size="sm" src={FILE_URL + driver?.photo} />
                          <Text>{driver?.name || "N/A"}</Text>
                        </Flex>
                      </Td>
                      <Td>{driver?.mobileNo || "N/A"}</Td>
                      <Td>{driver?.licenceNo || "N/A"}</Td>
                      <Td>{driver?.address || "N/A"}</Td>
                      <Td>
                        <Badge
                          variant="outline"
                          colorScheme={driver?.status === 1 ? "green" : "red"}
                        >
                          {driver?.status === 1 ? "Active" : "Inactive"}
                        </Badge>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={7}>
                      <NoData title="No Driver Found" />
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};
