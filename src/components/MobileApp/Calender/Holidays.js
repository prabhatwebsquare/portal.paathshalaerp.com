import { DeleteButton } from "@/common/DeleteButton";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useExamStore } from "@/store/Exam";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Tab,
  TabList,
  Table,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { groupBy, map, orderBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { AddExam, AddHoliday, AddNoticeBoard } from "./AddHoliday";
import { PageHeader } from "@/common/PageHeader";
import { useClassSetupStore } from "@/store/classSetup";
import dayjs from "dayjs";
import { useMobileAppStore } from "@/store/MobileApp";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const Holidays = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);

  const {
    getHolidayAction,
    getHolidayStatus,
    allHolidays,
    deleteHolidayAction,
    deleteHolidayStatus,
    resetHolidayStatus,
  } = useMobileAppStore((s) => ({
    getHolidayAction: s.getHolidayAction,
    getHolidayStatus: s.getHolidayStatus,
    allHolidays: s.allHolidays,
    deleteHolidayAction: s.deleteHolidayAction,
    deleteHolidayStatus: s.deleteHolidayStatus,
    resetHolidayStatus: s.resetHolidayStatus,
  }));

  useEffect(() => {
    if ((getHolidayStatus || 1) === STATUS.NOT_STARTED) {
      getHolidayAction({ sessionMasterId });
    }
  }, [getHolidayAction, getHolidayStatus, sessionMasterId]);

  const deleteHoliday = (id) => {
    deleteHolidayAction(id);
  };
  return (
    <Box pos={"relative"} h={"60vh"}>
      <PageHeader
        heading={"Holiday"}
        extra={
          <Tooltip placement="top" label={"Add Notice Board"}>
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
        }
      />
      <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
        <LoadingContainer status={getHolidayStatus}>
          {allHolidays?.length ? (
            <TableContainer mt={2}>
              <Table w="100%" size={"sm"} variant={"simple"}>
                <Thead>
                  <Tr bg="gray.100">
                    <Th>S.No.</Th>
                    <Th>Holiday</Th>
                    <Th>StartDate</Th>
                    <Th>EndDate</Th>
                    <Th>Type</Th>
                    {HasPermission(PERMISSIONS.CALENDER_EDIT) ||
                    HasPermission(PERMISSIONS.CALENDER_DELETE) ? (
                      <Th>Action</Th>
                    ) : null}
                  </Tr>
                </Thead>
                <Tbody>
                  {map(allHolidays, (holiday, index) => (
                    <Tr key={holiday?.id}>
                      <Td>{index + 1}</Td>
                      <Td>{holiday?.title}</Td>
                      <Td>{dayjs(holiday.startDate).format("DD-MM-YYYY")}</Td>
                      <Td>{dayjs(holiday.endDate).format("DD-MM-YYYY")}</Td>
                      <Td>{holiday.type}</Td>
                      {HasPermission(PERMISSIONS.CALENDER_EDIT) ||
                      HasPermission(PERMISSIONS.CALENDER_DELETE) ? (
                        <Td>
                          {HasPermission(PERMISSIONS.CALENDER_EDIT) && (
                            <Tooltip placement="top" label="Edit">
                              <IconButton
                                mr={3}
                                size={"sm"}
                                variant={"ghost"}
                                icon={<EditIcon />}
                                colorScheme={themeColor}
                                onClick={() => setToggleDrawer(holiday)}
                              />
                            </Tooltip>
                          )}
                          {HasPermission(PERMISSIONS.CALENDER_DELETE) && (
                            <DeleteButton
                              description={
                                "Are you sure? Do you want to delete?"
                              }
                              confirm={() => deleteHoliday(holiday.id)}
                              status={deleteHolidayStatus}
                              reset={resetHolidayStatus}
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
            <NoData title={"No Holiday Found"} />
          )}
        </LoadingContainer>
        {/* {HasPermission(PERMISSIONS.CALENDER_ADD) && (
         
        )} */}
        {toggleDrawer && (
          <AddHoliday
            type={"holiday"}
            themeColor={themeColor}
            sessionMasterId={sessionMasterId}
            data={toggleDrawer}
            closeDrawer={() => setToggleDrawer(null)}
          />
        )}
      </Box>
    </Box>
  );
};
