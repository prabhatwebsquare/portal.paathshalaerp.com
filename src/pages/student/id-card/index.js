"use client"

import { AttendanceReport } from "@/components/Student/AttendanceReport/StudentAttendanceReport"
import { IdCard } from "@/components/Student/IdCard"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
  return <MainLayout><IdCard themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}