import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  List,
  ListItem,
  SimpleGrid,
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
import { AddStation } from "./AddStation";
import { LoadingContainer } from "@/common/LoadingContainer";
import { DeleteButton } from "@/common/DeleteButton";
import { useTransportStore } from "@/store/Transport";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import moment from "moment";

export const Station = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const {
    getStationAction,
    getStationStatus,
    allStations,
    resetTransportData,
    deleteStationAction,
    deleteStationStatus,
    resetStatus,
  } = useTransportStore((s) => ({
    getStationAction: s.getStationAction,
    getStationStatus: s.getStationStatus,
    allStations: s.allStations,
    resetTransportData: s.resetTransportData,
    deleteStationAction: s.deleteStationAction,
    deleteStationStatus: s.deleteStationStatus,
    resetStatus: s.resetStatus,
  }));

  useEffect(() => {
    if ((getStationStatus || 1) === STATUS.NOT_STARTED) {
      getStationAction();
    }
  }, [getStationAction, getStationStatus]);

  useEffect(() => {
    return () => resetTransportData();
  }, [resetTransportData]);

  const deleteStation = (id) => {
    deleteStationAction(id);
  };

  const convertTo12HourFormat = (time24) => {
    return moment(time24, "HH:mm:ss").format("hh:mm A");
  };

  return (
    <Box>
      <PageHeader
        heading={"Stations"}
        extra={
          HasPermission(PERMISSIONS.STATION_ADD) && (
            <Button
              size={"sm"}
              colorScheme={themeColor}
              onClick={() => setToggleDrawer([])}
            >
              Add Station
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
          <LoadingContainer status={getStationStatus}>
            {allStations?.length ? (
              <TableContainer mt={2}>
                <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
                  {allStations.map((station, index) => (
                    <Box
                      key={station.id}
                      p={5}
                      shadow="2xl"
                      borderWidth="3px"
                      borderColor={`${themeColor}.700`}
                      position="relative"
                      borderRadius="lg"
                      display="flex"
                      flexDirection="column"
                      color={`${themeColor}.700`}
                    >
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        mb={3}
                        color={`${themeColor}.700`}
                      >
                        {index + 1}. {station.name}
                      </Text>
                      <Box mb={4}>
                        {station.schedules.length > 0 ? (
                          <>
                            <List spacing={2}>
                              {station.schedules.map((schedule, idx) => (
                                <ListItem
                                  key={idx}
                                  fontSize="sm"
                                  color={`${themeColor}.700`}
                                >
                                  <Text>
                                    <strong>{schedule.shiftName}</strong>:{" "}
                                    {convertTo12HourFormat(schedule.arriveTime)}{" "}
                                    -{" "}
                                    {convertTo12HourFormat(
                                      schedule.dropOffTime
                                    )}
                                  </Text>
                                </ListItem>
                              ))}
                            </List>
                          </>
                        ) : (
                          <Text color={`${themeColor}.700`}>
                            No schedules available
                          </Text>
                        )}
                      </Box>
                      {HasPermission(PERMISSIONS.STATION_EDIT) ||
                      HasPermission(PERMISSIONS.STATION_DELETE) ? (
                        <Box display="flex" justifyContent="space-between">
                          {HasPermission(PERMISSIONS.STATION_EDIT) && (
                            <Tooltip placement="top" label="Edit">
                              <IconButton
                                size="md"
                                variant="ghost"
                                icon={<EditIcon />}
                                colorScheme="white" // White for contrast
                                onClick={() => setToggleDrawer(station)}
                              />
                            </Tooltip>
                          )}
                          {HasPermission(PERMISSIONS.STATION_DELETE) && (
                            <DeleteButton
                              description={
                                "Are you sure? Do you want to delete?"
                              }
                              size={"md"}
                              variant={"filed"}
                              confirm={() => deleteStation(station.id)}
                              status={deleteStationStatus}
                              reset={resetStatus}
                            />
                          )}
                        </Box>
                      ) : null}
                    </Box>
                  ))}
                </SimpleGrid>
              </TableContainer>
            ) : (
              <NoData title={"No Station Found"} />
            )}
          </LoadingContainer>
        </Box>
        {toggleDrawer && (
          <AddStation
            data={toggleDrawer}
            closeDrawer={() => setToggleDrawer(null)}
            themeColor={themeColor}
          />
        )}
      </Box>
    </Box>
  );
};
