import { EditIcon } from "@chakra-ui/icons";
import { Box, Button, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { LoadingContainer } from "@/common/LoadingContainer";
import { DeleteButton } from "@/common/DeleteButton";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { useLibraryStore } from "@/store/Library";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { AddLatePenalty } from "./AddLatePenalty";

export const LatePenalty = ({ themeColor, sessionMasterId }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)

    const { getLatePenaltyAction, getLatePenaltyStatus, allLatePenaltys, resetLatePenaltyData, deleteLatePenaltyAction, deleteLatePenaltyStatus, resetLatePenaltyStatus } = useLibraryStore(s => ({
        getLatePenaltyAction: s.getLatePenaltyAction,
        getLatePenaltyStatus: s.getLatePenaltyStatus,
        allLatePenaltys: s.allLatePenaltys,
        resetLatePenaltyData: s.resetLatePenaltyData,
        deleteLatePenaltyAction: s.deleteLatePenaltyAction,
        deleteLatePenaltyStatus: s.deleteLatePenaltyStatus,
        resetLatePenaltyStatus: s.resetLatePenaltyStatus
    }))

    useEffect(() => {
        if ((getLatePenaltyStatus || 1) === STATUS.NOT_STARTED) {
            getLatePenaltyAction()
        }
    }, [getLatePenaltyAction, getLatePenaltyStatus])

    useEffect(() => {
        return () => resetLatePenaltyData()
    }, [resetLatePenaltyData])

    const deleteLatePenalty = (id) => {
        deleteLatePenaltyAction(id)
    }

    return (
        <Box>
            <PageHeader heading={"Late Penalty"} extra={HasPermission(PERMISSIONS.SHELF_LOCATION_ADD) && <Button size={"sm"} colorScheme={themeColor} onClick={() => setToggleDrawer([])}>Add Penalty</Button>} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
                    <LoadingContainer status={getLatePenaltyStatus}>
                        {allLatePenaltys?.length ?
                            <TableContainer mt={2}>
                                <Table w="100%" size={"sm"} variant={"simple"}>
                                    <Thead>
                                        <Tr bg="gray.100">
                                            <Th>S.No.</Th>
                                            <Th>Days</Th>
                                            <Th>Amount</Th>
                                            {(HasPermission(PERMISSIONS.SHELF_LOCATION_EDIT) || HasPermission(PERMISSIONS.SHELF_LOCATION_DELETE)) ?
                                                <Th>Action</Th>
                                                :
                                                null
                                            }
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {map(allLatePenaltys, (penalty, index) => (
                                            <Tr key={penalty.id}>
                                                <Td>{index + 1}</Td>
                                                <Td>{penalty.days}</Td>
                                                <Td>{penalty.amount}</Td>
                                                {(HasPermission(PERMISSIONS.SHELF_LOCATION_EDIT) || HasPermission(PERMISSIONS.SHELF_LOCATION_DELETE)) ?
                                                    <Td>
                                                        {HasPermission(PERMISSIONS.SHELF_LOCATION_EDIT) &&
                                                            <Tooltip placement="top" label="Edit">
                                                                <IconButton mr={3} size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={themeColor} onClick={() => setToggleDrawer(penalty)} />
                                                            </Tooltip>
                                                        }
                                                        {HasPermission(PERMISSIONS.SHELF_LOCATION_DELETE) &&
                                                            <DeleteButton
                                                                description={"Are you sure? Do you want to delete?"}
                                                                confirm={() => deleteLatePenalty(penalty.id)}
                                                                status={deleteLatePenaltyStatus}
                                                                reset={resetLatePenaltyStatus}
                                                            />
                                                        }
                                                    </Td>
                                                    :
                                                    null
                                                }
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            :
                            <NoData title={"No Shelf Location Found"} />
                        }
                    </LoadingContainer>
                </Box>
                {toggleDrawer && <AddLatePenalty data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} themeColor={themeColor} />}
            </Box>
        </Box>
    )
}