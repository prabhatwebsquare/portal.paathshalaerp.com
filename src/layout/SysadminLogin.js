import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useLoginStore } from "@/store/Login";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/LocalStorage";
import { Box, Button, Flex, Image, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export const SysadminLogin = () => {
    const router = useRouter()
    const [inputValue, setInputValue] = useState({})

    useEffect(() => {
        const token = getLocalStorageItem("token")
        if (token) {
            router.push("/")
        }
    }, [router])

    const { sysadminLoginAction, sysadminLoginStatus, sysadminLogin, resetLoginStatus,
    } = useLoginStore(s => ({
        sysadminLoginAction: s.sysadminLoginAction,
        sysadminLoginStatus: s.sysadminLoginStatus,
        sysadminLogin: s.sysadminLogin,
        resetLoginStatus: s.resetLoginStatus,
    }))

    const loginUser = (e) => {
        e.preventDefault()
        sysadminLoginAction(inputValue)
    }

    useEffect(() => {
        if (sysadminLoginStatus === STATUS.SUCCESS) {
            resetLoginStatus()
            setLocalStorageItem("token", sysadminLogin.accessToken)
            setLocalStorageItem("user", sysadminLogin?.userData)
            setLocalStorageItem("role", "sys-admin")
            setLocalStorageItem("themeColor", "blue")
            setLocalStorageItem("masterCheck", true);
            setLocalStorageItem("marksheetLayout", 1);
            setLocalStorageItem("receiptLayout", 1);
            window.location.reload()
            router.push("/")
        }
    }, [resetLoginStatus, router, sysadminLogin, sysadminLoginStatus])

    return (
        <Flex h={"100vh"} w={"100vw"} justify={"center"} align={"center"} bgGradient="linear(to-br, green.50, green.200)">
            <Flex h={"85%"} w={"80%"}>
                <Flex flexDir={"column"} p={10} w={"50%"} bg="gray.50" align={"center"} justify={"center"} bgImage={'url("/assets/loginbg.jpg")'}>
                    <Image w={"80%"} h={"60%"} src="/assets/SmartPaathshala.png" alt="Smart Paathshala" />
                </Flex>
                <Box w={"50%"} h={"100%"} bg="white" align={"flex-start"} px={28} py={10} justify={"space-between"}>
                    <Text fontSize={22} fontWeight={"bold"}>Login in your account</Text>
                    <Text textAlign={"justify"} mt={2} fontSize={13} color={"gray.500"}>Welcome back! Login with your data that you entered during registration</Text>
                    <form onSubmit={loginUser}>
                        <VStack mt={8} spacing={4}>
                            <CustomInput type={"number"}   limit={10} name="mobileNo" label={"Mobile Number"} inputValue={inputValue} setInputValue={setInputValue} />
                            <CustomInput type={"password"} name="password" label={"Password"} inputValue={inputValue} setInputValue={setInputValue} />
                            {/* <CustomInput type={"text"} name="orgCode" label={"Organisation Code"} inputValue={inputValue} setInputValue={setInputValue} /> */}
                        </VStack>
                        <Button mt={8} w="100%" size="sm" colorScheme={"green"} type="submit" isLoading={sysadminLoginStatus === STATUS.FETCHING}>Login</Button>
                    </form>
                    <Text mt={2} fontSize={14} textAlign={"center"} color={"green.400"} cursor={"pointer"} >Forgot Password</Text>
                </Box>
            </Flex>
        </Flex >
    )
}