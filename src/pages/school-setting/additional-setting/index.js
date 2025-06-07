"use client"

import { AdditionalSetting } from "@/components/AdditionalSetting";
import { MasterLayout } from "@/layout/MasterLayout";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { useMemo } from "react";


export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    const sessionMasterId = useMemo(() => (getLocalStorageItem("sessionMasterId")), [])
    return <MasterLayout><AdditionalSetting sessionMasterId={sessionMasterId} themeColor={themeColor} /></MasterLayout>
}