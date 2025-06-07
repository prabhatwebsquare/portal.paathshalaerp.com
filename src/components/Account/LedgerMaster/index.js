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
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { AddLedger } from "./AddLedger";
import dayjs from "dayjs";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { STATUS } from "@/constant";
import { useAccountStore } from "@/store/Account";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { DeleteButton } from "@/common/DeleteButton";
import { LedgerProfile } from "./LedgerProfile";
import { BsEyeFill } from "react-icons/bs";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const LedgerMaster = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [toggleProfile, setToggleProfile] = useState(null);

  const {
    getLedgerAction,
    getLedgerStatus,
    allLedgers,
    resetLedgerData,
    deleteLedgerAction,
    deleteLedgerStatus,
    resetLedgerStatus,
  } = useAccountStore((s) => ({
    getLedgerAction: s.getLedgerAction,
    getLedgerStatus: s.getLedgerStatus,
    allLedgers: s.allLedgers,
    resetLedgerData: s.resetLedgerData,
    deleteLedgerAction: s.deleteLedgerAction,
    deleteLedgerStatus: s.deleteLedgerStatus,
    resetLedgerStatus: s.resetLedgerStatus,
  }));

  useEffect(() => {
    if ((getLedgerStatus || 1) === STATUS.NOT_STARTED) {
      getLedgerAction();
    }
  }, [getLedgerAction, getLedgerStatus]);

  useEffect(() => {
    return () => resetLedgerData();
  }, [resetLedgerData]);

  const deleteLedger = (id) => {
    deleteLedgerAction(id);
  };

  return (
    <Box h={"100%"}>
      <PageHeader
        heading={"Ledger Creation"}
        extra={
          HasPermission(PERMISSIONS.LEDGER_MASTER_ADD) && (
            <Button
              size={"sm"}
              colorScheme={themeColor}
              leftIcon={<AddIcon />}
              onClick={() => setToggleDrawer([])}
            >
              Add Ledger
            </Button>
          )
        }
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getLedgerStatus}>
            {allLedgers?.length ? (
              <TableContainer mt={2}>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>S. No.</Th>
                      <Th>Ledger Name</Th>
                      <Th>Type</Th>
                      <Th>Contact</Th>
                      <Th>Email</Th>
                      <Th>Address</Th>
                      <Th>Opening Balance</Th>
                      <Th>Created At</Th>
                      {(HasPermission(PERMISSIONS.LEDGER_MASTER_EDIT) || HasPermission(PERMISSIONS.LEDGER_MASTER_DELETE)) && <Th>Action</Th>}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(allLedgers, (ledger, index) => (
                      <Tr key={ledger.id}>
                        <Td>{index + 1}</Td>
                        <Td>{ledger.name || "-"}</Td>
                        <Td>{ledger.type || "-"}</Td>
                        <Td>{ledger.contact || "-"}</Td>
                        <Td>{ledger.email || "-"}</Td>
                        <Td>{ledger.address || "-"}</Td>
                        <Td>₹ {ledger.openingBalance || 0}</Td>
                        <Td>
                          {ledger.createdAt
                            ? dayjs(ledger.createdAt).format("DD-MM-YYYY")
                            : "-"}
                        </Td>
                        {(HasPermission(PERMISSIONS.LEDGER_MASTER_EDIT) || HasPermission(PERMISSIONS.LEDGER_MASTER_DELETE)) && (
                          <Td>
                            <>
                              {ledger.type === "CASH" ||
                              ledger.type === "BANK" ? null : (
                                <Tooltip placement="top" label="View Details">
                                  <IconButton
                                    size="sm"
                                    variant="ghost"
                                    icon={<BsEyeFill />}
                                    colorScheme="blue"
                                    onClick={() => setToggleProfile(ledger)}
                                  />
                                </Tooltip>
                              )}
                              {HasPermission(PERMISSIONS.LEDGER_MASTER_EDIT) && (
                                <Tooltip placement="top" label="Edit">
                                  <IconButton
                                    size="sm"
                                    variant="ghost"
                                    icon={<EditIcon />}
                                    colorScheme="blue"
                                    onClick={() => setToggleDrawer(ledger)}
                                  />
                                </Tooltip>
                              )}
                              {ledger.type === "CASH" ||
                              ledger.type === "BANK" ? null : (
                                HasPermission(PERMISSIONS.LEDGER_MASTER_DELETE) && (
                                  <DeleteButton
                                    description="Are you sure? Do you want to delete?"
                                    confirm={() => deleteLedger(ledger.id)}
                                    status={deleteLedgerStatus}
                                    reset={resetLedgerStatus}
                                  />
                                )
                              )}
                            </>
                          </Td>
                        )}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Ledger Found"} />
            )}
          </LoadingContainer>
        </Box>
        {toggleDrawer && (
          <AddLedger
            data={toggleDrawer}
            closeDrawer={() => setToggleDrawer(null)}
            sessionMasterId={sessionMasterId}
            themeColor={themeColor}
          />
        )}
        {toggleProfile && (
          <LedgerProfile
            data={toggleProfile}
            closeProfile={() => setToggleProfile(null)}
            sessionMasterId={sessionMasterId}
            themeColor={themeColor}
          />
        )}
      </Box>
    </Box>
  );
};
