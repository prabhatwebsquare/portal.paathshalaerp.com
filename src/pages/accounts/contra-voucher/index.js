"use client"

import { ContraVoucher } from "@/components/Account/ContraVoucher"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
  return <MainLayout><ContraVoucher themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}