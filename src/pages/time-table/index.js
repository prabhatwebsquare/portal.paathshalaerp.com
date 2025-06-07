"use Client";
import { PageHeader } from "@/common/PageHeader";
import { MainLayout } from "@/layout/MainLayout";
import { Box, Flex } from "@chakra-ui/react";
import React from "react";

function Index() {
  return (
    <MainLayout>
      <Box>
        <PageHeader heading={"Time Table"} />
        <Box p={5} bg={"white"} h={"75vh"}>
          <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
            <Flex justify={"space-between"}></Flex>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}

export default Index;
