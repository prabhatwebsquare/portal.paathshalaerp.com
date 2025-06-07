import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { MultiSelectDropdown } from "@/common/MultiSelectDropdown";
import { STATUS } from "@/constant";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { useTransportStore } from "@/store/Transport";
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { filter, findIndex, map } from "lodash";
import React, { useEffect, useState } from "react";
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";

export const AddRoute = ({
  sessionMasterId,
  themeColor,
  data,
  closeDrawer,
}) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,
          name: data.name,
          vehicleId: data.vehicleId,
          sessionMasterId,
          shiftId: Number(data?.shift.id),
        }
      : {
          sessionMasterId,
        }
  );
  const [selectedStation, setSelectedStation] = useState(
    data?.id
      ? map(data.assign_stations, (s) => ({ id: s.stationMasterId }))
      : []
  );


  const { getVehicleAction, getVehicleStatus, allVehicles } = useTransportStore(
    (s) => ({
      getVehicleAction: s.getVehicleAction,
      getVehicleStatus: s.getVehicleStatus,
      allVehicles: s.allVehicles,
    })
  );

  const {
    addRouteAction,
    addRouteStatus,
    updateRouteAction,
    updateRouteStatus,
    resetRouteStatus,
  } = useTransportStore((s) => ({
    addRouteAction: s.addRouteAction,
    addRouteStatus: s.addRouteStatus,
    updateRouteAction: s.updateRouteAction,
    updateRouteStatus: s.updateRouteStatus,
    resetRouteStatus: s.resetRouteStatus,
  }));

  useEffect(() => {
    if ((getVehicleStatus || 1) === STATUS.NOT_STARTED) {
      getVehicleAction();
    }
  }, [getVehicleAction, getVehicleStatus]);

  const selectAllStation = () => {
    if (selectedStation?.length === allStationsByShift?.length) {
      setSelectedStation([]);
    } else {
      setSelectedStation(map(allStationsByShift, (s) => ({ id: s.id })));
    }
  };

  const handleCheck = (id) => {
    if (findIndex(selectedStation, (s) => s.id === id) !== -1) {
      setSelectedStation(filter(selectedStation, (s) => s.id !== id));
    } else {
      setSelectedStation([...selectedStation, { id }]);
    }
  };

  const addRoute = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateRouteAction({
        ...inputValue,
        stations: map(selectedStation, "id"),
      });
    } else {
      addRouteAction({ ...inputValue, stations: map(selectedStation, "id") });
    }
  };

  useEffect(() => {
    if (
      addRouteStatus === STATUS.SUCCESS ||
      updateRouteStatus === STATUS.SUCCESS
    ) {
      resetRouteStatus();
      closeDrawer();
    }
  }, [addRouteStatus, closeDrawer, resetRouteStatus, updateRouteStatus]);
  const { getShiftAction, getShiftStatus, allShifts } = useAdditionalSetupStore(
    (s) => ({
      getShiftAction: s.getShiftAction,
      getShiftStatus: s.getShiftStatus,
      allShifts: s.allShifts,
    })
  );

  useEffect(() => {
    if ((getShiftStatus || 1) === STATUS.NOT_STARTED) {
      getShiftAction();
    }
  }, [getShiftAction, getShiftStatus]);

  const {
    getStationByShiftAction,
    getStationByShiftStatus,
    allStationsByShift,
  } = useTransportStore((s) => ({
    getStationByShiftAction: s.getStationByShiftAction,
    getStationByShiftStatus: s.getStationByShiftStatus,
    allStationsByShift: s.allStationsByShift,
  }));

  useEffect(() => {
    const data = {
      shiftId: inputValue.shiftId,
    };
    if (!inputValue.shiftId) {
      return;
    }
    getStationByShiftAction(data);
  }, [inputValue.shiftId]);
  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addRoute}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Route" : "Add New Route"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="name"
                label={"Route Name"}
                autoFocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomSelect
                name="vehicleId"
                label={"Vehicle"}
                data={map(allVehicles, (v) => ({
                  name: v.vehicle,
                  value: v.id,
                }))}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomSelect
                name="shiftId"
                label="Select Shift"
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(allShifts, (d) => ({
                  value: d.id,
                  name: d.name,
                }))}
              />
              <Flex w="100%" direction="column" gap={4}>
                {inputValue?.shiftId && (
                  <Box borderWidth={1} p={3} borderRadius="lg" bg="gray.50">
                    <Flex
                      direction="row"
                      align="center"
                      gap={2}
                      w="100%"
                      p={2}
                      mb={2}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="gray.200"
                      bg={
                        selectedStation?.length === allStationsByShift?.length
                          ? `${themeColor}.100`
                          : "white"
                      }
                      _hover={{ bg: `${themeColor}.50` }}
                      transition="all 0.3s"
                    >
                      <Checkbox
                        isChecked={
                          selectedStation?.length === allStationsByShift?.length
                        }
                        colorScheme={themeColor}
                        onChange={selectAllStation}
                        size="md"
                      />
                      <Text fontSize="sm" color="gray.700" fontWeight={700}>
                        Select All Stations
                      </Text>
                    </Flex>
                    <Flex wrap="wrap" gap={2}>
                      {allStationsByShift?.map((station) => {
                        const isChecked = selectedStation.some(
                          (selected) => selected.id === station.id
                        );
                        return (
                          <Flex
                            key={station.id}
                            direction="row"
                            align="center"
                            gap={2}
                            w="100%"
                            p={2}
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor="gray.200"
                            bg={isChecked ? `${themeColor}.100` : "white"}
                            _hover={{ bg: `${themeColor}.50` }}
                            transition="all 0.3s"
                          >
                            <Checkbox
                              isChecked={isChecked}
                              colorScheme={themeColor}
                              onChange={() => handleCheck(station.id)}
                              size="md"
                            />
                            <Text
                              fontSize="sm"
                              color="gray.700"
                              fontWeight={500}
                            >
                              {station.name}
                            </Text>
                          </Flex>
                        );
                      })}
                    </Flex>
                  </Box>
                )}
              </Flex>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              size={"sm"}
              variant="outline"
              mr={3}
              colorScheme={"red"}
              onClick={closeDrawer}
            >
              Cancel
            </Button>
            <Button
              size={"sm"}
              type="submit"
              isLoading={
                addRouteStatus === STATUS.FETCHING ||
                updateRouteStatus === STATUS.FETCHING
              }
              colorScheme={themeColor}
            >
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
