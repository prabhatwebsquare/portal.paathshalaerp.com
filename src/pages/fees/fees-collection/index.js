"use client"

import { FeesCollection } from "@/components/fees/FeesCollection"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
    return <MainLayout><FeesCollection themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}