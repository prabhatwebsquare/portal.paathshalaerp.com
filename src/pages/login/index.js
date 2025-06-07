"use client"

import { LoginUser } from "@/layout/Login"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"

export default function Page() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), []) || "blue"
  return <LoginUser themeColor={themeColor} />
}