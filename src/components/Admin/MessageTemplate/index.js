import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
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
import { PageHeader } from "@/common/PageHeader";
import { AddMessage } from "./AddMessage";
import { useAdminStore } from "@/store/AdminStore";
import { DeleteButton } from "@/common/DeleteButton";
import { LoadingContainer } from "@/common/LoadingContainer";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { STATUS } from "@/constant";
import { GrUpdate } from "react-icons/gr";

export const MessageTemplate = ({ themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);

  const {
    getMessageTemplateAction,
    getMessageTemplateStatus,
    messageTemplate,
    resetMessageTemplateStatus,
    deleteMessageTemplateAction,
    deleteMessageTemplateStatus,
  } = useAdminStore((s) => ({
    getMessageTemplateAction: s.getMessageTemplateAction,
    getMessageTemplateStatus: s.getMessageTemplateStatus,
    messageTemplate: s.messageTemplate,
    updateMessageTemplateStatus: s.updateMessageTemplateStatus,
    resetMessageTemplateStatus: s.resetMessageTemplateStatus,
    deleteMessageTemplateAction: s.deleteMessageTemplateAction,
    deleteMessageTemplateStatus: s.deleteMessageTemplateStatus,
  }));

  useEffect(() => {
    if ((getMessageTemplateStatus || 1) === STATUS.NOT_STARTED) {
      getMessageTemplateAction();
    }
  }, [getMessageTemplateAction, getMessageTemplateStatus]);

  useEffect(() => {
    return () => resetMessageTemplateStatus();
  }, [resetMessageTemplateStatus]);

  const deleteTemplate = (data) => {
    deleteMessageTemplateAction(data.id);
  };

  return (
    <Box>
      <PageHeader
        heading={"Message Template List"}
        extra={
          <Button
            size={"sm"}
            colorScheme={themeColor}
            leftIcon={<AddIcon />}
            onClick={() => setToggleDrawer([])}
          >
            Add Message Template
          </Button>
        }
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getMessageTemplateStatus}>
            {messageTemplate?.length ? (
              <TableContainer mt={2}>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th w="5%">S. No.</Th>
                      <Th w="15%">Template Name</Th>
                      <Th w="15%">Module Name</Th>
                      <Th w="10%">User Type</Th>
                      <Th w="20%">SMS Template</Th>
                      <Th w="25%">Notification Template</Th>
                      {/* {HasPermission(PERMISSIONS.MESSAGE_TEMPLATE_EDIT) ||
                      HasPermission(PERMISSIONS.MESSAGE_TEMPLATE_DELETE) ? ( */}
                        <Th w="10%">Action</Th>
                      {/* ) : null} */}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(messageTemplate, (template, index) => (
                      <Tr key={template.id}>
                        <Td w="5%">{index + 1}</Td>
                        <Td w="15%">{template.templateName}</Td>
                        <Td w="15%">{template.moduleName}</Td>
                        <Td w="10%">{template.userType}</Td>
                        <Td w="20%" whiteSpace="normal" wordBreak="break-word">{template.smsTemplate}</Td>
                        <Td w="25%" whiteSpace="normal" wordBreak="break-word">{template.notificationTemplate}</Td>
                        {/* {HasPermission(PERMISSIONS.MESSAGE_TEMPLATE_EDIT) ||
                        HasPermission(PERMISSIONS.MESSAGE_TEMPLATE_DELETE) ? ( */}
                          <Td w="10%">
                            <Flex gap={2}>
                              {/* {HasPermission(PERMISSIONS.MESSAGE_TEMPLATE_EDIT) && ( */}
                                <Tooltip placement="top" label="Edit">
                                  <IconButton
                                    size={"xs"}
                                    variant={"ghost"}
                                    icon={<EditIcon />}
                                    colorScheme={"blue"}
                                    onClick={() => setToggleDrawer(template)}
                                  />
                                </Tooltip>
                              {/* )} */}
                              {/* {HasPermission(PERMISSIONS.MESSAGE_TEMPLATE_DELETE) && ( */}
                                <DeleteButton
                                  icon={<DeleteIcon />}
                                  label="Delete"
                                  heading={"Delete Confirmation"}
                                  description={"Are you sure? Do you want to delete this template?"}
                                  button="Delete"
                                  confirm={() => deleteTemplate(template)}
                                  status={deleteMessageTemplateStatus}
                                  reset={resetMessageTemplateStatus}
                                />
                              {/* )} */}
                            </Flex>
                          </Td>
                        {/* ) : null} */}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : null}
          </LoadingContainer>
        </Box>
        {toggleDrawer && (
          <AddMessage
            data={toggleDrawer}
            closeDrawer={() => setToggleDrawer(null)}
            themeColor={themeColor}
          />
        )}
      </Box>
    </Box>
  );
};
