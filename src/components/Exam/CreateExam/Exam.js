import { DeleteButton } from "@/common/DeleteButton";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useExamStore } from "@/store/Exam";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Tab, TabList, Table, TableContainer, Tabs, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map, orderBy } from "lodash";
import React, { useEffect, useState } from "react";
import { AddExam } from "./AddNewExam";
import { PageHeader } from "@/common/PageHeader";
import { HasPermission } from "@/common/HasPermission";
import { NoData } from "@/common/NoData";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const Exam = ({ themeColor }) => {
    const [toggleDrawer, setToggleDrawer] = useState(null)
    const { getExamAction, getExamStatus, allExams, deleteExamAction, deleteExamStatus, resetStatus } = useExamStore(s => ({
        getExamAction: s.getExamAction,
        getExamStatus: s.getExamStatus,
        allExams: s.allExams,
        deleteExamAction: s.deleteExamAction,
        deleteExamStatus: s.deleteExamStatus,
        resetStatus: s.resetStatus
    }))

    useEffect(() => {
        getExamAction({ type: "exam" })
    }, [getExamAction])

    const deleteExam = (id) => {
        deleteExamAction(id)
    }
    return (
        <Box pos={"relative"} h={"60vh"}>
            <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
                <LoadingContainer status={getExamStatus}>
                    {allExams?.length ?
                        <TableContainer mt={2}>
                            <Table w="100%" size={"sm"} variant={"simple"}>
                                <Thead>
                                    <Tr bg="gray.100">
                                        <Th>S.No.</Th>
                                        <Th>Exam</Th>
                                        <Th>Order</Th>
                                        {(HasPermission(PERMISSIONS.CREATE_EXAM_EDIT) || HasPermission(PERMISSIONS.CREATE_EXAM_DELETE)) ?
                                            <Th>Action</Th>
                                            :
                                            null
                                        }
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {map(orderBy(allExams, "orderNo", "asc"), (exam, index) => (
                                        <Tr key={exam.id}>
                                            <Td>{index + 1}</Td>
                                            <Td>{exam.name}</Td>
                                            <Td>{exam.orderNo}</Td>
                                            {(HasPermission(PERMISSIONS.CREATE_EXAM_EDIT) || HasPermission(PERMISSIONS.CREATE_EXAM_DELETE)) ?
                                                <Td>
                                                    {HasPermission(PERMISSIONS.CREATE_EXAM_EDIT) &&
                                                        <Tooltip placement="top" label="Edit">
                                                            <IconButton mr={3} size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={themeColor} onClick={() => setToggleDrawer(exam)} />
                                                        </Tooltip>
                                                    }
                                                    {HasPermission(PERMISSIONS.CREATE_EXAM_DELETE) &&
                                                        <DeleteButton
                                                            description={"Are you sure? Do you want to delete?"}
                                                            confirm={() => deleteExam(exam.id)}
                                                            status={deleteExamStatus}
                                                            reset={resetStatus}
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
                        <NoData title={"No Exam Found"} />
                    }
                </LoadingContainer>
                {HasPermission(PERMISSIONS.CREATE_EXAM_ADD) &&
                    <Tooltip placement="top" label={"Assign Marks"}>
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
                {toggleDrawer && <AddExam type={"exam"} data={toggleDrawer} closeDrawer={() => setToggleDrawer(null)} />}
            </Box>
        </Box>
    )
}