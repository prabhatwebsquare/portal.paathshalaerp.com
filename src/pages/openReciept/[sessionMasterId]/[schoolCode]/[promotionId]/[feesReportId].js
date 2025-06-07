import { ReceiptDrawer } from "@/components/fees/ReceiptDrawer";
import { STATUS } from "@/constant";
import { useStdFeesStore } from "@/store/stdFees";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { useRouter } from "next/router"; // Importing useRouter
import React, { useState, useEffect, useMemo } from "react";

function OpenReceipt() {
  const router = useRouter(); // Use the router hook
  const { sessionMasterId, schoolCode, promotionId, feesReportId } =
    router.query; // Destructure the query params
  const [toggleReceiptModal, setToggleReceiptModal] = useState(null);
  const themeColor = useMemo(() => getLocalStorageItem("themeColor"), []);

  const {
    getFeesReceiptAction,
    getFeesReceiptStatus,
    feeReceiptData,
    resetFeesReceipt,
  } = useStdFeesStore((s) => ({
    getFeesReceiptAction: s.getFeesReceiptAction,
    getFeesReceiptStatus: s.getFeesReceiptStatus,
    feeReceiptData: s.feeReceiptData,
    resetFeesReceipt: s.resetFeesReceipt,
  }));
  useEffect(() => {
    if (sessionMasterId && schoolCode && promotionId && feesReportId) {
      getFeesReceiptAction({
        sessionMasterId,
        schoolCode,
        promotionId,
        feesReportId,
      });
    }
  }, [
    sessionMasterId,
    schoolCode,
    promotionId,
    feesReportId,
    getFeesReceiptAction,
  ]);
  useEffect(() => {
    if (getFeesReceiptStatus === STATUS.SUCCESS) {
      resetFeesReceipt();
      setToggleReceiptModal(feeReceiptData);
    }
  }, [feeReceiptData, getFeesReceiptStatus, resetFeesReceipt]);
  return (
    <div>
      <ReceiptDrawer
        themeColor={themeColor}
        feeReceiptData={feeReceiptData}
        closeModal={() => setToggleReceiptModal(null)}
        resetAllData={resetFeesReceipt}
      />
    </div>
  );
}
export default OpenReceipt;



