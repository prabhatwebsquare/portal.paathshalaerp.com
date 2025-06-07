import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Box, Flex, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react"
import { groupBy, map, orderBy } from "lodash"
import React, { useEffect, useMemo, useState } from "react"
import { AddFeesName } from "./AddFeesName"
import { AddAssignFees } from "./AddAssignFees"
import { LoadingContainer } from "@/common/LoadingContainer"
import { useFeesSetupStore } from "@/store/feesSetup"
import { DeleteButton } from "@/common/DeleteButton"
import { STATUS } from "@/constant"
import dayjs from "dayjs"
import { MdCurrencyRupee, MdPercent } from "react-icons/md"
import { HasPermission } from "@/common/HasPermission"
import { PERMISSIONS } from "@/constant/PermissionConstant"
import { NoData } from "@/common/NoData"

export const AssignFees = ({ themeColor, sessionMasterId }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    const { getAssignFeesAction, getAssignFeesStatus, allAssignFees, deleteAssignFeesAction, deleteAssignFeesStatus, resetAssignFeesStatus, resetGetAssignFees } = useFeesSetupStore(s => ({
        getAssignFeesAction: s.getAssignFeesAction,
        getAssignFeesStatus: s.getAssignFeesStatus,
        allAssignFees: s.allAssignFees,
        deleteAssignFeesAction: s.deleteAssignFeesAction,
        deleteAssignFeesStatus: s.deleteAssignFeesStatus,
        resetAssignFeesStatus: s.resetAssignFeesStatus,
        resetGetAssignFees: s.resetGetAssignFees
    }))

    useEffect(() => {
        if ((getAssignFeesStatus || 1) === STATUS.NOT_STARTED) {
            getAssignFeesAction({ sessionMasterId })
        }
    }, [getAssignFeesAction, getAssignFeesStatus, sessionMasterId])

    useEffect(() => {
        return () => resetGetAssignFees()
    }, [resetGetAssignFees])

    const deleteAssignFees = (id) => {
        deleteAssignFeesAction(id)
    }

    const classes = useMemo(() => {
        return groupBy(allAssignFees, "classMasterId")
    }, [allAssignFees])

    return (
        <Box pos={"relative"} h={"70vh"}>
            <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                <LoadingContainer status={getAssignFeesStatus}>
                    {allAssignFees?.length ?
                       <Box p={4} bg="white" borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor="gray.300">
                       <TableContainer mt={2}>
                         <Table w="100%" size="md" variant="simple" colorScheme="blue">
                           <Thead>
                             <Tr>
                               <Th textAlign="center">Class</Th>
                               <Th textAlign="center">Stream</Th>
                               <Th textAlign="center">Fees Name</Th>
                               <Th textAlign="center">Fees Amount</Th>
                               <Th textAlign="center">Due Date</Th>
                               <Th textAlign="center">Late Fees</Th>
                               {(HasPermission(PERMISSIONS.ASSIGN_FEES_EDIT) ||
                                 HasPermission(PERMISSIONS.ASSIGN_FEES_DELETE)) && (
                                 <Th textAlign="center" w="10%">Action</Th>
                               )}
                             </Tr>
                           </Thead>
                           <Tbody>
                             {map(classes, (classGroup, index) =>
                               Object.entries(groupBy(classGroup, "streamMasterId")).map(([streamId, stream], i) => (
                                 <React.Fragment key={index}>
                                   {map(stream, (fee, feeIndex) => (
                                     <Tr key={`${index}-${feeIndex}`}>
                                       {i === 0 && feeIndex === 0 && (
                                         <Td rowSpan={classGroup?.length} textAlign="center" fontWeight="bold">
                                           {fee.class_master.name}
                                         </Td>
                                       )}
                                       {feeIndex === 0 && (
                                         <Td rowSpan={stream?.length} textAlign="center" fontWeight="bold">
                                           {fee.stream_master.name}
                                         </Td>
                                       )}
                                       <Td textAlign="center" fontWeight="bold">{fee.fees_name_master?.name}</Td>
                                       <Td textAlign="center">
                                         <Flex align="center" justify="center" fontWeight="bold">
                                           <MdCurrencyRupee /> {fee.feeAmount}
                                         </Flex>
                                       </Td>
                                       <Td textAlign="center">{dayjs(fee.dueDate).format("DD-MM-YYYY")}</Td>
                                       <Td textAlign="center">
                                         <Flex align="center" justify="center">
                                           {fee.lateFees}
                                           {fee.isPercent ? <MdPercent /> : <MdCurrencyRupee />} / {fee.isDaily ? "Day" : "Month"}
                                         </Flex>
                                       </Td>
                                       {(HasPermission(PERMISSIONS.ASSIGN_FEES_EDIT) ||
                                         HasPermission(PERMISSIONS.ASSIGN_FEES_DELETE)) && (
                                         <Td textAlign="center">
                                           <Flex justify="center" gap={3}>
                                             {HasPermission(PERMISSIONS.ASSIGN_FEES_EDIT) && (
                                               <Tooltip label="Edit">
                                                 <IconButton
                                                   size="xs"
                                                   icon={<EditIcon />}
                                                   colorScheme="blue"
                                                   onClick={() => setToggleDrawer(fee)}
                                                 />
                                               </Tooltip>
                                             )}
                                             {HasPermission(PERMISSIONS.ASSIGN_FEES_DELETE) && (
                                               <DeleteButton
                                                 size="xs"
                                                 description="Are you sure? Do you want to delete?"
                                                 confirm={() => deleteAssignFees(fee.id)}
                                                 status={deleteAssignFeesStatus}
                                                 reset={resetAssignFeesStatus}
                                                 buttonProps={{ size: "sm", colorScheme: "red" }}
                                               />
                                             )}
                                           </Flex>
                                         </Td>
                                       )}
                                     </Tr>
                                   ))}
                                 </React.Fragment>
                               ))
                             )}
                           </Tbody>
                         </Table>
                       </TableContainer>
                     </Box>
                     
                        :
                        <NoData title={"No Assign Fees Found"} />
                    }
                </LoadingContainer>
            </Box>
            {HasPermission(PERMISSIONS.ASSIGN_FEES_ADD) &&
                <Tooltip placement="top" label={"Assign Fees"}>
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
            {toggleDrawer && <AddAssignFees data={toggleDrawer} allAssignFees={allAssignFees} themeColor={themeColor} sessionMasterId={sessionMasterId} closeDrawer={() => setToggleDrawer(null)} />}
        </Box>
    )
}