import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { map } from "lodash";
import { useRouter } from "next/router";
import { MdNotificationsActive, MdSettingsSuggest } from "react-icons/md";

export const SettingModal = ({ data, closeModal, themeColor }) => {
  const router = useRouter();
  const items = [
    {
      name: "Master Setting",
      icon: <MdSettingsSuggest />,
      key: "master-setting",
      href: "/school-setting/class-setup",
    },
    {
      name: "SMS Setting",
      icon: <MdNotificationsActive />,
      key: "sms-setting",
      href: "/school-setting/sms-setting",
    },
  ];
  return (
    <Modal isOpen={data} onClose={closeModal} colorScheme={"blue"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          bg={`${themeColor}.700`}
          color={"white"}
          borderBottom={"1px solid"}
          borderColor={"whiteAlpha.400"}
        >
          Settings
        </ModalHeader>
        <ModalCloseButton color={"white"} />
        <ModalBody bg={`${themeColor}.700`}>
          <Flex flexWrap={"wrap"} gap={5}>
            {map(items, (item) => (
              <Box w={"30%"} py={2} px={3}>
                <Box
                  py={3}
                  align="center"
                  cursor={"pointer"}
                  borderRadius={10}
                  bg={"none"}
                  color={"white"}
                  _hover={{ bg: "white", color: `${themeColor}.800` }}
                  onClick={() => router.push(item.href)}
                >
                  <Text fontSize={22}>{item.icon}</Text>
                  <Text mt={1} fontSize={11} fontWeight={"semibold"}>
                    {item.name}
                  </Text>
                </Box>
              </Box>
            ))}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
