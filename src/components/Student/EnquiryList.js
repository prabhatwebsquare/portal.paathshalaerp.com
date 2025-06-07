import { PageHeader } from "@/common/PageHeader";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AddNewEnquiry } from "./AddNewEnquiry";
import { ConfirmAlert } from "@/common/ConfirmationAlert";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineMessage } from "react-icons/md";
import { AddFollowup } from "./AddFollowup";
import { RiFileExcel2Fill, RiShareForwardFill } from "react-icons/ri";
import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useStudentStore } from "@/store/studentStore";
import { map } from "lodash";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { NoData } from "@/common/NoData";
import { LoadingContainer } from "@/common/LoadingContainer";
import { CustomSelect } from "@/common/CustomSelect";
import { DownloadExcel } from "@/common/DownloadExcel";
import { GrUpdate } from "react-icons/gr";
import { EnquiryStatusUpdate } from "./UpdateEnquiryStatus";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const EnquiryList = ({ themeColor, sessionMasterId }) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState({
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });
  const [excelData, setExcelData] = useState(null);
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [toggleAddFollowup, setToggleAddFollowup] = useState(null);
  const [toggleConfirm, setToggleConfirm] = useState(null);
  const [toggleModal, setToggleModal] = useState(null);

  const {
    getEnquiryAction,
    getEnquiryStatus,
    allEnquiry,
    resetGetEnquiry,
    deleteEnquiryAction,
    deleteEnquiryStatus,
    resetAddEnquiry,
  } = useStudentStore((s) => ({
    getEnquiryAction: s.getEnquiryAction,
    getEnquiryStatus: s.getEnquiryStatus,
    allEnquiry: s.allEnquiry,
    resetGetEnquiry: s.resetGetEnquiry,
    deleteEnquiryAction: s.deleteEnquiryAction,
    deleteEnquiryStatus: s.deleteEnquiryStatus,
    resetAddEnquiry: s.resetAddEnquiry,
  }));

  useEffect(() => {
    if ((getEnquiryStatus || 1) === STATUS.NOT_STARTED) {
      getEnquiryAction({
        type: "all",
        userId: "all",
        sessionMasterId,
        startDate: dayjs().format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD"),
      });
    }
  }, [getEnquiryAction, getEnquiryStatus, sessionMasterId]);

  const getFilterEnquiry = () => {
    getEnquiryAction({
      type: "all",
      userId: "all",
      sessionMasterId,
      ...inputValue,
    });
  };

  useEffect(() => {
    if (allEnquiry) {
      const data = allEnquiry.map((enq) => {
        return {
          Name: enq.name,
          "Father Name": enq.fatherName,
          "Father Contact": enq.fatherContact,
          Class: enq.class_master?.name,
          Stream: enq.stream_master?.name,
          "Enquiry Date": dayjs(enq.date).format("DD-MM-YYYY"),
          Status: enq.status,
          "Prospectus/FormFees": enq.brocherAmount,
          Remark: enq.remark,
        };
      });
      setExcelData(data);
    }
  }, [allEnquiry]);

  useEffect(() => {
    return () => resetGetEnquiry();
  }, [resetGetEnquiry]);

  const deleteEnquiry = (id) => {
    deleteEnquiryAction(id);
  };

  useEffect(() => {
    if (deleteEnquiryStatus === STATUS.SUCCESS) {
      resetAddEnquiry();
      setToggleConfirm(null);
    }
  }, [deleteEnquiryStatus, resetAddEnquiry]);

  return (
    <Box h="100%">
      <PageHeader heading={"Enquiry List"} />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <Flex mt={3} justify={"space-between"} align={"center"}>
            <Flex gap={3}>
              <CustomInput
                size={"sm"}
                type={"date"}
                name="startDate"
                label={"Start Date"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                size={"sm"}
                type={"date"}
                name="endDate"
                label={"End Date"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomSelect
                size={"sm"}
                name={"status"}
                label={"Select Status"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[
                  { name: "Pending", value: "Pending" },
                  { name: "Converted", value: "Converted" },
                  { name: "Rejected", value: "Rejected" },
                ]}
              />
              <CustomSelect
                size={"sm"}
                name={"brocherAmount"}
                label={"Select Prospectors sell"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[
                  { name: "All Enquiry", value: "all" },
                  { name: "Prospectors Sell Enquiry", value: "yes" },
                  { name: "None Prospectors Sell Enquiry", value: "no" },
                ]}
              />
              <Button
                size={"sm"}
                colorScheme={themeColor}
                onClick={getFilterEnquiry}
              >
                Get
              </Button>
            </Flex>
            {allEnquiry?.length ? (
              <Tooltip label="Download Excel" placement="top">
                <DownloadExcel
                  button={<RiFileExcel2Fill />}
                  data={excelData}
                  name={"Enquiry List"}
                />
              </Tooltip>
            ) : null}
            {/* <Pagination totalItems={50} currPage={currentPage} setCurrentPage={setCurrentPage} limit={limit} setLimit={setLimit} /> */}
          </Flex>
          <LoadingContainer status={getEnquiryStatus}>
            {allEnquiry?.length ? (
              <TableContainer mt={2}>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>S. No.</Th>
                      <Th>Name</Th>
                      <Th>Father Name</Th>
                      <Th>Father Contact</Th>
                      <Th>Class</Th>
                      <Th>Stream</Th>
                      <Th>Enquiry Date</Th>
                      <Th>Status</Th>
                      <Th>Prospectus/FormFees</Th>
                      <Th>Remark</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(allEnquiry, (enq, i) => (
                      <Tr
                        key={enq.id}
                        _hover={{ bg: "gray.50" }}
                        cursor={"pointer"}
                      >
                        <Td>{i + 1}</Td>
                        <Td>{enq.name}</Td>
                        <Td>{enq.fatherName}</Td>
                        <Td>{enq.fatherContact}</Td>
                        <Td>{enq.class_master?.name}</Td>
                        <Td>{enq.stream_master?.name}</Td>
                        <Td>{dayjs(enq.date).format("DD-MM-YYYY")}</Td>
                        <Td>
                          {enq.status === "Pending" ? (
                            <Badge
                              variant="solid"
                              fontSize={11}
                              fontWeight={"normal"}
                              colorScheme={"yellow"}
                            >
                              Pending
                            </Badge>
                          ) : enq.status === "Converted" ? (
                            <Badge
                              variant="solid"
                              fontSize={11}
                              fontWeight={"normal"}
                              colorScheme={"green"}
                            >
                              Converted
                            </Badge>
                          ) : (
                            <Badge
                              variant="solid"
                              fontSize={11}
                              fontWeight={"normal"}
                              colorScheme={"red"}
                            >
                              {enq.status}
                            </Badge>
                          )}
                          {/* {enq.status === "Pending"
                            ? HasPermission(PERMISSIONS.ENQUIRY_EDIT) && (
                                <IconButton
                                  ml={1}
                                  size={"xs"}
                                  variant={"ghost"}
                                  colorScheme={themeColor}
                                  onClick={() => setToggleModal(enq)}
                                  icon={<GrUpdate />}
                                />
                              )
                            : null} */}
                        </Td>
                        <Td>{enq.brocherAmount}</Td>
                        <Td>{enq.remark}</Td>
                        <Td>
                          <Menu placement={"end-start"}>
                            <MenuButton>
                              <BsThreeDotsVertical />
                            </MenuButton>
                            <MenuList minWidth="auto">
                              {enq.status === "Converted" ? (
                                <MenuItem disabled color="gray.400">
                                  Actions Disabled
                                </MenuItem>
                              ) : (
                                <>
                                  {HasPermission(PERMISSIONS.ENQUIRY_EDIT) && (
                                    <Tooltip placement="top" label="Edit">
                                      <MenuItem
                                        icon={<EditIcon />}
                                        color={"blue.500"}
                                        onClick={() => setToggleDrawer(enq)}
                                      >
                                        Edit
                                      </MenuItem>
                                    </Tooltip>
                                  )}
                                  {HasPermission(
                                    PERMISSIONS.ENQUIRY_DELETE
                                  ) && (
                                    <Tooltip placement="top" label="Delete">
                                      <MenuItem
                                        icon={<DeleteIcon />}
                                        color={"red"}
                                        onClick={() => setToggleConfirm(enq.id)}
                                      >
                                        Delete
                                      </MenuItem>
                                    </Tooltip>
                                  )}
                                  <Tooltip placement="top" label="Add FollowUp">
                                    <MenuItem
                                      icon={<MdOutlineMessage />}
                                      color={"teal"}
                                      onClick={() => setToggleAddFollowup(enq)}
                                    >
                                      Add FollowUp
                                    </MenuItem>
                                  </Tooltip>
                                  {HasPermission(
                                    PERMISSIONS.STUDENT_ADMISSION
                                  ) && (
                                    <Tooltip placement="top" label="Convert">
                                      <MenuItem
                                        icon={<RiShareForwardFill />}
                                        color={"green"}
                                        onClick={() =>
                                          router.push(
                                            `/student/student-admission/admission-form?enquiry=${enq.id}`
                                          )
                                        }
                                      >
                                        Convert
                                      </MenuItem>
                                    </Tooltip>
                                  )}
                                </>
                              )}
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Enquiry Found"} />
            )}
          </LoadingContainer>
        </Box>
        {toggleDrawer && (
          <AddNewEnquiry
            data={toggleDrawer}
            themeColor={themeColor}
            sessionMasterId={sessionMasterId}
            closeDrawer={() => setToggleDrawer(null)}
          />
        )}
        {toggleModal && (
          <EnquiryStatusUpdate
            data={toggleModal}
            themeColor={themeColor}
            sessionMasterId={sessionMasterId}
            closeModal={() => setToggleModal(null)}
          />
        )}
        {toggleAddFollowup && (
          <AddFollowup
            data={toggleAddFollowup}
            themeColor={themeColor}
            closeDrawer={() => setToggleAddFollowup(null)}
          />
        )}
        {toggleConfirm && (
          <ConfirmAlert
            description={"Are you sure? Do you want to delete?"}
            confirm={() => deleteEnquiry(toggleConfirm)}
            closeAlert={() => setToggleConfirm(null)}
            loading={deleteEnquiryStatus === STATUS.FETCHING}
          />
        )}
      </Box>
    </Box>
  );
};
