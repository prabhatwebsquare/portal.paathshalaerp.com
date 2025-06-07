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
import { SMSGatewaySettings } from "./SMSSetting";
import { NoData } from "@/common/NoData";
import { LoadingContainer } from "@/common/LoadingContainer";
import { PageHeader } from "@/common/PageHeader";
import { useClientStore } from "@/store/client";
import { STATUS } from "@/constant";
import { map } from "lodash";
import dayjs from "dayjs";
import CustomInput from "@/common/CustomInput";
import { useAppStore } from "@/store/App";

export const MessageRequest = ({ themeColor }) => {
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    getBulkRequestMessageAction,
    getBulkRequestMessageStatus,
    bulkMessage,
  } = useAppStore((s) => ({
    getBulkRequestMessageAction: s.getBulkRequestMessageAction,
    getBulkRequestMessageStatus: s.getBulkRequestMessageStatus,
    bulkMessage: s.bulkMessage,
  }));


  const [inputValue, setInputValue] = useState({ search: "", status: 1 });

  useEffect(() => {
    if ((getBulkRequestMessageStatus || 1) === STATUS.NOT_STARTED) {
      getBulkRequestMessageAction({ page: 1, limit: 10, ...inputValue , isActive : 1 });
    }
  }, [getBulkRequestMessageAction, getBulkRequestMessageStatus]);

  useEffect(() => {
    if (currentPage && limit)
      getBulkRequestMessageAction({
        page: currentPage,
        limit: parseInt(limit),
        isActive : 1,
        ...inputValue,
      });
  }, [currentPage, getBulkRequestMessageAction, limit]);

  const handleOpenModal = (schoolData) => {
    setSelectedSchool(schoolData);
  };

  const handleCloseModal = () => {
    setSelectedSchool(null);
  };

  return (
    <Box h={"100%"}>
      <PageHeader heading={"Message Request List"} />
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
            {bulkMessage?.length ? (
              <TableContainer>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>S. No.</Th>
                      <Th>School/Institute</Th>
                      <Th>Address</Th>
                      <Th>Name</Th>
                      <Th>Contact</Th>
                      <Th>Request Date</Th>
                      <Th position="sticky" right="0" zIndex="10" bg="gray.100">
                        Action
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(bulkMessage, (client, index) => {
                      const school = client?.school || {};
                      return (
                        <Tr
                          key={index}
                          _hover={{ bg: "gray.50" }}
                          cursor="pointer"
                        >
                          <Td>{index + 1}</Td>
                          <Td>
                            <Flex align={"center"}>
                              <Avatar size={"xs"} mr={2} />
                              {school?.schoolName || "N/A"}
                            </Flex>
                          </Td>
                          <Td
                            maxW="200px"
                            whiteSpace="normal"
                            wordBreak="break-word"
                          >
                            {school?.address || "N/A"}
                          </Td>
                          <Td>{school?.name || "N/A"}</Td>
                          <Td>{school?.mobileNo || "N/A"}</Td>
                          <Td>
                            {client?.date
                              ? dayjs(client.date).format("DD-MM-YYYY")
                              : "-"}
                          </Td>
                          <Td
                            position="sticky"
                            right="0"
                            zIndex="10"
                            bg="gray.100"
                          >
                            <Button
                              size="xs"
                              colorScheme={themeColor}
                              onClick={() => handleOpenModal(client)}
                            >
                              SMS Activate
                            </Button>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Client Found"} />
            )}
          </LoadingContainer>

          {/* SMS Gateway Settings Modal */}
          {selectedSchool && (
            <SMSGatewaySettings
              data={selectedSchool}
              closeModal={handleCloseModal}
              themeColor={themeColor}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
