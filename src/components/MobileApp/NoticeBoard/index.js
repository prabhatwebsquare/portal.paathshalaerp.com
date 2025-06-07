import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import React from "react";
import { PageHeader } from "@/common/PageHeader";
import { StudentNoticeBoard } from "./StudentNoticeBoard";
import { TeacherNoticeBoard } from "./TeacherNoticeBoard";

export const NoticeBoard = ({ themeColor, sessionMasterId }) => {
    return (
        <Box>
            <PageHeader heading={"Notice Board"} />
            <Box bg={"white"} h={"90%"}>
                <Tabs isLazy variant='enclosed' isFitted    >
                    <TabList bg="gray.50">
                        <Tab borderRight={"1px solid"} borderColor="gray.100" _selected={{ color: 'white', bg: `${themeColor}.400` }}>
                            <Text> Student Notice Board</Text>
                        </Tab>
                        <Tab borderRight={"1px solid"} borderColor="gray.100" _selected={{ color: 'white', bg: `${themeColor}.400` }}>
                            <Text> Teacher Notice Board</Text>
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <StudentNoticeBoard themeColor={themeColor} sessionMasterId={sessionMasterId} />
                        </TabPanel>
                        <TabPanel>
                            <TeacherNoticeBoard themeColor={themeColor} sessionMasterId={sessionMasterId} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Box>
    )
}