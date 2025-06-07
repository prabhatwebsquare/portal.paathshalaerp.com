import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import React from "react";
import { PageHeader } from "@/common/PageHeader";
import { Holidays } from "./Holidays";
import { Events } from "./Events";

export const Calender = ({ themeColor, sessionMasterId }) => {
    return (
        <Box>
            {/* <PageHeader heading={"Calender"} /> */}
            <Box bg={"white"} h={"90%"}>
                <Tabs isLazy variant='enclosed' isFitted    >
                    <TabList bg="gray.50">
                        {/* <Tab borderRight={"1px solid"} borderColor="gray.100" _selected={{ color: 'white', bg: `${themeColor}.400` }}> */}
                            {/* <Text>Holidays</Text> */}
                        {/* </Tab> */}
                        {/* <Tab borderRight={"1px solid"} borderColor="gray.100" _selected={{ color: 'white', bg: `${themeColor}.400` }}>
                            <Text>Events</Text>
                        </Tab> */}
                    </TabList>
                    <TabPanels>
                        {/* <TabPanel> */}
                            <Holidays themeColor={themeColor} sessionMasterId={sessionMasterId} />
                        {/* </TabPanel> */}
                        {/* <TabPanel>
                            <Events themeColor={themeColor} sessionMasterId={sessionMasterId} />
                        </TabPanel> */}
                    </TabPanels>
                </Tabs>

            </Box>
        </Box>
    )
}