import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
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
import React, { useEffect, useState } from "react";
import { STATUS } from "@/constant";
import { useFeesSetupStore } from "@/store/feesSetup";
import { LoadingContainer } from "@/common/LoadingContainer";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { AddProspectusFees } from "./AddProspectusFees";

export const ProspectusFees = ({ themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const { getBrocherFeesAction, getBrocherFeesStatus, brocherFees } =
    useFeesSetupStore((s) => ({
      getBrocherFeesAction: s.getBrocherFeesAction,
      getBrocherFeesStatus: s.getBrocherFeesStatus,
      brocherFees: s.brocherFees,
    }));

  useEffect(() => {
    if ((getBrocherFeesStatus || 1) === STATUS.NOT_STARTED) {
      getBrocherFeesAction();
    }
  }, [getBrocherFeesAction, getBrocherFeesStatus]);

  return (
    <Box pos={"relative"} h={"70vh"}>
      <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
        <LoadingContainer status={getBrocherFeesStatus}>
          {brocherFees !== null && (
            <Box
              p={4}
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
              borderColor="gray.300"
            >
              <TableContainer mt={2}>
                <Table w="100%" size="md" variant="simple" colorScheme="blue">
                  <Thead>
                    <Tr>
                      <Th textAlign="center">Name</Th>
                      <Th textAlign="center">Amount</Th>
                      <Th textAlign="center">Status</Th>
                      <Th textAlign="center" w="20%">
                        Action
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td textAlign="center">{brocherFees?.name}</Td>
                      <Td textAlign="center">{brocherFees?.amount}</Td>
                      <Td textAlign="center">
                        {parseInt(brocherFees?.status) === 1 ? (
                          <Badge
                            variant="solid"
                            fontSize="sm"
                            fontWeight="medium"
                            colorScheme="green"
                          >
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="solid"
                            fontSize="sm"
                            fontWeight="medium"
                            colorScheme="red"
                          >
                            InActive
                          </Badge>
                        )}
                      </Td>
                      <Td textAlign="center">
                        <Tooltip label="Edit">
                          <IconButton
                            size="xs"
                            icon={<EditIcon />}
                            colorScheme="blue"
                            onClick={() => setToggleDrawer(brocherFees)}
                          />
                        </Tooltip>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </LoadingContainer>
      </Box>
      {HasPermission(PERMISSIONS.PROSPECTUS_FEES) && (
        <Tooltip placement="top" label={"Add New Prospectus Name"}>
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
        <AddProspectusFees
          data={toggleDrawer}
          themeColor={themeColor}
          closeDrawer={() => setToggleDrawer(null)}
        />
      )}
    </Box>
  );
};
