import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
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
import { LoadingContainer } from "@/common/LoadingContainer";
import { DeleteButton } from "@/common/DeleteButton";
import { STATUS } from "@/constant";
import { useAdminBiometricStore } from "@/store/Biometric";
import { AddBiometric } from "./addBiometric";

export const AdminBiometric = ({ themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const {
    getBiometricAction,
    getBiometricStatus,
    allBiometricDevices,
    deleteBiometricAction,
    deleteBiometricStatus,
    resetBiometricStatus,
  } = useAdminBiometricStore((s) => ({
    getBiometricAction: s.getBiometricAction,
    getBiometricStatus: s.getBiometricStatus,
    allBiometricDevices: s.allBiometricDevices,
    deleteBiometricAction: s.deleteBiometricAction,
    deleteBiometricStatus: s.deleteBiometricStatus,
    resetBiometricStatus: s.resetBiometricStatus,
  }));

  useEffect(() => {
    if ((getBiometricStatus || 1) === STATUS.NOT_STARTED) {
      getBiometricAction({
        page: 1,
        limit: 10,
      });
    }
  }, [getBiometricAction, getBiometricStatus]);

  const deleteBiometric = (id) => {
    deleteBiometricAction(id);
  };

  return (
    <Box>
      <PageHeader
        heading={"Biometric"}
        extra={
          <Button
            size={"sm"}
            colorScheme={themeColor}
            onClick={() => setToggleDrawer([])}
          >
            Add Biometric Device
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
          <LoadingContainer status={getBiometricStatus}>
          <TableContainer mt={2}>
  <Table w="100%" size={"sm"} variant={"simple"}>
    <Thead>
      <Tr bg="gray.100">
        <Th>S.No.</Th>
        <Th>School Name</Th>
        <Th>Device ID</Th>
        <Th>Biometric Type</Th>
        <Th>Used For</Th>
        <Th>School Code</Th>
        <Th>Status</Th>
        <Th>Action</Th>
      </Tr>
    </Thead>
    <Tbody>
      {allBiometricDevices?.length ? (
        map(allBiometricDevices, (device, index) => (
          <Tr key={device.id}>
            <Td>{index + 1}</Td>
            <Td>{device.schoolName || "N/A"}</Td>
            <Td>{device.deviceId || "N/A"}</Td>
            <Td>{device.biometricType || "N/A"}</Td>
            <Td>{device.type || "N/A"}</Td>
            <Td>{device.schoolCode || "N/A"}</Td>
            <Td>{device.status === 0 ? "Active" : "Inactive"}</Td>
            <Td>
              <Tooltip placement="top" label="Edit">
                <IconButton
                  mr={3}
                  size={"sm"}
                  variant={"ghost"}
                  icon={<EditIcon />}
                  colorScheme={themeColor}
                  onClick={() => setToggleDrawer(device)}
                />
              </Tooltip>
              <DeleteButton
                description={"Are you sure? Do you want to delete?"}
                confirm={() => deleteBiometric(device.id)}
                status={deleteBiometricStatus}
                reset={resetBiometricStatus}
              />
            </Td>
          </Tr>
        ))
      ) : (
        <Tr>
          <Td colSpan={8} textAlign={"center"} fontWeight={"semibold"}>
            No Biometric Device Found
          </Td>
        </Tr>
      )}
    </Tbody>
  </Table>
</TableContainer>

          </LoadingContainer>
        </Box>
        {toggleDrawer && (
          <AddBiometric
            data={toggleDrawer}
            closeDrawer={() => setToggleDrawer(null)}
            themeColor={themeColor}
          />
        )}
      </Box>
    </Box>
  );
};
