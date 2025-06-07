import { useEffect, useRef } from "react";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { TransferCertificate } from "../Student/StudentTC/TransferCertificate";
import { useReactToPrint } from "react-to-print";
import Tcformatpage from "./Tcformatpage";

export const TCFormatChoose = ({ data,   setPrintProps }) => {
  const tcLayout = getLocalStorageItem("tcLayout");
  const printRef = useRef();
  useEffect(() => {
    return () => setPrintProps(null);
  }, [setPrintProps]);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => setPrintProps(null),
    onPrintError: () => setPrintProps(null),
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 10mm;
      }
      * {
        box-sizing: border-box;
        line-height: 1.4;
      }
    `,
  });

  useEffect(() => {
    if (data) {
      handlePrint();
    }
  }, [data, handlePrint]);

  return (
    <div style={{ display: "none" }}>
      <div ref={printRef}>
        {tcLayout === 1 ? (
          <TransferCertificate printTcProps={data} />
        ) : (
          <Tcformatpage printTcProps={data} />
        )}
      </div>
    </div>
  );
};

export default TCFormatChoose;