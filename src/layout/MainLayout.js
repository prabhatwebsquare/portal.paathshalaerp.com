import { Box, Flex, Image } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useRouter } from "next/router";
import { getLocalStorageItem } from "@/utils/LocalStorage";

export const MainLayout = ({ children }) => {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])

    const router = useRouter()
    const [subMenu, setSubMenu] = useState(false)

    const token = getLocalStorageItem("token")
    useEffect(() => {
        if (!token) {
            router.push("/login")
        }
    }, [router, token])

    return (
        <Box h="100vh">
            <Header themeColor={themeColor} />
            <Flex h={"88vh"}>
                <Box w={{ lg: subMenu ? "25%" : "10%", xl: subMenu ? "17.5%" : "7%" }}>
                    <Sidebar subMenu={subMenu} setSubMenu={setSubMenu} />
                </Box>
                <Box maxH={"85vh"} w={{ lg: subMenu ? "75%" : "90%", xl: subMenu ? "82.5%" : "93%" }} p={2} bg="gray.50">
                    {children}
                </Box>
            </Flex>
        </Box>
    )
}