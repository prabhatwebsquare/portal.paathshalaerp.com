import {
  Box,
  Button,
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
import { PageHeader } from "@/common/PageHeader";
import dayjs from "dayjs";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { AddGeneralVoucher } from "./AddGeneralVoucher";
import { useAccountStore } from "@/store/Account";
import { STATUS } from "@/constant";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { DeleteButton } from "@/common/DeleteButton";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const GeneralVoucher = ({ sessionMasterId, themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);

  const {
    getGeneralVoucherAction,
    getGeneralVoucherStatus,
    allGeneralVouchers,
    resetGeneralVoucherData,
    deleteGeneralVoucherAction,
    deleteGeneralVoucherStatus,
    resetGeneralVoucherStatus,
  } = useAccountStore((s) => ({
    getGeneralVoucherAction: s.getGeneralVoucherAction,
    getGeneralVoucherStatus: s.getGeneralVoucherStatus,
    allGeneralVouchers: s.allGeneralVouchers,
    resetGeneralVoucherData: s.resetGeneralVoucherData,
    deleteGeneralVoucherAction: s.deleteGeneralVoucherAction,
    deleteGeneralVoucherStatus: s.deleteGeneralVoucherStatus,
    resetGeneralVoucherStatus: s.resetGeneralVoucherStatus,
  }));

  useEffect(() => {
    if ((getGeneralVoucherStatus || 1) === STATUS.NOT_STARTED) {
      getGeneralVoucherAction({ sessionMasterId });
    }
  }, [getGeneralVoucherAction, getGeneralVoucherStatus, sessionMasterId]);

  useEffect(() => {
    return () => resetGeneralVoucherData();
  }, [resetGeneralVoucherData]);

  const deleteGeneralVoucher = (id) => {
    deleteGeneralVoucherAction(id);
  };

  return (
    <Box>
      <PageHeader
        heading={"General Voucher"}
        extra={
          HasPermission(PERMISSIONS.GENERAL_VOUCHER_ADD) && (
            <Button
              size={"sm"}
              colorScheme={themeColor}
              leftIcon={<AddIcon />}
              onClick={() => setToggleDrawer([])}
            >
              Create New Voucher
            </Button>
          )
        }
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getGeneralVoucherStatus}>
            {allGeneralVouchers?.length ? (
              <Table w="100%" size={"sm"} variant={"simple"}>
                <Thead>
                  <Tr bg="gray.100">
                    <Th>Voucher No.</Th>
                    <Th>Date</Th>
                    <Th>From</Th>
                    <Th>To</Th>
                    <Th>Amount</Th>
                    <Th>Remark</Th>
                    {(HasPermission(PERMISSIONS.GENERAL_VOUCHER_EDIT) ||
                      HasPermission(PERMISSIONS.GENERAL_VOUCHER_DELETE)) && (
                      <Th>Action</Th>
                    )}
                  </Tr>
                </Thead>
                <Tbody>
                  {map(allGeneralVouchers, (general, index) => (
                    <Tr key={general.id}>
                      <Td>{general.voucherNo}</Td>
                      <Td>
                        {general?.voucherDate
                          ? dayjs(general.voucherDate).format("DD-MM-YYYY")
                          : ""}
                      </Td>
                      <Td>{general.anotherLedgerMaster?.name}</Td>
                      <Td>{general.ledger_master?.name}</Td>
                      <Td>₹ {general.amount}</Td>
                      <Td>{general.remark}</Td>
                      {(HasPermission(PERMISSIONS.GENERAL_VOUCHER_EDIT) ||
                        HasPermission(PERMISSIONS.GENERAL_VOUCHER_DELETE)) && (
                        <Td>
                          {HasPermission(PERMISSIONS.GENERAL_VOUCHER_EDIT) && (
                            <Tooltip placement="top" label="Edit">
                              <IconButton
                                size={"sm"}
                                variant={"ghost"}
                                icon={<EditIcon />}
                                colorScheme={themeColor}
                                onClick={() => setToggleDrawer(general)}
                              />
                            </Tooltip>
                          )}
                          {HasPermission(
                            PERMISSIONS.GENERAL_VOUCHER_DELETE
                          ) && (
                            <DeleteButton
                              description={
                                "Are you sure? Do you want to delete?"
                              }
                              confirm={() => deleteGeneralVoucher(general.id)}
                              status={deleteGeneralVoucherStatus}
                              reset={resetGeneralVoucherStatus}
                            />
                          )}
                        </Td>
                      )}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <NoData title={"No General Voucher Found"} />
            )}
          </LoadingContainer>
          {toggleDrawer && (
            <AddGeneralVoucher
              data={toggleDrawer}
              closeDrawer={() => setToggleDrawer(null)}
              sessionMasterId={sessionMasterId}
              themeColor={themeColor}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
