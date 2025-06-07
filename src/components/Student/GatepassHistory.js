import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Flex,
  Text,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  useColorModeValue,
  ScaleFade,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { AddSession } from "../AdditionalSetting/AddSession";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { PageHeader } from "@/common/PageHeader";
import CustomInput from "@/common/CustomInput";
import dayjs from "dayjs";
import { MdLocalPrintshop } from "react-icons/md";
import { RiFileExcel2Fill } from "react-icons/ri";
import { DownloadExcel } from "@/common/DownloadExcel";
import GatePassAdd from "./gatePassAdd";
import { useStudentStore } from "@/store/studentStore";
import { DeleteButton } from "@/common/DeleteButton";
import { STATUS } from "@/constant";

function GatepassHistory() {
  const [inputValue, setInputValue] = useState({
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });
  const [selectedRow, setSelectedRow] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const themeColor = useMemo(() => getLocalStorageItem("themeColor"), []);
  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
  );

  const {
    getPassAction,
    allPasses,
    deletePassAction,
    deletePassStatus,
    resetPassStatus,
    addPassStatus,
  } = useStudentStore((s) => ({
    getPassAction: s.getPassAction,
    allPasses: s.allPasses,
    deletePassAction: s.deletePassAction,
    deletePassStatus: s.deletePassStatus,
    resetPassStatus: s.resetPassStatus,
    addPassStatus: s.addPassStatus,
  }));

  useEffect(() => {
    getPassAction({
      sessionMasterId,
      page: 1,
      limit: 10,
    });
  }, []);

  const handleView = (row) => {
    setSelectedRow(row);
    onOpen();
  };
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");

  const deleteGatePass = (id) => {
    deletePassAction(id);
  };
  useEffect(() => {
    if (
      deletePassStatus === STATUS.SUCCESS ||
      addPassStatus === STATUS.SUCCESS
    ) {
      getPassAction({
        sessionMasterId,
        page: 1,
        limit: 50,
      });
      resetPassStatus();
    }
    return () => {};
  }, [deletePassStatus, addPassStatus]);

  return (
    <Box p={3}>
      <PageHeader
        heading={"Gate Pass"}
        extra={
          <Flex>
            <Tooltip label="Add Gate Pass" placement="top">
              <GatePassAdd
                sessionMasterId={sessionMasterId}
                themeColor={themeColor}
              />
            </Tooltip>
            <Tooltip label="Print" placement="top">
              <Button mr={3} size={"sm"} colorScheme={themeColor}>
                <MdLocalPrintshop fontSize={18} />
              </Button>
            </Tooltip>
            <Tooltip label="Download Excel" placement="top">
              <DownloadExcel
                button={<RiFileExcel2Fill />}
                name={"UserWise Fees Collection"}
              />
            </Tooltip>
          </Flex>
        }
      />

      {/* <Flex wrap="wrap" gap={4} mb={6} mt={10}>
        <CustomInput
          w={"20%"}
          size={"sm"}
          notRequire={true}
          type={"date"}
          name="startDate"
          label={"Select Start Date"}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
        <CustomInput
          w={"20%"}
          size={"sm"}
          notRequire={true}
          type={"date"}
          name="endDate"
          label={"Select End Date"}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
        <Button size={"sm"} colorScheme={themeColor}>
          Fetch
        </Button>
      </Flex> */}

      <TableContainer
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        mt={5}
      >
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              {[
                "Name",
                "Father Name / Designation",
                "Class",
                "Section",
                "Reason",
                "Class Teacher Approved",
                "Date Time",
                "HOD Approved",
                "Principal Approved",
                "Actions",
              ].map((header) => (
                <Th key={header}>{header}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {allPasses?.data?.length ? (
              allPasses?.data.map((row, index) => {
                const isStudent = row.gatepassType === "student";

                const name = isStudent
                  ? row?.promotion?.student_master?.studentName
                  : row?.staff?.name;

                const fatherOrDesignation = isStudent
                  ? row?.promotion?.student_master?.fatherName
                  : row?.staff?.designation;

                const className = isStudent
                  ? row?.promotion?.class_master?.name
                  : "N/A";

                const sectionName = isStudent
                  ? row?.promotion?.section_master?.name
                  : "N/A";

                const dateTime =
                  row?.date && row?.timeout
                    ? `${new Date(row.date).toLocaleDateString()} ${new Date(
                        row.timeout
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`
                    : "N/A";

                return (
                  <Tr key={index}>
                    <Td>{name || "N/A"}</Td>
                    <Td>{fatherOrDesignation || "N/A"}</Td>
                    <Td>{className}</Td>
                    <Td>{sectionName}</Td>
                    <Td>{row?.reason || "N/A"}</Td>
                    <Td>{row?.classTeacher?.name || "N/A"}</Td>
                    <Td>{dateTime}</Td>
                    <Td>{row?.hod?.name || "N/A"}</Td>
                    <Td>{row?.principal?.name || "N/A"}</Td>
                    <Td>
                      <Button
                        size="xs"
                        colorScheme="blue"
                        onClick={() => handleView(row)}
                        mr={2}
                      >
                        View
                      </Button>
                      <DeleteButton
                        description={"Are you sure? Do you want to delete?"}
                        confirm={() => deleteGatePass(row.id)}
                        status={deletePassStatus}
                        reset={resetPassStatus}
                      />
                    </Td>
                  </Tr>
                );
              })
            ) : (
              <Tr>
                <Td colSpan={10} textAlign="center">
                  No data available
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <ScaleFade initialScale={0.9} in={isOpen}>
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay bg="blackAlpha.700" />
          <ModalContent
            bg={bgColor}
            borderRadius="2xl"
            border={`2px solid ${themeColor}.600`}
            boxShadow={`0 8px 16px ${themeColor}.200`}
            maxW={{ base: "90%", md: "lg" }}
            mx={2}
            fontFamily="'Merriweather', serif"
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `url('https://www.transparenttextures.com/patterns/paper-fibers.png')`,
              opacity: 0.05,
              borderRadius: "2xl",
            }}
          >
            <ModalHeader
              bgGradient={`linear(to-r, ${themeColor}.700, ${themeColor}.900)`}
              color="white"
              fontSize="xl"
              fontWeight="bold"
              textAlign="center"
              borderTopRadius="2xl"
              py={4}
              fontFamily="'Cinzel', serif"
              textTransform="uppercase"
              letterSpacing="1px"
            >
              Gate Pass Details
            </ModalHeader>
            <ModalCloseButton
              bg={`${themeColor}.800`}
              color="white"
              borderRadius="full"
              _hover={{ bg: `${themeColor}.900`, transform: "scale(1.2)" }}
              _focus={{ boxShadow: `0 0 0 3px ${themeColor}.300` }}
              size="lg"
              mt={3}
              mr={3}
              aria-label="Close modal"
            />
            <ModalBody p={6}>
              {selectedRow && (
                <Box>
                  {/* Conditional Rendering based on gatepassType */}
                  {selectedRow.gatepassType === "student" ? (
                    <>
                      {/* Student Info Section */}
                      <Box
                        border={`1px solid ${themeColor}.200`}
                        borderRadius="lg"
                        p={4}
                        mb={4}
                        bg="white"
                        boxShadow={`0 4px 8px ${themeColor}.100`}
                        _hover={{
                          borderColor: `${themeColor}.400`,
                          boxShadow: `0 6px 12px ${themeColor}.200`,
                        }}
                        transition="all 0.3s"
                      >
                        <Heading
                          size="md"
                          mb={3}
                          color={`${themeColor}.800`}
                          fontFamily="'Cinzel', serif"
                          textTransform="uppercase"
                        >
                          Student Info
                        </Heading>
                        <Grid
                          templateColumns="1fr 2fr"
                          gap={2}
                          fontSize="sm"
                          color={textColor}
                        >
                          <GridItem fontWeight="bold">Name:</GridItem>
                          <GridItem>
                            {selectedRow.promotion?.student_master
                              ?.studentName || "N/A"}
                          </GridItem>
                          <GridItem fontWeight="bold">Father Name:</GridItem>
                          <GridItem>
                            {selectedRow.promotion?.student_master
                              ?.fatherName || "N/A"}
                          </GridItem>
                          <GridItem fontWeight="bold">Class:</GridItem>
                          <GridItem>
                            {selectedRow.promotion?.class_master?.name || "N/A"}
                          </GridItem>
                          <GridItem fontWeight="bold">Section:</GridItem>
                          <GridItem>
                            {selectedRow.promotion?.section_master?.name ||
                              "N/A"}
                          </GridItem>
                          <GridItem fontWeight="bold">Address:</GridItem>
                          <GridItem>
                            {selectedRow.promotion?.student_master?.address ||
                              "N/A"}
                          </GridItem>
                        </Grid>
                      </Box>
                    </>
                  ) : (
                    <>
                      {/* Staff Info Section */}
                      <Box
                        border={`1px solid ${themeColor}.200`}
                        borderRadius="lg"
                        p={4}
                        mb={4}
                        bg="white"
                        boxShadow={`0 4px 8px ${themeColor}.100`}
                        _hover={{
                          borderColor: `${themeColor}.400`,
                          boxShadow: `0 6px 12px ${themeColor}.200`,
                        }}
                        transition="all 0.3s"
                      >
                        <Heading
                          size="md"
                          mb={3}
                          color={`${themeColor}.800`}
                          fontFamily="'Cinzel', serif"
                          textTransform="uppercase"
                        >
                          Staff Info
                        </Heading>
                        <Grid
                          templateColumns="1fr 2fr"
                          gap={2}
                          fontSize="sm"
                          color={textColor}
                        >
                          <GridItem fontWeight="bold">Name:</GridItem>
                          <GridItem>
                            {selectedRow.staff?.name || "N/A"}
                          </GridItem>
                          <GridItem fontWeight="bold">Designation:</GridItem>
                          <GridItem>
                            {selectedRow.staff?.designation || "N/A"}
                          </GridItem>
                          <GridItem fontWeight="bold">Mobile No:</GridItem>
                          <GridItem>
                            {selectedRow.staff?.mobileNo || "N/A"}
                          </GridItem>
                          <GridItem fontWeight="bold">Email:</GridItem>
                          <GridItem>
                            {selectedRow.staff?.email || "N/A"}
                          </GridItem>
                        </Grid>
                      </Box>
                    </>
                  )}

                  {/* Gate Pass Info Section */}
                  <Box
                    border={`1px solid ${themeColor}.200`}
                    borderRadius="lg"
                    p={4}
                    mb={4}
                    bg="white"
                    boxShadow={`0 4px 8px ${themeColor}.100`}
                    _hover={{
                      borderColor: `${themeColor}.400`,
                      boxShadow: `0 6px 12px ${themeColor}.200`,
                    }}
                    transition="all 0.3s"
                  >
                    <Heading
                      size="md"
                      mb={3}
                      color={`${themeColor}.800`}
                      fontFamily="'Cinzel', serif"
                      textTransform="uppercase"
                    >
                      Gate Pass Info
                    </Heading>
                    <Grid
                      templateColumns="1fr 2fr"
                      gap={2}
                      fontSize="sm"
                      color={textColor}
                    >
                      <GridItem fontWeight="bold">Reason:</GridItem>
                      <GridItem>{selectedRow.reason || "N/A"}</GridItem>
                      <GridItem fontWeight="bold">Date:</GridItem>
                      <GridItem>
                        {selectedRow.date
                          ? new Date(selectedRow.date).toLocaleDateString()
                          : "N/A"}
                      </GridItem>
                      <GridItem fontWeight="bold">Timeout:</GridItem>
                      <GridItem>
                        {selectedRow.timeout
                          ? new Date(selectedRow.timeout).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "N/A"}
                      </GridItem>
                      <GridItem fontWeight="bold">Remarks:</GridItem>
                      <GridItem>{selectedRow.remarks || "N/A"}</GridItem>
                    </Grid>
                  </Box>

                  {/* Approvals Section */}
                  <Box
                    border={`1px solid ${themeColor}.200`}
                    borderRadius="lg"
                    p={4}
                    bg="white"
                    boxShadow={`0 4px 8px ${themeColor}.100`}
                    _hover={{
                      borderColor: `${themeColor}.400`,
                      boxShadow: `0 6px 12px ${themeColor}.200`,
                    }}
                    transition="all 0.3s"
                  >
                    <Heading
                      size="md"
                      mb={3}
                      color={`${themeColor}.800`}
                      fontFamily="'Cinzel', serif"
                      textTransform="uppercase"
                    >
                      Approvals
                    </Heading>
                    <Grid
                      templateColumns="1fr 2fr"
                      gap={2}
                      fontSize="sm"
                      color={textColor}
                    >
                      <GridItem fontWeight="bold">Class Teacher:</GridItem>
                      <GridItem
                        fontFamily="'Great Vibes', cursive"
                        fontSize="md"
                      >
                        {selectedRow.classTeacher?.name || "N/A"}
                      </GridItem>
                      <GridItem fontWeight="bold">HOD:</GridItem>
                      <GridItem
                        fontFamily="'Great Vibes', cursive"
                        fontSize="md"
                      >
                        {selectedRow.hod?.name || "N/A"}
                      </GridItem>
                      <GridItem fontWeight="bold">Principal:</GridItem>
                      <GridItem
                        fontFamily="'Great Vibes', cursive"
                        fontSize="md"
                      >
                        {selectedRow.principal?.name || "N/A"}
                      </GridItem>
                    </Grid>
                  </Box>
                </Box>
              )}
              <Flex justify="flex-end" mt={6}>
                <Button
                  colorScheme={themeColor}
                  bg={`${themeColor}.700`}
                  color="white"
                  borderRadius="full"
                  size="md"
                  px={6}
                  onClick={onClose}
                  _hover={{
                    bg: `${themeColor}.800`,
                    transform: "scale(1.05)",
                    boxShadow: `0 4px 8px ${themeColor}.300`,
                  }}
                  transition="all 0.3s"
                  fontFamily="'Cinzel', serif"
                >
                  Close
                </Button>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      </ScaleFade>
    </Box>
  );
}

export default GatepassHistory;
