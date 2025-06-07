import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
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
import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { useAccountStore } from "@/store/Account";
import { DeleteButton } from "@/common/DeleteButton";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { AddIncomeType } from "./AddIncomeType";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const IncomeType = ({ themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);

  const {
    getIncomeTypeAction,
    getIncomeTypeStatus,
    allIncomeTypes,
    deleteIncomeTypeAction,
    deleteIncomeTypeStatus,
    resetIncomeTypeStatus,
  } = useAccountStore((s) => ({
    getIncomeTypeAction: s.getIncomeTypeAction,
    getIncomeTypeStatus: s.getIncomeTypeStatus,
    allIncomeTypes: s.allIncomeTypes,
    deleteIncomeTypeAction: s.deleteIncomeTypeAction,
    deleteIncomeTypeStatus: s.deleteIncomeTypeStatus,
    resetIncomeTypeStatus: s.resetIncomeTypeStatus,
  }));

  useEffect(() => {
    if ((getIncomeTypeStatus || 1) === STATUS.NOT_STARTED) {
      getIncomeTypeAction();
    }
  }, [getIncomeTypeAction, getIncomeTypeStatus]);

  const deleteIncomeType = (id) => {
    deleteIncomeTypeAction(id);
  };

  return (
    <Box h={"100%"}>
      <PageHeader
        heading={"Income Type"}
        extra={
          HasPermission(PERMISSIONS.INCOME_TYPE_ADD) && (
            <Button
              size={"sm"}
              colorScheme={themeColor}
              leftIcon={<AddIcon />}
              onClick={() => setToggleDrawer([])}
            >
              Add Income
            </Button>
          )
        }
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getIncomeTypeStatus}>
            {allIncomeTypes?.length ? (
              <TableContainer mt={2}>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>S. No.</Th>
                      <Th>Income Type</Th>
                      {(HasPermission(PERMISSIONS.INCOME_TYPE_EDIT) || HasPermission(PERMISSIONS.INCOME_TYPE_DELETE)) && <Th>Action</Th>}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(allIncomeTypes, (income, index) => (
                      <Tr>
                        <Td>{index + 1}</Td>
                        <Td>{income.type}</Td>
                        {(HasPermission(PERMISSIONS.INCOME_TYPE_EDIT) || HasPermission(PERMISSIONS.INCOME_TYPE_DELETE)) && (
                          <Td>
                            {income.id === 1 ||
                            income.id === 2 ||
                            income.id === 3 ? (
                              <></>
                            ) : (
                              <>
                                {HasPermission(PERMISSIONS.INCOME_TYPE_EDIT) && (
                                  <Tooltip placement="top" label="Edit">
                                    <IconButton
                                      size={"xs"}
                                      variant={"ghost"}
                                      icon={<EditIcon />}
                                      colorScheme={"blue"}
                                      onClick={() => setToggleDrawer(income)}
                                    />
                                  </Tooltip>
                                )}
                                {HasPermission(PERMISSIONS.INCOME_TYPE_DELETE) && (
                                  <DeleteButton
                                    description={
                                      "Are you sure? Do you want to delete?"
                                    }
                                    confirm={() => deleteIncomeType(income.id)}
                                    status={deleteIncomeTypeStatus}
                                    reset={resetIncomeTypeStatus}
                                  />
                                )}
                              </>
                            )}
                          </Td>
                        )}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Income Type Found"} />
            )}
          </LoadingContainer>
        </Box>
        {toggleDrawer && (
          <AddIncomeType
            data={toggleDrawer}
            closeDrawer={() => setToggleDrawer(null)}
            themeColor={themeColor}
          />
        )}
      </Box>
    </Box>
  );
};
