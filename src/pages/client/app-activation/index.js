"use client"

import { ClientActivation } from "@/components/Client/Activation"
import { AppActivation } from "@/components/Client/AppActivation"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
  return <MainLayout><AppActivation themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}