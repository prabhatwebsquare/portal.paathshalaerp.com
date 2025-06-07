import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  Switch,
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

export const MessageApproved = ({ themeColor }) => {
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState({ search: "", status: 2 });

  const {
    getBulkRequestMessageAction,
    getBulkRequestMessageStatus,
    bulkMessage,
    acceptBulkRequestAction,
  } = useAppStore((s) => ({
    getBulkRequestMessageAction: s.getBulkRequestMessageAction,
    getBulkRequestMessageStatus: s.getBulkRequestMessageStatus,
    bulkMessage: s.bulkMessage,
    acceptBulkRequestAction :s.acceptBulkRequestAction,
  }));

  useEffect(() => {
    if ((getBulkRequestMessageStatus || 1) === STATUS.NOT_STARTED) {
      getBulkRequestMessageAction({ page: 1, limit: 10, ...inputValue });
    }
  }, [getBulkRequestMessageAction, getBulkRequestMessageStatus, inputValue]);

  useEffect(() => {
    if (currentPage && limit)
      getBulkRequestMessageAction({
        page: currentPage,
        limit: parseInt(limit),
        ...inputValue,
      });
  }, [currentPage, limit, getBulkRequestMessageAction, inputValue]);

  const handleToggleStatus = async (client) => {
    const newStatus = client.isActive ? 0 : 1;
  await  acceptBulkRequestAction({ list_id : client.id ,  isActive: newStatus });
  getBulkRequestMessageAction({ page: 1, limit: 10, ...inputValue });
  };

  
  return (
    <Box h={"100%"}>
      <PageHeader heading={"SMS Account Approved"} />

      <Box p={5} bg={"white"} h={"90%"}>
        <Flex w={"65%"} gap={3} mb={2}>
          <CustomInput
            w={"40%"}
            size={"sm"}
            type={"text"}
            notRequire={true}
            name="search"
            label={"Search By School Name/Contact"}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
        </Flex>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getBulkRequestMessageStatus}>
            {bulkMessage?.length > 0?  (
              <TableContainer>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>S. No.</Th>
                      <Th>School/Institute</Th>
                      <Th>Address</Th>
                      <Th>Name</Th>
                      <Th>Contact</Th>
                      <Th>Activated Date</Th>
                      <Th position="sticky" right="0" zIndex="10" bg="gray.100">
                        SMS Activation
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(bulkMessage || [], (client, index) => (
                      <Tr key={index} _hover={{ bg: "gray.50" }} cursor="pointer">
                        <Td>{index + 1}</Td>
                        <Td>
                          <Flex align={"center"}>
                            <Avatar size={"xs"} mr={2} src={client?.logo || ""} />
                            {client?.school?.schoolName}
                          </Flex>
                        </Td>
                        <Td maxW="200px" whiteSpace="normal" wordBreak="break-word">
                          {client?.school?.address || "-"}
                        </Td>
                        <Td>{client?.school?.name || "-"}</Td>
                        <Td>{client?.school?.mobileNo || "-"}</Td>
                        <Td>
                          {client?.date ? dayjs(client?.createdAt).format("DD-MM-YYYY") : "-"}
                        </Td>
                        <Td position="sticky" right="0" zIndex="10" bg="gray.100">
                          <Switch
                            colorScheme={client.isActive ? "green" : "red"}
                            isChecked={client.isActive}
                            onChange={() => handleToggleStatus(client)}
                          />
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
