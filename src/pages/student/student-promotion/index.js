"use client"

import { StudentPromotion } from "@/components/Student/StudentPromotion"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])

    return <MainLayout><StudentPromotion sessionMasterId={sessionMasterId} themeColor={themeColor} /></MainLayout>
}