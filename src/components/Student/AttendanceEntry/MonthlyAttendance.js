import CustomMultipleDatePicker from "@/common/CustomCalender";
import CustomInput from "@/common/CustomInput";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { groupBy, map, uniqBy } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BsPersonFillCheck } from "react-icons/bs";
import { MarkMonthlyAttendance } from "./MarkMonthlyAttendance";
import { useClassSetupStore } from "@/store/classSetup";
import { STATUS } from "@/constant";
import { useStudentStore } from "@/store/studentStore";
import { NoData } from "@/common/NoData";
import { CustomSelect } from "@/common/CustomSelect";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";

export const MonthlyAttendance = ({ sessionMasterId, themeColor }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [inputValue, setInputValue] = useState([]);
  const [studentList, setStudentList] = useState(false);

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  const { getSectionAction, getSectionStatus, allSections } =
    useClassSetupStore((s) => ({
      getSectionAction: s.getSectionAction,
      getSectionStatus: s.getSectionStatus,
      allSections: s.allSections,
    }));

  const {
    getMonthlyAttendanceAction,
    getMonthlyAttendanceStatus,
    monthlyAttendance,
  } = useStudentStore((s) => ({
    getMonthlyAttendanceAction: s.getMonthlyAttendanceAction,
    getMonthlyAttendanceStatus: s.getMonthlyAttendanceStatus,
    monthlyAttendance: s.monthlyAttendance,
  }));

  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
    if ((getSectionStatus || 1) === STATUS.NOT_STARTED) {
      getSectionAction();
    }
  }, [
    getClassSubjectAction,
    getClassSubjectStatus,
    getSectionStatus,
    getSectionAction,
  ]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

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
            onKeyDown={(e) => e.preventDefault()}
          />
          <CustomSelect
            size={"sm"}
            w={"20%"}
            name={"classMasterId"}
            label={"Select Class"}
            inputValue={inputValue}
            setInputValue={setInputValue}
            data={map(classes, (d, key) => ({
              value: key,
              name: d?.[0]?.class_master?.name,
            }))}
          />
          <CustomSelect
            size={"sm"}
            w={"20%"}
            name={"streamMasterId"}
            label={"Select Stream"}
            inputValue={inputValue}
            setInputValue={setInputValue}
            data={map(
              uniqBy(classes?.[inputValue?.classMasterId], "streamMasterId"),
              (d, index) => ({
                value: d.stream_master?.id,
                name: d.stream_master.name,
              })
            )}
          />
          <CustomSelect
            size={"sm"}
            w={"20%"}
            name={"sectionMasterId"}
            label={"Select Section"}
            inputValue={inputValue}
            setInputValue={setInputValue}
            data={map(allSections, (d) => ({ value: d.id, name: d.name }))}
          />
          <Button size={"sm"} colorScheme={"green"} type="submit">
            Get
          </Button>
        </Flex>
      </form>
      {monthlyAttendance?.length ? (
        <Box
          p={4}
          bg="white"
          borderRadius="lg"
          boxShadow="md"
          borderWidth="1px"
          borderColor="gray.300"
          mt={5}
        >
          <Table>
            <Thead>
              <Tr>
                <Th textAlign="center">Roll No</Th>
                <Th textAlign="center">Student Name</Th>
                <Th textAlign="center">Father Name</Th>
                <Th textAlign="center">Total Days</Th>
                <Th textAlign="center">Present</Th>
                <Th textAlign="center">Absent</Th>
                <Th textAlign="center">Leave</Th>
                <Th textAlign="center">Attendance</Th>
              </Tr>
            </Thead>
            <Tbody>
              {map(monthlyAttendance, (atten, index) => (
                <Tr key={index}>
                  <Td textAlign="center">{atten.rollNo}</Td>
                  <Td textAlign="center">{atten.student_master.studentName}</Td>
                  <Td textAlign="center">{atten.student_master.fatherName}</Td>
                  <Td textAlign="center">{atten.alldays}</Td>
                  <Td textAlign="center">{atten.present}</Td>
                  <Td textAlign="center">{atten.absent}</Td>
                  <Td textAlign="center">{atten.leave}</Td>
                  <Td textAlign="center">
                    <BsPersonFillCheck
                      fontSize={20}
                      onClick={() => setToggleDrawer(atten)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <NoData title={"No Student Found"} />
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
