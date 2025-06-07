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
import { map, orderBy } from "lodash";
import React, { useEffect, useState } from "react";
import { AddClass } from "./AddClass";
import { useClassSetupStore } from "@/store/classSetup";
import { STATUS } from "@/constant";
import { DeleteButton } from "@/common/DeleteButton";
import { LoadingContainer } from "@/common/LoadingContainer";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { NoData } from "@/common/NoData";

export const ClassList = ({ themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const {
    getClassAction,
    getClassStatus,
    allClasses,
    deleteClassAction,
    deleteClassStatus,
    resetStatus,
  } = useClassSetupStore((s) => ({
    getClassAction: s.getClassAction,
    getClassStatus: s.getClassStatus,
    allClasses: s.allClasses,
    deleteClassAction: s.deleteClassAction,
    deleteClassStatus: s.deleteClassStatus,
    resetStatus: s.resetStatus,
  }));

  useEffect(() => {
    if ((getClassStatus || 1) === STATUS.NOT_STARTED) {
      getClassAction();
    }
  }, [getClassAction, getClassStatus]);

  const deleteClass = (id) => {
    deleteClassAction(id);
  };

  return (
    <Box pos={"relative"} h={"70vh"}>
      <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
        <LoadingContainer status={getClassStatus}>
          {allClasses?.length ? (
            <Box
              p={4}
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
              borderColor="gray.300"
            >
              <TableContainer mt={2}>
                <Table w="100%" size="md" variant="simple" colorScheme="blue">
                  <Thead>
                    <Tr>
                      <Th textAlign="center">S.No.</Th>
                      <Th textAlign="center">Class</Th>
                      <Th textAlign="center">Order</Th>
                      {(HasPermission(PERMISSIONS.CLASS_EDIT) ||
                        HasPermission(PERMISSIONS.CLASS_DELETE)) && (
                        <Th textAlign="center">Action</Th>
                      )}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(orderBy(allClasses, "orderNo", "asc"), (c, index) => (
                      <Tr key={c.id}>
                        <Td textAlign="center">{index + 1}</Td>
                        <Td textAlign="center">{c.name}</Td>
                        <Td textAlign="center">{c.orderNo}</Td>
                        {(HasPermission(PERMISSIONS.CLASS_EDIT) ||
                          HasPermission(PERMISSIONS.CLASS_DELETE)) && (
                          <Td textAlign="center">
                            <Flex justify="center" gap={3}>
                              {HasPermission(PERMISSIONS.CLASS_EDIT) && (
                                <Tooltip label="Edit">
                                  <IconButton
                                    size="xs"
                                    icon={<EditIcon />}
                                    colorScheme="blue"
                                    onClick={() => setToggleDrawer(c)}
                                  />
                                </Tooltip>
                              )}
                              {HasPermission(PERMISSIONS.CLASS_DELETE) && (
                                <DeleteButton
                                  size={"xs"}
                                  description="Are you sure? Do you want to delete?"
                                  confirm={() => deleteClass(c.id)}
                                  status={deleteClassStatus}
                                  reset={resetStatus}
                                  buttonProps={{
                                    size: "sm",
                                    colorScheme: "red",
                                  }}
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
          ) : (
            <NoData title={"No Class Found"} />
          )}
        </LoadingContainer>
      </Box>
      {HasPermission(PERMISSIONS.CLASS_ADD) && (
        <Tooltip placement="top" label={"Add New Class"}>
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
        <AddClass
          themeColor={themeColor}
          classData={toggleDrawer}
          closeDrawer={() => setToggleDrawer(null)}
        />
      )}
    </Box>
  );
};
