"use client"

import { ChangePassword } from "@/components/SchoolProfile/ChangePass"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    return <MainLayout><ChangePassword themeColor={themeColor} /></MainLayout>
}