import CustomInput from "@/common/CustomInput";
import CustomTextarea from "@/common/CustomTextarea";
import { LoadingContainer } from "@/common/LoadingContainer";
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
import { map } from "lodash";
import { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";

export const FollowUpsList = ({ closeDrawer, data, themeColor }) => {
  const [inputValue, setInputValue] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

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

  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      {/* <form onSubmit={collectFees}> */}
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Follow Ups List</DrawerHeader>
        <DrawerBody py={0}>
          <Box h={"100%"}>
            <Flex align={"end"}>
              <FormControl w={"30%"} ml={2}>
                <FormLabel fontSize={13}>Next Follow</FormLabel>
                <Input
                  size={"sm"}
                  color={"blue.800"}
                  fontWeight={"semibold"}
                  fontSize={14}
                  bg={"white"}
                  type="date"
                />
              </FormControl>
              <Button ml={3} type="submit" size={"sm"} colorScheme={themeColor}>
                Get
              </Button>
            </Flex>
            <Box
              my={2}
              pb={3}
              className="scrollBar"
              h={"85%"}
              border={"1px solid"}
              borderColor={`${themeColor}.300`}
              overflowY={"scroll"}
              ref={containerRef}
            >
              {/* <LoadingContainer status={getFollowUpStatus}> */}
              {map(new Array(6), (remark, index) => (
                <Flex mt={3} w="100%" justify={"flex-end"} key={index}>
                  <Box
                    w="60%"
                    bg={`${themeColor}.700`}
                    color="white"
                    px={3}
                    py={1}
                    borderRadius={"10px 0px 10px 10px"}
                  >
                    <Flex justify={"space-between"} color={"whiteAlpha.700"}>
                      <Text fontSize={11} fontWeight={"semibold"}>
                        {"Admin"}
                      </Text>
                      <Text fontSize={10} fontWeight={"semibold"}>
                        {timeAgo("2024-07-11T11:24:00.000Z")}
                      </Text>
                    </Flex>
                    <Text
                      mt={2}
                      fontSize={14}
                      whiteSpace="pre-wrap"
                      color={"white"}
                    >
                      {remark?.message ||
                        "sjdfniusf sjidncf skjdfn sjkfn sdjifv srkejrf  sdrjkf  renjkvg mrf grdfgm dfv df"}
                    </Text>
                  </Box>
                  <Box
                    bg={`${themeColor}.700`}
                    width="0"
                    height="0"
                    borderBottom="10px solid white" // Adjust size as needed
                    borderLeft="10px solid transparent" // Adjust size as needed
                  />
                </Flex>
              ))}
              {/* </LoadingContainer> */}
            </Box>
          </Box>
        </DrawerBody>
      </DrawerContent>
      {/* </form> */}
    </Drawer>
  );
};
