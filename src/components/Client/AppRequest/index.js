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

export const AppRequest = ({ themeColor }) => {
  const [toggleProceed, setToggleProceed] = useState(null);

  const {
    getAppRequestAction,
    getAppRequestStatus,
    allAppRequests,
    resetGetAppRequestStatus,
  } = useClientStore((s) => ({
    getAppRequestAction: s.getAppRequestAction,
    getAppRequestStatus: s.getAppRequestStatus,
    allAppRequests: s.allAppRequests,
    resetGetAppRequestStatus: s.resetGetAppRequestStatus,
  }));

  useEffect(() => {
    if ((getAppRequestStatus || 1) === STATUS.NOT_STARTED) {
      getAppRequestAction();
    }
  }, [getAppRequestAction, getAppRequestStatus]);

  useEffect(() => {
    return () => resetGetAppRequestStatus();
  }, [resetGetAppRequestStatus]);

  return (
    <Box>
      <PageHeader heading={"App Request List"} />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getAppRequestStatus}>
            {allAppRequests?.length ? (
              <TableContainer>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>S. No.</Th>
                      <Th>Org. Code</Th>
                      <Th>Institute Name</Th>
                      <Th>Contact</Th>
                      <Th>Request Date</Th>
                      <Th>Student Count</Th>
                      <Th>Affiliation No.</Th>
                      <Th>School Email</Th>
                      <Th>School Mobile</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(allAppRequests, (req, index) => (
                      <Tr
                        key={index}
                        _hover={{ bg: "gray.50" }}
                        cursor={"pointer"}
                      >
                        <Td>{index + 1}</Td>
                        <Td>{req?.orgCode || "-"}</Td>
                        <Td>{req?.name || "-"}</Td>
                        <Td>{req?.contact || "-"}</Td>
                        <Td>
                          {req?.date
                            ? dayjs(req.date).format("DD-MM-YYYY")
                            : "-"}
                        </Td>
                        <Td>{req?.studentCount || "-"}</Td>
                        <Td>{req?.schoolData?.affNo || "-"}</Td>
                        <Td>{req?.schoolData?.schoolEmail || "-"}</Td>
                        <Td>{req?.schoolData?.mobileNo || "-"}</Td>
                        <Td>
                          <Tooltip placement="top" label="Proceed">
                            <IconButton
                              size={"xs"}
                              variant={"ghost"}
                              icon={
                                <AiOutlineDeliveredProcedure fontSize={16} />
                              }
                              onClick={() => setToggleProceed(req)}
                              colorScheme={"blue"}
                            />
                          </Tooltip>
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
