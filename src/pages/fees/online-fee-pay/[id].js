"use client";

import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { PaymentPageOnline } from "@/components/fees/PaymentPageOnline";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { useStudentStore } from "@/store/studentStore";
import AtomPaynetz from "@/components/AtomPaynetz";

export default function Page() {
    const router = useRouter();
    const { id } = router.query;
    const themeColor = "pink";
    const sessionMasterId = useMemo(
        () => getLocalStorageItem("sessionMasterId"), []
    );
    const { getSchoolInfoAction, SchoolInfoStatus, SchoolInfo } = useStudentStore(
        (s) => ({
            getSchoolInfoAction: s.getSchoolInfoAction,
            SchoolInfoStatus: s.SchoolInfoStatus,
            SchoolInfo: s.SchoolInfo,
        })
    );
    useEffect(() => {
        if (!id) return;
        getSchoolInfoAction({
            orgCode: id,
        });
        return () => {};
    }, [id]);

    if (!id) return null;

    return ( <
        PaymentPageOnline admissionId = { id }
        SchoolInfo = { SchoolInfo }
        themeColor = { themeColor }
        sessionMasterId = { sessionMasterId }
        />

    );
}