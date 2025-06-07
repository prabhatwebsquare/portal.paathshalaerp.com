"use client"

import { ReceivedItem } from "@/components/Sell/ReceivedItem"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
  return <MainLayout><ReceivedItem themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}