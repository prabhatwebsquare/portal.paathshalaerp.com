import { PageHeader } from "@/common/PageHeader";
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
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { FeeReciept } from "../FessSetup/FeeReciept";
import { CombineTransportSetting } from "../FessSetup/CombineTrasportSetting";
import { GeneralSettings } from "../FessSetup/GeneralSettings";

export const CommonSetting = () => {
  const themeColor = getLocalStorageItem("themeColor") || "blue";
  return (
    <Box>
      <Box h={"80vh"} borderRadius={5} bg={"white"}>
        <Tabs isLazy variant="enclosed" isFitted>
          <TabList bg="gray.50">
          <Tab
              borderRight={"1px solid"}
              borderLeft={"1px solid"}
              borderColor="white"
              _selected={{ color: "white", bg: `${themeColor}.400` }}
            >
             Fees Settings
            </Tab>
     
     
            <Tab
              borderRight={"1px solid"}
              borderLeft={"1px solid"}
              borderColor="white"
              _selected={{ color: "white", bg: `${themeColor}.400` }}
            >
              Permission Letter Footer
            </Tab>
            <Tab
              borderRight={"1px solid"}
              borderLeft={"1px solid"}
              borderColor="white"
              _selected={{ color: "white", bg: `${themeColor}.400` }}
            >
              Admission Form Footer
            </Tab>
            <Tab
              borderRight={"1px solid"}
              borderLeft={"1px solid"}
              borderColor="white"
              _selected={{ color: "white", bg: `${themeColor}.400` }}
            >
              Trasport Setting
            </Tab>
          </TabList>

          <TabPanels>
          <TabPanel>
              <GeneralSettings />
             
            </TabPanel>
      
      
            <TabPanel> </TabPanel>
            <TabPanel> </TabPanel>
            <TabPanel>
              <CombineTransportSetting themeColor={themeColor} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};
