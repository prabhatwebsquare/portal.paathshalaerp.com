"use client";

import { ClientActivation } from "@/components/Client/Activation";
import { OrderList } from "@/components/Client/Order";
import { MainLayout } from "@/layout/MainLayout";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { useMemo } from "react";

export default function Page() {
  const themeColor = useMemo(() => getLocalStorageItem("themeColor"), []);
  return (
    <MainLayout>
      <OrderList themeColor={themeColor} />
    </MainLayout>
  );
}
