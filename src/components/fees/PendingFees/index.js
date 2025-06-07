import { DownloadExcel } from "@/common/DownloadExcel";
import { LoadingContainer } from "@/common/LoadingContainer";
import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import { useFeesSetupStore } from "@/store/feesSetup";
import { useStdFeesStore } from "@/store/stdFees";
import { getLocalStorageItem } from "@/utils/LocalStorage";
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
import { filter, find, findIndex, groupBy, map, sum, uniqBy } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { MdCurrencyRupee, MdLocalPrintshop } from "react-icons/md";
import { RiFileExcel2Fill, RiMessage2Line } from "react-icons/ri";
import { useReactToPrint } from "react-to-print";
import { SendPendingSMS } from "../SendPendingSMS";
import { StdFollowUps } from "./StdFollowUps";
import { FollowUpsList } from "./AllFollowups";
import { NoData } from "@/common/NoData";
import { SchoolHeader } from "@/common/SchoolHeader";
import dayjs from "dayjs";
import { CustomSelect } from "@/common/CustomSelect";
import { useTransportStore } from "@/store/Transport";
import StudentFeeReceiptModal from "./StudentFeeReceiptModal";
import MultiSelectSelector from "@/common/MultiSelectSelector";
import { MultiSelectDropdown } from "@/common/MultiSelectDropdown";
import Pagination from "@/common/Pagination";

