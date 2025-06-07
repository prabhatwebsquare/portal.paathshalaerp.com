import { ConfirmAlert } from "@/common/ConfirmationAlert";
import CustomInput from "@/common/CustomInput";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import { useStdFeesStore } from "@/store/stdFees";
import { useStudentStore } from "@/store/studentStore";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  IconButton,
  Image,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { find, findIndex, groupBy, map, uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
import CustomArrayInput from "@/common/CustomArrayInput";
import { UploadFile } from "@/common/UploadFile";
import { FILE_URL } from "@/services/apis";
import { CustomSelect } from "@/common/CustomSelect";

export const StudentPicture = ({ themeColor, sessionMasterId }) => {
  const [inputValue, setInputValue] = useState({});
  const [inputFile, setInputFile] = useState({});
  const [picture, setPicture] = useState({});

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
    getFilterStudentsAction,
    getFilterStudentsStatus,
    filterStudents,
    resetFilterStdStatus,
    uploadStudentPicAction,
    uploadStudentPicStatus,
    uploadedPic,
    resetUploadStatus,
  } = useStudentStore((s) => ({
    getFilterStudentsAction: s.getFilterStudentsAction,
    getFilterStudentsStatus: s.getFilterStudentsStatus,
    filterStudents: s.filterStudents,
    resetFilterStdStatus: s.resetFilterStdStatus,
    uploadStudentPicAction: s.uploadStudentPicAction,
    uploadStudentPicStatus: s.uploadStudentPicStatus,
    uploadedPic: s.uploadedPic,
    resetUploadStatus: s.resetUploadStatus,
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
    getSectionAction,
    getSectionStatus,
    sessionMasterId,
  ]);

  useEffect(() => {
    return () => resetFilterStdStatus();
  }, [resetFilterStdStatus]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const getReport = (e) => {
    e.preventDefault();
    getFilterStudentsAction({ ...inputValue, sessionMasterId });
  };

  useEffect(() => {
    if (picture?.srNo) {
      const id = find(
        filterStudents,
        (s) => s.student_master.srNo === picture.srNo
      )?.studentMasterId;
      uploadStudentPicAction({
        ...picture,
        studentMasterId: id,
      });
    }
  }, [filterStudents, picture, uploadStudentPicAction]);

  useEffect(() => {
    if (uploadStudentPicStatus === STATUS.SUCCESS) {
      resetUploadStatus();
      setPicture(null);
    }
  }, [resetUploadStatus, uploadStudentPicStatus]);

  return (
    <Box h="100%">
      <PageHeader heading={"Upload Student Picture"} />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <form onSubmit={getReport}>
            <Flex pb={3} gap={4} w={"50%"} mt={2}>
              {/* <CustomInput size={"sm"} type={"date"} name="date" label={"Select Date"} inputValue={inputValue} setInputValue={setInputValue} /> */}
              <CustomSelect
                size={"sm"}
                name={"classMasterId"}
                label={"Select Class"}
                notRequire={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(classes, (d, key) => ({
                  value: key,
                  name: d?.[0]?.class_master?.name,
                }))}
              />
              <CustomSelect
                size={"sm"}
                name={"streamMasterId"}
                label={"Select Stream"}
                notRequire={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(
                  uniqBy(
                    classes?.[inputValue?.classMasterId],
                    "streamMasterId"
                  ),
                  (d, index) => ({
                    value: d.stream_master.id,
                    name: d.stream_master.name,
                  })
                )}
              />
              <CustomSelect
                size={"sm"}
                name={"sectionMasterId"}
                label={"Select Section"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(allSections, (d) => ({ value: d.id, name: d.name }))}
              />
              <Button type="submit" size={"sm"} colorScheme={themeColor}>
                Get
              </Button>
            </Flex>
          </form>
          <LoadingContainer status={getFilterStudentsStatus}>
            {filterStudents?.length ? (
              <Box mt={4}>
                <Flex flexWrap={"wrap"} gap={3}>
                  {map(filterStudents, (student) => (
                    <Box
                      w={{ lg: "32%", xl: "24%" }}
                      bg="blue.50"
                      py={3}
                      borderRadius={10}
                    >
                      <Flex px={3} align={"center"}>
                        <Avatar
                          size={"sm"}
                          src={`${FILE_URL}${student?.student_master?.photo}`}
                        />
                        <Box ml={2}>
                          <Text fontSize={14} fontWeight={"semibold"}>
                            {student?.student_master?.studentName}
                          </Text>
                          <Text fontSize={12} color={"gray.500"}>
                            {student?.student_master?.fatherName}
                          </Text>
                        </Box>
                      </Flex>
                      <UploadFile
                        studentPic={true}
                        data={{
                          label: student?.student_master?.srNo,
                          name: student?.student_master?.srNo,
                        }}
                        inputValue={inputFile}
                        setInputValue={setInputFile}
                        setPicture={setPicture}
                      />
                    </Box>
                  ))}
                </Flex>
                {/* <TableContainer>
                                    <Table w="100%" size={"sm"} variant={"simple"}>
                                        <Thead>
                                            <Tr bg="gray.100">
                                                <Th>Sr No.</Th>
                                                <Th>Name</Th>
                                                <Th>Father Name</Th>
                                                <Th>Contact</Th>
                                                <Th>Profile Picture</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {map(filterStudents, (student) => {
                                                const std = student?.student_master
                                                return (
                                                    <Tr _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                                                        <Td>{std?.srNo}</Td>
                                                        <Td>{std?.studentName}</Td>
                                                        <Td>{std?.fatherName}</Td>
                                                        <Td>{std?.fatherContact}</Td>
                                                        <Td>
                                                            <UploadFile data={{ label: std?.studentName, name: std?.srNo }} inputValue={inputFile} setInputValue={setInputFile} />
                                                        </Td>
                                                    </Tr>
                                                )
                                            })}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                                <Flex mt={5} justify={"flex-end"}>
                                    <Button size={"sm"} colorScheme={themeColor}>Save</Button>
                                </Flex> */}
              </Box>
            ) : (
              <NoData title={"No Student Found"} />
            )}
          </LoadingContainer>
        </Box>
      </Box>
    </Box>
  );
};
