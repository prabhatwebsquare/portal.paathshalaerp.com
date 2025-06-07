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
import { map, orderBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useClassSetupStore } from "@/store/classSetup";
import { STATUS } from "@/constant";
import { DeleteButton } from "@/common/DeleteButton";
import { AddSection } from "./AddSection";
import { LoadingContainer } from "@/common/LoadingContainer";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { NoData } from "@/common/NoData";

export const Section = ({ themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const {
    getSectionAction,
    getSectionStatus,
    allSections,
    deleteSectionAction,
    deleteSectionStatus,
    resetStatus,
    resetSectionStatus,
  } = useClassSetupStore((s) => ({
    getSectionAction: s.getSectionAction,
    getSectionStatus: s.getSectionStatus,
    allSections: s.allSections,
    deleteSectionAction: s.deleteSectionAction,
    deleteSectionStatus: s.deleteSectionStatus,
    resetStatus: s.resetStatus,
    resetSectionStatus: s.resetSectionStatus,
  }));

  useEffect(() => {
    if ((getSectionStatus || 1) === STATUS.NOT_STARTED) {
      getSectionAction();
    }
  }, [getSectionAction, getSectionStatus]);

  const deleteSection = (id) => {
    deleteSectionAction(id);
  };

  return (
    <Box pos={"relative"} h={"70vh"}>
      <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
        <LoadingContainer status={getSectionStatus}>
          {allSections?.length ? (
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
                      <Th textAlign="center">Section</Th>
                      <Th textAlign="center">Order</Th>
                      {(HasPermission(PERMISSIONS.SECTION_EDIT) ||
                        HasPermission(PERMISSIONS.SECTION_DELETE)) && (
                        <Th textAlign="center">Action</Th>
                      )}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(orderBy(allSections, "orderNo", "asc"), (c, index) => (
                      <Tr key={c.id}>
                        <Td textAlign="center">{index + 1}</Td>
                        <Td textAlign="center">{c.name}</Td>
                        <Td textAlign="center">{c.orderNo}</Td>
                        {(HasPermission(PERMISSIONS.SECTION_EDIT) ||
                          HasPermission(PERMISSIONS.SECTION_DELETE)) && (
                          <Td textAlign="center">
                            {HasPermission(PERMISSIONS.SECTION_EDIT) && (
                              <Tooltip placement="top" label="Edit">
                                <IconButton
                                  size="xs"
                                  mr={3}
                                  icon={<EditIcon />}
                                  colorScheme="blue"
                                  onClick={() => setToggleDrawer(c)}
                                />
                              </Tooltip>
                            )}
                            {HasPermission(PERMISSIONS.SECTION_DELETE) && (
                              <DeleteButton
                                description="Are you sure? Do you want to delete?"
                                confirm={() => deleteSection(c.id)}
                                status={deleteSectionStatus}
                                reset={resetSectionStatus}
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
            <NoData title={"No Section Found"} />
          )}
        </LoadingContainer>
      </Box>
      {HasPermission(PERMISSIONS.SECTION_ADD) && (
        <Tooltip placement="top" label={"Add New Section"}>
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
        <AddSection
          sectionData={toggleDrawer}
          closeDrawer={() => setToggleDrawer(null)}
          themeColor={themeColor}
        />
      )}
    </Box>
  );
};
