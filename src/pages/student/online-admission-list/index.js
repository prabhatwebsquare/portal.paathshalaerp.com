"use client";

import { OnlineAdmissionRequest } from "@/components/Student/OnlineAdmissionRequest";
import { MainLayout } from "@/layout/MainLayout";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { useMemo } from "react";

export default function Page() {
  const themeColor = useMemo(() => getLocalStorageItem("themeColor"), []);
  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
  );

  return (
    <MainLayout>
      <OnlineAdmissionRequest themeColor={themeColor} sessionMasterId={sessionMasterId} />
    </MainLayout>
  );
}
