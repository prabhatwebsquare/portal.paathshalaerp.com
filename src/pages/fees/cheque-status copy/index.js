"use client"

import { FeesLedger } from "@/components/fees/FeesLedger"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
    return <MainLayout><FeesLedger themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}