import { ConfirmAlert } from "@/common/ConfirmationAlert";
import CustomInput from "@/common/CustomInput";
import { DeleteButton } from "@/common/DeleteButton";
import { PageHeader } from "@/common/PageHeader";
import { MODULES } from "@/constant/Modules";
import { AddIcon, CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
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
import dayjs from "dayjs";
import { findIndex, map } from "lodash";
import { useEffect, useState } from "react";
import { ClientProfile } from "../ClientList/ClientProfileApp";
import { FaEye } from "react-icons/fa";
import { NoData } from "@/common/NoData";
import { LoadingContainer } from "@/common/LoadingContainer";
import { useClientStore } from "@/store/client";
import { STATUS } from "@/constant";

export const AppActivation = ({ sessionMasterId, themeColor }) => {
  const [toggleProfile, setToggleProfile] = useState(null);
  const {
    getOrderRequestAction,
    getOrderRequestStatus,
    allOrderRequests,
    resetGetOrderRequestStatus,
  } = useClientStore((s) => ({
    getOrderRequestAction: s.getOrderRequestAction,
    getOrderRequestStatus: s.getOrderRequestStatus,
    allOrderRequests: s.allOrderRequests,
    resetGetOrderRequestStatus: s.resetGetOrderRequestStatus,
  }));

  useEffect(() => {
    if ((getOrderRequestStatus || 1) === STATUS.NOT_STARTED) {
      const data = {
        status: 1,
      };
      getOrderRequestAction(data);
    }
  }, [getOrderRequestAction, getOrderRequestStatus]);

  useEffect(() => {
    return () => resetGetOrderRequestStatus();
  }, [resetGetOrderRequestStatus]);
  return (
    <Box>
      <PageHeader heading={"App Orgnization Review List"} />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getOrderRequestStatus}>
          {allOrderRequests?.length ? (
              <TableContainer>
                <Table w="100%" size="sm" variant="simple">
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>S. No.</Th>
                      <Th>Org. Code</Th>
                      {/* <Th>Order ID</Th> */}
                      <Th>Name</Th>
                      <Th>Contact</Th>
                      {/* <Th>Emp ID</Th> */}
                      <Th>Request Date</Th>
                      <Th>Student Limit</Th>
                      <Th>Per Student Plan</Th>
                      <Th>Total Amount</Th>
                      <Th>Advance Amount</Th>
                      <Th>Photo Gallery Limit</Th>
                      <Th>School Name</Th>
                      <Th>School Email</Th>
                      <Th>School Contact</Th>
                      <Th>School Address</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(allOrderRequests, (req, index) => (
                      <Tr
                        key={index}
                        _hover={{ bg: "gray.50" }}
                        cursor="pointer"
                      >
                        <Td>{index + 1}</Td>
                        <Td>{req?.orgCode}</Td>
                        {/* <Td>{req?.orderId}</Td> */}
                        <Td>{req?.name}</Td>
                        <Td>{req?.contact}</Td>
                        {/* <Td>{req?.empCode || "-"}</Td> */}
                        <Td>
                          {req?.date
                            ? dayjs(req.date).format("DD-MM-YYYY")
                            : "-"}
                        </Td>
                        <Td>{req?.studentCount}</Td>
                        <Td>{req?.perStudentPlan}</Td>
                        <Td>{req?.totalAmount}</Td>
                        <Td>{req?.advanceAmount}</Td>
                        <Td>{req?.photoGallaryLimit}</Td>
                        <Td>{req?.schoolData?.schoolName || "-"}</Td>
                        <Td>{req?.schoolData?.schoolEmail || "-"}</Td>
                        <Td>{req?.schoolData?.mobileNo || "-"}</Td>
                        <Td>{req?.schoolData?.address || "-"}</Td>
                        <Td>
                        <IconButton
                            size={"xs"}
                            variant={"ghost"}
                            colorScheme={"blue"}
                            onClick={() => setToggleProfile(req)}
                            icon={<FaEye fontSize={14} />}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No App Request Found"} />
            )}
            {toggleProfile && (
              <ClientProfile
                data={toggleProfile}
                closeDrawer={() => setToggleProfile(null)}
                themeColor={themeColor}
              />
            )}
          </LoadingContainer>
        </Box>
      </Box>
    </Box>
  );
};
