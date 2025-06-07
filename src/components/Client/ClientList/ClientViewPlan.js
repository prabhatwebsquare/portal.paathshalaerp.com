import { STATUS } from "@/constant";
import { SysadminPermissions } from "@/constant/SysadminPermissions";
import { useSysAdminStore } from "@/store/SysAdmin";
import {
  Box,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import { find, findIndex, flatMap, map } from "lodash";
import { useEffect, useMemo } from "react";

export const ClientViewPlan = ({ data, closeDrawer, themeColor }) => {
  const permissions = JSON.parse(data.permission);

  const {
    getSchoolPermissionAction,
    getSchoolPermissionStatus,
    allSchoolPermissions,
  } = useSysAdminStore((s) => ({
    getSchoolPermissionAction: s.getSchoolPermissionAction,
    getSchoolPermissionStatus: s.getSchoolPermissionStatus,
    allSchoolPermissions: s.allSchoolPermissions,
  }));

  useEffect(() => {
    if ((getSchoolPermissionStatus || 1) === STATUS.NOT_STARTED) {
      getSchoolPermissionAction();
    }
  }, [getSchoolPermissionAction, getSchoolPermissionStatus]);

  const planPermissions = useMemo(() => {
    const perm = find(
      allSchoolPermissions,
      (p) => p.id === parseInt(data.package)
    )?.permission;
    return perm ? JSON.parse(perm) : [];
  }, [allSchoolPermissions, data.package]);

  return (
    <Drawer size={"xl"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>View Plan</DrawerHeader>

        <DrawerBody>
          <Box px={5}>
            <Flex
              flexWrap={"wrap"}
              borderleft={"1px solid"}
              borderColor="gray.100"
            >
              <ClientDetail
                heading={"School/Institute"}
                detail={data.schoolName}
              />
              <ClientDetail
                heading={"School Contact"}
                detail={data.contactNo}
              />
              <ClientDetail heading={"Name"} detail={data.name} />
              <ClientDetail heading={"Contact"} detail={data.mobileNo} />
            </Flex>
            <Flex gap={3} flexDir={"column"}>
              <Flex w={"100%"}>
                <Text w={"15%"} fontWeight={"semibold"} fontSize={16}>
                  Select Plans:
                </Text>
                <RadioGroup
                  ml={10}
                  w={"85%"}
                  size={"md"}
                  value={parseInt(data.package)}
                >
                  <HStack spacing={4} fontWeight={"semibold"}>
                    {map(allSchoolPermissions, (p) => (
                      <Radio mt={1} value={p.id} isDisabled>
                        {p.name}
                      </Radio>
                    ))}
                  </HStack>
                </RadioGroup>
              </Flex>

              {data.package
                ? map(SysadminPermissions, (permission, index) => {
                    const isMenuChecked =
                      findIndex(permissions, (s) => s === permission?.value) !=
                      -1
                        ? true
                        : false;
                    const isExtra =
                      findIndex(
                        planPermissions,
                        (s) => s === permission?.value
                      ) === -1;
                    return (
                      <Box
                        p={3}
                        w={"100%"}
                        borderTop={index === 0 ? "none" : "1px solid"}
                        borderColor={"gray.300"}
                      >
                        <Checkbox
                          size={"lg"}
                          fontWeight={"bold"}
                          isChecked={isMenuChecked}
                          isDisabled
                          colorScheme={isExtra ? "red" : "blue"}
                        >
                          {permission.label}
                        </Checkbox>
                        <Box pl={7} my={1}>
                          <Flex key={index} flexWrap={"wrap"}>
                            {map(permission.children[0], (child) => {
                              const allSelected = flatMap(
                                permission.children.slice(1)
                              ).every((child) =>
                                permissions?.includes(child.value)
                              );
                              return (
                                <Checkbox
                                  mt={0.5}
                                  w={"33%"}
                                  fontWeight={"semibold"}
                                  isDisabled
                                  isChecked={allSelected}
                                  key={child.value}
                                  value={child.value}
                                >
                                  {child.label}
                                </Checkbox>
                              );
                            })}
                          </Flex>
                        </Box>
                        <Box pl={14} my={1}>
                          <Flex w={"100%"} fontWeight={"semibold"}>
                            <Text w={"40%"}>Modules</Text>
                            <Text w={"20%"}>Add</Text>
                            <Text w={"20%"}>Edit</Text>
                            <Text w={"20%"}>Delete</Text>
                          </Flex>
                          <Flex key={index} flexWrap={"wrap"}>
                            {map(permission.children.slice(1), (child) => {
                              const isChecked0 =
                                findIndex(
                                  permissions,
                                  (s) => s === child?.[0]?.value
                                ) != -1
                                  ? true
                                  : false;
                              const isExtra0 =
                                findIndex(
                                  planPermissions,
                                  (s) => s === child?.[0]?.value
                                ) === -1;
                              const isChecked1 =
                                findIndex(
                                  permissions,
                                  (s) => s === child?.[1]?.value
                                ) != -1
                                  ? true
                                  : false;
                              const isExtra1 =
                                findIndex(
                                  planPermissions,
                                  (s) => s === child?.[1]?.value
                                ) === -1;
                              const isChecked2 =
                                findIndex(
                                  permissions,
                                  (s) => s === child?.[2]?.value
                                ) != -1
                                  ? true
                                  : false;
                              const isExtra2 =
                                findIndex(
                                  planPermissions,
                                  (s) => s === child?.[2]?.value
                                ) === -1;
                              const isChecked3 =
                                findIndex(
                                  permissions,
                                  (s) => s === child?.[3]?.value
                                ) != -1
                                  ? true
                                  : false;
                              const isExtra3 =
                                findIndex(
                                  planPermissions,
                                  (s) => s === child?.[3]?.value
                                ) === -1;
                              return (
                                <Flex w={"100%"}>
                                  <Checkbox
                                    mt={0.5}
                                    w={"40%"}
                                    fontWeight={"semibold"}
                                    isDisabled
                                    isChecked={isChecked0}
                                    colorScheme={isExtra0 ? "red" : "blue"}
                                    key={child?.[0]?.value}
                                    value={child?.[0]?.value}
                                  >
                                    {child?.[0]?.label}
                                  </Checkbox>
                                  {child?.[1] ? (
                                    <Checkbox
                                      mt={0.5}
                                      w={"20%"}
                                      fontWeight={"semibold"}
                                      isDisabled
                                      isChecked={isChecked1}
                                      colorScheme={isExtra1 ? "red" : "blue"}
                                      key={child?.[1]?.value}
                                      value={child?.[1]?.value}
                                    ></Checkbox>
                                  ) : (
                                    <Text w={"20%"} />
                                  )}
                                  {child?.[2] ? (
                                    <Checkbox
                                      mt={0.5}
                                      w={"20%"}
                                      fontWeight={"semibold"}
                                      isDisabled
                                      isChecked={isChecked2}
                                      colorScheme={isExtra2 ? "red" : "blue"}
                                      key={child?.[2]?.value}
                                      value={child?.[2]?.value}
                                    ></Checkbox>
                                  ) : (
                                    <Text w={"20%"} />
                                  )}
                                  {child?.[3] ? (
                                    <Checkbox
                                      mt={0.5}
                                      w={"20%"}
                                      fontWeight={"semibold"}
                                      isDisabled
                                      isChecked={isChecked3}
                                      colorScheme={isExtra3 ? "red" : "blue"}
                                      key={child?.[3]?.value}
                                      value={child?.[3]?.value}
                                    ></Checkbox>
                                  ) : (
                                    <Text w={"20%"} />
                                  )}
                                </Flex>
                              );
                            })}
                          </Flex>
                        </Box>
                      </Box>
                    );
                  })
                : null}
            </Flex>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const ClientDetail = ({ heading, detail }) => {
  return (
    <Box w={"25%"} mb={2}>
      <Text fontSize={14}>{heading}</Text>
      <Text fontSize={16} fontWeight={"semibold"}>
        {detail || " - "}
      </Text>
    </Box>
  );
};
