"use client"

import { SalaryList } from "@/components/Staff/SalaryList"
import { StaffAttendance } from "@/components/Staff/StaffAttendance"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
    return <MainLayout><StaffAttendance themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}