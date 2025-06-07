import { Box, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import React from "react";
import { SiGoogleclassroom } from "react-icons/si";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { StudentAttendanceReport } from "./StudentAttendanceReport";
import { AttendanceRegister } from "./AttendanceRegister";
import { AllMonthAttendance } from "./AllMonthAttendance";

export const AttendanceReport = ({ sessionMasterId, themeColor }) => {
    return (
        <Box>
            {/* <PageHeader heading={"Class Setup"} /> */}
            <Box h={"80vh"} borderRadius={5} bg={"white"}>
                <Tabs isLazy variant='enclosed' isFitted >
                    <TabList bg="gray.50">
                        <Tab borderRight={"1px solid"} borderColor="gray.100" _selected={{ color: 'white', bg: `${themeColor}.400` }}>
                            <Flex align={"center"} gap={2}><SiGoogleclassroom /><Text> Student Attendance</Text></Flex>
                        </Tab>
                        <Tab borderRight={"1px solid"} borderColor="gray.100" _selected={{ color: 'white', bg: `${themeColor}.400` }}>
                            <Flex align={"center"} gap={2}><SiGoogleclassroom /><Text>Attendance Register</Text></Flex>
                        </Tab>
                        <Tab borderRight={"1px solid"} borderColor="gray.100" _selected={{ color: 'white', bg: `${themeColor}.400` }}>
                            <Flex align={"center"} gap={2}><SiGoogleclassroom /><Text>Student Wise All Month</Text></Flex>
                        </Tab>
                        {/* {HasPermission(PERMISSIONS.STREAM) &&
                            <Tab borderRight={"1px solid"} borderColor="gray.100" _selected={{ color: 'white', bg: `${themeColor}.400` }}>
                                <Flex align={"center"} gap={2}><LuStretchHorizontal /><Text> Stream</Text></Flex>
                            </Tab>
                        } */}
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <StudentAttendanceReport sessionMasterId={sessionMasterId} themeColor={themeColor} />
                        </TabPanel>
                        <TabPanel>
                            <AttendanceRegister sessionMasterId={sessionMasterId} themeColor={themeColor} />
                        </TabPanel>
                        <TabPanel>
                            <AllMonthAttendance sessionMasterId={sessionMasterId} themeColor={themeColor} />
                        </TabPanel>
                        {/* {HasPermission(PERMISSIONS.STREAM) &&
                            <TabPanel>
                                <Stream themeColor={themeColor} />
                            </TabPanel>
                        } */}
                    </TabPanels>
                </Tabs>
            </Box>
        </Box>
    )
}