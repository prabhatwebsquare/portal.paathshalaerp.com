"use client";

import { PublishMarksheetList } from "@/components/Exam/PublishMarksheetList";
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
      <PublishMarksheetList
        themeColor={themeColor}
        sessionMasterId={sessionMasterId}
      />
    </MainLayout>
  );
}
