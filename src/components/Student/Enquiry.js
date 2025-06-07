import CustomInput from "@/common/CustomInput";
import { PageHeader } from "@/common/PageHeader";
import { ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
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
import React, { useEffect, useState } from "react";
import { AddNewEnquiry } from "./AddNewEnquiry";
import { useStudentStore } from "@/store/studentStore";
import { LoadingContainer } from "@/common/LoadingContainer";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineMessage } from "react-icons/md";
import { RiShareForwardFill } from "react-icons/ri";
import { AddFollowup } from "./AddFollowup";
import { ConfirmAlert } from "@/common/ConfirmationAlert";
import { STATUS } from "@/constant";
import { map } from "lodash";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { GrUpdate } from "react-icons/gr";
import { EnquiryStatusUpdate } from "./UpdateEnquiryStatus";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { ErrorAlert } from "@/utils/Helper";

export const Enquiry = ({ themeColor, sessionMasterId }) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState({});
  const [filterBy, setFilterBy] = useState("Father Contact");
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

  const searchEnquiry = (e) => {
    e.preventDefault();
    if (inputValue?.contact.length != 10) {
      ErrorAlert("Please enter a valid 10-digit number.");
      return;
    }
    getEnquiryAction({
      type: "all",
      userId: "all",
      sessionMasterId,
      fatherContact: inputValue?.contact,
    });
  };

  const deleteEnquiry = (id) => {
    deleteEnquiryAction(id);
  };

  useEffect(() => {
    return () => resetGetEnquiry();
  }, [resetGetEnquiry]);

  useEffect(() => {
    if (deleteEnquiryStatus === STATUS.SUCCESS) {
      resetAddEnquiry();
      setToggleConfirm(null);
    }
  }, [deleteEnquiryStatus, resetAddEnquiry]);

  return (
    <Box>
      <PageHeader heading={"Enquiry"} />
      <Box p={5} bg={"white"}>
        <Flex justify={"space-between"}>
          <form onSubmit={searchEnquiry}>
            <Flex>
              <Menu>
                <MenuButton
                  mr={3}
                  borderRadius={3}
                  border={"1px solid"}
                  borderColor={"gray.200"}
                >
                  <Flex
                    mx={2}
                    h={"100%"}
                    fontSize={14}
                    fontWeight={"semibold"}
                    w="fit-content"
                    align={"center"}
                  >
                    <Text>{filterBy}</Text>
                    <ChevronDownIcon boxSize={5} />
                  </Flex>
                </MenuButton>
                <MenuList w="fit-content">
                  <MenuGroup fontSize={13} color={"gray.500"} title="Search By">
                    <MenuDivider />
                    <MenuOptionGroup
                      defaultValue="Father Contact"
                      type="radio"
                      onChange={(e) => setFilterBy(e)}
                    >
                      {/* <MenuItemOption fontSize={14} fontWeight={"semibold"} value='Student Contact'>Student Contact</MenuItemOption> */}
                      <MenuItemOption
                        fontSize={14}
                        fontWeight={"semibold"}
                        value="Father Contact"
                      >
                        Father Contact
                      </MenuItemOption>
                      {/* <MenuItemOption fontSize={14} fontWeight={"semibold"} value='Mother Contact'>Mother Contact</MenuItemOption> */}
                    </MenuOptionGroup>
                  </MenuGroup>
                </MenuList>
              </Menu>
              <Flex w="fit-content">
                <CustomInput
                  autoFocus={true}
                  size={"sm"}
                  type={"number"}
                  name={"contact"}
                  label={"Search Enquiry"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
              </Flex>
              <Button size={"sm"} ml={3} colorScheme={themeColor} type="submit">
                Search
              </Button>
            </Flex>
          </form>
          {allEnquiry?.length ? (
            <Button
              size={"sm"}
              colorScheme={themeColor}
              onClick={() => setToggleDrawer(inputValue || null)}
            >
              Create Enquiry
            </Button>
          ) : null}
        </Flex>
        {(getEnquiryStatus || 1) === STATUS.NOT_STARTED &&
        !allEnquiry?.length ? (
          <Box mt={10} align={"center"}>
            <Image
              w={"30%"}
              h={"200px"}
              src="/assets/login1.png"
              alt="No Student Found"
            />
            <Text mt={5} fontSize={"20"} fontWeight={"semibold"}>
              Search Enquiry By Contact
            </Text>
          </Box>
        ) : (
          <LoadingContainer status={getEnquiryStatus}>
            {allEnquiry?.length ? (
              <TableContainer mt={5}>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>S. No.</Th>
                      <Th>Name</Th>
                      <Th>Contact</Th>
                      <Th>Father Name</Th>
                      <Th>Father Contact</Th>
                      <Th>Class</Th>
                      <Th>Stream</Th>
                      <Th>Enquiry Date</Th>
                      <Th>Status</Th>
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
                        <Td>{enq.contact}</Td>
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
              <Box mt={10} align={"center"}>
                <Image
                  w={"30%"}
                  h={"200px"}
                  src="/assets/login1.png"
                  alt="No Student Found"
                />
                <Text mt={5} fontSize={"20"} fontWeight={"semibold"}>
                  No Student Found
                </Text>
                {HasPermission(PERMISSIONS.ENQUIRY_ADD) && (
                  <Button
                    mt={2}
                    size={"sm"}
                    colorScheme={themeColor}
                    onClick={() => setToggleDrawer(inputValue || null)}
                  >
                    Create Enquiry
                  </Button>
                )}
              </Box>
            )}
          </LoadingContainer>
        )}
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
  );
};
