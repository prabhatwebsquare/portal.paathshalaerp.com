import { ConfirmAlert } from "@/common/ConfirmationAlert";
import { useClientStore } from "@/store/client";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  Flex,
  Text,
  Badge,
  Icon,
  DrawerFooter,
} from "@chakra-ui/react";
import { FaUser, FaSchool, FaMoneyBillWave, FaCog } from "react-icons/fa";
import dayjs from "dayjs";
import { useState } from "react";

export const ClientProfile = ({
  data,
  closeDrawer,
  themeColor,
  isForViewOnly,
}) => {
  const [toggleConfirm, setToggleConfirm] = useState(false);

  const { ApproveAppRequestAction, getOrderRequestAction } = useClientStore(
    (s) => ({
      ApproveAppRequestAction: s.ApproveAppRequestAction,
      getOrderRequestAction: s.getOrderRequestAction,
    })
  );

  const confirmApproval = async () => {
    const info = {
      approveStatus: 2,
      id : data.id,
    };

    await ApproveAppRequestAction(info);
    closeDrawer();
    getOrderRequestAction({ status: 1 });
  };

  const safeParse = (value) => {
    try {
      return JSON.parse(value);
    } catch (err) {
      return [];
    }
  };

  return (
    <Drawer size={"xl"} isOpen={!!data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay bg="rgba(0, 0, 0, 0.4)" />
      <DrawerContent
        bg="gray.50"
        borderLeft="4px solid"
        borderColor={`${themeColor}.600`}
      >
        <DrawerCloseButton
          color="white"
          size="lg"
          _hover={{ transform: "rotate(180deg)", transition: "0.3s" }}
        />
        <DrawerHeader
          bgGradient={`linear(to-r, ${themeColor}.600, ${themeColor}.400)`}
          color="white"
          textAlign="center"
          fontWeight="bold"
          py={6}
          borderBottom="1px solid"
          borderColor={`${themeColor}.300`}
          boxShadow="sm"
        >
          <Text fontSize="2xl" letterSpacing="wide">
            Client Profile
          </Text>
          <Text fontSize="sm" opacity={0.8}>
            Order #{data.orderId}
          </Text>
        </DrawerHeader>

        <DrawerBody p={6}>
          <Box
            bg="white"
            borderRadius="xl"
            p={6}
            boxShadow="xl"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-5px)", boxShadow: "2xl" }}
          >
            {/* Basic Information */}
            <Section
              title="Basic Information"
              icon={FaUser}
              themeColor={themeColor}
              data={[
                { label: "Org Name", value: data.name },
                { label: "Contact", value: data.contact },
                { label: "Org Code", value: data.orgCode },
                { label: "Order ID", value: data.orderId },
                {
                  label: "Registered",
                  value: dayjs(data.createdAt).format("MMM D, YYYY"),
                },
                { label: "Students", value: data.studentCount },
                { label: "Gallery", value: data.photoGallaryLimit },
              ]}
            />

            {/* Modules */}
            <Section
              title="Modules Access"
              icon={FaCog}
              themeColor={themeColor}
              data={[
                { label: "Admin", value: safeParse(data.adminApp)?.join(", ") },
                {
                  label: "Principal",
                  value: safeParse(data.principalApp)?.join(", "),
                },
                {
                  label: "Coordinator",
                  value: safeParse(data.coordinatorApp)?.join(", "),
                },
                {
                  label: "Teacher",
                  value: safeParse(data.teacherApp)?.join(", "),
                },
                {
                  label: "Student",
                  value: safeParse(data.studentApp)?.join(", "),
                },
                {
                  label: "Driver",
                  value: safeParse(data.driverApp)?.join(", "),
                },
              ]}
            />

            {/* Payment Details */}
            <Section
              title="Payment Details"
              icon={FaMoneyBillWave}
              themeColor={themeColor}
              data={[
                { label: "Total", value: `${data.totalAmount} ₹` },
                { label: "Advance", value: `${data.advanceAmount} ₹` },
                {
                  label: "Status",
                  value: (
                    <Badge
                      colorScheme={data.paymentStatus === 1 ? "green" : "red"}
                      variant="subtle"
                      px={2}
                      py={1}
                    >
                      {data.paymentStatus === 1 ? "Paid" : "Pending"}
                    </Badge>
                  ),
                },
              ]}
            />

            {/* School Details */}
            {data.schoolData && (
              <Section
                title="School Information"
                icon={FaSchool}
                themeColor={themeColor}
                data={[
                  { label: "Name", value: data.schoolData.schoolName },
                  { label: "Affiliation", value: data.schoolData.affNo },
                  { label: "Email", value: data.schoolData.schoolEmail },
                  { label: "Mobile", value: data.schoolData.mobileNo },
                  { label: "Contact", value: data.schoolData.contactNo },
                  { label: "Address", value: data.schoolData.address },
                ]}
              />
            )}
          </Box>

          {!isForViewOnly && (
            <Flex justify="center" mt={8}>
              <Button
                colorScheme={themeColor}
                size="lg"
                px={8}
                py={6}
                borderRadius="full"
                boxShadow="lg"
                bgGradient={`linear(to-r, ${themeColor}.500, ${themeColor}.700)`}
                _hover={{
                  transform: "scale(1.05)",
                  boxShadow: "xl",
                  bgGradient: `linear(to-r, ${themeColor}.600, ${themeColor}.800)`,
                }}
                transition="all 0.3s"
                onClick={() => setToggleConfirm(true)}
              >
                Approve Request
              </Button>
            </Flex>
          )}
        </DrawerBody>

        <DrawerFooter
          bg="white"
          borderTop="1px solid"
          borderColor="gray.200"
          justifyContent="center"
          py={4}
        >
          <Text fontSize="sm" color="gray.500">
            Last Updated: {dayjs(data.updatedAt).format("MMM D, YYYY HH:mm")}
          </Text>
        </DrawerFooter>
      </DrawerContent>

      {toggleConfirm && (
        <ConfirmAlert
          isOpen={toggleConfirm}
          closeAlert={() => setToggleConfirm(false)}
          confirm={confirmApproval}
          heading="Approve Client Request"
          description="Are you sure you want to approve this client? This action cannot be undone."
          confirmButtonColor={themeColor}
          button="Approve"
          color="green"
        />
      )}
    </Drawer>
  );
};

const Section = ({ title, data, themeColor, icon }) => (
  <Box
    mb={6}
    p={4}
    bgGradient={`linear(to-br, white, ${themeColor}.50)`}
    borderRadius="lg"
    border="1px solid"
    borderColor={`${themeColor}.100`}
    transition="all 0.3s"
    _hover={{ boxShadow: "md" }}
  >
    <Flex align="center" mb={3}>
      <Icon as={icon} color={`${themeColor}.600`} boxSize={5} mr={2} />
      <Text
        fontSize="lg"
        fontWeight="bold"
        color={`${themeColor}.700`}
        letterSpacing="wide"
      >
        {title}
      </Text>
    </Flex>
    <Flex wrap="wrap" gap={4} justify="space-between" align="flex-start">
      {data.map((item, index) => (
        <Box key={index} flex={{ base: "1 1 45%", md: "1 1 30%" }} minW="150px">
          <Text
            fontWeight="semibold"
            color="gray.600"
            fontSize="xs"
            textTransform="uppercase"
          >
            {item.label}
          </Text>
          <Text
            color="gray.800"
            fontSize="sm"
            mt={1}
            wordBreak="break-word"
            noOfLines={2}
          >
            {item.value || "-"}
          </Text>
        </Box>
      ))}
    </Flex>
  </Box>
);
