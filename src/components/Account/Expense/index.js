import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { AddExpense } from "./AddExpense";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { STATUS } from "@/constant";
import { useAccountStore } from "@/store/Account";
import { DeleteButton } from "@/common/DeleteButton";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const Expense = ({ themeColor }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)

    const { getExpenseTypeAction, getExpenseTypeStatus, allExpenseTypes, deleteExpenseTypeAction, deleteExpenseTypeStatus, resetExpenseTypeStatus } = useAccountStore(s => ({
        getExpenseTypeAction: s.getExpenseTypeAction,
        getExpenseTypeStatus: s.getExpenseTypeStatus,
        allExpenseTypes: s.allExpenseTypes,
        deleteExpenseTypeAction: s.deleteExpenseTypeAction,
        deleteExpenseTypeStatus: s.deleteExpenseTypeStatus,
        resetExpenseTypeStatus: s.resetExpenseTypeStatus
    }))

    useEffect(() => {
        if ((getExpenseTypeStatus || 1) === STATUS.NOT_STARTED) {
            getExpenseTypeAction()
        }
    }, [getExpenseTypeAction, getExpenseTypeStatus])

    const deleteExpenseType = (id) => {
        deleteExpenseTypeAction(id)
    }

    return (
        <Box h={"100%"}>
            <PageHeader 
                heading={"Expense Type"} 
                extra={
                    HasPermission(PERMISSIONS.EXPENSE_TYPE_ADD) && (
                        <Button 
                            size={"sm"} 
                            colorScheme={themeColor} 
                            leftIcon={<AddIcon />} 
                            onClick={() => setToggleDrawer([])}
                        >
                            Add Expense
                        </Button>
                    )
                } 
            />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <LoadingContainer status={getExpenseTypeStatus}>
                        {allExpenseTypes?.length ?
                            <TableContainer mt={2}>
                                <Table w="100%" size={"sm"} variant={"simple"}>
                                    <Thead>
                                        <Tr bg="gray.100">
                                            <Th>S. No.</Th>
                                            <Th>Expense Type</Th>
                                            {(HasPermission(PERMISSIONS.EXPENSE_TYPE_EDIT) || HasPermission(PERMISSIONS.EXPENSE_TYPE_DELETE)) && <Th>Action</Th>}
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {map(allExpenseTypes, (expense, index) => (
                                            <Tr key={expense.id}>
                                                <Td>{index + 1}</Td>
                                                <Td>{expense.type}</Td>
                                                {(HasPermission(PERMISSIONS.EXPENSE_TYPE_EDIT) || HasPermission(PERMISSIONS.EXPENSE_TYPE_DELETE)) && (
                                                    <Td>
                                                        {HasPermission(PERMISSIONS.EXPENSE_TYPE_EDIT) && (
                                                            <Tooltip placement="top" label="Edit">
                                                                <IconButton 
                                                                    size={"sm"} 
                                                                    variant={"ghost"} 
                                                                    icon={<EditIcon />} 
                                                                    colorScheme={"blue"} 
                                                                    onClick={() => setToggleDrawer(expense)} 
                                                                />
                                                            </Tooltip>
                                                        )}
                                                        {HasPermission(PERMISSIONS.EXPENSE_TYPE_DELETE) && (
                                                            <DeleteButton
                                                                description={"Are you sure? Do you want to delete?"}
                                                                confirm={() => deleteExpenseType(expense.id)}
                                                                status={deleteExpenseTypeStatus}
                                                                reset={resetExpenseTypeStatus}
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
                            <NoData title={"No Expense Type Found"} />
                        }
                    </LoadingContainer>
                </Box>
                {toggleDrawer && <AddExpense data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} themeColor={themeColor} />}
            </Box>
        </Box>
    )
}