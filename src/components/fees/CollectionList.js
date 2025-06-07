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
import CustomInput from "@/common/CustomInput";
import { EditIcon } from "@chakra-ui/icons";
import { STATUS } from "@/constant";
import dayjs from "dayjs";
import { useStdFeesStore } from "@/store/stdFees";
import { map, sumBy, toUpper } from "lodash";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { EditFees } from "./EditFees";
import { LoadingContainer } from "@/common/LoadingContainer";
import { ReceiptDrawer } from "./ReceiptDrawer";
import { ConfirmAlert } from "@/common/ConfirmationAlert";
import { GrPowerReset } from "react-icons/gr";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { ThemeChange } from "./ThemeChange";
import { DownloadExcel } from "@/common/DownloadExcel";
import { RiFileExcel2Fill } from "react-icons/ri";
import Pagination from "@/common/Pagination";

export const CollectionList = ({ themeColor, sessionMasterId }) => {
  const [inputValue, setInputValue] = useState({
    startDate: dayjs().startOf("year").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });

  const school = useMemo(() => getLocalStorageItem("user"), []);
  const [toggleFeesEdit, setToggleFeesEdit] = useState(null);
  const [toggleReceiptModal, setToggleReceiptModal] = useState(null);
  const [openChooseLayout, setOpenChooseLayout] = useState(null);
  const [toggleConfirm, setToggleConfirm] = useState(null);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
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
    cancelFeesStatus,
    resetCancelFee,
    totalCount,
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
    cancelFeesStatus: s.cancelFeesStatus,
    resetCancelFee: s.resetCancelFee,
    totalCount: s.totalCount,
  }));

  useEffect(() => {
    if ((getCollectionsStatus || 1) === STATUS.NOT_STARTED) {
      if (inputValue.receiptNo) {
        getCollectionsAction({
          receiptNo: inputValue.receiptNo,
          feesMode: 1,
          sessionMasterId,
          type: "all",
          userId: "all",
          page: currentPage,
          limit: parseInt(limit),
        });
      } else {
        getCollectionsAction({
          startDate: inputValue.startDate,
          endDate: inputValue.endDate,
          type: "all",
          userId: "all",
          feesMode: 1,
          sessionMasterId,
          page: currentPage,
          limit: parseInt(limit),
        });
      }
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

  const reset = () => {
    setInputValue({ search: "", receiptNo: "" });
    setCurrentPage(1);
    setLimit(10);
    getCollectionsAction({
      page: 1,
      limit: 10,
      sessionMasterId,
      search: "",
      receiptNo: "",
    });
  };

  const editGetData = (e) => {
    e.preventDefault();
    if (inputValue.receiptNo) {
      getCollectionsAction({
        receiptNo: inputValue.receiptNo,
        sessionMasterId,
        feesMode: 1,
        type: "all",
        userId: "all",
        page: currentPage,
        limit: parseInt(limit),
      });
    }
    if (inputValue.search) {
      getCollectionsAction({
        search: inputValue.search,
        sessionMasterId,
        feesMode: 1,
        type: "all",
        userId: "all",
        page: currentPage,
        limit: parseInt(limit),
      });
    } else {
      getCollectionsAction({
        startDate: inputValue.startDate,
        endDate: inputValue.endDate,
        type: "all",
        userId: "all",
        sessionMasterId,
        feesMode: 1,
        page: currentPage,
        limit: parseInt(limit),
      });
    }
  };

  useEffect(() => {
    if (inputValue.startDate && inputValue.endDate) {
      getCollectionsAction({
        startDate: inputValue.startDate,
        endDate: inputValue.endDate,
        type: "all",
        userId: "all",
        sessionMasterId,
        feesMode: 1,
        page: currentPage,
        limit: parseInt(limit),
      });
    }
  }, [currentPage, limit]);
  const editGetDataByEdit = () => {
    if (inputValue.receiptNo) {
      getCollectionsAction({
        receiptNo: inputValue.receiptNo,
        sessionMasterId,
        feesMode: 1,
        type: "all",
        userId: "all",
        page: currentPage,
        limit: parseInt(limit),
      });
    }
    if (inputValue.search) {
      getCollectionsAction({
        search: inputValue.search,
        sessionMasterId,
        feesMode: 1,
        type: "all",
        userId: "all",
        page: currentPage,
        limit: parseInt(limit),
      });
    } else {
      getCollectionsAction({
        startDate: inputValue.startDate,
        endDate: inputValue.endDate,
        type: "all",
        userId: "all",
        sessionMasterId,
        feesMode: 1,
        page: currentPage,
        limit: parseInt(limit),
      });
    }
  };
  const receiptPrint = (data) => {
    getFeesReceiptAction({
      sessionMasterId,
      schoolCode: school?.schoolData?.schoolCode,
      promotionId: data?.promotionId,
      feesReportId: data?.id,
    });
  };

  const cancelFee = (id) => {
    cancelFeesAction({
      id,
      status: "Cancelled",
      isDelete: 1,
    });
  };

  useEffect(() => {
    if (cancelFeesStatus === STATUS.SUCCESS) {
      resetCancelFee();
      setToggleConfirm(null);
    }
  }, [cancelFeesStatus, resetCancelFee]);

  useEffect(() => {
    if (getFeesReceiptStatus === STATUS.SUCCESS) {
      resetFeesReceipt();
      setToggleReceiptModal(feeReceiptData);
    }
  }, [feeReceiptData, getFeesReceiptStatus, resetFeesReceipt]);
  const [excelData, setExcelData] = useState(null);
  useEffect(() => {
    if (collectionsData?.length > 0) {
      const formattedData = collectionsData.map((response) => ({
        ReceiptNo: response.receiptNo || "",
        ReceiptDate: response.date
          ? new Date(response.date).toLocaleDateString("en-GB")
          : "",
        Status: response.status || "",
        PaymentType: response.type || "",

        StudentName: response.student_master?.studentName || "",
        FatherName: response.student_master?.fatherName || "",
        MotherName: response.student_master?.motherName || "",
        Gender: response.student_master?.gender || "",
        DOB: response.student_master?.dob
          ? new Date(response.student_master.dob).toLocaleDateString("en-GB")
          : "",
        MobileNo: response.student_master?.fatherContact || "",
        AlternateMobileNo: response.student_master?.motherContact || "",
        Email: response.student_master?.email || "",
        Address: response.student_master?.address || "",

        AdmissionNo: response.student_master?.admissionNo || "",
        SRNo: response.student_master?.srNo || "",
        RollNo: response.student_master?.rollNo || "",

        Class: response.class_master?.name || "",
        Section: response.section_master?.name || "",
        Stream: response.stream_master?.name || "",
        Category: response.category_master?.name || "",
        Caste: response.student_master?.caste || "",
        Religion: response.student_master?.religion || "",
        Nationality: response.student_master?.nationality || "",

        TotalAmount: response.totalAmount || 0,
        DiscountAmount: response.totalDiscount || 0,
        LateFee: response.totalLateFees || 0,
        NetAmount:
          response.totalAmount -
            response.totalDiscount +
            response.totalLateFees || 0,
        ModeOfPayment: response.mode || "",
        ChequeNo: response.chequeNo || "",
        BankName: response.bankName || "",
        TransactionId: response.transactionId || "",
        UPIReferenceId: response.upiReferenceNo || "",
      }));

      setExcelData(formattedData);
    }
  }, [collectionsData]);
  const receiptLayout = getLocalStorageItem("receiptLayout");
  return (
    <Box h="100%">
      <PageHeader
        heading={"Fees List"}
        extra={
          <Tooltip label="Download Excel" placement="top">
            <DownloadExcel
              button={<RiFileExcel2Fill />}
              data={excelData}
              name={"Fees Collection"}
            />
          </Tooltip>
        }
      />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <form onSubmit={editGetData}>
            <Flex gap={2} align={"center"} mt={2}>
              <CustomInput
                w={"15%"}
                size={"sm"}
                notRequire={true}
                type={"text"}
                name="receiptNo"
                label={"Search Receipt"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                w={"15%"}
                size={"sm"}
                notRequire={true}
                type={"date"}
                name="startDate"
                label={"Start Date"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                w={"15%"}
                size={"sm"}
                notRequire={true}
                type={"date"}
                name="endDate"
                label={"End Date"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />

              <CustomInput
                w={"15%"}
                size={"sm"}
                notRequire={true}
                type={"text"}
                name="search"
                label={"Search Name"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />

              <Button size={"sm"} colorScheme={themeColor} type="submit">
                Get
              </Button>
              <Button
                w={"10%"}
                ml={2}
                size={"sm"}
                leftIcon={<GrPowerReset />}
                onClick={reset}
              >
                Reset
              </Button>
              <Button
               w={"10%"}
                colorScheme={themeColor}
                size={"sm"}
                onClick={() => setOpenChooseLayout(true)}
              >
                Receipt Layout&lsquo;s
              </Button>
              <Pagination
                totalItems={totalCount}
                limit={limit}
                setLimit={setLimit}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                themeColor={themeColor}
              />
            </Flex>
          </form>

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
                              <Td>
                                <Flex flexDir={"column"} align={"center"}>
                                  <Text>{toUpper(data.type)}</Text>
                                  {data.transitionNo ? (
                                    <Text
                                      color={"gray.500"}
                                      fontSize={10}
                                      fontStyle={"italic"}
                                    >
                                      ({data.transitionNo})
                                    </Text>
                                  ) : null}
                                </Flex>
                              </Td>
                              <Td>
                                {data.chequeStatus || data.status ? (
                                  <Tag
                                    colorScheme={
                                      data.status === "Received"
                                        ? "green"
                                        : data.status === "Cancelled"
                                        ? "red"
                                        : data.chequeStatus === "Collected"
                                        ? "teal"
                                        : data.chequeStatus ===
                                          "Deposit Into Bank"
                                        ? "yellow"
                                        : data.chequeStatus === "Cleared"
                                        ? "green"
                                        : "red"
                                    }
                                  >
                                    {data.chequeId
                                      ? data.chequeStatus
                                      : data.status}
                                  </Tag>
                                ) : null}
                              </Td>
                              <Td>
                                <Flex gap={2} justify={"center"}>
                                  {data.chequeStatus === "Cancelled" ||
                                  data.status === "Cancelled"
                                    ? null
                                    : HasPermission(
                                        PERMISSIONS.FEES_LIST_EDIT
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
                                            onClick={() =>
                                              setToggleFeesEdit(data)
                                            }
                                          />
                                        </Tooltip>
                                      )}
                                  <Tooltip
                                    placement="top"
                                    label={"Print Receipt"}
                                  >
                                    <IconButton
                                      size="xs"
                                      variant={"ghost"}
                                      colorScheme={themeColor}
                                      icon={<MdLocalPrintshop fontSize={18} />}
                                      onClick={() => receiptPrint(data)}
                                    />
                                  </Tooltip>
                                  {data.chequeStatus === "Cancelled" ||
                                  data.status === "Cancelled"
                                    ? null
                                    : HasPermission(
                                        PERMISSIONS.FEES_LIST_DELETE
                                      ) && (
                                        <Tooltip
                                          placement="top"
                                          label={"Cancel Receipt"}
                                        >
                                          <IconButton
                                            size="xs"
                                            variant={"ghost"}
                                            colorScheme={"red"}
                                            icon={
                                              <ImCancelCircle fontSize={16} />
                                            }
                                            onClick={() =>
                                              setToggleConfirm(data.id)
                                            }
                                          />
                                        </Tooltip>
                                      )}
                                </Flex>
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
              themeColor={themeColor}
              feeReceiptData={feeReceiptData}
              closeModal={() => setToggleReceiptModal(null)}
              resetAllData={resetFeesReceipt}
              receiptLayout={receiptLayout}
            />
          )}
          {openChooseLayout && (
            <ThemeChange
              themeColor={themeColor}
              Data={{}}
              closeModal={() => setOpenChooseLayout(null)}
              resetAllData={resetFeesReceipt}
            />
          )}

          {toggleFeesEdit && (
            <EditFees
              getData={editGetDataByEdit}
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
              loading={cancelFeesStatus === STATUS.FETCHING}
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
