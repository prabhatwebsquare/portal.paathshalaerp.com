"use client";

import { PageHeader } from "@/common/PageHeader";
import { Student } from "@/components/Student";
import { MainLayout } from "@/layout/MainLayout";
import { Box, Flex } from "@chakra-ui/react";

export default function Page() {
  return (
    <MainLayout>
      <Box>
        <PageHeader heading={"User"} />
        <Box p={5} bg={"white"} h={"75vh"}>
          <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
            <Flex justify={"space-between"}></Flex>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}
