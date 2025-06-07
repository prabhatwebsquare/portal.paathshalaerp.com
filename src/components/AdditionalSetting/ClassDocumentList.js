import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { STATUS } from "@/constant";
import { DeleteButton } from "@/common/DeleteButton";
import { AddBank } from "./AddBank";
import { LoadingContainer } from "@/common/LoadingContainer";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { NoData } from "@/common/NoData";
import { AddClassDocument } from "./AddClassDocument";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const ClassDocumentList = ({ themeColor }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    const { getClassDocumentAction, getClassDocumentStatus, allClassDocuments, deleteClassDocumentAction, deleteClassDocumentStatus, resetClassDocumentStatus } = useAdditionalSetupStore(s => ({
        getClassDocumentAction: s.getClassDocumentAction,
        getClassDocumentStatus: s.getClassDocumentStatus,
        allClassDocuments: s.allClassDocuments,
        deleteClassDocumentAction: s.deleteClassDocumentAction,
        deleteClassDocumentStatus: s.deleteClassDocumentStatus,
        resetClassDocumentStatus: s.resetClassDocumentStatus
    }))

    useEffect(() => {
        if ((getClassDocumentStatus || 1) === STATUS.NOT_STARTED) {
            getClassDocumentAction()
        }
    }, [getClassDocumentAction, getClassDocumentStatus])

    const deleteClassDocument = (id) => {
        deleteClassDocumentAction(id)
    }

    return (
        <Box pos={"relative"} h={"70vh"}>
            <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                <LoadingContainer status={getClassDocumentStatus}>
                    {allClassDocuments?.length ?
                        <TableContainer mt={2}>
                            <Table w="100%" size={"sm"} variant={"simple"}>
                                <Thead>
                                    <Tr bg="gray.100">
                                        <Th>S.No.</Th>
                                        <Th>Class</Th>
                                        <Th>Documents</Th>
                                        <Th>Action</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {map(allClassDocuments, (docs, index) => (
                                        <Tr key={docs.id}>
                                            <Td>{index + 1}</Td>
                                            <Td>{docs.name}</Td>
                                            <Td>{ }</Td>
                                            <Td>
                                                {HasPermission(PERMISSIONS.MASTER_EDIT) &&
                                                    <Tooltip placement="top" label="Edit">
                                                        <IconButton mr={3} size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={"blue"} onClick={() => setToggleDrawer(docs)} />
                                                    </Tooltip>
                                                }
                                                {HasPermission(PERMISSIONS.MASTER_DELETE) &&
                                                    <DeleteButton
                                                        description={"Are you sure? Do you want to delete?"}
                                                        confirm={() => deleteClassDocument(docs.id)}
                                                        status={deleteClassDocumentStatus}
                                                        reset={resetClassDocumentStatus}
                                                    />
                                                }
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        :
                        <NoData title={"No Class Document Found"} />
                    }
                </LoadingContainer>
            </Box>
            {/* {HasPermission(PERMISSIONS.MASTER_ADD) && */}
            <Tooltip placement="top" label={"Add Class Document"}>
                <Flex pos={"absolute"} bottom={10} right={10}
                    w={"50px"} h={"50px"}
                    bg={`${themeColor}.500`}
                    justify={"center"}
                    align={"center"}
                    borderRadius={"50%"}
                    color={"white"}
                    onClick={() => setToggleDrawer([])}
                >
                    <AddIcon />
                </Flex>
            </Tooltip>
            {/* } */}
            {toggleDrawer && <AddClassDocument data={toggleDrawer} themeColor={themeColor} closeDrawer={() => setToggleDrawer(null)} />}
        </Box>
    )
}