"use client"

import { Permissions } from "@/components/Client/Permissions"
import { ClientRegistration } from "@/components/Client/Registration"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  return <MainLayout><Permissions themeColor={themeColor} /></MainLayout>
}