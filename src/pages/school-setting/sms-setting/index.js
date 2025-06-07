"use client"

import { AdditionalSetting } from "@/components/AdditionalSetting";
import { SmsSetting } from "@/components/SmsSetting";
import { MasterLayout } from "@/layout/MasterLayout";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { useMemo } from "react";


export default function Page() {
    const themeColor = useMemo(() => (getLocalStorageItem("themeColor")), [])
    return <MasterLayout><SmsSetting themeColor={themeColor} /></MasterLayout>
}