"use client"

import { DriverRegistration } from "@/components/Transport/DriverReg"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
    return <MainLayout><DriverRegistration themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}