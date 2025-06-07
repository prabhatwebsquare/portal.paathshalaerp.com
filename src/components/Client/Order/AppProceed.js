import { ConfirmAlert } from "@/common/ConfirmationAlert";
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { PaymentVerification } from "./ClientVerification";
import { useClientStore } from "@/store/client";
import { STATUS } from "@/constant";

export const AppProceed = ({ data, closeDrawer, themeColor }) => {
  const { makePaymentAction, makePaymentStatus, getOrderRequestAction } =
    useClientStore((s) => ({
      makePaymentAction: s.makePaymentAction,
      getOrderRequestAction: s.getOrderRequestAction,
      makePaymentStatus: s.makePaymentStatus,
    }));

  useEffect(() => {
    if (makePaymentStatus === STATUS.SUCCESS) {
      closeDrawer();
      getOrderRequestAction({ status: 0 });
    }
  }, [makePaymentStatus, closeDrawer, getOrderRequestAction]);

  if (!data) return null;

  // Calculate the paying amount safely
  const payingAmount = (data?.totalAmount || 0) - ((data?.advanceAmount || 0) + (data?.discount || 0));

  // Utility to parse app modules (safe JSON parse)
  const parseAppModules = (apps) => {
    try {
      const parsed = JSON.parse(apps);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  const adminApps = parseAppModules(data?.adminApp);
  const driverApps = parseAppModules(data?.driverApp);

  return (
    <Drawer size={"xl"} isOpen={!!data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Client Profile</DrawerHeader>

        <DrawerBody>
          <Box bg="white" p={4} borderRadius="md">
            {/* Organization Information */}
            <Flex flexWrap="wrap" gap={0}>
              <ClientDetail heading="Organization Code" detail={data?.orgCode} />
              <ClientDetail heading="School/Institute" detail={data?.name} />
              <ClientDetail heading="School Contact" detail={data?.contact} />
              <ClientDetail heading="Student Count" detail={data?.studentCount} />
              <ClientDetail heading="Total Amount" detail={`₹ ${data?.totalAmount || 0}`} />
              <ClientDetail heading="Advance Received" detail={`₹ ${data?.advanceAmount || 0}`} />
              <ClientDetail heading="Paying Amount" detail={`₹ ${payingAmount}`} />
            </Flex>

            <Divider my={4} />


            <Box mt={4}>
              <Text fontWeight="bold" fontSize="lg" mb={2}>
                Accessible Apps
              </Text>
              <Flex flexWrap="wrap" gap={6}>
                {adminApps.length > 0 && (
                  <ClientDetailSecond heading="Admin App Modules" detail={adminApps.join(", ")} />
                )}
                {driverApps.length > 0 && (
                  <ClientDetailSecond heading="Driver App Modules" detail={driverApps.join(", ")} />
                )}
                {/* Similarly, you can show principalApp, teacherApp, etc. if needed */}
              </Flex>
            </Box>

            {/* Payment Verification Component */}
            <Box mt={6}>
              <PaymentVerification data={data} themeColor={themeColor} />
            </Box>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const ClientDetail = ({ heading, detail }) => {
  return (
    <Box w="25%" mb={4}>
      <Text fontSize="sm" color="gray.600">
        {heading}
      </Text>
      <Text fontSize="md" fontWeight="semibold" color="black">
        {detail || "-"}
      </Text>
    </Box>
  );
};
const ClientDetailSecond = ({ heading, detail }) => {
  return (
    <Box w="48%" mb={4}>
      <Text fontSize="sm" color="gray.600">
        {heading}
      </Text>
      <Text fontSize="md" fontWeight="semibold" color="black">
        {detail || "-"}
      </Text>
    </Box>
  );
};

