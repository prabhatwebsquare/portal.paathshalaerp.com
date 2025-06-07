import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
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
import { compact, map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { AddRoute } from "./AddRoute";
import { useTransportStore } from "@/store/Transport";
import { STATUS } from "@/constant";
import { DeleteButton } from "@/common/DeleteButton";
import { NoData } from "@/common/NoData";
import { LoadingContainer } from "@/common/LoadingContainer";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { MdArrowForward } from "react-icons/md";

export const Routes = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const {
    getRouteAction,
    getRouteStatus,
    allRoutes,
    deleteRouteAction,
    deleteRouteStatus,
    resetRouteStatus,
  } = useTransportStore((s) => ({
    getRouteAction: s.getRouteAction,
    getRouteStatus: s.getRouteStatus,
    allRoutes: s.allRoutes,
    deleteRouteAction: s.deleteRouteAction,
    deleteRouteStatus: s.deleteRouteStatus,
    resetRouteStatus: s.resetRouteStatus,
  }));
  useEffect(() => {
    if ((getRouteStatus || 1) === STATUS.NOT_STARTED) {
      getRouteAction({ sessionMasterId });
    }
  }, [getRouteAction, getRouteStatus]);

  const deleteRoute = (id) => {
    deleteRouteAction(id);
  };

  return (
    <Box>
      <PageHeader
        heading={"Routes"}
        extra={
          HasPermission(PERMISSIONS.ROUTE_ADD) && (
            <Button
              size={"sm"}
              colorScheme={themeColor}
              onClick={() => setToggleDrawer([])}
            >
              Add Route
            </Button>
          )
        }
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getRouteStatus}>
            {allRoutes?.length ? (
              <TableContainer mt={2}>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>S. No.</Th>
                      <Th>Route</Th>
                      <Th>Vehicle</Th>
                      <Th>Shift Name</Th>
                      <Th>Stations</Th>
                      {HasPermission(PERMISSIONS.ROUTE_EDIT) ||
                      HasPermission(PERMISSIONS.ROUTE_DELETE) ? (
                        <Th>Action</Th>
                      ) : null}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(allRoutes, (route, index) => (
                      <Tr>
                        <Td>{index + 1}</Td>
                        <Td>{route.name}</Td>
                        <Td>{route.vehicle.vehicle}</Td>
                        <Td>{route.shift.name}</Td>
                        <Td width={"60%"}>
                          {route.assign_stations &&
                          route.assign_stations.length > 0 ? (
                            <Flex align="center" wrap="wrap" gap={2}>
                              {route.assign_stations.map((s, index) => (
                                <Flex key={index} align="center">
                                  <Text fontSize="sm" color="gray.700">
                                    {s.station_master.name}
                                  </Text>
                                  {index < route.assign_stations.length - 1 && (
                                    <Icon
                                      as={MdArrowForward}
                                      mx={2}
                                      color="teal.500"
                                    />
                                  )}
                                </Flex>
                              ))}
                            </Flex>
                          ) : (
                            <Text fontSize="sm" color="gray.500">
                              No Stations Assigned
                            </Text>
                          )}
                        </Td>
                        {HasPermission(PERMISSIONS.ROUTE_EDIT) ||
                        HasPermission(PERMISSIONS.ROUTE_DELETE) ? (
                          <Td>
                            {HasPermission(PERMISSIONS.ROUTE_EDIT) && (
                              <Tooltip placement="top" label="Edit">
                                <IconButton
                                  size={"sm"}
                                  variant={"ghost"}
                                  icon={<EditIcon />}
                                  colorScheme={"blue"}
                                  onClick={() => setToggleDrawer(route)}
                                />
                              </Tooltip>
                            )}
                            {HasPermission(PERMISSIONS.ROUTE_DELETE) && (
                              <DeleteButton
                                description={
                                  "Are you sure? Do you want to delete?"
                                }
                                confirm={() => deleteRoute(route.id)}
                                status={deleteRouteStatus}
                                reset={resetRouteStatus}
                              />
                            )}
                          </Td>
                        ) : null}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Route Found"} />
            )}
          </LoadingContainer>
        </Box>
        {toggleDrawer && (
          <AddRoute
            sessionMasterId={sessionMasterId}
            themeColor={themeColor}
            data={toggleDrawer}
            closeDrawer={() => setToggleDrawer(null)}
          />
        )}
      </Box>
    </Box>
  );
};
