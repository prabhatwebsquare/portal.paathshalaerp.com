import CustomInput from "@/common/CustomInput";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { map } from "lodash";
import { useEffect, useState } from "react";
import { BsPersonFillCheck } from "react-icons/bs";
import { MarkMonthlyAttendance } from "./MarkMonthlyAttendance";
import { STATUS } from "@/constant";
import { useStaffStore } from "@/store/StaffStore";
import { NoData } from "@/common/NoData";
import { LoadingContainer } from "@/common/LoadingContainer";

export const MonthlyAttendance = ({ sessionMasterId, themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [inputValue, setInputValue] = useState([]);
  const [studentList, setStudentList] = useState(false);

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  const {
    getMonthlyAttendanceAction,
    monthlyAttendance,
    getMonthlyAttendanceStatus,
  } = useStaffStore((s) => ({
    getMonthlyAttendanceStatus: s.getMonthlyAttendanceStatus,
    monthlyAttendance: s.monthlyAttendance,
    getMonthlyAttendanceAction: s.getMonthlyAttendanceAction,
  }));

  useEffect(() => {
    if ((getMonthlyAttendanceStatus || 1) === STATUS.NOT_STARTED) {
      getMonthlyAttendanceAction({ sessionMasterId, ...inputValue });
    }
  }, [getMonthlyAttendanceAction, getMonthlyAttendanceStatus]);

  const getStudent = (e) => {
    e.preventDefault();
    getMonthlyAttendanceAction({ sessionMasterId, ...inputValue });
  };
  const reloadData = () => {
    getMonthlyAttendanceAction({ sessionMasterId, ...inputValue });
  };
  return (
    <Box>
      <form onSubmit={getStudent}>
        <Flex gap={3}>
          <CustomInput
            size={"sm"}
            w={"20%"}
            type={"month"}
            name="date"
            label={"Select Month"}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
          <Button size={"sm"} colorScheme={"green"} type="submit">
            Get
          </Button>
        </Flex>
      </form>
      {monthlyAttendance?.length ? (
        <LoadingContainer status={getMonthlyAttendanceStatus}>
          <Table mt={5}>
            <Thead>
              <Tr>
                <Th>Emp Id</Th>
                <Th>Staff Name</Th>
                <Th>Contact</Th>
                <Th>Designation</Th>
                <Th>Department</Th>
                <Th>Gender</Th>
                <Th>Total Days</Th>
                <Th>Total Working Day</Th>
                <Th>Present</Th>
                <Th>Absent</Th>
                <Th>Half Day</Th>
                <Th>Holiday</Th>
                <Th>Paid Leave</Th>
                <Th>Attendance</Th>
              </Tr>
            </Thead>
            <Tbody>
              {map(monthlyAttendance, (staff) => (
                <Tr key={staff.id}>
                  <Td>{staff?.employeeCode || staff?.id}</Td>
                  <Td fontWeight="semibold">
                    <Flex align="center">
                      <Avatar size="xs" src={`${URL}${staff.photo}`} />
                      <Text ml={2}>{staff?.name}</Text>
                    </Flex>
                  </Td>
            
                  <Td>{staff?.mobileNo}</Td>
                  <Td>{staff?.designation}</Td>
                  <Td>{staff?.department}</Td>
                  <Td>{staff?.gender}</Td>
                  <Td>{staff.alldays}</Td>
                  <Td>{staff.alldays - (staff.sundays + staff.holiday)}</Td>
                  <Td>{staff.present}</Td>
                  <Td>{staff.absent}</Td>
                  <Td>{staff.halfday}</Td>
                  <Td>{staff.holiday}</Td>
                  <Td>{staff.leave}</Td>
                  <Td>
                    <Tooltip placement="top" label="Mark Attendance">
                      <IconButton
                        size="xs"
                        variant="ghost"
                        color="blue.500"
                        icon={<BsPersonFillCheck fontSize={20} />}
                        onClick={() => setToggleDrawer(staff)}
                      />
                    </Tooltip>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </LoadingContainer>
      ) : (
        <NoData title="No Staff Found" />
      )}

      {toggleDrawer && (
        <MarkMonthlyAttendance
          data={toggleDrawer}
          getStudent={reloadData}
          inputValue={inputValue}
          closeDrawer={() => setToggleDrawer(null)}
          sessionMasterId={sessionMasterId}
        />
      )}
    </Box>
  );
};
