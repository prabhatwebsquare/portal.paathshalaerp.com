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
import { AddBank } from "./AddBank";
import { LoadingContainer } from "@/common/LoadingContainer";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const BanksList = ({ sessionMasterId, themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const {
    getBankAction,
    getBankStatus,
    allBanks,
    deleteBankAction,
    deleteBankStatus,
    resetBankStatus,
  } = useAdditionalSetupStore((s) => ({
    getBankAction: s.getBankAction,
    getBankStatus: s.getBankStatus,
    allBanks: s.allBanks,
    deleteBankAction: s.deleteBankAction,
    deleteBankStatus: s.deleteBankStatus,
    resetBankStatus: s.resetBankStatus,
  }));

  useEffect(() => {
    if ((getBankStatus || 1) === STATUS.NOT_STARTED) {
      getBankAction();
    }
  }, [getBankAction, getBankStatus]);

  const deleteBank = (id) => {
    deleteBankAction(id);
  };

  return (
    <Box pos={"relative"} h={"70vh"}>
      <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
        <LoadingContainer status={getBankStatus}>
          {allBanks?.length ? (
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
                      <Th textAlign="center" w="60px">
                        S.No.
                      </Th>
                      <Th textAlign="center">Bank</Th>
                      <Th textAlign="center">Account No.</Th>
                      <Th textAlign="center">Opening Balance</Th>
                      <Th textAlign="center">IFSC Code</Th>
                      <Th textAlign="center">Branch</Th>
                      {(HasPermission(PERMISSIONS.ORGANISATION_BANK_EDIT) ||
                        HasPermission(
                          PERMISSIONS.ORGANISATION_BANK_DELETE
                        )) && (
                        <Th textAlign="center" w="20%">
                          Action
                        </Th>
                      )}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(allBanks, (bank, index) => (
                      <Tr key={bank.id}>
                        <Td textAlign="center">{index + 1}</Td>
                        <Td textAlign="center">{bank.name}</Td>
                        <Td textAlign="center">{bank.accountNumber}</Td>
                        <Td textAlign="center">{bank.openingBalance}</Td>
                        <Td textAlign="center">{bank.ifsc}</Td>
                        <Td textAlign="center">{bank.branch}</Td>
                        {(HasPermission(PERMISSIONS.ORGANISATION_BANK_EDIT) ||
                          HasPermission(
                            PERMISSIONS.ORGANISATION_BANK_DELETE
                          )) && (
                          <Td textAlign="center">
                            <Flex justify="center" gap={3}>
                              {HasPermission(
                                PERMISSIONS.ORGANISATION_BANK_EDIT
                              ) && (
                                <Tooltip label="Edit">
                                  <IconButton
                                    size="xs"
                                    icon={<EditIcon />}
                                    colorScheme="blue"
                                    onClick={() => setToggleDrawer(bank)}
                                  />
                                </Tooltip>
                              )}
                              {HasPermission(
                                PERMISSIONS.ORGANISATION_BANK_DELETE
                              ) && (
                                <DeleteButton
                                  description="Are you sure? Do you want to delete?"
                                  confirm={() => deleteBank(bank.id)}
                                  status={deleteBankStatus}
                                  reset={resetBankStatus}
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
            <NoData title={"No Bank Found"} />
          )}
        </LoadingContainer>
      </Box>
      {HasPermission(PERMISSIONS.ORGANISATION_BANK_ADD) && (
        <Tooltip placement="top" label={"Add New Bank"}>
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
        <AddBank
          data={toggleDrawer}
          sessionMasterId={sessionMasterId}
          themeColor={themeColor}
          closeDrawer={() => setToggleDrawer(null)}
        />
      )}
    </Box>
  );
};
