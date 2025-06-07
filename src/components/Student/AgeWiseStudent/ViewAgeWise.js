import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { RestrictStudentModal } from "@/common/RestrictStudentModal";
import { useStudentStore } from "@/store/studentStore";
import {
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  HStack,
  MenuItem,
  MenuList,
  MenuButton,
  Menu,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { map } from "lodash";
import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCertificate } from "react-icons/fa";
import * as XLSX from "xlsx";
import { useReactToPrint } from "react-to-print";
import { CharacterCertificate } from "../StudentTC/CharacterCertificate";
import { TransferCertificate } from "../StudentTC/TransferCertificate";
import TCFormatChoose from "@/components/fees/tcformatchoose";

export const ViewAgeWise = ({
  pageName,
  data,
  closeDrawer,
  sessionMasterId,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [printProps, setPrintProps] = useState(null);
  const [printTcProps, setPrintTcProps] = useState(null);
  const printRef = useRef();
  const printTcRef = useRef();

  const { restoreStudentAction } = useStudentStore((s) => ({
    restoreStudentAction: s.restoreStudentAction,
  }));

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => setPrintProps(null),
    onPrintError: () => setPrintProps(null),
    documentTitle: "Character Certificate",
  });

  const handleTcPrint = useReactToPrint({
    content: () => printTcRef.current,
    onAfterPrint: () => setPrintTcProps(null),
    onPrintError: () => setPrintTcProps(null),
    documentTitle: "Transfer Certificate",
  });

  useEffect(() => {
    if (printProps) {
      handlePrint();
    }
  }, [printProps, handlePrint]);

  useEffect(() => {
    if (printTcProps) {
      handleTcPrint();
    }
  }, [printTcProps, handleTcPrint]);

  const handleRestriction = (data) => {
    restoreStudentAction({
      type: "active",
      status: 0,
      promotionId: selectedStudentId,
      sessionMasterId,
      remark: data.remark,
      date: data.date,
    });
    setShowModal(false);
    closeDrawer();
  };

  const handlePrintTcClick = (student) => {
    setSelectedStudent(student);
    setPrintTcProps(student);
  };

  const handlePrintClick = (student) => {
    setSelectedStudent(student);
    setPrintProps(student);
  };

  const exportToExcel = () => {
    const studentsData = data.Students.map((student, index) => ({
      "Sr No.": index + 1,
      "Admission No.": student.admissionNo || "N/A",
      Name: student.studentName,
      "Father Name": student.fatherName,
      Contact: student.fatherContact,
      ...(pageName === "ageWise" ? { Age: student.age } : {}),
    }));

    const ws = XLSX.utils.json_to_sheet(studentsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");

    const filename = `${data.class}_${data.stream}_${data.section}_students.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  return (
    <Drawer size={"xl"} isOpen={data} onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <Flex justify="space-between" align="center" mr={5}>
            <span>
              {data.class} - {data.stream} - {data.section}
            </span>
            <Button
              size="sm"
              colorScheme="green"
              mr={5}
              onClick={exportToExcel}
            >
              Export to Excel
            </Button>
          </Flex>
        </DrawerHeader>
        <DrawerBody>
          <LoadingContainer status={data ? "SUCCESS" : "LOADING"}>
            {data?.Students.length ? (
              <TableContainer>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>Sr No.</Th>
                      <Th>Admission No.</Th>
                      <Th>Name</Th>
                      <Th>Father Name</Th>
                      <Th>Contact</Th>
                      {pageName == "ageWise" && <Th>Age</Th>}
                      {pageName == "Rustication" && <Th>Action</Th>}
                      {pageName == "tc" && <Th>Certificate</Th>}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(data.Students, (student, index) => (
                      <Tr
                        key={student.id}
                        _hover={{ bg: "gray.50" }}
                        cursor={"pointer"}
                      >
                        <Td>{index + 1}</Td>
                        <Td>{student?.admissionNo || "N/A"}</Td>
                        <Td>
                          <Flex align={"center"}>{student.studentName}</Flex>
                        </Td>
                        <Td>{student.fatherName}</Td>
                        <Td>{student.fatherContact}</Td>
                        {pageName == "ageWise" && <Td>{student.age}</Td>}
                        {pageName == "Rustication" && (
                          <Td>
                            <Button
                              size="xs"
                              colorScheme={"green"}
                              onClick={() => {
                                setShowModal(true);
                                setSelectedStudentId(student.id);
                              }}
                            >
                              Remove Restriction
                            </Button>
                          </Td>
                        )}
                        {pageName == "tc" && (
                          <Td>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<BsThreeDotsVertical />}
                                variant="ghost"
                                size="sm"
                              />
                              <MenuList minWidth="auto">
                                <MenuItem
                                  icon={<FaCertificate />}
                                  onClick={() => handlePrintTcClick(student)}
                                >
                                  TC Certificate
                                </MenuItem>
                                <MenuItem
                                  icon={<FaCertificate />}
                                  onClick={() => handlePrintClick(student)}
                                >
                                  Character Certificate
                                </MenuItem>
                                {/* <MenuItem 
                                  icon={<FaCertificate />}
                                  onClick={() => handlePrintBonafideClick(student)}
                                >
                                  Bonafide Certificate
                                </MenuItem>
                                <MenuItem 
                                  icon={<FaCertificate />}
                                  onClick={() => handlePrintStudyClick(student)}
                                >
                                  Study Certificate
                                </MenuItem> */}
                              </MenuList>
                            </Menu>
                          </Td>
                        )}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Student Found"} />
            )}
          </LoadingContainer>
          {showModal && (
            <RestrictStudentModal
              heading="Restore Student"
              description="Please provide the Restore details below."
              closeAlert={() => setShowModal(false)}
              confirm={(data) => handleRestriction(data)}
              loading={false}
              button="Restore"
            />
          )}
          {printTcProps && (
            <TCFormatChoose
              data={selectedStudent}
              setPrintProps={setPrintTcProps}
            />
          )}
        </DrawerBody>
      </DrawerContent>

      <Box display={printProps ? "block" : "none"}>
        <style>
          {`
 @media print {
  @page {
    size: A4 portrait;
    margin: 10mm;
  }

}
    `}
        </style>
        <Box ref={printRef}>
          <CharacterCertificate
            school={printProps}
            setPrintProps={setPrintProps}
          />
        </Box>
      </Box>
    </Drawer>
  );
};
