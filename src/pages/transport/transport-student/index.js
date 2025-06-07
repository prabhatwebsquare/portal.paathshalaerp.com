"use client"

import { TransportStudent } from "@/components/Transport/TransportStudent/index.js"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
    return <MainLayout><TransportStudent themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}   