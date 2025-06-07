import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { STATUS } from "@/constant";
import { useStdFeesStore } from "@/store/stdFees";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { map, sumBy } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export const ClassStudentSummary = ({ themeColor, sessionMasterId }) => {
  const router = useRouter();
  const { getClassSummaryAction, getClassSummaryStatus, ClassSummary } =
    useStdFeesStore((s) => ({
      getClassSummaryAction: s.getClassSummaryAction,
      getClassSummaryStatus: s.getClassSummaryStatus,
      ClassSummary: s.ClassSummary,
    }));

  useEffect(() => {
    if ((getClassSummaryStatus || 1) === STATUS.NOT_STARTED) {
      getClassSummaryAction({ sessionMasterId });
    }
  }, [getClassSummaryAction, getClassSummaryStatus, sessionMasterId]);

  return (
    <Box p={5}>
      <Box className="scrollBar" h={"70vh"} overflowY={"scroll"}>
        <LoadingContainer status={getClassSummaryStatus}>
          {ClassSummary &&  ClassSummary?.length ? (
            <TableContainer mt={2}>
              <Table w="100%" size={"sm"} variant={"simple"}>
                <Thead>
                  <Tr bg="gray.100">
                    <Th>Class</Th>
                    <Th>Stream</Th>
                    <Th>Section</Th>

                    <Th isNumeric w="20%">
                      No. of Student
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {map(ClassSummary, (fee, index) => (
                    <Tr
                      key={index}
                      _hover={{ bg: "gray.100" }}
                      cursor={"pointer"}
                      onClick={() =>
                        router.push(
                          `/student/class-summery/${fee.classMasterId}_${fee.streamMasterId}_${fee.sectionMasterId}`
                        )
                      }
                    >
                      <Td>{fee.className}</Td>
                      <Td>{fee.streamName}</Td>
                      <Td>{fee?.sectionName}</Td>

                      <Td isNumeric>{fee.studentCount}</Td>
                    </Tr>
                  ))}
                  <Tr fontWeight={"bold"} bg="gray.100">
                    <Td>Total</Td>
                    <Td></Td>
                    <Td></Td>
                    <Td isNumeric>{sumBy(ClassSummary, "studentCount")}</Td>
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
