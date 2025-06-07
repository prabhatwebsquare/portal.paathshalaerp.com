import { getLocalStorageItem } from "@/utils/LocalStorage";
import { ArrowBackIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Text, Tooltip } from "@chakra-ui/react";
import { map, split } from "lodash";
import { useRouter } from "next/router";
import React from "react";

export const PageHeader = ({ heading, extra }) => {
    const themeColor = getLocalStorageItem("themeColor") || "purple"

    const router = useRouter()
    const routes = split(router.pathname, "/")

    return (
        <Flex w="100%" p={1} px={5} mb={2} bg="white" borderRadius={5} borderBottom={"1px solid"} borderColor={"gray.200"} align={"center"} justify={"space-between"}>
            <Flex align={"center"}>
                <Tooltip placement="top" label="back">
                    <ArrowBackIcon boxSize={6} onClick={() => router.back()} cursor={"pointer"} />
                </Tooltip>
                <Box ml={3}>
                    <Text mb={-1} fontSize={20} fontWeight={"semibold"}>{heading}</Text>
                    <Breadcrumb spacing='6px' separator={<ChevronRightIcon color='gray.500' />}>
                        {map(routes, (r, index) => (
                            <BreadcrumbItem key={r}>
                                <Text
                                    fontSize={12}
                                    cursor={"pointer"}
                                    color={`${themeColor}.600`}
                                    _hover={{ borderBottom: "1px solid", borderColor: `${themeColor}.400` }}
                                    onClick={() => router.push(routes.slice(0, index + 1).join("/") || "/")}
                                >
                                    {(r.charAt(0).toUpperCase() + r.slice(1)) || "Home"}
                                </Text>
                            </BreadcrumbItem>
                        ))}
                    </Breadcrumb>
                </Box>
            </Flex>
            {extra}
        </Flex >
    )
}