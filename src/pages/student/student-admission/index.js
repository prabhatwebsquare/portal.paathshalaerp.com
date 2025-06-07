"use client"

import { StudentAdmission } from "@/components/Student/Admission"
import { AdmissionFormPage } from "@/components/Student/Admission/AdmissionFormPage"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
  return <MainLayout><StudentAdmission themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}