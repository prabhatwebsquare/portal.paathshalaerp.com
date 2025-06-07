"use client"

import { SchoolProfile } from "@/components/SchoolProfile"
import { MainLayout } from "@/layout/MainLayout"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { useMemo } from "react"
import React from 'react'

function Index() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])

    return <MainLayout><SchoolProfile themeColor={themeColor} /></MainLayout>
}

export default Index
