import CustomInput from "@/common/CustomInput";
import { DeleteButton } from "@/common/DeleteButton";
import { PageHeader } from "@/common/PageHeader";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  Select,
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
import { map } from "lodash";
import { useEffect, useState } from "react";
import { AppProceed } from "./AppProceed";
import { AiOutlineDeliveredProcedure } from "react-icons/ai";
import { useClientStore } from "@/store/client";
import { STATUS } from "@/constant";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";

export const OrderList = ({ themeColor }) => {
  const [toggleProceed, setToggleProceed] = useState(null);
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
        // date: "2024-09-04",
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
      <PageHeader heading={"App Order List"} />
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
                      <Th>Order ID</Th>
                      <Th>Name</Th>
                      <Th>Contact</Th>
                      <Th>Emp ID</Th>
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
                        <Td>{req?.orderId}</Td>
                        <Td>{req?.name}</Td>
                        <Td>{req?.contact}</Td>
                        <Td>{req?.empCode || "-"}</Td>
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
                          <Button
                            size="md"
                            variant="solid"
                            colorScheme={themeColor}
                            onClick={() => setToggleProceed(req)}
                            borderRadius="full"
                            boxShadow="lg"
                            _hover={{
                              bg: `${themeColor}.700`,
                              transform: "scale(1.050)",
                              boxShadow: "xl",
                            }}
                            _active={{
                              bg: `${themeColor}.700`,
                              transform: "scale(0.95)",
                            }}
                          >
                            Make Payment
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No App Request Found"} />
            )}

            {toggleProceed && (
              <AppProceed
                data={toggleProceed}
                closeDrawer={() => setToggleProceed(null)}
                themeColor={themeColor}
              />
            )}
          </LoadingContainer>
        </Box>
      </Box>
    </Box>
  );
};
