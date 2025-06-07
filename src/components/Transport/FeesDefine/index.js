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
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { groupBy, map } from "lodash";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { AddFees, AddRoute, DefineFees } from "./DefineFees";
import dayjs from "dayjs";
import { useTransportStore } from "@/store/Transport";
import { STATUS } from "@/constant";
import { DeleteButton } from "@/common/DeleteButton";
import { MdCurrencyRupee, MdPercent } from "react-icons/md";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { LoadingContainer } from "@/common/LoadingContainer";
import Pagination from "@/common/Pagination";

export const FeesDefine = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    getFeesDefineAction,
    getFeesDefineStatus,
    allFeesDefines,
    paginationData,
    resetGetFeesDefine,
    deleteFeesDefineAction,
    deleteFeesDefineStatus,
    resetFeesDefineStatus,
  } = useTransportStore((s) => ({
    getFeesDefineAction: s.getFeesDefineAction,
    getFeesDefineStatus: s.getFeesDefineStatus,
    allFeesDefines: s.allFeesDefines,
    paginationData: s.paginationData,
    resetGetFeesDefine: s.resetGetFeesDefine,
    deleteFeesDefineAction: s.deleteFeesDefineAction,
    deleteFeesDefineStatus: s.deleteFeesDefineStatus,
    resetFeesDefineStatus: s.resetFeesDefineStatus,
  }));

  useEffect(() => {
    if ((getFeesDefineStatus || 1) === STATUS.NOT_STARTED) {
      getFeesDefineAction({
        sessionMasterId,
        page: currentPage,
        limit: parseInt(limit),
      });
    }
  }, [
    getFeesDefineAction,
    getFeesDefineStatus,
    sessionMasterId,
    limit,
    currentPage,
  ]);

  useEffect(() => {
    if (currentPage ) {
      getFeesDefineAction({
        sessionMasterId,
        page: currentPage,
        limit: parseInt(limit),
      });
    }
  }, [currentPage ,limit]);
  useEffect(() => {
    setCurrentPage(1);
    return () => {};
  }, [limit]);

  useEffect(() => {
    return () => resetGetFeesDefine();
  }, [resetGetFeesDefine]);

  const deleteFeesDefine = (id) => {
    deleteFeesDefineAction(id);
  };

  return (
    <Box>
      <PageHeader
        heading={"Fees Define"}
        extra={
          HasPermission(PERMISSIONS.TRANS_FEES_DEFINE_ADD) && (
            <Button
              size={"sm"}
              colorScheme={themeColor}
              onClick={() => setToggleDrawer([])}
            >
              Fees Define
            </Button>
          )
        }
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <Flex mt={2} justify={"flex-end"}>
            <Pagination
              totalItems={paginationData?.totalCount}
              limit={limit}
              setLimit={setLimit}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              themeColor={themeColor}
            />
          </Flex>
          <LoadingContainer status={getFeesDefineStatus}>
            <TableContainer mt={2}>
              <Table w="100%" size={"sm"} variant={"simple"}>
                {allFeesDefines?.length ? (
                  <>
                    <Thead>
                      <Tr bg="gray.100">
                        <Th>Class</Th>
                        <Th>Station</Th>
                        <Th>Fees Name</Th>
                        <Th>Fees Amount</Th>
                        <Th>Late Fees</Th>
                        <Th>Due Date</Th>
                        {HasPermission(PERMISSIONS.TRANS_FEES_DEFINE_EDIT) ||
                        HasPermission(PERMISSIONS.TRANS_FEES_DEFINE_DELETE) ? (
                          <Th>Action</Th>
                        ) : null}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {map(
                        groupBy(allFeesDefines, "classMasterId"),
                        (classFee, key) =>
                          map(classFee, (fee, index) => (
                            <Tr key={fee.id}>
                              {index === 0 && (
                                <Td rowSpan={classFee?.length}>
                                  {fee.class_master?.name}
                                </Td>
                              )}
                              <Td>{fee.station_master?.name}</Td>
                              <Td>{fee.transport_fee_master?.name}</Td>
                              <Td>{fee.feeAmount}</Td>
                              <Td>
                                <Flex align={"center"}>
                                  {fee.lateFees}
                                  {fee.isPercent ? (
                                    <MdPercent />
                                  ) : (
                                    <MdCurrencyRupee />
                                  )}{" "}
                                  / {fee.isDaily ? "Day" : "Month"}
                                </Flex>
                              </Td>
                              <Td>{dayjs(fee.dueDate).format("DD-MM-YYYY")}</Td>
                              {HasPermission(
                                PERMISSIONS.TRANS_FEES_DEFINE_EDIT
                              ) ||
                              HasPermission(
                                PERMISSIONS.TRANS_FEES_DEFINE_DELETE
                              ) ? (
                                <Td>
                                  {HasPermission(
                                    PERMISSIONS.TRANS_FEES_DEFINE_EDIT
                                  ) && (
                                    <Tooltip placement="top" label="Edit">
                                      <IconButton
                                        mr={3}
                                        size={"sm"}
                                        variant={"ghost"}
                                        icon={<EditIcon />}
                                        colorScheme={themeColor}
                                        onClick={() => setToggleDrawer(fee)}
                                      />
                                    </Tooltip>
                                  )}
                                  {HasPermission(
                                    PERMISSIONS.TRANS_FEES_DEFINE_DELETE
                                  ) && (
                                    <DeleteButton
                                      description={
                                        "Are you sure? Do you want to delete?"
                                      }
                                      confirm={() => deleteFeesDefine(fee.id)}
                                      status={deleteFeesDefineStatus}
                                      reset={resetFeesDefineStatus}
                                    />
                                  )}
                                </Td>
                              ) : null}
                            </Tr>
                          ))
                      )}
                    </Tbody>
                  </>
                ) : (
                  <NoData title={"No Fees Head Found"} />
                )}
              </Table>
            </TableContainer>
          </LoadingContainer>
        </Box>
        {toggleDrawer && (
          <DefineFees
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
