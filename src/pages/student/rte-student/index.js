"use client"

import { RteStudent } from "@/components/Student/RteStudent"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
  return <MainLayout><RteStudent themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}