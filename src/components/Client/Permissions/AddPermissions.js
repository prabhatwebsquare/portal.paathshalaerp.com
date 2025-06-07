import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useSysAdminStore } from "@/store/SysAdmin";
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
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { map } from "lodash";
import { SysadminPermissions } from "@/constant/SysadminPermissions";
import { getLocalStorageItem } from "@/utils/LocalStorage";

export const AddPermissions = ({ data, closeDrawer, themeColor }) => {
  const [selected, setSelected] = useState(
    new Set(data?.permission ? JSON.parse(data.permission) : [])
  );

  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,
          name: data.name,
        }
      : {}
  );

  const {
    addSchoolPermissionAction,
    addSchoolPermissionStatus,
    updateSchoolPermissionAction,
    updateSchoolPermissionStatus,
    resetSchoolPermissionStatus,
  } = useSysAdminStore((s) => ({
    addSchoolPermissionAction: s.addSchoolPermissionAction,
    addSchoolPermissionStatus: s.addSchoolPermissionStatus,
    updateSchoolPermissionAction: s.updateSchoolPermissionAction,
    updateSchoolPermissionStatus: s.updateSchoolPermissionStatus,
    resetSchoolPermissionStatus: s.resetSchoolPermissionStatus,
  }));
  const handleSelect = useCallback((val, children = []) => {
    setSelected((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(val)) {
        newSet.delete(val);
        children.forEach((child) => newSet.delete(child.value));
      } else {
        newSet.add(val);
        if (isSysAdmin) {
          children.forEach((child) => newSet.add(child.value));
        }
      }

      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((allSelected, permissions) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (allSelected) {
        permissions.forEach((p) => newSet.delete(p.value));
      } else {
        permissions.forEach((p) => newSet.add(p.value));
      }
      return newSet;
    });
  }, []);

  const addPermission = (e) => {
    e.preventDefault();
    const payload = {
      ...inputValue,
      permission: JSON.stringify(Array.from(selected)),
    };

    if (data?.id) {
      updateSchoolPermissionAction(payload);
    } else {
      addSchoolPermissionAction(payload);
    }
  };

  useEffect(() => {
    if (
      addSchoolPermissionStatus === STATUS.SUCCESS ||
      updateSchoolPermissionStatus === STATUS.SUCCESS
    ) {
      resetSchoolPermissionStatus();
      closeDrawer();
    }
  }, [
    addSchoolPermissionStatus,
    updateSchoolPermissionStatus,
    resetSchoolPermissionStatus,
    closeDrawer,
  ]);
  const isSysAdmin = getLocalStorageItem("role") === "sys-admin";
  return (
    <Drawer size={"xl"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addPermission}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.permission ? "Edit Permission" : "Add Permission"}
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type="text"
                name="name"
                label="Permission Name"
                autoFocus
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              {map(SysadminPermissions, (permission, index) => {
                const isMenuChecked = selected?.has(permission.value);
                return (
                  <Box
                    key={index}
                    p={5}
                    w="100%"
                    bg={isMenuChecked ? "blue.50" : "white"}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={isMenuChecked ? "blue.300" : "blue.200"}
                    boxShadow={isMenuChecked ? "lg" : "md"}
                  >
                    {/* Parent Permission Checkbox */}
                    <Checkbox
                      size="lg"
                      fontWeight="bold"
                      colorScheme="blue"
                      isChecked={isMenuChecked}
                      onChange={() => handleSelect(permission.value)}
                    >
                      <Text fontSize="lg" fontWeight="bold" color="blue.700">
                        {permission.label}
                      </Text>
                    </Checkbox>

                    {/* Child Permissions */}
                    <Box pl={8} mt={3}>
                      <Flex flexWrap="wrap" gap={3}>
                        {map(permission.children[0], (child) => {
                          const allSelected = permission.children
                            .slice(1)
                            .flat()
                            .every((child) => selected.has(child.value));

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
                                  permission.children.slice(1).flat()
                                )
                              }
                            >
                              <Text fontSize="md" color="gray.700">
                                {child.label}
                              </Text>
                            </Checkbox>
                          );
                        })}
                      </Flex>
                    </Box>

                    {/* Module Permissions */}
                    <Box pl={10} mt={4}>
                      <Flex
                        w="100%"
                        fontWeight="semibold"
                        fontSize="sm"
                        color="gray.600"
                        borderBottom="1px solid"
                        pb={2}
                        mb={3}
                      >
                        <Text w="40%">Modules</Text>
                        {!isSysAdmin && (
                          <>
                            <Text w="20%">Add</Text>
                            <Text w="20%">Edit</Text>
                            <Text w="20%">Delete</Text>
                          </>
                        )}
                      </Flex>

                      <Flex flexDir="column" gap={2}>
                        {map(permission.children.slice(1), (child) => {
                          const isChecked = selected?.has(child?.[0]?.value);

                          return (
                            <Flex
                              key={child?.[0]?.value}
                              w="100%"
                              align="center"
                              bg={isChecked ? "blue.100" : "gray.50"}
                              p={3}
                              borderRadius="md"
                              boxShadow="sm"
                              _hover={{
                                bg: "blue.200",
                                transition: "0.2s ease",
                              }}
                            >
                              {/* Module Checkbox */}
                              <Checkbox
                                w="40%"
                                fontWeight="semibold"
                                colorScheme="blue"
                                isDisabled={!isMenuChecked}
                                isChecked={isChecked}
                                value={child?.[0]?.value}
                                onChange={(e) =>
                                  handleSelect(e.target.value, child.slice(1))
                                }
                              >
                                <Text fontSize="md" color="gray.800">
                                  {child?.[0]?.label}
                                </Text>
                              </Checkbox>

                              {/* Add/Edit/Delete Checkboxes */}
                              {!isSysAdmin &&
                                child
                                  .slice(1)
                                  .map((action, idx) => (
                                    <Checkbox
                                      key={action?.value}
                                      w="20%"
                                      fontWeight="semibold"
                                      colorScheme="blue"
                                      isDisabled={!isMenuChecked}
                                      isChecked={selected.has(action?.value)}
                                      value={action?.value}
                                      onChange={(e) =>
                                        handleSelect(e.target.value)
                                      }
                                    />
                                  ))}
                            </Flex>
                          );
                        })}
                      </Flex>
                    </Box>
                  </Box>
                );
              })}
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Button
              size="sm"
              variant="outline"
              mr={3}
              colorScheme="red"
              onClick={closeDrawer}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              type="submit"
              colorScheme={themeColor}
              isLoading={
                addSchoolPermissionStatus === STATUS.FETCHING ||
                updateSchoolPermissionStatus === STATUS.FETCHING
              }
            >
              {data?.permission ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
