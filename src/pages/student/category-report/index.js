"use client"

import { CategoryReport } from "@/components/Student/CategoryReport"
import { CustomReport } from "@/components/Student/CustomReport"
import { StudentList } from "@/components/Student/StudentList"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
  return <MainLayout><CategoryReport themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}