"use client"

import { PaySlip } from "@/components/Staff/PaySlip"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
    return <MainLayout><PaySlip themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}