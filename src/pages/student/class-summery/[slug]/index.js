"use client"

import { StudentsList } from "@/components/Student/ClassSummary/StudentsList"
import { MainLayout } from "@/layout/MainLayout"
import { useRouter } from "next/router"

export default function Page() {
    const { query } = useRouter()

    return <MainLayout><StudentsList  id={query.slug} /></MainLayout>
}