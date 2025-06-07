import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  NotAllowedIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  Select,
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
import { useTransportStore } from "@/store/Transport";
import { STATUS } from "@/constant";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { CustomSelect } from "@/common/CustomSelect";
import MultiSelectSelector from "@/common/MultiSelectSelector";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { DownloadExcel } from "@/common/DownloadExcel";
import { RiFileExcel2Fill } from "react-icons/ri";

export const RouteWiseReport = ({ sessionMasterId, themeColor }) => {
  const [inputValue, setInputValue] = useState({});
  const { getRouteByIdAction, getShiftByIdStatus, SingleRouteDetail } =
    useAdditionalSetupStore((s) => ({
      getRouteByIdAction: s.getRouteByIdAction,
      getShiftByIdStatus: s.getShiftByIdStatus,
      SingleRouteDetail: s.SingleRouteDetail,
    }));

  useEffect(() => {
    const data = {
      transportRouteId: inputValue.transportRouteId,
      sessionMasterId,
    };
    if (!inputValue.transportRouteId) {
      return;
    }
    getRouteByIdAction(data);
  }, [inputValue.transportRouteId]);
  const {
    getRouteAction,
    getRouteStatus,
    allRoutes,
    getRouteWiseReportAction,
    getRouteWiseReportStatus,
    allRouteWiseReport,
  } = useTransportStore((s) => ({
    getRouteAction: s.getRouteAction,
    getRouteStatus: s.getRouteStatus,
    allRoutes: s.allRoutes,
    getRouteWiseReportAction: s.getRouteWiseReportAction,
    getRouteWiseReportStatus: s.getRouteWiseReportStatus,
    allRouteWiseReport: s.allRouteWiseReport,
  }));

  useEffect(() => {
    if ((getRouteStatus || 1) === STATUS.NOT_STARTED) {
      getRouteAction({ sessionMasterId });
    }
  }, [getRouteAction, getRouteStatus]);

  const getRouteReport = () => {
    getRouteWiseReportAction({
      sessionMasterId,
      ...inputValue,
    });
    setInputValue({});
  };

  const [excelData, setExcelData] = useState(null);
  useEffect(() => {
    if (allRouteWiseReport?.length > 0) {
      const mappedData = allRouteWiseReport.map((item) => ({
        ID: item.id,
        StudentName: item.promotion?.student_master?.studentName || "-",
        FatherName: item.promotion?.student_master?.fatherName || "-",
        MotherName: item.promotion?.student_master?.motherName || "-",
        ContactNumber: item.promotion?.student_master?.studentContact || "-",
        Email: item.promotion?.student_master?.studentEmail || "-",
        Address: item.promotion?.student_master?.address || "-",
        StationName: item.station_master?.name || "-",
        StationStatus:
          item.station_master?.isActive === 1 ? "Active" : "Inactive",
        RouteName: item.transport_route?.name || "-",
        PickupTime: item.pickupTime || "-",
        DropTime: item.dropTime || "-",
        CreatedAt: item.createdAt
          ? new Date(item.createdAt).toLocaleString()
          : "-",
      }));
      setExcelData(mappedData);
    }
  }, [allRouteWiseReport]);
  return (
    <Box>
      <PageHeader
        heading={"Route-Wise Report"}
        extra={
          <Tooltip label="Download Excel" placement="top">
            <DownloadExcel
              button={<RiFileExcel2Fill />}
              data={excelData}
              name={`Route Wise Report`}
            />
          </Tooltip>
        }
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box
          w={"100%"}
          className="scrollBar"
          maxH={"100%"}
          overflowY={"scroll"}
        >
          <Flex w={"70%"} gap={2} justify={"space-between"}>
            <CustomSelect
              // mt={5}
              name={"transportRouteId"}
              label={"Select Route"}
              inputValue={inputValue}
              setInputValue={setInputValue}
              data={map(allRoutes, (d, key) => ({
                value: d?.id,
                name: d?.name,
              }))}
            />
            <MultiSelectSelector
              label="Select Station"
              name="stationMasterId"
              options={SingleRouteDetail?.assign_stations.map((stat) => ({
                value: stat.station_master.id,
                name: stat.station_master.name,
              }))}
              selectedValues={inputValue.stationMasterId}
              setSelectedValues={(selectedSections) => {
                if (selectedSections?.includes("all")) {
                  setInputValue((prev) => ({
                    ...prev,
                    stationMasterId: "all",
                  }));
                } else {
                  setInputValue((prev) => ({
                    ...prev,
                    stationMasterId: selectedSections,
                  }));
                }
              }}
            />
            <Button
              size={"md"}
              width={"100px"}
              // mt={5}
              isDisabled={inputValue.transportRouteId ? false : true}
              colorScheme={themeColor}
              onClick={getRouteReport}
            >
              Get
            </Button>
          </Flex>
          <LoadingContainer status={getRouteWiseReportStatus}>
            {allRouteWiseReport?.length ? (
              <TableContainer mt={2}>
                <Table w="100%" size="sm" variant="simple">
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>S. No.</Th>
                      <Th>Station Name</Th>
                      <Th>Student Name</Th>
                      <Th>Father Name</Th>
                      <Th>Mother Name</Th>
                      <Th>Student Contact</Th>
                      <Th>Address</Th>
                      <Th>Transport Route</Th>
                      <Th>Vehicle ID</Th>
                      <Th>Pickup Time</Th>
                      <Th>Drop Time</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {allRouteWiseReport.map((item, index) => {
                      const {
                        station_master,
                        promotion,
                        transport_route,
                        pickupTime,
                        dropTime,
                        status,
                        vehicleId,
                      } = item;

                      const student = promotion?.student_master;

                      return (
                        <Tr key={item.id}>
                          <Td>{index + 1}</Td>
                          <Td>{station_master?.name || "N/A"}</Td>
                          <Td>{student?.studentName || "N/A"}</Td>
                          <Td>{student?.fatherName || "N/A"}</Td>
                          <Td>{student?.motherName || "N/A"}</Td>
                          <Td>{student?.studentContact || "N/A"}</Td>
                          <Td>{student?.address || "N/A"}</Td>
                          <Td>{transport_route?.name || "N/A"}</Td>
                          <Td>{vehicleId || "N/A"}</Td>
                          <Td>
                            {pickupTime
                              ? new Date(pickupTime).toLocaleTimeString()
                              : "N/A"}
                          </Td>
                          <Td>
                            {dropTime
                              ? new Date(dropTime).toLocaleTimeString()
                              : "N/A"}
                          </Td>
                          <Td>{status !== 0 ? "Inactive" : "Active"}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Data Found"} />
            )}
          </LoadingContainer>
        </Box>
      </Box>
    </Box>
  );
};
