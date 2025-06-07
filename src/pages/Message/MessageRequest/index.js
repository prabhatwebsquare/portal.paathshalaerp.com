"use client"

import { MessageRequest } from "@/components/Client/MessageRequest"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  return <MainLayout><MessageRequest themeColor={themeColor} /></MainLayout>
}