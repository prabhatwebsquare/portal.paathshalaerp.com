import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import dayjs from "dayjs";
import { AddPaymentVoucher } from "./AddPaymentVoucher";
import { useAccountStore } from "@/store/Account";
import { STATUS } from "@/constant";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { DeleteButton } from "@/common/DeleteButton";

export const PaymentVoucher = ({ sessionMasterId, themeColor }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)

    const { getPaymentVoucherAction, getPaymentVoucherStatus, allPaymentVouchers, deletePaymentVoucherAction, deletePaymentVoucherStatus, resetPaymentVoucherStatus } = useAccountStore(s => ({
        getPaymentVoucherAction: s.getPaymentVoucherAction,
        getPaymentVoucherStatus: s.getPaymentVoucherStatus,
        allPaymentVouchers: s.allPaymentVouchers,
        deletePaymentVoucherAction: s.deletePaymentVoucherAction,
        deletePaymentVoucherStatus: s.deletePaymentVoucherStatus,
        resetPaymentVoucherStatus: s.resetPaymentVoucherStatus
    }))

    useEffect(() => {
        if ((getPaymentVoucherStatus || 1) === STATUS.NOT_STARTED) {
            getPaymentVoucherAction({ sessionMasterId })
        }
    }, [getPaymentVoucherAction, getPaymentVoucherStatus, sessionMasterId])

    const deletePaymentVoucher = (id) => {
        deletePaymentVoucherAction(id)
    }

    return (
        <Box h={"100%"}>
            <PageHeader heading={"Payment Voucher"} extra={<Button size={"sm"} colorScheme={themeColor} leftIcon={<AddIcon />} onClick={() => setToggleDrawer([])}>Add Payment</Button>} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <LoadingContainer status={getPaymentVoucherStatus}>
                        {allPaymentVouchers?.length ?
                            <TableContainer mt={2}>
                                <Table w="100%" size={"sm"} variant={"simple"}>
                                    <Thead>
                                        <Tr bg="gray.100">
                                            <Th>Voucher No.</Th>
                                            <Th>Ledger Name</Th>
                                            <Th>Expense Type</Th>
                                            <Th>Date</Th>
                                            <Th>Amount</Th>
                                            <Th>Mode</Th>
                                            <Th>Narration</Th>
                                            <Th>Action</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {map(allPaymentVouchers, payment => (
                                            <Tr>
                                                <Td>{payment.voucherNo}</Td>
                                                <Td>{payment.ledger_master?.name}</Td>
                                                <Td>{payment.expense_type?.type}</Td>
                                                <Td>{payment.voucherDate ? dayjs(payment.voucherDate).format("DD-MM-YYYY") : null}</Td>
                                                <Td>{payment.amount}</Td>
                                                <Td>
                                                    <Box align={"center"}>
                                                        <Text>{payment.paymentMode}</Text>
                                                        <Text color={"gray.500"} fontSize={11} fontStyle={"italic"}>{payment.transactionNo}</Text>
                                                    </Box>
                                                </Td>
                                                <Td>{payment.remark}</Td>
                                                <Td>
                                                    <Tooltip placement="top" label="Edit">
                                                        <IconButton size={"xs"} variant={"ghost"} icon={<EditIcon />} colorScheme={"blue"} onClick={() => setToggleDrawer(payment)} />
                                                    </Tooltip>
                                                    <DeleteButton
                                                        description={"Are you sure? Do you want to delete?"}
                                                        confirm={() => deletePaymentVoucher(payment.id)}
                                                        status={deletePaymentVoucherStatus}
                                                        reset={resetPaymentVoucherStatus}
                                                    />
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            :
                            <NoData title={"No Payment Voucher Found"} />
                        }
                    </LoadingContainer>
                </Box>
                {toggleDrawer && <AddPaymentVoucher data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} sessionMasterId={sessionMasterId} themeColor={themeColor} />}
            </Box>
        </Box>
    )
}