"use client"

import { BulkStudentUpload } from "@/components/Student/BulkAdmission/BulkStudentUpload"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
  return <MainLayout><BulkStudentUpload themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}