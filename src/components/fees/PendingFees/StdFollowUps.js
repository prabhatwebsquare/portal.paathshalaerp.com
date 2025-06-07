import CustomInput from "@/common/CustomInput";
import CustomTextarea from "@/common/CustomTextarea";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useStudentStore } from "@/store/studentStore";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { map } from "lodash";
import { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";

export const StdFollowUps = ({
  closeDrawer,
  data,
  themeColor,
  sessionMasterId,
}) => {
  const [inputValue, setInputValue] = useState({
    message: "",
    date: dayjs().format("YYYY-MM-DD"),
  });

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [data]);

  function timeAgo(datetime) {
    const currentDate = new Date();
    const pastDate = new Date(datetime);
    const timeDifference = currentDate - pastDate;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return days === 1 ? "1 day ago" : `${days} days ago`;
    if (hours > 0) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    if (minutes > 0)
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    return "Just now";
  }

  const {
    addFeesFollowUpAction,
    addFeesFollowUpStatus,
    feesFollowups,
    getFeesFollowUpAction,
    getFeesFollowUpStatus,
    resetFeesFollowupList,
  } = useStudentStore((s) => ({
    addFeesFollowUpAction: s.addFeesFollowUpAction,
    addFeesFollowUpStatus: s.addFeesFollowUpStatus,
    feesFollowups: s.feesFollowups,
    getFeesFollowUpAction: s.getFeesFollowUpAction,
    getFeesFollowUpStatus: s.getFeesFollowUpStatus,
    resetFeesFollowupList: s.resetFeesFollowupList,
  }));

  const addFollowup = () => {
    addFeesFollowUpAction({
      promotionId: data.id,
      date: inputValue.date,
      remark: inputValue.message,
      sessionMasterId: sessionMasterId,
    });
    setInputValue((prev) => ({ ...prev, message: "" }));
  };

  useEffect(() => {
    if (data && getFeesFollowUpStatus === STATUS.NOT_STARTED) {
      getFeesFollowUpAction(data.id);
    }

    return () => {};
  }, [data]);
  useEffect(() => {
    return () => {
      resetFeesFollowupList();
    };
  }, []);

  return (
    <Drawer size="lg" isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent display="flex" flexDirection="column" bg="gray.50">
        <DrawerCloseButton
          color="white"
          width={20}
          fontSize="sm"
          fontWeight="bold"
        />
        <Flex
          bgGradient={`linear(to-r, ${themeColor}.600, ${themeColor}.400)`}
          color="white"
          px={5}
          py={3}
          align="center"
          boxShadow="md"
        >
          <Text ml={3} fontSize="xl" fontWeight="bold">
            {data?.student_master?.studentName || "Student Name"}
          </Text>
        </Flex>

        <DrawerBody
          display="flex"
          flexDirection="column"
          p={0}
          flex="1"
          overflowY="auto"
          borderLeft="1px solid"
          borderRight="1px solid"
          borderColor="gray.200"
          className="scollbox"
          ref={containerRef}
        >
          <Box flex="1" px={4} pt={2} pb="4rem">
            {map(feesFollowups, (remark, index) => (
              <Flex mt={4} w="100%" justify="flex-end" key={index}>
                <Box
                  w="65%"
                  bgGradient={`linear(to-r, ${themeColor}.500, ${themeColor}.300)`}
                  color="white"
                  px={4}
                  py={2}
                  borderRadius="15px 0px 15px 15px"
                  boxShadow="md"
                >
                  <Text mt={2} fontSize="md" whiteSpace="pre-wrap">
                    {remark?.remark || "No remark"}
                  </Text>
                  <Flex justify="space-between" color="whiteAlpha.800">
                    <Text fontSize="sm" fontWeight="bold">
                      {/* Admin */}
                    </Text>
                    <Text fontSize="xs">
                      {timeAgo(remark?.createdAt || new Date())}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            ))}
          </Box>
        </DrawerBody>

        <Box
          position="sticky"
          bottom="0"
          left="0"
          right="0"
          bg="white"
          px={5}
          py={5}
          boxShadow="lg"
          borderTop="2px solid"
          borderColor="gray.200"
          bgGradient={`linear(to-r, ${themeColor}.600, ${themeColor}.400)`}
        >
          <Flex gap={4} align="center">
            <FormControl flex={1}>
              <Textarea
                size="sm"
                bg="gray.100"
                color={`${themeColor}.800`}
                fontSize="md"
                fontWeight="medium"
                value={inputValue.message}
                onChange={(e) =>
                  setInputValue((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                rows={1}
                minH="40px"
                maxH="120px"
                overflowY="auto"
                resize="none"
                placeholder="Write your remark..."
                _placeholder={{ color: "gray.500" }}
                borderRadius="md"
                boxShadow="sm"
                border={`1px solid ${themeColor}.500`}
                _focusVisible={{
                  borderColor: `${themeColor}.500`,
                  boxShadow: `0 0 0 2px ${themeColor}.300`,
                }}
              />
            </FormControl>

            <FormControl w="30%">
              <Input
                size="sm"
                color={`${themeColor}.800`}
                fontWeight="medium"
                fontSize="md"
                bg="gray.100"
                type="date"
                value={inputValue.date}
                onChange={(e) =>
                  setInputValue((prev) => ({ ...prev, date: e.target.value }))
                }
                borderRadius="md"
                boxShadow="sm"
                border="1px solid gray.300"
                _focus={{
                  borderColor: "purple.500",
                  boxShadow: "0 0 0 2px purple.200",
                }}
              />
            </FormControl>

            <Button
              h="44px"
              w="44px"
              p="8px"
              borderRadius="full"
              bgGradient={`linear(to-r, ${themeColor}.500, ${themeColor}.700)`}
              color="white"
              _hover={{
                bgGradient: `linear(to-r,  ${themeColor}.500, ${themeColor}.700))`,
              }}
              _focus={{ border: "2px solid white" }}
              isDisabled={!inputValue?.message}
              boxShadow="md"
              onClick={addFollowup}
              isLoading={addFeesFollowUpStatus === STATUS.FETCHING}
            >
              <IoMdSend fontSize={22} />
            </Button>
          </Flex>
        </Box>
      </DrawerContent>
    </Drawer>
  );
};
