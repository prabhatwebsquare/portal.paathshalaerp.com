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
import { useEffect, useState } from "react";
import { LoadingContainer } from "@/common/LoadingContainer";
import { ViewAgeWise } from "../AgeWiseStudent/ViewAgeWise";
import { IoEyeOutline } from "react-icons/io5";
import { NoData } from "@/common/NoData";
import { useStudentStore } from "@/store/studentStore";
import { AddRustication } from "./AddRustication";
import { RestrictStudentModal } from "@/common/RestrictStudentModal";

export const RusticationList = ({ sessionMasterId, themeColor }) => {
  const [toggleView, setToggleView] = useState(null);
  const [toggleRusticate, setToggleRusticate] = useState(null);
  const { getRTEStudentAction, getrteStudentStatus, rteStudent } =
    useStudentStore((s) => ({
      getRTEStudentAction: s.getRTEStudentAction,
      getrteStudentStatus: s.getrteStudentStatus,
      rteStudent: s.rteStudent,
    }));

  useEffect(() => {
    getRTEStudentAction({
      sessionMasterId,
      status: 2,
    });
    return () => {};
  }, []);
  const handleClozeDrawer = () => {
    getRTEStudentAction({
      sessionMasterId,
      status: 2,
    });
    setToggleView(null);
  };
  return (
    <Box h={"100%"}>
      <PageHeader heading={"Students Under Rustication"} />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={getrteStudentStatus}>
            {rteStudent?.length ? (
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
                    {rteStudent.map((item, index) => (
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
              pageName={"Rustication"}
              sessionMasterId={sessionMasterId}
              data={toggleView}
              closeDrawer={handleClozeDrawer}
            />
          )}
          {toggleRusticate && (
            <AddRustication
              data={toggleRusticate}
              closeDrawer={() => setToggleRusticate(null)}
              sessionMasterId={sessionMasterId}
              themeColor={themeColor}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
