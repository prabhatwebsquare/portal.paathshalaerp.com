import { EditIcon } from "@chakra-ui/icons";
import { Box, Button, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { LoadingContainer } from "@/common/LoadingContainer";
import { DeleteButton } from "@/common/DeleteButton";
import { STATUS } from "@/constant";
import { useAdminBankStore } from "@/store/Banks";
import { AddAdminBank } from "./AddAdminBank";

export const AdminBanks = ({ themeColor }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    const { getAdminBankAction, getAdminBanksStatus, allAdminBanks, deleteAdminBankAction, deleteAdminBankStatus, resetAdminBankStatus } = useAdminBankStore(s => ({
        getAdminBankAction: s.getAdminBankAction,
        getAdminBanksStatus: s.getAdminBanksStatus,
        allAdminBanks: s.allAdminBanks,
        deleteAdminBankAction: s.deleteAdminBankAction,
        deleteAdminBankStatus: s.deleteAdminBankStatus,
        resetAdminBankStatus: s.resetAdminBankStatus
    }))

    useEffect(() => {
        if ((getAdminBanksStatus || 1) === STATUS.NOT_STARTED) {
            getAdminBankAction()
        }
    }, [getAdminBankAction, getAdminBanksStatus])

    const deleteAdminBank = (id) => {
        deleteAdminBankAction(id)
    }
    return (
        <Box>
            <PageHeader heading={"Banks"} extra={<Button size={"sm"} colorScheme={themeColor} onClick={() => setToggleDrawer([])}>Add Bank</Button>} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
                    <LoadingContainer status={getAdminBanksStatus}>
                        <TableContainer mt={2}>
                            <Table w="100%" size={"sm"} variant={"simple"}>
                                <Thead>
                                    <Tr bg="gray.100">
                                        <Th>S.No.</Th>
                                        <Th>AdminBank Name</Th>
                                        <Th>Action</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {allAdminBanks?.length ?
                                        map(allAdminBanks, (bank, index) => (
                                            <Tr key={bank.id}>
                                                <Td>{index + 1}</Td>
                                                <Td>{bank?.name}</Td>
                                                <Td>
                                                    <Tooltip placement="top" label="Edit">
                                                        <IconButton mr={3} size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={themeColor} onClick={() => setToggleDrawer(bank)} />
                                                    </Tooltip>
                                                    <DeleteButton
                                                        description={"Are you sure? Do you want to delete?"}
                                                        confirm={() => deleteAdminBank(bank.id)}
                                                        status={deleteAdminBankStatus}
                                                        reset={resetAdminBankStatus}
                                                    />
                                                </Td>
                                            </Tr>
                                        ))
                                        :
                                        <Tr>
                                            <Td colSpan={5} textAlign={"center"} fontWeight={"semibold"}>No Bank Found</Td>
                                        </Tr>
                                    }
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </LoadingContainer>
                </Box>
                {toggleDrawer && <AddAdminBank data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} themeColor={themeColor} />}
            </Box>
        </Box>
    )
}