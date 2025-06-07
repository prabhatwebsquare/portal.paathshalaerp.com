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
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { filter, map } from "lodash";
import { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";

export const AddFollowup = ({ data, themeColor, closeDrawer }) => {

  const [inputValue, setInputValue] = useState({});

  const {
    addFollowUpAction,
    addFollowUpStatus,
    followups,
    resetFollowupStatus,
    getFollowUpAction,
    getFollowUpStatus,
    resetFollowupList,
  } = useStudentStore((s) => ({
    addFollowUpAction: s.addFollowUpAction,
    addFollowUpStatus: s.addFollowUpStatus,
    followups: s.followups,
    resetFollowupStatus: s.resetFollowupStatus,
    getFollowUpAction: s.getFollowUpAction,
    getFollowUpStatus: s.getFollowUpStatus,
    resetFollowupList: s.resetFollowupList,
  }));

  useEffect(() => {
    if ((getFollowUpStatus || 1) === STATUS.NOT_STARTED) {
      getFollowUpAction(data.id);
    }
  }, [data, getFollowUpAction, getFollowUpStatus]);

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [followups]);

  function timeAgo(datetime) {
    const currentDate = new Date();
    const pastDate = new Date(datetime);
    const timeDifference = currentDate - pastDate;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return days === 1 ? "1 day ago" : days + " days ago";
    } else if (hours > 0) {
      return hours === 1 ? "1 hour ago" : hours + " hours ago";
    } else if (minutes > 0) {
      return minutes === 1 ? "1 minute ago" : minutes + " minutes ago";
    } else {
      return "Just Now";
    }
  }
  const addFollowup = () => {
    addFollowUpAction({
      admissionEnquiryId: data.id,
      date: dayjs().format("YYYY-MM-DD hh:mm A"),
      message: inputValue.message,
    });
  };

  useEffect(() => {
    if (addFollowUpStatus === STATUS.SUCCESS) {
      resetFollowupStatus();
      setInputValue({ message: "" });
    }
  }, [addFollowUpStatus, resetFollowupStatus]);

  useEffect(() => {
    return () => resetFollowupList();
  }, [resetFollowupList]);
  const stringToDarkColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash); // Hash function
    }
  
    // Generate a dark color by lowering the lightness value
    const color = `hsl(${Math.abs(hash) % 360}, 70%, 30%)`; // HSL color format with lower lightness (darker)
    return color;
  };
  return (
    <Drawer size={"md"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Add FollowUp</DrawerHeader>

        <DrawerBody>
          <Box>
            <Flex
              bg={"green.700"}
              color={"white"}
              px={4}
              py={2}
              borderTopRadius={10}
            >
              <Avatar size={"sm"} />
              <Text ml={2} fontSize={20} fontWeight={"semibold"}>
                {data.name}
              </Text>
            </Flex>
            <Box
              pb={3}
              className="scrollBar"
              h={"65vh"}
              border={"1px solid"}
              borderColor={"green.300"}
              overflowY={"scroll"}
              ref={containerRef}
            >
              <LoadingContainer status={getFollowUpStatus}>
                {map(followups, (remark, index) => {
                  const userColor = stringToDarkColor(remark.user?.name); // Get color based on user's name
                  return (
                    <Flex mt={3} w="100%" justify={"flex-end"} key={index}>
                      <Box
                        w="60%"
                        bg={userColor} // Apply generated background color
                        color="white"
                        px={3}
                        py={1}
                        borderRadius={"10px 0px 10px 10px"}
                      >
                        <Flex
                          justify={"space-between"}
                          color={"whiteAlpha.700"}
                        >
                          <Text fontSize={11} fontWeight={"semibold"}>
                            {remark.user?.name}
                          </Text>
                          <Text fontSize={10} fontWeight={"semibold"}>
                            {timeAgo(remark.date)}
                          </Text>
                        </Flex>
                        <Text
                          mt={2}
                          fontSize={14}
                          whiteSpace="pre-wrap"
                          color={"white"}
                        >
                          {remark.message}
                        </Text>
                      </Box>
                      <Box
                        bg={userColor} // Apply the same generated color for the triangle
                        width="0"
                        height="0"
                        borderBottom="10px solid white"
                        borderLeft="10px solid transparent"
                      />
                    </Flex>
                  );
                })}
              </LoadingContainer>
            </Box>
            <Flex mt={3} align={"center"}>
              <CustomTextarea
                type={"text"}
                name="message"
                label={"Write Text Here .."}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <Button
                ml={2}
                h={"44px"}
                p={"8px 8px 8px 12px"}
                borderRadius={"50%"}
                colorScheme={themeColor}
                isDisabled={inputValue.message ? false : true}
                isLoading={addFollowUpStatus === STATUS.FETCHING}
                onClick={addFollowup}
              >
                <IoMdSend fontSize={28} />
              </Button>
            </Flex>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
