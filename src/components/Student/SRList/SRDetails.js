import { LoadingContainer } from "@/common/LoadingContainer";
import { SchoolHeader } from "@/common/SchoolHeader";
import { STATUS } from "@/constant";
import { URL } from "@/services/apis";
import { useAdditionalSetupStore } from "@/store/additionalSetup";
import { useClassSetupStore } from "@/store/classSetup";
import { useStudentStore } from "@/store/studentStore";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { find, groupBy, map } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { SRPrint } from "./SRPrint";

export const SRDetails = ({ id, closeDrawer, themeColor }) => {
  const [srRows, setSrRows] = useState([{}]);

  const { getSessionAction, getSessionStatus, allSessions } =
    useAdditionalSetupStore((s) => ({
      getSessionAction: s.getSessionAction,
      getSessionStatus: s.getSessionStatus,
      allSessions: s.allSessions,
    }));

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  const {
    getStudentSRAction,
    getStudentSRStatus,
    studentSR,
    resetGetSRStatus,
  } = useStudentStore((s) => ({
    getStudentSRAction: s.getStudentSRAction,
    getStudentSRStatus: s.getStudentSRStatus,
    studentSR: s.studentSR,
    resetGetSRStatus: s.resetGetSRStatus,
  }));

  useEffect(() => {
    if ((getSessionStatus || 1) === STATUS.NOT_STARTED) {
      getSessionAction();
    }
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
  }, [
    getClassSubjectAction,
    getClassSubjectStatus,
    getSessionAction,
    getSessionStatus,
  ]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  useEffect(() => {
    if (id && (getStudentSRStatus || 1) === STATUS.NOT_STARTED) {
      getStudentSRAction(id);
    }
  }, [getStudentSRAction, getStudentSRStatus, id]);

  useEffect(() => {
    return () => resetGetSRStatus();
  }, [resetGetSRStatus]);

  useEffect(() => {
    if (studentSR?.data?.length) {
      setSrRows(
        map(studentSR?.data, (sr) => ({
          sessionMasterId: sr.sessionMasterId,
          classMasterId: sr.classMasterId,
          streamMasterId: sr.streamMasterId,
          admissionDate: dayjs(sr.admissionDate).format("DD-MM-YYYY"),
          resultDate: dayjs(sr.resultDate).format("DD-MM-YYYY"),
          workingDays: sr.workingDays,
          present: sr.present,
          student: sr.student,
          result: sr.result,
          conduct: sr.conduct,
        }))
      );
    }
  }, [studentSR]);

  const [printProps, setPrintProps] = useState(null);
  const printRef = useRef(null);

  const handlePrintClick = (props) => {
    setPrintProps(props);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => setPrintProps(null),
    onPrintError: () => setPrintProps(null),
  });

  useEffect(() => {
    if (printProps) {
      handlePrint();
    }
  }, [printProps, handlePrint]);

  return (
    <Drawer size={"xl"} isOpen={id} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <Flex w={"95%"} justify={"space-between"}>
            <Text>Scholar Report</Text>
            {/* <Button size={"sm"} colorScheme={themeColor} onClick={() => handlePrintClick(studentSR)}>Print</Button> */}
            <Button size={"sm"} colorScheme={themeColor} onClick={handlePrint}>
              Print
            </Button>
          </Flex>
        </DrawerHeader>
        <DrawerBody>
          <LoadingContainer status={getSessionStatus || getStudentSRStatus}>
            {studentSR ? (
              <Flex
                my={3}
                p={2}
                bg={`${themeColor}.50`}
                border={"1px solid"}
                borderColor={"gray.200"}
                borderRadius={10}
              >
                <Box w={"20%"}>
                  <Image
                    h={"70px"}
                    src={`${URL}${studentSR.studentMaster?.photo}`}
                    alt={"Profile"}
                  />
                </Box>
                <Box w={"40%"} fontSize={13} fontWeight={"semibold"}>
                  <Flex w={"70%"}>
                    <Text w={"50%"}>Name</Text>
                    <Text>: &nbsp;{studentSR.studentMaster?.studentName}</Text>
                  </Flex>
                  <Flex w={"70%"}>
                    <Text w={"50%"}>Father&apos;s Name</Text>
                    <Text>: &nbsp;{studentSR.studentMaster?.fatherName}</Text>
                  </Flex>
                  <Flex w={"70%"}>
                    <Text w={"50%"}>Contact </Text>
                    <Text>
                      : &nbsp;{studentSR.studentMaster?.fatherContact}
                    </Text>
                  </Flex>
                </Box>
                <Box w={"40%"} fontSize={13} fontWeight={"semibold"}>
                  <Flex w={"70%"}>
                    <Text w={"50%"}>SR No.</Text>
                    <Text>: &nbsp;{studentSR.studentMaster?.srNo}</Text>
                  </Flex>
                  <Flex w={"70%"}>
                    <Text w={"50%"}>Admission No</Text>
                    <Text>: &nbsp;{studentSR.studentMaster?.admissionNo}</Text>
                  </Flex>
                </Box>
              </Flex>
            ) : null}
            {studentSR ? (
              <TableContainer>
                <Table mt={3} w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th w={"40%"}>Session</Th>
                      <Th w={"40%"}>Class</Th>
                      <Th w={"40%"}>Strean</Th>
                      <Th w={"40%"}>Admission Date</Th>
                      <Th w={"40%"}>Result Date</Th>
                      <Th w={"40%"}>Working Days</Th>
                      <Th w={"40%"}>Presents</Th>
                      <Th w={"40%"}>Students</Th>
                      <Th w={"40%"}>Result</Th>
                      <Th w={"40%"}>Conduct</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(srRows, (sr, index) => {
                      const session = find(
                        allSessions,
                        (s) => s.id === sr.sessionMasterId
                      )?.name;
                      const className =
                        classes?.[sr.classMasterId]?.[0]?.class_master?.name;
                      const stream = find(
                        classes?.[sr.classMasterId],
                        (s) => s.streamMasterId === sr.streamMasterId
                      )?.stream_master?.name;
                      // const session = find(allSessions, s => s.id === sr.sessionMasterId)?.name
                      return (
                        <Tr key={index}>
                          <Td>{session}</Td>
                          <Td>{className}</Td>
                          <Td>{stream}</Td>
                          <Td>{sr.admissionDate}</Td>
                          <Td>{sr.resultDate}</Td>
                          <Td>{sr.workingDays}</Td>
                          <Td>{sr.present}</Td>
                          <Td>{sr.student}</Td>
                          <Td>{sr.result}</Td>
                          <Td>{sr.conduct}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : null}
          </LoadingContainer>
          {/* <Box display={"none"}>
                        {printProps &&
                            <Box ref={printRef}>
                                <SRPrint data={printProps} setPrintProps={setPrintProps} />
                            </Box>
                        }
                    </Box> */}
          <Box display={"none"}>
            <Box p={5} ref={printRef}>
              <LoadingContainer status={getSessionStatus || getStudentSRStatus}>
                <SchoolHeader title={"Scholar Register"} />
                {studentSR ? (
                  <Flex
                    my={3}
                    p={2}
                    bg={`${themeColor}.50`}
                    border={"1px solid"}
                    borderColor={"gray.200"}
                    borderRadius={10}
                  >
                    <Box w={"20%"}>
                      <Image
                        h={"70px"}
                        src={`${URL}${studentSR.studentMaster?.photo}`}
                        alt={"Profile"}
                      />
                    </Box>
                    <Box w={"40%"} fontSize={13} fontWeight={"semibold"}>
                      <Flex w={"70%"}>
                        <Text w={"50%"}>Name</Text>
                        <Text>
                          : &nbsp;{studentSR.studentMaster?.studentName}
                        </Text>
                      </Flex>
                      <Flex w={"70%"}>
                        <Text w={"50%"}>Father&apos;s Name</Text>
                        <Text>
                          : &nbsp;{studentSR.studentMaster?.fatherName}
                        </Text>
                      </Flex>
                      <Flex w={"70%"}>
                        <Text w={"50%"}>Contact </Text>
                        <Text>
                          : &nbsp;{studentSR.studentMaster?.fatherContact}
                        </Text>
                      </Flex>
                    </Box>
                    <Box w={"40%"} fontSize={13} fontWeight={"semibold"}>
                      <Flex w={"70%"}>
                        <Text w={"50%"}>SR No.</Text>
                        <Text>: &nbsp;{studentSR.studentMaster?.srNo}</Text>
                      </Flex>
                      <Flex w={"70%"}>
                        <Text w={"50%"}>Admission No</Text>
                        <Text>
                          : &nbsp;{studentSR.studentMaster?.admissionNo}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                ) : null}
                {studentSR ? (
                  <TableContainer>
                    <Table mt={3} w="100%" size={"sm"} variant={"simple"}>
                      <Thead>
                        <Tr bg="gray.100">
                          <Th w={"40%"}>Session</Th>
                          <Th w={"40%"}>Class</Th>
                          <Th w={"40%"}>Strean</Th>
                          <Th w={"40%"}>Admiss. Date</Th>
                          <Th w={"40%"}>Result Date</Th>
                          <Th w={"40%"}>Work Days</Th>
                          <Th w={"40%"}>Presents</Th>
                          <Th w={"40%"}>Students</Th>
                          <Th w={"40%"}>Result</Th>
                          <Th w={"40%"}>Conduct</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {map(srRows, (sr, index) => {
                          const session = find(
                            allSessions,
                            (s) => s.id === sr.sessionMasterId
                          )?.name;
                          const className =
                            classes?.[sr.classMasterId]?.[0]?.class_master
                              ?.name;
                          const stream = find(
                            classes?.[sr.classMasterId],
                            (s) => s.streamMasterId === sr.streamMasterId
                          )?.stream_master?.name;
                          // const session = find(allSessions, s => s.id === sr.sessionMasterId)?.name
                          return (
                            <Tr key={index}>
                              <Td>{session}</Td>
                              <Td>{className}</Td>
                              <Td>{stream}</Td>
                              <Td>{sr.admissionDate}</Td>
                              <Td>{sr.resultDate}</Td>
                              <Td>{sr.workingDays}</Td>
                              <Td>{sr.present}</Td>
                              <Td>{sr.student}</Td>
                              <Td>{sr.result}</Td>
                              <Td>{sr.conduct}</Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TableContainer>
                ) : null}
              </LoadingContainer>
            </Box>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
