"use client"

import { DeletedStudentList } from "@/components/Student/DeletedStudent"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
  return <MainLayout><DeletedStudentList themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}