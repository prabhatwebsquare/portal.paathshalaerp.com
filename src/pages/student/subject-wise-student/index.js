"use client"

import { AgeWiseStudent } from "@/components/Student/AgeWiseStudent"
import { SubjectWiseStudent } from "@/components/Student/SubjectWiseStudent"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
  return <MainLayout><SubjectWiseStudent themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}