export const PendingFees = ({ themeColor, sessionMasterId }) => {
  const [inputValue, setInputValue] = useState({
    feesNameMasterId: [],
    feesType: "all",
  });
  const [excelData, setExcelData] = useState(null);
  const [toggleSMS, setToggleSMS] = useState(null);
  const [toggleFollowUp, setToggleFollowUp] = useState(null);
  const [toggleFollowUpList, setToggleFollowUpList] = useState(null);
  const school = useMemo(() => getLocalStorageItem("user"), []);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [currHead, setCurrentHead] = useState(null);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    if (inputValue?.feesType === "all") {
      setInputValue((pre) => ({ ...pre, feesNameMasterId: [] }));
    }
  }, [inputValue?.feesType]);

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  const {
    getAssignFeesAction,
    getAssignFeesStatus,
    allAssignFees,
    resetGetAssignFees,
  } = useFeesSetupStore((s) => ({
    getAssignFeesAction: s.getAssignFeesAction,
    getAssignFeesStatus: s.getAssignFeesStatus,
    allAssignFees: s.allAssignFees,
    resetGetAssignFees: s.resetGetAssignFees,
  }));

  const {
    getPendingFeesAction,
    getPendingFeesStatus,
    pendingFees,
    resetPendingFees,
  } = useStdFeesStore((s) => ({
    getPendingFeesAction: s.getPendingFeesAction,
    getPendingFeesStatus: s.getPendingFeesStatus,
    pendingFees: s.pendingFees,
    resetPendingFees: s.resetPendingFees,
  }));

  const { getFeesHeadAction, getFeesHeadStatus, allFeesHeads } =
    useTransportStore((s) => ({
      getFeesHeadAction: s.getFeesHeadAction,
      getFeesHeadStatus: s.getFeesHeadStatus,
      allFeesHeads: s.allFeesHeads,
    }));

  useEffect(() => {
    if ((getFeesHeadStatus || 1) === STATUS.NOT_STARTED) {
      getFeesHeadAction();
    }
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
    if ((getAssignFeesStatus || 1) === STATUS.NOT_STARTED) {
      getAssignFeesAction({ feesMode: 1, sessionMasterId });
    }
  }, [
    getClassSubjectAction,
    getClassSubjectStatus,
    getAssignFeesAction,
    getAssignFeesStatus,
    sessionMasterId,
    getFeesHeadStatus,
    getFeesHeadAction,
  ]);

  useEffect(() => {
    return () => {
      resetGetAssignFees();
      resetPendingFees();
    };
  }, [resetGetAssignFees, resetPendingFees]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const getPendingFees = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setCurrentHead(inputValue?.feesNameMasterId);

    const trasportSearch = {
      feesMode: 1,
      sessionMasterId,
      transportFeeMasterId: inputValue.feesNameMasterId == [] ? "all" : inputValue.feesNameMasterId,
      feesTypeMasterId: inputValue?.feesType === "all" ? "all" : 2,
      classMasterId: inputValue.classMasterId,
      streamMasterId: inputValue.streamMasterId,
    };
    const AcadmicSearch = {
      feesMode: 1,
      sessionMasterId,
      feesTypeMasterId: inputValue?.feesType === "all" ? "all" : 1,
      feesNameMasterId : inputValue.feesNameMasterId == [] ? "all" : inputValue.feesNameMasterId,
      ...inputValue,
    };
    const data = {
      ...(inputValue.feesType === "transportFees"
        ? trasportSearch
        : AcadmicSearch),
      page: currentPage,
      limit: parseInt(limit),
    };
    getPendingFeesAction(data);
  };

  useEffect(() => {
    if(inputValue.feesNameMasterId && inputValue.classMasterId && inputValue.streamMasterId){
      setCurrentHead(inputValue?.feesNameMasterId);

      const trasportSearch = {
        feesMode: 1,
        sessionMasterId,
        transportFeeMasterId: inputValue.feesNameMasterId == [] ? "all" : inputValue.feesNameMasterId,
        feesTypeMasterId: inputValue?.feesType === "all" ? "all " : 2,
        classMasterId: inputValue.classMasterId,
        streamMasterId: inputValue.streamMasterId,
      };
      const AcadmicSearch = {
        feesMode: 1,
        sessionMasterId,
        feesNameMasterId : inputValue.feesNameMasterId == [] ? "all" : inputValue.feesNameMasterId,
        feesTypeMasterId: inputValue?.feesType === "all" ? "all " : 1,
        ...inputValue,
      };
      const data = {
        ...(inputValue.feesType === "transportFees"
          ? trasportSearch
          : AcadmicSearch),
        page: currentPage,
      limit: parseInt(limit),
      };
      getPendingFeesAction(data);


    }
   
    return () => {};
  }, [currentPage, limit]);

  const feesHead = useMemo(() => {
    return filter(
      allAssignFees,
      (fee) =>
        fee.classMasterId === parseInt(inputValue?.classMasterId) &&
        fee.streamMasterId === parseInt(inputValue?.streamMasterId)
    );
  }, [allAssignFees, inputValue?.classMasterId, inputValue?.streamMasterId]);

  useEffect(() => {
    if (pendingFees?.studentData?.length) {
      const data = pendingFees?.studentData.map((fee) => {
        return {
          "Sr No.": fee.student_master?.srNo,
          Name: fee.student_master?.studentName,
          "Father Name": fee.student_master?.fatherName,
          Contact: fee.student_master?.fatherContact,
          Class: pendingFees?.classData?.name,
          "Fees Name": inputValue?.feesNameMasterId
            ? find(
                feesHead,
                (f) =>
                  f.feesNameMasterId === parseInt(inputValue?.feesNameMasterId)
              )?.fees_name_master?.name
            : "All",
          Total: fee.totalFees,
          Deposite: fee.totalCollectFees,
          Discount: fee.totalCollectDiscount,
          Balance:
            fee.totalFees - (fee.totalCollectFees + fee.totalCollectDiscount) ||
            0,
        };
      });
      setExcelData(data);
    }
  }, [feesHead, inputValue?.feesNameMasterId, pendingFees]);

  const selectAllStd = () => {
    if (selectedStudent?.length === pendingFees?.studentData?.length) {
      setSelectedStudent([]);
    } else {
      setSelectedStudent(
        map(pendingFees?.studentData, (s) => ({ id: s.student_master.id }))
      );
    }
  };
  const handleCheck = (id) => {
    if (findIndex(selectedStudent, (s) => s.id === id) !== -1) {
      setSelectedStudent(filter(selectedStudent, (s) => s.id !== id));
    } else {
      setSelectedStudent([...selectedStudent, { id }]);
    }
  };

  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
          @page {
            size: landscape;
          }
        `,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const handlePrintFeeReceipt = () => {
    if (selectedStudent?.length) {
      const Class = pendingFees?.classData?.name;
      const feeHeadName =
        currHead !== "all"
          ? find(feesHead, (f) => f.feesNameMasterId === parseInt(currHead))
              ?.fees_name_master?.name
          : "All";

      const data = pendingFees?.studentData
        .filter((s) =>
          selectedStudent.find((std) => std.id === s.student_master.id)
        )
        .map((item) => ({
          ...item,
          Class,
          feeHeadName, // <-- new field added here
        }));
      setData(data);

      setIsModalOpen(true);
    } else {
      alert("Please select at least one student");
    }
  };
  return (
    <Box h="100%">
      <PageHeader
        heading={"Pending Fees"}
        extra={
          <Flex>
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
                name={"Pending Fees Data"}
              />
            </Tooltip>
          </Flex>
        }
      />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <Flex justify={"flex-start"} mt={4}>
            <form
              style={{ width: inputValue?.feesType !== "all" ? "70%" : "50%" }}
              onSubmit={getPendingFees}
            >
              <Flex pb={3} gap={4} w={"100%"}>
                <CustomSelect
                  size={"sm"}
                  name={"classMasterId"}
                  label={"Select Class"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(classes, (d, key) => ({
                    value: key,
                    name: d?.[0]?.class_master?.name,
                  }))}
                />
                <CustomSelect
                  size={"sm"}
                  name={"streamMasterId"}
                  label={"Select Stream"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(
                    uniqBy(
                      classes?.[inputValue?.classMasterId],
                      "streamMasterId"
                    ),
                    (d, index) => ({
                      value: d.stream_master.id,
                      name: d.stream_master.name,
                    })
                  )}
                />
                <CustomSelect
                  size={"sm"}
                  name={"feesType"}
                  notRequire={true}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={[
                    { name: "All Fees Type", value: "all" },
                    { name: "School Fees", value: "schoolFees" },
                    { name: "Transport Fees", value: "transportFees" },
                  ]}
                />
                {inputValue?.feesType !== "all" ? (
                  <>
                    <MultiSelectSelector
                      label="Select Fees Head"
                      name="feesNameMasterId"
                      options={
                        inputValue?.feesType === "schoolFees"
                          ? [
                              ...map(
                                uniqBy(feesHead, "feesNameMasterId"),
                                (d) => ({
                                  value: d.fees_name_master.id,
                                  name: d.fees_name_master.name,
                                })
                              ),
                              { value: 1, name: "Last Year Due" },
                            ]
                          : inputValue?.feesType === "transportFees"
                          ? map(allFeesHeads, (head) => ({
                              value: head.id,
                              name: head.name,
                            }))
                          : []
                      }
                      selectedValues={inputValue.feesNameMasterId}
                      setSelectedValues={(selectedFees) => {
                        if (selectedFees?.includes("all")) {
                          setInputValue((prev) => ({
                            ...prev,
                            feesNameMasterId: "all",
                          }));
                        } else {
                          setInputValue((prev) => ({
                            ...prev,
                            feesNameMasterId: selectedFees,
                          }));
                        }
                      }}
                    />
                  </>
                ) : null}
                  
                <Button type="submit" size={"sm"} colorScheme={themeColor}>
                  Get
                </Button>
              </Flex>
            </form>
            <Button
              size={"sm"}
              mx={2}
              px={3}
              colorScheme={themeColor}
              onClick={() => setToggleFollowUpList([])}
            >
              FollowUps List
            </Button>
            <Button
              size={"sm"}
              mx={2}
              px={3}
              colorScheme={themeColor}
              onClick={() => handlePrintFeeReceipt()}
              disabled={selectedStudent?.length > 0 ? false : true}
            >
              Fee Notice
            </Button>
            <Pagination
              totalItems={pendingFees?.totalCount}
              limit={limit}
              setLimit={setLimit}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              themeColor={themeColor}
            />
            {/* <Button size={"sm"} isDisabled={selectedStudent?.length ? false : true} colorScheme={themeColor} onClick={() => setToggleSMS(selectedStudent)}>Send SMS</Button> */}
          </Flex>
          <LoadingContainer status={getPendingFeesStatus}>
            {pendingFees?.studentData?.length ? (
              <TableContainer>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>
                        <Checkbox
                          colorScheme={themeColor}
                          isChecked={
                            selectedStudent?.length ===
                            pendingFees?.studentData?.length
                              ? true
                              : false
                          }
                          onChange={selectAllStd}
                        />
                      </Th>
                      <Th>Sr No.</Th>
                      <Th>Name</Th>
                      <Th>Father Name</Th>
                      <Th>Contact</Th>
                      <Th>Class</Th>
                      {/* <Th>Fee Head</Th> */}
                      <Th>Total</Th>
                      <Th>Total Fees</Th>
                      <Th>Total Late Fees</Th>
                      <Th>Deposite</Th>
                      <Th isNumeric>Coll. Late Fees</Th>
                      <Th>Discount</Th>
                      <Th>Due Fees</Th>
                      <Th>FollowUp</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(pendingFees?.studentData, (fee) => {
                      const isChecked =
                        findIndex(
                          selectedStudent,
                          (s) => s.id === fee.student_master.id
                        ) !== -1
                          ? true
                          : false;
                      return (
                        <Tr _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                          <Td>
                            <Checkbox
                              colorScheme={themeColor}
                              isChecked={isChecked}
                              onChange={() =>
                                handleCheck(fee.student_master?.id)
                              }
                            />
                          </Td>
                          <Td>{fee.student_master?.srNo}</Td>
                          <Td>{fee.student_master?.studentName}</Td>
                          <Td>{fee.student_master?.fatherName}</Td>
                          <Td>{fee.student_master?.fatherContact}</Td>
                          <Td>{pendingFees?.classData?.name}</Td>
                          {/* <Td>
                            {currHead !== "all"
                              ? find(
                                  feesHead,
                                  (f) =>
                                    f.feesNameMasterId === parseInt(currHead)
                                )?.fees_name_master?.name
                              : "All"}
                          </Td> */}
                          <Td>
                            <Flex align={"center"} justify={"flex-end"}>
                              <MdCurrencyRupee />
                              {fee.totalFees + fee.totalLateFees}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex align={"center"} justify={"flex-end"}>
                              <MdCurrencyRupee />
                              {fee.totalFees}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex align={"center"} justify={"flex-end"}>
                              <MdCurrencyRupee />
                              {fee.totalLateFees || 0}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex align={"center"} justify={"flex-end"}>
                              <MdCurrencyRupee />
                              {fee.totalCollectFees}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex align={"center"} justify={"flex-end"}>
                              <MdCurrencyRupee />
                              {fee.totalCollectLateFees || 0}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex align={"center"} justify={"flex-end"}>
                              <MdCurrencyRupee />
                              {fee.totalCollectDiscount}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex
                              align={"center"}
                              justify={"flex-end"}
                              color={"red.600"}
                            >
                              <MdCurrencyRupee />
                              {fee.totalFees +
                                fee.totalLateFees -
                                (fee.totalCollectFees +
                                  fee.totalCollectDiscount +
                                  fee.totalCollectLateFees)}
                            </Flex>
                          </Td>
                          <Td>
                            <Tooltip placement="top" label={"Follow Ups"}>
                              <IconButton
                                size={"xs"}
                                variant={"ghost"}
                                colorScheme={themeColor}
                                icon={
                                  <RiMessage2Line
                                    fontSize={18}
                                    onClick={() => setToggleFollowUp(fee)}
                                  />
                                }
                              />
                            </Tooltip>
                          </Td>
                        </Tr>
                      );
                    })}
                    <Tr fontSize={"bold"} bg="gray.100">
                      <Td></Td>
                      <Td fontWeight={"bold"}>Total</Td>
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                      <Td>
                        <Flex
                          align={"center"}
                          justify={"flex-end"}
                          fontWeight={"bold"}
                        >
                          <MdCurrencyRupee />
                          {sum(map(pendingFees?.studentData, "totalFees")) +
                            sum(map(pendingFees?.studentData, "totalLateFees"))}
                        </Flex>
                      </Td>
                      <Td>
                        <Flex
                          align={"center"}
                          justify={"flex-end"}
                          fontWeight={"bold"}
                        >
                          <MdCurrencyRupee />
                          {sum(map(pendingFees?.studentData, "totalFees"))}
                        </Flex>
                      </Td>
                      <Td>
                        <Flex
                          align={"center"}
                          justify={"flex-end"}
                          fontWeight={"bold"}
                        >
                          <MdCurrencyRupee />
                          {sum(map(pendingFees?.studentData, "totalLateFees"))}
                        </Flex>
                      </Td>
                      <Td>
                        <Flex
                          align={"center"}
                          justify={"flex-end"}
                          fontWeight={"bold"}
                        >
                          <MdCurrencyRupee />
                          {sum(
                            map(pendingFees?.studentData, "totalCollectFees")
                          )}
                        </Flex>
                      </Td>
                      <Td>
                        <Flex
                          align={"center"}
                          justify={"flex-end"}
                          fontWeight={"bold"}
                        >
                          <MdCurrencyRupee />
                          {sum(
                            map(
                              pendingFees?.studentData,
                              "totalCollectLateFees"
                            )
                          )}
                        </Flex>
                      </Td>
                      <Td>
                        <Flex
                          align={"center"}
                          justify={"flex-end"}
                          fontWeight={"bold"}
                        >
                          <MdCurrencyRupee />
                          {sum(
                            map(
                              pendingFees?.studentData,
                              "totalCollectDiscount"
                            )
                          )}
                        </Flex>
                      </Td>
                      <Td>
                        <Flex
                          align={"center"}
                          justify={"flex-end"}
                          fontWeight={"bold"}
                          color={"red.600"}
                        >
                          <MdCurrencyRupee />
                          {sum(map(pendingFees?.studentData, "totalFees")) +
                            sum(
                              map(pendingFees?.studentData, "totalLateFees")
                            ) -
                            (sum(
                              map(pendingFees?.studentData, "totalCollectFees")
                            ) +
                              sum(
                                map(
                                  pendingFees?.studentData,
                                  "totalCollectDiscount"
                                )
                              ) +
                              sum(
                                map(
                                  pendingFees?.studentData,
                                  "totalCollectLateFees"
                                )
                              ))}
                        </Flex>
                      </Td>
                      <Td></Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Pending Fees Found"} />
            )}
            {toggleSMS && (
              <SendPendingSMS
                data={toggleSMS}
                closeModal={() => setToggleSMS(null)}
              />
            )}
            {toggleFollowUp && (
              <StdFollowUps
              sessionMasterId={sessionMasterId}
                data={toggleFollowUp}
                closeDrawer={() => setToggleFollowUp(null)}
                themeColor={themeColor}
              />
            )}
            {toggleFollowUpList && (
              <FollowUpsList
                data={toggleFollowUpList}
                sessionMasterId={sessionMasterId}
                closeDrawer={() => setToggleFollowUpList(null)}
                themeColor={themeColor}
              />
            )}
            <Box display={"none"}>
              <Box ref={printRef} p={5}>
                <SchoolHeader
                  title={"Pending Fees Report"}
                  extra={
                    <Box>
                      <Flex
                        w="100%"
                        justify={"flex-end"}
                        fontSize={12}
                        fontWeight={"semibold"}
                      >
                        <Text w="fit-content">Class: </Text>
                        <Text ml={2} w="fit-content">
                          {pendingFees?.classData?.name} -{" "}
                          {pendingFees?.streamData?.name}
                        </Text>
                      </Flex>
                      <Flex
                        w="100%"
                        justify={"flex-end"}
                        fontSize={12}
                        fontWeight={"semibold"}
                      >
                        <Text w="fit-content">Fees Head: </Text>
                        <Text ml={2} w="fit-content">
                          {currHead !== "all"
                            ? find(
                                feesHead,
                                (f) => f.feesNameMasterId === parseInt(currHead)
                              )?.fees_name_master?.name
                            : "All"}
                        </Text>
                      </Flex>
                      <Flex w="100%" justify={"flex-end"} fontSize={12}>
                        <Text w="fit-content">Printed At: </Text>
                        <Text ml={2} w="fit-content">
                          {dayjs().format("DD-MM-YYYY hh:mm A")}
                        </Text>
                      </Flex>
                    </Box>
                  }
                />
                {pendingFees?.studentData?.length ? (
                  <TableContainer mt={4}>
                    <Table w="100%" size={"sm"} variant={"simple"}>
                      <Thead>
                        <Tr bg="gray.100">
                          <Th>Sr No.</Th>
                          <Th>Name</Th>
                          <Th>Father Name</Th>
                          <Th>Contact</Th>
                          <Th>Class</Th>
                          <Th>Total</Th>
                          <Th>Total Fees</Th>
                          <Th>T. Late Fees</Th>
                          <Th>Deposite</Th>
                          <Th isNumeric>Coll. Late Fees</Th>
                          <Th>Discount</Th>
                          <Th>Due Fees</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {map(pendingFees?.studentData, (fee) => (
                          <Tr _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                            <Td>{fee.student_master?.srNo}</Td>
                            <Td>{fee.student_master?.studentName}</Td>
                            <Td>{fee.student_master?.fatherName}</Td>
                            <Td>{fee.student_master?.fatherContact}</Td>
                            <Td>{pendingFees?.classData?.name}</Td>
                            <Td>
                              <Flex align={"center"} justify={"flex-end"}>
                                <MdCurrencyRupee />
                                {fee.totalFees + fee.totalLateFees}
                              </Flex>
                            </Td>
                            <Td>
                              <Flex align={"center"} justify={"flex-end"}>
                                <MdCurrencyRupee />
                                {fee.totalFees}
                              </Flex>
                            </Td>
                            <Td>
                              <Flex align={"center"} justify={"flex-end"}>
                                <MdCurrencyRupee />
                                {fee.totalLateFees || 0}
                              </Flex>
                            </Td>
                            <Td>
                              <Flex align={"center"} justify={"flex-end"}>
                                <MdCurrencyRupee />
                                {fee.totalCollectFees}
                              </Flex>
                            </Td>
                            <Td>
                              <Flex align={"center"} justify={"flex-end"}>
                                <MdCurrencyRupee />
                                {fee.totalCollectLateFees || 0}
                              </Flex>
                            </Td>
                            <Td>
                              <Flex align={"center"} justify={"flex-end"}>
                                <MdCurrencyRupee />
                                {fee.totalCollectDiscount}
                              </Flex>
                            </Td>
                            <Td>
                              <Flex
                                align={"center"}
                                justify={"flex-end"}
                                color={"red.600"}
                              >
                                <MdCurrencyRupee />
                                {fee.totalFees +
                                  fee.totalLateFees -
                                  (fee.totalCollectFees +
                                    fee.totalCollectDiscount +
                                    fee.totalCollectLateFees)}
                              </Flex>
                            </Td>
                          </Tr>
                        ))}
                        <Tr>
                          <Td></Td>
                          <Td></Td>
                          <Td></Td>
                          <Td>
                            <Flex
                              align={"center"}
                              justify={"flex-end"}
                              fontWeight={"bold"}
                            >
                              <MdCurrencyRupee />
                              {sum(map(pendingFees?.studentData, "totalFees")) +
                                sum(
                                  map(pendingFees?.studentData, "totalLateFees")
                                )}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex
                              align={"center"}
                              justify={"flex-end"}
                              fontWeight={"bold"}
                            >
                              <MdCurrencyRupee />
                              {sum(map(pendingFees?.studentData, "totalFees"))}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex
                              align={"center"}
                              justify={"flex-end"}
                              fontWeight={"bold"}
                            >
                              <MdCurrencyRupee />
                              {sum(
                                map(pendingFees?.studentData, "totalLateFees")
                              )}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex
                              align={"center"}
                              justify={"flex-end"}
                              fontWeight={"bold"}
                            >
                              <MdCurrencyRupee />
                              {sum(
                                map(
                                  pendingFees?.studentData,
                                  "totalCollectFees"
                                )
                              )}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex
                              align={"center"}
                              justify={"flex-end"}
                              fontWeight={"bold"}
                            >
                              <MdCurrencyRupee />
                              {sum(
                                map(
                                  pendingFees?.studentData,
                                  "totalCollectLateFees"
                                )
                              )}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex
                              align={"center"}
                              justify={"flex-end"}
                              fontWeight={"bold"}
                            >
                              <MdCurrencyRupee />
                              {sum(
                                map(
                                  pendingFees?.studentData,
                                  "totalCollectDiscount"
                                )
                              )}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex
                              align={"center"}
                              justify={"flex-end"}
                              fontWeight={"bold"}
                              color={"red.600"}
                            >
                              <MdCurrencyRupee />
                              {sum(map(pendingFees?.studentData, "totalFees")) +
                                sum(
                                  map(pendingFees?.studentData, "totalLateFees")
                                ) -
                                (sum(
                                  map(
                                    pendingFees?.studentData,
                                    "totalCollectFees"
                                  )
                                ) +
                                  sum(
                                    map(
                                      pendingFees?.studentData,
                                      "totalCollectDiscount"
                                    )
                                  ) +
                                  sum(
                                    map(
                                      pendingFees?.studentData,
                                      "totalCollectLateFees"
                                    )
                                  ))}
                            </Flex>
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                ) : (
                  <NoData title={"No Pending Fees Found"} />
                )}
              </Box>
            </Box>
          </LoadingContainer>

          <StudentFeeReceiptModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            feeData={data}
          />
        </Box>
      </Box>
    </Box>
  );
};
