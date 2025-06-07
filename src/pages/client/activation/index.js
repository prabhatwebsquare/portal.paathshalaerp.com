"use client"

import { ClientActivation } from "@/components/Client/Activation"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
  return <MainLayout><ClientActivation themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}