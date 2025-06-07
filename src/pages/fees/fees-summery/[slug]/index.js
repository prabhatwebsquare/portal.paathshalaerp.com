"use client"

import { StudentFeesSummary } from "@/components/fees/FeesSummary/StudentsFeesSummary"
import { MainLayout } from "@/layout/MainLayout"
import { useRouter } from "next/router"

export default function Page() {
    const { query } = useRouter()

    return <MainLayout><StudentFeesSummary  id={query.slug} /></MainLayout>
}