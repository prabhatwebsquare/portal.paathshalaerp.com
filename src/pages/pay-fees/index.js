"use client"

import { OnlinePayFees } from "@/components/fees/OnlinePayFees"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), []) || "purple"

    return <OnlinePayFees themeColor={themeColor} />
}