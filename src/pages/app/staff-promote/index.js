"use client"

import { StaffPromote } from "@/components/MobileApp/Staff/StaffPromote"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
    return <MainLayout><StaffPromote themeColor={themeColor} sessionMasterId={sessionMasterId} pageName={"App_Staff_List"} /></MainLayout>
}