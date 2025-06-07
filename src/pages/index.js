import { Dashboard } from "@/components/Dashboard";
import { MainLayout } from "@/layout/MainLayout";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { useMemo } from "react";

export default function Home() {
  const themeColor = useMemo(() => getLocalStorageItem("themeColor"), []);
  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
  );
  const masterCheck = useMemo(() => getLocalStorageItem("masterCheck"), []);
  return (
    <MainLayout>
      <Dashboard sessionMasterId={sessionMasterId} themeColor={themeColor} masterCheck={masterCheck}/>
    </MainLayout>
  );
}
