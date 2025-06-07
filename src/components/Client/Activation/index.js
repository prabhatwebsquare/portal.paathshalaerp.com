import { PageHeader } from "@/common/PageHeader";
import {
  Avatar,
  Badge,
  Box,
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
import { map } from "lodash";
import { useEffect, useState } from "react";
import { ClientProfile } from "../ClientList/ClientProfile";
import { FaEye } from "react-icons/fa";
import { useClientStore } from "@/store/client";
import Pagination from "@/common/Pagination";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { LoadingContainer } from "@/common/LoadingContainer";

export const ClientActivation = ({ sessionMasterId, themeColor }) => {
  const [toggleProfile, setToggleProfile] = useState(null);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    getClientRegAction,
    getClientRegStatus,
    allClientRegs,
    resetGetClientStatus,
  } = useClientStore((s) => ({
    getClientRegAction: s.getClientRegAction,
    getClientRegStatus: s.getClientRegStatus,
    allClientRegs: s.allClientRegs,
    resetGetClientStatus: s.resetGetClientStatus,
  }));
  useEffect(() => {
    if ((getClientRegStatus || 1) === STATUS.NOT_STARTED) {
      getClientRegAction({
        page: currentPage,
        pageSize: parseInt(limit),
        search: "",
        status: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getClientRegAction, getClientRegStatus]);
  useEffect(() => {
    if (currentPage && limit)
      getClientRegAction({
        page: currentPage,
        pageSize: parseInt(limit),
        search: "",
        status: 0,
      });
  }, [currentPage, getClientRegAction, limit]);

  return (
    <Box>
      <PageHeader
        heading={"Orgnization Review List"}
        extra={
          <Pagination
            totalItems={allClientRegs?.allCount}
            limit={limit}
            setLimit={setLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            themeColor={themeColor}
          />
        }
      />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
        <LoadingContainer status={getClientRegStatus}>        
          {allClientRegs?.data?.length ? (
            <TableContainer>
              <Table w="100%" size={"sm"} variant={"simple"}>
                <Thead>
                  <Tr bg="gray.100">
                    <Th>S. No.</Th>
                    <Th>School/Institute</Th>
                    <Th>School Contact</Th>
                    <Th>Name</Th>
                    <Th>Contact</Th>
                    <Th>City</Th>
                    <Th>Status</Th>
                    <Th position="sticky" right="0" bg={"gray.100"}>
                      Action
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {map(allClientRegs.data, (client, index) => (
                    <Tr
                      key={index}
                      _hover={{ bg: "gray.50" }}
                      cursor={"pointer"}
                    >
                      <Td>{index + 1}</Td>
                      <Td>
                        <Flex align={"center"}>
                          <Avatar size={"xs"} mr={2} /> {client?.schoolName}
                        </Flex>
                      </Td>
                      <Td>{client?.contactNo}</Td>
                      <Td>{client?.name}</Td>
                      <Td>{client?.mobileNo}</Td>
                      <Td>{client?.district}</Td>

                      <Td>
                        <Badge
                          fontSize={11}
                          variant={"outline"}
                          colorScheme={"yellow"}
                        >
                          Review
                        </Badge>
                      </Td>

                      <Td>
                        <IconButton
                          size={"xs"}
                          variant={"ghost"}
                          colorScheme={"blue"}
                          onClick={() => setToggleProfile(client)}
                          icon={<FaEye fontSize={14} />}
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

          {toggleProfile && (
            <ClientProfile
              data={toggleProfile}
              closeDrawer={() => setToggleProfile(null)}
              themeColor={themeColor}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
