"use client"

import { DiscountRequest } from "@/components/fees/DiscountRequest/DiscountRequest"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useRouter } from "next/router"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
    const { query } = useRouter()
    return <MainLayout><DiscountRequest themeColor={themeColor} sessionMasterId={sessionMasterId} filter={query?.id === "all" ? query?.id : parseInt(query?.id)} /></MainLayout>
}