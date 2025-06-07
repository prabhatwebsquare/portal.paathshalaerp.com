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
import { STATUS } from "@/constant";
import { DeleteButton } from "@/common/DeleteButton";
import { LoadingContainer } from "@/common/LoadingContainer";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { PageHeader } from "@/common/PageHeader";
import { AddDesignation } from "./AddDesignation";

export const Designation = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const {
    getdesignationSuperAdminAction,
    getdesignationSuperAdminStatus,
    alldesignationsSuperAdmin,
    deletedesignationSuperAdminAction,
    deletedesignationSuperAdminStatus,
    resetdesignationSuperAdminStatus,
  } = useAdditionalSetupStore((s) => ({
    getdesignationSuperAdminAction: s.getdesignationSuperAdminAction,
    getdesignationSuperAdminStatus: s.getdesignationSuperAdminStatus,
    alldesignationsSuperAdmin: s.alldesignationsSuperAdmin,
    deletedesignationSuperAdminAction: s.deletedesignationSuperAdminAction,
    deletedesignationSuperAdminStatus: s.deletedesignationSuperAdminStatus,
    resetdesignationSuperAdminStatus: s.resetdesignationSuperAdminStatus,
  }));

  useEffect(() => {
    if ((getdesignationSuperAdminStatus || 1) === STATUS.NOT_STARTED) {
      getdesignationSuperAdminAction();
    }
  }, [getdesignationSuperAdminAction, getdesignationSuperAdminStatus]);

  const deletedesignation = (id) => {
    deletedesignationSuperAdminAction(id);
  };

  return (
    <Box pos={"relative"} h={"70vh"}>
      <PageHeader title="Designation" />
      <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
        <LoadingContainer status={getdesignationSuperAdminStatus}>
          {alldesignationsSuperAdmin?.length ? (
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
                      <Th textAlign="center" w="80px">
                        S.No.
                      </Th>
                      <Th textAlign="center">designation</Th>
                      {/* {(HasPermission(PERMISSIONS.STAFF_MAIN) ||
                        HasPermission(PERMISSIONS.STAFF_MAIN)) && ( */}
                        <Th textAlign="center" w="20%">
                          Action
                        </Th>
                      {/* )} */}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(alldesignationsSuperAdmin, (designation, index) => (
                      <Tr key={designation.id}>
                        <Td textAlign="center">{index + 1}</Td>
                        <Td textAlign="center">{designation?.name}</Td>
                        {/* {(HasPermission(PERMISSIONS.STAFF_MAIN) ||
                          HasPermission(PERMISSIONS.STAFF_MAIN)) && ( */}
                          <Td textAlign="center">
                            <Flex justify="center" gap={3}>
                              {/* {HasPermission(PERMISSIONS.STAFF_MAIN) && ( */}
                                <Tooltip label="Edit">
                                  <IconButton
                                    size="xs"
                                    icon={<EditIcon />}
                                    colorScheme="blue"
                                    onClick={() => setToggleDrawer(designation)}
                                  />
                                </Tooltip>
                              {/* )} */}
                              {/* {HasPermission(
                                PERMISSIONS.STAFF_MAIN
                              ) && ( */}
                                <DeleteButton
                                  description="Are you sure? Do you want to delete?"
                                  confirm={() =>
                                    deletedesignation(designation.id)
                                  }
                                  status={deletedesignationSuperAdminStatus}
                                  reset={resetdesignationSuperAdminStatus}
                                  buttonProps={{
                                    size: "sm",
                                    colorScheme: "red",
                                  }}
                                />
                              {/* )} */}
                            </Flex>
                          </Td>
                        {/* )} */}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <NoData title={"No Designation Found"} />
          )}
        </LoadingContainer>
      </Box>
      {/* {HasPermission(PERMISSIONS.STAFF_MAIN) && ( */}
        <Tooltip placement="top" label={"Add New designation"}>
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
      {/* )} */}
      {toggleDrawer && (
        <AddDesignation
          data={toggleDrawer}
          themeColor={themeColor}
          closeDrawer={() => setToggleDrawer(null)}
        />
      )}
    </Box>
  );
};
