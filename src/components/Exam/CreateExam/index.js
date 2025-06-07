import { DeleteButton } from "@/common/DeleteButton";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useExamStore } from "@/store/Exam";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Tab, TabList, TabPanel, TabPanels, Table, TableContainer, Tabs, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map, orderBy } from "lodash";
import React, { useEffect, useState } from "react";
import { AddExam } from "./AddNewExam";
import { PageHeader } from "@/common/PageHeader";
import { Exam } from "./Exam";
import { Test } from "./Test";

export const CreateExam = ({ themeColor, sessionMasterId }) => {
    return (
        <Box>
            <PageHeader heading={"Create Exam"} />
            <Box bg={"white"} h={"90%"}>
                <Tabs isLazy variant='enclosed' isFitted    >
                    <TabList bg="gray.50">
                        <Tab borderRight={"1px solid"} borderColor="gray.100" _selected={{ color: 'white', bg: `${themeColor}.400` }}>
                            <Text> Exam</Text>
                        </Tab>
                        <Tab borderRight={"1px solid"} borderColor="gray.100" _selected={{ color: 'white', bg: `${themeColor}.400` }}>
                            <Text> Test</Text>
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Exam themeColor={themeColor} />
                        </TabPanel>
                        <TabPanel>
                            <Test themeColor={themeColor} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>

            </Box>
        </Box>
    )
}