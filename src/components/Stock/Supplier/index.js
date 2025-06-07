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
import { AddSupplier, AddVendor } from "./AddSupplier";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const Supplier = ({ themeColor }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)

    const deleteVendor = (id) => {
    }

    return (
        <Box h={"100%"}>
            <PageHeader heading={"Supplier"} extra={<Button size={"sm"} colorScheme={themeColor} leftIcon={<AddIcon />} onClick={() => setToggleDrawer([])}>Add Supplier</Button>} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <TableContainer mt={2}>
                        <Table w="100%" size={"sm"} variant={"simple"}>
                            <Thead>
                                <Tr bg="gray.100">
                                    <Th>S. No.</Th>
                                    <Th>Supplier Name</Th>
                                    <Th>Contact</Th>
                                    <Th>Email</Th>
                                    <Th>PAN</Th>
                                    <Th>GST</Th>
                                    <Th>Address</Th>
                                    {/* {(HasPermission(PERMISSIONS.BOOK_VENDOR_EDIT) || HasPermission(PERMISSIONS.BOOK_VENDOR_DELETE)) ? */}
                                    <Th>Action</Th>
                                    {/* :
                                        null
                                    } */}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {map(new Array(5), (vendor, index) => (
                                    <Tr>
                                        <Td>{index + 1}</Td>
                                        <Td>ABC Pvt. Ltd.</Td>
                                        <Td>9876543210</Td>
                                        <Td>abc@gmail.com</Td>
                                        <Td>94615156dgdg565</Td>
                                        <Td>86sdflsd77458s</Td>
                                        <Td>address</Td>
                                        {/* {(HasPermission(PERMISSIONS.BOOK_VENDOR_EDIT) || HasPermission(PERMISSIONS.BOOK_VENDOR_DELETE)) ? */}
                                        <Td>
                                            {/* {HasPermission(PERMISSIONS.BOOK_VENDOR_EDIT) && */}
                                            <Tooltip placement="top" label="Edit">
                                                <IconButton size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={"blue"} onClick={() => setToggleDrawer([])} />
                                            </Tooltip>
                                            {/* } */}
                                            {/* {HasPermission(PERMISSIONS.BOOK_VENDOR_DELETE) && */}
                                            <DeleteButton
                                                description={"Are you sure? Do you want to delete?"}
                                                confirm={() => deleteVendor(vendor?.id)}
                                            />
                                            {/* } */}
                                        </Td>
                                        {/* :
                                            null
                                        } */}
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
                {toggleDrawer && <AddSupplier data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} themeColor={themeColor} />}
            </Box>
        </Box >
    )
}