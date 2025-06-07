"use client"
import { StaffList } from "@/components/MobileApp/Staff"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
    return <MainLayout><StaffList themeColor={themeColor} sessionMasterId={sessionMasterId}  pageName={"Receiption"}/></MainLayout>
}