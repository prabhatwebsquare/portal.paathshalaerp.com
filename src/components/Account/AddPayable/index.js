import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import dayjs from "dayjs";
import { AddNewPayable } from "./AddNewPayable";
import { useAccountStore } from "@/store/Account";
import { STATUS } from "@/constant";
import { DeleteButton } from "@/common/DeleteButton";
import { PiEye } from "react-icons/pi";
import Pagination from "@/common/Pagination";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
export const AddPayable = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);

  const {
    getPayableAction,
    getPayableStatus,
    allPayables,
    deletePayableAction,
    deletePayableStatus,
    resetPayableStatus,
  } = useAccountStore((s) => ({
    getPayableAction: s.getPayableAction,
    getPayableStatus: s.getPayableStatus,
    allPayables: s.allPayables,
    deletePayableAction: s.deletePayableAction,
    deletePayableStatus: s.deletePayableStatus,
    resetPayableStatus: s.resetPayableStatus,
  }));
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    if ((getPayableStatus || 1) === STATUS.NOT_STARTED) {
      getPayableAction({
        sessionMasterId,
        page: currentPage,
        limit: parseInt(limit),
        sortBy: "date",
      });
    }
  }, [getPayableAction, getPayableStatus, sessionMasterId]);

  const deletePayable = (id) => {
    deletePayableAction(id);
  };
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [payable, setSelectedPayable] = useState(null);

  const handleViewVoucher = (pay) => {
    setSelectedPayable(pay);
    onOpen();
  };
  useEffect(() => {
    if (currentPage && limit)
      getPayableAction({
        sessionMasterId,
        page: currentPage,
        limit: parseInt(limit),
        sortBy: "date",
      });
  }, [currentPage, limit]);
  return (
    <Box>
      <PageHeader
        heading={"Payment Voucher"}
        extra={
          <Flex gap={2}>
            {HasPermission(PERMISSIONS.ADD_PAYABLE_ADD) && (
            <Button
              size={"sm"}
              colorScheme={themeColor}
              leftIcon={<AddIcon />}
              onClick={() => setToggleDrawer([])}
            >
              Payment Voucher
            </Button>
            )}
            <Pagination
              totalItems={allPayables?.totalCount}
              limit={limit}
              setLimit={setLimit}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              themeColor={themeColor}
            />
          </Flex>
        }
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <TableContainer mt={2}>
            <Table w="100%" size="sm" variant="simple">
              <Thead>
                <Tr bg="gray.100">
                  <Th>Voucher No.</Th>
                  <Th>Payable Name</Th>
                  <Th>Expense Type</Th>
                  <Th>Date</Th>
                  <Th>Mode</Th>
                  <Th>Bank</Th>
                  <Th>Amount</Th>
                  <Th>Desc</Th>
           
                    <Th>Action</Th>

                </Tr>
              </Thead>
              <Tbody>
                {map(allPayables?.data, (pay, index) =>
                  pay ? (
                    <Tr key={pay.id}>
                      <Td>{pay.voucherNo}</Td>
                      <Td>{pay.ledger_master?.name || "-"}</Td>
                      <Td>{pay.expense_type?.type || "-"}</Td>
                      <Td>
                        {pay.voucherDate
                          ? dayjs(pay.voucherDate).format("DD-MM-YYYY")
                          : "-"}
                      </Td>

                      {/* Mode */}
                      <Td>
                        <Box>
                          <Text>{pay.paymentMode || "Cash"}</Text>
                          <Text
                            fontSize="xs"
                            color="gray.500"
                            fontStyle="italic"
                          >
                            {pay.transactionNo || ""}
                          </Text>
                        </Box>
                      </Td>

                      {/* Bank */}
                      <Td>
                        {pay.anotherLedgerMaster?.type === "BANK" ? (
                          <Box>
                            <Text>{pay.anotherLedgerMaster?.name || "-"}</Text>
                            <Text
                              fontSize="xs"
                              color="gray.500"
                              fontStyle="italic"
                            >
                              {pay.anotherLedgerMaster?.accountNumber || ""}
                            </Text>
                          </Box>
                        ) : (
                          "-"
                        )}
                      </Td>

                      <Td>₹ {pay.amount}</Td>
                      <Td>{pay.remark || "-"}</Td>

                      {/* Action Buttons */}
                      <Td>
                        <Tooltip placement="top" label="View Voucher">
                          <IconButton
                            size="xs"
                            variant="ghost"
                            icon={<PiEye />}
                            colorScheme={themeColor}
                            onClick={() => handleViewVoucher(pay)}
                            aria-label="View payment voucher"
                          />
                        </Tooltip>
                        {HasPermission(PERMISSIONS.ADD_PAYABLE_EDIT) && (
                          <Tooltip placement="top" label="Edit">
                            <IconButton
                              size="xs"
                              variant="ghost"
                              icon={<EditIcon />}
                              colorScheme={themeColor}
                              onClick={() => setToggleDrawer(pay)}
                            />
                          </Tooltip>
                        )}
                        {HasPermission(PERMISSIONS.ADD_PAYABLE_DELETE) && (
                          <DeleteButton
                            description="Are you sure? Do you want to delete?"
                            confirm={() => deletePayable(pay.id)}
                            status={deletePayableStatus}
                            reset={resetPayableStatus}
                          />
                        )}
                      </Td>
                    </Tr>
                  ) : null
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
        {toggleDrawer && (
          <AddNewPayable
            data={toggleDrawer}
            closeDrawer={() => setToggleDrawer(null)}
            sessionMasterId={sessionMasterId}
            themeColor={themeColor}
          />
        )}
        <ScaleFade initialScale={0.95} in={isOpen}>
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={{ base: "full", md: "lg" }}
            isCentered
          >
            <ModalOverlay bg="blackAlpha.600" />
            <ModalContent
              bg={bgColor}
              borderRadius="xl"
              border={`2px solid ${themeColor}.700`}
              boxShadow={`0 6px 12px ${themeColor}.300`}
              maxW={{ base: "95%", md: "600px" }}
              mx={2}
              sx={{
                "@media print": {
                  boxShadow: "none",
                  border: `1px solid ${themeColor}.700`,
                  maxW: "100%",
                },
              }}
            >
              <ModalHeader
                bgGradient={`linear(to-r, ${themeColor}.600, ${themeColor}.700)`}
                color="white"
                fontSize="xl"
                fontWeight="bold"
                textAlign="center"
                borderTopRadius="xl"
                py={4}
              >
                Payment Voucher
              </ModalHeader>
              <ModalCloseButton
                bg={`${themeColor}.700`}
                color="white"
                borderRadius="full"
                _hover={{ bg: `${themeColor}.800` }}
                _focus={{ boxShadow: `0 0 0 3px ${themeColor}.300` }}
                size="sm"
                mt={3}
                mr={3}
                aria-label="Close modal"
                sx={{ "@media print": { display: "none" } }}
              />
              <ModalBody p={{ base: 4, md: 6 }} color={textColor}>
                <Box
                  borderWidth="1px"
                  borderColor={`${themeColor}.200`}
                  borderRadius="lg"
                  p={4}
                  bg={`${themeColor}.50`}
                >
                  {/* Voucher Header */}
                  <Flex justify="space-between" mb={4}>
                    <Box>
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color={`${themeColor}.700`}
                      >
                        Voucher No: {payable?.voucherNo || "-"}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Reference No: {payable?.referenceVoucherNo || "-"}
                      </Text>
                    </Box>
                    <Box textAlign="right">
                      <Text fontSize="sm" fontWeight="medium">
                        Date:{" "}
                        {payable?.voucherDate
                          ? dayjs(payable?.voucherDate).format("DD-MM-YYYY")
                          : "-"}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Transaction Date:{" "}
                        {payable?.transactionDate
                          ? dayjs(payable?.transactionDate).format("DD-MM-YYYY")
                          : "-"}
                      </Text>
                    </Box>
                  </Flex>

                  <Divider borderColor={`${themeColor}.300`} my={4} />

                  {/* Payee Details */}
                  <Box mb={4}>
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      color={`${themeColor}.700`}
                      mb={2}
                    >
                      Payee Details
                    </Text>
                    <Flex direction="column" gap={1}>
                      <Text fontSize="sm">
                        <strong>Name:</strong>{" "}
                        {payable?.ledger_master?.name || "-"}
                      </Text>
                      <Text fontSize="sm">
                        <strong>Expense Type:</strong>{" "}
                        {payable?.expense_type?.type
                          ? payable?.expense_type.type.charAt(0).toUpperCase() +
                            payable?.expense_type.type.slice(1)
                          : "-"}
                      </Text>
                      <Text fontSize="sm">
                        <strong>Description:</strong> {payable?.remark || "-"}
                      </Text>
                    </Flex>
                  </Box>

                  <Divider borderColor={`${themeColor}.300`} my={4} />

                  {/* Payment Details */}
                  <Box mb={4}>
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      color={`${themeColor}.700`}
                      mb={2}
                    >
                      Payment Details
                    </Text>
                    <Flex direction="column" gap={1}>
                      <Text fontSize="sm">
                        <strong>Mode:</strong> {payable?.paymentMode || "Cash"}
                      </Text>
                      {payable?.transactionNo && (
                        <Text fontSize="sm">
                          <strong>Transaction No:</strong>{" "}
                          {payable?.transactionNo}
                        </Text>
                      )}
                      {payable?.anotherLedgerMaster?.type === "BANK" && (
                        <>
                          <Text fontSize="sm">
                            <strong>Bank:</strong>{" "}
                            {payable?.anotherLedgerMaster?.name || "-"}
                          </Text>
                          <Text fontSize="sm">
                            <strong>Account No:</strong>{" "}
                            {payable?.anotherLedgerMaster?.accountNumber || "-"}
                          </Text>
                        </>
                      )}
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color={`${themeColor}.800`}
                        mt={2}
                      >
                        Amount: ₹{" "}
                        {payable?.amount?.toLocaleString("en-IN") || "0"}
                      </Text>
                    </Flex>
                  </Box>
                </Box>
              </ModalBody>
              <ModalFooter
                bg={`${themeColor}.50`}
                borderTop={`1px solid ${themeColor}.200`}
                borderBottomRadius="xl"
                justifyContent="space-between"
                p={4}
                sx={{ "@media print": { display: "none" } }}
              >
                {/* <Button
              colorScheme={themeColor}
              bg={`${themeColor}.700`}
              color="white"
              borderRadius="full"
              leftIcon={<FiPrinter />}
            //   onClick={handlePrint}
              _hover={{ bg: `${themeColor}.800`, transform: "scale(1.05)" }}
              transition="all 0.2s"
            >
              Print
            </Button> */}
                <Button
                  colorScheme="red"
                  variant="outline"
                  borderRadius="full"
                  onClick={onClose}
                  _hover={{ bg: "red.50" }}
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </ScaleFade>
      </Box>
    </Box>
  );
};
