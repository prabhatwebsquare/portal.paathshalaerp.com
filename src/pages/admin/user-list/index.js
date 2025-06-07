"use client"

import { Roles } from "@/components/Admin/Roles"
import { UsersList } from "@/components/Admin/UserCreation"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
    return <MainLayout><UsersList themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}