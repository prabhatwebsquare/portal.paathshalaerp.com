import CustomInput from "@/common/CustomInput";
import CustomTextarea from "@/common/CustomTextarea";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useStdFeesStore } from "@/store/stdFees";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { DeleteIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {
  FaPercentage,
  FaClock,
  FaHandHoldingHeart,
  FaHourglassHalf,
} from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import ReactSelect from "react-select"; // React-Select

import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  IconButton,
  Image,
  Input,
  Select,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useColorModeValue,
  ScaleFade,
  VStack,
  Divider,
  Badge,
  RadioGroup,
  Stack,
  Radio,
  SimpleGrid,
  Spacer,
  Checkbox,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { concat, filter, find, includes, map, reject, sumBy } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { MdCurrencyRupee, MdPercent, MdVisibility } from "react-icons/md";
import { ReceiptDrawer } from "@/components/fees/ReceiptDrawer";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { useAdminBankStore } from "@/store/Banks";
import { NoData } from "@/common/NoData";
import { URL } from "@/services/apis";
import { ViewSiblings } from "@/common/ViewSiblings";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import {
  FiUser,
  FiUsers,
  FiPhone,
  FiBook,
  FiTrendingUp,
  FiGrid,
  FiEye,
} from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { BiCalendarEdit, BiSolidOffer } from "react-icons/bi";
import moment from "moment";
import { FeesModal } from "@/components/fees/FeesModal";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";

export const TransportFees = ({
  pageName,
  themeColor,
  sessionMasterId,
  TransportFeesDetails,
  setTransportFeesDetails,
}) => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState({});
  const [inputFeesValue, setInputFeesValue] = useState({
    discount: 0,
    lateFees: 0,
    date: dayjs().format("YYYY-MM-DD"),
    feesType: "transport-fees",
    type: "Cash",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [toggleModal, setToggleModal] = useState(null);
  const [toggleReceiptModal, setToggleReceiptModal] = useState(null);
  const [toggleViewSibling, setToggleViewSibling] = useState(null);

  const school = useMemo(() => getLocalStorageItem("user"), []);

  const inputHandler = (name, val) => {
    if (name === "feesType") {
      setInputFeesValue({
        discount: 0,
        date: dayjs().format("YYYY-MM-DD"),
        feesType: val,
        studentFeesId: "",
        amount: 0,
        lateFees: 0,
        type: "Cash",
      });
    } else {
      setInputFeesValue((pre) => ({ ...pre, [name]: val }));
    }
  };
  const {
    searchStudentAction,
    searchStudentStatus,
    searchStd,
    resetSearch,
    getStudentFeesAction,
    getStudentFeesStatus,
    studentFees,
    resetStudentFee,
    collectStdFeesAction,
    collectStdFeesStatus,
    collectStdFees,
    resetCollectFee,
    getFeesReceiptAction,
    getFeesReceiptStatus,
    feeReceiptData,
    resetFeesReceipt,
  } = useStdFeesStore((s) => ({
    searchStudentAction: s.searchStudentAction,
    searchStudentStatus: s.searchStudentStatus,
    searchStd: s.searchStd,
    resetSearch: s.resetSearch,
    getStudentFeesAction: s.getStudentFeesAction,
    getStudentFeesStatus: s.getStudentFeesStatus,
    studentFees: s.studentFees,
    resetStudentFee: s.resetStudentFee,
    collectStdFeesAction: s.collectStdFeesAction,
    collectStdFeesStatus: s.collectStdFeesStatus,
    collectStdFees: s.collectStdFees,
    resetCollectFee: s.resetCollectFee,
    getFeesReceiptAction: s.getFeesReceiptAction,
    getFeesReceiptStatus: s.getFeesReceiptStatus,
    feeReceiptData: s.feeReceiptData,
    resetFeesReceipt: s.resetFeesReceipt,
  }));

  const { getAdminBankAction, getAdminBanksStatus, allAdminBanks } =
    useAdminBankStore((s) => ({
      getAdminBankAction: s.getAdminBankAction,
      getAdminBanksStatus: s.getAdminBanksStatus,
      allAdminBanks: s.allAdminBanks,
    }));

  useEffect(() => {
    if ((getAdminBanksStatus || 1) === STATUS.NOT_STARTED) {
      getAdminBankAction();
    }
  }, [getAdminBankAction, getAdminBanksStatus]);

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
  const [updatedDeposits, setUpdatedDeposits] = useState({});

  const handleDepositChange = (id, amount) => {
    setUpdatedDeposits((prev) => ({
      ...prev,
      [id]: amount,
    }));
  };

  const [updatedDepositsLateFee, setUpdatedDepositsLateFee] = useState({});

  const handleDepositLateFeeChange = (id, amount) => {
    setUpdatedDepositsLateFee((prev) => ({
      ...prev,
      [id]: amount,
    }));
  };
  const transportFeesDetails = useMemo(() => {
    return map(
      filter(studentFees?.studentFees, (s) => s.fees_type_master?.id === 2),
      (f) => {
        const received = filter(f.fees_collects, (c) => c.status !== "Pending");
        const newDeposit = updatedDeposits[f.id] || 0;
        const newDepositLateFee = updatedDepositsLateFee[f.id] || 0;

        return {
          ...f,
          totalFees: f.amount + f.lateFees,
          tutionFees: f.amount,
          totalLateFees: f.lateFees,
          deposite: sumBy(received, "amount"),
          lateFeesCollected: sumBy(received, "lateFees") || 0,
          pending: sumBy(
            filter(f.fees_collects, (c) => c.status === "Pending"),
            "amount"
          ),
          discount: sumBy(received, "discount"),
          discountReceived: f.discountReceived,
          amount: f.amount - (sumBy(received, "amount") + f.discountReceived),
          dueAmount:
            f.amount -
            (sumBy(f.fees_collects, "amount") +
              sumBy(f.fees_collects, "discount") +
              f.discountReceived),
          dueLateFees: f.lateFees - (sumBy(received, "lateFees") || 0),
          depositAmountNew: Number(newDeposit),
          depositAmountNewLateFee: Number(newDepositLateFee),
        };
      }
    );
  }, [studentFees, updatedDeposits, updatedDepositsLateFee]);

  const handleSearchInput = (val) => {
    setSearchInput({ filters: val });
    setSelectedFeesHeadTrasport([]);
    if (val?.length >= 1) {
      searchStudentAction({
        isTransport: 1,
        sessionMasterId,
        search: val,
      });
    }
  };
  const getStudentFees = (id, promotionId) => {
    setSearchInput({ filters: "" });
    setSelectedFeesHeadTrasport([]);
    resetSearch();
    getStudentFeesAction({
      promotionId,
      studentMasterId: id,
      feesMode: 2,
    });
  };

  const selectSibling = (id, promotionId) => {
    setToggleViewSibling(null);
    setInputFeesValue({
      discount: 0,
      date: dayjs().format("YYYY-MM-DD"),
      feesType: "",
      amount: 0,
      lateFee: 0,
      type: "",
      remark: "",
      type: "Cash",
    });
    getStudentFees(id, promotionId);
  };

  useEffect(() => {
    return () => {
      setSearchInput({ filters: "" });
      setSelectedFeesHeadTrasport([]);
      resetSearch();
      resetStudentFee();
    };
  }, [resetSearch, resetStudentFee]);

  useEffect(() => {
    return () => resetSearch();
  }, [resetSearch]);

  const resetAllData = () => {
    resetStudentFee();
    setInputFeesValue({ discount: 0, date: dayjs().format("YYYY-MM-DD") });
  };
  useEffect(() => {
    if (collectStdFeesStatus === STATUS.SUCCESS) {
      setLoader(false);
      resetAllData();
      resetCollectFee();
      setInputFeesValue({
        discount: 0,
        date: dayjs().format("YYYY-MM-DD"),
        feesType: "",
        amount: 0,
        lateFee: 0,
        type: "",
        remark: "",
        type: "Cash",
      });
      getFeesReceiptAction({
        sessionMasterId,
        schoolCode: school?.schoolData?.schoolCode,
        promotionId: collectStdFees?.promotionId,
        feesReportId: collectStdFees?.feesReportId,
      });
    }
  }, [
    collectStdFees,
    collectStdFeesStatus,
    getFeesReceiptAction,
    resetCollectFee,
    router,
    school,
    sessionMasterId,
  ]);

  useEffect(() => {
    if (getFeesReceiptStatus === STATUS.SUCCESS) {
      resetFeesReceipt();
      setToggleReceiptModal(feeReceiptData);
      setSearchInput({ filters: "" });
      setSelectedFeesHeadTrasport([]);
      resetSearch();
      resetStudentFee();
    }
  }, [
    feeReceiptData,
    getFeesReceiptStatus,
    resetFeesReceipt,
    resetSearch,
    resetStudentFee,
  ]);

  const [totalAmount, setTotalAmount] = useState(0);
  const isTransportCombine = useMemo(
    () => getLocalStorageItem("isTransportCombine"),
    []
  );

  useEffect(() => {
    const depositTotal = Object.values(updatedDeposits).reduce(
      (acc, value) => acc + (parseFloat(value) || 0),
      0
    );
    const lateFee = Object.values(updatedDepositsLateFee).reduce(
      (acc, value) => acc + (parseFloat(value) || 0),
      0
    );
    setTotalAmount(depositTotal + lateFee);
  }, [updatedDeposits, updatedDepositsLateFee]);
  const [loader, setLoader] = useState(false);
  const collectFees = async (e) => {
    e.preventDefault();
    const feesPaidData = [];
    setLoader(true);

    const transportFees = await transportFeesDetails
      .filter(
        (data) =>
          updatedDeposits[data.id] > 0 || updatedDepositsLateFee[data.id] > 0
      )
      .map((data) => {
        const newDeposit = updatedDeposits[data.id] || 0;
        const newDepositLateFee = updatedDepositsLateFee[data.id] || 0;
        return {
          discount: data.discount,
          studentFeesId: data.id,
          amount: Number(newDeposit),
          lateFees: Number(newDepositLateFee),
        };
      });

    await feesPaidData.push(...transportFees);

    const feesType =
      inputFeesValue?.feesType === "transport-fees" ? transportFeesDetails : "";
    const temp = await {
      feesTypeMasterId: inputFeesValue.feesType === "transport-fees" ? 2 : 1,
      type: inputFeesValue.type,
      sessionMasterId: sessionMasterId,
      promotionId: feesType[0]?.promotionId,
      totalAmount: Object.values(updatedDeposits).reduce(
        (acc, value) => acc + (parseFloat(value) || 0),
        0
      ),
      totalDiscount: sumBy(transportFeesDetails, "discount") || 0,
      totalLateFees: Object.values(updatedDepositsLateFee).reduce(
        (acc, value) => acc + (parseFloat(value) || 0),
        0
      ),
      studentMasterId: studentFees?.student?.id,
      classMasterId: studentFees?.classData?.id,
      sectionMasterId: studentFees?.sectionData?.id,
      streamMasterId: studentFees?.streamData?.id,
      bank: inputFeesValue.bank,
      chequeNo: inputFeesValue.chequeNo,
      chequeDate: inputFeesValue.chequeDate,
      transitionNo: inputFeesValue.transactionNo,
      transactionDate: inputFeesValue.transactionDate,
      ledgerMasterId:
        inputFeesValue?.type === "Cash"
          ? 1
          : inputFeesValue?.type === "Cheque"
          ? ""
          : inputFeesValue.ledgerMasterId,
      remark: inputFeesValue.remark,
      date: inputFeesValue?.date
        ? dayjs(inputFeesValue?.date).format("YYYY-MM-DD")
        : "",
      data: feesPaidData,
      feesMode: 2,
    };
    await collectStdFeesAction(temp);
    await setSearchInput({ filters: "" });
    await setSelectedFeesHeadTrasport([]);
    await resetSearch();
    await resetStudentFee();
    await onClose();
    await setUpdatedDeposits({});
    await setUpdatedDepositsLateFee({});
    setLoader(false);
  };
  const isPastDueDate = (date) => {
    return moment(date).isBefore(moment(), "day");
  };
  const {
    isOpen: isDiscountModalOpen,
    onOpen: openDiscountModal,
    onClose: closeDiscountModal,
  } = useDisclosure();

  const [discountInput, setDiscountInput] = useState({
    sessionMasterId,
    classMasterId: "",
    streamMasterId: "",
    feesNameMasterId: "",
    discount: 0,
    remarks: "",
    promotionId: "",
    feesTypeMasterId: "",
    isLate: 2,
  });

  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");

  const { applyDiscountAction, applyDiscountStatus, resetDiscount } =
    useStdFeesStore((s) => ({
      applyDiscountAction: s.applyDiscountAction,
      applyDiscountStatus: s.applyDiscountStatus,
      resetDiscount: s.resetDiscount,
    }));
  const handleSaveDiscount = () => {

    if (
      !discountInput.discount ||
      discountInput.discount == 0 ||
      discountInput.isLate == 2
    ) {
      ErrorAlert("Please enter a valid discount amount and Discount Type");
      return;
    }
    applyDiscountAction(discountInput);
    setDiscountInput({
      sessionMasterId,
      isLate: 2,
    });
    closeDiscountModal();
    setSearchInput({ filters: "" });
    setSelectedFeesHeadTrasport([]);
    resetDiscount();
    resetSearch();
    resetStudentFee();
  };
  const [tempData, setTempData] = useState(null);

  const [selectedFeesHeadTrasport, setSelectedFeesHeadTrasport] = useState([]);

  const optionsTrasport = useMemo(() => {
    return transportFeesDetails.map((fee) => ({
      value: fee?.transport_fee_master?.name,
      label: fee?.transport_fee_master?.name,
    }));
  }, [transportFeesDetails]);
  const handleSelectChangeTrasport = (selectedOptions) => {
    setSelectedFeesHeadTrasport(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  const filteredFeesDetailsTrasport = selectedFeesHeadTrasport.length
    ? transportFeesDetails.filter((fee) =>
        selectedFeesHeadTrasport.includes(fee?.transport_fee_master?.name)
      )
    : transportFeesDetails;
  const showLateFeesColumn = transportFeesDetails.some(
    (fee) => fee.lateFees > 0
  );

  useEffect(() => {
    if (collectStdFeesStatus === STATUS.ERROR) {
      setLoader(false);
    }
    return () => {};
  }, [collectStdFeesStatus]);

  const isCheckboxDisabled = (fee) => {
    const data =
      Number(fee.feesReceived || 0) +
      Number(fee.lateFeesReceived || 0) +
      Number(fee.runFeesDis || 0) +
      Number(fee.runLateDis || 0);
    if (data == 0) {
      return false;
    }
    return true;
  };

  return (
    <Box h="100%">
      <Box
        p={5}
        bg={"white"}
        h={"100%"}
        className="scrollBar"
        maxH={"100%"}
        overflowY={"scroll"}
      >
        {pageName != "TransportStop" && (
          <>
            <CustomInput
              type={"text"}
              search={true}
              name="filters"
              label={"Search Student"}
              autoFocus={true}
              inputValue={searchInput}
              setInputValue={handleSearchInput}
            />
            {searchStudentStatus === STATUS.NOT_STARTED &&
            !searchStd?.length &&
            getStudentFeesStatus === STATUS.NOT_STARTED ? (
              <Flex mt={5} w={"100%"} align={"center"} flexDir={"column"}>
                <Image
                  h="300px"
                  src="/assets/student.png"
                  alt="Search Student"
                />
                <Text fontSize={18} fontWeight={"semibold"}>
                  Search Student
                </Text>
              </Flex>
            ) : null}
          </>
        )}

        <LoadingContainer status={searchStudentStatus}>
          <Box>
            {pageName != "TransportStop" && searchStd?.length ? (
              <TableContainer mt={5}>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>SR No.</Th>
                      <Th>Name</Th>
                      <Th>Father&apos;s Name</Th>
                      <Th>Mother&apos;s Name</Th>
                      <Th>SR Number</Th>
                      <Th>Class</Th>
                      <Th>Admission No.</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(searchStd, (std) => (
                      <Tr>
                        <Td>{std.student_master.srNo}</Td>
                        <Td
                          color={"blue.400"}
                          fontWeight={"semibold"}
                          cursor={"pointer"}
                          onClick={() =>
                            getStudentFees(
                              std.student_master.id,
                              std.promotionId
                            )
                          }
                        >
                          <Flex>
                            <Avatar
                              mr={3}
                              size={"xs"}
                              src={std.student_master.photo}
                            />
                            {std.student_master.studentName}
                          </Flex>
                        </Td>
                        <Td>{std.student_master.fatherName}</Td>
                        <Td>{std.student_master.motherName}</Td>
                        <Td>{std.student_master.srNo}</Td>
                        <Td>
                          {std.class_master.name} - {std.stream_master.name}
                        </Td>
                        <Td>{std.student_master.admissionNo}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : searchStudentStatus === STATUS.SUCCESS ? (
              <NoData title={"No Student Found"} />
            ) : null}

            <LoadingContainer status={getStudentFeesStatus}>
              {studentFees ? (
                <Box>
                  <Box
                    bgGradient={`linear(to-r, ${themeColor}.600, ${themeColor}.800)`}
                    mt={2}
                    w="100%"
                    borderRadius="3xl"
                    boxShadow="xl"
                    p={1}
                  >
                    <Grid
                      templateColumns={{ base: "1fr", md: "1.8fr 1fr 0.5fr" }}
                      gap={6}
                      p={5}
                      w="100%"
                      alignItems="stretch"
                    >
                      <Box
                        fontSize="sm"
                        bg="white"
                        borderRadius="2xl"
                        border="1px solid"
                        borderColor={`${themeColor}.100`}
                        bgGradient={`linear(to-br, white, gray.50)`}
                        p={5}
                        boxShadow="md"
                        transition="all 0.3s ease"
                        _hover={{
                          transform: "translateY(-4px)",
                          boxShadow: "lg",
                          bgGradient: `linear(to-br, white, ${themeColor}.50)`,
                        }}
                      >
                        <Flex direction="row" align="center" w="100%">
                          <Box flex="0.8">
                            <Flex direction="column" gap={3}>
                              {" "}
                              {/* Increased spacing */}
                              <Flex align="center" justify="space-between">
                                <Flex align="center">
                                  <Icon
                                    as={FiUser}
                                    color={`${themeColor}.600`}
                                    boxSize={5}
                                    mr={3}
                                  />
                                  <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="gray.600"
                                  >
                                    Name
                                  </Text>
                                </Flex>
                                <Text
                                  color="gray.800"
                                  fontSize="sm"
                                  fontWeight="bold"
                                >
                                  {studentFees.student?.studentName}
                                </Text>
                              </Flex>
                              <Flex align="center" justify="space-between">
                                <Flex align="center">
                                  <Icon
                                    as={FiUsers}
                                    color={`${themeColor}.600`}
                                    boxSize={5}
                                    mr={3}
                                  />
                                  <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="gray.600"
                                  >
                                    Father&apos;s Name
                                  </Text>
                                </Flex>
                                <Text
                                  color="gray.800"
                                  fontSize="sm"
                                  fontWeight="bold"
                                >
                                  {studentFees.student?.fatherName}
                                </Text>
                              </Flex>
                              <Flex align="center" justify="space-between">
                                <Flex align="center">
                                  <Icon
                                    as={FiPhone}
                                    color={`${themeColor}.600`}
                                    boxSize={5}
                                    mr={3}
                                  />
                                  <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="gray.600"
                                  >
                                    SR. Number
                                  </Text>
                                </Flex>
                                <Text
                                  color="gray.800"
                                  fontSize="sm"
                                  fontWeight="bold"
                                >
                                  {studentFees.student?.srNo}
                                </Text>
                              </Flex>
                            </Flex>
                          </Box>

                          {/* Profile Image */}
                          <Box flex="0.2" ml={5}>
                            <Box
                              borderRadius="full"
                              border={`3px solid ${themeColor}.300`}
                              overflow="hidden"
                              transition="all 0.3s ease"
                            >
                              <Image
                                h="80px"
                                w="80px"
                                borderRadius="full"
                                objectFit="cover"
                                src={`${URL}${studentFees.student?.photo}`}
                                alt="Profile"
                              />
                            </Box>
                          </Box>
                        </Flex>
                      </Box>
                      <Box
                        fontSize="sm"
                        bg="white"
                        borderRadius="2xl"
                        border="1px solid"
                        borderColor={`${themeColor}.100`}
                        bgGradient={`linear(to-br, white, gray.50)`}
                        p={5}
                        boxShadow="md"
                        transition="all 0.3s ease"
                        _hover={{
                          transform: "translateY(-4px)",
                          boxShadow: "lg",
                          bgGradient: `linear(to-br, white, ${themeColor}.50}`,
                        }}
                      >
                        <Flex direction="column" gap={3}>
                          <Flex align="center" justify="space-between">
                            <Flex align="center">
                              <Icon
                                as={FiBook}
                                color={`${themeColor}.600`}
                                boxSize={5}
                                mr={3}
                              />
                              <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="gray.600"
                              >
                                Class
                              </Text>
                            </Flex>
                            <Text
                              color="gray.800"
                              fontSize="sm"
                              fontWeight="bold"
                            >
                              {studentFees.classData?.name}
                            </Text>
                          </Flex>

                          <Flex align="center" justify="space-between">
                            <Flex align="center">
                              <Icon
                                as={FiTrendingUp}
                                color={`${themeColor}.600`}
                                boxSize={5}
                                mr={3}
                              />
                              <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="gray.600"
                              >
                                Stream
                              </Text>
                            </Flex>
                            <Text
                              color="gray.800"
                              fontSize="sm"
                              fontWeight="bold"
                            >
                              {studentFees.streamData?.name}
                            </Text>
                          </Flex>

                          <Flex align="center" justify="space-between">
                            <Flex align="center">
                              <Icon
                                as={FiGrid}
                                color={`${themeColor}.600`}
                                boxSize={5}
                                mr={3}
                              />
                              <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="gray.600"
                              >
                                Section
                              </Text>
                            </Flex>
                            <Text
                              color="gray.800"
                              fontSize="sm"
                              fontWeight="bold"
                            >
                              {studentFees.sectionData?.name}
                            </Text>
                          </Flex>
                        </Flex>
                      </Box>

                      {/* Button */}
                      <Flex align="center" justify="center">
                        <Button
                          size="md" // Larger button for prominence
                          colorScheme={themeColor}
                          rightIcon={<FiEye />}
                          onClick={() =>
                            setToggleViewSibling(studentFees?.promotionId)
                          }
                          variant="solid"
                          borderRadius="full" // Fully rounded for a modern look
                          px={6} // Wider padding
                          bg={`${themeColor}.500`}
                          _hover={{
                            bg: `${themeColor}.600`,
                            transform: "scale(1.05)",
                          }}
                          transition="all 0.3s ease"
                        >
                          View Siblings
                        </Button>
                      </Flex>
                    </Grid>
                  </Box>

                  {toggleViewSibling && (
                    <ViewSiblings
                      id={toggleViewSibling}
                      closeModal={() => setToggleViewSibling(null)}
                      themeColor={themeColor}
                      selectSibling={selectSibling}
                    />
                  )}
                  <Flex mt={0}>
                    <Box w="100%" mt={2}>
                      <Tabs
                        variant="solid-rounded"
                        isFitted
                        colorScheme={themeColor}
                        onChange={(index) => {
                          setInputFeesValue((pre) => ({
                            ...pre,
                            feesType:
                              index == 0 ? "school-fees" : "transport-fees",
                          }));
                        }}
                      >
                        <TabList mb={2}>
                          {isTransportCombine == 1 && (
                            <Tab
                              _selected={{
                                bg: `${themeColor}.600`,
                                color: "white",
                              }}
                              _hover={{ bg: "gray.200" }}
                              bg="gray.100"
                            >
                              Transport Fees
                            </Tab>
                          )}
                        </TabList>
                        <TabPanels>
                          <TabPanel p={0}>
                            {transportFeesDetails ? (
                              <Box mt={0} fontSize={14} p={0}>
                                <Flex
                                  px={5}
                                  py={1}
                                  fontWeight={"semibold"}
                                  bg={`${themeColor}.900`}
                                  align={"center"}
                                  color={"white"}
                                  justify={"space-between"}
                                  bgGradient={`linear(to-r, ${themeColor}.700, ${themeColor}.900)`}
                                  mb={2}
                                  borderRadius="2xl"
                                >
                                  <Text>Transport Fees Details</Text>
                                  <Text fontSize={14} fontWeight={"bold"}>
                                    Transport Total Due Fees: &nbsp;{" "}
                                    {sumBy(transportFeesDetails, "dueFees")}
                                  </Text>
                                  <ReactSelect
                                    isMulti
                                    options={optionsTrasport}
                                    placeholder="Select Fees Head"
                                    onChange={handleSelectChangeTrasport}
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        borderColor: "gray.300",
                                        borderRadius: "8px",
                                        padding: "0 4px",
                                        minHeight: "32px", // smaller height
                                        height: "32px",
                                        fontSize: "14px",
                                        minWidth: "300px", // set your desired width
                                        boxShadow: "none",
                                        "&:hover": {
                                          borderColor: "gray.400",
                                        },
                                      }),
                                      valueContainer: (base) => ({
                                        ...base,
                                        padding: "0 4px",
                                      }),
                                      input: (base) => ({
                                        ...base,
                                        margin: "0px",
                                        padding: "0px",
                                      }),
                                      indicatorsContainer: (base) => ({
                                        ...base,
                                        height: "32px",
                                      }),
                                      menu: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                      option: (
                                        base,
                                        { isFocused, isSelected }
                                      ) => ({
                                        ...base,
                                        backgroundColor: isSelected
                                          ? "#2B6CB0"
                                          : isFocused
                                          ? "#ebf8ff"
                                          : "white",
                                        color: isSelected ? "white" : "black",
                                        padding: 8,
                                        fontSize: "14px",
                                      }),
                                      multiValue: (base) => ({
                                        ...base,
                                        backgroundColor: "#2B6CB0",
                                        borderRadius: "4px",
                                        padding: "2px 4px",
                                      }),
                                      multiValueLabel: (base) => ({
                                        ...base,
                                        color: "white",
                                        fontWeight: "bold",
                                        fontSize: "12px",
                                      }),
                                      multiValueRemove: (base) => ({
                                        ...base,
                                        color: "white",
                                        ":hover": {
                                          backgroundColor: "#1A365D",
                                          color: "white",
                                        },
                                      }),
                                    }}
                                    menuPortalTarget={document.body}
                                  />
                                </Flex>
                                <TableContainer borderRadius="2xl">
                                  <Table>
                                    <Thead>
                                      <Tr>
                                        {pageName == "TransportStop" && (
                                          <Th textAlign="center">Select</Th>
                                        )}
                                        <Th textAlign="center">S. No.</Th>
                                        <Th
                                          position="sticky"
                                          left="0"
                                          zIndex="10"
                                          bg="white"
                                          textAlign="center"
                                        >
                                          Fees Head
                                        </Th>
                                        <Th textAlign="center">Fees</Th>
                                        {showLateFeesColumn && (
                                          <Th
                                            textAlign="center"
                                            color="red.500"
                                          >
                                            Late Fees
                                          </Th>
                                        )}
                                        {/* <Th
                                          textAlign="center"
                                          color="green.500"
                                        >
                                          Discount
                                        </Th> */}
                                        <Th
                                          textAlign="center"
                                          color="green.500"
                                        >
                                          fees Deposit
                                        </Th>
                                        {showLateFeesColumn && (
                                          <Th
                                            textAlign="center"
                                            color="green.500"
                                          >
                                            Late fees Deposit
                                          </Th>
                                        )}

                                        <Th textAlign="center" color="red.500">
                                          Total Due Fees
                                        </Th>
                                        {pageName != "TransportStop" && (
                                          <>
                                            <Th textAlign="center">
                                              New Amount Deposit
                                            </Th>
                                            {showLateFeesColumn && (
                                              <Th textAlign="center">
                                                Deposit Late Fee
                                              </Th>
                                            )}
                                          </>
                                        )}
                                      </Tr>
                                    </Thead>

                                    <Tbody>
                                      {map(
                                        filteredFeesDetailsTrasport,
                                        (fee, index) => {
                                          return (
                                            <Tr
                                              key={fee.id}
                                              cursor="pointer"
                                              bg={
                                                Number(fee.dueAmount) === 0
                                                  ? "gray.50"
                                                  : ""
                                              }
                                            >
                                              {pageName == "TransportStop" && (
                                                <Td textAlign="center">
                                                  <Checkbox
                                                    isChecked={fee.isChecked}
                                                    isDisabled={isCheckboxDisabled(
                                                      fee
                                                    )}
                                                    onChange={(e) => {
                                                      const isChecked =
                                                        e.target.checked;
                                                      const feeId = fee.id;

                                                      setTransportFeesDetails(
                                                        (prevIds) => {
                                                          if (isChecked) {
                                                            return [
                                                              ...prevIds,
                                                              feeId,
                                                            ];
                                                          } else {
                                                            return prevIds.filter(
                                                              (id) =>
                                                                id !== feeId
                                                            );
                                                          }
                                                        }
                                                      );
                                                    }}
                                                    colorScheme={themeColor}
                                                    size="md"
                                                    borderColor="gray.300"
                                                    _checked={{
                                                      bg: `${themeColor}.600`,
                                                      borderColor: `${themeColor}.600`,
                                                    }}
                                                    _hover={{
                                                      borderColor: `${themeColor}.600`,
                                                    }}
                                                  />
                                                </Td>
                                              )}
                                              <Td textAlign="center">
                                                {index + 1}
                                              </Td>
                                              <Td
                                                position="sticky"
                                                left="0" // Adjust left position based on your layout needs
                                                zIndex="10"
                                                bg="white"
                                                textAlign="center"
                                                cursor="pointer"
                                                onClick={() => {
                                                  setTempData(fee);
                                                  setDiscountInput((prev) => ({
                                                    ...prev,
                                                    classMasterId:
                                                      fee.classMasterId,
                                                    streamMasterId:
                                                      fee.streamMasterId,
                                                    promotionId:
                                                      fee.promotionId,
                                                    feesTypeMasterId:
                                                      fee.feesTypeMasterId,
                                                    transportFeeMasterId:
                                                      fee.transportFeeMasterId,
                                                    feesNameMasterId: "",
                                                  }));
                                                  openDiscountModal();
                                                }}
                                                _hover={{ bg: "gray.100" }}
                                              >
                                                <Flex
                                                  align="center"
                                                  justify="center"
                                                  gap={2}
                                                >
                                                  <Text fontWeight="bold">
                                                    {
                                                      fee?.transport_fee_master
                                                        ?.name
                                                    }
                                                  </Text>
                                                  <Tooltip
                                                    label="Give Discount"
                                                    hasArrow
                                                  >
                                                    <Icon
                                                      as={BiSolidOffer}
                                                      color="blue.500"
                                                      boxSize={5}
                                                    />
                                                  </Tooltip>{" "}
                                                </Flex>
                                                <Text
                                                  fontWeight="bold"
                                                  color={
                                                    isPastDueDate(fee.dueDate)
                                                      ? "red.500"
                                                      : "inherit"
                                                  }
                                                >
                                                  {moment(fee?.dueDate).format(
                                                    "DD MMMM YYYY"
                                                  )}
                                                </Text>
                                              </Td>
                                              <Td textAlign="center">
                                                <Flex
                                                  align="center"
                                                  fontWeight="bold"
                                                  justify="center"
                                                >
                                                  <MdCurrencyRupee /> {fee.fees}
                                                </Flex>
                                              </Td>
                                              {showLateFeesColumn && (
                                                <Td textAlign="center">
                                                  <Flex
                                                    align="center"
                                                    fontWeight="bold"
                                                    justify="center"
                                                  >
                                                    <MdCurrencyRupee />{" "}
                                                    {fee.lateFees}
                                                  </Flex>
                                                </Td>
                                              )}

                                              {/* <Td
                                            textAlign="center"
                                            bg="yellow.100"
                                          >
                                            <Flex
                                              align="center"
                                              fontWeight="bold"
                                              justify="center"
                                            >
                                              <MdCurrencyRupee />{" "}
                                              {fee.discountReceived}
                                            </Flex>
                                          </Td> */}
                                              <Td
                                                textAlign="center"
                                                bg="green.50"
                                                px={3}
                                                py={2}
                                              >
                                                <VStack
                                                  spacing={1}
                                                  align="stretch"
                                                >
                                                  {/* Total Card */}
                                                  <Flex
                                                    align="center"
                                                    justify="center"
                                                    bg="white"
                                                    p={2}
                                                    borderRadius="md"
                                                    boxShadow="sm"
                                                    borderLeft="4px solid"
                                                    borderColor="green.400"
                                                  >
                                                    <Box
                                                      mr={2}
                                                      color="green.500"
                                                    >
                                                      <MdCurrencyRupee size="18px" />
                                                    </Box>
                                                    <Text
                                                      fontSize="lg"
                                                      fontWeight="bold"
                                                      color="green.800"
                                                    >
                                                      {Number(
                                                        fee.feesReceived || 0
                                                      ) +
                                                        Number(
                                                          fee.assFeesDis || 0
                                                        )}
                                                    </Text>
                                                  </Flex>

                                                  {/* Breakdown */}
                                                  <SimpleGrid
                                                    columns={2}
                                                    spacing={2}
                                                    mt={1}
                                                  >
                                                    {/* Received Fees */}
                                                    {fee.feesReceived > 0 &&
                                                      fee.assFeesDis > 0 && (
                                                        <Flex
                                                          align="center"
                                                          bg="blue.50"
                                                          p={1}
                                                          borderRadius="md"
                                                          borderLeft="2px solid"
                                                          borderColor="blue.300"
                                                        >
                                                          <Box
                                                            color="blue.500"
                                                            mr={1}
                                                          >
                                                            <IoWalletOutline size="14px" />{" "}
                                                            {/* Using wallet icon */}
                                                          </Box>
                                                          <Text
                                                            fontSize="xs"
                                                            fontWeight="medium"
                                                          >
                                                            Paid
                                                          </Text>
                                                          <Spacer />
                                                          <Text
                                                            fontSize="xs"
                                                            ml={1}
                                                          >
                                                            {fee.feesReceived}
                                                          </Text>
                                                        </Flex>
                                                      )}

                                                    {/* Discount */}
                                                    {fee.assFeesDis > 0 && (
                                                      <Flex
                                                        align="center"
                                                        bg="orange.50"
                                                        p={1}
                                                        borderRadius="md"
                                                        borderLeft="2px solid"
                                                        borderColor="orange.300"
                                                      >
                                                        <Box
                                                          color="orange.500"
                                                          mr={1}
                                                        >
                                                          <FaPercentage size="12px" />{" "}
                                                          {/* Using percentage icon */}
                                                        </Box>
                                                        <Text
                                                          fontSize="xs"
                                                          fontWeight="medium"
                                                        >
                                                          Discount
                                                        </Text>
                                                        <Spacer />
                                                        <Text
                                                          fontSize="xs"
                                                          ml={1}
                                                        >
                                                          {fee.assFeesDis}
                                                        </Text>
                                                      </Flex>
                                                    )}
                                                  </SimpleGrid>
                                                </VStack>
                                              </Td>
                                              {showLateFeesColumn && (
                                                <Td
                                                  textAlign="center"
                                                  bg="green.100"
                                                  px={3}
                                                  py={2}
                                                >
                                                  <VStack
                                                    spacing={1}
                                                    align="stretch"
                                                  >
                                                    {/* Total Late Fees */}
                                                    <Flex
                                                      align="center"
                                                      justify="center"
                                                      bg="white"
                                                      p={2}
                                                      borderRadius="md"
                                                      boxShadow="sm"
                                                      borderLeft="4px solid"
                                                      borderColor="green.400"
                                                    >
                                                      <Box
                                                        mr={2}
                                                        color="green.500"
                                                      >
                                                        <MdCurrencyRupee size="18px" />
                                                      </Box>
                                                      <Text
                                                        fontSize="lg"
                                                        fontWeight="bold"
                                                        color="green.800"
                                                      >
                                                        {Number(
                                                          fee.lateFeesReceived ||
                                                            0
                                                        ) +
                                                          Number(
                                                            fee.assLateDis || 0
                                                          )}
                                                      </Text>
                                                    </Flex>

                                                    {/* Late Fees Breakdown */}
                                                    <SimpleGrid
                                                      columns={2}
                                                      spacing={2}
                                                      mt={1}
                                                    >
                                                      {/* Late Fees Received */}
                                                      {fee.lateFeesReceived >
                                                        0 &&
                                                        fee.assLateDis > 0 && (
                                                          <Flex
                                                            align="center"
                                                            bg="blue.50"
                                                            p={1}
                                                            borderRadius="md"
                                                            borderLeft="2px solid"
                                                            borderColor="blue.300"
                                                          >
                                                            <Box
                                                              color="blue.500"
                                                              mr={1}
                                                            >
                                                              <IoWalletOutline size="12px" />{" "}
                                                              {/* Using clock icon */}
                                                            </Box>
                                                            <Text
                                                              fontSize="xs"
                                                              fontWeight="medium"
                                                            >
                                                              Paid
                                                            </Text>
                                                            <Spacer />
                                                            <Text
                                                              fontSize="xs"
                                                              ml={1}
                                                            >
                                                              {
                                                                fee.lateFeesReceived
                                                              }
                                                            </Text>
                                                          </Flex>
                                                        )}

                                                      {/* Late Fee Waiver */}
                                                      {fee.assLateDis > 0 && (
                                                        <Flex
                                                          align="center"
                                                          bg="orange.50"
                                                          p={1}
                                                          borderRadius="md"
                                                          borderLeft="2px solid"
                                                          borderColor="orange.300"
                                                        >
                                                          <Box
                                                            color="orange.500"
                                                            mr={1}
                                                          >
                                                            <FaPercentage size="12px" />{" "}
                                                            {/* Using waiver icon */}
                                                          </Box>
                                                          <Text
                                                            fontSize="xs"
                                                            fontWeight="medium"
                                                          >
                                                            Discount
                                                          </Text>
                                                          <Spacer />
                                                          <Text
                                                            fontSize="xs"
                                                            ml={1}
                                                          >
                                                            {fee.assLateDis}
                                                          </Text>
                                                        </Flex>
                                                      )}
                                                    </SimpleGrid>
                                                  </VStack>
                                                </Td>
                                              )}

                                              <Td
                                                textAlign="center"
                                                bg="red.50"
                                                px={3}
                                                py={2}
                                              >
                                                <VStack
                                                  spacing={1}
                                                  align="stretch"
                                                >
                                                  {/* Total Due Card */}
                                                  <Flex
                                                    align="center"
                                                    justify="center"
                                                    bg="white"
                                                    p={2}
                                                    borderRadius="md"
                                                    boxShadow="sm"
                                                    borderLeft="4px solid"
                                                    borderColor="red.400"
                                                  >
                                                    <Box mr={2} color="red.500">
                                                      <MdCurrencyRupee size="18px" />
                                                    </Box>
                                                    <Text
                                                      fontSize="lg"
                                                      fontWeight="bold"
                                                      color="red.800"
                                                    >
                                                      {fee.dueFees || 0}
                                                    </Text>
                                                  </Flex>

                                                  {/* Pending Discount */}
                                                  {(fee.runFeesDis > 0 ||
                                                    fee.runLateDis > 0) && (
                                                    <Flex
                                                      align="center"
                                                      bg="orange.50"
                                                      p={2}
                                                      borderRadius="md"
                                                      borderLeft="2px solid"
                                                      borderColor="orange.300"
                                                      mt={1}
                                                    >
                                                      <Box
                                                        color="orange.500"
                                                        mr={2}
                                                      >
                                                        <FaHourglassHalf size="14px" />{" "}
                                                        {/* Pending status icon */}
                                                      </Box>
                                                      <VStack
                                                        spacing={0}
                                                        align="start"
                                                      >
                                                        <Flex
                                                          fontSize="xs"
                                                          color="gray.600"
                                                        >
                                                          {fee.runFeesDis >
                                                            0 && (
                                                            <Flex
                                                              align="center"
                                                              mr={2}
                                                            >
                                                              <Text mr={1}>
                                                                Fees Discount
                                                                Pending :
                                                              </Text>
                                                              <Text fontWeight="medium">
                                                                {fee.runFeesDis}
                                                              </Text>
                                                            </Flex>
                                                          )}
                                                          {fee.runLateDis >
                                                            0 && (
                                                            <Flex align="center">
                                                              <Text mr={1}>
                                                                Late Fees
                                                                Discount Pending
                                                                :
                                                              </Text>
                                                              <Text fontWeight="medium">
                                                                {fee.runLateDis}
                                                              </Text>
                                                            </Flex>
                                                          )}
                                                        </Flex>
                                                      </VStack>
                                                    </Flex>
                                                  )}
                                                </VStack>
                                              </Td>
                                              {pageName != "TransportStop" && (
                                                <>
                                                  <Td
                                                    textAlign="center"
                                                    bg={"blue.50"}
                                                  >
                                                    <Flex
                                                      align="center"
                                                      justify="center"
                                                      bg="white"
                                                      p={2}
                                                      borderRadius="md"
                                                      boxShadow="sm"
                                                      borderLeft="4px solid"
                                                      borderColor="blue.400"
                                                    >
                                                      <Box
                                                        mr={2}
                                                        color="blue.500"
                                                      >
                                                        <MdCurrencyRupee size="18px" />
                                                      </Box>
                                                      <Input
                                                        type="number"
                                                        value={
                                                          updatedDeposits[
                                                            fee.id
                                                          ] || ""
                                                        }
                                                        disabled={
                                                          Number(
                                                            fee.calDueFees
                                                          ) === 0
                                                        }
                                                        fontWeight={700}
                                                        onChange={(e) => {
                                                          let value =
                                                            parseFloat(
                                                              e.target.value
                                                            ) || 0;
                                                          if (value < 0)
                                                            value = 0;
                                                          if (
                                                            value >
                                                            fee.calDueFees
                                                          )
                                                            value =
                                                              fee.calDueFees;
                                                          handleDepositChange(
                                                            fee.id,
                                                            value
                                                          );
                                                        }}
                                                        placeholder="Enter Fee Amount"
                                                        size="sm"
                                                        textAlign="center"
                                                        border="none"
                                                        _focus={{
                                                          boxShadow: "none",
                                                          outline: "none",
                                                        }}
                                                        _hover={{
                                                          bg: "gray.50",
                                                        }}
                                                        bg="transparent"
                                                      />
                                                    </Flex>
                                                  </Td>
                                                  {showLateFeesColumn && (
                                                    <Td
                                                      textAlign="center"
                                                      bg={"red.50"}
                                                    >
                                                      <Flex
                                                        align="center"
                                                        justify="center"
                                                        bg="white"
                                                        p={2}
                                                        borderRadius="md"
                                                        boxShadow="sm"
                                                        borderLeft="4px solid"
                                                        borderColor="red.400"
                                                      >
                                                        <Box
                                                          mr={2}
                                                          color="red.500"
                                                        >
                                                          <MdCurrencyRupee size="18px" />
                                                        </Box>
                                                        <Input
                                                          type="number"
                                                          value={
                                                            updatedDepositsLateFee[
                                                              fee.id
                                                            ] || ""
                                                          }
                                                          onChange={(e) => {
                                                            let value =
                                                              parseFloat(
                                                                e.target.value
                                                              ) || 0;
                                                            if (value < 0)
                                                              value = 0;
                                                            if (
                                                              value >
                                                              fee.calDueLate
                                                            )
                                                              value =
                                                                fee.calDueLate;
                                                            handleDepositLateFeeChange(
                                                              fee.id,
                                                              value
                                                            );
                                                          }}
                                                          disabled={
                                                            Number(
                                                              fee.calDueLate
                                                            ) === 0 ||
                                                            fee.runLateDis > 0
                                                          }
                                                          placeholder="Enter Deposit Late Fee"
                                                          size="sm"
                                                          textAlign="center"
                                                          border="none"
                                                          _focus={{
                                                            boxShadow: "none",
                                                          }}
                                                          _hover={{
                                                            bg: "gray.50",
                                                          }}
                                                        />
                                                      </Flex>
                                                    </Td>
                                                  )}
                                                </>
                                              )}
                                            </Tr>
                                          );
                                        }
                                      )}
                                    </Tbody>

                                    <Tfoot>
                                      <Tr bg="gray.100" fontWeight="bold">
                                        <Td textAlign="center" colSpan={2}>
                                          Total
                                        </Td>
                                        <Td textAlign="center">
                                          <Flex align="center" justify="center">
                                            <MdCurrencyRupee />
                                            {filteredFeesDetailsTrasport.reduce(
                                              (acc, fee) => acc + fee.fees,
                                              0
                                            )}
                                          </Flex>
                                        </Td>
                                        {showLateFeesColumn && (
                                          <Td textAlign="center">
                                            <Flex
                                              align="center"
                                              justify="center"
                                            >
                                              <MdCurrencyRupee />
                                              {filteredFeesDetailsTrasport.reduce(
                                                (acc, fee) =>
                                                  acc + fee.lateFees,
                                                0
                                              )}
                                            </Flex>
                                          </Td>
                                        )}

                                        {/* <Td textAlign="center">
                                          <Flex align="center" justify="center">
                                            <MdCurrencyRupee />
                                            {filteredFeesDetails.reduce(
                                              (acc, fee) =>
                                                acc + fee.discountReceived,
                                              0
                                            )}
                                          </Flex>
                                        </Td> */}
                                        <Td textAlign="center">
                                          <Flex align="center" justify="center">
                                            <MdCurrencyRupee />
                                            {filteredFeesDetailsTrasport.reduce(
                                              (acc, fee) =>
                                                acc +
                                                fee.feesReceived +
                                                fee.assFeesDis,
                                              0
                                            )}
                                          </Flex>
                                        </Td>
                                        {showLateFeesColumn && (
                                          <Td textAlign="center">
                                            <Flex
                                              align="center"
                                              justify="center"
                                            >
                                              <MdCurrencyRupee />
                                              {filteredFeesDetailsTrasport.reduce(
                                                (acc, fee) =>
                                                  acc +
                                                  fee.lateFeesReceived +
                                                  fee.assLateDis,
                                                0
                                              )}
                                            </Flex>
                                          </Td>
                                        )}

                                        <Td textAlign="center">
                                          <Flex align="center" justify="center">
                                            <MdCurrencyRupee />
                                            {filteredFeesDetailsTrasport.reduce(
                                              (acc, fee) =>
                                                acc + fee.dueFees || 0,
                                              0
                                            )}
                                          </Flex>
                                        </Td>
                                        {pageName != "TransportStop" && (
                                          <>
                                            <Td textAlign="center">
                                              <Flex
                                                align="center"
                                                justify="center"
                                                fontWeight={900}
                                              >
                                                <MdCurrencyRupee />
                                                {Object.values(
                                                  updatedDeposits
                                                ).reduce(
                                                  (acc, value) =>
                                                    acc +
                                                    (parseFloat(value) || 0),
                                                  0
                                                )}
                                              </Flex>
                                            </Td>
                                            {showLateFeesColumn && (
                                              <Td textAlign="center">
                                                <Flex
                                                  align="center"
                                                  justify="center"
                                                >
                                                  <MdCurrencyRupee />

                                                  {Object.values(
                                                    updatedDepositsLateFee
                                                  ).reduce(
                                                    (acc, value) =>
                                                      acc +
                                                      (parseFloat(value) || 0),
                                                    0
                                                  )}
                                                </Flex>
                                              </Td>
                                            )}
                                          </>
                                        )}

                                        {pageName == "TransportStop" && (
                                          <Td textAlign="center"></Td>
                                        )}
                                      </Tr>
                                    </Tfoot>
                                  </Table>
                                </TableContainer>
                              </Box>
                            ) : null}
                          </TabPanel>
                        </TabPanels>
                        {pageName != "TransportStop" && (
                          <Box
                            p={4}
                            bg="gray.50"
                            borderRadius="lg"
                            boxShadow="md"
                            position="fixed"
                            bottom="0"
                            right="0"
                            width={pageName == "TransportStop" ? "100%" : "80%"}
                            zIndex="1000"
                          >
                            <Flex align="center" justify="space-between" px={6}>
                              <Flex
                                align="center"
                                fontWeight="bold"
                                fontSize="lg"
                              >
                                <Text>Total Amount to be Paid:</Text>
                                <Flex
                                  color="green.500"
                                  fontSize="xl"
                                  ml={2}
                                  align="center"
                                >
                                  <MdCurrencyRupee />
                                  <Text ml={1}>{totalAmount}</Text>
                                </Flex>
                              </Flex>

                              <Button
                                colorScheme={themeColor}
                                onClick={onOpen}
                                width={"50%"}
                                isDisabled={totalAmount === 0}
                              >
                                Procced to Payment
                              </Button>
                            </Flex>
                          </Box>
                        )}

                        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>Payment Details</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              <Grid
                                templateColumns={{ base: "1fr", md: "40% 60%" }}
                                gap={4}
                              >
                                <Box
                                  borderWidth="1px"
                                  borderRadius="lg"
                                  p={4}
                                  boxShadow="md"
                                  bg="white"
                                >
                                  <CustomInput
                                    w="100%"
                                    type="date"
                                    name="date"
                                    label="Deposit Date"
                                    inputValue={inputFeesValue}
                                    setInputValue={setInputFeesValue}
                                  />
                                  <CustomTextarea
                                    type="text"
                                    notRequire={true}
                                    name="remark"
                                    label="Remark"
                                    inputValue={inputFeesValue}
                                    setInputValue={setInputFeesValue}
                                  />
                                </Box>
                                <Box
                                  borderWidth="1px"
                                  borderRadius="lg"
                                  p={4}
                                  boxShadow="md"
                                  bg="white"
                                >
                                  <form onSubmit={collectFees}>
                                    <Select
                                      w="100%"
                                      size="md"
                                      isRequired
                                      fontSize={13}
                                      fontWeight="bold"
                                      color="blue.800"
                                      focusBorderColor={`${themeColor}.400`}
                                      placeholder="Select Payment Mode"
                                      value={inputFeesValue?.type}
                                      onChange={(e) =>
                                        inputHandler("type", e.target.value)
                                      }
                                    >
                                      <option value="Cash">Cash</option>
                                      <option value="Cheque">Cheque</option>
                                      <option value="NetBanking">
                                        Net Banking
                                      </option>
                                      <option value="Upi">UPI</option>
                                      <option value="CreditCard">
                                        Credit Card
                                      </option>
                                      <option value="DebitCard">
                                        Debit Card
                                      </option>
                                      <option value="PaymentGateway">
                                        Payment Gateway
                                      </option>
                                      <option value="Other">Other</option>
                                    </Select>

                                    {/* Conditional Fields Based on Payment Mode */}
                                    {inputFeesValue?.type && (
                                      <>
                                        {inputFeesValue?.type === "Cheque" && (
                                          <>
                                            <Select
                                              w={{ lg: "47%", xl: "48.5%" }}
                                              size="md"
                                              isRequired
                                              fontSize={13}
                                              fontWeight={"bold"}
                                              color={"blue.800"}
                                              focusBorderColor={`${themeColor}.400`}
                                              placeholder="Select Bank Name"
                                              value={inputFeesValue?.bank}
                                              onChange={(e) =>
                                                inputHandler(
                                                  "bank",
                                                  e.target.value
                                                )
                                              }
                                            >
                                              {map(allAdminBanks, (bank) => (
                                                <option value={bank.name}>
                                                  {bank.name}
                                                </option>
                                              ))}
                                            </Select>
                                            <CustomInput
                                              w="100%"
                                              type="text"
                                              name="chequeNo"
                                              label="Cheque No."
                                              inputValue={inputFeesValue}
                                              setInputValue={setInputFeesValue}
                                            />
                                            <CustomInput
                                              w="100%"
                                              type="date"
                                              name="chequeDate"
                                              label="Cheque Date"
                                              inputValue={inputFeesValue}
                                              setInputValue={setInputFeesValue}
                                            />
                                          </>
                                        )}

                                        {inputFeesValue?.type !== "Cash" &&
                                          inputFeesValue?.type !== "Cheque" && (
                                            <>
                                              <CustomInput
                                                w="100%"
                                                type="text"
                                                name="transactionNo"
                                                label="Transaction No."
                                                inputValue={inputFeesValue}
                                                setInputValue={
                                                  setInputFeesValue
                                                }
                                              />
                                              <CustomInput
                                                w="100%"
                                                type="date"
                                                name="transactionDate"
                                                label="Transaction Date"
                                                inputValue={inputFeesValue}
                                                setInputValue={
                                                  setInputFeesValue
                                                }
                                              />
                                              <Select
                                                size="md"
                                                isRequired
                                                fontSize={13}
                                                fontWeight={"bold"}
                                                color={"blue.800"}
                                                focusBorderColor={`${themeColor}.400`}
                                                placeholder="Select Transfer Bank"
                                                value={
                                                  inputFeesValue?.ledgerMasterId
                                                }
                                                onChange={(e) =>
                                                  inputHandler(
                                                    "ledgerMasterId",
                                                    e.target.value
                                                  )
                                                }
                                              >
                                                {map(allBanks, (bank) => (
                                                  <option value={bank.id}>
                                                    {bank.name +
                                                      " - " +
                                                      bank.accountNumber}
                                                  </option>
                                                ))}
                                              </Select>
                                            </>
                                          )}
                                      </>
                                    )}

                                    {/* Pay Button */}
                                    <Button
                                      w="100%"
                                      mt={4}
                                      colorScheme={themeColor}
                                      type="submit"
                                      loadingText={"Processing..."}
                                      isLoading={loader}
                                      _hover={{
                                        transform: "scale(1.02)",
                                        boxShadow: "md",
                                      }}
                                      transition="all 0.2s"
                                      boxShadow="md"
                                      fontWeight="bold"
                                      fontSize={"lg"}
                                    >
                                      Confirm Payment
                                    </Button>
                                  </form>
                                </Box>
                              </Grid>
                            </ModalBody>

                            <ModalFooter>
                              <Button variant="ghost" onClick={onClose}>
                                Close
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                      </Tabs>
                      {toggleModal && (
                        <FeesModal
                          fee={toggleModal}
                          closeModal={() => setToggleModal(null)}
                        />
                      )}
                    </Box>
                  </Flex>
                </Box>
              ) : null}
            </LoadingContainer>
          </Box>
          <Modal
            isOpen={isDiscountModalOpen}
            onClose={closeDiscountModal}
            isCentered
            size="2xl" // Slightly larger for better presentation
          >
            <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
            <ModalContent
              bg={cardBg}
              borderRadius="xl"
              boxShadow={`0 10px 20px ${themeColor}.200`}
              p={6}
              position="relative"
              overflow="hidden"
              bgGradient={`linear(to-b, ${themeColor}.50, ${cardBg})`}
            >
              {/* Decorative Gradient Bar */}
              <Box
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h="6px"
                bgGradient={`linear(to-r, ${themeColor}.400, ${themeColor}.600)`}
              />

              <ModalHeader py={4} textAlign="center">
                <ScaleFade initialScale={0.9} in={true}>
                  <Text
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="extrabold"
                    color={`${themeColor}.600`}
                    bgGradient={`linear(to-r, ${themeColor}.500, ${themeColor}.700)`}
                    bgClip="text"
                    textShadow={`1px 1px 2px ${themeColor}.200`}
                  >
                    Apply Discount
                  </Text>
                </ScaleFade>
              </ModalHeader>

              <ModalCloseButton
                color={`${themeColor}.500`}
                _hover={{
                  color: `${themeColor}.700`,
                  transform: "rotate(90deg)",
                }}
                transition="all 0.2s"
              />

              <ModalBody>
                <Box
                  p={4}
                  borderRadius="md"
                  bg={`${themeColor}.100`}
                  boxShadow="sm"
                  mb={5}
                >
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color={`${themeColor}.700`}
                  >
                    Fees Head:{" "}
                    <Text as="span" fontWeight="medium" color={textColor}>
                      {tempData?.fees_name_master?.name ||
                        tempData?.transport_fee_master?.name}
                    </Text>
                  </Text>
                  <Text fontSize="md" fontWeight="bold" color="red.500">
                    Due Fees:{" "}
                    <Text as="span" fontWeight="medium" color={textColor}>
                      ₹ {tempData?.calDueFees}
                    </Text>
                  </Text>
                  <Text fontSize="md" fontWeight="bold" color="red.500">
                    Due Late Fee:{" "}
                    <Text as="span" fontWeight="medium" color={textColor}>
                      ₹ {tempData?.calDueLate}
                    </Text>
                  </Text>
                  {tempData?.runFeesDis ||
                    (tempData?.runLateDis && (
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color={`yellow.800`}
                      >
                        Discount Applied Amount:{" "}
                        <Text
                          as="span"
                          fontWeight="medium"
                          color={`yellow.800`}
                        >
                          {tempData?.runFeesDis || tempData?.runLateDis}
                        </Text>
                      </Text>
                    ))}
                </Box>
                {tempData?.runFeesDis || tempData?.runLateDis ? (
                  <Box
                    textAlign="center"
                    p={3}
                    bg="yellow.100"
                    borderRadius="md"
                    color="yellow.800"
                    fontWeight="bold"
                  >
                    Your Discount Request is Already in Process
                  </Box>
                ) : (
                  <VStack spacing={2} align="stretch">
                    {tempData?.calDueFees > 0 || tempData?.calDueLate > 0 ? (
                      <>
                        <Box
                          p={4}
                          borderRadius="lg"
                          borderWidth="1px"
                          borderColor={`${themeColor}.100`}
                          bg={`${themeColor}.50`}
                          m={0}
                        >
                          <Text
                            fontSize="md"
                            fontWeight="semibold"
                            mb={3}
                            color={`${themeColor}.700`}
                          >
                            Apply discount to:
                          </Text>

                          <RadioGroup
                            name="isLate"
                            onChange={(e) => {
                              setDiscountInput((prev) => ({
                                ...prev,
                                isLate: Number(e),
                              }));
                              setDiscountInput((prev) => ({
                                ...prev,
                                discount: 0,
                              }));
                            }}
                            value={discountInput.isLate}
                          >
                            <Stack
                              direction={{ base: "column", md: "row" }}
                              spacing={4}
                            >
                              {tempData?.calDueFees && (
                                <Radio
                                  value={0}
                                  colorScheme={themeColor}
                                  size="lg"
                                  _hover={{ transform: "scale(1.02)" }}
                                  transition="all 0.2s"
                                >
                                  <Box ml={2}>
                                    <Text fontWeight="medium">Fee</Text>
                                    <Text fontSize="sm" color="gray.500">
                                      Discount on tuition/course fees
                                    </Text>
                                  </Box>
                                </Radio>
                              )}

                              {tempData?.calDueLate > 0 && (
                                <Radio
                                  value={1}
                                  colorScheme={themeColor}
                                  size="lg"
                                  _hover={{ transform: "scale(1.02)" }}
                                  transition="all 0.2s"
                                >
                                  <Box ml={2}>
                                    <Text fontWeight="medium">Late Fee</Text>
                                    <Text fontSize="sm" color="gray.500">
                                      Discount on penalty charges
                                    </Text>
                                  </Box>
                                </Radio>
                              )}
                            </Stack>
                          </RadioGroup>
                        </Box>
                        <Input
                          type="number"
                          name="discount"
                          value={
                            discountInput.discount == 0
                              ? ""
                              : discountInput.discount
                          }
                          onChange={(e) => {
                            let value = parseFloat(e.target.value) || 0;
                            if (value < 0) {
                              value = 0;
                            }
                            const maxValue =
                              discountInput.isLate !== 1
                                ? tempData.calDueFees
                                : tempData.calDueLate;

                            if (value > maxValue) {
                              value = maxValue;
                            }

                            setDiscountInput((prev) => ({
                              ...prev,
                              discount: value,
                            }));
                          }}
                          placeholder="Discount Amount"
                          size="md"
                        />

                        <CustomTextarea
                          type="text"
                          notRequire={true}
                          name="remarks"
                          label="Remark (Optional)"
                          inputValue={discountInput}
                          setInputValue={setDiscountInput}
                          color={textColor}
                          rows={3}
                        />
                      </>
                    ) : (
                      <Box
                        textAlign="center"
                        p={3}
                        bg="yellow.100"
                        borderRadius="md"
                        color="yellow.800"
                        fontWeight="bold"
                      >
                        You have already paid the full amount
                      </Box>
                    )}
                  </VStack>
                )}
              </ModalBody>
              {tempData?.runningDiscount > 0 ? (
                ""
              ) : (
                <ModalFooter justifyContent="center" gap={4} pt={6}>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    size="lg"
                    px={8}
                    onClick={closeDiscountModal}
                    borderRadius="full"
                    boxShadow={`0 4px 8px red.200`}
                    _hover={{
                      bg: "red.50",
                      transform: "translateY(-2px)",
                      boxShadow: `0 6px 12px red.300`,
                    }}
                    transition="all 0.2s"
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme={themeColor}
                    size="lg"
                    disabled={
                      tempData?.runningDiscount > 0 || tempData?.dueFees === 0
                    }
                    px={8}
                    onClick={handleSaveDiscount}
                    borderRadius="full"
                    bgGradient={`linear(to-r, ${themeColor}.400, ${themeColor}.600)`}
                    color="white"
                    boxShadow={`0 4px 8px ${themeColor}.200`}
                    _hover={{
                      bgGradient: `linear(to-r, ${themeColor}.500, ${themeColor}.700)`,
                      transform: "translateY(-2px)",
                      boxShadow: `0 6px 12px ${themeColor}.300`,
                    }}
                    _active={{ transform: "scale(0.95)" }}
                    transition="all 0.2s"
                  >
                    Apply Discount
                  </Button>
                </ModalFooter>
              )}
            </ModalContent>
          </Modal>
          {toggleReceiptModal && (
            <ReceiptDrawer
              themeColor={themeColor}
              feeReceiptData={feeReceiptData}
              closeModal={() => setToggleReceiptModal(null)}
              resetAllData={resetAllData}
            />
          )}
        </LoadingContainer>
      </Box>
    </Box>
  );
};
