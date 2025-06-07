import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { STATUS } from "@/constant";
import { URL } from "@/services/apis";
import { useTransportStore } from "@/store/Transport";
import {
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { map, toUpper } from "lodash";
import React, { useEffect, useState } from "react";

export const AddVehicle = ({ data, closeDrawer, themeColor, UpdateType }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          vehicle: data.vehicle,
          type: data.type,
          staffId: data.staffId,
          id: data.id,
        }
      : {}
  );

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  useEffect(() => {
    if (inputValue?.vehicle) {
      const value = inputValue?.vehicle.replace(/\s/g, "");
      const regex = /^[a-zA-Z0-9]*$/;
      if (regex.test(value)) {
        setInputValue((pre) => ({ ...pre, vehicle: toUpper(value) }));
      }
    }
  }, [inputValue?.vehicle]);

  const {
    addVehicleAction,
    addVehicleStatus,
    updateVehicleAction,
    updateVehicleStatus,
    resetVehicleStatus,
    getVehicleAction,
  } = useTransportStore((s) => ({
    addVehicleAction: s.addVehicleAction,
    addVehicleStatus: s.addVehicleStatus,
    updateVehicleAction: s.updateVehicleAction,
    updateVehicleStatus: s.updateVehicleStatus,
    resetVehicleStatus: s.resetVehicleStatus,
    getVehicleAction: s.getVehicleAction,
  }));
  const { getDriverAction, getDriverStatus, allDrivers } = useTransportStore(
    (s) => ({
      getDriverAction: s.getDriverAction,
      getDriverStatus: s.getDriverStatus,
      allDrivers: s.allDrivers,
    })
  );

  useEffect(() => {
    if ((getDriverStatus || 1) === STATUS.NOT_STARTED) {
      getDriverAction();
    }
  }, [getDriverAction, getDriverStatus]);

  const addVehicle = async (e) => {
    e.preventDefault();
    if (data?.id) {
      await updateVehicleAction(inputValue);
    } else {
      await addVehicleAction(inputValue);
    }
    getVehicleAction();
  };

  useEffect(() => {
    if (
      addVehicleStatus === STATUS.SUCCESS ||
      updateVehicleStatus === STATUS.SUCCESS
    ) {
      resetVehicleStatus();
      closeDrawer();
    }
  }, [addVehicleStatus, closeDrawer, resetVehicleStatus, updateVehicleStatus]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addVehicle}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Vehicle" : "Add New Vehicle"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              {UpdateType == "New" ? (
                <>
                  <CustomInput
                    type={"text"}
                    name="vehicle"
                    autoFocus={true}
                    label={"Vehicle No."}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                  <CustomSelect
                    size={"md"}
                    name={"type"}
                    label={"Select Vehicle Type"}
                    notRequire={true}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    data={[
                      { name: "Bus", value: "Bus" },
                      { name: "Mini-Bus", value: "Mini-Bus" },
                      { name: "Van", value: "Van" },
                      { name: "Auto", value: "Auto" },
                    ]}
                  />
                </>
              ) : (
                <CustomSelect
                  size={"sm"}
                  name={"staffId"}
                  label={"Select Driver"}
                  inputValue={inputValue}
                  notRequire={true}
                  setInputValue={setInputValue}
                  data={map(allDrivers, (d) => ({
                    value: d.id,
                    name: d.name + " - " + d.mobileNo,
                  }))}
                />
              )}
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
              type={"submit"}
              isLoading={
                addVehicleStatus === STATUS.FETCHING ||
                updateVehicleStatus === STATUS.FETCHING
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
