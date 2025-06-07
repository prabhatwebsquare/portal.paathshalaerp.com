import { PageHeader } from "@/common/PageHeader";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MdCurrencyRupee, MdLocalPrintshop } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import { useReactToPrint } from "react-to-print";
import CustomInput from "@/common/CustomInput";
import { EditIcon } from "@chakra-ui/icons";
import { STATUS } from "@/constant";
import dayjs from "dayjs";
import { useStdFeesStore } from "@/store/stdFees";
import { map, sumBy, toUpper } from "lodash";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/LocalStorage";
import { LoadingContainer } from "@/common/LoadingContainer";
import { ConfirmAlert } from "@/common/ConfirmationAlert";
import { ReceiptDrawer } from "@/components/fees/ReceiptDrawer";
import { EditFees } from "@/components/fees/EditFees";
import { GrPowerReset } from "react-icons/gr";
import Pagination from "@/common/Pagination";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { useTransportStore } from "@/store/Transport";

export const TransportFeesList = ({ themeColor, sessionMasterId }) => {
  const [printProps, setPrintProps] = useState(null);
  const [inputValue, setInputValue] = useState({
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });
  const school = useMemo(() => getLocalStorageItem("user"), []);
  const [toggleFeesEdit, setToggleFeesEdit] = useState(null);
  const [toggleReceiptModal, setToggleReceiptModal] = useState(null);
  const [toggleConfirm, setToggleConfirm] = useState(null);

  const {
    getCollectionsAction,
    getCollectionsStatus,
    collectionsData,
    resetFeeCollection,
    getFeesReceiptAction,
    getFeesReceiptStatus,
    feeReceiptData,
    resetFeesReceipt,
    cancelFeesAction,
  } = useStdFeesStore((s) => ({
    getCollectionsAction: s.getCollectionsAction,
    getCollectionsStatus: s.getCollectionsStatus,
    collectionsData: s.collectionsData,
    resetFeeCollection: s.resetFeeCollection,
    getFeesReceiptAction: s.getFeesReceiptAction,
    getFeesReceiptStatus: s.getFeesReceiptStatus,
    feeReceiptData: s.feeReceiptData,
    resetFeesReceipt: s.resetFeesReceipt,
    cancelFeesAction: s.cancelFeesAction,
  }));

  useEffect(() => {
    if ((getCollectionsStatus || 1) === STATUS.NOT_STARTED) {
      getCollectionsAction({
        receiptNo: inputValue.receiptNo,
        feesMode: 2,
        sessionMasterId,
        page: 1,
        limit: 1000,
        type: "all",
        userId: "all",
      });
    }
  }, [
    getCollectionsAction,
    getCollectionsStatus,
    inputValue,
    resetFeeCollection,
    sessionMasterId,
  ]);

  useEffect(() => {
    return () => resetFeeCollection();
  }, [resetFeeCollection]);

  const getData = (e) => {
    e.preventDefault();
    getCollectionsAction({
      receiptNo: inputValue.receiptNo,
      feesMode: 2,
      sessionMasterId,
      type: "all",
      userId: "all",
      page: 1,
      limit: 1000,
    });
  };

  const editGetData = () => {
    if (inputValue.receiptNo) {
      getCollectionsAction({
        receiptNo: inputValue.receiptNo,
        feesMode: 2,
        sessionMasterId,
        page: 1,
        limit: 1000,
        type: "all",
        userId: "all",
      });
    } else {
      getCollectionsAction({
        type: "all",
        userId: "all",
        sessionMasterId,
        feesMode: 2,
        page: 1,
        limit: 1000,
      });
    }
  };

  const receiptPrint = (data) => {
    getFeesReceiptAction({
      sessionMasterId,
      schoolCode: school?.schoolData?.schoolCode,
      promotionId: data.promotionId,
      feesReportId: data?.id,
    });
  };

  const cancelFee = async () => {
    await cancelFeesAction({
      id: toggleConfirm,
      status: "Cancelled",
      isDelete: 1,
    });
    setToggleConfirm(null);
    getCollectionsAction({
      type: "all",
      userId: "all",
      sessionMasterId,
      feesMode: 2,
      page: 1,
      limit: 1000,
    });
  };

  useEffect(() => {
    if (getFeesReceiptStatus === STATUS.SUCCESS) {
      resetFeesReceipt();
      setToggleReceiptModal(feeReceiptData);
    }
  }, [feeReceiptData, getFeesReceiptStatus, resetFeesReceipt]);
  const { getDashboardAction, getDashboardStatus, dashboardData } =
  useTransportStore((s) => ({
    getDashboardAction: s.getDashboardAction,
    getDashboardStatus: s.getDashboardStatus,
    dashboardData: s.dashboardData,
  }));

useEffect(() => {
  getDashboardAction({ sessionMasterId });
  return () => {};
}, [sessionMasterId]);

useEffect(() => {
  if (dashboardData?.tranporter) {
    setLocalStorageItem("transport", dashboardData?.tranporter);
  }
  return () => {};
}, [dashboardData]);
  return (
    <Box h="100%">
      <PageHeader heading={"Fees List"} />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <form onSubmit={getData}>
            <Flex gap={4} align={"center"} mt={2}>
              <CustomInput
                w={"20%"}
                size={"sm"}
                notRequire={true}
                type={"text"}
                name="receiptNo"
                label={"Search Receipt / Student Name"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              {/* <CustomInput w={"20%"} size={"sm"} notRequire={true} type={"date"} name="startDate" label={"Start Date"} inputValue={inputValue} setInputValue={setInputValue} />
                            <CustomInput w={"20%"} size={"sm"} notRequire={true} type={"date"} name="endDate" label={"End Date"} inputValue={inputValue} setInputValue={setInputValue} /> */}
              <Button size={"sm"} colorScheme={themeColor} type="submit">
                Get
              </Button>
            </Flex>
          </form>
          {/* <Flex w={"100%"} justify={"space-between"} my={4} align={"center"}>
                        <Flex w={"45%"}>
                            <CustomInput w={"20%"} size={"sm"} notRequire={true} type={"text"} name="receiptNo" label={"Search Receipt"} inputValue={inputValue} setInputValue={setInputValue} />
                            <CustomInput w={"20%"} size={"sm"} notRequire={true} type={"text"} name="search" label={"Search By Sr No/Name"} inputValue={inputValue} setInputValue={setInputValue} />
                            <Button ml={2} size={"sm"} colorScheme={themeColor} isDisabled={inputValue?.search ? false : true} onClick={searchStudent}>Get</Button>
                            <Button ml={2} size={"sm"} leftIcon={<GrPowerReset />} onClick={reset}>Reset</Button>
                        </Flex>
                        <Pagination totalItems={allStudents?.studentCount} limit={limit} setLimit={setLimit} currentPage={currentPage} setCurrentPage={setCurrentPage} themeColor={themeColor} />
                    </Flex> */}
          <Box mt={5}>
            <LoadingContainer status={getCollectionsStatus}>
              {collectionsData?.length ? (
                <TableContainer>
                  <Table w="100%" size={"sm"} variant={"simple"}>
                    <Thead>
                      <Tr bg="gray.100">
                        <Th>Receipt No.</Th>
                        <Th>Deposite Date</Th>
                        <Th>Name</Th>
                        <Th>Father Name</Th>
                        <Th>Class</Th>
                        <Th>Fees Type</Th>
                        <Th>Deposite</Th>
                        {/* <Th>Discount</Th> */}
                        <Th>Mode</Th>
                        <Th>Status</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {collectionsData?.length ? (
                        map(collectionsData, (data) => {
                          const fee = data.fees_collects;
                          return (
                            <Tr _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                              <Td isNumeric>
                                {data.feesMode === 2
                                  ? data.transportReceiptNo
                                  : data.receiptNo}
                              </Td>
                              <Td>{dayjs(data.date).format("DD-MM-YYYY")}</Td>
                              <Td style={{ fontWeight: "bold" }}>
                                {data.student_master?.studentName}
                              </Td>
                              <Td>{data.student_master?.fatherName}</Td>
                              <Td>
                                {data.class_master?.name} -{" "}
                                {data.stream_master?.name}
                              </Td>
                              <Td>
                                {data?.feesTypeMasterId === 2
                                  ? "Transport Fees"
                                  : "School Fees"}
                              </Td>
                              <Td style={{ fontWeight: "bold" }}>
                                <Flex align={"center"} justify={"flex-end"}>
                                  <MdCurrencyRupee />
                                  {(sumBy(fee, "amount") || 0) +
                                    (sumBy(fee, "lateFees") || 0)}
                                </Flex>
                              </Td>
                              {/* <Td>
                                <Flex align={"center"} justify={"flex-end"}>
                                  <MdCurrencyRupee />
                                  {sumBy(fee, "discount")}
                                </Flex>
                              </Td> */}
                              <Td>{toUpper(data.type)}</Td>
                              <Td>
                                {data.chequeStatus ? (
                                  <Tag
                                    colorScheme={
                                      data.chequeStatus === "Collected"
                                        ? "teal"
                                        : data.chequeStatus ===
                                          "Deposit Into Bank"
                                        ? "yellow"
                                        : data.chequeStatus === "Cleared"
                                        ? "green"
                                        : "red"
                                    }
                                  >
                                    {data.chequeStatus}
                                  </Tag>
                                ) : (
                                  "Recived By Another Mode"
                                )}
                              </Td>
                              <Td>
                                {HasPermission(
                                  PERMISSIONS.TRANS_FEES_COLLECTION
                                ) && (
                                  <Tooltip
                                    placement="top"
                                    label={"Edit Receipt"}
                                  >
                                    <IconButton
                                      size="xs"
                                      variant={"ghost"}
                                      colorScheme={themeColor}
                                      icon={<EditIcon fontSize={16} />}
                                      onClick={() => setToggleFeesEdit(data)}
                                    />
                                  </Tooltip>
                                )}
                                <Tooltip
                                  placement="top"
                                  label={"Print Receipt"}
                                >
                                  <IconButton
                                    ml={2}
                                    size="xs"
                                    variant={"ghost"}
                                    colorScheme={themeColor}
                                    icon={<MdLocalPrintshop fontSize={18} />}
                                    onClick={() => receiptPrint(data)}
                                  />
                                </Tooltip>
                                {HasPermission(
                                  PERMISSIONS.TRANS_FEES_COLLECTION
                                ) && (
                                  <Tooltip
                                    placement="top"
                                    label={"Cancel Receipt"}
                                  >
                                    <IconButton
                                      size="xs"
                                      variant={"ghost"}
                                      colorScheme={"red"}
                                      icon={<ImCancelCircle fontSize={16} />}
                                      onClick={() => setToggleConfirm(data.id)}
                                    />
                                  </Tooltip>
                                )}
                              </Td>
                            </Tr>
                          );
                        })
                      ) : (
                        <Tr>
                          <Td
                            colSpan={13}
                            textAlign={"center"}
                            fontWeight={"semibold"}
                          >
                            No Fee Collection Found
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <NoData title={"No Fees Found"} />
              )}
            </LoadingContainer>
          </Box>
          {toggleReceiptModal && (
            <ReceiptDrawer
              isTransport={true}
              themeColor={themeColor}
              feeReceiptData={feeReceiptData}
              closeModal={() => setToggleReceiptModal(null)}
              resetAllData={resetFeesReceipt}
            />
          )}
          {toggleFeesEdit && (
            <EditFees
              isForTrasnport={true}
              getData={editGetData}
              themeColor={themeColor}
              sessionMasterId={sessionMasterId}
              feesData={toggleFeesEdit}
              closeDrawer={() => setToggleFeesEdit(null)}
            />
          )}
          {toggleConfirm && (
            <ConfirmAlert
              heading={"Cancel Receipt Confirmation"}
              description={"Are you sure? Do you want to Cancel Receipt?"}
              confirm={() => cancelFee(toggleConfirm)}
              button={"Cancel Receipt"}
              closeAlert={() => setToggleConfirm(null)}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
