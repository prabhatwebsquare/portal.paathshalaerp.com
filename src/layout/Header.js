import { getLocalStorageItem, setLocalStorageItem } from "@/utils/LocalStorage";
import { PhoneIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import {
  RiAccountCircleFill,
  RiLockPasswordFill,
  RiLogoutCircleRLine,
  RiSettings4Fill,
} from "react-icons/ri";
import { FcSupport } from "react-icons/fc";
import { SettingModal } from "./SettingModal";
import CustomInput from "@/common/CustomInput";
import { SearchStudent } from "./SearchStudent";
import { IoEnterOutline } from "react-icons/io5";
import { BiPencil } from "react-icons/bi";
import { FILE_URL } from "@/services/apis";

export const Header = () => {
  const themeColor = getLocalStorageItem("themeColor");
  const router = useRouter();
  const logout = () => {
    localStorage.clear();
    window.location.reload();
    router.push("/login");
  };
  const school = getLocalStorageItem("user");
  const session = getLocalStorageItem("sessionMaster");

  const [toggleSetting, setToggleSetting] = useState(null);
  const [togalModal, setToggleModal] = useState(null);
  const user = getLocalStorageItem("user");
  return (
    <Flex
      h={"12vh"}
      borderBottom={"1px solid"}
      borderColor={"whiteAlpha.400"}
      bg={`${themeColor}.700`}
      color={"white"}
    >
      <Box h={"100%"} w="10%" align={"center"}>
        <Image
          m={{ lg: 0, xl: 1 }}
          mr={1}
          w={"90%"}
          h="90%"
          src={"/assets/paathshalalogo.png"}
          alt={"Paathshala"}
          cursor={"pointer"}
          onClick={() => router.push("/")}
        />
      </Box>
      {getLocalStorageItem("role") === "sys-admin" ? (
        <Flex
          w="90%"
          py={3}
          px={6}
          borderLeft={"1px solid"}
          borderColor={"whiteAlpha.400"}
          align={"center"}
          justify={"space-between"}
        >
          <Flex align={"center"}>
            {/* <Avatar bg={"white"} color={`${themeColor}.600`} size={"md"} name={school?.schoolData?.name} /> */}
            <Text ml={2} fontSize={20} fontWeight={"bold"}>
              Paathshala SysAdmin
            </Text>
          </Flex>
          <Flex w={{ lg: "50%" }} align={"center"} justify={"flex-end"}>
            <Menu>
              <MenuButton colorScheme="pink">
                <Avatar ml={6} />
              </MenuButton>
              <MenuList w="fit-content" color="black">
                <MenuGroup
                  fontSize={13}
                  color={"gray.500"}
                  title="Welcome to Paathshala!"
                >
                  <Box ml={4}>
                    <Text
                      fontSize={16}
                      color={"gray.800"}
                      fontWeight={"semibold"}
                    >
                      {user?.userData?.name}
                    </Text>
                    <Text fontSize={11} color={"gray.500"}>
                      {user?.userData?.mobileNo}
                    </Text>
                  </Box>
                </MenuGroup>
                <MenuDivider />
                <Tooltip
                  placement="top"
                  label="School Profile"
                  hasArrow
                  bg="green.100"
                  color="black"
                >
                  <MenuItem
                    fontSize={14}
                    fontWeight={"semibold"}
                    icon={<RiAccountCircleFill fontSize={18} />}
                    onClick={() => router.push("/profile")}
                  >
                    Profile
                  </MenuItem>
                </Tooltip>
                <Tooltip
                  placement="top"
                  label="Change Password"
                  hasArrow
                  bg="green.100"
                  color="black"
                >
                  <MenuItem
                    fontSize={14}
                    fontWeight={"semibold"}
                    icon={<RiLockPasswordFill fontSize={18} />}
                    onClick={() => router.push("/change-password")}
                  >
                    Change Password
                  </MenuItem>
                </Tooltip>
                <Tooltip
                  placement="top"
                  label="Logout"
                  hasArrow
                  bg="green.100"
                  color="black"
                >
                  <MenuItem
                    fontSize={14}
                    fontWeight={"semibold"}
                    icon={<RiLogoutCircleRLine fontSize={18} />}
                    onClick={logout}
                  >
                    Log Out
                  </MenuItem>
                </Tooltip>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      ) : (
        <Flex
          w="90%"
          py={3}
          px={6}
          borderLeft={"1px solid"}
          borderColor={"whiteAlpha.400"}
          align={"center"}
          justify={"space-between"}
        >
          <Flex align={"center"}>
            <Avatar
              bg={"white"}
              color={`${themeColor}.600`}
              size={"md"}
              name={school?.schoolData?.name}
            />
            <Text ml={2} fontSize={20} fontWeight={"bold"}>
              {school?.schoolData?.name}
            </Text>
          </Flex>
          <Flex w={{ lg: "50%" }} align={"center"} justify={"flex-end"}>
            <Flex flexDir={"column"} justify={"space-around"}>
              <Flex fontWeight={"semibold"} fontSize={{ lg: 10, xl: 14 }}>
                <Flex>
                  <Text>Session: </Text>
                  <Text>&nbsp;{session?.name}</Text>
                </Flex>
                <Flex ml={5}>
                  <Text>Organization Code : </Text>
                  <Text>&nbsp;{school?.schoolData?.schoolCode}</Text>
                </Flex>
              </Flex>
              <Flex
                bg={"white"}
                mt={1}
                align={"center"}
                px={2}
                py={1.5}
                cursor={"pointer"}
                borderRadius={5}
                onClick={() => setToggleModal([])}
              >
                <SearchIcon color="gray.300" />
                <Text ml={2} color={"gray.800"} fontSize={13}>
                  Search Student
                </Text>
              </Flex>
              {/* <InputGroup bg={"white"} mt={3}>
                            <InputLeftElement pointerEvents='none'>
                                <SearchIcon mb={4} p={0} mr={3} color='gray.300' />
                            </InputLeftElement>
                            <Input size="xs" type='text' color={"blue.800"} fontWeight={"bold"} placeholder='Search Here' value={searchInput.filters} onChange={(e) => handleSearchInput(e.target.value)} />
                        </InputGroup> */}
              <SearchStudent
                sessionMasterId={session?.id}
                data={togalModal}
                closeModal={() => setToggleModal(null)}
                themeColor={themeColor}
              />
            </Flex>
            <Menu>
              <MenuButton colorScheme="pink">
                <Avatar ml={3}  src={`${FILE_URL}${user?.schoolData?.logo}`} size={"lg"} />
              </MenuButton>
              <MenuList w="fit-content" color="black" p={5} >
                <MenuGroup
                  fontSize={13}
                  color={"gray.500"}
                  title="Welcome to Paathshala!"
                >
                  <Box ml={4}>
                    <Text
                      fontSize={16}
                      color={"gray.800"}
                      fontWeight={"semibold"}
                    >
                      {user?.userData?.name}
                    </Text>
                    <Text fontSize={11} color={"gray.500"}>
                      {user?.userData?.mobileNo}
                    </Text>
                  </Box>
                </MenuGroup>
                <MenuDivider />
                <Tooltip
                  placement="top"
                  label="School Profile"
                  hasArrow
                  bg="green.100"
                  color="black"
                >
                  <MenuItem
                    fontSize={14}
                    fontWeight={"semibold"}
                    icon={<RiAccountCircleFill fontSize={18} />}
                    onClick={() => router.push("/profile")}
                  >
                    Profile
                  </MenuItem>
                </Tooltip>
                <Tooltip
                  placement="top"
                  label="Setting"
                  hasArrow
                  bg="green.100"
                  color="black"
                >
                  <MenuItem
                    fontSize={14}
                    fontWeight={"semibold"}
                    icon={<BiPencil fontSize={18} />}
                    onClick={() => router.push("/school-setting/class-setup")}
                  >
                    Master Entry
                  </MenuItem>
                </Tooltip>
                <Tooltip
                  placement="top"
                  label="Setting"
                  hasArrow
                  bg="green.100"
                  color="black"
                >
                  <MenuItem
                    fontSize={14}
                    fontWeight={"semibold"}
                    icon={<RiSettings4Fill fontSize={18} />}
                    // onClick={() => setToggleSetting([])}
                    onClick={() => router.push("/school-setting/common-setting")}
                  >
                    Setting
                  </MenuItem>
                </Tooltip>
                <Tooltip
                  placement="top"
                  label="Change Password"
                  hasArrow
                  bg="green.100"
                  color="black"
                >
                  <MenuItem
                    fontSize={14}
                    fontWeight={"semibold"}
                    icon={<RiLockPasswordFill fontSize={18} />}
                    onClick={() => router.push("/change-password")}
                  >
                    Change Password
                  </MenuItem>
                </Tooltip>
                <Tooltip
                  placement="top"
                  label="Support Center"
                  hasArrow
                  bg="green.100"
                  color="black"
                >
                  <MenuItem
                    fontSize={14}
                    fontWeight={"semibold"}
                    icon={<FcSupport fontSize={18} />}
                    onClick={() => router.push("/Support")}
                  >
                    Support Center
                  </MenuItem>
                </Tooltip>
                <Tooltip
                  placement="top"
                  label="Logout"
                  hasArrow
                  bg="green.100"
                  color="black"
                >
                  <MenuItem
                    fontSize={14}
                    fontWeight={"semibold"}
                    icon={<RiLogoutCircleRLine fontSize={18} />}
                    onClick={logout}
                  >
                    Log Out
                  </MenuItem>
                </Tooltip>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      )}
      {toggleSetting && (
        <SettingModal
          data={toggleSetting}
          closeModal={() => setToggleSetting(null)}
          themeColor={themeColor}
        />
      )}
    </Flex>
  );
};
