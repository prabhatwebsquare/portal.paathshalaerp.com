import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { NoData } from "@/common/NoData";
import { LoadingContainer } from "@/common/LoadingContainer";
import { PageHeader } from "@/common/PageHeader";
import { useClientStore } from "@/store/client";
import { STATUS } from "@/constant";
import { map } from "lodash";
import dayjs from "dayjs";
import CustomInput from "@/common/CustomInput";
import { useAppStore } from "@/store/App";

export const MessageRequestMore = ({ themeColor }) => {
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    getMoreMessageRequestAction,
    getMoreMessageRequestStatus,
    MoreMessage,
    resetGetClientStatus,
    updateMoreMessageRequestAction
  } = useAppStore((s) => ({
    getMoreMessageRequestAction: s.getMoreMessageRequestAction,
    getMoreMessageRequestStatus: s.getMoreMessageRequestStatus,
    MoreMessage: s.MoreMessage,
    resetGetClientStatus: s.resetGetClientStatus,
    updateMoreMessageRequestAction :s.updateMoreMessageRequestAction
  }));


  useEffect(() => {
    if ((getMoreMessageRequestStatus || 1) === STATUS.NOT_STARTED) {
      getMoreMessageRequestAction({ page: 1, limit: 10,  status : 0});
    }
  }, [getMoreMessageRequestAction, getMoreMessageRequestStatus]);

  useEffect(() => {
    if (currentPage && limit)
      getMoreMessageRequestAction({
        page: currentPage,
        limit: parseInt(limit),
        status : 0
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, getMoreMessageRequestAction, limit]);

  const handleApprove = (clientId) => {
    updateMoreMessageRequestAction({ id: clientId, messageStatus: 1  , status : 1 });
  };

  return (
    <Box h={"100%"}>
      <PageHeader heading={"Bulk SMS Request"} />
      <Box p={5} bg={"white"} h={"90%"}>
      <Flex w={"65%"} gap={3} mb={2}>
              <CustomInput
                w={"40%"}
                size={"sm"}
                type={"text"}
                notRequire={true}
                name="search"
                label={"Search By School Name/Contact"}
                // inputValue={inputValue}
                // setInputValue={setInputValue}
              />
       
         
            </Flex>
         
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getMoreMessageRequestStatus}>
            {MoreMessage?.data?.length ? (
              <TableContainer>
              <Table w="100%" size={"sm"} variant={"simple"}>
                <Thead>
                  <Tr bg="gray.100">
                    <Th>S. No.</Th>
                    <Th>School Code</Th>
                    <Th>School/Institute</Th>
                    <Th>Address</Th>
                    <Th>Email</Th>
                    <Th>Contact</Th>
                    <Th>Message Plan</Th>
                    <Th>Messages Remaining</Th>
                    <Th>Amount</Th>
                    <Th>Payment Status</Th>
                    <Th>Request Date</Th>
                    <Th position="sticky" right="0" zIndex="10" bg="gray.100">
                      Action
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {map(MoreMessage.data, (client, index) => (
                    <Tr key={index} _hover={{ bg: "gray.50" }} cursor="pointer">
                      <Td>{index + 1}</Td>
                      <Td>{client?.schoolCode || "-"}</Td>
                      <Td>
                        <Flex align={"center"}>
                          <Avatar size={"xs"} mr={2} /> {client?.school?.schoolName || "-"}
                        </Flex>
                      </Td>
                      <Td maxW="200px" whiteSpace="normal" wordBreak="break-word">
                        {client?.school?.address || "-"}
                      </Td>
                      <Td>{client?.school?.schoolEmail || "-"}</Td>
                      <Td>{client?.school?.mobileNo || "-"}</Td>
                      <Td>{client?.totalMessage || "25000"}</Td>
                      <Td>{client?.messageStatus ? "Active" : "Inactive"}</Td>
                      <Td>₹{client?.amount || "3500"}</Td>
                      <Td>{client?.status === 1 ? "Paid" : "Pending"}</Td>
                      <Td>
                        {client?.createdAt ? dayjs(client?.createdAt).format("DD-MM-YYYY") : "-"}
                      </Td>
                      <Td position="sticky" right="0" zIndex="10" bg="gray.100">
                        <Button size="xs" colorScheme="green" onClick={() => handleApprove(client.id)}>
                          Approve
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            ) : (
              <NoData title={"No Client Found"} />
            )}
          </LoadingContainer>
        </Box>
      </Box>
    </Box>
  );
};
