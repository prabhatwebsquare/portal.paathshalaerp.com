import {
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
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { map } from "lodash";
import { useStudentStore } from "@/store/studentStore";
import { format } from "date-fns";
import { NoData } from "@/common/NoData";
import { StdFollowUps } from "./StdFollowUps";

export const FollowUpsList = ({
  closeDrawer,
  data,
  themeColor,
  sessionMasterId,
  openForm,
}) => {
  const [selectedDate, setSelectedDate] = useState(() =>
    format(new Date(), "yyyy-MM-dd")
  );
  const containerRef = useRef(null);
  const [toggleFollowUp, setToggleFollowUp] = useState(null);
  const {
    getFeesFollowUpDateWiseAction,
    getFeesFollowUpDateWiseStatus,
    feesFollowupsDateWise,
    resetFeesFollowupAllList,
  } = useStudentStore((s) => ({
    getFeesFollowUpDateWiseAction: s.getFeesFollowUpDateWiseAction,
    getFeesFollowUpDateWiseStatus: s.getFeesFollowUpDateWiseStatus,
    feesFollowupsDateWise: s.feesFollowupsDateWise,
    resetFeesFollowupAllList: s.resetFeesFollowupAllList,
  }));

  useEffect(() => {
    getFeesFollowUpDateWiseAction({
      date: selectedDate,
      sessionMasterId,
      page: 1,
      limit: 50,
    });

    return () => {
      resetFeesFollowupAllList()
    }
  }, [selectedDate]);

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
    return "Just Now";
  }


  return (
    <Drawer size="full" isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader bg={`${themeColor}.500`} color="white">
          Follow Ups List
        </DrawerHeader>
        <DrawerBody py={3}>
          <Flex align="end" mb={4} gap={3}>
            <FormControl w="30%">
              <FormLabel fontSize={13}>Next Follow Date</FormLabel>
              <Input
                type="date"
                size="sm"
                bg="white"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </FormControl>
            <Button
              size="sm"
              colorScheme={themeColor}
              onClick={() => {
                getFeesFollowUpDateWiseAction({
                  date: selectedDate,
                  sessionMasterId,
                  page: 1,
                  limit: 50,
                });
              }}
            >
              Get
            </Button>
          </Flex>

          <Box
            ref={containerRef}
            className="scrollBar"
            overflowY="auto"
            maxH="80vh"
            pr={3}
          >
            {feesFollowupsDateWise?.data?.data.length === 0 ? (
              <NoData
              title={"No Followups Found"}
              />
            ) : (
              map(feesFollowupsDateWise?.data?.data, (item, index) => {
                const student = item?.promotion?.student_master || {};
                return (
                  <Box
                    key={item.id}
                    p={4}
                    mb={4}
                    borderWidth={1}
                    borderRadius="md"
                    borderColor="gray.200"
                    bg="gray.50"
                  >
                    <Flex justify="space-between" align="start">
                      <Box w="90%">
                        <Text
                          fontWeight="bold"
                          fontSize="lg"
                          color={`${themeColor}.700`}
                        >
                          {student?.studentName || "N/A"}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          SR No: {student?.srNo || "N/A"} | Admission No:{" "}
                          {student?.admissionNo || "N/A"}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Father&apos;s Name: {student?.fatherName || "N/A"} |
                          Mother&apos;s Name: {student?.motherName || "N/A"}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Contact: {student?.studentContact || "N/A"} | Email:{" "}
                          {student?.studentEmail || "N/A"}
                        </Text>
                        <Text mt={2}>
                          <strong>Remark:</strong> {item.remark}
                        </Text>
                        <Text fontSize="sm" color="gray.500" mt={1}>
                          {/* Follow-up Date: {format(new Date(item.date), "dd MMM yyyy")} | Created {timeAgo(item.createdAt)} */}
                        </Text>
                      </Box>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme={themeColor}
                        onClick={() => setToggleFollowUp(item.promotion)}
                      >
                        Action
                      </Button>
                    </Flex>
                  </Box>
                );
              })
            )}
          </Box>

          {toggleFollowUp && (
              <StdFollowUps
              sessionMasterId={sessionMasterId}
                data={toggleFollowUp}
                closeDrawer={() => setToggleFollowUp(null)}
                themeColor={themeColor}
              />
            )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
