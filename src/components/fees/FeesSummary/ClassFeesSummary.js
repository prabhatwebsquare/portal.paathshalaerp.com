import { DownloadExcel } from "@/common/DownloadExcel";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { STATUS } from "@/constant";
import { useStdFeesStore } from "@/store/stdFees";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { map, sumBy } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { RiFileExcel2Fill } from "react-icons/ri";

export const ClassWiseReport = ({ themeColor, sessionMasterId }) => {
  const router = useRouter();
  const { getFeesSummaryAction, getFeesSummaryStatus, feesSummary } =
    useStdFeesStore((s) => ({
      getFeesSummaryAction: s.getFeesSummaryAction,
      getFeesSummaryStatus: s.getFeesSummaryStatus,
      feesSummary: s.feesSummary,
    }));

  useEffect(() => {
    if ((getFeesSummaryStatus || 1) === STATUS.NOT_STARTED) {
      getFeesSummaryAction({ feesMode: 1, sessionMasterId });
    }
  }, [getFeesSummaryAction, getFeesSummaryStatus, sessionMasterId]);
  


  return (
    <Box p={5}>
  
      <Box className="scrollBar" h={"70vh"} overflowY={"scroll"}>
        <LoadingContainer status={getFeesSummaryStatus}>
          {feesSummary?.length ? (
            <TableContainer mt={2}>
              <Table w="100%" size={"sm"} variant={"simple"}>
                <Thead>
                  <Tr bg="gray.100">
                    <Th>Class</Th>
                    <Th>Stream</Th>
                    <Th isNumeric w="20%">
                      No. of Student
                    </Th>
                    <Th isNumeric>Fees</Th>
                    <Th isNumeric>Deposite</Th>
                    <Th isNumeric>Discount</Th>
                    <Th isNumeric>Balance</Th>
                    <Th isNumeric>Late Fees</Th>
                    <Th isNumeric>Collected Late Fees</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {map(feesSummary, (fee, index) => (
                    <Tr
                      key={index}
                      _hover={{ bg: "gray.100" }}
                      cursor={"pointer"}
                      onClick={() =>
                        router.push(
                          `/fees/fees-summery/${fee.classMasterId}_${fee.streamMasterId}`
                        )
                      }
                    >
                      <Td>{fee.className}</Td>
                      <Td>{fee.streamName}</Td>
                      <Td isNumeric>{fee.studentCount}</Td>
                      <Td isNumeric>
                        <Flex justify={"flex-end"} align="center">
                          <MdCurrencyRupee />
                          {fee.classFees || 0}
                        </Flex>
                      </Td>
                      <Td isNumeric>
                        <Flex justify={"flex-end"} align="center">
                          <MdCurrencyRupee />
                          {fee.totalFeesReceived || 0}
                        </Flex>
                      </Td>
                      <Td isNumeric>
                        <Flex justify={"flex-end"} align="center">
                          <MdCurrencyRupee />
                          {fee.totalDiscount || 0}
                        </Flex>
                      </Td>
                      <Td isNumeric>
                        <Flex justify={"flex-end"} align="center">
                          <MdCurrencyRupee />
                          {(fee.classFees || 0) -
                            ((fee.totalFeesReceived || 0) +
                              (fee.totalDiscount || 0))}
                        </Flex>
                      </Td>
                      <Td isNumeric>
                        <Flex justify={"flex-end"} align="center">
                          <MdCurrencyRupee />
                          {fee.totalLateFees || 0}
                        </Flex>
                      </Td>
                      <Td isNumeric>
                        <Flex justify={"flex-end"} align="center">
                          <MdCurrencyRupee />
                          {fee.totalCollectLateFees || 0}
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                  <Tr fontWeight={"bold"} bg="gray.100">
                    <Td>Total</Td>
                    <Td></Td>
                    <Td isNumeric>{sumBy(feesSummary, "studentCount")}</Td>
                    <Td isNumeric>
                      <Flex justify={"flex-end"} align="center">
                        <MdCurrencyRupee />
                        {sumBy(feesSummary, "classFees")}
                      </Flex>
                    </Td>
                    <Td isNumeric>
                      <Flex justify={"flex-end"} align="center">
                        <MdCurrencyRupee />
                        {sumBy(feesSummary, "totalFeesReceived")}
                      </Flex>
                    </Td>
                    <Td isNumeric>
                      <Flex justify={"flex-end"} align="center">
                        <MdCurrencyRupee />
                        {sumBy(feesSummary, "totalDiscount")}
                      </Flex>
                    </Td>
                    <Td isNumeric>
                      <Flex justify={"flex-end"} align="center">
                        <MdCurrencyRupee />
                        {sumBy(feesSummary, "classFees") -
                          (sumBy(feesSummary, "totalFeesReceived") +
                            sumBy(feesSummary, "totalDiscount"))}
                      </Flex>
                    </Td>
                    <Td isNumeric>
                      <Flex justify={"flex-end"} align="center">
                        <MdCurrencyRupee />
                        {sumBy(feesSummary, "totalLateFees")}
                      </Flex>
                    </Td>
                    <Td isNumeric>
                      <Flex justify={"flex-end"} align="center">
                        <MdCurrencyRupee />
                        {sumBy(feesSummary, "totalCollectLateFees")}
                      </Flex>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <NoData title={"No Class Fees Found"} />
          )}
        </LoadingContainer>
      </Box>
    </Box>
  );
};
