"use client"

import { ReceiptVoucher } from "@/components/Account/ReceiptVoucher"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
  return <MainLayout><ReceiptVoucher sessionMasterId={sessionMasterId} themeColor={themeColor} /></MainLayout>
}