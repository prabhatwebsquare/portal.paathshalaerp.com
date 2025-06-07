import { PageHeader } from "@/common/PageHeader";
import { Box, Button } from "@chakra-ui/react";
import { AdmissionForm } from "./AdmissionForm";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { AdmissionFormPrint } from "./AdmissionFormPrint";

export const AdmissionFormPage = ({ themeColor, sessionMasterId }) => {
  return (
    <Box h="100%">
      <PageHeader heading={"Admission Form"} />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <AdmissionForm
            themeColor={themeColor}
            sessionMasterId={sessionMasterId}
          />
        </Box>
      </Box>
    </Box>
  );
};
