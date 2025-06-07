"use client"

import { FamilyMeet } from "@/components/Hostel/FamilyMeet"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
  return <MainLayout><FamilyMeet themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}