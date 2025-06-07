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
import { SiGoogleclassroom } from "react-icons/si";
import { LuStretchHorizontal } from "react-icons/lu";
import { BsSignIntersection } from "react-icons/bs";
import { MdOutlineClass, MdOutlineSubject } from "react-icons/md";
import { SessionList } from "./SessionList";
import { House } from "./House";
import { BanksList } from "./BanksList";

import { ClassDocumentList } from "./ClassDocumentList";
import { CiBank } from "react-icons/ci";
import { ShiftManagement } from "./ShiftManagement";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { AppthemeColor } from "./AppthemeColor";
import { WebthemeColor } from "./WebthemeColor";

export const AdditionalSetting = ({ sessionMasterId, themeColor }) => {
  return (
    <Box>
      {/* <PageHeader heading={"Class Setup"} /> */}
      <Box h={"80vh"} borderRadius={5} bg={"white"}>
        <Tabs isLazy variant="enclosed" isFitted>
          <TabList bg="gray.50">
            {HasPermission(PERMISSIONS.SESSION) && (
              <Tab
                borderRight={"1px solid"}
                borderColor="gray.100"
                _selected={{ color: "white", bg: `${themeColor}.400` }}
              >
                <Flex align={"center"} gap={2}>
                  <SiGoogleclassroom />
                  <Text> Session</Text>
                </Flex>
              </Tab>
            )}
 
            {HasPermission(PERMISSIONS.ORGANISATION_BANK) && (
              <Tab
                borderRight={"1px solid"}
                borderColor="gray.100"
                _selected={{ color: "white", bg: `${themeColor}.400` }}
              >
                <Flex align={"center"} gap={2}>
                  <CiBank />
                  <Text> Organisation bank</Text>
                </Flex>
              </Tab>
            )}
            <Tab
              borderRight={"1px solid"}
              borderColor="gray.100"
              _selected={{ color: "white", bg: `${themeColor}.400` }}
            >
              <Flex align={"center"} gap={2}>
                <SiGoogleclassroom />
                <Text>App ThemeColor</Text>
              </Flex>
            </Tab>
            <Tab
              borderRight={"1px solid"}
              borderColor="gray.100"
              _selected={{ color: "white", bg: `${themeColor}.400` }}
            >
              <Flex align={"center"} gap={2}>
                <SiGoogleclassroom />
                <Text>ERP ThemeColor</Text>
              </Flex>
            </Tab>
          </TabList>
          <TabPanels>
            {HasPermission(PERMISSIONS.SESSION) && (
              <TabPanel>
                <SessionList themeColor={themeColor} />
              </TabPanel>
            )}
       
            {HasPermission(PERMISSIONS.ORGANISATION_BANK) && (
              <TabPanel>
                <BanksList
                  sessionMasterId={sessionMasterId}
                  themeColor={themeColor}
                />
              </TabPanel>
            )}
            <TabPanel>
              <AppthemeColor
                sessionMasterId={sessionMasterId}
                themeColor={themeColor}
              />
            </TabPanel>
            <TabPanel>
              <WebthemeColor
                sessionMasterId={sessionMasterId}
                themeColor={themeColor}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};
