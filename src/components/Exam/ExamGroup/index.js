import { DeleteButton } from "@/common/DeleteButton";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useExamStore } from "@/store/Exam";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Tab,
  TabList,
  Table,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { compact, map, orderBy } from "lodash";
import React, { useEffect, useState } from "react";
import { AddExam, AddExamGroup } from "./AddNewGroup";
import { PageHeader } from "@/common/PageHeader";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const ExamGroup = ({ themeColor, sessionMasterId }) => {
  const [toggleAddGroup, setToggleAddGroup] = useState(null);
  const { getExamAction, getExamStatus, allExams } = useExamStore((s) => ({
    getExamAction: s.getExamAction,
    getExamStatus: s.getExamStatus,
    allExams: s.allExams,
  }));
  const {
    getExamGroupAction,
    getExamGroupStatus,
    allExamGroups,
    deleteExamGroupAction,
    deleteExamGroupStatus,
    resetGroupStatus,
  } = useExamStore((s) => ({
    getExamGroupAction: s.getExamGroupAction,
    getExamGroupStatus: s.getExamGroupStatus,
    allExamGroups: s.allExamGroups,
    deleteExamGroupAction: s.deleteExamGroupAction,
    deleteExamGroupStatus: s.deleteExamGroupStatus,
    resetGroupStatus: s.resetGroupStatus,
  }));

  useEffect(() => {
    getExamAction({ type: "exam" });
  }, [getExamAction]);

  useEffect(() => {
    if ((getExamGroupStatus || 1) === STATUS.NOT_STARTED) {
      getExamGroupAction();
    }
  }, [getExamGroupAction, getExamGroupStatus]);

  const deleteExamGroup = (id) => {
    deleteExamGroupAction(id);
  };
  return (
    <Box pos={"relative"} h={"60vh"}>
      <PageHeader
        heading={"Exam Group"}
        extra={
          HasPermission(PERMISSIONS.EXAM_GROUP_ADD) && (
            <Button
              size={"sm"}
              colorScheme={themeColor}
              onClick={() => setToggleAddGroup({})}
            >
              Add Group
            </Button>
          )
        }
      />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getExamGroupStatus}>
            {allExamGroups?.length ? (
              <TableContainer mt={2}>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>S.No.</Th>
                      <Th>Group</Th>
                      <Th>Exams</Th>
                      {HasPermission(PERMISSIONS.EXAM_GROUP_EDIT) ||
                      HasPermission(PERMISSIONS.EXAM_GROUP_DELETE) ? (
                        <Th>Action</Th>
                      ) : null}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(allExamGroups, (group, index) => (
                      <Tr key={group.id}>
                        <Td>{index + 1}</Td>
                        <Td>{group.name}</Td>
                        <Td>
                          {compact(
                            map(
                              group.exam_arrays,
                              (e) => e.exam_master.name
                            ).join(", ")
                          )}
                        </Td>
                        {HasPermission(PERMISSIONS.EXAM_GROUP_EDIT) ||
                        HasPermission(PERMISSIONS.EXAM_GROUP_DELETE) ? (
                          <Td>
                            {HasPermission(PERMISSIONS.EXAM_GROUP_EDIT) && (
                              <Tooltip placement="top" label="Edit">
                                <IconButton
                                  mr={3}
                                  size={"sm"}
                                  variant={"ghost"}
                                  icon={<EditIcon />}
                                  colorScheme={themeColor}
                                  onClick={() => setToggleAddGroup(group)}
                                />
                              </Tooltip>
                            )}
                            {HasPermission(PERMISSIONS.EXAM_GROUP_DELETE) && (
                              <DeleteButton
                                description={
                                  "Are you sure? Do you want to delete?"
                                }
                                confirm={() => deleteExamGroup(group.id)}
                                status={deleteExamGroupStatus}
                                reset={resetGroupStatus}
                              />
                            )}
                          </Td>
                        ) : null}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Exam Found"} />
            )}
          </LoadingContainer>
          {toggleAddGroup && (
            <AddExamGroup
              allExams={allExams}
              allExamGroups={allExamGroups}
              data={toggleAddGroup}
              closeDrawer={() => setToggleAddGroup(null)}
              themeColor={themeColor}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
