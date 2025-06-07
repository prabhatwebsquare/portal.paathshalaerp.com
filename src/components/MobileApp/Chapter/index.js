import {
  Avatar,
  Box,
  Button,
  HStack,
  IconButton,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { find, groupBy, map, uniqBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { AddIcon } from "@chakra-ui/icons";
import { MdDriveFolderUpload } from "react-icons/md";
import { useStaffStore } from "@/store/StaffStore";
import { STATUS } from "@/constant";
import { AddChapter } from "./AddChapter";
import { useMobileAppStore } from "@/store/MobileApp";
import { LoadingContainer } from "@/common/LoadingContainer";
import { CustomSelect } from "@/common/CustomSelect";
import { useClassSetupStore } from "@/store/classSetup";

export const Chapter = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [inputValue, setInputValue] = useState();
  const {
    getChapterAction,
    getChapterStatus,
    allChapters,
    deleteChapterAction,
    resetChapterStatus,
  } = useMobileAppStore((s) => ({
    getChapterAction: s.getChapterAction,
    getChapterStatus: s.getChapterStatus,
    allChapters: s.allChapters,
    deleteChapterAction: s.deleteChapterAction,
    resetChapterStatus: s.resetChapterStatus,
  }));

  const deleteChapter = (id) => {
    deleteChapterAction(id);
  };

  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));

  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
  }, [getClassSubjectAction, getClassSubjectStatus]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const getData = () => {
    getChapterAction({
      sessionMasterId,
      classMasterId: inputValue.classMasterId,
      streamMasterId: inputValue.streamMasterId,
      subjectMasterId: inputValue.subjectMasterId,
    });
  };
  return (
    <Box>
      {/* Page Header */}
      <PageHeader
        heading={"Chapter"}
        extra={
          <Button
            size={"sm"}
            colorScheme={themeColor}
            onClick={() => setToggleDrawer([])}
            leftIcon={<AddIcon />}
          >
            Add Chapter
          </Button>
        }
      />

      {/* Filter Section */}
      <Box bg={"white"} boxShadow={"lg"} borderRadius={"md"} p={5} mb={5}>
        <HStack spacing={5} mb={10}>
          <CustomSelect
            size={"md"}
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
            size={"md"}
            name={"streamMasterId"}
            label={"Select Stream"}
            notRequire={true}
            inputValue={inputValue}
            setInputValue={setInputValue}
            data={map(
              uniqBy(classes?.[inputValue?.classMasterId], "streamMasterId"),
              (d) => ({
                value: d.stream_master?.id,
                name: d.stream_master.name,
              })
            )}
          />
          <CustomSelect
            size={"md"}
            name={"subjectMasterId"}
            label={"Select Subject"}
            notRequire={true}
            inputValue={inputValue}
            setInputValue={setInputValue}
            data={map(
              find(
                allClassSubjects,
                (s) =>
                  s.classMasterId == inputValue?.classMasterId &&
                  s.streamMasterId == inputValue?.streamMasterId
              )?.assign_class_subjects,
              (c) => ({
                value: c.subjectMasterId,
                name: c.subject_master?.name,
              })
            )}
          />
          <Button
            size={"sm"}
            width={"15%"}
            colorScheme={themeColor}
            onClick={() => getData()}
          >
            Get
          </Button>
        </HStack>
        <Box className="scrollBar" p={0} bg={"white"}>
          <Box className="scrollBar" maxH={"80vh"} overflowY={"scroll"}>
            <LoadingContainer status={getChapterStatus}>
              <Box mt={4}>
                <SimpleGrid columns={[3, 4]} spacing={6} mt={4}>
                  {allChapters?.map((chapter) => (
                    <Box
                      key={chapter.id}
                      p={6}
                      borderWidth="1px"
                      borderRadius="lg"
                      shadow="lg"
                      bgGradient={`linear(to-r, ${themeColor}.50, white)`}
                      transition="all 0.3s ease-in-out"
                      _hover={{
                        transform: "scale(1.05)",
                        shadow: "2xl",
                        bgGradient: `linear(to-r, ${themeColor}.100, white)`,
                      }}
                    >
                      <HStack spacing={4} align="start">
                        {/* Avatar with the first letter of the title */}
                        <Avatar
                          size="md"
                          bg={`${themeColor}.500`}
                          color="white"
                          name={chapter.title}
                          src={null}
                        >
                          {/* <Text fontSize="xs" fontWeight="bold">
                            {chapter.title.charAt(0)}
                          </Text> */}
                        </Avatar>

                        {/* Card Content */}
                        <VStack align="start" spacing={2}>
                          <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color={`${themeColor}.600`}
                            noOfLines={2}
                            letterSpacing="wide"
                          >
                            {chapter.title}
                          </Text>
                        </VStack>
                      </HStack>

                      {/* Card Actions */}
                      <HStack mt={6} justifyContent="space-between">
                        <Button
                          size="sm"
                          colorScheme={themeColor}
                          variant="solid"
                          onClick={() => setToggleDrawer(chapter)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          onClick={() => deleteChapter(chapter.id)}
                        >
                          Delete
                        </Button>
                      </HStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            </LoadingContainer>
          </Box>
        </Box>
      </Box>

      {toggleDrawer && (
        <AddChapter
          sessionMasterId={sessionMasterId}
          themeColor={themeColor}
          data={toggleDrawer}
          closeDrawer={() => setToggleDrawer(null)}
        />
      )}
    </Box>
  );
};
