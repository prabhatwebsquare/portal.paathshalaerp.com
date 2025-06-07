import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { useClassSetupStore } from "@/store/classSetup";
import { STATUS } from "@/constant";
import { DeleteButton } from "@/common/DeleteButton";
import { AddSubject } from "./AddSubject";
import { LoadingContainer } from "@/common/LoadingContainer";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { NoData } from "@/common/NoData";

export const Subject = ({ themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const {
    getSubjectAction,
    getSubjectStatus,
    allSubjects,
    deleteSubjectAction,
    deleteSubjectStatus,
    resetSubjectStatus,
  } = useClassSetupStore((s) => ({
    getSubjectAction: s.getSubjectAction,
    getSubjectStatus: s.getSubjectStatus,
    allSubjects: s.allSubjects,
    deleteSubjectAction: s.deleteSubjectAction,
    deleteSubjectStatus: s.deleteSubjectStatus,
    resetSubjectStatus: s.resetSubjectStatus,
  }));

  useEffect(() => {
    if ((getSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getSubjectAction();
    }
  }, [getSubjectAction, getSubjectStatus]);

  const deleteSubject = (id) => {
    deleteSubjectAction(id);
  };

  return (
    <Box pos={"relative"} h={"70vh"}>
      <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
        <LoadingContainer status={getSubjectStatus}>
          {allSubjects?.length ? (
            <Box
              p={4}
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
              borderColor="gray.300"
            >
              <TableContainer mt={2}>
                <Table w="100%" size="sm" variant="simple">
                  <Thead>
                    <Tr>
                      <Th textAlign="center">S.No.</Th>
                      <Th textAlign="center">Subject</Th>
                      {(HasPermission(PERMISSIONS.SUBJECT_EDIT) ||
                        HasPermission(PERMISSIONS.SUBJECT_DELETE)) && (
                        <Th textAlign="center">Action</Th>
                      )}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(allSubjects, (sub, index) => (
                      <Tr key={sub.id}>
                        <Td textAlign="center">{index + 1}</Td>
                        <Td textAlign="center">{sub.name}</Td>
                        {(HasPermission(PERMISSIONS.SUBJECT_EDIT) ||
                          HasPermission(PERMISSIONS.SUBJECT_DELETE)) && (
                          <Td textAlign="center">
                            {HasPermission(PERMISSIONS.SUBJECT_EDIT) && (
                              <Tooltip placement="top" label="Edit">
                                <IconButton
                                  size="xs"
                                  mr={3}
                                  icon={<EditIcon />}
                                  colorScheme="blue"
                                  onClick={() => setToggleDrawer(sub)}
                                />
                              </Tooltip>
                            )}
                            {HasPermission(PERMISSIONS.SUBJECT_DELETE) && (
                              <DeleteButton
                                description="Are you sure? Do you want to delete?"
                                confirm={() => deleteSubject(sub.id)}
                                status={deleteSubjectStatus}
                                reset={resetSubjectStatus}
                              />
                            )}
                          </Td>
                        )}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <NoData title={"No Subject Found"} />
          )}
        </LoadingContainer>
      </Box>
      {HasPermission(PERMISSIONS.SUBJECT_ADD) && (
        <Tooltip placement="top" label={"Add New Subject"}>
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
        <AddSubject
          data={toggleDrawer}
          closeDrawer={() => setToggleDrawer(null)}
          themeColor={themeColor}
        />
      )}
    </Box>
  );
};
