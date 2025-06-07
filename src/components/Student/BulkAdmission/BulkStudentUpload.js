import { DownloadExcel } from "@/common/DownloadExcel";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import ExcelDataUpload from "./UploadStudents";
import { useEffect, useMemo, useState } from "react";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { useClassSetupStore } from "@/store/classSetup";
import { useFeesSetupStore } from "@/store/feesSetup";
import {
  concat,
  differenceBy,
  filter,
  find,
  findIndex,
  groupBy,
  map,
  slice,
  uniqBy,
} from "lodash";
import { STATUS } from "@/constant";
import dayjs from "dayjs";
import {
  ADMISSIONTYPE,
  BLOODGROUP,
  CATEGORY,
  OCCUPATIONTYPE,
  RELIGION,
} from "@/constant/AdmissionConstant";
import { STDFIELDS } from "@/constant/StdFields";
import { useStudentStore } from "@/store/studentStore";
import Image from "next/image";
import { PageHeader } from "@/common/PageHeader";
import { useRouter } from "next/router";
import { CustomSelect } from "@/common/CustomSelect";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { FiCheck, FiDatabase, FiUpload, FiUsers, FiX } from "react-icons/fi";
import CustomInput from "@/common/CustomInput";
import axios from "axios";
import { BiLoaderAlt } from "react-icons/bi";
import { DIFFERENT_URL } from "@/services/apis";

