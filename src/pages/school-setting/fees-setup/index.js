"use client"

import { FeesSetup } from "@/components/FessSetup"
import { MasterLayout } from "@/layout/MasterLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"


export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
    return <MasterLayout><FeesSetup themeColor={themeColor} sessionMasterId={sessionMasterId} /></MasterLayout>
}