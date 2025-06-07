import {
  AddIcon,
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  Switch,
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
import { LoadingContainer } from "@/common/LoadingContainer";
import { DeleteButton } from "@/common/DeleteButton";
import { useTransportStore } from "@/store/Transport";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { AddTransporter } from "./AddTransporter";
import { FILE_URL } from "@/services/apis";
import { FaPause, FaPlay } from "react-icons/fa";

export const TransporterName = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const {
    getTransporterAction,
    getTransporterStatus,
    allTransporters,
    resetTransportData,
    deleteTransporterAction,
    deleteTransporterStatus,
    resetTransporterStatus,
    updateTransporterStatus,
    updateTransporterAction,
  } = useTransportStore((s) => ({
    getTransporterAction: s.getTransporterAction,
    getTransporterStatus: s.getTransporterStatus,
    allTransporters: s.allTransporters,
    resetTransportData: s.resetTransportData,
    deleteTransporterAction: s.deleteTransporterAction,
    deleteTransporterStatus: s.deleteTransporterStatus,
    resetTransporterStatus: s.resetTransporterStatus,
    updateTransporterStatus: s.updateTransporterStatus,
    updateTransporterAction: s.updateTransporterAction,
  }));

  useEffect(() => {
    if ((getTransporterStatus || 1) === STATUS.NOT_STARTED) {
      getTransporterAction();
    }
  }, [getTransporterAction, getTransporterStatus]);

  useEffect(() => {
    return () => resetTransportData();
  }, [resetTransportData]);

  const deleteTransporter = (id) => {
    deleteTransporterAction(id);
  };

  const handleStatusChange = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    updateTransporterAction({
      status: newStatus,
      id: id,
    });
  };

  useEffect(() => {
    if (updateTransporterStatus === STATUS.SUCCESS) {
      getTransporterAction();
    }
  }, [updateTransporterStatus]);

  return (
    <Box>
      <PageHeader
        heading={"Transporter Name"}
        extra={
          <Button
            size={"sm"}
            colorScheme={themeColor}
            onClick={() => setToggleDrawer([])}
          >
            Add New Transporter
          </Button>
        }
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box
          className="scrollBar"
          h={"100%"}
          maxH={"100%"}
          overflowY={"scroll"}
        >
          <LoadingContainer status={getTransporterStatus}>
            <TableContainer mt={2}>
              <Table w="100%" size={"sm"} variant={"simple"}>
                <Thead>
                  <Tr bg="gray.100">
                    <Th>S.No.</Th>
                    <Th>Transporter Name</Th>
                    <Th>Mobile No</Th>
                    <Th>Address</Th>
                    <Th>Status</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {allTransporters?.length ? (
                    map(allTransporters, (transporter, index) => (
                      <Tr key={transporter.id}>
                        <Td>{index + 1}</Td>
                        <Td>
                          <Flex alignItems="center">
                            <Avatar src={FILE_URL + transporter?.logo} mr={2} />
                            <Text
                              fontSize="sm"
                              fontWeight="semibold"
                              color="gray.700"
                            >
                              {transporter?.name}
                            </Text>
                          </Flex>
                        </Td>

                        <Td>{transporter?.mobileNo} </Td>
                        <Td>{transporter?.address} </Td>

                        <Td>
                          <Flex alignItems="center" gap={2}>
                            {/* <Badge
                              variant="outline"
                              colorScheme={
                                transporter.status === 1 ? "green" : "red"
                              }
                            >
                              {transporter.status === 1 ? "Active" : "Inactive"}
                            </Badge> */}

                            {/* Toggle for status change */}
                            <Switch
                              size="md"
                              isChecked={transporter.status === 1}
                              colorScheme={
                                transporter.status === 1 ? "green" : "red"
                              }
                              onChange={() =>
                                handleStatusChange(
                                  transporter.id,
                                  transporter.status
                                )
                              }
                              aria-label="Change Status"
                            />

                            {/* Optional Icon for better visibility */}
                            {/* <IconButton
                              size="sm"
                              icon={
                                transporter.status === 1 ? (
                                  <CheckIcon />
                                ) : (
                                  <CloseIcon />
                                )
                              }
                              colorScheme={
                                transporter.status === 1 ? "green" : "red"
                              }
                              onClick={() =>
                                handleStatusChange(
                                  transporter.id,
                                  transporter.status
                                )
                              }
                              aria-label="Change Status"
                            /> */}
                          </Flex>
                        </Td>

                        <Td>
                          <Tooltip placement="top" label="Edit">
                            <IconButton
                              mr={3}
                              size={"sm"}
                              variant={"ghost"}
                              icon={<EditIcon />}
                              colorScheme={themeColor}
                              onClick={() => setToggleDrawer(transporter)}
                            />
                          </Tooltip>
                          {/* <DeleteButton
                            description={"Are you sure? Do you want to delete?"}
                            confirm={() => deleteTransporter(transporter.id)}
                            status={deleteTransporterStatus}
                            reset={resetTransporterStatus}
                          /> */}
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <NoData title={"No Transporter Found"} />
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </LoadingContainer>
        </Box>
        {toggleDrawer && (
          <AddTransporter
            data={toggleDrawer}
            closeDrawer={() => setToggleDrawer(null)}
            themeColor={themeColor}
          />
        )}
      </Box>
    </Box>
  );
};
