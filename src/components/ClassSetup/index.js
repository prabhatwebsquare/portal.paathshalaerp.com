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
import { ClassSubject } from "./ClassSubject";
import { ClassList } from "./ClassList";
import { Stream } from "./Stream";
import { Section } from "./Section";
import { Subject } from "./Subject";
import { SiGoogleclassroom } from "react-icons/si";
import { LuStretchHorizontal } from "react-icons/lu";
import { BsSignIntersection } from "react-icons/bs";
import { MdOutlineClass, MdOutlineSubject } from "react-icons/md";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { IoDocumentSharp } from "react-icons/io5";
import { GrDocument } from "react-icons/gr";
import { CiBank } from "react-icons/ci";
import { ClassDocumentList } from "../AdditionalSetting/ClassDocumentList";
import { ShiftManagement } from "../AdditionalSetting/ShiftManagement";
import { House } from "../AdditionalSetting/House";

export const Master = () => {
  const themeColor = getLocalStorageItem("themeColor") || "blue";
  return (
    <Box>
      <Box h={"80vh"} borderRadius={5} bg={"white"}>
        <Tabs isLazy variant="enclosed" isFitted>
          <TabList bg="gray.50">
            {HasPermission(PERMISSIONS.CLASS) && (
              <Tab
                borderRight="1px solid"
                borderColor="gray.100"
                _selected={{ color: "white", bg: `${themeColor}.400` }}
                px={4} // Adjust padding to make tabs more compact
              >
                <Flex align="center" gap={2}>
                  <SiGoogleclassroom />
                  <Text fontSize="sm">Class</Text> {/* Reduced font size */}
                </Flex>
              </Tab>
            )}
            {HasPermission(PERMISSIONS.STREAM) && (
              <Tab
                borderRight="1px solid"
                borderColor="gray.100"
                _selected={{ color: "white", bg: `${themeColor}.400` }}
                px={4}
              >
                <Flex align="center" gap={2}>
                  <LuStretchHorizontal />
                  <Text fontSize="sm">Stream</Text>
                </Flex>
              </Tab>
            )}
            {HasPermission(PERMISSIONS.SECTION) && (
              <Tab
                borderRight="1px solid"
                borderColor="gray.100"
                _selected={{ color: "white", bg: `${themeColor}.400` }}
                px={4}
              >
                <Flex align="center" gap={2}>
                  <BsSignIntersection />
                  <Text fontSize="sm">Section</Text>
                </Flex>
              </Tab>
            )}
            {HasPermission(PERMISSIONS.SUBJECT) && (
              <Tab
                borderRight="1px solid"
                borderColor="gray.100"
                _selected={{ color: "white", bg: `${themeColor}.400` }}
                px={4}
              >
                <Flex align="center" gap={2}>
                  <MdOutlineSubject />
                  <Text fontSize="sm">Subject</Text>
                </Flex>
              </Tab>
            )}
            {HasPermission(PERMISSIONS.CLASS_SUBJECT) && (
              <Tab
                borderRight="1px solid"
                borderColor="gray.100"
                _selected={{ color: "white", bg: `${themeColor}.400` }}
                px={4}
              >
                <Flex align="center" gap={2}>
                  <MdOutlineClass />
                  <Text fontSize="sm">Class Subject</Text>
                </Flex>
              </Tab>
            )}
            {HasPermission(PERMISSIONS.SHIFT_MANAGEMENT) && (
              <Tab
                borderRight="1px solid"
                borderColor="gray.100"
                _selected={{ color: "white", bg: `${themeColor}.400` }}
                px={4}
              >
                <Flex align="center" gap={2}>
                  <CiBank />
                  <Text fontSize="sm">Shift Management</Text>
                </Flex>
              </Tab>
            )}
            {/* <Tab
              borderRight="1px solid"
              borderColor="gray.100"
              _selected={{ color: "white", bg: `${themeColor}.400` }}
              px={4}
            >
              <Flex align="center" gap={2}>
                <GrDocument />
                <Text fontSize="sm">Class Document</Text>
              </Flex>
            </Tab> */}
                       {HasPermission(PERMISSIONS.HOUSE) && (
              <Tab
                borderRight={"1px solid"}
                borderColor="gray.100"
                _selected={{ color: "white", bg: `${themeColor}.400` }}
              >
                <Flex align={"center"} gap={2}>
                  <LuStretchHorizontal />
                  <Text> House</Text>
                </Flex>
              </Tab>
            )}
          </TabList>

          <TabPanels>
            {HasPermission(PERMISSIONS.CLASS) && (
              <TabPanel>
                <ClassList themeColor={themeColor} />
              </TabPanel>
            )}
            {HasPermission(PERMISSIONS.STREAM) && (
              <TabPanel>
                <Stream themeColor={themeColor} />
              </TabPanel>
            )}
            {HasPermission(PERMISSIONS.SECTION) && (
              <TabPanel>
                <Section themeColor={themeColor} />
              </TabPanel>
            )}
            {HasPermission(PERMISSIONS.SUBJECT) && (
              <TabPanel>
                <Subject themeColor={themeColor} />
              </TabPanel>
            )}
            {HasPermission(PERMISSIONS.CLASS_SUBJECT) && (
              <TabPanel>
                <ClassSubject themeColor={themeColor} />
              </TabPanel>
            )}
            {HasPermission(PERMISSIONS.SHIFT_MANAGEMENT) && (
              <TabPanel>
                <ShiftManagement themeColor={themeColor} />
              </TabPanel>
            )}
                 {HasPermission(PERMISSIONS.HOUSE) && (
              <TabPanel>
                <House themeColor={themeColor} />
              </TabPanel>
            )}
            <TabPanel>
              <ClassDocumentList themeColor={themeColor} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};
