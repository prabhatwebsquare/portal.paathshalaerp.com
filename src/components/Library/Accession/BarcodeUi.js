import CustomInput from "@/common/CustomInput";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Flex,
  Box,
} from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";
import { BarcodePrint } from "./BarcodePrint";

export const BarcodeUi = ({ data, closeModal, themeColor }) => {
  const [inputValue, setInputValue] = useState({ start: 0 });
  const [printProps, setPrintProps] = useState(null);
  const printRef = useRef(null);

  const handlePrintClick = (props) => {
    setPrintProps(props);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => setPrintProps(null),
    onPrintError: () => setPrintProps(null),
  });

  useEffect(() => {
    if (printProps) {
      handlePrint();
    }
  }, [printProps, handlePrint]);

  return (
    <Modal size={"3xl"} isOpen={data} placement="right" onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Print Barcode</ModalHeader>
        <ModalBody>
          <Box>
            <CustomInput
              w={"50%"}
              type={"number"}
              name="start"
              label={"Start From"}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
            <Flex h="fit-content" w={"100%"} flexWrap={"wrap"}>
              {map(
                parseInt(inputValue?.start || 0) > 0
                  ? new Array(parseInt(inputValue?.start || 0) - 1)
                  : new Array(parseInt(inputValue?.start || 0)),
                (d, i) => (
                  <Box key={i} w={"25%"} h={"50pt"} />
                )
              )}
              {map(data, (d) => (
                <Barcode height={50} width={1.5} value={d} />
              ))}
            </Flex>
            <Box display={"none"}>
              {printProps && (
                <Box ref={printRef}>
                  <BarcodePrint
                    data={printProps}
                    start={inputValue?.start || 0}
                    setPrintProps={setPrintProps}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            size={"sm"}
            variant="outline"
            mr={3}
            colorScheme={"red"}
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            size={"sm"}
            onClick={() => handlePrintClick(data)}
            colorScheme={themeColor}
          >
            Print
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
