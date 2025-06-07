"use client"

import { AdmissionFormPage } from "@/components/Student/Admission/AdmissionFormPage"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
  return <MainLayout><AdmissionFormPage themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}