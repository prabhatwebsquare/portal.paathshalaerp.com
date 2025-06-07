import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import dayjs from "dayjs";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { STATUS } from "@/constant";
import { useAccountStore } from "@/store/Account";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { DeleteButton } from "@/common/DeleteButton";
import { useLibraryStore } from "@/store/Library";
import { AddVendor } from "./AddVendor";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const BookVendor = ({ themeColor }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)

    const { getVendorAction, getVendorStatus, allVendors, resetVendorData, deleteVendorAction, deleteVendorStatus, resetVendorStatus } = useLibraryStore(s => ({
        getVendorAction: s.getVendorAction,
        getVendorStatus: s.getVendorStatus,
        allVendors: s.allVendors,
        resetVendorData: s.resetVendorData,
        deleteVendorAction: s.deleteVendorAction,
        deleteVendorStatus: s.deleteVendorStatus,
        resetVendorStatus: s.resetVendorStatus
    }))

    useEffect(() => {
        if ((getVendorStatus || 1) === STATUS.NOT_STARTED) {
            getVendorAction()
        }
    }, [getVendorAction, getVendorStatus])

    useEffect(() => {
        return () => resetVendorData()
    }, [resetVendorData])

    const deleteVendor = (id) => {
        deleteVendorAction(id)
    }

    return (
        <Box h={"100%"}>
            <PageHeader heading={"Book Vendor"} extra={HasPermission(PERMISSIONS.BOOK_VENDOR_ADD) && <Button size={"sm"} colorScheme={themeColor} leftIcon={<AddIcon />} onClick={() => setToggleDrawer([])}>Add Vendor</Button>} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <LoadingContainer status={getVendorStatus}>
                        {allVendors?.length ?
                            <TableContainer mt={2}>
                                <Table w="100%" size={"sm"} variant={"simple"}>
                                    <Thead>
                                        <Tr bg="gray.100">
                                            <Th>S. No.</Th>
                                            <Th>Ledger Name</Th>
                                            <Th>Contact</Th>
                                            <Th>Email</Th>
                                            <Th>PAN</Th>
                                            <Th>GST</Th>
                                            <Th>Address</Th>
                                            {(HasPermission(PERMISSIONS.BOOK_VENDOR_EDIT) || HasPermission(PERMISSIONS.BOOK_VENDOR_DELETE)) ?
                                                <Th>Action</Th>
                                                :
                                                null
                                            }
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {map(allVendors, (vendor, index) => (
                                            <Tr>
                                                <Td>{index + 1}</Td>
                                                <Td>{vendor.name}</Td>
                                                <Td>{vendor.contact}</Td>
                                                <Td>{vendor.email}</Td>
                                                <Td>{vendor.pan}</Td>
                                                <Td>{vendor.gst}</Td>
                                                <Td>{vendor.address}</Td>
                                                {(HasPermission(PERMISSIONS.BOOK_VENDOR_EDIT) || HasPermission(PERMISSIONS.BOOK_VENDOR_DELETE)) ?
                                                    <Td>
                                                        {HasPermission(PERMISSIONS.BOOK_VENDOR_EDIT) &&
                                                            <Tooltip placement="top" label="Edit">
                                                                <IconButton size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={"blue"} onClick={() => setToggleDrawer(vendor)} />
                                                            </Tooltip>
                                                        }
                                                        {HasPermission(PERMISSIONS.BOOK_VENDOR_DELETE) &&
                                                            <DeleteButton
                                                                description={"Are you sure? Do you want to delete?"}
                                                                confirm={() => deleteVendor(vendor.id)}
                                                                status={deleteVendorStatus}
                                                                reset={resetVendorStatus}
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
                            <NoData title={"No Book Vendor Found"} />
                        }
                    </LoadingContainer>
                </Box>
                {toggleDrawer && <AddVendor data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} themeColor={themeColor} />}
            </Box>
        </Box>
    )
}