import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Switch,
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
import { STATUS } from "@/constant";
import { DeleteButton } from "@/common/DeleteButton";
import { LoadingContainer } from "@/common/LoadingContainer";
import { AddSession } from "./AddSession";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import dayjs from "dayjs";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/LocalStorage";
import { ConfirmAlert } from "@/common/ConfirmationAlert";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { NoData } from "@/common/NoData";

export const SessionList = ({ themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [changeSession, setChangeSession] = useState(null);
  const {
    getSessionAction,
    getSessionStatus,
    allSessions,
    deleteSessionAction,
    deleteSessionStatus,
    resetSessionStatus,
    updateSessionAction,
    updateSessionStatus,
  } = useAdditionalSetupStore((s) => ({
    getSessionAction: s.getSessionAction,
    getSessionStatus: s.getSessionStatus,
    allSessions: s.allSessions,
    deleteSessionAction: s.deleteSessionAction,
    deleteSessionStatus: s.deleteSessionStatus,
    resetSessionStatus: s.resetSessionStatus,
    updateSessionAction: s.updateSessionAction,
    updateSessionStatus: s.updateSessionStatus,
  }));

  useEffect(() => {
    if ((getSessionStatus || 1) === STATUS.NOT_STARTED) {
      getSessionAction();
    }
  }, [getSessionAction, getSessionStatus]);

  const deleteSession = (id) => {
    deleteSessionAction(id);
  };
  const activeSession = () => {
    updateSessionAction({ id: changeSession.id, isDefault: 1 });
  };

  useEffect(() => {
    if (updateSessionStatus === STATUS.SUCCESS && changeSession) {
      setLocalStorageItem("sessionMasterId", changeSession.id);
      setLocalStorageItem("sessionMaster", changeSession);
      window.location.reload();
    }
  }, [changeSession, updateSessionStatus]);

  return (
    <Box pos={"relative"} h={"70vh"}>
      <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
        <LoadingContainer status={getSessionStatus}>
          {allSessions?.length ? (
           <Box p={4} bg="white" borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor="gray.300">
           <TableContainer mt={2}>
             <Table w="100%" size="md" variant="simple" colorScheme="blue">
               <Thead>
                 <Tr>
                   <Th textAlign="center" w="80px">S.No.</Th>
                   <Th textAlign="center">Session</Th>
                   <Th textAlign="center">Start Date</Th>
                   <Th textAlign="center">End Date</Th>
                   <Th textAlign="center">Active Session</Th>
                   {(HasPermission(PERMISSIONS.SESSION_EDIT) || HasPermission(PERMISSIONS.SESSION_DELETE)) && (
                     <Th textAlign="center" w="20%">Action</Th>
                   )}
                 </Tr>
               </Thead>
               <Tbody>
                 {map(allSessions, (session, index) => (
                   session && (
                     <Tr key={session.id}>
                       <Td textAlign="center">{index + 1}</Td>
                       <Td textAlign="center">{session.name}</Td>
                       <Td textAlign="center">{dayjs(session.startDate).format("DD-MMM-YYYY")}</Td>
                       <Td textAlign="center">{dayjs(session.endDate).format("DD-MMM-YYYY")}</Td>
                       <Td textAlign="center">
                         <Switch
                           colorScheme="green"
                           isChecked={session.isDefault}
                           isReadOnly={session.isDefault}
                           onChange={() => setChangeSession(session)}
                         />
                       </Td>
                       {(HasPermission(PERMISSIONS.SESSION_EDIT) || HasPermission(PERMISSIONS.SESSION_DELETE)) && (
                         <Td textAlign="center">
                           <Flex justify="center" gap={3}>
                             {HasPermission(PERMISSIONS.SESSION_EDIT) && (
                               <Tooltip label="Edit">
                                 <IconButton size="xs" icon={<EditIcon />} colorScheme="blue" onClick={() => setToggleDrawer(session)} />
                               </Tooltip>
                             )}
                             {HasPermission(PERMISSIONS.SESSION_DELETE) && (
                               <DeleteButton
                                 description="Are you sure? Do you want to delete?"
                                 confirm={() => deleteSession(session.id)}
                                 status={deleteSessionStatus}
                                 reset={resetSessionStatus}
                                 buttonProps={{ size: "sm", colorScheme: "red" }}
                               />
                             )}
                           </Flex>
                         </Td>
                       )}
                     </Tr>
                   )
                 ))}
               </Tbody>
             </Table>
           </TableContainer>
         </Box>
         
          ) : (
            <NoData title={"No Session found"} />
          )}
        </LoadingContainer>
      </Box>
      {HasPermission(PERMISSIONS.SESSION_ADD) && (
        <Tooltip placement="top" label={"Add New Session"}>
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
        <AddSession
          data={toggleDrawer}
          closeDrawer={() => setToggleDrawer(null)}
          themeColor={themeColor}
        />
      )}
      {changeSession && (
        <ConfirmAlert
          heading="Session Confirmation"
          description={`Are you sure? Do you want to change active session to ${changeSession.name}`}
          closeAlert={() => setChangeSession(null)}
          button={"Change"}
          confirm={activeSession}
        />
      )}
    </Box>
  );
};
