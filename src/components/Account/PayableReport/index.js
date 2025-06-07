import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import dayjs from "dayjs";
import { useAccountStore } from "@/store/Account";
import { STATUS } from "@/constant";

export const PayableReport = ({ themeColor, sessionMasterId }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)

    const {
        getPayableReportAction, getPayableReportStatus, allPayableReport, resetPayableReport,
    } = useAccountStore(s => ({
        getPayableReportAction: s.getPayableReportAction,
        getPayableReportStatus: s.getPayableReportStatus,
        allPayableReport: s.allPayableReport,
        resetPayableReport: s.resetPayableReport
    }))

    useEffect(() => {
        if ((getPayableReportStatus || 1) === STATUS.NOT_STARTED) {
            getPayableReportAction({ sessionMasterId })
        }
    }, [getPayableReportAction, getPayableReportStatus, sessionMasterId])

    useEffect(() => {
        return () => resetPayableReport()
    }, [resetPayableReport])

    return (
        <Box>
            <PageHeader heading={"Payable Report"} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <TableContainer mt={2}>
                        <Table w="100%" size={"sm"} variant={"simple"}>
                            <Thead>
                                <Tr bg="gray.100">
                                    <Th>S. No.</Th>
                                    <Th>Ledger Name</Th>
                                    <Th>Debit</Th>
                                    <Th>Credit</Th>
                                    <Th>Closing Amount</Th>
                                    {/* <Th>Action</Th> */}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {map(allPayableReport, (payable, index) => (
                                    <Tr key={payable.id}>
                                        <Td>{index + 1}</Td>
                                        <Td>{payable.ledgerName}</Td>
                                        <Td>₹ {payable.drAmount}</Td>
                                        <Td>₹ {payable.crAmount}</Td>
                                        <Td>₹ {payable.closingBalance} {payable.drAmount > payable.crAmount ? "DR" : "CR"}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
                {/* {toggleDrawer && <AddExpense data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} />} */}
            </Box>
        </Box>
    )
}