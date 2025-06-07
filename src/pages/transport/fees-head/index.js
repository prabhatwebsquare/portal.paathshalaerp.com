"use client"

import { FeesHead } from "@/components/Transport/FeesHead"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
    return <MainLayout><FeesHead themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}