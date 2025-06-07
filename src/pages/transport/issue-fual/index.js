"use client"

import { FeesDefine } from "@/components/Transport/FeesDefine"
import FuelIsshu from "@/components/Transport/FuelIsshu"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
    return <MainLayout><FuelIsshu themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}