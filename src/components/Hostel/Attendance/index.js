import { PageHeader } from "@/common/PageHeader"
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { DailyAttendance } from "./DailyAttendance"
import { MonthlyAttendance } from "./MonthlyAttendance"
import { BiometricAttendance } from "./BiometricAttendance"

export const HostelAttendance = ({ sessionMasterId, themeColor }) => {
    return (
        <Box h="100%">
            <PageHeader heading={"Hostel Attendance"} />
            <Box bg={"white"} h={"90%"}>
                <Tabs size={"md"} variant='enclosed'>
                    <TabList bg="gray.200">
                        <Tab borderRight={"1px solid"} borderLeft={"1px solid"} borderColor="white" _selected={{ color: 'white', bg: `${themeColor}.400` }}>Daily Attendance </Tab>
                        <Tab borderRight={"1px solid"} borderLeft={"1px solid"} borderColor="white" _selected={{ color: 'white', bg: `${themeColor}.400` }}>Monthly Attendance</Tab>
                        <Tab borderRight={"1px solid"} borderLeft={"1px solid"} borderColor="white" _selected={{ color: 'white', bg: `${themeColor}.400` }}>Biometric Attendance</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel className="scrollBar" maxH={"68vh"} overflowY={"scroll"}>
                            <DailyAttendance sessionMasterId={sessionMasterId} themeColor={themeColor} />
                        </TabPanel>
                        <TabPanel className="scrollBar" maxH={"68vh"} overflowY={"scroll"}>
                            <MonthlyAttendance sessionMasterId={sessionMasterId} themeColor={themeColor} />
                        </TabPanel>
                        <TabPanel className="scrollBar" maxH={"68vh"} overflowY={"scroll"}>
                            <BiometricAttendance sessionMasterId={sessionMasterId} themeColor={themeColor} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Box>
    )
}