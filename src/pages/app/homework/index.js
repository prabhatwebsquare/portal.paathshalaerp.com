"use client"

import { Homework } from "@/components/MobileApp/Homework"
import { NoticeBoard } from "@/components/MobileApp/NoticeBoard"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
    return <MainLayout><Homework themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}