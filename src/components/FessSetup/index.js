import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import { FeesName } from "./FeesName";
import { AssignFees } from "./AssignFees";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { ProspectusFees } from "./ProspectusFees";
import { DiscountMaster } from "./DiscountMaster";
import { FeeReciept } from "./FeeReciept";

export const FeesSetup = ({ themeColor, sessionMasterId }) => {
  return (
    <Box>
      <Box h={"80vh"} borderRadius={5} bg={"white"}>
        <Tabs variant="enclosed" isFitted isLazy>
          <TabList bg="gray.200">
            {HasPermission(PERMISSIONS.FEES_NAME) && (
              <Tab
                borderRight={"1px solid"}
                borderLeft={"1px solid"}
                borderColor="white"
                _selected={{ color: "white", bg: `${themeColor}.400` }}
              >
                Fees Name
              </Tab>
            )}
            {/* <Tab borderRight={"1px solid"} borderLeft={"1px solid"} borderColor="white" _selected={{ color: 'white', bg: `${themeColor}.400` }}>Fees Group</Tab> */}
            {HasPermission(PERMISSIONS.ASSIGN_FEES) && (
              <Tab
                borderRight={"1px solid"}
                borderLeft={"1px solid"}
                borderColor="white"
                _selected={{ color: "white", bg: `${themeColor}.400` }}
              >
                Assign Fees
              </Tab>
            )}
            {HasPermission(PERMISSIONS.PROSPECTUS_FEES) && (
              <Tab
                borderRight={"1px solid"}
                borderLeft={"1px solid"}
                borderColor="white"
                _selected={{ color: "white", bg: `${themeColor}.400` }}
              >
                Prospectus and Form Fees
              </Tab>
            )}
            {HasPermission(PERMISSIONS.DISCOUNT_HEAD) && (
              <Tab
                borderRight={"1px solid"}
                borderLeft={"1px solid"}
                borderColor="white"
                _selected={{ color: "white", bg: `${themeColor}.400` }}
              >
                Discount Master
              </Tab>
            )}
          </TabList>
          <TabPanels>
            {HasPermission(PERMISSIONS.FEES_NAME) && (
              <TabPanel>
                <FeesName themeColor={themeColor} />
              </TabPanel>
            )}
            {/* <TabPanel>
                            <FeesGroup themeColor={themeColor} />
                        </TabPanel> */}
            {HasPermission(PERMISSIONS.ASSIGN_FEES) && (
              <TabPanel>
                <AssignFees
                  themeColor={themeColor}
                  sessionMasterId={sessionMasterId}
                />
              </TabPanel>
            )}
            {HasPermission(PERMISSIONS.PROSPECTUS_FEES) && (
              <TabPanel>
                <ProspectusFees
                  themeColor={themeColor}
                  sessionMasterId={sessionMasterId}
                />
              </TabPanel>
            )}
            {HasPermission(PERMISSIONS.DISCOUNT_HEAD) && (
              <TabPanel>
                <DiscountMaster
                  themeColor={themeColor}
                  sessionMasterId={sessionMasterId}
                />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};
