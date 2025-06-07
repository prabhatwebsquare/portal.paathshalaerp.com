import { STATUS } from "@/constant";
import { Permissions } from "@/constant/Permissions";
import { useAdminStore } from "@/store/AdminStore";
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/react";
import { difference, filter, findIndex, flatMap, map, uniq } from "lodash";
import React, { useEffect, useState } from "react";

export const RolePermissions = ({ data, closeDrawer, themeColor }) => {
  const [selected, setSelected] = useState(
    data?.permission ? JSON.parse(data.permission) : []
  );
  
  const handleSelectAll = (allSelected, permission) => {
    if (!allSelected) {
      checkAllHandler(permission);
    } else {
      removeAllHandler(permission);
    }
  };

  const checkAllHandler = (permission) => {
    setSelected(uniq([...selected, ...map(permission, "value")]));
  };

  const removeAllHandler = (permission) => {
    setSelected(difference(selected, map(permission, "value")));
  };

  const handleMasterSelect = (permission) => {
    if (findIndex(selected, (c) => c === permission?.value) != -1) {
      const updated = filter(selected, (c) => c !== permission?.value);
      setSelected(difference(updated, map(permission?.children[1], "value")));
    } else {
      setSelected((pre) => [...pre, permission?.value]);
    }
  };

  const handleSelect = (val) => {
    if (findIndex(selected, (c) => c === val) != -1) {
      setSelected(filter(selected, (c) => c !== val));
    } else {
      setSelected((pre) => [...pre, val]);
    }
  };

  const { updateRoleSuperAdminAction, updateRoleSuperAdminStatus, resetRoleSuperAdminStatus } = useAdminStore(
    (s) => ({
      updateRoleSuperAdminAction: s.updateRoleSuperAdminAction,
      updateRoleSuperAdminStatus: s.updateRoleSuperAdminStatus,
      resetRoleSuperAdminStatus: s.resetRoleSuperAdminStatus,
    })
  );

  const updatePermissions = () => {
    updateRoleSuperAdminAction({
      id: data.id,
      name: data.name,
      permission: JSON.stringify(selected),
    });
  };

  useEffect(() => {
    if (updateRoleSuperAdminStatus === STATUS.SUCCESS) {
      resetRoleSuperAdminStatus();
      closeDrawer();
    }
  }, [closeDrawer, resetRoleSuperAdminStatus, updateRoleSuperAdminStatus]);

  return (
    <Drawer size={"xl"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {data?.permission ? "Edit User Permission" : "Add User Permission"}
        </DrawerHeader>

        <DrawerBody>
          <VStack spacing={3}>
            {map(Permissions, (permission, index) => {
              const isMenuChecked = selected.includes(permission.value);

              return (
                  <Box
                    key={index}
                    p={4}
                    w="100%"
                    borderTop={index === 0 ? "none" : "1px solid"}
                    borderColor="gray.200"
                    bg={isMenuChecked ? "gray.50" : "white"}
                    borderRadius="md"
                    _hover={{ bg: "gray.50" }}
                    transition="background 0.2s ease"
                  >
                    {/* Parent Permission Checkbox */}
                    <Checkbox
                      size="lg"
                      fontWeight="bold"
                      colorScheme="blue"
                      isChecked={isMenuChecked}
                      onChange={() => handleMasterSelect(permission)}
                    >
                      <Text fontSize="lg" fontWeight="bold" color="gray.700">
                        {permission.label}
                      </Text>
                    </Checkbox>

                    {/* Child Permissions */}
                    <Box pl={8} mt={2}>
                      <Flex flexWrap="wrap" gap={4}>
                        {map(permission.children[0], (child) => {
                          const allSelected = flatMap(
                            permission.children.slice(1)
                          ).every((c) => selected.includes(c.value));
                          return (
                            <Checkbox
                              key={child.value}
                              w={{ base: "100%", md: "45%" }}
                              fontWeight="semibold"
                              colorScheme="blue"
                              isDisabled={!isMenuChecked}
                              isChecked={allSelected}
                              onChange={() =>
                                handleSelectAll(
                                  allSelected,
                                  flatMap(permission.children.slice(1))
                                )
                              }
                            >
                              <Text fontSize="md" color="gray.600">
                                {child.label}
                              </Text>
                            </Checkbox>
                          );
                        })}
                      </Flex>
                    </Box>

                    {/* Module Permissions */}
                    <Box pl={12} mt={4}>
                      <Flex
                        w="100%"
                        fontWeight="semibold"
                        fontSize="sm"
                        color="gray.600"
                        mb={2}
                      >
                        <Text w="40%">Modules</Text>
                        <Text w="20%">Add</Text>
                        <Text w="20%">Edit</Text>
                        <Text w="20%">Delete</Text>
                      </Flex>

                      <Flex flexDir="column" gap={2}>
                        {map(
                          permission.children.slice(1),
                          (child) =>
                              <Flex
                                key={child?.[0]?.value}
                                w="100%"
                                align="center"
                                bg={
                                  selected.includes(child?.[0]?.value)
                                    ? "blue.50"
                                    : "transparent"
                                }
                                p={2}
                                borderRadius="md"
                                _hover={{ bg: "blue.50" }}
                                transition="background 0.2s ease"
                              >
                                {/* Module Checkbox */}
                                <Checkbox
                                  w="40%"
                                  fontWeight="semibold"
                                  colorScheme="blue"
                                  isDisabled={!isMenuChecked}
                                  isChecked={selected.includes(
                                    child?.[0]?.value
                                  )}
                                  value={child?.[0]?.value}
                                  onChange={(e) => handleSelect(e.target.value)}
                                >
                                  <Text fontSize="md" color="gray.700">
                                    {child?.[0]?.label}
                                  </Text>
                                </Checkbox>

                                {/* Add/Edit/Delete Checkboxes */}
                                {[1, 2, 3].map((i) =>
                                  child?.[i] ? (
                                    <Checkbox
                                      key={child?.[i]?.value}
                                      w="20%"
                                      fontWeight="semibold"
                                      colorScheme="blue"
                                      isDisabled={!isMenuChecked}
                                      isChecked={selected.includes(
                                        child?.[i]?.value
                                      )}
                                      value={child?.[i]?.value}
                                      onChange={(e) =>
                                        handleSelect(e.target.value)
                                      }
                                    />
                                  ) : (
                                    <Text key={i} w="20%" />
                                  )
                                )}
                              </Flex>
                            
                        )}
                      </Flex>
                    </Box>
                  </Box>
              
              );
            })}
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button
            size={"sm"}
            variant="outline"
            mr={3}
            colorScheme={"red"}
            onClick={closeDrawer}
          >
            Cancel
          </Button>
          <Button
            size={"sm"}
            colorScheme={themeColor}
            isLoading={updateRoleSuperAdminStatus === STATUS.FETCHING}
            onClick={updatePermissions}
          >
            {data?.permission ? "Update" : "Add"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
