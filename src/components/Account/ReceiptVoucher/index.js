import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import dayjs from "dayjs";
import { useAccountStore } from "@/store/Account";
import { STATUS } from "@/constant";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { DeleteButton } from "@/common/DeleteButton";
import { AddReceiptVoucher } from "./AddReceiptVoucher";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const ReceiptVoucher = ({ sessionMasterId, themeColor }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)

    const { getReceiptVoucherAction, getReceiptVoucherStatus, allReceiptVouchers, deleteReceiptVoucherAction, deleteReceiptVoucherStatus, resetReceiptVoucherStatus } = useAccountStore(s => ({
        getReceiptVoucherAction: s.getReceiptVoucherAction,
        getReceiptVoucherStatus: s.getReceiptVoucherStatus,
        allReceiptVouchers: s.allReceiptVouchers,
        deleteReceiptVoucherAction: s.deleteReceiptVoucherAction,
        deleteReceiptVoucherStatus: s.deleteReceiptVoucherStatus,
        resetReceiptVoucherStatus: s.resetReceiptVoucherStatus
    }))

    useEffect(() => {
        if ((getReceiptVoucherStatus || 1) === STATUS.NOT_STARTED) {
            getReceiptVoucherAction({ sessionMasterId })
        }
    }, [getReceiptVoucherAction, getReceiptVoucherStatus, sessionMasterId])

    const deleteReceiptVoucher = (id) => {
        deleteReceiptVoucherAction(id)
    }

    return (
        <Box h={"100%"}>
            <PageHeader 
                heading={"Receipt Voucher"} 
                extra={
                    HasPermission(PERMISSIONS.RECEIPT_VOUCHER_ADD) && (
                        <Button 
                            size={"sm"} 
                            colorScheme={themeColor} 
                            leftIcon={<AddIcon />} 
                            onClick={() => setToggleDrawer([])}
                        >
                            Add Receipt
                        </Button>
                    )
                } 
            />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <LoadingContainer status={getReceiptVoucherStatus}>
                        {allReceiptVouchers?.length ?
                            <TableContainer mt={2}>
                                <Table w="100%" size={"sm"} variant={"simple"}>
                                    <Thead>
                                        <Tr bg="gray.100">
                                            <Th>Voucher No.</Th>
                                            <Th>Ledger Name</Th>
                                            <Th>Income Type</Th>
                                            <Th>Date</Th>
                                            <Th>Amount</Th>
                                            <Th>Mode</Th>
                                            <Th>Narration</Th>
                                            {(HasPermission(PERMISSIONS.RECEIPT_VOUCHER_EDIT) || 
                                              HasPermission(PERMISSIONS.RECEIPT_VOUCHER_DELETE)) && (
                                                <Th>Action</Th>
                                            )}
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {map(allReceiptVouchers, payment => (
                                            <Tr key={payment.id}>
                                                <Td>{payment.voucherNo}</Td>
                                                <Td>{payment.ledger_master?.name}</Td>
                                                <Td>{payment.income_type?.type}</Td>
                                                <Td>{payment.voucherDate ? dayjs(payment.voucherDate).format("DD-MM-YYYY") : null}</Td>
                                                <Td>{payment.amount}</Td>
                                                <Td>
                                                    <Box align={"center"}>
                                                        <Text>{payment.paymentMode}</Text>
                                                        <Text color={"gray.500"} fontSize={11} fontStyle={"italic"}>{payment.transactionNo}</Text>
                                                    </Box>
                                                </Td>
                                                <Td>{payment.remark}</Td>
                                                {(HasPermission(PERMISSIONS.RECEIPT_VOUCHER_EDIT) || 
                                                  HasPermission(PERMISSIONS.RECEIPT_VOUCHER_DELETE)) && (
                                                    <Td>
                                                        {HasPermission(PERMISSIONS.RECEIPT_VOUCHER_EDIT) && (
                                                            <Tooltip placement="top" label="Edit">
                                                                <IconButton 
                                                                    size={"xs"} 
                                                                    variant={"ghost"} 
                                                                    icon={<EditIcon />} 
                                                                    colorScheme={themeColor} 
                                                                    onClick={() => setToggleDrawer(payment)} 
                                                                />
                                                            </Tooltip>
                                                        )}
                                                        {HasPermission(PERMISSIONS.RECEIPT_VOUCHER_DELETE) && (
                                                            <DeleteButton
                                                                description={"Are you sure? Do you want to delete?"}
                                                                confirm={() => deleteReceiptVoucher(payment.id)}
                                                                status={deleteReceiptVoucherStatus}
                                                                reset={resetReceiptVoucherStatus}
                                                            />
                                                        )}
                                                    </Td>
                                                )}
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            :
                            <NoData title={"No Receipt Voucher Found"} />
                        }
                    </LoadingContainer>
                </Box>
                {toggleDrawer && <AddReceiptVoucher data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} sessionMasterId={sessionMasterId} themeColor={themeColor} />}
            </Box>
        </Box>
    )
}