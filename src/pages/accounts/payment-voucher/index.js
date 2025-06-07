"use client"

import { PaymentVoucher } from "@/components/Account/PaymentVoucher"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
  return <MainLayout><PaymentVoucher sessionMasterId={sessionMasterId} themeColor={themeColor} /></MainLayout>
}