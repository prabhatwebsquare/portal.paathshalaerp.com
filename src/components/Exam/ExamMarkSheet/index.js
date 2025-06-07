import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import { useStudentStore } from "@/store/studentStore";
import { useRouter } from "next/router";
import {
  Box,
  HStack,
  IconButton,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Text,
  Tooltip,
  Tr,
  Button,
  Checkbox,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import {
  filter,
  find,
  findIndex,
  groupBy,
  intersectionBy,
  map,
  uniqBy,
} from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { PrintMarkSheet } from "./FullPageMarkSheet";
import { CustomSelect } from "@/common/CustomSelect";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { LoadingContainer } from "@/common/LoadingContainer";
import { useExamStore } from "@/store/Exam";
import { HalfPageMarkSheet } from "./HalfPageMarkSheet";
import { MultiSelectDropdown } from "@/common/MultiSelectDropdown";
import { MarksheetLayout } from "@/components/fees/MarksheetLayout";
import { HalfPageMarkSheet2 } from "./HalfPageMarkSheet2";

export const ExamMarkSheet = ({ themeColor, sessionMasterId }) => {
  const [inputValue, setInputValue] = useState({});
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [toggleModal, setToggleModal] = useState(null);
  const inputMarksheetField  = (name , val) => {
    
    setMarksheetGroupId((pre) => ({ ...pre, [name]: val }));
  }
  const { getSectionAction, getSectionStatus, allSections } =
    useClassSetupStore((s) => ({
      getSectionAction: s.getSectionAction,
      getSectionStatus: s.getSectionStatus,
      allSections: s.allSections,
    }));

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  const {
    getFilterStudentsAction,
    getFilterStudentsStatus,
    filterStudents,
    resetFilterStdStatus,
  } = useStudentStore((s) => ({
    getFilterStudentsAction: s.getFilterStudentsAction,
    getFilterStudentsStatus: s.getFilterStudentsStatus,
    filterStudents: s.filterStudents,
    resetFilterStdStatus: s.resetFilterStdStatus,
  }));

  const {
    getAssignExamAction,
    getAssignExamStatus,
    allAssignExams,
    getMarkSheetAction,
    getMarkSheetStatus,
    markSheet,
    resetMarkSheet,
    getpublishMarksheetGroupAction,
    publishMarksheetGroup,
  } = useExamStore((s) => ({
    publishMarksheetGroup: s.publishMarksheetGroup,
    getpublishMarksheetGroupAction: s.getpublishMarksheetGroupAction,
    getAssignExamAction: s.getAssignExamAction,
    getAssignExamStatus: s.getAssignExamStatus,
    allAssignExams: s.allAssignExams,
    getMarkSheetAction: s.getMarkSheetAction,
    getMarkSheetStatus: s.getMarkSheetStatus,
    markSheet: s.markSheet,
    resetMarkSheet: s.resetMarkSheet,
  }));
  const school = getLocalStorageItem("user");
  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
    if ((getSectionStatus || 1) === STATUS.NOT_STARTED) {
      getSectionAction();
    }
  }, [
    getClassSubjectAction,
    getClassSubjectStatus,
    getSectionAction,
    getSectionStatus,
  ]);

  useEffect(() => {
    if (inputValue?.streamMasterId) {
      getAssignExamAction({
        classMasterId: inputValue.classMasterId,
        streamMasterId: inputValue.streamMasterId,
        sessionMasterId,
      });
    }
  }, [
    getAssignExamAction,
    inputValue?.classMasterId,
    inputValue?.streamMasterId,
    sessionMasterId,
  ]);

  useEffect(() => {
    return () => resetFilterStdStatus();
  }, [resetFilterStdStatus]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const getFilterStudent = () => {
    getFilterStudentsAction({ ...inputValue, sessionMasterId });
  };

  const selectAllStd = () => {
    if (selectedStudent?.length === filterStudents?.length) {
      setSelectedStudent([]);
    } else {
      setSelectedStudent(map(filterStudents, (s) => s.id));
    }
  };

  const handleCheck = (id) => {
    if (findIndex(selectedStudent, (s) => s === id) !== -1) {
      setSelectedStudent(filter(selectedStudent, (s) => s.id !== id));
    } else {
      setSelectedStudent([...selectedStudent, id]);
    }
  };
  const handlePrintClick = () => {
    const data = {
      promotionId: selectedStudent.map((item) => item),
      marksheetGroupId: marksheetGroupId?.marksheetGroupId,
      sessionMasterId: sessionMasterId,
      orgCode: school?.schoolData?.schoolCode,
    };
    if (!marksheetGroupId?.marksheetGroupId) {
      alert("Please Select Marksheet Group");
      return;
    }

    getMarkSheetAction(data);
  };

  useEffect(() => {
    if (getMarkSheetStatus === STATUS.SUCCESS) {
      setToggleModal(markSheet);
      resetMarkSheet();
    }
  }, [getMarkSheetStatus, markSheet, resetMarkSheet]);

  const close = () => {
    setToggleModal(null);
    resetMarkSheet();
  };

  useEffect(() => {
    getpublishMarksheetGroupAction();
  }, []);

  const [marksheetGroupId, setMarksheetGroupId] = useState();
  const router = useRouter();
  const generateURL = (data, marksheetGroupId, sessionMasterId) => {
    const baseUrl = "/marksheet";

    const promotionId = data.map((item) => item).join(",");
    const query = new URLSearchParams({
      orgCode: "RAJTEMPRAM309",
      marksheetGroupId: marksheetGroupId?.marksheetGroupId,
      sessionMasterId: sessionMasterId,
    });

    return `${baseUrl}?${query.toString()}&promotionId=${promotionId}`;
  };

  const url = generateURL(selectedStudent, marksheetGroupId, sessionMasterId);
  const handleRedirect = () => {
    router.push(url);
  };

  const [openChooseLayout, setOpenChooseLayout] = useState(null);

 const marksheetLayout =  getLocalStorageItem("marksheetLayout"); 
  return (
    <Box h={"100%"}>
      <PageHeader heading={"Exam MarksSheet"} />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <Flex justify={"space-between"}>
            {/* <form style={{ width: "80%" }} onSubmit={getFilterStudent}> */}
            <Flex w={"80%"} pb={3} gap={4} mt={2}>
              <CustomSelect
                w={"23%"}
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
                w={"23%"}
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
                w={"23%"}
                size={"sm"}
                name={"sectionMasterId"}
                label={"Select Section"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[
                  { value: "all", name: "All Section" },
                  ...map(allSections, (d) => ({ value: d.id, name: d.name })),
                ]}
              />
              <MultiSelectDropdown
                w={"50%"}
                name={"marksheetGroupId"}
                label={"Select Publish Marksheet Group"}
                value={marksheetGroupId?.marksheetGroupId}
                selected={inputMarksheetField}
                options={map(publishMarksheetGroup, (d) => ({
                  value: d.id,
                  label: d.name,
                }))}
              />
              <Button
                type="submit"
                size={"sm"}
                colorScheme={themeColor}
                onClick={getFilterStudent}
              >
                Get
              </Button>
              <Button
                // flex={1}
                px={7}
                colorScheme={themeColor}
                size={"sm"}
                onClick={() => setOpenChooseLayout(true)}
              >
                Marksheet Layout&lsquo;s
              </Button>
              
            </Flex>
            {/* </form> */}
            <Button
              px={4}
              size={"sm"}
              colorScheme={themeColor}
              isDisabled={selectedStudent?.length ? false : true}
              onClick={handlePrintClick}
              isLoading={getMarkSheetStatus === STATUS.FETCHING}
            >
              Print
            </Button>
          </Flex>
          {(getFilterStudentsStatus || 1) === STATUS.NOT_STARTED ? (
            <Flex justify={"center"} mt={7}>
              <Text>Get Class Student First</Text>
            </Flex>
          ) : (
            <LoadingContainer status={getFilterStudentsStatus}>
              <TableContainer>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>
                        <Checkbox
                          colorScheme={themeColor}
                          isChecked={
                            selectedStudent?.length === filterStudents?.length
                              ? true
                              : false
                          }
                          onChange={selectAllStd}
                        />
                      </Th>
                      <Th>Sr No.</Th>
                      <Th>Roll No.</Th>
                      <Th>Name</Th>
                      <Th>Father Name</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(filterStudents, (std, index) => {
                      const isChecked =
                        findIndex(selectedStudent, (s) => s === std.id) !== -1
                          ? true
                          : false;
                      return (
                        <Tr
                          key={index}
                          _hover={{ bg: "gray.50" }}
                          cursor={"pointer"}
                        >
                          <Td>
                            <Checkbox
                              colorScheme={themeColor}
                              isChecked={isChecked}
                              onChange={() => handleCheck(std.id)}
                            />
                          </Td>
                          <Td>{std.srNo}</Td>
                          <Td>{std.rollNo}</Td>
                          <Td>{std.student_master.studentName}</Td>
                          <Td>{std.student_master.fatherName}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </LoadingContainer>
          )}

             {openChooseLayout && (
              <MarksheetLayout
                themeColor={themeColor}
                Data={{}}
                closeModal={() => setOpenChooseLayout(null)}
                // resetAllData={resetFeesReceipt}
              />
            )}
          {toggleModal && (
            <PrintPreview
              data={toggleModal}
              themeColor={themeColor}
              closeModal={close}
              marksheetLayout={marksheetLayout}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};


const PrintPreview = ({ data, closeModal, themeColor, marksheetLayout }) => {
  const [allPrintProps, setAllPrintProps] = useState(null);
  const printAllRef = useRef(null);

  const printClose = () => {
    setAllPrintProps(null);
    closeModal();
  };

  const handlePrintAllClick = () => {
    if (data?.studentData) {
      setAllPrintProps(data.studentData);
    }
  };
  const handleAllPrint = useReactToPrint({
    content: () => printAllRef.current,
    onAfterPrint: () => {
      setAllPrintProps(null);
    },
    onPrintError: printClose,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 20mm 10mm 20mm 10mm;
      }
      body {
        margin: 0;
        padding: 0;
      }
      * {
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.2;
      }
      .print-container {
        padding-top: 20mm !important;
      }
    `,
  });


  useEffect(() => {
    if (allPrintProps && allPrintProps.length > 0) {
      setTimeout(() => {
        handleAllPrint();
      }, 100);
    }
  }, [allPrintProps]);
  return (
    <Modal size="4xl" isOpen={!!data} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>MarkSheet Preview</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxHeight="75vh" overflowY="auto">
          <Box ref={printAllRef}>
            {marksheetLayout === 1 && (
              <HalfPageMarkSheet
                w="100%"
                data={data?.studentData}
                setAllPrintProps={setAllPrintProps}
                themeColor={themeColor}
              />
            )}
            {marksheetLayout === 2 && (
              <HalfPageMarkSheet2
                w="100%"
                data={data?.studentData}
                setAllPrintProps={setAllPrintProps}
                themeColor={themeColor}
              />
            )}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            variant="outline"
            mr={3}
            colorScheme="red"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            px={4}
            size="sm"
            colorScheme={themeColor}
            onClick={handlePrintAllClick}
          >
            Print
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

