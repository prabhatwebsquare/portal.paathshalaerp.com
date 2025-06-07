import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { PageHeader } from "@/common/PageHeader";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { map } from "lodash";
import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { ViewAgeWise } from "./ViewAgeWise";
import { useStudentStore } from "@/store/studentStore";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";

export const AgeWiseStudent = ({ sessionMasterId, themeColor }) => {
  const [inputValue, setInputValue] = useState({
    date: dayjs().format("YYYY-MM-DD"),
  });
  const [toggleView, setToggleView] = useState(null);

  const { getAgeWiseAction, getAgeWiseStatus, ageWise } = useStudentStore(
    (s) => ({
      getAgeWiseAction: s.getAgeWiseAction,
      getAgeWiseStatus: s.getAgeWiseStatus,
      ageWise: s.ageWise,
    })
  );

  const handleGetAgeWise = (e) => {
    e.preventDefault();
    getAgeWiseAction({
      sessionMasterId,
      date: inputValue.date,
      ageFrom: inputValue.ageFrom,
      ageTo: inputValue.ageTo,
    });
  };


  return (
    <Box h={"100%"}>
      <PageHeader heading={"Age Wise Student"} />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <form onSubmit={handleGetAgeWise}>
            <Flex w={"100%"} justify={"space-between"} my={4} align={"center"}>
              <Flex gap={3}>
                <CustomSelect
                  size={"sm"}
                  name={"ageFrom"}
                  label={"Age From"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(new Array(100), (a, i) => ({
                    name: i + 1,
                    value: i + 1,
                  }))}
                />
                <CustomSelect
                  size={"sm"}
                  name={"ageTo"}
                  label={"Age To"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(new Array(100), (a, i) => ({
                    name: i + 1,
                    value: i + 1,
                  }))}
                />
                <CustomInput
                  size={"sm"}
                  type={"date"}
                  name="date"
                  label={"Date"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <Button
                  ml={2}
                  type="submit"
                  size={"sm"}
                  colorScheme={themeColor}
                >
                  Get
                </Button>
              </Flex>
            </Flex>
          </form>
          <LoadingContainer status={getAgeWiseStatus}>
            {ageWise?.length ? (
              <TableContainer>
                <Table w="100%" size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>#</Th>
                      <Th>Class</Th>
                      <Th>Stream</Th>
                      <Th>Section</Th>
                      <Th>Total Students</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {ageWise.map((item, index) => (
                      <Tr
                        key={index}
                        _hover={{ bg: "gray.50" }}
                        cursor="pointer"
                      >
                        <Td>{index + 1}</Td>
                        <Td>{item.class}</Td>
                        <Td>{item.stream}</Td>
                        <Td>{item.section}</Td>
                        <Td>{item.TotalStudents}</Td>
                        <Td>
                          <Tooltip placement="top" label="View List">
                            <IconButton
                              size="sm"
                              variant="ghost"
                              icon={<IoEyeOutline fontSize={17} />}
                              onClick={() => setToggleView(item)}
                              colorScheme={themeColor}
                            />
                          </Tooltip>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Student Found"} />
            )}
          </LoadingContainer>
          {toggleView && (
            <ViewAgeWise
              pageName={"ageWise"}
              data={toggleView}
              closeDrawer={() => setToggleView(null)}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
