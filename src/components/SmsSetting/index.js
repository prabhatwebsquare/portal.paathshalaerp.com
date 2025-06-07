import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { MdOutlineEmail, MdOutlineSms } from "react-icons/md";
import { SmsList } from "./SmsList";
import { EmailList } from "./EmailList";

export const SmsSetting = ({ themeColor }) => {
  return (
    <Box>
      {/* <PageHeader heading={"Class Setup"} /> */}
      <Box h={"80vh"} borderRadius={5} bg={"white"}>
        <Tabs isLazy variant="enclosed" isFitted>
          <TabList bg="gray.50">
            <Tab
              borderRight={"1px solid"}
              borderColor="gray.100"
              _selected={{ color: "white", bg: `${themeColor}.400` }}
            >
              <Flex align={"center"} gap={2}>
                <MdOutlineSms />
                <Text> SMS</Text>
              </Flex>
            </Tab>
            {/* <Tab borderRight={"1px solid"} borderColor="gray.100" _selected={{ color: 'white', bg: `${themeColor}.400` }}>
                            <Flex align={"center"} gap={2}><MdOutlineEmail /><Text> Email</Text></Flex>
                        </Tab> */}
          </TabList>
          <TabPanels>
            <TabPanel>
              <SmsList themeColor={themeColor} />
            </TabPanel>
            <TabPanel>
              <EmailList themeColor={themeColor} />
            </TabPanel>
            {/* <TabPanel>
                            <House themeColor={themeColor} />
                        </TabPanel>
                        <TabPanel>
                            <BanksList themeColor={themeColor} />
                        </TabPanel> */}
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};
