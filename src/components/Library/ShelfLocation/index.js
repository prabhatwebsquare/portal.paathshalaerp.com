import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { LoadingContainer } from "@/common/LoadingContainer";
import { DeleteButton } from "@/common/DeleteButton";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { AddShelfLocation } from "./AddShelfLocation";
import { useLibraryStore } from "@/store/Library";
import Barcode from "react-barcode";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const ShelfLocation = ({ themeColor, sessionMasterId }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)

    const { getShelfLocationAction, getShelfLocationStatus, allShelfLocations, deleteShelfLocationAction, deleteShelfLocationStatus, resetShelfLocationStatus } = useLibraryStore(s => ({
        getShelfLocationAction: s.getShelfLocationAction,
        getShelfLocationStatus: s.getShelfLocationStatus,
        allShelfLocations: s.allShelfLocations,
        deleteShelfLocationAction: s.deleteShelfLocationAction,
        deleteShelfLocationStatus: s.deleteShelfLocationStatus,
        resetShelfLocationStatus: s.resetShelfLocationStatus
    }))

    useEffect(() => {
        if ((getShelfLocationStatus || 1) === STATUS.NOT_STARTED) {
            getShelfLocationAction()
        }
    }, [getShelfLocationAction, getShelfLocationStatus])

    const deleteShelfLocation = (id) => {
        deleteShelfLocationAction(id)
    }

    return (
        <Box>
            <PageHeader heading={"Shelf Location"} extra={HasPermission(PERMISSIONS.SHELF_LOCATION_ADD) && <Button size={"sm"} colorScheme={themeColor} onClick={() => setToggleDrawer([])}>Add Shelf Location</Button>} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
                    <LoadingContainer status={getShelfLocationStatus}>
                        {allShelfLocations?.length ?
                            <TableContainer mt={2}>
                                <Table w="100%" size={"sm"} variant={"simple"}>
                                    <Thead>
                                        <Tr bg="gray.100">
                                            <Th>S.No.</Th>
                                            <Th>Shelf Location</Th>
                                            {(HasPermission(PERMISSIONS.SHELF_LOCATION_EDIT) || HasPermission(PERMISSIONS.SHELF_LOCATION_DELETE)) ?
                                                <Th>Action</Th>
                                                :
                                                null
                                            }
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {map(allShelfLocations, (shelf, index) => (
                                            <Tr key={shelf.id}>
                                                <Td>{index + 1}</Td>
                                                <Td>{shelf.name}</Td>
                                                {(HasPermission(PERMISSIONS.SHELF_LOCATION_EDIT) || HasPermission(PERMISSIONS.SHELF_LOCATION_DELETE)) ?
                                                    <Td>
                                                        {HasPermission(PERMISSIONS.SHELF_LOCATION_EDIT) &&
                                                            <Tooltip placement="top" label="Edit">
                                                                <IconButton mr={3} size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={themeColor} onClick={() => setToggleDrawer(shelf)} />
                                                            </Tooltip>
                                                        }
                                                        {HasPermission(PERMISSIONS.SHELF_LOCATION_DELETE) &&
                                                            <DeleteButton
                                                                description={"Are you sure? Do you want to delete?"}
                                                                confirm={() => deleteShelfLocation(shelf.id)}
                                                                status={deleteShelfLocationStatus}
                                                                reset={resetShelfLocationStatus}
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
                {toggleDrawer && <AddShelfLocation data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} themeColor={themeColor} />}
            </Box>
        </Box>
    )
}