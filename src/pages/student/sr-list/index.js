"use client"

import { CustomReport } from "@/components/Student/CustomReport"
import { SRList } from "@/components/Student/SRList"
import { StudentList } from "@/components/Student/StudentList"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
  return <MainLayout><SRList themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}