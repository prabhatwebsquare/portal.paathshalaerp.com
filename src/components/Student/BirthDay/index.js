import CustomInput from "@/common/CustomInput";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { PageHeader } from "@/common/PageHeader";
import { SendSms } from "@/common/SendSms";
import { STATUS } from "@/constant";
import { useStudentStore } from "@/store/studentStore";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
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
import { map } from "lodash";
import { useEffect, useState } from "react";

export const BirthDay = ({ sessionMasterId, themeColor, page }) => {
  const [inputValue, setInputValue] = useState({
    date: dayjs().format("YYYY-MM-DD"),
  });

  const [selectedStudents, setSelectedStudents] = useState([]);

  const {
    getStudentBirthdayAction,
    getStudentBirthdayStatus,
    studentBirthday,
  } = useStudentStore((s) => ({
    getStudentBirthdayAction: s.getStudentBirthdayAction,
    getStudentBirthdayStatus: s.getStudentBirthdayStatus,
    studentBirthday: s.studentBirthday,
  }));

  useEffect(() => {
    if ((getStudentBirthdayStatus || 1) === STATUS.NOT_STARTED) {
      getStudentBirthdayAction({ sessionMasterId, dob: inputValue.date });
    }
  }, [
    getStudentBirthdayAction,
    getStudentBirthdayStatus,
    inputValue.date,
    sessionMasterId,
  ]);

  const getData = (e) => {
    e.preventDefault();
    getStudentBirthdayAction({ sessionMasterId, dob: inputValue.date });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allStudentIds = studentBirthday.map((std) => std.student_master.id);
      setSelectedStudents(allStudentIds);
    } else {
      setSelectedStudents([]);
    }
  };

  useEffect(() => {
    if (page == "dashboard") {
      getStudentBirthdayAction({ sessionMasterId, dob: inputValue.date });
    }

    return () => {};
  }, [page]);

  const handleSelectOne = (studentId) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  return (
    <Box h={page == "dashboard" ? "" : "100%"}>
      {page != "dashboard" && <PageHeader heading={"BirthDay List"} />}
      <Box p={5} bg={"white"} h={page == "dashboard" ? "" : "90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <Flex
            w={"100%"}
            justify={"space-between"}
            my={page == "dashboard" ? 2 : 4}
            align={"center"}
          >
            {page != "dashboard" && (
              <form
                onSubmit={getData}
                style={{ width: page == "dashboard" ? "100%" : "auto" }}
              >
                <Flex w={"100%"}>
                  <CustomInput
                    size={"sm"}
                    type={"date"}
                    name="date"
                    label={"Date"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    flex={1}
                  />
                  <Button
                    ml={2}
                    size={"sm"}
                    type="submit"
                    colorScheme={themeColor}
                  >
                    Get
                  </Button>
                </Flex>
              </form>
            )}
            {page != "dashboard" && selectedStudents.length > 0 && <SendSms themeColor={themeColor} />}
          </Flex>
          <LoadingContainer status={getStudentBirthdayStatus}>
            {studentBirthday?.length ? (
              <TableContainer>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      {page != "dashboard" && (
                        <Th>
                          <Checkbox
                            colorScheme="blue"
                            isChecked={
                              selectedStudents.length === studentBirthday.length
                            }
                            isIndeterminate={
                              selectedStudents.length > 0 &&
                              selectedStudents.length < studentBirthday.length
                            }
                            onChange={handleSelectAll}
                          />
                        </Th>
                      )}

                      {page != "dashboard" && <Th>Sr No.</Th>}
                      <Th>Name.</Th>
                      {page != "dashboard" && <Th>Father Name</Th>}
                      {page != "dashboard" && <Th>Contact</Th>}
                      {page != "dashboard" && <Th>DOB</Th>}
                      <Th>Class</Th>
                      {page != "dashboard" && <Th>Stream</Th>}
                      <Th>Section</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(studentBirthday, (std, index) => (
                      <Tr _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                        {page != "dashboard" && (
                          <Td>
                            <Checkbox
                              colorScheme="blue"
                            isChecked={selectedStudents.includes(
                              std.student_master.id
                            )}
                            onChange={() =>
                              handleSelectOne(std.student_master.id)
                            }
                          />
                          </Td>
                        )}
                        {page != "dashboard" && (
                          <Td>{std?.student_master?.srNo}</Td>
                        )}
                        <Td>{std.student_master.studentName}</Td>

                        {page != "dashboard" && (
                          <Td>{std.student_master.fatherName}</Td>
                        )}
                        {page != "dashboard" && (
                          <Td>{std.student_master.fatherContact}</Td>
                        )}
                        {page != "dashboard" && (
                          <Td>
                            {std.student_master.dob
                              ? dayjs(std.student_master.dob).format(
                                  "YYYY-MM-DD"
                                )
                              : null}
                          </Td>
                        )}
                        <Td>{std.class_master.name}</Td>
                        {page != "dashboard" && (
                          <Td>{std.stream_master.name}</Td>
                        )}
                        <Td>{std.section_master.name}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <>
                {page === "dashboard" ? (
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    py={4}
                    mt={10}
                  >
                    <Text
                      fontSize="lg"
                      fontWeight="medium"
                      color="gray.500"
                      textAlign="center"
                    >
                      No birthdays today
                    </Text>
                    <Text fontSize="sm" color="gray.400" mt={1}>
                      Check back tomorrow for more celebrations!
                    </Text>
                  </Flex>
                ) : (
                  <NoData title={"No BirthDay Found"} />
                )}
              </>
            )}
          </LoadingContainer>
        </Box>
      </Box>
    </Box>
  );
};
