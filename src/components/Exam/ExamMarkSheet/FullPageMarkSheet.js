import { SchoolHeader } from "@/common/SchoolHeader";
import { URL } from "@/services/apis";
import { Avatar, Box, Flex, Image, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr, Grid, Divider, } from "@chakra-ui/react";
import dayjs from "dayjs";
import { map } from "lodash";
import { useEffect } from "react";

export const FullPageMarkSheet = ({ data, school, setPrintProps, themeColor }) => {

  useEffect(() => {
    return () => setPrintProps(null)
  }, [setPrintProps])

  return (
    map(data, (student, i) => (
      student ?
        <Box w={"595pt"} h={"842pt"} p={5} align={"center"}>
          <Box
            w={"100%"}
            h={"100%"}
            border={"1px solid"}
            borderColor={"gray.200"}
            borderRadius={10}
            style={{ pageBreakInside: "avoid", breakInside: "avoid", pageBreakAfter: "auto" }}
          >
            <Box h={"750pt"}>
              <SchoolHeader title={"MarkSheet Report"} />
              <Flex w={"100%"} p={2} bg={`${themeColor}.50`}>
                <Box w={"60%"} fontSize={13} fontWeight={"semibold"} align={"start"}>
                  <Flex w={"100%"}>
                    <Text w={"35%"}>SR No</Text>
                    <Text>: &nbsp;{student.student_master?.studentName}</Text>
                  </Flex>
                  <Flex w={"100%"}>
                    <Text w={"35%"}>Name</Text>
                    <Text>: &nbsp;{student.student_master?.studentName}</Text>
                  </Flex>
                  <Flex w={"100%"}>
                    <Text w={"35%"}>Father&apos;s Name</Text>
                    <Text>: &nbsp;{student.student_master?.fatherName}</Text>
                  </Flex>
                  <Flex w={"100%"}>
                    <Text w={"35%"}>Contact </Text>
                    <Text>: &nbsp;{student.student_master?.fatherContact}</Text>
                  </Flex>
                  <Flex w={"100%"}>
                    <Text w={"35%"}>Address </Text>
                    <Text w={"65%"}>: &nbsp;{student.student_master?.address}</Text>
                  </Flex>
                </Box>
                <Box w={"30%"} fontSize={13} fontWeight={"semibold"} align={"start"}>
                  <Flex w={"90%"}>
                    <Text w={"40%"}>Roll No</Text>
                    <Text>: &nbsp;{student.rollNo}</Text>
                  </Flex>
                  <Flex w={"90%"}>
                    <Text w={"40%"}>Class</Text>
                    <Text>: &nbsp;{student.class_master?.name}</Text>
                  </Flex>
                  <Flex w={"90%"}>
                    <Text w={"40%"}>Stream</Text>
                    <Text>: &nbsp;{student.stream_master?.name}</Text>
                  </Flex>
                  <Flex w={"90%"}>
                    <Text w={"40%"}>DOB</Text>
                    <Text>: &nbsp;{student.student_master?.dob ? dayjs(student.student_master?.dob).format("DD-MMM-YYYY") : ""}</Text>
                  </Flex>
                </Box>
                <Flex w={"10%"} align={"center"} justify={"center"}>
                  <Image h={"70px"} src={`${URL}${student.student_master?.photo}`} alt={"Profile"} />
                </Flex>
              </Flex>
              <Box w="100%" borderRadius="md">
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th rowSpan={2} border={"1px solid black"} >Subject</Th>
                      <Th colSpan={5} border={"1px solid black"} textAlign="center" >Term I (50)</Th>
                      <Th colSpan={4} border={"1px solid black"} textAlign="center">Term II (50)</Th>
                      <Th colSpan={2} border={"1px solid black"} textAlign="center">Overall</Th>
                    </Tr>
                    <Tr >
                      <Th border={"1px solid black"}>FA-1</Th>
                      <Th border={"1px solid black"}>SA-1</Th>
                      <Th border={"1px solid black"}>FA-2</Th>
                      <Th border={"1px solid black"}>FA-3</Th>
                      <Th border={"1px solid black"}>Total</Th>
                      <Th border={"1px solid black"}>FA-3</Th>
                      <Th border={"1px solid black"}>SA-2</Th>
                      <Th border={"1px solid black"}>AC+BW</Th>
                      <Th border={"1px solid black"}>Total</Th>
                      <Th border={"1px solid black"}>Grand Total</Th>
                      <Th border={"1px solid black"}>Grade</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>{student.subject || 'English'}</Td>
                      <Td>{student.marks || 'N/A'}</Td>
                      <Td>{student.marks || 'N/A'}</Td>
                      <Td>{student.marks || 'N/A'}</Td>
                      <Td>{student.grade || 'N/A'}</Td>
                      <Td>{student.grade || 'N/A'}</Td>
                      <Td>{student.grade || 'N/A'}</Td>
                      <Td>{student.grade || 'N/A'}</Td>
                      <Td>{student.grade || 'N/A'}</Td>
                      <Td>{student.grade || 'N/A'}</Td>
                      <Td>{student.grade || 'N/A'}</Td>
                      <Td>{student.grade || 'N/A'}</Td>
                    </Tr>
                    <Tr>
                      <Td border={"1px solid black"}>HINDI</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>50</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>50</Td>
                      <Td border={"1px solid black"}>100</Td>
                      <Td border={"1px solid black"}>C1</Td>
                    </Tr>
                    <Tr>
                      <Td border={"1px solid black"}>Social Science</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>50</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>50</Td>
                      <Td border={"1px solid black"}>100</Td>
                      <Td border={"1px solid black"}>C1</Td>
                    </Tr>
                    <Tr>
                      <Td border={"1px solid black"}>Science</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>50</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>50</Td>
                      <Td border={"1px solid black"}>100</Td>
                      <Td border={"1px solid black"}>C1</Td>
                    </Tr>
                    <Tr>
                      <Td border={"1px solid black"}>Math</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>50</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>10</Td>
                      <Td border={"1px solid black"}>50</Td>
                      <Td border={"1px solid black"}>100</Td>
                      <Td border={"1px solid black"}>C1</Td>
                    </Tr>
                  </Tbody>
                </Table>
                <Flex my={5} w={"95%"} border={"1px solid"} borderColor={"gray.300"} fontSize={12}>
                  <Flex py={1} flex={2} justify={"center"} fontWeight={"bold"}>OVER ALL MARKS</Flex>
                  <Flex py={1} flex={1} borderLeft={"1px solid"} borderColor={"gray.300"} justify={"center"} fontWeight={"semibold"}>400/500</Flex>
                  <Flex py={1} flex={2} borderLeft={"1px solid"} borderColor={"gray.300"} justify={"center"} fontWeight={"bold"}>PERCENTAGE</Flex>
                  <Flex py={1} flex={1} borderLeft={"1px solid"} borderColor={"gray.300"} justify={"center"} fontWeight={"semibold"}>80%</Flex>
                  <Flex py={1} flex={2} borderLeft={"1px solid"} borderColor={"gray.300"} justify={"center"} fontWeight={"bold"}>GRADE</Flex>
                  <Flex py={1} flex={1} borderLeft={"1px solid"} borderColor={"gray.300"} justify={"center"} fontWeight={"semibold"}>B</Flex>
                  <Flex py={1} flex={2} borderLeft={"1px solid"} borderColor={"gray.300"} justify={"center"} fontWeight={"bold"}>PERFORMANCE</Flex>
                  <Flex py={1} flex={1} borderLeft={"1px solid"} borderColor={"gray.300"} justify={"center"}>GOOD</Flex>
                </Flex>
                <Flex w={"100%"} justify={"space-between"}>
                  <Box w={"45%"} h={"fit-content"} border={"1px solid"} borderColor={"gray.300"} fontSize={12}>
                    <Flex py={1} flex={2} borderBottom={"1px solid"} borderColor={"gray.300"} justify={"center"} fontWeight={"bold"}>DISCIPLINE</Flex>
                    <Flex borderBottom={"1px solid"} borderColor={"gray.300"}>
                      <Flex pl={2} py={1} flex={2} fontWeight={"semibold"}>ELEMENT</Flex>
                      <Flex pl={2} py={1} flex={1} borderLeft={"1px solid"} borderColor={"gray.300"} fontWeight={"bold"}>GRADE</Flex>
                    </Flex>
                    <Flex borderBottom={"1px solid"} borderColor={"gray.300"}>
                      <Flex pl={2} py={1} flex={2} fontWeight={"semibold"}>REGULARITY & PUNCTUALITY</Flex>
                      <Flex pl={2} py={1} flex={1} borderLeft={"1px solid"} borderColor={"gray.300"} fontWeight={"bold"}>A</Flex>
                    </Flex>
                    <Flex>
                      <Flex pl={2} py={1} flex={2} fontWeight={"semibold"}>BEHAVIOUR & VALUES</Flex>
                      <Flex pl={2} py={1} flex={1} borderLeft={"1px solid"} borderColor={"gray.300"} fontWeight={"bold"}>A</Flex>
                    </Flex>
                  </Box>
                  <Box w={"45%"} h={"fit-content"} border={"1px solid"} borderColor={"gray.300"} fontSize={12}>
                    <Flex py={1} flex={2} borderBottom={"1px solid"} borderColor={"gray.300"} justify={"center"} fontWeight={"bold"}>CO-SCHOLASTIC AREAS</Flex>
                    <Flex borderBottom={"1px solid"} borderColor={"gray.300"}>
                      <Flex pl={2} py={1} flex={2} fontWeight={"semibold"}>ACTIVITY</Flex>
                      <Flex pl={2} py={1} flex={1} borderLeft={"1px solid"} borderColor={"gray.300"} fontWeight={"bold"}>GRADE</Flex>
                    </Flex>
                    <Flex>
                      <Flex pl={2} py={1} flex={2} fontWeight={"semibold"}>SOCIAL SKILLS</Flex>
                      <Flex pl={2} py={1} flex={1} borderLeft={"1px solid"} borderColor={"gray.300"} fontWeight={"bold"}>A+</Flex>
                    </Flex>
                  </Box>
                </Flex>
                {/* Attendance Table */}
                <Table variant="simple" size="sm" mt={4}>
                  <Tbody>
                    {/* Attendance */}
                    <Tr>
                      <Td border={"1px solid black"}>Attendance</Td>
                      <Td border={"1px solid black"}>TERM I</Td>
                      <Td border={"1px solid black"}>TERM II</Td>
                    </Tr>
                    <Tr>
                      <Td border={"1px solid black"}>Total Working Days</Td>
                      <Td border={"1px solid black"}>100</Td>
                      <Td border={"1px solid black"}>100</Td>
                    </Tr>
                    <Tr>
                      <Td border={"1px solid black"}>Total Attendance</Td>
                      <Td border={"1px solid black"}>83</Td>
                      <Td border={"1px solid black"}>90</Td>
                    </Tr>
                  </Tbody>
                </Table>

                <Box mt={5} w={"100%"} p={2} align={"start"} fontSize={12} border={"1px solid"} borderColor={"gray.300"}>
                  <Text>INSTRUCTIONS :</Text>
                  <Box>
                    <Text>1: Students are suppossed to keep this card neet and clean</Text>
                  </Box>
                  <Box>
                    <Text>2: In case of the card is lost duplacate card is issued with extra payment fee</Text>
                  </Box>
                  <Box>
                    <Text>3: For any complaint kindly meet personal at school</Text>
                  </Box>
                </Box>
                <Box >
                  <Table variant="simple" mt={"12pt"}>
                    <Thead>
                      <Tr>
                        <Th border={"1px solid black"}>Marking range (%)</Th>
                        <Td border={"1px solid black"}>91-100</Td>
                        <Td border={"1px solid black"}>81-90</Td>
                        <Td border={"1px solid black"}>71-80</Td>
                        <Td border={"1px solid black"}>61-70</Td>
                        <Td border={"1px solid black"}>51-60</Td>
                        <Td border={"1px solid black"}>41-50</Td>
                        <Td border={"1px solid black"}>32-40</Td>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td border={"1px solid black"}>Grade</Td>
                        <Td border={"1px solid black"}>A+</Td>
                        <Td border={"1px solid black"}>A</Td>
                        <Td border={"1px solid black"}>B+</Td>
                        <Td border={"1px solid black"}>B</Td>
                        <Td border={"1px solid black"}>C+</Td>
                        <Td border={"1px solid black"}>C</Td>
                        <Td border={"1px solid black"}>D</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>

              </Box>

            </Box>
            <Flex justify={"space-between"} px={5} pb={5} fontSize={16}>
              <Box align={"center"}>
                <Image w={"80pt"} h={"30pt"} src="/assets/sign.png" alt={""} />
                <Text fontWeight={"semibold"}>Class Teacher Sign</Text>
              </Box>
              <Box mt={"15pt"} align={"center"}>
                <Text>24-05-2021</Text>
                <Text fontWeight={"semibold"}>Issued Date</Text>
              </Box>
              <Box align={"center"}>
                <Image w={"80pt"} h={"30pt"} src="/assets/sign.png" alt={""} />
                <Text fontWeight={"semibold"}>Principal Sign</Text>
              </Box>
            </Flex>
          </Box>
        </Box>
        :
        null
    ))
  );
}
