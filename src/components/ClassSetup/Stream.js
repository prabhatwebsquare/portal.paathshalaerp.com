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
import { AddStream } from "./AddStream";
import { LoadingContainer } from "@/common/LoadingContainer";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { NoData } from "@/common/NoData";

export const Stream = ({ themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const {
    getStreamAction,
    getStreamStatus,
    allStreams,
    deleteStreamAction,
    deleteStreamStatus,
    resetStreamStatus,
  } = useClassSetupStore((s) => ({
    getStreamAction: s.getStreamAction,
    getStreamStatus: s.getStreamStatus,
    allStreams: s.allStreams,
    deleteStreamAction: s.deleteStreamAction,
    deleteStreamStatus: s.deleteStreamStatus,
    resetStreamStatus: s.resetStreamStatus,
  }));

  useEffect(() => {
    if ((getStreamStatus || 1) === STATUS.NOT_STARTED) {
      getStreamAction();
    }
  }, [getStreamAction, getStreamStatus]);

  const deleteStream = (id) => {
    deleteStreamAction(id);
  };

  return (
    <Box pos={"relative"} h={"70vh"}>
      <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
        <LoadingContainer status={getStreamStatus}>
          {allStreams?.length ? (
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
                    <Th textAlign="center">Stream</Th>
                    {(HasPermission(PERMISSIONS.STREAM_EDIT) ||
                      HasPermission(PERMISSIONS.STREAM_DELETE)) && (
                      <Th textAlign="center">Action</Th>
                    )}
                  </Tr>
                </Thead>
                <Tbody>
                  {map(allStreams, (stream, index) => (
                    <Tr key={stream.id}>
                      <Td textAlign="center">{index + 1}</Td>
                      <Td textAlign="center">{stream.name}</Td>
                      {(HasPermission(PERMISSIONS.STREAM_EDIT) ||
                        HasPermission(PERMISSIONS.STREAM_DELETE)) && (
                        <Td textAlign="center">
                          {HasPermission(PERMISSIONS.STREAM_EDIT) && (
                            <Tooltip placement="top" label="Edit">
                              <IconButton
                                mr={3}
                                size="xs"
                                icon={<EditIcon />}
                                colorScheme="blue"
                                onClick={() => setToggleDrawer(stream)}
                              />
                            </Tooltip>
                          )}
                          {HasPermission(PERMISSIONS.STREAM_DELETE) && (
                            <DeleteButton
                              description="Are you sure? Do you want to delete?"
                              confirm={() => deleteStream(stream.id)}
                              status={deleteStreamStatus}
                              reset={resetStreamStatus}
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
          ) : (
            <NoData title={"No Stream found"} />
          )}
        </LoadingContainer>
      </Box>
      {HasPermission(PERMISSIONS.STREAM_ADD) && (
        <Tooltip placement="top" label={"Add New Stream"}>
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
        <AddStream
          streamData={toggleDrawer}
          closeDrawer={() => setToggleDrawer(null)}
          themeColor={themeColor}
        />
      )}
    </Box>
  );
};
