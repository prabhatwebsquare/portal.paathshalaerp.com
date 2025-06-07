"use client"

import { Enquiry } from "@/components/Student/Enquiry"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"
import React from 'react'

function Index() {
  const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
  const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
  return <MainLayout><Enquiry themeColor={themeColor} sessionMasterId={sessionMasterId} /></MainLayout>
}

export default Index