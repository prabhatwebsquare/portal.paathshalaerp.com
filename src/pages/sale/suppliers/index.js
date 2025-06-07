"use client"

import { Supplier } from "@/components/Sell/Supplier"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
  return <MainLayout><Supplier themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}