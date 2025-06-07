import { Flex, Box } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect } from "react";
import Barcode from "react-barcode";

export const BarcodePrint = ({ data, start, setPrintProps }) => {
  useEffect(() => {
    return () => setPrintProps();
  }, [setPrintProps]);

  const rowHeight = 84.2; // Height of one row to ensure exactly 10 rows fit on an A4 page (in points)
  const barcodeWidth = "25%"; // Ensures 4 columns per row

  return (
    <Box className="barcode-print-container">
      {/* Empty boxes for 'start' offset */}
      {map(
        parseInt(start || 0) > 0
          ? new Array(parseInt(start || 0) - 1)
          : new Array(parseInt(start || 0)),
        (d, i) => (
          <Box key={`empty-${i}`} className="barcode-item" />
        )
      )}
      {/* Render barcodes */}
      {map(data, (d, i) => (
        <Box key={`barcode-${i}`} className="barcode-item">
          <Barcode height={50} width={2} value={d} />
        </Box>
      ))}
    </Box>
  );
};
