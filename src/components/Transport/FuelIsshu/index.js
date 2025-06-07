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
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { STATUS } from "@/constant";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import AddFuelIssue from "./addFuelIsshue";
import { useTransportStore } from "@/store/Transport";
import { PageHeader } from "@/common/PageHeader";
import CustomInput from "@/common/CustomInput";
import dayjs from "dayjs";
import { CustomSelect } from "@/common/CustomSelect";

function FuelIsshu({ sessionMasterId, themeColor }) {
  const [toggleDrawer, setToggleDrawer] = useState(null);

  const {
    getFuelIssueAction,
    getFuelIsshuStatus,
    addFuelIsshu,
    deleteisshuedFuelAction,
    deletefuelStatus,
    resetFuelIssueStatus,
    getVehicleAction,
    getVehicleStatus,
    allVehicles,
  } = useTransportStore((s) => ({
    getFuelIssueAction: s.getFuelIssueAction,
    getFuelIsshuStatus: s.getFuelIsshuStatus,
    addFuelIsshu: s.addFuelIsshu,
    deleteisshuedFuelAction: s.deleteisshuedFuelAction,
    deletefuelStatus: s.deletefuelStatus,
    resetFuelIssueStatus: s.resetFuelIssueStatus,
    getVehicleAction: s.getVehicleAction,
    getVehicleStatus: s.getVehicleStatus,
    allVehicles: s.allVehicles,
  }));

  useEffect(() => {
    if ((getFuelIsshuStatus || 1) === STATUS.NOT_STARTED) {
      getFuelIssueAction({
        page: 1,
        limit: 100,
      });
    }
  }, [getFuelIssueAction, getFuelIsshuStatus]);

  const handleDelete = async (id) => {
    await deleteisshuedFuelAction(id);
    getFuelIssueAction({
      page: 1,
      limit: 100,
    });
  };
  useEffect(() => {
    if ((getVehicleStatus || 1) === STATUS.NOT_STARTED) {
      getVehicleAction();
    }
  }, [getVehicleAction, getVehicleStatus]);
  const [inputValue, setInputValue] = useState({
    date: dayjs().format("YYYY-MM-DD"),
  });

  const getData = (e) => {
    e.preventDefault();

    getFuelIssueAction({
      page: 1,
      limit: 100,
      ...inputValue
    });
  }
 
  return (
    <Box pos="relative" h="70vh">
      <PageHeader heading={"Fuel Issue"} />
      <Box className="scrollBar" maxH="100%" overflowY="scroll">
        <form onSubmit={getData}>
        <Flex gap={4} align={"center"} my={4} pl={5}>
          <CustomInput
            w={"20%"}
            size={"sm"}
            type={"month"}
            name="date"
            label={"Date"}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          <CustomSelect
            w={"20%"}
            name="vehicleId"
            label={"Select Vehicle"}
            data={map(allVehicles, (v) => ({
              name: v.vehicle,
              value: v.id,
            }))}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          <Button size={"sm"} colorScheme={themeColor} type="submit">
            Get
          </Button>
        </Flex>
        </form>

        <LoadingContainer status={getFuelIsshuStatus}>
          {addFuelIsshu?.data?.length ? (
            <Box
              p={4}
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
              borderColor="gray.300"
            >
              <TableContainer mt={2}>
                <Table w="100%" size="md" variant="simple" colorScheme="blue">
                  <Thead>
                    <Tr>
                      <Th textAlign="center" w="60px">
                        S.No.
                      </Th>
                      <Th textAlign="center">Vehicle No.</Th>
                      <Th textAlign="center">Vehicle Type</Th>
                      <Th textAlign="center">Fuel Type</Th>
                      <Th textAlign="center">Quantity</Th>
                      <Th textAlign="center">Qty Type</Th>
                      <Th textAlign="center">Remark</Th>
                      <Th textAlign="center">Date</Th>
                      <Th textAlign="center">Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(addFuelIsshu.data, (fuel, index) => (
                      <Tr key={fuel.id}>
                        <Td textAlign="center">{index + 1}</Td>
                        <Td textAlign="center">
                          {fuel.vehicle?.vehicle || "N/A"}
                        </Td>
                        <Td textAlign="center">
                          {fuel.vehicle?.type || "N/A"}
                        </Td>
                        <Td textAlign="center">{fuel.fuelType || "N/A"}</Td>
                        <Td textAlign="center">{fuel.qty}</Td>
                        <Td textAlign="center">{fuel.qtyType}</Td>
                        <Td textAlign="center">{fuel.remark || "-"}</Td>
                        <Td textAlign="center">
                          {fuel.date
                            ? new Date(fuel.date).toLocaleDateString()
                            : "-"}
                        </Td>
                        <Td textAlign="center">
                          <Flex justify="center" gap={3}>
                            <Tooltip label="Edit">
                              <IconButton
                                size="xs"
                                icon={<EditIcon />}
                                colorScheme="blue"
                                onClick={() => setToggleDrawer(fuel)}
                              />
                            </Tooltip>
                            <Tooltip label="Delete">
                              <IconButton
                                size="xs"
                                icon={<DeleteIcon />}
                                colorScheme="red"
                                onClick={() => handleDelete(fuel.id)}
                              />
                            </Tooltip>
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <NoData title={"No Fuel Issue Found"} />
          )}
        </LoadingContainer>
      </Box>

      <Tooltip placement="top" label="Add New Fuel Issue">
        <Flex
          pos="absolute"
          bottom={10}
          right={10}
          w="50px"
          h="50px"
          bg={`${themeColor}.500`}
          justify="center"
          align="center"
          borderRadius="50%"
          color="white"
          cursor="pointer"
          onClick={() => setToggleDrawer([])}
        >
          <AddIcon />
        </Flex>
      </Tooltip>

      {/* Drawer for Add / Edit */}
      {toggleDrawer && (
        <AddFuelIssue
          data={toggleDrawer}
          sessionMasterId={sessionMasterId}
          themeColor={themeColor}
          closeDrawer={() => setToggleDrawer(null)}
        />
      )}
    </Box>
  );
}

export default FuelIsshu;
