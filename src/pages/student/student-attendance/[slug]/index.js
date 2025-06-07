"use client"

import { MarkDailyAttendance } from "@/components/Student/AttendanceEntry/MarkDailyAttendance"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useRouter } from "next/router"
import { useMemo } from "react"

export default function Page() {
    const { query } = useRouter()
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
    return (
        <MainLayout>
            {query.type === "daily" ?
                <MarkDailyAttendance id={query.slug} date={query.date} sessionMasterId={sessionMasterId} themeColor={themeColor} />
                :
                null
            }
        </MainLayout>
    )
}