"use client"

import { ClientActivation } from "@/components/Client/Activation"
import { AppRequest } from "@/components/Client/AppRequest"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  return <MainLayout><AppRequest themeColor={themeColor} /></MainLayout>
}