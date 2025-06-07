import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AddClassSubject } from "./AddClassSubject";
import { useClassSetupStore } from "@/store/classSetup";
import { STATUS } from "@/constant";
import { groupBy, map } from "lodash";
import { LoadingContainer } from "@/common/LoadingContainer";
import { DeleteButton } from "@/common/DeleteButton";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { HasPermission } from "@/common/HasPermission";
import { NoData } from "@/common/NoData";

export const ClassSubject = ({ themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);

  const {
    getClassDetailAction,
    getClassDetailStatus,
    allClassDetails,
    getSubjectAction,
    getSubjectStatus,
    allSubjects,
    resetAllData,
    getClassSubjectAction,
    getClassSubjectStatus,
    allClassSubjects,
    deleteClassSubjectAction,
    deleteClassSubjectStatus,
    resetClassSubjectStatus,
  } = useClassSetupStore((s) => ({
    getClassDetailAction: s.getClassDetailAction,
    getClassDetailStatus: s.getClassDetailStatus,
    allClassDetails: s.allClassDetails,
    getSubjectAction: s.getSubjectAction,
    getSubjectStatus: s.getSubjectStatus,
    allSubjects: s.allSubjects,
    resetAllData: s.resetAllData,
    getClassSubjectAction: s.getClassSubjectAction,
    getClassSubjectStatus: s.getClassSubjectStatus,
    allClassSubjects: s.allClassSubjects,
    deleteClassSubjectAction: s.deleteClassSubjectAction,
    deleteClassSubjectStatus: s.deleteClassSubjectStatus,
    resetClassSubjectStatus: s.resetClassSubjectStatus,
  }));

  useEffect(() => {
    if ((getClassDetailStatus || 1) === STATUS.NOT_STARTED) {
      getClassDetailAction();
    }
    if ((getSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getSubjectAction();
    }
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
  }, [
    getClassDetailAction,
    getClassDetailStatus,
    getClassSubjectAction,
    getClassSubjectStatus,
    getSubjectAction,
    getSubjectStatus,
  ]);

  useEffect(() => {
    return () => resetAllData();
  }, [resetAllData]);

  const reloadData = () => {
    getClassSubjectAction();
  };

  const deleteClass = (id) => {
    deleteClassSubjectAction(id);
  };

  useEffect(() => {
    if (deleteClassSubjectStatus === STATUS.SUCCESS) {
      resetClassSubjectStatus();
    }
  }, [deleteClassSubjectStatus, resetClassSubjectStatus]);

  return (
    <Box pos={"relative"} h={"70vh"}>
      <Box className="scrollBar" maxH={"70vh"} overflowY={"scroll"}>
        <LoadingContainer status={getClassSubjectStatus}>
          {allClassSubjects?.length ? (
                 <Box
                 p={4}
                 bg="white"
                 borderRadius="lg"
                 boxShadow="md"
                 borderWidth="1px"
                 borderColor="gray.300"
               >
            <TableContainer mt={3}>
              <Table w="100%" size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th textAlign="center">Class</Th>
                    <Th textAlign="center">Stream</Th>
                    <Th textAlign="center">Subject</Th>
                    <Th textAlign="center">Subject Type</Th>
                    <Th textAlign="center">Practical</Th>
                    {(HasPermission(PERMISSIONS.CLASS_SUBJECT_EDIT) ||
                      HasPermission(PERMISSIONS.CLASS_SUBJECT_DELETE)) && (
                      <Th textAlign="center">Action</Th>
                    )}
                  </Tr>
                </Thead>
                <Tbody>
                  {map(
                    groupBy(allClassSubjects, "classMasterId"),
                    (classGroup, index) =>
                      map(classGroup, (cs) => {
                        const subLength = cs?.assign_class_subjects?.length;
                        return (
                          <React.Fragment key={index}>
                            {cs?.assign_class_subjects.map((sub, subIndex) => (
                              <Tr key={subIndex}>
                                {subIndex === 0 && (
                                  <>
                                    <Td rowSpan={subLength} textAlign="center">
                                      {cs.class_master.name}
                                    </Td>
                                    <Td rowSpan={subLength} textAlign="center">
                                      {cs.stream_master.name}
                                    </Td>
                                  </>
                                )}
                                <Td textAlign="center">
                                  {sub.subject_master?.name}
                                </Td>
                                <Td textAlign="center">{sub.subjectType}</Td>
                                <Td textAlign="center">
                                  {sub.practical === "1" ? "Yes" : "No"}
                                </Td>
                                {subIndex === 0 &&
                                  (HasPermission(
                                    PERMISSIONS.CLASS_SUBJECT_EDIT
                                  ) ||
                                    HasPermission(
                                      PERMISSIONS.CLASS_SUBJECT_DELETE
                                    )) && (
                                    <Td rowSpan={subLength} textAlign="center">
                                      {HasPermission(
                                        PERMISSIONS.CLASS_SUBJECT_EDIT
                                      ) && (
                                        <Tooltip placement="top" label="Edit">
                                          <IconButton
                                             size="xs"
                                             mr={3}
                                             icon={<EditIcon />}
                                             colorScheme="blue"
                                            onClick={() => setToggleDrawer(cs)}
                                          />
                                        </Tooltip>
                                      )}
                                      {HasPermission(
                                        PERMISSIONS.CLASS_SUBJECT_DELETE
                                      ) && (
                                        <DeleteButton
                                          description="Are you sure? Do you want to delete?"
                                          confirm={() => deleteClass(cs.id)}
                                          status={deleteClassSubjectStatus}
                                          reset={resetClassSubjectStatus}
                                        />
                                      )}
                                    </Td>
                                  )}
                              </Tr>
                            ))}
                          </React.Fragment>
                        );
                      })
                  )}
                </Tbody>
              </Table>
            </TableContainer>
            </Box>
          ) : (
            <NoData title={"No Class Subject Found"} />
          )}
        </LoadingContainer>
      </Box>
      {HasPermission(PERMISSIONS.CLASS_SUBJECT_ADD) && (
        <Tooltip placement="top" label={"Add Class Subject"}>
          <Flex
            pos={"absolute"}
            bottom={10}
            right={10}
            w={"50px"}
            h={"50px"}
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
      )}
      {toggleDrawer && (
        <AddClassSubject
          themeColor={themeColor}
          data={toggleDrawer}
          allClassDetails={allClassDetails}
          allSubjects={allSubjects}
          closeDrawer={() => setToggleDrawer(null)}
          reloadData={reloadData}
        />
      )}
    </Box>
  );
};
