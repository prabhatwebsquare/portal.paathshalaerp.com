"use client"

import { IncomeType } from "@/components/Account/IncomeType"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  return <MainLayout><IncomeType themeColor={themeColor} /></MainLayout>
}