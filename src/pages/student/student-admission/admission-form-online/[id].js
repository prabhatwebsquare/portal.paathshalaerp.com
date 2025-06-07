"use client";

import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { AdmissionFormPageOnline } from "@/components/Student/Admission/AdmissionFormPageOnline";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { useStudentStore } from "@/store/studentStore";

export default function Page() {
  const router = useRouter();
  const { id } = router.query;

  const themeColor = "pink";
  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
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

  return (
    <AdmissionFormPageOnline
      admissionId={id}
      SchoolInfo={SchoolInfo}
      themeColor={themeColor}
      sessionMasterId={sessionMasterId}
    />
  );
}
