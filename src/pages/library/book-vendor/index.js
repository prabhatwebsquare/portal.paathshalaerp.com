"use client"

import { BookVendor } from "@/components/Library/BookVendor"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
    return <MainLayout><BookVendor themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}