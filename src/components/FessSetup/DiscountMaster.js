import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { useClassSetupStore } from "@/store/classSetup";
import { STATUS } from "@/constant";
import { DeleteButton } from "@/common/DeleteButton";
import { AddDiscountMaster } from "./AddDiscountMaster";
import { useFeesSetupStore } from "@/store/feesSetup";
import { LoadingContainer } from "@/common/LoadingContainer";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { NoData } from "@/common/NoData";

export const DiscountMaster = ({ themeColor }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    const { getDiscountMasterAction, getDiscountMasterStatus, allDiscountMasters, resetGetDiscountMaster, deleteDiscountMasterAction, deleteDiscountMasterStatus, resetDiscountMasterStatus } = useFeesSetupStore(s => ({
        getDiscountMasterAction: s.getDiscountMasterAction,
        getDiscountMasterStatus: s.getDiscountMasterStatus,
        allDiscountMasters: s.allDiscountMasters,
        resetGetDiscountMaster: s.resetGetDiscountMaster,
        deleteDiscountMasterAction: s.deleteDiscountMasterAction,
        deleteDiscountMasterStatus: s.deleteDiscountMasterStatus,
        resetDiscountMasterStatus: s.resetDiscountMasterStatus
    }))

    useEffect(() => {
        if ((getDiscountMasterStatus || 1) === STATUS.NOT_STARTED) {
            getDiscountMasterAction()
        }
    }, [getDiscountMasterAction, getDiscountMasterStatus])

    useEffect(() => {
        return () => resetGetDiscountMaster()
    }, [resetGetDiscountMaster])

    const deleteDiscountMaster = (id) => {
        deleteDiscountMasterAction(id)
    }

    return (
        <Box pos={"relative"} h={"70vh"}>
            <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                <LoadingContainer status={getDiscountMasterStatus}>
                    {allDiscountMasters?.length ?
                       <Box p={4} bg="white" borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor="gray.300">
                       <TableContainer mt={2}>
                         <Table w="100%" size="md" variant="simple" colorScheme="blue">
                           <Thead>
                             <Tr>
                               <Th textAlign="center" w="100px">S.No.</Th>
                               <Th textAlign="center">Name</Th>
                               <Th textAlign="center">Discount Percent</Th>
                               {(HasPermission(PERMISSIONS.DISCOUNT_HEAD_EDIT) || HasPermission(PERMISSIONS.DISCOUNT_HEAD_DELETE)) && (
                                 <Th textAlign="center" w="20%">Action</Th>
                               )}
                             </Tr>
                           </Thead>
                           <Tbody>
                             {map(allDiscountMasters, (fee, index) => (
                               <Tr key={fee.id}>
                                 <Td textAlign="center">{index + 1}</Td>
                                 <Td textAlign="center">{fee.name}</Td>
                                 <Td textAlign="center">{fee.dis_value} %</Td>
                                 {(HasPermission(PERMISSIONS.DISCOUNT_HEAD_EDIT) || HasPermission(PERMISSIONS.DISCOUNT_HEAD_DELETE)) && (
                                   <Td textAlign="center">
                                     <Flex justify="center" gap={3}>
                                       {HasPermission(PERMISSIONS.DISCOUNT_HEAD_EDIT) && (
                                         <Tooltip label="Edit">
                                           <IconButton size="xs" icon={<EditIcon />} colorScheme="blue" onClick={() => setToggleDrawer(fee)} />
                                         </Tooltip>
                                       )}
                                       {HasPermission(PERMISSIONS.DISCOUNT_HEAD_DELETE) && (
                                         <DeleteButton
                                           description="Are you sure? Do you want to delete?"
                                           confirm={() => deleteDiscountMaster(fee.id)}
                                           status={deleteDiscountMasterStatus}
                                           reset={resetDiscountMasterStatus}
                                           buttonProps={{ size: "sm", colorScheme: "red" }}
                                         />
                                       )}
                                     </Flex>
                                   </Td>
                                 )}
                               </Tr>
                             ))}
                           </Tbody>
                         </Table>
                       </TableContainer>
                     </Box>
                     
                        :
                        <NoData title={"No Fee Name Found"} />
                    }
                </LoadingContainer>
            </Box>
            {HasPermission(PERMISSIONS.DISCOUNT_HEAD_ADD) &&
                <Tooltip placement="top" label={"Add New Discount Name"}>
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
            }
            {toggleDrawer && <AddDiscountMaster data={toggleDrawer} themeColor={themeColor} closeDrawer={() => setToggleDrawer(null)} />}
        </Box>
    )
}