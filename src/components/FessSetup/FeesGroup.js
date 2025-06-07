import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { STATUS } from "@/constant";
import { DeleteButton } from "@/common/DeleteButton";
import { AddFeesGroup } from "./AddFeesGroup";
import { useFeesSetupStore } from "@/store/feesSetup";
import { LoadingContainer } from "@/common/LoadingContainer";

export const FeesGroup = ({ themeColor }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    const { getFeesGroupAction, getFeesGroupStatus, allFeesGroups, deleteFeesGroupAction, deleteFeesGroupStatus, resetFeesGroupStatus } = useFeesSetupStore(s => ({
        getFeesGroupAction: s.getFeesGroupAction,
        getFeesGroupStatus: s.getFeesGroupStatus,
        allFeesGroups: s.allFeesGroups,
        deleteFeesGroupAction: s.deleteFeesGroupAction,
        deleteFeesGroupStatus: s.deleteFeesGroupStatus,
        resetFeesGroupStatus: s.resetFeesGroupStatus
    }))

    useEffect(() => {
        if ((getFeesGroupStatus || 1) === STATUS.NOT_STARTED) {
            getFeesGroupAction()
        }
    }, [getFeesGroupAction, getFeesGroupStatus])

    const deleteFeesGroup = (id) => {
        deleteFeesGroupAction(id)
    }

    return (
        <Box pos={"relative"} h={"70vh"}>
            <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                <LoadingContainer status={getFeesGroupStatus}>
                    <TableContainer mt={2}>
                        <Table w="100%" size={"sm"} variant={"simple"}>
                            <Thead>
                                <Tr bg="gray.100">
                                    <Th>S.No.</Th>
                                    <Th>Fees Group</Th>
                                    <Th>Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {map(allFeesGroups, (group, index) => (
                                    <Tr key={group.id}>
                                        <Td>{index + 1}</Td>
                                        <Td>{group.name}</Td>
                                        <Td>
                                            <Tooltip placement="top" label="Edit">
                                                <IconButton mr={3} size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={"blue"} onClick={() => setToggleDrawer(group)} />
                                            </Tooltip>
                                            <DeleteButton
                                                description={"Are you sure? Do you want to delete?"}
                                                confirm={() => deleteFeesGroup(group.id)}
                                                status={deleteFeesGroupStatus}
                                                reset={resetFeesGroupStatus}
                                            />
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </LoadingContainer>
            </Box>
            <Tooltip placement="top" label={"Add New Fees Group"}>
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
            {toggleDrawer && <AddFeesGroup data={toggleDrawer} themeColor={themeColor} closeDrawer={() => setToggleDrawer(null)} />}
        </Box>
    )
}