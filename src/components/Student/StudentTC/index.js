import { LoadingContainer } from "@/common/LoadingContainer";
import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { URL } from "@/services/apis";
import { useClassSetupStore } from "@/store/classSetup";
import { useStudentStore } from "@/store/studentStore";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { groupBy, map, uniqBy } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { GrCertificate } from "react-icons/gr";
import { PiCertificateBold } from "react-icons/pi";
import { TbFileCertificate } from "react-icons/tb";
import { CreateTC } from "./CreateTC";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { NoData } from "@/common/NoData";
import { CustomSelect } from "@/common/CustomSelect";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { IoEyeOutline } from "react-icons/io5";
import { ViewAgeWise } from "../AgeWiseStudent/ViewAgeWise";
import { TcFormatTheme } from "@/components/fees/TcFormatTheme";
import { LuSheet } from "react-icons/lu";

export const StudentTC = ({ sessionMasterId, themeColor }) => {
  const [inputValue, setInputValue] = useState({});
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const school = useMemo(() => getLocalStorageItem("user"), []);

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };
  const { getSectionAction, getSectionStatus, allSections } =
    useClassSetupStore((s) => ({
      getSectionAction: s.getSectionAction,
      getSectionStatus: s.getSectionStatus,
      allSections: s.allSections,
    }));

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  const {
    tcStudentAction,
    tcStudentStatus,
    filterStudents,
    resetTcStudentStatus,
  } = useStudentStore((s) => ({
    tcStudentAction: s.tcStudentAction,
    tcStudentStatus: s.tcStudentStatus,
    filterStudents: s.filterStudents,
    resetTcStudentStatus: s.resetTcStudentStatus,
  }));

  useEffect(() => {
    return () => resetTcStudentStatus();
  }, [resetTcStudentStatus]);

  useEffect(() => {
    tcStudentAction({
      sessionMasterId,
      status: 3,
      // isRTE: 0,
    });
    return () => {};
  }, []);

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
    getSectionAction,
    getSectionStatus,
  ]);

  const [toggleView, setToggleView] = useState(null);
  const [showTcFormatModal, setShowTcFormatModal] = useState(null);


  return (
    <Box h="100%">
      <PageHeader
        heading={"TC Report"}
        extra={
          <>
          <Flex gap={2}>
            {HasPermission(PERMISSIONS.STUDENT_TC_ADD) && (
              <Button
                size={"sm"}
                colorScheme={themeColor}
                leftIcon={<AddIcon />}
                onClick={() => setToggleDrawer([])}
              >
                Create TC
              </Button>
            )}
            <Button
              leftIcon={<LuSheet />}
              colorScheme={themeColor}
              size="sm"
              onClick={() => setShowTcFormatModal(true)}
            >
              TC Format Layout
            </Button>
          </Flex>
          </>
        
        }
      />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <LoadingContainer status={tcStudentStatus}>
            {filterStudents?.length ? (
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
                    {filterStudents.map((item, index) => (
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
     
          <TcFormatTheme
            themeColor={themeColor}
            Data={showTcFormatModal}
            closeModal={() => setShowTcFormatModal(false)}
          />
          {toggleView && (
            <ViewAgeWise
              data={toggleView}
              closeDrawer={() => setToggleView(null)}
              pageName={"tc"}
            />
          )}
          {toggleDrawer && (
            <CreateTC
              data={toggleDrawer}
              sessionMasterId={sessionMasterId}
              themeColor={themeColor}
              closeDrawer={() => setToggleDrawer(null)}
            />
          )}        
        </Box>
      </Box>
    </Box>
  );
};
