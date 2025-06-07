import CustomInput from "@/common/CustomInput";
import CustomTextarea from "@/common/CustomTextarea";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useStdFeesStore } from "@/store/stdFees";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { concat, filter, find, includes, map, reject, sumBy } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { MdCurrencyRupee, MdPercent } from "react-icons/md";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { useAdminBankStore } from "@/store/Banks";
import { NoData } from "@/common/NoData";
import { URL } from "@/services/apis";
import { ViewSiblings } from "@/common/ViewSiblings";
import { ReceiptDrawer } from "@/components/fees/ReceiptDrawer";

export const HostelFees = ({ themeColor, sessionMasterId }) => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState({});
  const [inputFeesValue, setInputFeesValue] = useState({
    discount: 0,
    lateFees: 0,
    date: dayjs().format("YYYY-MM-DD"),
    feesType: "hostel-fees",
    type: "Cash",
  });
  const [toggleHeadWise, setToggleHeadWise] = useState(true);
  const [headFees, setHeadFees] = useState([]);
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
      setHeadFees([]);
    } else {
      setInputFeesValue((pre) => ({ ...pre, [name]: val }));
    }
  };

  const addHeadFees = (e) => {
    e.preventDefault();
    setHeadFees((pre) => [
      ...pre,
      {
        studentFeesId: inputFeesValue.studentFeesId,
        amount: parseFloat(inputFeesValue.amount) || 0,
        discount: parseFloat(inputFeesValue.discount) || 0,
        lateFees: parseFloat(inputFeesValue.lateFees) || 0,
      },
    ]);
    setInputFeesValue((pre) => ({
      ...pre,
      studentFeesId: "",
      amount: "",
      discount: "",
      lateFees: "",
    }));
  };

  const selectHeadHandler = (name, val) => {
    setInputFeesValue((pre) => ({
      ...pre,
      [name]: val,
      amount: "",
      discount: "",
      lateFees: "",
    }));
  };

  const deleteHeadFee = (index) => {
    setHeadFees(filter(headFees, (f, i) => i !== index));
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

  const hostelFeesDetails = useMemo(() => {
    return map(
      filter(studentFees?.studentFees, (s) => s.fees_type_master?.id === 2),
      (f) => ({
        ...f,
        totalFees:
          f.amount + f.lateFees + (sumBy(f.fees_collects, "lateFees") || 0),
        tutionFees: f.amount,
        totalLateFees: f.lateFees + (sumBy(f.fees_collects, "lateFees") || 0),
        deposite: sumBy(
          filter(f.fees_collects, (c) => c.status !== "Pending"),
          "amount"
        ),
        lateFeesCollected: sumBy(f.fees_collects, "lateFees") || 0,
        pending: sumBy(
          filter(f.fees_collects, (c) => c.status === "Pending"),
          "amount"
        ),
        discount: sumBy(f.fees_collects, "discount"),
        amount:
          f.amount -
          (sumBy(f.fees_collects, "amount") +
            sumBy(f.fees_collects, "discount")),
      })
    );
  }, [studentFees?.studentFees]);

  const handleSearchInput = (val) => {
    setSearchInput({ filters: val });
    if (val?.length >= 1) {
      searchStudentAction({
        sessionMasterId,
        search: val,
      });
    }
  };

  const feesHandler = (name, val) => {
    const feesType = hostelFeesDetails;
    if (name === "amount" && val > sumBy(feesType, "amount")) {
      setInputFeesValue((pre) => ({
        ...pre,
        [name]: sumBy(feesType, "amount"),
      }));
    } else if (
      name === "discount" &&
      val > sumBy(feesType, "amount") - (inputFeesValue?.amount || 0)
    ) {
      setInputFeesValue((pre) => ({ ...pre, [name]: 0 }));
    } else if (name === "lateFees" && val > sumBy(feesType, "lateFees")) {
      setInputFeesValue((pre) => ({
        ...pre,
        [name]: sumBy(feesType, "lateFees") || 0,
      }));
    } else {
      setInputFeesValue((pre) => ({ ...pre, [name]: val }));
    }
  };

  const headFeesHandler = (name, val) => {
    const feesType = hostelFeesDetails;
    const stdFees = find(
      feesType,
      (f) => f.id === parseInt(inputFeesValue.studentFeesId)
    );
    if (name === "amount" && val > stdFees?.amount) {
      setInputFeesValue((pre) => ({ ...pre, [name]: stdFees?.amount }));
    } else if (
      name === "discount" &&
      val > stdFees?.amount - (inputFeesValue?.amount || 0)
    ) {
      setInputFeesValue((pre) => ({ ...pre, [name]: 0 }));
    } else if (name === "lateFees" && val > (stdFees?.lateFees || 0)) {
      setInputFeesValue((pre) => ({ ...pre, [name]: stdFees?.lateFees || 0 }));
    } else {
      setInputFeesValue((pre) => ({ ...pre, [name]: val }));
    }
  };

  const unSelectedHostelFee = useMemo(() => {
    return reject(hostelFeesDetails, (std) =>
      includes(
        map(headFees, (s) => parseInt(s.studentFeesId)),
        std.id
      )
    );
  }, [headFees, hostelFeesDetails]);

  const feesDetail = useMemo(() => {
    return find(
      studentFees?.studentFees,
      (f) => f.id === parseInt(inputFeesValue?.studentFeesId)
    );
  }, [inputFeesValue?.studentFeesId, studentFees?.studentFees]);

  const getStudentFees = (id, promotionId) => {
    setSearchInput({ filters: "" });
    resetSearch();
    getStudentFeesAction({
      promotionId,
      studentMasterId: id,
      feesMode: 2,
    });
  };

  const selectSibling = (id, promotionId) => {
    setToggleViewSibling(null);
    getStudentFees(id, promotionId);
  };

  useEffect(() => {
    return () => {
      setSearchInput({ filters: "" });
      resetSearch();
      resetStudentFee();
    };
  }, [resetSearch, resetStudentFee]);

  const collectFees = (e) => {
    e.preventDefault();
    const feesType = hostelFeesDetails;
    let remainingAmount = inputFeesValue?.amount || 0;
    let remainingDiscount = inputFeesValue?.discount || 0;
    let remainingLateFees = inputFeesValue?.lateFees || 0;

    const feesDetail = feesType.map((f) => {
      const fee = Math.min(remainingAmount, f.amount);
      remainingAmount -= fee;
      const dis = Math.min(remainingDiscount, f.amount - fee);
      remainingDiscount -= dis;
      const lateFee = Math.min(remainingLateFees, f.lateFees || 0);
      remainingLateFees -= lateFee;

      return {
        studentFeesId: f.id,
        amount: fee,
        discount: dis,
        lateFees: lateFee,
      };
    });

    const temp = {
      feesTypeMasterId: 2,
      type: inputFeesValue.type,
      sessionMasterId: sessionMasterId,
      promotionId: feesType[0]?.promotionId,
      totalAmount: toggleHeadWise
        ? sumBy(headFees, "amount") || 0
        : sumBy(feesDetail, "amount"),
      totalDiscount: toggleHeadWise
        ? sumBy(headFees, "discount") || 0
        : sumBy(feesDetail, "discount"),
      totalLateFees: toggleHeadWise
        ? sumBy(headFees, "lateFees") || 0
        : sumBy(feesDetail, "lateFees"),
      studentMasterId: studentFees?.student?.id,
      classMasterId: studentFees?.classData?.id,
      sectionMasterId: studentFees?.sectionData?.id,
      streamMasterId: studentFees?.streamData?.id,
      bank: inputFeesValue.bank,
      chequeNo: inputFeesValue.chequeNo,
      chequeDate: inputFeesValue.chequeDate,
      transitionNo: inputFeesValue.transactionNo,
      transactionDate: inputFeesValue.transactionDate,
      ledgerMasterId: inputFeesValue.ledgerMasterId,
      remark: inputFeesValue.remark,
      date: inputFeesValue?.date
        ? dayjs(inputFeesValue?.date).format("YYYY-MM-DD")
        : "",
      data: toggleHeadWise
        ? headFees
        : filter(
            feesDetail,
            (f) => !(f.amount === 0 && f.discount === 0 && f.lateFees === 0)
          ),
      feesMode: 1,
    };
    collectStdFeesAction(temp);
  };

  const resetAllData = () => {
    resetStudentFee();
    setInputFeesValue({ discount: 0, date: dayjs().format("YYYY-MM-DD") });
    setHeadFees(null);
  };

  useEffect(() => {
    if (collectStdFeesStatus === STATUS.SUCCESS) {
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
      setHeadFees([]);
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

  return (
    <Box h="100%">
      {/* <PageHeader heading={"Fees Collection"} /> */}
      <Box
        p={5}
        bg={"white"}
        h={"100%"}
        className="scrollBar"
        maxH={"100%"}
        overflowY={"scroll"}
      >
        <CustomInput
          type={"text"}
          search={true}
          name="filters"
          label={"Search Student"}
          inputValue={searchInput}
          setInputValue={handleSearchInput}
        />
        {searchStudentStatus === STATUS.NOT_STARTED &&
        !searchStd?.length &&
        getStudentFeesStatus === STATUS.NOT_STARTED ? (
          <Flex mt={5} w={"100%"} align={"center"} flexDir={"column"}>
            <Image h="300px" src="/assets/student.png" alt="Search Student" />
            <Text fontSize={18} fontWeight={"semibold"}>
              Search Student
            </Text>
          </Flex>
        ) : null}
        <LoadingContainer status={searchStudentStatus}>
          <Box>
            {searchStd?.length ? (
              <TableContainer mt={5}>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>SR No.</Th>
                      <Th>Name</Th>
                      <Th>Father&apos;s Name</Th>
                      <Th>Mother&apos;s Name</Th>
                      <Th>Contact</Th>
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
                        <Td>{std.student_master.fatherContact}</Td>
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
                  <Flex
                    my={3}
                    p={2}
                    align={"center"}
                    bg={`${themeColor}.50`}
                    border={"1px solid"}
                    borderColor={"gray.200"}
                    borderRadius={10}
                  >
                    <Box w={"10%"}>
                      <Image
                        h={"70px"}
                        src={`${URL}${studentFees.student?.photo}`}
                        alt={"Profile"}
                      />
                    </Box>
                    <Box w={"45%"} fontSize={13} fontWeight={"semibold"}>
                      <Flex w={"100%"}>
                        <Text w={"25%"}>Name</Text>
                        <Text>: &nbsp;{studentFees.student?.studentName}</Text>
                      </Flex>
                      <Flex w={"100%"}>
                        <Text w={"25%"}>Father&apos;s Name</Text>
                        <Text>: &nbsp;{studentFees.student?.fatherName}</Text>
                      </Flex>
                      <Flex w={"100%"}>
                        <Text w={"25%"}>Contact </Text>
                        <Text>
                          : &nbsp;{studentFees.student?.fatherContact}
                        </Text>
                      </Flex>
                    </Box>
                    <Box w={"45%"} fontSize={13} fontWeight={"semibold"}>
                      <Flex w={"100%"}>
                        <Text w={"25%"}>Class</Text>
                        <Text>: &nbsp;{studentFees.classData?.name}</Text>
                      </Flex>
                      <Flex w={"100%"}>
                        <Text w={"25%"}>Stream</Text>
                        <Text>: &nbsp;{studentFees.streamData?.name}</Text>
                      </Flex>
                      <Flex w={"100%"}>
                        <Text w={"25%"}>Section</Text>
                        <Text>: &nbsp;{studentFees.sectionData?.name}</Text>
                      </Flex>
                    </Box>
                    <Box>
                      <Button
                        size={"sm"}
                        colorScheme={themeColor}
                        onClick={() =>
                          setToggleViewSibling(studentFees?.promotionId)
                        }
                      >
                        View Siblings
                      </Button>
                    </Box>
                  </Flex>
                  {toggleViewSibling && (
                    <ViewSiblings
                      id={toggleViewSibling}
                      closeModal={() => setToggleViewSibling(null)}
                      themeColor={themeColor}
                      selectSibling={selectSibling}
                    />
                  )}
                  <Flex mt={5}>
                    <Box
                      w={"50%"}
                      border={"1px solid"}
                      borderColor={"gray.200"}
                      p={5}
                      borderLeftRadius={5}
                      bg={`${themeColor}.50`}
                    >
                      {studentFees.feesInfo ? (
                        <Flex w={"100%"}>
                          <Box w={"50%"}>
                            <Flex fontWeight={"semibold"} fontSize={14}>
                              <Text>Total Fees</Text>
                              <Flex ml={3} align={"center"} color={"blue.500"}>
                                <MdCurrencyRupee />{" "}
                                {studentFees.feesInfo.totalFinalFees || 0}
                              </Flex>
                            </Flex>
                            <Flex fontWeight={"semibold"} fontSize={14}>
                              <Text>Total Tution Fees</Text>
                              <Flex ml={3} align={"center"} color={"blue.500"}>
                                <MdCurrencyRupee />{" "}
                                {studentFees.feesInfo.totalFees || 0}
                              </Flex>
                            </Flex>
                            <Flex fontWeight={"semibold"} fontSize={14}>
                              <Text>Total Late Fees</Text>
                              <Flex ml={3} align={"center"} color={"blue.500"}>
                                <MdCurrencyRupee />{" "}
                                {studentFees.feesInfo.totalLateFees || 0}
                              </Flex>
                            </Flex>
                            <Flex fontWeight={"semibold"} fontSize={14}>
                              <Text>Deposite</Text>
                              <Flex ml={3} align={"center"} color={"blue.500"}>
                                <MdCurrencyRupee />{" "}
                                {studentFees.feesInfo.totalFeesCollect || 0}
                              </Flex>
                            </Flex>
                            <Flex fontWeight={"semibold"} fontSize={14}>
                              <Text>LateFees Deposite</Text>
                              <Flex ml={3} align={"center"} color={"blue.500"}>
                                <MdCurrencyRupee />{" "}
                                {studentFees.feesInfo.totalLateFesCollect || 0}
                              </Flex>
                            </Flex>
                            <Flex fontWeight={"semibold"} fontSize={14}>
                              <Text>Discount</Text>
                              <Flex ml={3} align={"center"} color={"blue.500"}>
                                <MdCurrencyRupee />{" "}
                                {studentFees.feesInfo.totalDiscountCollect || 0}
                              </Flex>
                            </Flex>
                          </Box>
                          <Flex flexDir={"column"} w={"50%"} align={"flex-end"}>
                            <Flex fontWeight={"semibold"} fontSize={18}>
                              <Text>Due Fees</Text>
                              <Flex ml={3} align={"center"} color={"red.500"}>
                                <MdCurrencyRupee />{" "}
                                {studentFees.feesInfo.totalDue || 0}
                              </Flex>
                            </Flex>
                            <Flex fontWeight={"semibold"} fontSize={14}>
                              <Text>Late Fees Due</Text>
                              <Flex ml={3} align={"center"} color={"red.500"}>
                                <MdCurrencyRupee />{" "}
                                {studentFees.feesInfo.totalLateFees -
                                  studentFees.feesInfo.totalLateFesCollect}
                              </Flex>
                            </Flex>
                          </Flex>
                        </Flex>
                      ) : null}
                      {hostelFeesDetails?.length ? (
                        <Box mt={4} fontSize={14} pl={4}>
                          <Flex
                            px={2}
                            py={1}
                            ml={-4}
                            fontWeight={"semibold"}
                            bg={`${themeColor}.200`}
                            align={"center"}
                            justify={"space-between"}
                          >
                            <Text>Hostel Fees Details</Text>
                            <Text fontSize={14} fontWeight={"bold"}>
                              Due Fees: &nbsp;{" "}
                              {sumBy(hostelFeesDetails, "amount")}
                            </Text>
                          </Flex>
                          <TableContainer>
                            <Table>
                              <Tbody>
                                <Tr>
                                  <Td>
                                    <Flex fontWeight={"bold"}>Fees Head </Flex>
                                  </Td>
                                  <Td>
                                    <Flex fontWeight={"bold"}>Total Fees </Flex>
                                  </Td>
                                  <Td>
                                    <Flex fontWeight={"bold"}>
                                      Tution Fees{" "}
                                    </Flex>
                                  </Td>
                                  <Td>
                                    <Flex fontWeight={"bold"}>
                                      Total Late Fees{" "}
                                    </Flex>
                                  </Td>
                                  <Td>
                                    <Flex fontWeight={"bold"}>Deposite </Flex>
                                  </Td>
                                  <Td>
                                    <Flex fontWeight={"bold"}>
                                      Late Fees Deposite
                                    </Flex>
                                  </Td>
                                  <Td>
                                    <Flex fontWeight={"bold"}>Discount </Flex>
                                  </Td>
                                  <Td>
                                    <Flex fontWeight={"bold"}>Due Fees</Flex>
                                  </Td>
                                  <Td>
                                    <Flex fontWeight={"bold"}>
                                      Due Late Fees
                                    </Flex>
                                  </Td>
                                  <Td>
                                    <Flex fontWeight={"bold"}>Due Date </Flex>
                                  </Td>
                                </Tr>
                                {map(hostelFeesDetails, (fee) => (
                                  <Tr>
                                    <Td>{fee?.transport_fee_master?.name}</Td>
                                    <Td>
                                      <Flex
                                        align={"center"}
                                        justify={"flex-end"}
                                      >
                                        <MdCurrencyRupee />
                                        {fee.totalFees}
                                      </Flex>
                                    </Td>
                                    <Td>
                                      <Flex
                                        align={"center"}
                                        justify={"flex-end"}
                                      >
                                        <MdCurrencyRupee />
                                        {fee.tutionFees}
                                      </Flex>
                                    </Td>
                                    <Td>
                                      <Flex
                                        align={"center"}
                                        justify={"flex-end"}
                                      >
                                        <MdCurrencyRupee />
                                        {fee.totalLateFees}
                                      </Flex>
                                    </Td>
                                    <Td>
                                      <Flex
                                        align={"center"}
                                        justify={"flex-end"}
                                      >
                                        <MdCurrencyRupee />
                                        {fee.deposite || 0}
                                      </Flex>
                                    </Td>
                                    <Td>
                                      <Flex
                                        align={"center"}
                                        justify={"flex-end"}
                                      >
                                        <MdCurrencyRupee />
                                        {fee.lateFeesCollected || 0}
                                      </Flex>
                                    </Td>
                                    <Td>
                                      <Flex
                                        align={"center"}
                                        justify={"flex-end"}
                                      >
                                        <MdCurrencyRupee />
                                        {fee.discount || 0}
                                      </Flex>
                                    </Td>
                                    <Td>
                                      <Flex
                                        align={"center"}
                                        justify={"flex-end"}
                                      >
                                        <MdCurrencyRupee />
                                        {fee.amount || 0}
                                      </Flex>
                                    </Td>
                                    <Td>
                                      <Flex
                                        align={"center"}
                                        justify={"flex-end"}
                                      >
                                        <MdCurrencyRupee />
                                        {fee.lateFees || 0}
                                      </Flex>
                                    </Td>
                                    <Td>
                                      {fee.dueDate
                                        ? dayjs(fee.dueDate).format(
                                            "DD-MM-YYYY"
                                          )
                                        : ""}
                                    </Td>
                                  </Tr>
                                ))}
                                <Tr>
                                  <Td
                                    style={{
                                      fontSize: 15,
                                      background: "white",
                                    }}
                                  >
                                    <Flex fontWeight={"bold"}>Total </Flex>
                                  </Td>
                                  <Td
                                    style={{
                                      fontSize: 15,
                                      background: "white",
                                    }}
                                  >
                                    <Flex
                                      fontWeight={"bold"}
                                      align={"center"}
                                      justify={"flex-end"}
                                    >
                                      <MdCurrencyRupee />
                                      {sumBy(hostelFeesDetails, "totalFees") ||
                                        0}
                                    </Flex>
                                  </Td>
                                  <Td
                                    style={{
                                      fontSize: 15,
                                      background: "white",
                                    }}
                                  >
                                    <Flex
                                      fontWeight={"bold"}
                                      align={"center"}
                                      justify={"flex-end"}
                                    >
                                      <MdCurrencyRupee />
                                      {sumBy(hostelFeesDetails, "tutionFees") ||
                                        0}
                                    </Flex>
                                  </Td>
                                  <Td
                                    style={{
                                      fontSize: 15,
                                      background: "white",
                                    }}
                                  >
                                    <Flex
                                      fontWeight={"bold"}
                                      align={"center"}
                                      justify={"flex-end"}
                                    >
                                      <MdCurrencyRupee />
                                      {sumBy(
                                        hostelFeesDetails,
                                        "totalLateFees"
                                      ) || 0}
                                    </Flex>
                                  </Td>
                                  <Td
                                    style={{
                                      fontSize: 15,
                                      background: "white",
                                    }}
                                  >
                                    <Flex
                                      fontWeight={"bold"}
                                      align={"center"}
                                      justify={"flex-end"}
                                    >
                                      <MdCurrencyRupee />
                                      {sumBy(hostelFeesDetails, "deposite") ||
                                        0}
                                    </Flex>
                                  </Td>
                                  <Td
                                    style={{
                                      fontSize: 15,
                                      background: "white",
                                    }}
                                  >
                                    <Flex
                                      fontWeight={"bold"}
                                      align={"center"}
                                      justify={"flex-end"}
                                    >
                                      <MdCurrencyRupee />
                                      {sumBy(
                                        hostelFeesDetails,
                                        "lateFeesCollected"
                                      ) || 0}
                                    </Flex>
                                  </Td>
                                  <Td
                                    style={{
                                      fontSize: 15,
                                      background: "white",
                                    }}
                                  >
                                    <Flex
                                      fontWeight={"bold"}
                                      align={"center"}
                                      justify={"flex-end"}
                                    >
                                      <MdCurrencyRupee />
                                      {sumBy(hostelFeesDetails, "discount") ||
                                        0}
                                    </Flex>
                                  </Td>
                                  <Td
                                    style={{
                                      fontSize: 15,
                                      background: "white",
                                    }}
                                  >
                                    <Flex
                                      fontWeight={"bold"}
                                      align={"center"}
                                      justify={"flex-end"}
                                    >
                                      <MdCurrencyRupee />
                                      {sumBy(hostelFeesDetails, "amount") || 0}
                                    </Flex>
                                  </Td>
                                  <Td
                                    style={{
                                      fontSize: 15,
                                      background: "white",
                                    }}
                                  >
                                    <Flex
                                      fontWeight={"bold"}
                                      align={"center"}
                                      justify={"flex-end"}
                                    >
                                      <MdCurrencyRupee />
                                      {sumBy(hostelFeesDetails, "lateFees") ||
                                        0}
                                    </Flex>
                                  </Td>
                                  <Td
                                    style={{
                                      fontSize: 15,
                                      background: "white",
                                    }}
                                  ></Td>
                                </Tr>
                              </Tbody>
                            </Table>
                          </TableContainer>
                        </Box>
                      ) : null}
                    </Box>
                    <Box
                      w={"50%"}
                      border={"1px solid"}
                      borderColor={"gray.200"}
                      align={"center"}
                      p={5}
                      borderRightRadius={5}
                    >
                      <Text fontSize={20} fontWeight={"semibold"}>
                        Fees Collection Details
                      </Text>
                      <Flex w={"90%"} mt={4} gap={3} flexWrap={"wrap"}>
                        <Select
                          w={{ lg: "47%", xl: "48.5%" }}
                          size="md"
                          isRequired
                          disabled={true}
                          fontSize={13}
                          fontWeight={"bold"}
                          color={"blue.800"}
                          focusBorderColor={`${themeColor}.400`}
                          placeholder="Select Fees"
                          value={inputFeesValue?.feesType}
                          onChange={(e) =>
                            inputHandler("feesType", e.target.value)
                          }
                        >
                          <option value={"hostel-fees"}>Hostel Fees</option>
                        </Select>
                        <CustomInput
                          w={{ lg: "47%", xl: "48.5%" }}
                          type={"date"}
                          name="date"
                          label={"Date"}
                          inputValue={inputFeesValue}
                          setInputValue={setInputFeesValue}
                        />
                        {toggleHeadWise ? (
                          <>
                            <Select
                              w={"100%"}
                              size="md"
                              fontSize={13}
                              fontWeight={"bold"}
                              color={"blue.800"}
                              focusBorderColor={`${themeColor}.400`}
                              placeholder="Select Fees Head"
                              value={inputFeesValue?.studentFeesId}
                              onChange={(e) =>
                                selectHeadHandler(
                                  "studentFeesId",
                                  e.target.value
                                )
                              }
                            >
                              {map(
                                concat(
                                  find(
                                    hostelFeesDetails,
                                    (f) =>
                                      f?.id === inputFeesValue?.studentFeesId
                                  ) || [],
                                  unSelectedHostelFee
                                ),
                                (fee) => (
                                  <option value={fee.id}>
                                    {" "}
                                    {fee?.transport_fee_master?.name}
                                  </option>
                                )
                              )}
                            </Select>
                            {feesDetail ? (
                              <Flex w={"100%"}>
                                <Flex
                                  p={2}
                                  mt={-4}
                                  mb={-2}
                                  w={"50%"}
                                  fontSize={12}
                                  color={"red.500"}
                                  fontWeight={"bold"}
                                  fontStyle={"italic"}
                                >
                                  <Text>Due Fees: </Text>
                                  <Text ml={1}>
                                    {feesDetail.amount -
                                      (sumBy(
                                        feesDetail.fees_collects,
                                        "amount"
                                      ) +
                                        sumBy(
                                          feesDetail.fees_collects,
                                          "discount"
                                        ))}
                                  </Text>
                                </Flex>
                                <Flex
                                  p={2}
                                  mt={-4}
                                  mb={-2}
                                  w={"50%"}
                                  fontSize={12}
                                  color={"red.500"}
                                  fontWeight={"bold"}
                                  fontStyle={"italic"}
                                >
                                  <Text>Due Late Fees: </Text>
                                  <Text ml={1}>{feesDetail.lateFees || 0}</Text>
                                </Flex>
                              </Flex>
                            ) : null}
                            <CustomInput
                              w={{ lg: "47%", xl: "48.5%" }}
                              type={"number"}
                              fees={true}
                              notRequire={true}
                              name="amount"
                              label={"Fees Amount"}
                              inputValue={inputFeesValue}
                              setInputValue={headFeesHandler}
                            />
                            {/* <CustomInput
                              w={{ lg: "47%", xl: "48.5%" }}
                              type={"number"}
                              fees={true}
                              notRequire={true}
                              name="discount"
                              label={"Discount"}
                              inputValue={inputFeesValue}
                              setInputValue={headFeesHandler}
                            /> */}
                            <CustomInput
                              w={{ lg: "47%", xl: "48.5%" }}
                              type={"number"}
                              fees={true}
                              notRequire={true}
                              name="lateFees"
                              label={"Late Fees"}
                              inputValue={inputFeesValue}
                              setInputValue={headFeesHandler}
                            />
                            <Button
                              w={{ lg: "47%", xl: "48.5%" }}
                              isDisabled={
                                inputFeesValue?.studentFeesId &&
                                inputFeesValue.amount &&
                                (inputFeesValue.amount > 0 ||
                                  inputFeesValue.discount > 0 ||
                                  inputFeesValue.lateFees > 0)
                                  ? false
                                  : true
                              }
                              colorScheme={themeColor}
                              size={"md"}
                              onClick={addHeadFees}
                            >
                              Add
                            </Button>
                          </>
                        ) : (
                          <>
                            <CustomInput
                              w={{ lg: "47%", xl: "48.5%" }}
                              type={"number"}
                              fees={true}
                              name="amount"
                              label={"Fees Amount"}
                              inputValue={inputFeesValue}
                              setInputValue={feesHandler}
                            />
                            {/* <CustomInput
                              w={{ lg: "47%", xl: "48.5%" }}
                              type={"number"}
                              fees={true}
                              name="discount"
                              label={"Discount"}
                              inputValue={inputFeesValue}
                              setInputValue={feesHandler}
                            /> */}
                            <CustomInput
                              w={{ lg: "47%", xl: "48.5%" }}
                              type={"number"}
                              fees={true}
                              name="lateFees"
                              label={"Late Fees"}
                              inputValue={inputFeesValue}
                              setInputValue={feesHandler}
                            />
                          </>
                        )}
                        {headFees?.length ? (
                          <TableContainer w={"100%"} mt={2} mb={5}>
                            <Table w={"100%"}>
                              <Thead>
                                <Tr>
                                  <Th>Fees Head</Th>
                                  <Th>Amount</Th>
                                  <Th>Discount</Th>
                                  <Th>LateFees</Th>
                                  <Th>Action</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {map(headFees, (head, index) => (
                                  <Tr>
                                    <Td>
                                      {
                                        find(
                                          hostelFeesDetails,
                                          (f) =>
                                            f.id ===
                                            parseInt(head.studentFeesId)
                                        )?.transport_fee_master?.name
                                      }
                                    </Td>
                                    <Td>{head.amount}</Td>
                                    <Td>{head.discount}</Td>
                                    <Td>{head.lateFees}</Td>
                                    <Td>
                                      <IconButton
                                        size={"xs"}
                                        variant={"ghost"}
                                        icon={<DeleteIcon />}
                                        onClick={() => deleteHeadFee(index)}
                                      />
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </TableContainer>
                        ) : null}
                        {(
                          toggleHeadWise === true
                            ? headFees?.length
                              ? true
                              : false
                            : true
                        ) ? (
                          <form onSubmit={collectFees}>
                            <Flex w={"100%"} gap={3} flexWrap={"wrap"}>
                              <Select
                                w={
                                  inputFeesValue?.type &&
                                  inputFeesValue?.type !== "cash"
                                    ? { lg: "47%", xl: "48.5%" }
                                    : "100%"
                                }
                                size="md"
                                isRequired
                                fontSize={13}
                                fontWeight={"bold"}
                                color={"blue.800"}
                                focusBorderColor={`${themeColor}.400`}
                                placeholder="Select Payment Mode"
                                value={inputFeesValue?.type}
                                onChange={(e) =>
                                  inputHandler("type", e.target.value)
                                }
                              >
                                <option value={"Cash"}>Cash</option>
                                <option value={"Cheque"}>Cheque</option>
                                <option value={"NetBanking"}>
                                  Net Banking
                                </option>
                                <option value={"Upi"}>UPI</option>
                                <option value={"CreditCard"}>
                                  Credit Card
                                </option>
                                <option value={"DebitCard"}>Debit Card</option>
                                <option value={"PaymentGateway"}>
                                  Payment Gateway
                                </option>
                                <option value={"Other"}>Other</option>
                              </Select>
                              {inputFeesValue?.type ? (
                                inputFeesValue?.type === "Cash" ? (
                                  <></>
                                ) : inputFeesValue?.type === "Cheque" ? (
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
                                        inputHandler("bank", e.target.value)
                                      }
                                    >
                                      {map(allAdminBanks, (bank) => (
                                        <option value={bank.name}>
                                          {bank.name}
                                        </option>
                                      ))}
                                    </Select>
                                    {/* <CustomInput w={{lg:"47%",xl:"48.5%"}} type={"text"} name="bank" label={"Bank Details"} inputValue={inputFeesValue} setInputValue={setInputFeesValue} /> */}
                                    <CustomInput
                                      w={{ lg: "47%", xl: "48.5%" }}
                                      type={"text"}
                                      name="chequeNo"
                                      label={"Cheque No./DD"}
                                      inputValue={inputFeesValue}
                                      setInputValue={setInputFeesValue}
                                    />
                                    <CustomInput
                                      w={{ lg: "47%", xl: "48.5%" }}
                                      type={"date"}
                                      name="chequeDate"
                                      label={"Cheque Date"}
                                      inputValue={inputFeesValue}
                                      setInputValue={setInputFeesValue}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <CustomInput
                                      w={{ lg: "47%", xl: "48.5%" }}
                                      type={"text"}
                                      name="transactionNo"
                                      label={"Transaction No."}
                                      inputValue={inputFeesValue}
                                      setInputValue={setInputFeesValue}
                                    />
                                    <CustomInput
                                      w={{ lg: "47%", xl: "48.5%" }}
                                      type={"date"}
                                      name="transactionDate"
                                      label={"Transaction Date"}
                                      inputValue={inputFeesValue}
                                      setInputValue={setInputFeesValue}
                                    />
                                    <Select
                                      w={{ lg: "47%", xl: "48.5%" }}
                                      size="md"
                                      isRequired
                                      fontSize={13}
                                      fontWeight={"bold"}
                                      color={"blue.800"}
                                      focusBorderColor={`${themeColor}.400`}
                                      placeholder="Select Transfer Bank"
                                      value={inputFeesValue?.ledgerMasterId}
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
                                )
                              ) : (
                                <></>
                              )}
                              <CustomTextarea
                                type={"text"}
                                notRequire={true}
                                name="remark"
                                label={"Remark"}
                                inputValue={inputFeesValue}
                                setInputValue={setInputFeesValue}
                              />
                              <Button
                                w="100%"
                                isLoading={
                                  collectStdFeesStatus === STATUS.FETCHING
                                }
                                colorScheme={themeColor}
                                isDisabled={
                                  toggleHeadWise
                                    ? headFees?.length
                                      ? false
                                      : true
                                    : false
                                }
                                type="submit"
                              >
                                Pay
                              </Button>
                            </Flex>
                          </form>
                        ) : null}
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              ) : null}
            </LoadingContainer>
          </Box>
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
