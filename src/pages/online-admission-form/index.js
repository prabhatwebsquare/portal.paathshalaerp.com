"use client"

import { OnlineAdmissionForm } from "@/components/Student/OnlineAdmissionForm"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), []) || "purple"

    return <OnlineAdmissionForm themeColor={themeColor} />
}