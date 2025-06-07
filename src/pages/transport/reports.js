import { RouteWiseReport } from "@/components/Transport/RouteWiseReport";
import { MainLayout } from "@/layout/MainLayout";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { useEffect, useState } from "react";

export default function Reports() {
  const [themeColor, setThemeColor] = useState(null);
  const [sessionMasterId, setSessionMasterId] = useState(null);

  useEffect(() => {
    setThemeColor(getLocalStorageItem("themeColor"));
    setSessionMasterId(getLocalStorageItem("sessionMasterId"));
  }, []);

  if (!themeColor || !sessionMasterId) return null; // Avoid rendering until values are available

  return (
    <MainLayout>
      <RouteWiseReport
        themeColor={themeColor}
        sessionMasterId={sessionMasterId}
      />
    </MainLayout>
  );
}
