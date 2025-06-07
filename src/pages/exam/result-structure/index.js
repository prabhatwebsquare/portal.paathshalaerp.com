"use client"

import { ResultStructure } from "@/components/Exam/ResultStructure"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
    return <MainLayout><ResultStructure themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}