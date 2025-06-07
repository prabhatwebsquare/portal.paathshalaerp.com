import { ConfirmAlert } from "@/common/ConfirmationAlert";
import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { useStudentStore } from "@/store/studentStore";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { map } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { BulkStudentUpload } from "./BulkAdmission/BulkStudentUpload";
import { LoadingContainer } from "@/common/LoadingContainer";
import { URL } from "@/services/apis";
import { AdmissionFormEdit } from "./StudentProfile/AdmissionFormEdit";
import Pagination from "@/common/Pagination";
import CustomInput from "@/common/CustomInput";
import { GrPowerReset } from "react-icons/gr";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { FaCertificate, FaRupeeSign } from "react-icons/fa";
import { StudentFeesEdit } from "./StudentProfile/StudentFeesEdit";
import { RestrictStudentModal } from "@/common/RestrictStudentModal";
import { MdLocalPrintshop } from "react-icons/md";
import AdmissionForm from "./AdmissionForm";
import { DownloadExcel } from "@/common/DownloadExcel";
import { RiFileExcel2Fill } from "react-icons/ri";
import StudyCertificate from "./StudyCertificate";
import BonafideCertificate from "./BonafideCertificate";
import BirthdayCertificate from "./BirthdayCertificate";

export const StudentList = ({ themeColor, sessionMasterId }) => {
  const router = useRouter();
  const [toggleConfirm, setToggleConfirm] = useState(null);
  const [toggleDownload, setToggleDownload] = useState(null);
  const [toggleEdit, setToggleEdit] = useState(null);
  const [toggleFeesEdit, setToggleFeesEdit] = useState(null);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState({ search: "" });
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [studyCertificate, setstudyCertificate] = useState(null);
  const [bonafiedcertificate, setBonafiedcertificate] = useState(null)
  const [birthdayCertificate, setBirthdayCertificate] = useState(null)
  const {
    getAllStudentAction,
    getAllStudentStatus,
    allStudents,
    resetStudent,
    deleteStudentAction,
    deleteStudentStatus,
    resetDeleteStudent,
    restrictStudentAction,
  } = useStudentStore((s) => ({
    getAllStudentAction: s.getAllStudentAction,
    getAllStudentStatus: s.getAllStudentStatus,
    allStudents: s.allStudents,
    resetStudent: s.resetStudent,
    restrictStudentAction: s.restrictStudentAction,
    deleteStudentAction: s.deleteStudentAction,
    deleteStudentStatus: s.deleteStudentStatus,
    resetDeleteStudent: s.resetDeleteStudent,
  }));

  useEffect(() => {
    if ((getAllStudentStatus || 1) === STATUS.NOT_STARTED) {
      getAllStudentAction({ page: 1, limit: 10, sessionMasterId });
    }
  }, [getAllStudentAction, getAllStudentStatus, sessionMasterId]);

  useEffect(() => {
    if (currentPage && limit)
      getAllStudentAction({
        page: currentPage,
        limit: parseInt(limit),
        sessionMasterId,
        ...inputValue,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, getAllStudentAction, limit, sessionMasterId]);

  const searchStudent = () => {
    setCurrentPage(1);
    getAllStudentAction({ page: 1, limit: 10, sessionMasterId, ...inputValue });
  };

  const reset = () => {
    setCurrentPage(1);
    setInputValue({ search: "" });
    getAllStudentAction({ page: 1, limit: 10, sessionMasterId, search: "" });
  };

  const confirmDelete = (id) => {
    deleteStudentAction(id);
  };

  useEffect(() => {
    if (deleteStudentStatus === STATUS.SUCCESS) {
      setToggleConfirm(null);
      resetDeleteStudent();
    }
  }, [deleteStudentStatus, resetDeleteStudent]);

  useEffect(() => {
    return () => resetStudent();
  }, [resetStudent]);

  const [showModal, setShowModal] = useState(false);
  const handleRestriction = (data) => {
    restrictStudentAction({
      type: "restigate",
      status: 2,
      promotionId: selectedStudentId,
      sessionMasterId,
      remark: data.remark,
      date: data.date,
    });
    setShowModal(false);
  };
  const [excelData, setExcelData] = useState([]);
  useEffect(() => {
    if (allStudents?.data?.length > 0) {
      const extractedData = allStudents.data.map((student) => ({
        srNo: student?.srNo || "",
        admissionNo: student?.student_master?.admissionNo || "",
        studentName: student?.student_master?.studentName || "",
        fatherName: student?.student_master?.fatherName || "",
        admissionDate:
          student?.student_master?.admissionDate?.slice(0, 10) || "", // only date part
        studentContact: student?.student_master?.fatherContact || "",
        studentEmail: student?.student_master?.email || "",
        dob: student?.student_master?.dob?.slice(0, 10) || "",
        gender: student?.student_master?.gender || "",
        category: student?.student_master?.category || "",
        religion: student?.student_master?.religion || "",
        contactNumber: student?.student_master?.studentContact || "",
        address: student?.student_master?.address || "",
        className: student?.class_master?.name || "",
        streamName: student?.stream_master?.name || "",
        sectionName: student?.section_master?.name || "",
      }));

      setExcelData(extractedData);
    }
  }, [allStudents?.data]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box h={"100%"}>
      <PageHeader
        heading={"Student's List"}
        extra={
          <Flex gap={2}>
            <IconButton
              size="sm"
              colorScheme={themeColor}
              onClick={() =>
                router.push("/student/student-admission/admission-form")
              }
              borderRadius="md"
              icon={<AddIcon />} // 👈 sirf icon dikhana
              aria-label="Student Admission" // accessibility ke liye zaruri hai
              boxShadow="md"
              _hover={{
                transform: "translateY(-1px)",
                boxShadow: "lg",
                bg: `${themeColor}.600`,
              }}
              _active={{
                transform: "translateY(0)",
                boxShadow: "md",
              }}
              transition="all 0.2s"
              px={4}
              py={2}
            />
            <DownloadExcel
              button={<RiFileExcel2Fill />}
              data={excelData}
              name={`Student's List`}
            />
          </Flex>
        }
      />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <Flex w={"100%"} justify={"space-between"} my={4} align={"center"}>
            <Flex w={"60%"}>
              <CustomInput
                autoFocus={true}
                size={"md"}
                type={"text"}
                name="search"
                label={"Search By Sr No/Admission No./Name/Father Contact"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <Button
                ml={2}
                size={"sm"}
                colorScheme={themeColor}
                isDisabled={inputValue?.search ? false : true}
                onClick={searchStudent}
              >
                Get
              </Button>
              <Button
                ml={2}
                size={"sm"}
                leftIcon={<GrPowerReset />}
                onClick={reset}
              >
                Reset
              </Button>
            </Flex>
            <Pagination
              totalItems={allStudents?.studentCount}
              limit={limit}
              setLimit={setLimit}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              themeColor={themeColor}
            />
          </Flex>
          <LoadingContainer status={getAllStudentStatus}>
            {allStudents?.data?.length ? (
              <LoadingContainer status={getAllStudentStatus}>
                {allStudents?.data?.length ? (
                  <Box
                    p={4}
                    bg="white"
                    borderRadius="lg"
                    boxShadow="md"
                    borderWidth="1px"
                    borderColor="gray.300"
                  >
                    <TableContainer mt={2}>
                      <Table
                        w="100%"
                        size="md"
                        variant="simple"
                        colorScheme="blue"
                      >
                        <Thead>
                          <Tr>
                            <Th textAlign="center">S. No.</Th>
                            <Th textAlign="center">Scholar No.</Th>
                            <Th textAlign="center">Admission No.</Th>
                            <Th textAlign="center">Name</Th>
                            <Th textAlign="center">Father Name</Th>
                            <Th textAlign="center">Contact</Th>
                            <Th textAlign="center">Class</Th>
                            <Th textAlign="center">Stream</Th>
                            <Th textAlign="center">Section</Th>
                            <Th textAlign="center">Action</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {map(allStudents?.data, (std, index) => {
                            const data = std?.student_master;
                            return (
                              <Tr
                                key={std.id}
                                _hover={{ bg: "gray.50" }}
                                cursor={"pointer"}
                              >
                                <Td textAlign="center">
                                  {allStudents?.studentCount -
                                    (currentPage - 1) * limit -
                                    index}
                                </Td>
                                <Td textAlign="center">{data.srNo}</Td>
                                <Td textAlign="center">{data.admissionNo}</Td>
                                <Td textAlign="center">
                                  <Flex align="center" justify="start">
                                    <Avatar
                                      mr={3}
                                      size={"xs"}
                                      src={`${URL}${data.photo}`}
                                    />
                                    {data.studentName}
                                  </Flex>
                                </Td>
                                <Td textAlign="center">{data.fatherName}</Td>
                                <Td textAlign="center">{data.fatherContact}</Td>
                                <Td textAlign="center">
                                  {std.class_master?.name}
                                </Td>
                                <Td textAlign="center">
                                  {std.stream_master?.name}
                                </Td>
                                <Td textAlign="center">
                                  {std.section_master?.name}
                                </Td>
                                <Td textAlign="center">
                                  <Menu>
                                    <MenuButton
                                      as={IconButton}
                                      icon={<BsThreeDotsVertical />}
                                      variant="ghost"
                                    />
                                    <MenuList minWidth="auto">
                                      <MenuItem
                                        icon={<CgProfile fontSize={14} />}
                                        color="green.400"
                                        onClick={() =>
                                          router.push(
                                            `/student/profile?id=${std.id}`
                                          )
                                        }
                                      >
                                        View Profile
                                      </MenuItem>
                                      {HasPermission(
                                        PERMISSIONS.STUDENT_LIST_EDIT
                                      ) && (
                                        <MenuItem
                                          icon={<EditIcon fontSize={14} />}
                                          color="blue.400"
                                          onClick={() => setToggleEdit(std)}
                                        >
                                          Edit
                                        </MenuItem>
                                      )}
                                      {HasPermission(
                                        PERMISSIONS.STUDENT_LIST_EDIT
                                      ) && (
                                        <MenuItem
                                          icon={<EditIcon fontSize={14} />}
                                          color="red"
                                          onClick={() => {
                                            setShowModal(true);
                                            setSelectedStudentId(std.id);
                                          }}
                                        >
                                          Restrict Student
                                        </MenuItem>
                                      )}
                                      {HasPermission(
                                        PERMISSIONS.STUDENT_LIST_EDIT
                                      ) && (
                                        <MenuItem
                                          icon={<FaRupeeSign fontSize={14} />}
                                          color="blue.400"
                                          onClick={() => setToggleFeesEdit(std)}
                                        >
                                          Fees Edit
                                        </MenuItem>
                                      )}
                                      {HasPermission(
                                        PERMISSIONS.STUDENT_LIST_DELETE
                                      ) && (
                                        <MenuItem
                                          icon={<DeleteIcon />}
                                          color="red"
                                          onClick={() =>
                                            setToggleConfirm(std.id)
                                          }
                                        >
                                          Delete
                                        </MenuItem>
                                      )}
                                      <MenuItem
                                        icon={
                                          <MdLocalPrintshop fontSize={14} />
                                        }
                                        color="blue.400"
                                        onClick={() => setToggleDownload(std)}
                                      >
                                        Download Filled Form
                                      </MenuItem>
                                      <MenuItem
                                        icon={<FaCertificate fontSize={14} />}
                                        color="blue.400"
                                        onClick={() => {
                                          setstudyCertificate(std);
                                          onOpen();
                                        }}
                                      >
                                        Study Certificate
                                      </MenuItem>
                                      <MenuItem
                                        icon={<FaCertificate fontSize={14} />}
                                        color="blue.400"
                                        onClick={() => {
                                          setBonafiedcertificate(std);
                                          onOpen();
                                        }}
                                      >
                                        Bonafied Certificate
                                      </MenuItem>
                                      <MenuItem
                                        icon={<FaCertificate fontSize={14} />}
                                        color="blue.400"
                                        onClick={() => {
                                          setBirthdayCertificate(std);
                                          onOpen();
                                        }}
                                      >
                                       Birth Certificate
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Box>
                ) : (
                  <NoData title={"No Student List Found"} />
                )}
              </LoadingContainer>
            ) : (
              <NoData title="No Student List Found" />
            )}
          </LoadingContainer>
        </Box>
        {/* {toggleBulk && <BulkStudentUpload themeColor={themeColor} sessionMasterId={sessionMasterId} data={toggleBulk} closeDrawer={() => setToggleBulk(null)} />} */}
        {toggleEdit && (
          <AdmissionFormEdit
            themeColor={themeColor}
            sessionMasterId={sessionMasterId}
            data={toggleEdit}
            closeDrawer={() => setToggleEdit(null)}
          />
        )}
        {toggleFeesEdit && (
          <StudentFeesEdit
            themeColor={themeColor}
            sessionMasterId={sessionMasterId}
            data={toggleFeesEdit}
            closeDrawer={() => setToggleFeesEdit(null)}
          />
        )}
        {toggleConfirm && (
          <ConfirmAlert
            confirm={() => confirmDelete(toggleConfirm)}
            closeAlert={() => setToggleConfirm(null)}
          />
        )}
        {showModal && (
          <RestrictStudentModal
            heading="Restrict Student"
            description="Please provide the restriction details below."
            closeAlert={() => setShowModal(false)}
            confirm={(data) => handleRestriction(data)} // handleRestriction is the function to process the restriction
            loading={false}
            button="Restrict"
          />
        )}
        {toggleDownload && (
          <AdmissionForm
            themeColor={themeColor}
            sessionMasterId={sessionMasterId}
            data={toggleDownload}
            closeDrawer={() => setToggleDownload(null)}
          />
        )}

        {studyCertificate && (
          <StudyCertificate
            studentData={studyCertificate}
            closeDrawer={() => setstudyCertificate(null)}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
          />
        )}
           {bonafiedcertificate && (
          <BonafideCertificate
            studentData={bonafiedcertificate}
            closeDrawer={() => setBonafiedcertificate(null)}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
          />
        )}
              {birthdayCertificate && (
          <BirthdayCertificate
            studentData={birthdayCertificate}
            closeDrawer={() => setBirthdayCertificate(null)}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
          />
        )}
      </Box>
    </Box>
  );
};
