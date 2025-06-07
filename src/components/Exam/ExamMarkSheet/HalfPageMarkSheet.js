import { SchoolHeader } from "@/common/SchoolHeader";
import { URL } from "@/services/apis";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import {
  Avatar,
  Box,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Divider,
  Badge,
  HStack,
  VStack,
  Image,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { map } from "lodash";
import React, { useEffect } from "react";

export const HalfPageMarkSheet = ({
  data,
  school,
  setAllPrintProps,
  themeColor,
}) => {
  useEffect(() => {
    return () => setAllPrintProps(null);
  }, [setAllPrintProps]);
  const schoolData = getLocalStorageItem("user");
  return map(data, (d, i) => {
    const student = d.StudentRecord;
    const groupedExamData = d.studentData.map((examGroup) => ({
      key: examGroup.examDataNow.map((exam) => exam.examName).join(", "),
      value: examGroup.examDataNow,
    }));
    const Subjects =
      groupedExamData[0]?.value[0]?.examMarkSystem.map(
        (markSystem) => markSystem.subjectName
      ) || [];
    const compulsarySubjects =
      groupedExamData[0]?.value[0]?.examMarkSystem
        .filter((data) => data.subjectType == "Compulsary")
        .map((markSystem) => markSystem.subjectName) || [];
    const optionalSubjects =
      groupedExamData[0]?.value[0]?.examMarkSystem
        .filter((data) => data.subjectType !== "Compulsary")
        .map((markSystem) => markSystem.subjectName) || [];
    const Totalsubjects =
      groupedExamData[0]?.value[0]?.examMarkSystem?.map(
        (markSystem) => markSystem.subjectName
      ) || [];
    const totalMarksCompulsary = compulsarySubjects.reduce((total, subject) => {
      const groupTotal = groupedExamData.reduce((groupTotal, examGroup) => {
        const groupMarks = examGroup.value.reduce((marksTotal, exam) => {
          const subjectMark = exam.examMarkSystem.find(
            (mark) => mark.subjectName === subject
          );
          return marksTotal + (subjectMark ? subjectMark.recTotal : 0);
        }, 0);
        return groupTotal + groupMarks;
      }, 0);
      return total + groupTotal;
    }, 0);
    const totalMarksOptional = optionalSubjects.reduce((total, subject) => {
      const groupTotal = groupedExamData.reduce((groupTotal, examGroup) => {
        const groupMarks = examGroup.value.reduce((marksTotal, exam) => {
          const subjectMark = exam.examMarkSystem.find(
            (mark) => mark.subjectName === subject
          );
          return marksTotal + (subjectMark ? subjectMark.recTotal : 0);
        }, 0);
        return groupTotal + groupMarks;
      }, 0);
      return total + groupTotal;
    }, 0);

    const totalMarks = Subjects.reduce((total, subject) => {
      const groupTotal = groupedExamData.reduce((groupTotal, examGroup) => {
        const groupMarks = examGroup.value.reduce((marksTotal, exam) => {
          const subjectMark = exam.examMarkSystem.find(
            (mark) => mark.subjectName === subject
          );
          return marksTotal + (subjectMark ? subjectMark.recTotal : 0);
        }, 0);
        return groupTotal + groupMarks;
      }, 0);
      return total + groupTotal;
    }, 0);
    const maxMarks = compulsarySubjects.reduce((total, subject) => {
      const groupMax = groupedExamData.reduce((groupMax, examGroup) => {
        const groupMaxMarks = examGroup.value.reduce((maxMarksTotal, exam) => {
          const subjectMax = exam.examMarkSystem.find(
            (mark) => mark.subjectName === subject
          );
          return maxMarksTotal + (subjectMax ? subjectMax.maxMarks : 0);
        }, 0);
        return groupMax + groupMaxMarks;
      }, 0);
      return total + groupMax;
    }, 0);

    const percentage = maxMarks ? (totalMarksCompulsary / maxMarks) * 100 : 0;

    const grade =
      percentage >= 90
        ? { letter: "A+", point: 10 }
        : percentage >= 75
        ? { letter: "A", point: 9 }
        : percentage >= 60
        ? { letter: "B", point: 8 }
        : percentage >= 50
        ? { letter: "C", point: 7 }
        : { letter: "D", point: 6 };

    return student ? (
      <Box
        // display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
        w="100%"
        p={6}
        bg="white"
        sx={{
          "@media print": {
            minH: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bg: "white !important",
          },
        }}
      >
        <Box
          p={6}
          bg="white"
          borderRadius={20}
          border="2px solid"
          borderColor={`${themeColor}.300`}
          className="print-container"
          sx={{
            "@media print": {
              bg: "white !important",
              borderColor: `${themeColor}.300 !important`,
              pageBreakInside: "avoid",
              breakInside: "avoid",
              width: "230mm",
              minHeight: "280mm",
              boxSizing: "border-box",
              margin: "auto",
            },
          }}
        >
          {/* Print-specific styles */}
          <style>
            {`
              @media print {
                .print-container {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                .header-bg {
                  background-color: ${themeColor}.100 !important;
                }
                .table-header {
                  background-color: ${themeColor}.500 !important;
                  color: white !important;
                }
                .total-cell {
                  background-color: ${themeColor}.100 !important;
                }
                .grand-total-cell {
                  background-color: ${themeColor}.200 !important;
                }
              }
            `}
          </style>

          <VStack spacing={5} h="100%" justify="space-between">
            {/* Header */}
            <Box w="100%" style={{ marginBottom: "15px" }}>
              <SchoolHeader title="Student Progress Report" />
              <Divider borderColor={`${themeColor}.400`} my={2} />
            </Box>

            {/* Student Info */}
            <Flex
              w="100%"
              bg={`${themeColor}.100`}
              p={4}
              borderRadius={12}
              boxShadow="md"
              justify="space-between"
              className="header-bg"
              sx={{
                "@media print": {
                  bg: `${themeColor}.100 !important`,
                  boxShadow: "none !important",
                },
              }}
            >
              <VStack align="start" spacing={2} fontSize={10}>
                <HStack>
                  <Text w="100px" fontWeight="bold">
                    SR No:
                  </Text>
                  <Badge
                    colorScheme={themeColor}
                    sx={{
                      "@media print": {
                        bg: `${themeColor}.500 !important`,
                        color: "white !important",
                        fontsize: "15px",
                      },
                    }}
                  >
                    {student.srNo}
                  </Badge>
                </HStack>
                <HStack>
                  <Text w="100px" fontWeight="bold">
                    Name:
                  </Text>
                  <Text fontWeight="bold">
                    {student.student_master?.studentName}
                  </Text>
                </HStack>
                <HStack>
                  <Text w="100px" fontWeight="bold">
                    Father Name:
                  </Text>
                  <Text fontWeight="bold">
                    {student.student_master?.fatherName}
                  </Text>
                </HStack>
                {/* <HStack>
                  <Text w="100px" fontWeight="bold">
                    Contact:
                  </Text>
                  <Text>{student.student_master?.fatherContact}</Text>
                </HStack> */}
                {/* <HStack>
                  <Text w="100px" fontWeight="bold">
                    Address:
                  </Text>
                  <Text maxW="200px">{student.student_master?.address}</Text>
                </HStack> */}
                <HStack>
                  <Text w="100px" fontWeight="bold">
                    Mother Name:
                  </Text>
                  <Text fontWeight="bold">
                    {student.student_master?.motherName}
                  </Text>
                </HStack>
              </VStack>
              <VStack align="start" spacing={2} fontSize={12}>
                <HStack>
                  <Text w="80px" fontWeight="bold">
                    Roll No:
                  </Text>
                  <Badge
                    colorScheme={themeColor}
                    sx={{
                      "@media print": {
                        bg: `${themeColor}.500 !important`,
                        color: "white !important",
                      },
                    }}
                  >
                    {student.rollNo}
                  </Badge>
                </HStack>
                <HStack>
                  <Text w="80px" fontWeight="bold">
                    Class:
                  </Text>
                  <Text fontWeight="bold">
                    {student.class_master?.name} ({student.section_master?.name}
                    )
                  </Text>
                </HStack>
                <HStack>
                  <Text w="80px" fontWeight="bold">
                    Stream:
                  </Text>
                  <Text>{student.stream_master?.name}</Text>
                </HStack>
                <HStack>
                  <Text w="80px" fontWeight="bold">
                    DOB:
                  </Text>
                  <Text>
                    {dayjs(student.student_master?.dob).format("DD-MMM-YYYY")}
                  </Text>
                </HStack>
              </VStack>
              <Image
                src={`${URL}${student.student_master?.photo}`}
                boxSize="80px"
                // objectFit="cover"
                border={`3px solid ${themeColor}.500`}
                borderRadius="md" // Use "md" or "none" for sharp edges
              />
            </Flex>

            <TableExamData
              themeColor={themeColor}
              groupedExamData={groupedExamData}
              Totalsubjects={Totalsubjects}
              compulsarySubjects={compulsarySubjects}
              optionalSubjects={optionalSubjects}
              totalMarksCompulsary={totalMarksCompulsary}
              totalMarksOptional={totalMarksOptional}
            />
            <Flex
              w="100%"
              p={3}
              bg={`${themeColor}.100`}
              borderRadius={10}
              justify="space-between"
              fontSize={10}
              sx={{
                "@media print": {
                  bg: `${themeColor}.100 !important`,
                },
              }}
            >
              <HStack>
                <Text fontWeight="bold">Total Marks:</Text>
                <Badge
                  colorScheme={themeColor}
                  px={3}
                  sx={{
                    "@media print": {
                      bg: `${themeColor}.500 !important`,
                      color: "white !important",
                    },
                  }}
                >
                  {totalMarksCompulsary}/{maxMarks}
                </Badge>
              </HStack>
              <HStack>
                <Text fontWeight="bold">Percentage:</Text>
                <Badge
                  colorScheme={percentage > 60 ? "green" : "red"}
                  px={3}
                  sx={{
                    "@media print": {
                      bg:
                        percentage > 60
                          ? "green.500 !important"
                          : "red.500 !important",
                      color: "white !important",
                    },
                  }}
                >
                  {percentage.toFixed(0)}%
                </Badge>
              </HStack>
              <HStack>
                <Text fontWeight="bold">Grade:</Text>
                <Badge
                  colorScheme={
                    grade.letter === "A+"
                      ? "green"
                      : grade.letter === "A"
                      ? "teal"
                      : grade.letter === "B"
                      ? "blue"
                      : grade.letter === "C"
                      ? "orange"
                      : "red"
                  }
                  px={3}
                  sx={{
                    "@media print": {
                      bg:
                        grade.letter === "A+"
                          ? "green.500 !important"
                          : grade.letter === "A"
                          ? "teal.500 !important"
                          : grade.letter === "B"
                          ? "blue.500 !important"
                          : grade.letter === "C"
                          ? "orange.500 !important"
                          : "red.500 !important",
                      color: "white !important",
                    },
                  }}
                >
                  {grade.letter}
                </Badge>
              </HStack>
            </Flex>
            {/* Divider */}
            <Divider my={4} borderColor={`${themeColor}.200`} />
            <Flex  mt={10}
              w="100%"
              p={3}
              borderRadius={10}
              justify="space-between"
              fontSize={12}>
              <SignatureBlock
                src={
                  schoolData?.schoolData?.examCoordinatorSignature
                    ? `${URL}${schoolData?.schoolData?.examCoordinatorSignature}`
                    : ""
                }
                themeColor={themeColor}
                label="Exam Coordinator Signature"
              />
              <SignatureBlock
                src={
                  schoolData?.schoolData?.principalSignature
                    ? `${URL}${schoolData?.schoolData?.principalSignature}`
                    : ""
                }
                themeColor={themeColor}
                label="Principal Signature"
              />
            </Flex>
            <Box
              textAlign="right"
              mt={30}
              display={"none"}
              sx={{
                "@media print": {
                  display: "inline-block", // Visible only when printing
                },
              }}
            >
              <Text
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="bold"
                color={`${themeColor}.600`}
                bg={`${themeColor}.100`}
                px={3}
                py={1}
                borderRadius="md"
                display="inline-block"
              >
                Result Date : 1 April 2025
              </Text>
            </Box>
          </VStack>
        </Box>
      </Box>
    ) : null;
  });
};

const TableExamData = ({
  themeColor,
  groupedExamData,
  Totalsubjects,
  compulsarySubjects,
  totalMarksCompulsary,
  totalMarksOptional,
  optionalSubjects,
}) => {
  return (
    <TableContainer
      w="100%"
      bg="white"
      borderRadius={12}
      p={1}
      boxShadow="md"
      sx={{
        "@media print": {
          bg: "white !important",
          boxShadow: "none !important",
        },
        "& th, & td": {
          fontSize: "10px !important",
          padding: "4px 6px !important",
          border: "1px solid #e2e8f0",
        },
      }}
    >
      <Table size="sm" variant="simple">
        <Thead>
          <Tr
            bgGradient={`linear(to-r, ${themeColor}.600, ${themeColor}.400)`}
            className="table-header"
            sx={{
              "@media print": {
                bg: `${themeColor}.600 !important`,
                color: "white !important",
              },
            }}
          >
            <Th color="white" borderLeftRadius="md" border="none">
              Subject
            </Th>
            {map(groupedExamData, (examData, i) => (
              <>
                {examData.value.map((exam, index) => (
                  <Th
                    key={`${examData.key}-${index}`}
                    textAlign="center"
                    color="white"
                    border="none"
                  >
                    {exam.examName}
                  </Th>
                ))}
                <Th
                  key={`total-${i}`}
                  textAlign="center"
                  color="white"
                  bg={`${themeColor}.700`}
                  className="table-header"
                  border="none"
                >
                  Total
                </Th>
              </>
            ))}
            <Th
              color="white"
              borderRightRadius="md"
              bgGradient={`linear(to-r, ${themeColor}.700, ${themeColor}.500)`}
              className="table-header"
              border="none"
            >
              Grand Total
            </Th>
          </Tr>
          <Tr
            bgGradient={`linear(to-r, ${themeColor}.500, ${themeColor}.300)`}
            className="table-header"
            sx={{
              "@media print": {
                bg: `${themeColor}.500 !important`,
                color: "white !important",
              },
            }}
          >
            <Th rowSpan={2} color="white" borderLeftRadius="md" border="none">
              Marks
            </Th>
            {map(groupedExamData, (examData, i) => (
              <>
                {examData.value.map((exam, index) => (
                  <Th
                    key={`${examData.key}-${index}`}
                    textAlign="center"
                    color="white"
                    border="none"
                  >
                    {(exam.totalMarks / Totalsubjects.length).toFixed(0)}
                  </Th>
                ))}
                <Th
                  key={`total-${i}`}
                  textAlign="center"
                  color="white"
                  bg={`${themeColor}.600`}
                  className="table-header"
                  border="none"
                >
                  {(
                    examData.value.reduce((groupMaxTotal, exam) => {
                      return (
                        groupMaxTotal +
                        exam.examMarkSystem.reduce(
                          (subjectTotal, mark) =>
                            subjectTotal + (mark.maxMarks || 0),
                          0
                        )
                      );
                    }, 0) / Totalsubjects.length
                  ).toFixed(0)}
                </Th>
              </>
            ))}
            <Th
              rowSpan={2}
              color="white"
              textAlign="center"
              borderRightRadius="md"
              bgGradient={`linear(to-r, ${themeColor}.700, ${themeColor}.500)`}
              className="table-header"
              border="none"
            >
              {(
                groupedExamData.reduce((groupMaxTotal, examGroup) => {
                  return (
                    groupMaxTotal +
                    examGroup.value.reduce((maxMarksTotal, exam) => {
                      return (
                        maxMarksTotal +
                        exam.examMarkSystem.reduce(
                          (subjectTotal, mark) =>
                            subjectTotal + (mark.maxMarks || 0),
                          0
                        )
                      );
                    }, 0)
                  );
                }, 0) / Totalsubjects.length
              ).toFixed(0)}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {map(compulsarySubjects, (sub) => {
            return (
              <Tr key={sub} _hover={{ bg: `${themeColor}.50` }}>
                <Td fontWeight="bold" bg="white">
                  {sub}
                </Td>
                {map(groupedExamData, (examData, i) => (
                  <>
                    {examData.value.map((exam, index) => {
                      const examMark = exam.examMarkSystem.find(
                        (mark) => mark.subjectName === sub
                      );
                      const marks = examMark ? examMark.recTotal : "N/A";
                      const markPercentage = examMark
                        ? (examMark.recTotal / examMark.maxMarks) * 100
                        : 0;
                      return (
                        <Td
                          key={`${examData.key}-${index}`}
                          textAlign="center"
                          fontWeight="bold"
                          bg={
                            markPercentage > 80
                              ? "green.50"
                              : markPercentage > 60
                              ? "blue.50"
                              : markPercentage > 40
                              ? "orange.50"
                              : "red.50"
                          }
                          color={
                            markPercentage > 80
                              ? "green.800"
                              : markPercentage > 60
                              ? "blue.800"
                              : markPercentage > 40
                              ? "orange.800"
                              : "red.800"
                          }
                          sx={{
                            "@media print": {
                              bg:
                                markPercentage > 80
                                  ? "green.50 !important"
                                  : markPercentage > 60
                                  ? "blue.50 !important"
                                  : markPercentage > 40
                                  ? "orange.50 !important"
                                  : "red.50 !important",
                              color:
                                markPercentage > 80
                                  ? "green.800 !important"
                                  : markPercentage > 60
                                  ? "blue.800 !important"
                                  : markPercentage > 40
                                  ? "orange.800 !important"
                                  : "red.800 !important",
                            },
                          }}
                        >
                          {marks}
                        </Td>
                      );
                    })}
                    <Td
                      key={`total-${i}`}
                      textAlign="center"
                      fontWeight="bold"
                      bg={`${themeColor}.100`}
                      className="total-cell"
                    >
                      {examData.value.reduce((groupTotal, exam) => {
                        const subjectMark = exam.examMarkSystem.find(
                          (mark) => mark.subjectName === sub
                        );
                        return (
                          groupTotal + (subjectMark ? subjectMark.recTotal : 0)
                        );
                      }, 0)}
                    </Td>
                  </>
                ))}
                <Td
                  textAlign="center"
                  fontWeight="bold"
                  bg={`${themeColor}.200`}
                  className="grand-total-cell"
                >
                  {groupedExamData.reduce((groupTotal, examGroup) => {
                    const subjectMark = examGroup.value.reduce(
                      (marksTotal, exam) => {
                        const markSystem = exam.examMarkSystem.find(
                          (mark) => mark.subjectName === sub
                        );
                        return (
                          marksTotal + (markSystem ? markSystem.recTotal : 0)
                        );
                      },
                      0
                    );
                    return groupTotal + subjectMark;
                  }, 0)}
                </Td>
              </Tr>
            );
          })}
          <Tr bg={`${themeColor}.50`}>
            <Td fontWeight="bold" bg={`${themeColor}.100`}>
              Total
            </Td>
            {map(groupedExamData, (examData, i) => (
              <>
                {examData.value.map((exam, index) => {
                  const examTotal = exam.examMarkSystem
                    .filter((data) => data.subjectType == "Compulsary")
                    .reduce((total, mark) => {
                      return total + (mark.recTotal || 0);
                    }, 0);
                  return (
                    <Td
                      key={`${examData.key}-${index}-grand`}
                      textAlign="center"
                      fontWeight="bold"
                      bg={`${themeColor}.100`}
                      className="total-cell"
                    >
                      {examTotal}
                    </Td>
                  );
                })}
                <Td
                  key={`group-total-${i}`}
                  textAlign="center"
                  fontWeight="bold"
                  bg={`${themeColor}.200`}
                  className="total-cell"
                >
                  {examData.value.reduce((groupTotal, exam) => {
                    return (
                      groupTotal +
                      exam.examMarkSystem
                        .filter((data) => data.subjectType == "Compulsary")
                        .reduce(
                          (subjectTotal, mark) =>
                            subjectTotal + (mark.recTotal || 0),
                          0
                        )
                    );
                  }, 0)}
                </Td>
              </>
            ))}
            <Td
              textAlign="center"
              fontWeight="bold"
              bg={`${themeColor}.300`}
              className="grand-total-cell"
            >
              {totalMarksCompulsary}
            </Td>
          </Tr>
        </Tbody>
        <Tbody>
          {map(optionalSubjects, (sub) => {
            return (
              <Tr key={sub} _hover={{ bg: `${themeColor}.50` }}>
                <Td fontWeight="bold" bg="white">
                  {sub}
                </Td>
                {map(groupedExamData, (examData, i) => (
                  <>
                    {examData.value.map((exam, index) => {
                      const examMark = exam.examMarkSystem.find(
                        (mark) => mark.subjectName === sub
                      );
                      const marks = examMark ? examMark.recTotal : "N/A";
                      const markPercentage = examMark
                        ? (examMark.recTotal / examMark.maxMarks) * 100
                        : 0;
                      return (
                        <Td
                          key={`${examData.key}-${index}`}
                          textAlign="center"
                          fontWeight="bold"
                          bg={
                            markPercentage > 80
                              ? "green.50"
                              : markPercentage > 60
                              ? "blue.50"
                              : markPercentage > 40
                              ? "orange.50"
                              : "red.50"
                          }
                          color={
                            markPercentage > 80
                              ? "green.800"
                              : markPercentage > 60
                              ? "blue.800"
                              : markPercentage > 40
                              ? "orange.800"
                              : "red.800"
                          }
                          sx={{
                            "@media print": {
                              bg:
                                markPercentage > 80
                                  ? "green.50 !important"
                                  : markPercentage > 60
                                  ? "blue.50 !important"
                                  : markPercentage > 40
                                  ? "orange.50 !important"
                                  : "red.50 !important",
                              color:
                                markPercentage > 80
                                  ? "green.800 !important"
                                  : markPercentage > 60
                                  ? "blue.800 !important"
                                  : markPercentage > 40
                                  ? "orange.800 !important"
                                  : "red.800 !important",
                            },
                          }}
                        >
                          {marks}
                        </Td>
                      );
                    })}
                    <Td
                      key={`total-${i}`}
                      textAlign="center"
                      fontWeight="bold"
                      bg={`${themeColor}.100`}
                      className="total-cell"
                    >
                      {examData.value.reduce((groupTotal, exam) => {
                        const subjectMark = exam.examMarkSystem.find(
                          (mark) => mark.subjectName === sub
                        );
                        return (
                          groupTotal + (subjectMark ? subjectMark.recTotal : 0)
                        );
                      }, 0)}
                    </Td>
                  </>
                ))}
                <Td
                  textAlign="center"
                  fontWeight="bold"
                  bg={`${themeColor}.200`}
                  className="grand-total-cell"
                >
                  {groupedExamData.reduce((groupTotal, examGroup) => {
                    const subjectMark = examGroup.value.reduce(
                      (marksTotal, exam) => {
                        const markSystem = exam.examMarkSystem.find(
                          (mark) => mark.subjectName === sub
                        );
                        return (
                          marksTotal + (markSystem ? markSystem.recTotal : 0)
                        );
                      },
                      0
                    );
                    return groupTotal + subjectMark;
                  }, 0)}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
const SignatureBlock = ({ src, label , themeColor }) => (
  <Box textAlign="center" fontSize="10px">
    {src && <Image src={src} alt={label} height="35px" />}
    {/* <Text mt={1} borderTop="1px solid gray" pt={0.5}> */}
    <Text fontWeight="bold" color={`${themeColor}.600`} mb={2}>
      {label}
    </Text>
  </Box>
);