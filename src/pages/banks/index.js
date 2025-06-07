"use client"

import { AdminBanks } from "@/components/AdminBanks"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  return <MainLayout><AdminBanks themeColor={themeColor} /></MainLayout>
}