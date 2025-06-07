import React, { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { map } from "lodash";
import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { STATUS } from "@/constant";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { useTransportStore } from "@/store/Transport";

export const AddStation = ({ data, closeDrawer, themeColor }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          id: data.id,
        }
      : {}
  );

  const [schedules, setSchedules] = useState(
    Array.isArray(data?.schedules)
      ? data.schedules
      : [{ shiftId: "", arriveTime: "", dropOffTime: "" }]
  );

  const {
    addStationAction,
    addStationStatus,
    updateStationAction,
    updateStationStatus,
    resetStatus,
  } = useTransportStore((s) => ({
    addStationAction: s.addStationAction,
    addStationStatus: s.addStationStatus,
    updateStationAction: s.updateStationAction,
    updateStationStatus: s.updateStationStatus,
    resetStatus: s.resetStatus,
  }));

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

  useEffect(() => {
    if (
      addStationStatus === STATUS.SUCCESS ||
      updateStationStatus === STATUS.SUCCESS
    ) {
      resetStatus();
      closeDrawer();
    }
  }, [addStationStatus, closeDrawer, resetStatus, updateStationStatus]);

  const addSchedule = () => {
    setSchedules((prev) => [
      ...prev,
      { shiftId: "", arriveTime: "", dropOffTime: "" },
    ]);
  };

  const removeSchedule = (index) => {
    setSchedules((prev) => prev?.filter((_, i) => i !== index));
  };

  const addStation = (e) => {
    e.preventDefault();
    const payload = {
      ...inputValue,
      schedules,
    };
    if (data?.id) {
      updateStationAction(payload);
    } else {
      addStationAction(payload);
    }
  };



  return (
    <Drawer isOpen={!!data} size={"md"} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addStation}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Station" : "Add New Station"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={4}>
              <CustomInput
                type="text"
                name="name"
                label="Station"
                autoFocus
                inputValue={inputValue}
                setInputValue={setInputValue}
              />

              {schedules.map((schedule, index) => (
                <VStack
                  key={index}
                  spacing={3}
                  w="full"
                  borderWidth="1px"
                  p={4}
                  borderRadius="md"
                >
                  <HStack w="full" justify="space-between">
                    <CustomSelect
                      name="shiftId"
                      label="Select Shift"
                      inputValue={schedule} // Bind to shiftId
                      setInputValue={(updateFn) =>
                        setSchedules((prevSchedules) => {
                          const updatedSchedules = [...prevSchedules];
                          updatedSchedules[index] = updateFn(
                            updatedSchedules[index]
                          );
                          return updatedSchedules;
                        })
                      }
                      data={map(allShifts, (d) => ({
                        value: d.id,
                        name: d.name,
                      }))}
                    />

                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => removeSchedule(index)}
                    >
                      Remove
                    </Button>
                  </HStack>
                  <CustomInput
                    type="time"
                    name="arriveTime"
                    label="Pickup Time"
                    inputValue={schedule}
                    setInputValue={(updateFn) =>
                      setSchedules((prevSchedules) => {
                        const updatedSchedules = [...prevSchedules];
                        updatedSchedules[index] = updateFn(
                          updatedSchedules[index]
                        );
                        return updatedSchedules;
                      })
                    }
                  />
                  <CustomInput
                    type="time"
                    name="dropOffTime"
                    label="Drop-off Time"
                    inputValue={schedule}
                    setInputValue={(updateFn) =>
                      setSchedules((prevSchedules) => {
                        const updatedSchedules = [...prevSchedules];
                        updatedSchedules[index] = updateFn(
                          updatedSchedules[index]
                        );
                        return updatedSchedules;
                      })
                    }
                  />
                </VStack>
              ))}

              <Button colorScheme={themeColor} size="sm" onClick={addSchedule}>
                + Add Schedule
              </Button>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              size="sm"
              variant="outline"
              mr={3}
              colorScheme="red"
              onClick={closeDrawer}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              type="submit"
              isLoading={
                addStationStatus === STATUS.FETCHING ||
                updateStationStatus === STATUS.FETCHING
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
