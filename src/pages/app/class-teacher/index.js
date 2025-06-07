"use client"

import { ClassTeacher } from "@/components/MobileApp/ClassTeacher"
import { StaffList } from "@/components/MobileApp/Staff"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
    return <MainLayout><ClassTeacher themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}