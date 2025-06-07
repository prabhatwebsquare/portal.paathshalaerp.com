"use client";

import { Holidays } from "@/components/MobileApp/Calender/Holidays";
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
      <Holidays themeColor={themeColor} sessionMasterId={sessionMasterId} />
    </MainLayout>
  );
}
