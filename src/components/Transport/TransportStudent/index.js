import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  NotAllowedIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
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
import { find, findIndex, groupBy, intersectionBy, map, uniqBy } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { StudentRegistration } from "./StudentRegistration";
import { MdCurrencyRupee, MdOutlineSms, MdPrint } from "react-icons/md";
import { useClassSetupStore } from "@/store/classSetup";
import { STATUS } from "@/constant";
import { useTransportFeesStore } from "@/store/TransportFees";
import { useTransportStore } from "@/store/Transport";
import { LoadingContainer } from "@/common/LoadingContainer";
import { useReactToPrint } from "react-to-print";
import TransportPasses from "./Transportpass";
import { NoData } from "@/common/NoData";
import CustomInput from "@/common/CustomInput";
import { SendSms } from "@/common/SendSms";
import { CustomSelect } from "@/common/CustomSelect";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { BiStop, BiStopCircle } from "react-icons/bi";
import { IoMdStopwatch } from "react-icons/io";
import { TransportFees } from "../TransportFees";
import { useStdFeesStore } from "@/store/stdFees";
import { DownloadExcel } from "@/common/DownloadExcel";
import { RiFileExcel2Fill } from "react-icons/ri";

export const TransportStudent = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [showTrasportStopModel, setShowTrasportStopModel] = useState(null);
  const [toggleSendSms, setToggleSendSms] = useState(null);
  const [inputValue, setInputValue] = useState({});

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
    getVehicleAction,
    getVehicleStatus,
    allVehicles,
    getDriverAction,
    getDriverStatus,
    allDrivers,
    trsaportStopAction,
    trsaportStopStatus,
  } = useTransportStore((s) => ({
    getVehicleAction: s.getVehicleAction,
    getVehicleStatus: s.getVehicleStatus,
    allVehicles: s.allVehicles,
    getDriverAction: s.getDriverAction,
    getDriverStatus: s.getDriverStatus,
    allDrivers: s.allDrivers,
    trsaportStopAction: s.trsaportStopAction,
    trsaportStopStatus: s.trsaportStopStatus,
  }));

  const {
    getStdRegistrationAction,
    getStdRegistrationStatus,
    allStdRegistrations,
    addStdRegistrationStatus,
  } = useTransportFeesStore((s) => ({
    getStdRegistrationAction: s.getStdRegistrationAction,
    getStdRegistrationStatus: s.getStdRegistrationStatus,
    allStdRegistrations: s.allStdRegistrations,
    addStdRegistrationStatus: s.addStdRegistrationStatus,
  }));

  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
  }, [getClassSubjectAction, getClassSubjectStatus]);

  useEffect(() => {
    if ((getVehicleStatus || 1) === STATUS.NOT_STARTED) {
      getVehicleAction();
    }
    if ((getDriverStatus || 1) === STATUS.NOT_STARTED) {
      getDriverAction();
    }
  }, [getDriverAction, getDriverStatus, getVehicleAction, getVehicleStatus]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const getTransportStudent = (e) => {
    e.preventDefault();
    getStdRegistrationAction({ ...inputValue, sessionMasterId });
  };

  useEffect(() => {
    if (addStdRegistrationStatus === STATUS.SUCCESS) {
      getStdRegistrationAction({ ...inputValue, sessionMasterId });
    }

    return () => {};
  }, [addStdRegistrationStatus]);

  const [allPrintProps, setAllPrintProps] = useState(null);
  const printAllRef = useRef(null);

  const handlePrintAllClick = () => {
    const temp = intersectionBy(allStdRegistrations, selectedStudent, "id");
    setAllPrintProps(temp);
  };

  const handleAllPrint = useReactToPrint({
    content: () => printAllRef.current,
    onAfterPrint: () => setAllPrintProps(null),
    onPrintError: () => setAllPrintProps(null),
    pageStyle: `
      @page {
        size: 297mm 210mm; /* A4 size in landscape: Width x Height */
        margin: 10mm;
      }
      body {
        width: 297mm;
        height: 210mm;
      }
    `,
  });

  const closeAlert = () => {
    setShowTrasportStopModel(null);
  };
  useEffect(() => {
    if (allPrintProps?.length) {
      handleAllPrint();
    }
  }, [allPrintProps, handleAllPrint]);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const selectAllStd = () => {
    if (selectedStudent?.length === allStdRegistrations?.length) {
      setSelectedStudent([]);
    } else {
      setSelectedStudent(map(allStdRegistrations, (s) => ({ id: s.id })));
    }
  };

  const handleCheck = (id) => {
    if (findIndex(selectedStudent, (s) => s.id === id) !== -1) {
      setSelectedStudent(filter(selectedStudent, (s) => s.id !== id));
    } else {
      setSelectedStudent([...selectedStudent, { id }]);
    }
  };
  const handlePrintClick = (props) => {
    setAllPrintProps(props);
  };

  const { getStudentFeesAction } = useStdFeesStore((s) => ({
    getStudentFeesAction: s.getStudentFeesAction,
  }));

  const [TransportFeesDetails, setTransportFeesDetails] = useState([]);
  const handleDeleteFees = async () => {
    const payload = {
      promotionId: showTrasportStopModel
        ? showTrasportStopModel[0]?.promotionId
        : 0,
      sessionMasterId,
      studentFeesId: TransportFeesDetails,
    };
    await trsaportStopAction(payload);
    setTransportFeesDetails([]);
    closeAlert();
  };
  const [excelData, setExcelData] = useState(null);
  useEffect(() => {
    if (allStdRegistrations?.length) {
      const data = allStdRegistrations?.map((item, index) => {
        const student = item?.promotion?.student_master || {};
        const className = item?.promotion?.class_master?.name || '';
        const streamName = item?.promotion?.stream_master?.name || '';
        const stationName = item?.station_master?.name || '';
        const routeName = item?.transport_route?.name || '';
        const vehicle = item?.vehicle || {};
        const vehicleNo = vehicle.vehicle || '';
        const vehicleType = vehicle.type || '';
        const shift = item?.transport_route?.shift || {};
        const shiftName = shift?.name || '';
        const startTime = shift?.startTime || '';
        const endTime = shift?.endTime || '';
        const transportFees = item?.promotion?.transportFees || 0;
  
        return {
          "Sr. No.": student.srNo || '',
          "Admission No.": student.admissionNo || '',
          "Student Name": student.studentName || '',
          "Father's Name": student.fatherName || '',
          "Contact No.": student.fatherContact || '',
          Class: className,
          Stream: streamName,
          Route: routeName,
          Station: stationName,
          "Vehicle No.": vehicleNo,
          "Vehicle Type": vehicleType,
          "Shift Name": shiftName,
          "Shift Time": `${startTime} - ${endTime}`,
          "Transport Fees": transportFees,
        };
      });
  
      setExcelData(data);
    }
  }, [allStdRegistrations]);
  
  
  return (
    <Box>
      <PageHeader
        heading={"Transport Student"}
        extra={
          <Flex>
            {HasPermission(PERMISSIONS.TRANSPORT_STUDENT_ADD) && (
              <Button
              mr={2}
                size={"sm"}
                colorScheme={themeColor}
                leftIcon={<AddIcon />}
                onClick={() => setToggleDrawer([])}
              >
                New Registration
              </Button>
            )}
            <Tooltip label="Download Excel" placement="top">
              <DownloadExcel
                button={<RiFileExcel2Fill />}
                data={excelData}
                name={"Transport Student"}
                isDisabled={allStdRegistrations?.length ? false : true}
              />
            </Tooltip>
          </Flex>
        }
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box
          w={"100%"}
          className="scrollBar"
          maxH={"100%"}
          overflowY={"scroll"}
        >
          <Flex pt={3} justify={"space-between"}>
            <form style={{ width: "60%" }} onSubmit={getTransportStudent}>
              <Flex pb={3} gap={4}>
                <CustomSelect
                  size={"sm"}
                  name={"classMasterId"}
                  label={"Select Class"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={[
                    { value: "all", name: "Select All" },
                    ...map(classes, (d, key) => ({
                      value: key,
                      name: d?.[0]?.class_master?.name,
                    })),
                  ]}
                />
                <CustomSelect
                  size={"sm"}
                  name={"streamMasterId"}
                  label={"Select Stream"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={[
                    { value: "all", name: "Select All" },
                    ...map(
                      uniqBy(
                        classes?.[inputValue?.classMasterId],
                        "streamMasterId"
                      ),
                      (d, index) => ({
                        value: d.stream_master.id,
                        name: d.stream_master.name,
                      })
                    ),
                  ]}
                />
                <CustomSelect
                  size={"sm"}
                  name={"vehicleId"}
                  label={"Select Vehicle"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={[
                    { value: "all", name: "Select All" },
                    ...map(allVehicles, (vehicle) => ({
                      value: vehicle.id,
                      name: vehicle.vehicle,
                    })),
                  ]}
                />
                <Button
                  type="submit"
                  size={"sm"}
                  px={10}
                  colorScheme={themeColor}
                >
                  Get
                </Button>
                <Button
                  px={10}
                  size={"sm"}
                  colorScheme={themeColor}
                  isDisabled={selectedStudent?.length ? false : true}
                  onClick={handlePrintAllClick}
                >
                  Print
                </Button>
              </Flex>
            </form>
          </Flex>
          <LoadingContainer status={getStdRegistrationStatus}>
            {allStdRegistrations?.length ? (
              <TableContainer mt={2}>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>
                        <Checkbox
                          colorScheme={themeColor}
                          isChecked={
                            selectedStudent?.length ===
                            allStdRegistrations?.length
                              ? true
                              : false
                          }
                          onChange={selectAllStd}
                        />
                      </Th>
                      <Th>Sr. No.</Th>
                      <Th>Student Name</Th>
                      <Th>Father&apos; Name</Th>
                      <Th>Class</Th>
                      <Th>Stream</Th>
                      <Th>Route</Th>
                      <Th>Vehicle No</Th>
                      <Th>Station</Th>
                      <Th>Transport Fees</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {allStdRegistrations?.length ? (
                      map(allStdRegistrations, (std, index) => {
                        const student = std?.promotion?.student_master;
                        const classData = std?.promotion.class_master;
                        const stream = std?.promotion.stream_master;
                        const driver = find(
                          allDrivers,
                          (d) => d.id === std?.vehicle?.driverId
                        );
                        const isChecked =
                          findIndex(selectedStudent, (s) => s.id === std.id) !==
                          -1
                            ? true
                            : false;
                        return std ? (
                          <Tr>
                            <Td>
                              <Checkbox
                                colorScheme={themeColor}
                                isChecked={isChecked}
                                onChange={() => handleCheck(std.id)}
                              />
                            </Td>
                            <Td>{student?.srNo}</Td>
                            <Td>{student?.studentName}</Td>
                            <Td>{student?.fatherName}</Td>
                            <Td>{classData?.name}</Td>
                            <Td>{stream?.name}</Td>
                            <Td>{std?.transport_route.name}</Td>
                            <Td>
                              <Popover
                                w={"auto"}
                                size={"xl"}
                                trigger={"hover"}
                                placement={"right"}
                              >
                                <PopoverTrigger>
                                  <Button
                                    size={"xs"}
                                    variant={"ghost"}
                                    colorScheme={themeColor}
                                  >
                                    {std.vehicle.vehicle}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent width={"auto"}>
                                  <PopoverArrow />
                                  <PopoverHeader>Driver Details</PopoverHeader>
                                  <PopoverBody>
                                    <Box>
                                      <Flex>
                                        <Avatar
                                          size={"sm"}
                                          src={driver?.photo}
                                        />
                                        <Box ml={2}>
                                          <Text
                                            fontSize={16}
                                            fontWeight={"semibold"}
                                          >
                                            {driver?.name}
                                          </Text>
                                          <Text>{driver?.mobileNo}</Text>
                                        </Box>
                                      </Flex>
                                    </Box>
                                  </PopoverBody>
                                </PopoverContent>
                              </Popover>
                            </Td>
                            <Td>{std?.station_master.name}</Td>
                            <Td>
                              <Flex align={"center"}>
                                <MdCurrencyRupee />
                                {std?.promotion.transportFees || 0}
                              </Flex>
                            </Td>
                            <Td>
                              {HasPermission(
                                PERMISSIONS.TRANSPORT_STUDENT_EDIT
                              ) && (
                                <Tooltip placement="top" label="Edit">
                                  <IconButton
                                    size="md"
                                    variant={"ghost"}
                                    icon={<EditIcon />}
                                    colorScheme={"blue"}
                                    onClick={() => setToggleDrawer(std)}
                                  />
                                </Tooltip>
                              )}
                              <Tooltip
                                placement="top"
                                label="Print Bus ID Card"
                              >
                                <IconButton
                                  size="md"
                                  variant="ghost"
                                  icon={<MdPrint />}
                                  colorScheme="blue"
                                  onClick={() => handlePrintClick([std])} // Keep the same print function
                                />
                              </Tooltip>
                              <Tooltip
                                placement="top"
                                label="Stop Trasport Student"
                              >
                                <IconButton
                                  size="md"
                                  variant="ghost"
                                  icon={<IoMdStopwatch />}
                                  colorScheme="blue"
                                  onClick={async () => {
                                    await getStudentFeesAction({
                                      promotionId: std.promotionId,
                                      studentMasterId:
                                        std?.promotion.student_master.id,
                                      feesMode: 2,
                                    });
                                    setShowTrasportStopModel([std]);
                                  }}
                                />
                              </Tooltip>
                            </Td>
                          </Tr>
                        ) : null;
                      })
                    ) : (
                      <Tr>
                        <Td
                          textAlign={"center"}
                          fontWeight={"semibold"}
                          colSpan={10}
                        >
                          No Transport Student Found
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Transport Student Found"} />
            )}
          </LoadingContainer>
          {toggleDrawer && (
            <StudentRegistration
              themeColor={themeColor}
              sessionMasterId={sessionMasterId}
              data={toggleDrawer}
              closeDrawer={() => setToggleDrawer(null)}
            />
          )}
          {toggleSendSms && (
            <SendSms
              themeColor={themeColor}
              sessionMasterId={sessionMasterId}
              data={toggleSendSms}
              closeDrawer={() => setToggleSendSms(null)}
            />
          )}
          {showTrasportStopModel && (
            <Modal
              isOpen={true}
              onClose={closeAlert}
              isCentered
              size="6xl" // Better than full screen for focus
              motionPreset="scale"
              scrollBehavior="inside"
            >
              <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(8px)" />

              <ModalContent
                border="none"
                overflow="hidden"
                boxShadow="2xl"
                borderRadius="2xl"
                maxH="90vh"
              >
                {/* Gradient Header */}
                <ModalHeader
                  bgGradient={`linear(to-r, ${themeColor}.800, ${themeColor}.700,)`}
                  color="white"
                  py={6}
                  px={8}
                  position="relative"
                >
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="whiteAlpha.200"
                    pointerEvents="none"
                  />
                  <Heading size="lg" fontWeight="extrabold" zIndex={1}>
                    Stop Transport Student
                  </Heading>
                  <ModalCloseButton
                    size="lg"
                    color="white"
                    _hover={{ bg: "whiteAlpha.300" }}
                    zIndex={1}
                  />
                </ModalHeader>

                {/* Animated Body */}
                <ModalBody px={8} py={6} bg="gray.50">
                  <Box
                    p={6}
                    borderRadius="xl"
                    bg="white"
                    boxShadow="sm"
                    borderWidth="1px"
                    borderColor="gray.100"
                    _hover={{
                      boxShadow: "md",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <TransportFees
                      pageName={"TransportStop"}
                      themeColor={themeColor}
                      sessionMasterId={sessionMasterId}
                      TransportFeesDetails={TransportFeesDetails}
                      setTransportFeesDetails={setTransportFeesDetails}
                    />
                  </Box>
                </ModalBody>

                <ModalFooter
                  display="flex"
                  justifyContent="end"
                  bg="gray.50"
                  p={6}
                  borderTopWidth="1px"
                  borderColor="gray.100"
                  borderBottomRadius="xl"
                >
                  <ButtonGroup spacing={4}>
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      onClick={closeAlert}
                    >
                      Cancel
                    </Button>
                    <Button
                      colorScheme={themeColor}
                      onClick={handleDeleteFees}
                      isDisabled={TransportFeesDetails.length === 0}
                      leftIcon={<DeleteIcon />}
                      isLoading={trsaportStopStatus === STATUS.FETCHING}
                      loadingText="Deleting"
                      color="white"
                    >
                      Delete Trasport Fee
                    </Button>
                  </ButtonGroup>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}

          <Box display={"none"}>
            {allPrintProps && allPrintProps?.length && (
              <Box
                ref={printAllRef}
                style={{ width: "297mm", height: "210mm", padding: "10mm" }}
              >
                <TransportPasses
                  allData={allPrintProps}
                  school={{}}
                  setAllPrintProps={setAllPrintProps}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
