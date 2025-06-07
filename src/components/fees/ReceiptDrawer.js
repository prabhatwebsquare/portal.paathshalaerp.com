import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { FeesReceipt } from "./FeesReceipt";
import { Fragment, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { MdLocalPrintshop } from "react-icons/md";
import { AiOutlineMail } from "react-icons/ai";
import { IoLogoWhatsapp } from "react-icons/io";
import { FeesReceiptSecond } from "./FeesReceipt2";
import FeesReceipThree from "./FeesReceipt3";

export const ReceiptDrawer = ({
  themeColor,
  feeReceiptData,
  closeModal,
  resetAllData,
  isTransport,
  receiptLayout,
}) => {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
    @page {
        size: A4 portrait;
        margin: 10mm; /* Ensure proper spacing */
    }
    * {

        line-height: 1.2;
    }
    .print-container {
        width: 100%;
        max-width: 780px;
        margin: auto;
        padding: 5px;
    }
`,
    onAfterPrint: () => {
      printRef.current = null;
      resetAllData();
      closeModal();
    },
  });

  return (
    <Modal size={"4xl"} isOpen={feeReceiptData} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Receipt Preview</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Visible Preview */}
          <ReceiptLayoutComponent
            layout={receiptLayout}
            data={feeReceiptData}
            isTransport={isTransport}
            isPrint={false}
          />

          {/* Hidden Print */}
          <Box display="none">
            <ReceiptLayoutComponent
              layout={receiptLayout}
              data={feeReceiptData}
              isTransport={isTransport}
              isPrint={true}
              printRef={printRef}
            />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Flex align={"center"} gap={3}>
            <Button
              size={"sm"}
              colorScheme="red"
              variant={"outline"}
              onClick={closeModal}
            >
              Close
            </Button>
            <Button
              size={"sm"}
              colorScheme={themeColor}
              leftIcon={<MdLocalPrintshop fontSize={18} />}
              onClick={handlePrint}
            >
              Print
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const ReceiptLayoutComponent = ({
  layout,
  printRef,
  data,
  isTransport,
  isPrint,
}) => {
  if (!data) return null;

  if (isPrint) {
    // PRINT MODE — Show both copies
    return (
      <Box ref={printRef} className="print-container">
        {layout === 2 ? (
          <Flex justify="space-between" gap={0} wrap="wrap">
            {["Candidate-Copy", "Office-Copy"].map((copy, key) => (
              <Box key={key} width="48%" ml={key === 0 ? "20px" : 0}>
                <FeesReceiptSecond
                  isTransport={isTransport}
                  printProps={data}
                  copy={copy}
                />
                {key === 0 && (
                  <Box
                    bottom="0"
                    width="1px"
                    borderRight="10px dashed black"
                    height="100%"
                  />
                )}
              </Box>
            ))}
          </Flex>
        ) : layout === 3 ? (
          <FeesReceipThree
            isTransport={isTransport}
            printProps={data}
            copy="Candidate-Copy"
          />
        ) : (
          <>
            <FeesReceipt
              isTransport={isTransport}
              printProps={data}
              copy="Candidate-Copy"
            />
            <Box
              position="absolute"
              right="-10px"
              top="0"
              bottom="0"
              width="1px"
              borderRight="1px dashed black"
              height="100%"
            />
            <Box mt={10}>
              <FeesReceipt
                isTransport={isTransport}
                printProps={data}
                copy="Office-Copy"
              />
            </Box>
          </>
        )}
      </Box>
    );
  }

  return (
    <>
      {layout === 2 ? (
          <Flex justify="space-between" gap={0} wrap="wrap">
            {["Candidate-Copy", "Office-Copy"].map((copy, key) => (
              <Box key={key} width="48%" ml={key === 0 ? "20px" : 0}>
                <FeesReceiptSecond
                  isTransport={isTransport}
                  printProps={data}
                  copy={copy}
                />
             
              </Box>
            ))}
          </Flex>
        ) : layout === 3 ? (
          <FeesReceipThree
            isTransport={isTransport}
            printProps={data}
            copy="Candidate-Copy"
          />
        ) : (
          <>
            <FeesReceipt
              isTransport={isTransport}
              printProps={data}
              copy="Candidate-Copy"
            />
            
            <Box mt={10}>
              <FeesReceipt
                isTransport={isTransport}
                printProps={data}
                copy="Office-Copy"
              />
            </Box>
          </>
        )}
    </>
  );
};
