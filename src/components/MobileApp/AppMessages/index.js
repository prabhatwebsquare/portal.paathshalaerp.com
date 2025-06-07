import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import React from "react";
import { PageHeader } from "@/common/PageHeader";
import { StudentAppMessage } from "./StudentAppMessage";
import { TeacherAppMessage } from "./TeacherAppMessage";

export const AppMessages = ({ themeColor, sessionMasterId }) => {
    return (
        <Box>
            <PageHeader heading={"App Messages"} />
            <Box bg={"white"} h={"90%"}>
                <Tabs isLazy variant='enclosed' isFitted    >
                    <TabList bg="gray.50">
                        <Tab borderRight={"1px solid"} borderColor="gray.100" _selected={{ color: 'white', bg: `${themeColor}.400` }}>
                            <Text> Student App Message</Text>
                        </Tab>
                        <Tab borderRight={"1px solid"} borderColor="gray.100" _selected={{ color: 'white', bg: `${themeColor}.400` }}>
                            <Text> Teacher App Message</Text>
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <StudentAppMessage themeColor={themeColor} sessionMasterId={sessionMasterId} />
                        </TabPanel>
                        <TabPanel>
                            <TeacherAppMessage themeColor={themeColor} sessionMasterId={sessionMasterId} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>

            </Box>
        </Box>
    )
}