export const BulkStudentUpload = ({ themeColor, sessionMasterId, data }) => {
  const router = useRouter();
  const students = filter(
    STDFIELDS,
    (s) =>
      s.id !== "selectedSubjects" &&
      s.id !== "fees" &&
      s.id !== "houseMasterId" &&
      s.id !== "classMasterId" &&
      s.id !== "streamMasterId" &&
      s.id !== "sectionMasterId"
  );
  const newStudents = students.reduce((obj, field) => {
    obj[field.name] = "";
    return obj;
  }, {});

  const isMac = typeof process !== "undefined" && process.platform === "darwin";

  const excelEpoch = isMac ? 24107 : 25569;
  const [inputValue, setInputValue] = useState({});
  const [excelData, setExcelData] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  // const [toggleError, setToggleError] = useState([])

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));
  const convertISODate = (isoDate) => {
    return isoDate ? dayjs(isoDate).format("YYYY-MM-DD") : null;
  };
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

  const { getSectionAction, getSectionStatus, allSections } =
    useClassSetupStore((s) => ({
      getSectionAction: s.getSectionAction,
      getSectionStatus: s.getSectionStatus,
      allSections: s.allSections,
    }));

  const {
    bulkAdmissionAction,
    bulkAdmissionStatus,
    bulkAdmission,
    resetbulkAdmissionStatus,
    getAllStudentAction,
  } = useStudentStore((s) => ({
    bulkAdmissionAction: s.bulkAdmissionAction,
    bulkAdmissionStatus: s.bulkAdmissionStatus,
    bulkAdmission: s.bulkAdmission,
    resetbulkAdmissionStatus: s.resetbulkAdmissionStatus,
    getAllStudentAction: s.getAllStudentAction,
  }));

  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
    if ((getAssignFeesStatus || 1) === STATUS.NOT_STARTED) {
      getAssignFeesAction({ sessionMasterId });
    }
    if ((getSectionStatus || 1) === STATUS.NOT_STARTED) {
      getSectionAction();
    }
  }, [
    getClassSubjectAction,
    getClassSubjectStatus,
    getAssignFeesAction,
    getAssignFeesStatus,
    sessionMasterId,
    getSectionStatus,
    getSectionAction,
  ]);

  useEffect(() => {
    return () => resetGetAssignFees();
  }, [resetGetAssignFees]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);



  const secSub = useMemo(() => {
    return find(
      classes?.[inputValue?.classMasterId],
      (c) => c.streamMasterId === parseInt(inputValue?.streamMasterId)
    );
  }, [classes, inputValue?.classMasterId, inputValue?.streamMasterId]);

  const optionalSub = useMemo(() => {
    return filter(
      secSub?.assign_class_subjects,
      (s) => s.subjectType === "Optional"
    );
  }, [secSub]);

  const feesHead = useMemo(() => {
    return filter(
      allAssignFees,
      (fee) =>
        fee.classMasterId === parseInt(inputValue?.classMasterId) &&
        fee.streamMasterId === parseInt(inputValue?.streamMasterId)
    );
  }, [allAssignFees, inputValue?.classMasterId, inputValue?.streamMasterId]);

  const handleCheck = (row) => {
    if (findIndex(selectedData, (s) => s[0] === row[0]) !== -1) {
      setSelectedData(filter(selectedData, (s) => s[0] !== row[0]));
    } else {
      const newRow = [
        ...row,
        map(secSub?.assign_class_subjects, "id"),
        map(uniqBy(feesHead, "feesNameMasterId"), "id"),
      ];
      newRow[12] = newRow[12] === true ? 1 : 0;
      const data = concat(selectedData, [newRow]);
      setSelectedData(data);
    }
  };

  const uniqueStudent = useMemo(() => {
    const uniqData = excelData?.slice(1).reduce((acc, row, rowIndex) => {
      const srNo = row[0];
      const isUnique = !acc.some((item) => item.srNo === srNo);
      if (isUnique) {
        acc.push({ srNo, data: row });
      }
      return acc;
    }, []);
    return uniqData?.map((item) => item.data);
  }, [excelData]);

  const handleCheckAll = () => {
    if (uniqueStudent?.length === selectedData?.length) {
      setSelectedData([]);
    } else {
      setSelectedData(
        map(uniqueStudent, (row) => {
          const newRow = [
            ...row,
            map(secSub?.assign_class_subjects, "id"),
            row[12] === true
              ? []
              : map(uniqBy(feesHead, "feesNameMasterId"), "id"),
          ];
          newRow[12] = newRow[12] === true ? 1 : 0;
          return newRow;
        })
      );
    }
  };

  const handleSubject = (srno, admissionNo, id) => {
    const stdIndex = findIndex(selectedData, (s) => s[0] === srno);
    const updatedSelectedData = [...selectedData];
    if (stdIndex !== -1) {
      const student = [...updatedSelectedData[stdIndex]];
      const subjectIndex = student[38]?.indexOf(id);
      if (subjectIndex !== -1) {
        student[38]?.splice(subjectIndex, 1);
      } else {
        student[38] = student[38] ? [...student[38], id] : [id];
      }
      updatedSelectedData[stdIndex] = student;
      setSelectedData(updatedSelectedData);
    }
  };

  const [toggleError, setToggleError] = useState([]);

  useEffect(() => {
    const newToggleError = excelData?.slice(1).map((row, rowIndex) => {
      const inValidGender =
        row[9] === "Male" || row[9] === "Female" ? false : true;
      const inValidSource =
        findIndex(ADMISSIONTYPE, (cat) => cat.id === row[10]) === -1
          ? true
          : false;
      const inValidType = row[11] === "New" || row[11] === "Old" ? false : true;
      const inValidRTE = row[12] === true || row[12] === false ? false : true;
      const inValidReligion =
        findIndex(RELIGION, (cat) => cat.id === row[13]) === -1 ? true : false;
      const inValidCategory =
        findIndex(CATEGORY, (cat) => cat.id === row[14]) === -1 ? true : false;
      const inValidHandi = row[15] === "Yes" || row[15] === "No" ? false : true;
      const inValidBlood =
        findIndex(BLOODGROUP, (cat) => cat.id === row[16]) === -1
          ? true
          : false;
      const inValidOccupation =
        findIndex(OCCUPATIONTYPE, (occup) => occup.id === row[19]) === -1
          ? true
          : false;

      return (
        inValidGender ||
        inValidSource ||
        inValidType ||
        inValidRTE ||
        inValidReligion ||
        inValidCategory ||
        inValidHandi ||
        inValidBlood ||
        inValidOccupation
      );
    });

    setToggleError(newToggleError);
  }, [excelData, selectedData]);

  const invalid = useMemo(() => {
    return toggleError?.includes(true) ? true : false;
  }, [toggleError]);


  const bulkSubmit = (e) => {
    bulkAdmissionAction({
      ...inputValue,
      sessionMasterId,
      isOpeningFees: carryForwardOldFee ? 1 : 0,
      studentData: map(selectedData, (data) => {
        return {
          ...students.reduce((obj, field, index) => {
            obj[field.id] =
              field.id === "admissionDate" || field.id === "dob"
                ? data[index]
                : data[index] === null
                ? null
                : data[index];
            return obj;
          }, {}),
          srNo: typeof data[0] === 'number' ? String(data[0]) : data[0],
          selectedSubject: data[38],
          selectedFees: data[39],
        };
      }),
    });
  };

  useEffect(() => {
    if (bulkAdmissionStatus === STATUS.SUCCESS) {
      resetbulkAdmissionStatus();
      setExcelData(null);
      if (!bulkAdmission?.wroungData?.length) {
        getAllStudentAction({ page: 1, limit: 10, sessionMasterId });
        router.push("/student/student-admission");
        // closeDrawer()
      }
    }
  }, [
    bulkAdmission,
    bulkAdmissionStatus,
    getAllStudentAction,
    resetbulkAdmissionStatus,
    router,
    sessionMasterId,
  ]);
  const { getShiftAction, getShiftStatus, allShifts } = useAdditionalSetupStore(
    (s) => ({
      getShiftAction: s.getShiftAction,
      getShiftStatus: s.getShiftStatus,
      allShifts: s.allShifts,
    })
  );
  useEffect(() => {
    if ((getShiftStatus || 1) === STATUS.NOT_STARTED) {
      getShiftAction();
    }
  }, [getShiftAction, getShiftStatus]);

  const getCellStyle = (cellIndex, validationFlags) => {
    const validationMap = {
      9: validationFlags.inValidGender,
      10: validationFlags.inValidSource,
      11: validationFlags.inValidType,
      12: validationFlags.inValidRTE,
      13: validationFlags.inValidReligion,
      14: validationFlags.inValidCategory,
      15: validationFlags.inValidHandi,
      16: validationFlags.inValidBlood,
      19: validationFlags.inValidOccupation,
    };

    const isInvalid = validationMap[cellIndex];

    return {
      backgroundColor: isInvalid ? "red" : null,
      color: isInvalid ? "white" : null,
    };
  };

  const [importChoice, setImportChoice] = useState(null); // null means no choice made yet
  const [showConfirmation, setShowConfirmation] = useState(true);

  const handleImportChoice = (choice) => {
    setImportChoice(choice);
    setShowConfirmation(false);
  };
  const [carryForwardOldFee, setCarryForwardOldFee] = useState(true); // Default to true

  const handleChangeImportMethod = () => {
    setShowConfirmation(true);
    setImportChoice(null);
    // Optionally reset other states if needed
    setExcelData(null);
    setSelectedData([]);
    setInputValue({});
  };
  const [sessions, setSessions] = useState([]);
  const [inputField, setInputField] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const handleGetData = async () => {
    try {
      setLoading(true);
      const responseSession = await fetch(
        `${DIFFERENT_URL}user/session/?dbName=${inputField.dbName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const Sessiondata = await responseSession.json();
      setSessions(Sessiondata?.data || []);
      const response = await fetch(`${DIFFERENT_URL}user/class`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dbName: inputField.dbName,
        }),
      });

      const data = await response.json();
      if (data.status) {
        setApiData(data?.data || []);
      }

      toast({
        title: data.message || Sessiondata.message,
        status: data.status ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const usedAdmissionNumbers = new Set();

  const generateUniqueAdmissionNo = () => {
    let uniqueNo;
    do {
      uniqueNo = `${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
    } while (usedAdmissionNumbers.has(uniqueNo));

    usedAdmissionNumbers.add(uniqueNo);
    return uniqueNo;
  };

  const [dbInputField, setDbInputField] = useState({});
  const [listLoader, setlistLoader] = useState(false);
  const fetchStudents = async () => {
    try {
      setlistLoader(true);
      const response = await axios.post(`${DIFFERENT_URL}user/addmission`, {
        sessionid: dbInputField.sessionId,
        classid: dbInputField.classId,
        streamid: dbInputField.streamId,
        sectionid: dbInputField.sectionId,
        dbName: inputField.dbName,
      });

      const students = response.data.data;
      usedAdmissionNumbers.clear();
      const headers = [
        "Sr No",
        "Admission No",
        "Admission Date",
        "Form No",
        "Student Name",
        "Student Contact",
        "Student Email",
        "DOB",
        "Aadhar No",
        "Gender",
        "Admission Source",
        "Application Type",
        "Is RTE",
        "Religion",
        "Category",
        "Handicap",
        "Blood Group",
        "Father Name",
        "Father Contact",
        "Occupation",
        "Income",
        "Mother Name",
        "Mother Contact",
        "Address",
        "Guardian Name",
        "Guardian Contact",
        "Guardian Email",
        "Corresponding Address",
        "Prev Sr No",
        "Prev Class",
        "Prev Stream",
        "Prev School",
        "Prev Max Marks",
        "Prev Obtain Marks",
        "Prev Percent Marks",
        "Prev Address",
        "Opening Amount",
        "Appar ID",
      ];

      const formattedStudentData = students.map((student) => {
        const data = student.student || {};
        return [
          data.SrNo || null,
          generateUniqueAdmissionNo(), // ✅ Unique Admission No (No Duplicates)
          data.AdminDate ? convertISODate(data.AdminDate) : null,
          data.FormNo || null,
          data.StuName || null,
          data.MobileNo || null,
          data.Email || null,
          data.Dob ? convertISODate(data.Dob) : null,
          data.AadharNo || null,
          data.Gender || null,
          data.AdminType || null,
          data.Mode || null,
          data.StuType || false,
          data.Religion || null,
          data.Category || null,
          data.Handicapped || null,
          data.BloodGroup || null,
          data.FatherName || null,
          data.MobileNo || null,
          data.FatherOccup || null,
          data.FatherIncome || null,
          data.mothername || null,
          data.MotherMobile || null,
          data.ParmanentAdd || null,
          data.GuarName || null,
          data.GuarMobileNo || null,
          data.GuarEmail || null,
          data.CorrsAdd || null,
          null, // Prev Sr No
          null, // Prev Class
          null, // Prev Stream
          null, // Prev School
          null, // Prev Max Marks
          null, // Prev Obtain Marks
          null, // Prev Percent Marks
          null, // Prev Address
          student?.duePayment, // Opening Amount
          null, // Appar ID
        ];
      });

      // ✅ Update state (Avoid duplicates)
      setExcelData([headers, ...formattedStudentData]);
      setlistLoader(false);
    } catch (error) {
      setlistLoader(false);
      console.error("Error fetching students:", error);
    }
  };
  const renderSelect = (title, parentId, selectedState, type) => {
    if (!apiData) return null;
    return (
      <Box mb={4} width={"20%"}>
        <CustomSelect
          size={"md"}
          name={type + "Id"}
          label={"Select " + title}
          notRequire={true}
          inputValue={dbInputField}
          setInputValue={setDbInputField}
          data={apiData
            ?.filter((data) => data.ParentId === parentId)
            .map((data) => ({
              value: data.id,
              name: data.MiscName,
            }))}
        />
      </Box>
    );
  };

  return (
    <Box h={"100%"}>
      <PageHeader
        heading={"Student Bulk Admission"}
        extra={
          <>
            <DownloadExcel
              data={[newStudents]}
              name={"Bulk Student Admission"}
            />
          </>
        }
      />
      <Box
        className="scrollBar"
        maxH={"80vh"}
        overflowY={"auto"}
        p={6}
        bg="white"
        borderRadius="xl"
        boxShadow="lg"
        borderWidth="1px"
        borderColor="gray.100"
      >
        {showConfirmation ? (
          <VStack spacing={6} align="center" textAlign="center">
            <Box textAlign="center">
              <Icon
                as={FiUsers}
                boxSize={8}
                color={`${themeColor}.500`}
                mb={3}
              />
              <Text fontSize="2xl" fontWeight="bold" mb={2}>
                Import Student Data
              </Text>
              <Text color="gray.600">
                Choose your preferred method to import student records
              </Text>
            </Box>
            <Flex gap={6} wrap="wrap" justify="center">
              <Button
                variant="outline"
                colorScheme={themeColor}
                onClick={() => handleImportChoice("system")}
                size="lg"
                px={8}
                leftIcon={<FiDatabase />}
                borderWidth="2px"
                _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                transition="all 0.2s"
              >
                Import from System
              </Button>
              <Button
                variant="solid"
                colorScheme={themeColor}
                onClick={() => handleImportChoice("excel")}
                size="lg"
                px={8}
                leftIcon={<FiUpload />}
                _hover={{ transform: "translateY(-2px)", shadow: "md" }}
                transition="all 0.2s"
              >
                Upload Excel File
              </Button>
            </Flex>

            <Text fontSize="sm" color="gray.500" mt={4}>
              Supported formats: .xlsx, .csv
            </Text>
          </VStack>
        ) : importChoice === "excel" ? (
          <Box p={5} bg={"white"} h={"90%"}>
            <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
              <form onSubmit={bulkSubmit}>
                <VStack spacing={3}>
                  <Flex w={"100%"}>
                    <Flex pb={3} gap={4} w="70%">
                      <CustomSelect
                        size={"md"}
                        name={"classMasterId"}
                        label={"Select Class"}
                        notRequire={true}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        data={map(classes, (d, key) => ({
                          value: key,
                          name: d?.[0]?.class_master?.name,
                        }))}
                      />
                      <CustomSelect
                        size={"md"}
                        name={"streamMasterId"}
                        label={"Select Stream"}
                        notRequire={true}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        data={map(
                          uniqBy(
                            classes?.[inputValue?.classMasterId],
                            "streamMasterId"
                          ),
                          (d, index) => ({
                            value: d.stream_master?.id,
                            name: d.stream_master.name,
                          })
                        )}
                      />
                      <CustomSelect
                        size={"md"}
                        name={"sectionMasterId"}
                        label={"Select Section"}
                        notRequire={true}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        data={map(allSections, (d) => ({
                          value: d.id,
                          name: d.name,
                        }))}
                      />
                      <CustomSelect
                        size={"md"}
                        name={"shiftId"}
                        label={"Select Shift"}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        data={map(allShifts, (d, key) => ({
                          value: d?.id,
                          name: d?.name,
                        }))}
                      />
                    </Flex>
                    <Flex gap={3} w={"40%"} justify={"flex-end"}>
                      <Button
                        size={"sm"}
                        colorScheme={themeColor}
                        onClick={() => handleChangeImportMethod()}
                      >
                        Change Import Method
                      </Button>
                      <ExcelDataUpload
                        disabled={
                          inputValue?.streamMasterId &&
                          inputValue?.sectionMasterId
                            ? false
                            : true
                        }
                        themeColor={themeColor}
                        setExcelData={setExcelData}
                      />
                    </Flex>
                  </Flex>
                </VStack>
              </form>
            </Box>
            {!invalid && excelData == null && (
              <ExcelValidation
                themeColor={themeColor}
                toggleError={toggleError}
              />
            )}
          </Box>
        ) : (
          <Box mt={10}>
            <VStack spacing={3}>
              <Flex w={"100%"}>
                <Flex pb={3} gap={4} w="70%">
                  <CustomInput
                    w={"32%"}
                    type={"text"}
                    notRequire={true}
                    name="dbName"
                    label={"DB Name"}
                    inputValue={inputField}
                    setInputValue={setInputField}
                  />
                  {/* <CustomInput
                  w={"32%"}
                  type={"text"}
                  notRequire={true}
                  name="dbUsername"
                  label={"DB Username"}
                  inputValue={inputField}
                  setInputValue={setInputField}
                />
                <CustomInput
                  w={"32%"}
                  type={"password"}
                  notRequire={true}
                  name="dbPassword"
                  label={"DB Password"}
                  inputValue={inputField}
                  setInputValue={setInputField}
                /> */}
                  <Button
                    size={"md"}
                    colorScheme={themeColor}
                    onClick={() => handleGetData()}
                  >
                    Connect
                  </Button>
                  <Button
                    size={"md"}
                    colorScheme={themeColor}
                    onClick={() => handleChangeImportMethod()}
                  >
                    Change Import Method
                  </Button>
                </Flex>
              </Flex>
            </VStack>
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
                height="100px"
              >
                <BiLoaderAlt size={"40px"} color="blue" className="spinner" />
              </Box>
            ) : (
              <Box
                p={3}
                gap={2}
                display={"flex"}
                flexWrap={"wrap"}
                justifyContent={"flex-start"}
                width={"100%"}
              >
                {sessions?.length > 0 && (
                  <Box mb={4} width={"20%"}>
                    <CustomSelect
                      size={"md"}
                      name={"sessionId"}
                      label={"Select Session"}
                      notRequire={true}
                      inputValue={dbInputField}
                      setInputValue={setDbInputField}
                      data={sessions.map((session) => ({
                        value: session.id,
                        name: session.SessionYear,
                      }))}
                    />
                  </Box>
                )}

                {apiData?.length > 0 &&
                  renderSelect("Class", 1, dbInputField, "class")}
                {apiData?.length > 0 &&
                  renderSelect("Section", 8, dbInputField, "section")}
                {apiData?.length > 0 &&
                  renderSelect("Stream", 5, dbInputField, "stream")}
                {dbInputField.streamId &&
                  dbInputField.classId &&
                  dbInputField.sectionId && (
                    <Box>
                      <Button
                        colorScheme="blue"
                        size="md"
                        onClick={fetchStudents}
                        isLoading={listLoader} // Loader inside button
                        loadingText="Fetching..."
                      >
                        Get Students
                      </Button>
                    </Box>
                  )}
              </Box>
            )}
          </Box>
        )}
        {excelData?.length ? (
          <>
            {invalid ? (
              <>
                <Text color={"red.500"}>
                  Given Fields Value must be same in excel
                </Text>
                <ExcelValidation
                  themeColor={themeColor}
                  toggleError={toggleError}
                />
              </>
            ) : null}
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
                            uniqueStudent?.length === selectedData?.length
                              ? true
                              : false
                          }
                          onChange={handleCheckAll}
                        />
                      </Th>
                      {excelData[0].map((header, index) => (
                        <Th key={index}>{header}</Th>
                      ))}
                      <Th>Optional Subjects </Th>
                      <Th>Fees</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {excelData.slice(1)?.map((row, rowIndex) => {
                      const prevData = map(
                        slice(slice(excelData, 1), 0, rowIndex),
                        (s) => ({ srNo: s[0] })
                      );
                      const uniqData = filter(
                        prevData,
                        (d) => d.srNo === row[0]
                      );
                      const selected = find(
                        selectedData,
                        (s) => s[0] === row[0]
                      );
                      const subjects = selected?.[38];
                      return (
                        <Tr
                          key={rowIndex}
                          bgColor={uniqData?.length ? "red.300" : "null"}
                        >
                          <Td>
                            {uniqData?.length ? null : (
                              <Checkbox
                                isChecked={selected ? true : false}
                                onChange={() => handleCheck(row)}
                              />
                            )}
                          </Td>
                          {map(new Array(38), (a, cellIndex) => {
                            const cell = row[cellIndex];

                            // Create the validation flags for this row
                            const validationFlags = {
                              inValidGender:
                                row[9] !== "Male" && row[9] !== "Female",
                              inValidSource:
                                findIndex(
                                  ADMISSIONTYPE,
                                  (admiss) => admiss.id === row[10]
                                ) === -1,
                              inValidType:
                                row[11] !== "New" && row[11] !== "Old",
                              inValidRTE: row[12] !== true && row[12] !== false,
                              inValidReligion:
                                findIndex(
                                  RELIGION,
                                  (rele) => rele.id === row[13]
                                ) === -1,
                              inValidCategory:
                                findIndex(
                                  CATEGORY,
                                  (cat) => cat.id === row[14]
                                ) === -1,
                              inValidHandi:
                                row[15] !== "Yes" && row[15] !== "No",
                              inValidBlood:
                                findIndex(
                                  BLOODGROUP,
                                  (blood) => blood.id === row[16]
                                ) === -1,
                              inValidOccupation:
                                findIndex(
                                  OCCUPATIONTYPE,
                                  (occup) => occup.id === row[19]
                                ) === -1,
                            };
                            const cellStyles = getCellStyle(
                              cellIndex,
                              validationFlags
                            );

                            return (
                              <Td key={cellIndex} style={cellStyles}>
                                {cellIndex === 2 || cellIndex === 7
                                  ? cell
                                    ? cell
                                    : ""
                                  : cellIndex === 12
                                  ? cell === true
                                    ? "TRUE"
                                    : cell === false
                                    ? "FALSE"
                                    : cell
                                  : cell}
                              </Td>
                            );
                          })}

                          <Td>
                            <Flex gap={3}>
                              {uniqData?.length
                                ? null
                                : optionalSub?.length
                                ? map(optionalSub, (sub) => {
                                    const checked = find(
                                      subjects,
                                      (s) => s === sub?.id
                                    );
                                    return sub?.subject_master ? (
                                      <Checkbox
                                        isChecked={checked ? true : false}
                                        onChange={() =>
                                          handleSubject(row[0], row[1], sub.id)
                                        }
                                      >
                                        {sub?.subject_master?.name}
                                      </Checkbox>
                                    ) : null;
                                  })
                                : "-"}
                            </Flex>
                          </Td>
                          <Td>
                            <Flex gap={3}>
                              {row[12] === true
                                ? null
                                : uniqData?.length
                                ? null
                                : map(
                                    uniqBy(feesHead, "feesNameMasterId"),
                                    (fee) => {
                                      const checked = row[39]?.includes(fee.id);

                                      return fee.fees_name_master
                                        ? fee.fees_name_master.name
                                        : null;
                                    }
                                  )}
                            </Flex>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
            <Flex w={"100%"} justify={"flex-end"}>
              <Flex w={"100%"} justify={"flex-end"}>
                {inputValue?.classMasterId &&
                inputValue?.streamMasterId &&
                inputValue?.sectionMasterId &&
                inputValue?.shiftId ? (
                  <>
                  
                    <Flex
                      direction="column"
                      gap={3}
                      p={3}
                      bg="gray.50"
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="gray.200"
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="gray.700"
                      >
                        Fee Carry Forward Option
                      </Text>

                      <Text fontSize="xs" color="gray.500" mb={1}>
                        Do you want to carry forward all students previous fee
                        amounts?
                      </Text>

                      <Flex gap={3}>
                        <Button
                          size="sm"
                          variant={carryForwardOldFee ? "solid" : "outline"}
                          colorScheme={carryForwardOldFee ? "blue" : "gray"}
                          leftIcon={<Icon as={FiCheck} />}
                          onClick={() => setCarryForwardOldFee(true)}
                          flex="1"
                        >
                          Yes
                        </Button>

                        <Button
                          size="sm"
                          variant={!carryForwardOldFee ? "solid" : "outline"}
                          colorScheme={!carryForwardOldFee ? "orange" : "gray"}
                          leftIcon={<Icon as={FiX} />}
                          onClick={() => setCarryForwardOldFee(false)}
                          flex="1"
                        >
                          No
                        </Button>
                      </Flex>
                    </Flex>
                    <Button
                      size={"sm"}
                      onClick={() => bulkSubmit()}
                      isDisabled={!invalid && excelData?.length ? false : true}
                      isLoading={bulkAdmissionStatus === STATUS.FETCHING}
                      colorScheme={themeColor}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <Box mt={4}>
                    <Button
                      size={"sm"}
                      colorScheme={"red"}
                      onClick={() => setImportChoice("excel")}
                    >
                      Promote Student
                    </Button>
                  </Box>
                )}
              </Flex>
            </Flex>
          </>
        ) : bulkAdmission?.wroungData?.length ? (
          <Box w={"100%"}>
            <Flex mb={3} justify={"center"}>
              <Text fontWeight={"semibold"}>
                Duplicate Data or SR No Already Exist
              </Text>
            </Flex>
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    {map(students, (std) => (
                      <Th>{std.name}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {map(bulkAdmission?.wroungData, (stdData) => (
                    <Tr>
                      {map(students, (std) => (
                        <Td>{stdData?.[std.id]}</Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};
const ExcelValidation = ({ themeColor, toggleError }) => {
  // Get indices where toggleError is true
  const errorIndices = toggleError?.reduce((acc, curr, idx) => {
    if (curr === true) acc.push(idx + 1 + ", ");
    return acc;
  }, []);
  return (
    <Box w={"100%"} align={"center"}>
      <Box
        w={"80%"}
        p={5}
        fontSize={14}
        border={"1px solid"}
        borderColor={`${themeColor}.200`}
        borderRadius={10}
      >
        <Image
          style={{ marginTop: "-10px" }}
          src={"/assets/attention.png"}
          alt={"Attention Please"}
          width={240}
          height={50}
        />
        <Flex
          w={"100%"}
          px={4}
          mt={2}
          mb={4}
          fontSize={16}
          fontWeight={"semibold"}
          color={"white"}
          bg={"red.500"}
        >
          <Text>Note:- </Text>
          <Box ml={2}>
            <Text>*Please Follow the Following Format in Excel</Text>
            <Text textAlign={"left"} w={"100%"}>
              *Below Values are Case Sensitive
            </Text>
          </Box>
        </Flex>

        {/* <Flex>
                    <Flex w={"48%"}>
                        <Text fontWeight={"semibold"}>Sr No. :</Text>
                        <Flex flex={1} borderBottom={"1px dashed"} borderColor={"gray.300"} />
                    </Flex>
                    <Text mr={3} fontWeight={"semibold"}>Male/Female</Text>
                </Flex> */}
        <Box px={4}>
          <Flex mt={1}>
            <Text w={"30%"} textAlign={"left"} mr={2}>
              1. Gender :{" "}
            </Text>
            <Text mr={3} fontWeight={"semibold"}>
              Male/Female
            </Text>
          </Flex>
          <Flex mt={1}>
            <Text w={"30%"} textAlign={"left"} mr={2}>
              2. Admission Source :{" "}
            </Text>
            {map(ADMISSIONTYPE, (cat) => (
              <Text mr={3} fontWeight={"semibold"}>
                {cat.label}
              </Text>
            ))}
          </Flex>
          <Flex mt={1}>
            <Text w={"30%"} textAlign={"left"} mr={2}>
              3. Application Type :{" "}
            </Text>
            <Text mr={3} fontWeight={"semibold"}>
              New/Old
            </Text>
          </Flex>
          <Flex mt={1}>
            <Text w={"30%"} textAlign={"left"} mr={2}>
              4. Is RTE :{" "}
            </Text>
            <Text mr={3} fontWeight={"semibold"}>
              TRUE/FALSE
            </Text>
          </Flex>
          <Flex mt={1}>
            <Text w={"30%"} textAlign={"left"} mr={2}>
              5. Religion :{" "}
            </Text>
            {map(RELIGION, (rele) => (
              <Text mr={3} fontWeight={"semibold"}>
                {rele.label}
              </Text>
            ))}
          </Flex>
          <Flex mt={1}>
            <Text w={"30%"} textAlign={"left"} mr={2}>
              6. Category :{" "}
            </Text>
            {map(CATEGORY, (cat) => (
              <Text mr={3} fontWeight={"semibold"}>
                {cat.label}
              </Text>
            ))}
          </Flex>
          <Flex mt={1}>
            <Text w={"30%"} textAlign={"left"} mr={2}>
              7. Handicap :{" "}
            </Text>
            <Text mr={3} fontWeight={"semibold"}>
              Yes/No
            </Text>
          </Flex>
          <Flex mt={1}>
            <Text w={"30%"} textAlign={"left"} mr={2}>
              8. Blood Group :{" "}
            </Text>
            {map(BLOODGROUP, (blood) => (
              <Text mr={3} fontWeight={"semibold"}>
                {blood.label}
              </Text>
            ))}
          </Flex>
          <Flex mt={1}>
            <Text w={"30%"} textAlign={"left"} mr={2}>
              9. Father&apos;s Occupation :{" "}
            </Text>
            <Flex w={"70%"} flexWrap={"wrap"}>
              {map(OCCUPATIONTYPE, (occup) => (
                <Text mr={3} fontWeight={"semibold"}>
                  {occup.label}
                </Text>
              ))}
            </Flex>
          </Flex>
          <Flex
            w={"100%"}
            p={2}
            mt={2}
            mb={4}
            fontSize={16}
            fontWeight={"semibold"}
            color={"white"}
            bg={"red.500"}
            borderRadius={"2xl"}
            textAlign={"center"}
          >
            <Text>Note:- </Text>
            <Box ml={2}>
              Validation Errors in Excel Data Line No. : - {errorIndices}
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};
