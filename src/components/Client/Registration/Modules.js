import { STATUS } from "@/constant";
import { MODULES } from "@/constant/Modules";
import { SysadminPermissions } from "@/constant/SysadminPermissions";
import { useClientStore } from "@/store/client";
import { useSysAdminStore } from "@/store/SysAdmin";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Radio,
  RadioGroup,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  difference,
  filter,
  find,
  findIndex,
  flatMap,
  map,
  uniq,
} from "lodash";
import { useEffect, useState } from "react";

export const Modules = ({
  handleBackStep,
  handleNextStep,
  themeColor,
  inputValue,
  noButtons,
  selected,
  setSelected,
  setInputValue,
}) => {
  const [perm, setPerm] = useState({});

  const inputHandler = (name, val) => {
    setPerm((pre) => ({ ...pre, [name]: val }));
    setInputValue((pre) => ({ ...pre, package: val }));
  };

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

  useEffect(() => {
    if (perm?.type) {
      setSelected(
        JSON.parse(
          find(allSchoolPermissions, (s) => s.id === parseInt(perm?.type))
            ?.permission
        )
      );
    }
  }, [allSchoolPermissions, perm?.type, setSelected]);

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
    const isSysAdmin = getLocalStorageItem("role") === "sys-admin";
    const isSelected = findIndex(selected, (c) => c === permission?.value) !== -1;
  
    if (isSelected) {
      const updated = filter(selected, (c) => c !== permission?.value);
      setSelected(difference(updated, map(flatMap(permission.children.slice(1)), "value")));
    } else {
      const newSelected = [permission?.value];
      if (isSysAdmin) {
        newSelected.push(...map(flatMap(permission.children.slice(1)), "value"));
      }
      setSelected((prev) => [...prev, ...newSelected]);
    }
  };
  

  const handleSelect = (val) => {
    if (findIndex(selected, (c) => c === val) != -1) {
      setSelected(filter(selected, (c) => c !== val));
    } else {
      setSelected((pre) => [...pre, val]);
    }
  };

  const { addClientRegAction, addClientRegStatus, resetClientRegStatus } =
    useClientStore((s) => ({
      addClientRegAction: s.addClientRegAction,
      addClientRegStatus: s.addClientRegStatus,
      resetClientRegStatus: s.resetClientRegStatus,
    }));

  const submitDetails = async (e) => {
    e.preventDefault();

    try {
      // Await the completion of the asynchronous action
      const result = await addClientRegAction({
        ...inputValue,
        package: perm?.type ? perm.type : inputValue?.package,
        permission: JSON.stringify(selected),
      });

      // Check the result or status after the action completes
      if (addClientRegStatus === STATUS.SUCCESS) {
        resetClientRegStatus();
        handleNextStep();
      }
    } catch (error) {
      console.error("Error during client registration:", error);
    }
  };

  useEffect(() => {
    if (addClientRegStatus === STATUS.SUCCESS) {
      resetClientRegStatus();
      handleNextStep();
    }
  }, [addClientRegStatus, handleNextStep, resetClientRegStatus]);

  return (
    <form onSubmit={submitDetails}>
      <Box p={5}>
        <Flex gap={3} flexDir={"column"}>
          <Flex w={"100%"}>
            <Text w={"15%"} fontWeight={"semibold"} fontSize={16}>
              Select Plans:
            </Text>
            <RadioGroup
              ml={10}
              w={"85%"}
              size={"md"}
              value={
                perm?.type
                  ? parseInt(perm?.type)
                  : parseInt(inputValue?.package)
              }
              onChange={(e) => inputHandler("type", e)}
            >
              <HStack spacing={4} fontWeight={"semibold"}>
                {map(allSchoolPermissions, (p) => (
                  <Radio mt={1} value={p.id}>
                    {p.name}
                  </Radio>
                ))}
              </HStack>
            </RadioGroup>
          </Flex>

          {perm?.type || noButtons
            ? map(SysadminPermissions, (permission, index) => {
                const isMenuChecked =
                  findIndex(selected, (s) => s === permission?.value) != -1
                    ? true
                    : false;
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
                      onChange={(e) => handleMasterSelect(permission)}
                    >
                      {permission.label}
                    </Checkbox>
                    <Box pl={7} my={1}>
                      <Flex key={index} flexWrap={"wrap"}>
                        {map(permission.children[0], (child) => {
                          const allSelected = flatMap(
                            permission.children.slice(1)
                          ).every((child) => selected?.includes(child.value));
                          return (
                            <Checkbox
                              mt={0.5}
                              w={"33%"}
                              fontWeight={"semibold"}
                              isDisabled={!isMenuChecked}
                              isChecked={allSelected}
                              key={child.value}
                              value={child.value}
                              onChange={() =>
                                handleSelectAll(
                                  allSelected,
                                  flatMap(permission.children.slice(1))
                                )
                              }
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
                        {getLocalStorageItem("role") === "sys-admin" ? null : (
                          <>
                           <Text w={"20%"}>Add</Text>
                        <Text w={"20%"}>Edit</Text>
                        <Text w={"20%"}>Delete</Text>
                          </>
                        )}
                      </Flex>
                      <Flex key={index} flexWrap={"wrap"}>
                        {map(permission.children.slice(1), (child) => {
                          const isChecked0 =
                            findIndex(
                              selected,
                              (s) => s === child?.[0]?.value
                            ) != -1
                              ? true
                              : false;
                          const isChecked1 =
                            findIndex(
                              selected,
                              (s) => s === child?.[1]?.value
                            ) != -1
                              ? true
                              : false;
                          const isChecked2 =
                            findIndex(
                              selected,
                              (s) => s === child?.[2]?.value
                            ) != -1
                              ? true
                              : false;
                          const isChecked3 =
                            findIndex(
                              selected,
                              (s) => s === child?.[3]?.value
                            ) != -1
                              ? true
                              : false;
                          return (
                            <Flex w={"100%"}>
                              <Checkbox
                                mt={0.5}
                                w={"40%"}
                                fontWeight={"semibold"}
                                isDisabled={!isMenuChecked}
                                isChecked={isChecked0}
                                key={child?.[0]?.value}
                                value={child?.[0]?.value}
                                onChange={(e) => handleSelect(e.target.value)}
                              >
                                {child?.[0]?.label}
                              </Checkbox>
                              {getLocalStorageItem("role") === "sys-admin" ? null : (
                                <>   
                                 {child?.[1] ? (
                                <Checkbox
                                  mt={0.5}
                                  w={"20%"}
                                  fontWeight={"semibold"}
                                  isDisabled={!isMenuChecked}
                                  isChecked={isChecked1}
                                  key={child?.[1]?.value}
                                  value={child?.[1]?.value}
                                  onChange={(e) => handleSelect(e.target.value)}
                                ></Checkbox>
                              ) : (
                                <Text w={"20%"} />
                              )}
                              {child?.[2] ? (
                                <Checkbox
                                  mt={0.5}
                                  w={"20%"}
                                  fontWeight={"semibold"}
                                  isDisabled={!isMenuChecked}
                                  isChecked={isChecked2}
                                  key={child?.[2]?.value}
                                  value={child?.[2]?.value}
                                  onChange={(e) => handleSelect(e.target.value)}
                                ></Checkbox>
                              ) : (
                                <Text w={"20%"} />
                              )}
                              {child?.[3] ? (
                                <Checkbox
                                  mt={0.5}
                                  w={"20%"}
                                  fontWeight={"semibold"}
                                  isDisabled={!isMenuChecked}
                                  isChecked={isChecked3}
                                  key={child?.[3]?.value}
                                  value={child?.[3]?.value}
                                  onChange={(e) => handleSelect(e.target.value)}
                                ></Checkbox>
                              ) : (
                                <Text w={"20%"} />
                              )} 
                                </> )
                                }
                             
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
        {noButtons ? null : (
          <Flex p={4} justify={"flex-end"}>
            <Button ml={4} size={"sm"} onClick={handleBackStep}>
              {" "}
              Back
            </Button>
            <Button
              ml={4}
              size={"sm"}
              isDisabled={perm?.type ? false : true}
              colorScheme={`${themeColor}`}
              type={"submit"}
              isLoading={addClientRegStatus === STATUS.FETCHING}
            >
              {" "}
              Next
            </Button>
          </Flex>
        )}
      </Box>
    </form>
  );
};
