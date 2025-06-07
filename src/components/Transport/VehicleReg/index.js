import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
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
import { CiCirclePlus } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";

import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { LoadingContainer } from "@/common/LoadingContainer";
import { DeleteButton } from "@/common/DeleteButton";
import { useTransportStore } from "@/store/Transport";
import { AddVehicle } from "./AddVehicle";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { URL } from "@/services/apis";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const VehicleRegistration = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const {
    getVehicleAction,
    getVehicleStatus,
    allVehicles,
    resetTransportData,
    deleteVehicleAction,
    deleteVehicleStatus,
    resetVehicleStatus,
  } = useTransportStore((s) => ({
    getVehicleAction: s.getVehicleAction,
    getVehicleStatus: s.getVehicleStatus,
    allVehicles: s.allVehicles,
    resetTransportData: s.resetTransportData,
    deleteVehicleAction: s.deleteVehicleAction,
    deleteVehicleStatus: s.deleteVehicleStatus,
    resetVehicleStatus: s.resetVehicleStatus,
  }));

  useEffect(() => {
    if ((getVehicleStatus || 1) === STATUS.NOT_STARTED) {
      getVehicleAction();
    }
  }, [getVehicleAction, getVehicleStatus]);

  useEffect(() => {
    return () => resetTransportData();
  }, [resetTransportData]);

  const deleteVehicle = (id) => {
    deleteVehicleAction(id);
  };

  const [UpdateType, setUpdateType] = useState("New");
  return (
    <Box>
      <PageHeader
        heading={"Reg Vehicles"}
        extra={
          HasPermission(PERMISSIONS.VEHICLE_REG_ADD) && (
            <Button
              size={"sm"}
              colorScheme={themeColor}
              onClick={() => {
                setToggleDrawer([]);
                setUpdateType("New");
              }}
            >
              Add New Vehicle
            </Button>
          )
        }
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box
          className="scrollBar"
          h={"100%"}
          maxH={"100%"}
          overflowY={"scroll"}
        >
          <LoadingContainer status={getVehicleStatus}>
            {allVehicles?.length ? (
              <TableContainer
                mt={2}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                boxShadow="sm"
              >
                <Table
                  w="100%"
                  size="sm"
                  variant="simple"
                  colorScheme={themeColor}
                >
                  <Thead>
                    <Tr bg="gray.200">
                      <Th textAlign="center">S. No.</Th>
                      <Th textAlign="center">Vehicle No.</Th>
                      <Th textAlign="center">Vehicle Type</Th>
                      <Th textAlign="center">Assigned Driver</Th>
                      <Th textAlign="center">Driver</Th>
                      {(HasPermission(PERMISSIONS.VEHICLE_REG_EDIT) ||
                        HasPermission(PERMISSIONS.VEHICLE_REG_DELETE)) && (
                        <Th textAlign="center">Action</Th>
                      )}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(allVehicles, (vehicle, index) => (
                      <Tr key={vehicle.id} _hover={{ bg: "gray.100" }}>
                        <Td textAlign="center">{index + 1}</Td>
                        <Td textAlign="center">{vehicle.vehicle}</Td>
                        <Td textAlign="center">{vehicle.type}</Td>
                        <Td textAlign="center" width={"20%"}>
                          {vehicle.staff?.name ? (
                            <Flex gap={3} align="center" justify="center">
                              <Avatar
                                size="sm"
                                src={URL + vehicle?.staff?.photo}
                              />
                              <Text
                                fontSize={"sm"}
                                fontWeight="bold"
                                color="gray.700"
                              >
                                {vehicle.staff?.name}
                              </Text>
                            </Flex>
                          ) : (
                            <Flex
                              gap={2}
                              align="center"
                              justify="center"
                              direction="column"
                              p={4}
                              border="1px dashed"
                              borderColor={`${themeColor}.300`}
                              borderRadius="md"
                              bg={`${themeColor}.50`}
                              textAlign="center"
                            >
                              <Text
                                fontSize="sm"
                                color={`${themeColor}.500`}
                                fontWeight="semibold"
                              >
                                No Driver Assigned
                              </Text>
                            </Flex>
                          )}
                        </Td>
                        <Td textAlign="center">
                          <Tooltip
                            placement="top"
                            label={
                              vehicle.staff?.name
                                ? "Update Driver"
                                : "Add Driver"
                            }
                          >
                            <Button
                              size="lg"
                              variant={"filed"}
                              onClick={() => {
                                setToggleDrawer(vehicle);
                                setUpdateType("Driver");
                              }}
                            >
                              {vehicle.staff?.name ? (
                                <CiEdit />
                              ) : (
                                <CiCirclePlus />
                              )}
                            </Button>
                          </Tooltip>
                        </Td>
                        {(HasPermission(PERMISSIONS.VEHICLE_REG_EDIT) ||
                          HasPermission(PERMISSIONS.VEHICLE_REG_DELETE)) && (
                          <Td textAlign="center">
                            {HasPermission(PERMISSIONS.VEHICLE_REG_EDIT) && (
                              <Tooltip placement="top" label="Edit">
                                <IconButton
                                  mr={3}
                                  size="sm"
                                  variant="ghost"
                                  icon={<EditIcon />}
                                  colorScheme={themeColor}
                                  onClick={() => {
                                    setToggleDrawer(vehicle);
                                    setUpdateType("New");
                                  }}
                                />
                              </Tooltip>
                            )}
                            {HasPermission(PERMISSIONS.VEHICLE_REG_DELETE) && (
                              <DeleteButton
                                description={
                                  "Are you sure? Do you want to delete?"
                                }
                                confirm={() => deleteVehicle(vehicle.id)}
                                status={deleteVehicleStatus}
                                reset={resetVehicleStatus}
                              />
                            )}
                          </Td>
                        )}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Vehicle Found"} />
            )}
          </LoadingContainer>
        </Box>
        {toggleDrawer && (
          <AddVehicle
            UpdateType={UpdateType}
            data={toggleDrawer}
            closeDrawer={() => setToggleDrawer(null)}
            themeColor={themeColor}
          />
        )}
      </Box>
    </Box>
  );
};
