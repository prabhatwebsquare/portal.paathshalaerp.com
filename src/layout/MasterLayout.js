import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Header } from "./Header";
import { MasterSidebar } from "./MasterSidebar";
import { useRouter } from "next/router";
import { getLocalStorageItem } from "@/utils/LocalStorage";

export const MasterLayout = ({ children }) => {
    const router = useRouter()

    const token = getLocalStorageItem("token")
    useEffect(() => {
        if (!token) {
            router.push("/login")
        }
    }, [router, token])

    return (
        <Box h="100vh">
            <Header />
            <Flex h={"88vh"}>
                <Box w={"7%"}>
                    <MasterSidebar />
                </Box>
                <Box w={"93%"} p={5} bg={"gray.50"}>
                    {children}
                </Box>
            </Flex>
        </Box>
    )
}