"use client"
import { MessageRequestMore } from "@/components/Client/MessageRequestMore"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  return <MainLayout><MessageRequestMore themeColor={themeColor} /></MainLayout>
}