import React from "react";
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
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { MainLayout } from "@/layout/MainLayout";
import StudentAdjustTimetable from "@/components/TimeTable/StudentAdjustTimetable";
import TeacherAdjustTimetable from "@/components/TimeTable/TeacherAdjustTimetable";
import TimeTableAdjustment from "@/components/TimeTable/AdjustTimetable";
import TeacherReplacementTable from "@/components/TimeTable/TeacherReplacementTable";
const Index = () => {
  const themeColor = getLocalStorageItem("themeColor") || "blue";
  return (
    <MainLayout>
      <Box>
        <Box h={"80vh"} borderRadius={5} bg={"white"}>
          <Tabs isLazy variant="enclosed" isFitted>
            <TabList bg="gray.50">
              <Tab
                borderRight="1px solid"
                borderColor="gray.100"
                _selected={{ color: "white", bg: `${themeColor}.400` }}
                px={4} // Temporary padding to make tabs more compact
              >
                <Flex align="center" gap={2}>
                  {/* <SiGoogleclassroom /> */}
                  <Text fontSize="sm">Add Temporary Timetable</Text>{" "}
                  {/* Reduced font size */}
                </Flex>
              </Tab>

              <Tab
                borderRight="1px solid"
                borderColor="gray.100"
                _selected={{ color: "white", bg: `${themeColor}.400` }}
                px={4}
              >
                <Flex align="center" gap={2}>
                  {/* <LuStretchHorizontal /> */}
                  <Text fontSize="sm">Temporary Timetable List</Text>
                </Flex>
              </Tab>
              {/* <Tab
                borderRight="1px solid"
                borderColor="gray.100"
                _selected={{ color: "white", bg: `${themeColor}.400` }}
                px={4}
              >
                <Flex align="center" gap={2}>
                  <Text fontSize="sm">Teacher Temporary Timetable List</Text>
                </Flex>
              </Tab> */}
              {/* <Tab
                borderRight="1px solid"
                borderColor="gray.100"
                _selected={{ color: "white", bg: `${themeColor}.400` }}
                px={4}
              >
                <Flex align="center" gap={2}>
                  <Text fontSize="sm">Class Temporary Timetable List</Text>
                </Flex>
              </Tab> */}
            </TabList>

            <TabPanels>
              <TabPanel>
                {" "}
                <TimeTableAdjustment />{" "}
              </TabPanel>
              <TabPanel>
                <TeacherReplacementTable />
              </TabPanel>
              <TabPanel>
                <TeacherAdjustTimetable />
              </TabPanel>
              <TabPanel>
                <StudentAdjustTimetable />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </MainLayout>
  );
};
export default Index;
