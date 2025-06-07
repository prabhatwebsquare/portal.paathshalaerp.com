import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
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
import { useClassSetupStore } from "@/store/classSetup";
import { STATUS } from "@/constant";
import { DeleteButton } from "@/common/DeleteButton";
import { AddHouse } from "./AddHouse";
import { LoadingContainer } from "@/common/LoadingContainer";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { NoData } from "@/common/NoData";
import dayjs from "dayjs";
import { AddShift } from "./AddShift";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { HasPermission } from "@/common/HasPermission";
import moment from "moment";

export const ShiftManagement = ({ themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const {
    getShiftAction,
    getShiftStatus,
    allShifts,
    deleteShiftAction,
    deleteShiftStatus,
    resetShiftStatus,
  } = useAdditionalSetupStore((s) => ({
    getShiftAction: s.getShiftAction,
    getShiftStatus: s.getShiftStatus,
    allShifts: s.allShifts,
    deleteShiftAction: s.deleteShiftAction,
    deleteShiftStatus: s.deleteShiftStatus,
    resetShiftStatus: s.resetShiftStatus,
  }));

  useEffect(() => {
    if ((getShiftStatus || 1) === STATUS.NOT_STARTED) {
      getShiftAction();
    }
  }, [getShiftAction, getShiftStatus]);

  const deleteShift = (id) => {
    deleteShiftAction(id);
  };
  const convertTo12HourFormat = (time24) => {
    return moment(time24, "HH:mm:ss").format("hh:mm A");
  };
  return (
    <Box pos={"relative"} h={"70vh"}>
      <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
        <Box
          p={4}
          bg="white"
          borderRadius="lg"
          boxShadow="md"
          borderWidth="1px"
          borderColor="gray.300"
        >
          <TableContainer mt={2}>
            <Table w="100%" size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th textAlign="center">S.No.</Th>
                  <Th textAlign="center">Shift</Th>
                  <Th textAlign="center">In Time</Th>
                  <Th textAlign="center">Out Time</Th>
                  {(HasPermission(PERMISSIONS.SHIFT_MANAGEMENT_EDIT) ||
                    HasPermission(PERMISSIONS.SHIFT_MANAGEMENT_DELETE)) && (
                    <Th textAlign="center">Action</Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {allShifts?.map((shift, index) => (
                  <Tr key={shift.id}>
                    <Td textAlign="center">{index + 1}</Td>
                    <Td textAlign="center">{shift.name || "N/A"}</Td>
                    <Td textAlign="center">
                      {shift.startTime
                        ? convertTo12HourFormat(shift.startTime)
                        : "N/A"}
                    </Td>
                    <Td textAlign="center">
                      {shift.endTime
                        ? convertTo12HourFormat(shift.endTime)
                        : "N/A"}
                    </Td>
                    {(HasPermission(PERMISSIONS.SHIFT_MANAGEMENT_EDIT) ||
                      HasPermission(PERMISSIONS.SHIFT_MANAGEMENT_DELETE)) && (
                      <Td textAlign="center">
                        {HasPermission(PERMISSIONS.SHIFT_MANAGEMENT_EDIT) && (
                          <Tooltip placement="top" label="Edit">
                            <IconButton
                              size="xs"
                              mr={3}
                              icon={<EditIcon />}
                              colorScheme="blue"
                              onClick={() => setToggleDrawer(shift)}
                            />
                          </Tooltip>
                        )}
                        {HasPermission(PERMISSIONS.SHIFT_MANAGEMENT_DELETE) && (
                          <DeleteButton
                            description="Are you sure? Do you want to delete?"
                            confirm={() => deleteShift(shift.id)}
                          />
                        )}
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      {HasPermission(PERMISSIONS.SHIFT_MANAGEMENT_ADD) && (
        <Tooltip placement="top" label={"Add New Shift"}>
          <Flex
            pos={"absolute"}
            bottom={10}
            right={10}
            w={"50px"}
            h={"50px"}
            bg={`${themeColor}.500`}
            justify={"center"}
            align={"center"}
            borderRadius={"50%"}
            color={"white"}
            onClick={() => setToggleDrawer([])}
          >
            <AddIcon />
          </Flex>
        </Tooltip>
      )}
      {toggleDrawer && (
        <AddShift
          data={toggleDrawer}
          themeColor={themeColor}
          closeDrawer={() => setToggleDrawer(null)}
        />
      )}
    </Box>
  );
};
