import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
import { useAccountStore } from "@/store/Account";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/react";
import { toUpper } from "lodash";
import React, { useEffect, useState } from "react";

const openingType = [
  { name: "CR", value: "CR" },
  { name: "DR", value: "DR" },
];
export const LedgerProfile = ({
  data,
  closeProfile,
  sessionMasterId,
  themeColor,
}) => {
  return (
    <Drawer size={"lg"} isOpen={!!data} placement="right" onClose={closeProfile}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{data?.name || "Ledger"} Profile</DrawerHeader>
        <DrawerBody>
          <Flex flexWrap="wrap">
            {/* Basic Details */}
            <Flex w="100%">
              <Text
                mt={4}
                mb={2}
                w="fit-content"
                color={`${themeColor}.700`}
                fontWeight="semibold"
                borderBottom="1px solid"
                borderColor={`${themeColor}.300`}
              >
                Basic Details
              </Text>
            </Flex>
            <LedgerDetail heading="Name" detail={data?.name} />
            <LedgerDetail heading="Type" detail={data?.type} />
            <LedgerDetail heading="Contact" detail={data?.contact} />
            <LedgerDetail heading="Email" detail={data?.email} />
            <LedgerDetail w="100%" heading="Address" detail={data?.address} />

            {/* Tax Details */}
            <Flex w="100%">
              <Text
                mt={4}
                mb={2}
                w="fit-content"
                color={`${themeColor}.700`}
                fontWeight="semibold"
                borderBottom="1px solid"
                borderColor={`${themeColor}.300`}
              >
                Tax Details
              </Text>
            </Flex>
            <LedgerDetail heading="PAN No." detail={data?.pan} />
            <LedgerDetail heading="GST No." detail={data?.gst} />

            {/* Bank Details */}
            <Flex w="100%">
              <Text
                mt={4}
                mb={2}
                w="fit-content"
                color={`${themeColor}.700`}
                fontWeight="semibold"
                borderBottom="1px solid"
                borderColor={`${themeColor}.300`}
              >
                Bank Details
              </Text>
            </Flex>
            <LedgerDetail heading="Bank Name" detail={data?.bank} />
            <LedgerDetail heading="Account Number" detail={data?.accountNumber} />
            <LedgerDetail heading="IFSC Code" detail={data?.ifsc} />
            <LedgerDetail heading="Branch" detail={data?.branch} />

            {/* Other Info */}
            <Flex w="100%">
              <Text
                mt={4}
                mb={2}
                w="fit-content"
                color={`${themeColor}.700`}
                fontWeight="semibold"
                borderBottom="1px solid"
                borderColor={`${themeColor}.300`}
              >
                Additional Info
              </Text>
            </Flex>
            <LedgerDetail heading="Opening Balance" detail={`₹ ${data?.openingBalance || 0}`} />
            <LedgerDetail heading="Created At" detail={data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : "-"} />
          </Flex>
        </DrawerBody>
        <DrawerFooter>
          <Button
            size="sm"
            variant="outline"
            mr={3}
            colorScheme="red"
            onClick={closeProfile}
          >
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const LedgerDetail = ({ w, heading, detail }) => {
  return (
    <Box w={w || "33.33%"} mb={2}>
      <Text fontSize={14}>{heading}</Text>
      <Text fontSize={16} fontWeight="semibold">
        {detail || " - "}
      </Text>
    </Box>
  );
};

