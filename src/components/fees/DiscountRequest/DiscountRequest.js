import { ConfirmAlert } from "@/common/ConfirmationAlert";
import { CustomSelect } from "@/common/CustomSelect";
import { HasPermission } from "@/common/HasPermission";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { useClassSetupStore } from "@/store/classSetup";
import { useStdFeesStore } from "@/store/stdFees";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import {
  ArrowBackIcon,
  CheckIcon,
  CloseIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import {
  Badge,
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
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { groupBy, map, uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";

export const DiscountRequest = ({ themeColor, sessionMasterId, filter }) => {
  const [inputValue, setInputValue] = useState({ status: filter });
  const [toggleConfirm, setToggleConfirm] = useState(null);
  const [toggleReject, setToggleReject] = useState(null);

  useEffect(() => {
    if (filter) {
      setInputValue({
        ...inputValue,
        status: filter === "all" ? filter : parseInt(filter),
      });
    }
  }, [filter]);

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  const {
    getAssignDiscountAction,
    getAssignDiscountStatus,
    assignedDiscount,
    resetDiscountData,
    updateAssignDiscountAction,
    updateAssignDiscountStatus,
    resetDiscount,
    deleteAssignDiscountAction,
    deleteAssignDiscountStatus,
  } = useStdFeesStore((s) => ({
    getAssignDiscountAction: s.getAssignDiscountAction,
    getAssignDiscountStatus: s.getAssignDiscountStatus,
    assignedDiscount: s.assignedDiscount,
    resetDiscountData: s.resetDiscountData,
    updateAssignDiscountAction: s.updateAssignDiscountAction,
    updateAssignDiscountStatus: s.updateAssignDiscountStatus,
    resetDiscount: s.resetDiscount,
    deleteAssignDiscountAction: s.deleteAssignDiscountAction,
    deleteAssignDiscountStatus: s.deleteAssignDiscountStatus,
  }));

  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
  }, [
    getAssignDiscountAction,
    getAssignDiscountStatus,
    getClassSubjectAction,
    getClassSubjectStatus,
    inputValue?.status,
    sessionMasterId,
  ]);

  useEffect(() => {
    getAssignDiscountAction({
      sessionMasterId,
      status: inputValue?.status,
    });
  }, [
    getAssignDiscountAction,
    inputValue?.status,
    resetDiscountData,
    sessionMasterId,
  ]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const getReport = (e) => {
    e.preventDefault();
    getAssignDiscountAction({
      ...inputValue,
      status: inputValue.status || "all",
      sessionMasterId,
    });
  };

  const reject = (d) => {
    updateAssignDiscountAction({
      id: d.id,
      status: 2,
    });
  };

  const confirm = (d) => {
    updateAssignDiscountAction({
      id: d.id,
      status: 1,
    });
  };

  useEffect(() => {
    if (updateAssignDiscountStatus === STATUS.SUCCESS) {
      resetDiscount();
      setToggleConfirm(null);
      setToggleReject(null);
    }
  }, [resetDiscount, updateAssignDiscountStatus]);
  const handleDeleteDiscount = (data) => {
    deleteAssignDiscountAction(data.id);
  };
  return (
    <Box h="100%" mt={5}>
      {/* <PageHeader heading={"Discount Request"} /> */}
      <Box h={"50%"}>
        <Box className="scrollBar" maxH={"90%"} overflowY={"scroll"}>
          <form onSubmit={getReport}>
            <Flex pb={3} gap={4} w={"40%"}>
              <CustomSelect
                size={"sm"}
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
                size={"sm"}
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
                    value: d.stream_master.id,
                    name: d.stream_master.name,
                  })
                )}
              />
              {/* <Select
                                size={"sm"}
                                fontSize={13}
                                fontWeight={"semibold"}
                                focusBorderColor={`${themeColor}.400`}
                                placeholder="All"
                                value={inputValue?.status}
                                onChange={(e) => inputHandler("status", e.target.value)}
                            >
                                <option value={1}>Approved</option>
                                <option value={2}>Rejected</option>
                            </Select> */}
              <Button type="submit" size={"sm"} colorScheme={themeColor}>
                Get
              </Button>
            </Flex>
          </form>
          <LoadingContainer status={getAssignDiscountStatus}>
            {assignedDiscount?.length ? (
              <TableContainer>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>Sr No.</Th>
                      <Th>Name</Th>
                      <Th>Father Name</Th>
                      <Th>Contact</Th>
                      <Th>Class</Th>
                      <Th>Stream</Th>
                      <Th>Discount</Th>
                      <Th>Remark</Th>
                      <Th>Requested Date</Th>
                      <Th>Approved Date </Th>
                      <Th>Approved By </Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(assignedDiscount, (disc) => (
                      <Tr _hover={{ bg: "gray.50" }}>
                        <Td>{disc.student_master?.srNo}</Td>
                        <Td>{disc.student_master?.studentName}</Td>
                        <Td>{disc.student_master?.fatherName}</Td>
                        <Td>{disc.student_master?.fatherContact}</Td>
                        <Td>{disc.class_master?.name}</Td>
                        <Td>{disc.stream_master?.name}</Td>
                        <Td>
                          <Flex align={"center"} justify={"flex-end"}>
                            <MdCurrencyRupee />
                            {disc.discount}
                          </Flex>
                        </Td>
                        <Td whiteSpace="pre-wrap">{disc.remarks}</Td>

                        <Td>
                          {" "}
                          {dayjs(disc.createdAt).format("MMMM DD, hh:mm A")}
                        </Td>
                        <Td>
                          {" "}
                          {disc.status !== 0
                            ? dayjs(disc.updatedAt).format("MMMM DD, hh:mm A")
                            : "-"}
                        </Td>
                        <Td whiteSpace="pre-wrap">
                          {disc.status !== 0 ? disc?.approveBy?.name : "-"}
                        </Td>
                        <Td>
                          {disc.status === 0 &&
                          HasPermission(PERMISSIONS.DISCOUNT_REQUEST_EDIT) ? (
                            <>
                              <Tooltip placement="top" label="Reject">
                                <IconButton
                                  size="xs"
                                  variant="ghost"
                                  icon={<CloseIcon />}
                                  colorScheme="red"
                                  onClick={() => setToggleReject(disc)}
                                />
                              </Tooltip>
                              <Tooltip placement="top" label="Approve">
                                <IconButton
                                  ml={3}
                                  size="xs"
                                  variant="ghost"
                                  icon={<CheckIcon />}
                                  colorScheme="green"
                                  onClick={() => setToggleConfirm(disc)}
                                />
                              </Tooltip>
                            </>
                          ) : (
                            <>
                              <Badge
                                variant="outline"
                                colorScheme={
                                  disc.status === 1 ? "green" : "red"
                                }
                              >
                                {disc.status === 1 ? "Approved" : "Rejected"}
                              </Badge>

                              {disc.status === 1 &&
                                // HasPermission(
                                //   PERMISSIONS.DISCOUNT_REQUEST_DELETE
                                // ) && (
                                  <Tooltip
                                    placement="top"
                                    label="Delete Discount"
                                  >
                                    <IconButton
                                      ml={3}
                                      size="xs"
                                      variant="ghost"
                                      icon={<DeleteIcon />}
                                      colorScheme="red"
                                      onClick={() => handleDeleteDiscount(disc)}
                                    />
                                  </Tooltip>
                                // )
                                }
                            </>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Discount Request Found"} />
            )}
          </LoadingContainer>
          {toggleReject && (
            <ConfirmAlert
              heading={"Reject Confirmation"}
              description={"Are you sure? Do you want to reject discount"}
              closeAlert={() => setToggleReject(null)}
              button={"Reject"}
              color={"red"}
              confirm={() => reject(toggleReject)}
              // status={status}
            />
          )}
          {toggleConfirm && (
            <ConfirmAlert
              heading={"Approve Confirmation"}
              description={"Are you sure? Do you want to approve discount"}
              closeAlert={() => setToggleConfirm(null)}
              button={"Approve"}
              color={"green"}
              confirm={() => confirm(toggleConfirm)}
              // status={status}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
