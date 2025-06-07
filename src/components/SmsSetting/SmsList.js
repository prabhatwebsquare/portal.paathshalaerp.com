import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Table, TableContainer, Tag, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { STATUS } from "@/constant";
import { DeleteButton } from "@/common/DeleteButton";
import { LoadingContainer } from "@/common/LoadingContainer";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { NoData } from "@/common/NoData";
import { AddSmsSetting } from "./AddSmsSetting";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { GrUpdate } from "react-icons/gr";

export const SmsList = ({ themeColor }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    const [toggleModal, setToggleModal] = useState(null)

    const school = getLocalStorageItem("user")
    // const { getBankAction, getBankStatus, allBanks, deleteBankAction, deleteBankStatus, resetBankStatus } = useAdditionalSetupStore(s => ({
    //     getBankAction: s.getBankAction,
    //     getBankStatus: s.getBankStatus,
    //     allBanks: s.allBanks,
    //     deleteBankAction: s.deleteBankAction,
    //     deleteBankStatus: s.deleteBankStatus,
    //     resetBankStatus: s.resetBankStatus
    // }))

    // useEffect(() => {
    //     if ((getBankStatus || 1) === STATUS.NOT_STARTED) {
    //         getBankAction()
    //     }
    // }, [getBankAction, getBankStatus])

    const deleteBank = (id) => {
        // deleteBankAction(id)
    }

    return (
        <Box pos={"relative"} h={"70vh"}>
            <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                {/* <LoadingContainer status={getBankStatus}> */}
                {/* {allBanks?.length ? */}
                <TableContainer mt={2}>
                    <Table w="100%" size={"sm"} variant={"simple"}>
                        <Thead>
                            <Tr bg="gray.100">
                                <Th>S.No.</Th>
                                <Th>SMS Type</Th>
                                <Th>Message</Th>
                                <Th>Transation Id</Th>
                                <Th>Status</Th>
                                {/* <Th>Action</Th> */}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {map(new Array(4), (bank, index) => (
                                <Tr>
                                    <Td>{index + 1}</Td>
                                    <Td>Admission SMS</Td>
                                    <Td>{`R/P Your Child {#var#} admission has been successfully Admission No.{#var#} (School Name)`}</Td>
                                    <Td>1249812492838</Td>
                                    <Td>
                                        <Tag
                                            colorScheme={"green"}>
                                            Active
                                        </Tag>
                                        <IconButton ml={1} size={"xs"} variant={"ghost"} colorScheme={themeColor} onClick={() => setToggleModal([])} icon={<GrUpdate />} />
                                    </Td>
                                    {/* <Td>
                                        <Tooltip placement="top" label="Edit">
                                            <IconButton mr={3} size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={"blue"} onClick={() => setToggleDrawer(bank)} />
                                        </Tooltip>
                                        <DeleteButton
                                            description={"Are you sure? Do you want to delete?"}
                                        // confirm={() => deleteBank(bank.id)}
                                        // status={deleteBankStatus}
                                        // reset={resetBankStatus}
                                        />
                                    </Td> */}
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                {/* :
                        <NoData title={"No Bank Found"} />
                    } */}
                {/* </LoadingContainer> */}
            </Box>
            <Tooltip placement="top" label={"Add New Bank"}>
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
            {toggleDrawer && <AddSmsSetting data={toggleDrawer} school={school} themeColor={themeColor} closeDrawer={() => setToggleDrawer(null)} />}
        </Box>
    )
}