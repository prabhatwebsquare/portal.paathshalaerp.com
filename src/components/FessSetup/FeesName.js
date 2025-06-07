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
import { AddFeesName } from "./AddFeesName";
import { useFeesSetupStore } from "@/store/feesSetup";
import { LoadingContainer } from "@/common/LoadingContainer";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { NoData } from "@/common/NoData";

export const FeesName = ({ themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const {
    getFeesNameAction,
    getFeesNameStatus,
    allFeesNames,
    deleteFeesNameAction,
    deleteFeesNameStatus,
    resetFeesNameStatus,
  } = useFeesSetupStore((s) => ({
    getFeesNameAction: s.getFeesNameAction,
    getFeesNameStatus: s.getFeesNameStatus,
    allFeesNames: s.allFeesNames,
    deleteFeesNameAction: s.deleteFeesNameAction,
    deleteFeesNameStatus: s.deleteFeesNameStatus,
    resetFeesNameStatus: s.resetFeesNameStatus,
  }));

  useEffect(() => {
    if ((getFeesNameStatus || 1) === STATUS.NOT_STARTED) {
      getFeesNameAction();
    }
  }, [getFeesNameAction, getFeesNameStatus]);

  const deleteFeesName = (id) => {
    deleteFeesNameAction(id);
  };

  return (
    <Box pos={"relative"} h={"70vh"}>
      <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
        <LoadingContainer status={getFeesNameStatus}>
          {allFeesNames?.length ? (
           <Box p={4} bg="white" borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor="gray.300">
           <TableContainer mt={2}>
             <Table w="100%" size="md" variant="simple" colorScheme="blue">
               <Thead>
                 <Tr>
                   <Th textAlign="center" w="100px">S.No.</Th>
                   <Th textAlign="center">Fees Name</Th>
                   <Th textAlign="center">Order No.</Th>
                   {(HasPermission(PERMISSIONS.FEES_NAME_EDIT) ||
                     HasPermission(PERMISSIONS.FEES_NAME_DELETE)) && (
                     <Th textAlign="center" w="20%">Action</Th>
                   )}
                 </Tr>
               </Thead>
               <Tbody>
                 {map(allFeesNames, (fee, index) => (
                   <Tr key={fee.id}>
                     <Td textAlign="center">{index + 1}</Td>
                     <Td textAlign="center">{fee.name}</Td>
                     <Td textAlign="center">{fee.orderId}</Td>
                     {(HasPermission(PERMISSIONS.FEES_NAME_EDIT) ||
                       HasPermission(PERMISSIONS.FEES_NAME_DELETE)) && (
                       <Td textAlign="center">
                         {fee.id !== 1 && (
                           <Flex justify="center" gap={3}>
                             {HasPermission(PERMISSIONS.FEES_NAME_EDIT) && (
                               <Tooltip label="Edit">
                                 <IconButton
                                   size="xs"
                                   icon={<EditIcon />}
                                   colorScheme="blue"
                                   onClick={() => setToggleDrawer(fee)}
                                 />
                               </Tooltip>
                             )}
                             {HasPermission(PERMISSIONS.FEES_NAME_DELETE) && (
                               <DeleteButton
                                 size="xs"
                                 description="Are you sure? Do you want to delete?"
                                 confirm={() => deleteFeesName(fee.id)}
                                 status={deleteFeesNameStatus}
                                 reset={resetFeesNameStatus}
                                 buttonProps={{ size: "sm", colorScheme: "red" }}
                               />
                             )}
                           </Flex>
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
            <NoData title={"No Fee Name Found"} />
          )}
        </LoadingContainer>
      </Box>
      {HasPermission(PERMISSIONS.FEES_NAME_ADD) && (
        <Tooltip placement="top" label={"Add New Fees Name"}>
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
        <AddFeesName
          data={toggleDrawer}
          themeColor={themeColor}
          closeDrawer={() => setToggleDrawer(null)}
        />
      )}
    </Box>
  );
};
