import { HasPermission } from "@/common/HasPermission";
import { MasterItems } from "@/constant/MasterItems";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";
import { find, map, split } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export const MasterSidebar = () => {
    const themeColor = getLocalStorageItem("themeColor") || "blue"
    const router = useRouter()
    const [subMenu, setSubMenu] = useState(false)

    useEffect(() => {
        const sidebarKey = split(router.pathname, "/")?.[2]
        setSubMenu(find(MasterItems, s => s.key === sidebarKey))
    }, [router.pathname, setSubMenu])

    const toggleSubMenu = (item) => {
        setSubMenu(item)
        router.prefetch(item.href);
        router.push(item.href)
    }

    return (
        <Flex h={"100%"} bg={`${themeColor}.700`} borderRight={"1px solid"} borderColor="gray.100">
            <Box className="scrollBar" w={"100%"} overflowY={"scroll"}>
                {map(MasterItems, item => (
                    (item.permission ? HasPermission(item.permission) : true) &&
                    <Box py={2} px={3}>
                        <Box py={3}
                            align="center"
                            cursor={"pointer"}
                            borderRadius={10}
                            bg={subMenu?.name === item?.name ? "white" : "none"}
                            color={subMenu?.name === item?.name ? `${themeColor}.800` : "white"}
                            _hover={{ bg: "white", color: `${themeColor}.800` }}
                            onClick={() => toggleSubMenu(item)}
                        >
                            <Text fontSize={22}>{item?.icon}</Text>
                            <Text mt={1} fontSize={11} fontWeight={"semibold"}>{item?.name}</Text>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Flex>
    )
}