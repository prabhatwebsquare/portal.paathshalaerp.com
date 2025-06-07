import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
import { useAdditionalSetupStore } from "@/store/additionalSetup"; // update if needed
import { useTransportStore } from "@/store/Transport";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  VStack,
} from "@chakra-ui/react";
import { map } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";

function AddFuelIssue({
  data,
  sessionMasterId,
  themeColor,
  closeDrawer,
  vehicleOptions,
}) {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          date: moment(data.date).format("YYYY-MM-DD"),
          vehicleId: data.vehicleId,
          fuelType: data.fuelType,
          qtyType: data.qtyType,
          qty: data.qty,
          id: data.id,
          remark: data.remark,
        }
      : {}
  );

  const {
    getVehicleAction,
    getVehicleStatus,
    allVehicles,
    addFuelIssueAction,
    addFuelIsshuStatus,
    updateFuelIssueAction,
    updateFuelIssueStatus,
    resetFuelIssueStatus,
    getFuelIssueAction,
    getFuelIsshuStatus,
  } = useTransportStore((s) => ({
    getVehicleAction: s.getVehicleAction,
    getVehicleStatus: s.getVehicleStatus,
    allVehicles: s.allVehicles,
    addFuelIssueAction: s.addFuelIssueAction,
    addFuelIsshuStatus: s.addFuelIsshuStatus,
    updateFuelIssueAction: s.updateFuelIssueAction,
    updateFuelIssueStatus: s.updateFuelIssueStatus,
    resetFuelIssueStatus: s.resetFuelIssueStatus,
    getFuelIssueAction: s.getFuelIssueAction,
    getFuelIsshuStatus: s.getFuelIsshuStatus,
  }));

  const submitFuelIssue = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateFuelIssueAction({
        ...inputValue,
        sessionMasterId,
      });
    } else {
      addFuelIssueAction({
        ...inputValue,
        sessionMasterId,
      });
    }
  };

  useEffect(() => {
    if (
      addFuelIsshuStatus === STATUS.SUCCESS ||
      updateFuelIssueStatus === STATUS.SUCCESS
    ) {
      getFuelIssueAction({
        page: 1,
        limit: 100,
      });
      resetFuelIssueStatus();
      closeDrawer();
    }
  }, [
    addFuelIsshuStatus,
    closeDrawer,
    getFuelIssueAction,
    resetFuelIssueStatus,
    updateFuelIssueStatus,
  ]);

  useEffect(() => {
    if ((getVehicleStatus || 1) === STATUS.NOT_STARTED) {
      getVehicleAction();
    }
  }, [getVehicleAction, getVehicleStatus]);
  return (
    <Drawer isOpen={!!data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitFuelIssue}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Fuel Issue" : "Fuel Issue"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type="date"
                name="date"
                label="Select Date"
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomSelect
                name="vehicleId"
                label={"Select Vehicle"}
                data={map(allVehicles, (v) => ({
                  name: v.vehicle,
                  value: v.id,
                }))}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />

              <CustomSelect
                name="fuelType"
                label="Select Fuel Type"
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[
                  { name: "Petrol", value: "detrol" },
                  { name: "Diesel", value: "diesel" },
                  { name: "CNG", value: "cng" },
                ]}
              />
              <CustomSelect
                name="qtyType"
                label="Select Quantity Type"
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[
                  { name: "Kg", value: "kg" },
                  { name: "Litre", value: "litre" },
                ]}
              />
              <CustomInput
                type="number"
                name="qty"
                label="Quantity"
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomTextarea
                w={"100%"}
                rows={2}
                top={"30%"}
                notRequire={true}
                type={"text"}
                name="remark"
                label={"Remark"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
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
                addFuelIsshuStatus === STATUS.FETCHING ||
                updateFuelIssueStatus === STATUS.FETCHING
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
}

export default AddFuelIssue;
