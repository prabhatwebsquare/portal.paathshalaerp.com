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

export const StdFollowUps = ({ closeDrawer, data, themeColor }) => {
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
        <DrawerHeader>Follow Ups</DrawerHeader>
        <DrawerBody py={0}>
          <Box>
            <Flex
              bg={`${themeColor}.700`}
              color={"white"}
              px={4}
              py={2}
              borderTopRadius={10}
            >
              <Avatar size={"sm"} />
              <Text ml={2} fontSize={20} fontWeight={"semibold"}>
                {data.student_master?.studentName}
              </Text>
            </Flex>
            <Box
              pb={3}
              className="scrollBar"
              h={"65vh"}
              borderLeft={"1px solid"}
              borderRight={"1px solid"}
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
            <Flex
              py={2}
              align={"center"}
              border={"1px solid"}
              borderColor={`${themeColor}.700`}
              bg={`${themeColor}.700`}
              color={"white"}
            >
              <Flex w={"90%"} px={5} p>
                {/* <CustomTextarea rows={2} type={"text"} name="message" label={"Write Text Here .."} inputValue={inputValue} setInputValue={setInputValue} /> */}
                <FormControl>
                  <FormLabel fontSize={13}>Remark</FormLabel>
                  <Textarea
                    size={"sm"}
                    bg={"white"}
                    color={"blue.800"}
                    fontWeight={"semibold"}
                    fontSize={14}
                    type="text"
                    rows={2}
                    placeholder="Write Text Here .."
                  />
                </FormControl>
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
                {/* <CustomInput w={"45%"} type={"date"} name="date" label={"Next FollowUp"} inputValue={inputValue} setInputValue={setInputValue} /> */}
              </Flex>
              <Button
                ml={2}
                h={"44px"}
                p={"8px 8px 8px 12px"}
                borderRadius={"50%"}
                colorScheme={"white"}
                isDisabled={inputValue?.message ? false : true}
                _focus={{ border: "2px solid white" }}
                // isLoading={addFollowUpStatus === STATUS.FETCHING}
                // onClick={addFollowup}
              >
                <IoMdSend fontSize={28} />
              </Button>
            </Flex>
          </Box>
        </DrawerBody>
      </DrawerContent>
      {/* </form> */}
    </Drawer>
  );
};
