import { SidebarItems } from "@/constant/SidebarItems";
import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import { find, map, split } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo } from "react";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { HasPermission } from "@/common/HasPermission";

export const Sidebar = ({ subMenu, setSubMenu, header }) => {
  const router = useRouter();
  const themeColor = getLocalStorageItem("themeColor") || "purple";
  const sidebarKey = useMemo(
    () => split(router.pathname, "/")?.[1],
    [router.pathname]
  );

  useEffect(() => {
    const data = find(SidebarItems, (s) => s.key === sidebarKey);
    setSubMenu(data?.children?.length ? data : false);
  }, [sidebarKey, setSubMenu]);
  
  const handleNavigation = useCallback(
    async (href) => {
      if (!href || router.pathname === href) return;
      try {
        await router.prefetch(href);
        await router.push(href);
      } catch (error) {
        console.error("Navigation error to", href, error);
      }
    },
    [router]
  );
  

  const toggleSubMenu = useCallback(
    (item) => {
      if (item.children) {
        if (item.href) {
          handleNavigation(item.href);
        }
        setSubMenu(item);
      } else {
        handleNavigation(item.href);
        setSubMenu(false);
      }
    },
    [handleNavigation, setSubMenu]
  );

  const menuRoutes = useCallback(
    (href) => {
      handleNavigation(href);
    },
    [handleNavigation]
  );

  return (
    <Flex h={"100%"}>
      <Box
        className="scrollBar"
        w={subMenu ? "40%" : "100%"}
        bg={`${themeColor}.700`}
        overflowY={"scroll"}
        borderRight={"1px solid"}
        borderColor={"whiteAlpha.400"}
      >
        {map(
          SidebarItems,
          (item) =>
            (item?.permission ? HasPermission(item.permission) : true) && (
              <Box py={2} px={3} key={item.key}>
                <Box
                  py={3}
                  align="center"
                  cursor={"pointer"}
                  borderRadius={10}
                  fontFamily="Arial, sans-serif"
                  bg={subMenu?.name === item.name ? "white" : "none"}
                  color={
                    subMenu?.name === item.name ? `${themeColor}.800` : "white"
                  }
                  _hover={{ bg: "white", color: `${themeColor}.800` }}
                  onClick={() => toggleSubMenu(item)}
                >
                  <Text fontSize={22}>{item.icon}</Text>
                  <Text fontSize={11} fontWeight={"semibold"}>
                    {item.name}
                  </Text>
                </Box>
              </Box>
            )
        )}
      </Box>
      {subMenu?.children ? (
        <Box
          className="scrollBar"
          w={"60%"}
          overflowY={"scroll"}
          bg={`${themeColor}.50`}
          borderRight={"1px solid"}
          borderColor={"green.100"}
        >
          <Flex
            py={2}
            color={"black"}
            align={"center"}
            justify={"space-between"}
            borderBottom={"1px solid"}
            borderColor={"gray.200"}
            mx={2}
          >
            <Text fontSize={14} fontWeight={"semibold"}>
              {subMenu.name}
            </Text>
            <CloseIcon
              boxSize={3}
              cursor={"pointer"}
              onClick={() => setSubMenu(false)}
            />
          </Flex>
          {map(
            subMenu.children,
            (item) =>
              (item?.permission ? HasPermission(item.permission) : true) && (
                <Box py={"9px"} px={1} key={item.key || item.href}>
                  <Flex
                    px={2}
                    py={"5px"}
                    align={"center"}
                    borderRadius={5}
                    cursor={"pointer"}
                    fontFamily="Arial, sans-serif"
                    _hover={{ bg: "white", color: `${themeColor}.800` }}
                    bg={item.href === router.pathname ? "white" : "none"}
                    color={
                      item.href === router.pathname
                        ? `${themeColor}.800`
                        : "black"
                    }
                    onClick={() => {
                      if (item.href) handleNavigation(item.href);
                    }}
                  >
                    <Text w={"20%"} fontSize={18}>
                      {item.icon}
                    </Text>
                    <Text w={"80%"} fontSize={12} fontWeight={"semibold"}>
                      {item.name}
                    </Text>
                  </Flex>
                </Box>
              )
          )}
        </Box>
      ) : null}
    </Flex>
  );
};
