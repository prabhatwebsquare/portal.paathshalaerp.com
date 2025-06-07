import { PageHeader } from "@/common/PageHeader";
import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { DownloadExcel } from "@/common/DownloadExcel";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useStdFeesStore } from "@/store/stdFees";
import { ClassStudentSummary } from "./ClassStudentSummary";

export const ClassSummary = ({ themeColor, sessionMasterId }) => {
  const [excelData, setExcelData] = useState(null);
  const { feesSummary } = useStdFeesStore((s) => ({
    feesSummary: s.feesSummary,
  }));
  useEffect(() => {
    if (feesSummary?.length > 0) {
      setExcelData(feesSummary);
    }
  }, [feesSummary]);
  return (
    <Box h="100%">
      <PageHeader
        heading={"Class Wise Summary"}
        extra={
          <Tooltip label="Download Excel" placement="top">
            <DownloadExcel
              button={<RiFileExcel2Fill />}
              data={excelData}
              name={"Class Summary"}
            />
          </Tooltip>
        }
      />
      <Box borderRadius={5} bg={"white"}>
        <ClassStudentSummary
          themeColor={themeColor}
          sessionMasterId={sessionMasterId}
        />
      </Box>
    </Box>
  );
};
