"use client"

import { AdminBiometric } from "@/components/Biometric"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  return <MainLayout><AdminBiometric themeColor={themeColor} /></MainLayout>
}