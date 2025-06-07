import CustomInput from "@/common/CustomInput";
import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import { useStdFeesStore } from "@/store/stdFees";
import {
  Box,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Select,
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
import dayjs from "dayjs";
import { filter, find, groupBy, map } from "lodash";
import { useEffect, useMemo, useState } from "react";
import {
  MdCancel,
  MdCheckCircle,
  MdCurrencyRupee,
  MdLocalPrintshop,
} from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { ChequeStatusUpdate } from "./ChequeStatusUpdate";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { ReceiptDrawer } from "./ReceiptDrawer";
import { LoadingContainer } from "@/common/LoadingContainer";
import { TriangleUpIcon } from "@chakra-ui/icons";
import { NoData } from "@/common/NoData";
import { BsCollectionFill } from "react-icons/bs";
import { RiLuggageDepositFill } from "react-icons/ri";
import { FaMoneyCheck, FaMoneyCheckAlt } from "react-icons/fa";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const ChequeStatus = ({ themeColor, sessionMasterId }) => {
  const [inputValue, setInputValue] = useState({
    chequeDate: dayjs().format("YYYY-MM-DD"),
    chequeStatus: "Collected",
  });
  const [toggleModal, setToggleModal] = useState(null);
  const [toggleReceiptModal, setToggleReceiptModal] = useState(null);
  const school = useMemo(() => getLocalStorageItem("user"), []);

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  const {
    getChequeListAction,
    getChequeListStatus,
    chequeList,
    getFeesReceiptAction,
    getFeesReceiptStatus,
    feeReceiptData,
    resetFeesReceipt,
    chequeDashboardData
  } = useStdFeesStore((s) => ({
    getChequeListAction: s.getChequeListAction,
    getChequeListStatus: s.getChequeListStatus,
    chequeList: s.chequeList,
    getFeesReceiptAction: s.getFeesReceiptAction,
    getFeesReceiptStatus: s.getFeesReceiptStatus,
    feeReceiptData: s.feeReceiptData,
    resetFeesReceipt: s.resetFeesReceipt,
    chequeDashboardData : s.chequeDashboardData
  }));

  const { getBankAction, getBankStatus, allBanks } = useAdditionalSetupStore(
    (s) => ({
      getBankAction: s.getBankAction,
      getBankStatus: s.getBankStatus,
      allBanks: s.allBanks,
    })
  );

  useEffect(() => {
    if ((getBankStatus || 1) === STATUS.NOT_STARTED) {
      getBankAction();
    }
  }, [getBankAction, getBankStatus]);

  useEffect(() => {
    if ((getChequeListStatus || 1) === STATUS.NOT_STARTED) {
      getChequeListAction({
        feesMode: 1,
        sessionMasterId,
        chequeDate: dayjs().format("YYYY-MM-DD"),
        chequeStatus: "Collected",
      });
    }
  }, [getChequeListAction, getChequeListStatus, sessionMasterId]);

  useEffect(() => {
    getChequeListAction({
      feesMode: 1,
      sessionMasterId,
      ...inputValue,
    });
  }, [getChequeListAction, inputValue, sessionMasterId]);

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
  }, [getClassSubjectAction, getClassSubjectStatus]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const streamSec = useMemo(() => {
    return filter(
      classes?.[inputValue?.classMasterId],
      (c) => c.streamMasterId === parseInt(inputValue?.streamMasterId)
    );
  }, [classes, inputValue?.classMasterId, inputValue?.streamMasterId]);

  const secSub = useMemo(() => {
    return find(
      classes?.[inputValue?.classMasterId],
      (c) =>
        c.streamMasterId === parseInt(inputValue?.streamMasterId) &&
        c.sectionMasterId === parseInt(inputValue?.sectionMasterId)
    );
  }, [
    classes,
    inputValue?.classMasterId,
    inputValue?.sectionMasterId,
    inputValue?.streamMasterId,
  ]);

  const receiptData = (data, promotionId) => {
    getFeesReceiptAction({
      sessionMasterId,
      schoolCode: school?.schoolData?.schoolCode,
      promotionId,
      feesReportId: data?.feesReportId,
    });
    setToggleModal(null);
  };

  const resetAllData = () => {};

  useEffect(() => {
    if (getFeesReceiptStatus === STATUS.SUCCESS) {
      resetFeesReceipt();
      setToggleReceiptModal(feeReceiptData);
    }
  }, [feeReceiptData, getFeesReceiptStatus, resetFeesReceipt]);

  const receiptPrint = (data) => {
    getFeesReceiptAction({
      sessionMasterId,
      schoolCode: school?.schoolData?.schoolCode,
      promotionId: data?.promotionId,
      feesReportId: data?.id,
    });
  };

  return (
    <Box h="100%">
      <PageHeader heading={"Cheque Status"} />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <Flex w={"100%"} justify={"space-between"} gap={1}>
            <DashUi
              title={"Total Cheques"}
              color={"blue"}
              icon={<FaMoneyCheckAlt fontSize={18} />}
              amount={chequeDashboardData?.totalCheque || 0}
              val={"all"}
              setSelected={inputHandler}
            />
            <DashUi
              title={"Total Collected"}
              color={"teal"}
              icon={<BsCollectionFill fontSize={18} />}
              amount={chequeDashboardData?.totalCollected  || 0}
              val={"Collected"}
              setSelected={inputHandler}
            />
            <DashUi
              title={"Total Deposit Into Bank"}
              color={"yellow"}
              icon={<RiLuggageDepositFill fontSize={18} />}
              amount={chequeDashboardData?.totalDepositIntoBank  || 0}
              val={"Deposit Into Bank"}
              setSelected={inputHandler}
            />
            <DashUi
              title={"Total Cleared"}
              color={"green"}
              icon={<MdCheckCircle fontSize={18} />}
              amount={chequeDashboardData?.totalCleared  || 0}
              val={"Cleared"}
              setSelected={inputHandler}
            />
            <DashUi
              title={"Total Bounce"}
              color={"red"}
              icon={<FaMoneyCheck />}
              amount={chequeDashboardData?.totalBounce  || 0}
              val={"Bounce"}
              setSelected={inputHandler}
            />
            <DashUi
              title={"Total Cancelled"}
              color={"red"}
              icon={<MdCancel fontSize={18} />}
              amount={chequeDashboardData?.totalCancel  || 0}
              val={"Cancelled"}
              setSelected={inputHandler}
            />
          </Flex>
        </Box>
        <Flex py={5} gap={2}>
          <CustomInput
            w={"23%"}
            type={"date"}
            size={"sm"}
            name="chequeDate"
            label={"Cheque Date"}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
        </Flex>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getChequeListStatus}>
            {chequeList?.length ? (
              <TableContainer>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>Sr No.</Th>
                      <Th>Name</Th>
                      <Th>Father Name</Th>
                      <Th>Contact</Th>
                      <Th>Class</Th>
                      <Th>Cheque Bank</Th>
                      <Th>Cheque Details</Th>
                      <Th>Amount</Th>
                      <Th>Status</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(chequeList, (cheq) => (
                      <Tr _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                        <Td>{cheq.student_master?.srNo}</Td>
                        <Td>{cheq.student_master?.studentName}</Td>
                        <Td>{cheq.student_master?.fatherName}</Td>
                        <Td>{cheq.student_master?.fatherContact}</Td>
                        <Td>
                          {cheq.class_master?.name} - {cheq.stream_master.name}
                        </Td>
                        <Td>{cheq.bank}</Td>
                        <Td>
                          {cheq.chequeNo} /{" "}
                          {cheq.chequeDate
                            ? dayjs(cheq.chequeDate).format("DD-MM-YYYY")
                            : ""}
                        </Td>
                        <Td isNumeric>
                          <Flex justify={"flex-end"} align="center">
                            <MdCurrencyRupee />
                            {cheq.totalAmount + cheq.totalLateFees}
                          </Flex>
                        </Td>
                        <Td>
                          {cheq.chequeStatus === "Collected" ||
                          cheq.chequeStatus === "Cancelled" ? (
                            <Tag
                              colorScheme={
                                cheq.chequeStatus === "Collected"
                                  ? "teal"
                                  : "red"
                              }
                            >
                              {cheq.chequeStatus}
                            </Tag>
                          ) : (
                            <Popover placement="left">
                              <PopoverTrigger bg={themeColor}>
                                <Tag
                                  colorScheme={
                                    cheq.chequeStatus === "Collected"
                                      ? "teal"
                                      : cheq.chequeStatus ===
                                        "Deposit Into Bank"
                                      ? "yellow"
                                      : cheq.chequeStatus === "Cleared"
                                      ? "green"
                                      : "red"
                                  }
                                >
                                  {cheq.chequeStatus}
                                </Tag>
                              </PopoverTrigger>
                              <PopoverContent bg={`${themeColor}.100`}>
                                <PopoverArrow bg={`${themeColor}.100`} />
                                <PopoverCloseButton />
                                <PopoverHeader>Deposite Bank!</PopoverHeader>
                                <PopoverBody>
                                  <Box fontSize={14} fontWeight={"semibold"}>
                                    <Flex>
                                      <Text w={"20%"}>Bank: </Text>
                                      <Text ml={2}>
                                        {cheq?.bank_master?.name}
                                      </Text>
                                    </Flex>
                                    <Flex mt={1}>
                                      <Text w={"20%"}>Acc. No.: </Text>
                                      <Text ml={2}>
                                        {cheq?.bank_master?.accountNumber}
                                      </Text>
                                    </Flex>
                                  </Box>
                                </PopoverBody>
                              </PopoverContent>
                            </Popover>
                          )}
                          {(cheq.chequeStatus === "Collected" ||
                            cheq.chequeStatus === "Deposit Into Bank") &&
                          HasPermission(PERMISSIONS.CHEQUE_STATUS_EDIT) ? (
                            <IconButton
                              ml={1}
                              size={"xs"}
                              variant={"ghost"}
                              colorScheme={themeColor}
                              onClick={() => setToggleModal(cheq)}
                              icon={<GrUpdate />}
                            />
                          ) : null}
                        </Td>
                        <Td>
                          <Tooltip placement="top" label={"Print Receipt"}>
                            <IconButton
                              ml={2}
                              size="xs"
                              variant={"ghost"}
                              colorScheme={themeColor}
                              icon={<MdLocalPrintshop fontSize={18} />}
                              onClick={() => receiptPrint(cheq)}
                            />
                          </Tooltip>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Cheque Found"} />
            )}
          </LoadingContainer>
          {toggleModal && (
            <ChequeStatusUpdate
              allBanks={allBanks}
              data={toggleModal}
              receiptData={receiptData}
              sessionMasterId={sessionMasterId}
              themeColor={themeColor}
              closeModal={() => setToggleModal(null)}
            />
          )}
          {toggleReceiptModal && (
            <ReceiptDrawer
              themeColor={themeColor}
              feeReceiptData={feeReceiptData}
              closeModal={() => setToggleReceiptModal(null)}
              resetAllData={resetAllData}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

const DashUi = ({ title, color, icon, amount, up, val, setSelected }) => {
  return (
    <Box
      p={3}
      w={"23%"}
      border={"1px solid"}
      borderColor={"gray.200"}
      borderRadius={8}
      bg={`${color}.600`}
      cursor={"pointer"}
      onClick={() => setSelected("chequeStatus", val)}
    >
      <Text fontSize={13} color={"white"}>
        {title}
      </Text>
      <Flex mt={2} align={"center"} color={"white"}>
        {icon}
        <Text ml={2} fontSize={18}>
          {amount}
        </Text>
        {up && 
            <Flex ml={7} fontSize={11} align={"center"}>
          <TriangleUpIcon />
          <Text>{up}</Text>
        </Flex>
        }
      </Flex>
    </Box>
  );
};
