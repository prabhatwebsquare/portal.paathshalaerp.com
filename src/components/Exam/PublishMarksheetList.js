import { DeleteButton } from "@/common/DeleteButton";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useExamStore } from "@/store/Exam";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  TabList,
  Table,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { compact, groupBy, map, orderBy, uniqBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { PublishMarksheet } from "./ExamGroup/publishMarksheet";
import { CustomSelect } from "@/common/CustomSelect";
import { useClassSetupStore } from "@/store/classSetup";

export const PublishMarksheetList = ({ themeColor, sessionMasterId }) => {
  const [toggleAddGroup, setToggleAddGroup] = useState(null);
  const { getExamAction, getExamStatus, allExams } = useExamStore((s) => ({
    getExamAction: s.getExamAction,
    getExamStatus: s.getExamStatus,
    allExams: s.allExams,
  }));
  const {
    getpublishMarksheetGroupAction,
    getpublishMarksheetGroupStatus,
    publishMarksheetGroup,
    deletepublishMarksheetGroupAction,
    deletepublishMarksheetGroupStatus,
    resetPublishMarksheetStatus,
  } = useExamStore((s) => ({
    getpublishMarksheetGroupAction: s.getpublishMarksheetGroupAction,
    getpublishMarksheetGroupStatus: s.getpublishMarksheetGroupStatus,
    publishMarksheetGroup: s.publishMarksheetGroup,
    deletepublishMarksheetGroupAction: s.deletepublishMarksheetGroupAction,
    deletepublishMarksheetGroupStatus: s.deletepublishMarksheetGroupStatus,
    resetPublishMarksheetStatus: s.resetPublishMarksheetStatus,
  }));

  useEffect(() => {
    getExamAction({ type: "exam" });
  }, [getExamAction]);

  useEffect(() => {
    if ((getpublishMarksheetGroupStatus || 1) === STATUS.NOT_STARTED) {
      getpublishMarksheetGroupAction();
    }
  }, [getpublishMarksheetGroupAction, getpublishMarksheetGroupStatus]);

  const getData = () => {
    getpublishMarksheetGroupAction(inputValue);
  };

  const deleteExamGroup = (id) => {
    deletepublishMarksheetGroupAction(id);
  };
  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));
  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);
  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
  }, [getClassSubjectAction, getClassSubjectStatus]);
  const [inputValue, setInputValue] = useState({ sessionMasterId });

  return (
    <Box pos={"relative"} h={"60vh"}>
      <PageHeader
        heading={"Publish Marksheet"}
        extra={
          HasPermission(PERMISSIONS.EXAM_GROUP_ADD) && (
            <Button
              size={"sm"}
              colorScheme={themeColor}
              onClick={() => setToggleAddGroup({})}
            >
              Add Group
            </Button>
          )
        }
      />
      <Box p={5}>
        <Grid templateColumns="repeat(8, 1fr)" gap="6">
          <GridItem colSpan={2}>
            <CustomSelect
              size="sm"
              name="classMasterId"
              label="Class"
              inputValue={inputValue}
              setInputValue={setInputValue}
              data={map(classes, (d, key) => ({
                value: key,
                name: d?.[0]?.class_master?.name,
              }))}
            />
          </GridItem>
          <GridItem colSpan={2}>
            <CustomSelect
              size="sm"
              name="streamMasterId"
              label="Stream"
              inputValue={inputValue}
              setInputValue={setInputValue}
              data={map(
                uniqBy(classes?.[inputValue?.classMasterId], "streamMasterId"),
                (d) => ({
                  value: d.stream_master.id,
                  name: d.stream_master.name,
                })
              )}
            />
          </GridItem>
          <GridItem colSpan={2}>
            <Box w="100%">
              <RadioGroup
                value={inputValue.isPublish}
                onChange={(val) =>
                  setInputValue((prev) => ({
                    ...prev,
                    isPublish: Number(val),
                  }))
                }
              >
                <Stack direction="row" spacing={5}>
                  <Radio
                    value={1}
                    size="md"
                    colorScheme={themeColor}
                    _hover={{ bg: `${themeColor}.100`, borderRadius: "md" }}
                  >
                    Publish
                  </Radio>
                  <Radio
                    value={0}
                    size="md"
                    colorScheme={themeColor}
                    _hover={{ bg: `${themeColor}.100`, borderRadius: "md" }}
                  >
                    Do Not Publish
                  </Radio>
                </Stack>
              </RadioGroup>
            </Box>
          </GridItem>
          <Button
            onClick={getData}
            size={"sm"}
            width={"120px"}
            colorScheme={themeColor}
          >
            Get
          </Button>
        </Grid>
      </Box>
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"60vh"} overflowY={"scroll"}>
          <LoadingContainer status={getpublishMarksheetGroupStatus}>
            {publishMarksheetGroup?.length ? (
              <TableContainer mt={2}>
                <Table w="100%" height={"100%"} size={"sm"} variant={"simple"}>
                  <Thead>
                    <Tr bg="gray.100">
                      <Th>S.No.</Th>
                      <Th>name</Th>
                      <Th>Class</Th>
                      <Th>Stream</Th>
                      <Th>Exam Name</Th>
                      {HasPermission(PERMISSIONS.EXAM_GROUP_EDIT) ||
                      HasPermission(PERMISSIONS.EXAM_GROUP_DELETE) ? (
                        <Th>Action</Th>
                      ) : null}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(publishMarksheetGroup, (group, index) => (
                      <Tr key={group.id}>
                        <Td>{index + 1}</Td>
                        <Td>{group?.name}</Td>
                        <Td>{group?.class_master.name}</Td>
                        <Td>{group?.stream_master.name}</Td>
                        <Td>
                          {compact(
                            map(
                              group?.marksheet_exam_arrays,
                              (e) => e?.exam_master.name
                            ).join(", ")
                          )}
                        </Td>
                        <Td>
                          <Tooltip placement="top" label="Edit">
                            <IconButton
                              mr={3}
                              size={"sm"}
                              variant={"ghost"}
                              icon={<EditIcon />}
                              colorScheme={themeColor}
                              onClick={() => setToggleAddGroup(group)}
                            />
                          </Tooltip>
                          <DeleteButton
                            description={"Are you sure? Do you want to delete?"}
                            confirm={() => deleteExamGroup(group.id)}
                            status={deletepublishMarksheetGroupStatus}
                            reset={resetPublishMarksheetStatus}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Exam Found"} />
            )}
          </LoadingContainer>
          {toggleAddGroup && (
            <PublishMarksheet
              allExams={allExams}
              publishMarksheetGroup={publishMarksheetGroup}
              data={toggleAddGroup}
              closeDrawer={() => setToggleAddGroup(null)}
              themeColor={themeColor}
              sessionMasterId={sessionMasterId}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
