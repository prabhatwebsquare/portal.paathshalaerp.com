"use client";

import { PopUpAlert } from "@/components/MobileApp/TimeTable";
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
      <PopUpAlert themeColor={themeColor} sessionMasterId={sessionMasterId} />
    </MainLayout>
  );
}
