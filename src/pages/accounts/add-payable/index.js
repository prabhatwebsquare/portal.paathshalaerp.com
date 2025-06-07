"use client"

import { AddPayable } from "@/components/Account/AddPayable"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
  return <MainLayout><AddPayable sessionMasterId={sessionMasterId} themeColor={themeColor} /></MainLayout>
}