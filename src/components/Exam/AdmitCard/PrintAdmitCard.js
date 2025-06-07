import { useEffect, useMemo } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { map } from "lodash";
import { SchoolHeader } from "@/common/SchoolHeader";
import { URL } from "@/services/apis";
import { getLocalStorageItem } from "@/utils/LocalStorage";

// Rotate style outside render to avoid recalculating on every render
const ROTATE_STYLE = { transform: "rotate(-90deg)" };

export const PrintAdmitCard = ({
  exam,
  examTimeTable,
  allData,
  setAllPrintProps,
}) => {
  const schoolData = getLocalStorageItem("user");

  useEffect(() => {
    return () => setAllPrintProps(null);
  }, [setAllPrintProps]);

  // Memoized timetable sorted by date
  const sortedTimeTable = useMemo(() => {
    const tables = examTimeTable?.[0]?.exam_time_tables || [];
    return [...tables].sort(
      (a, b) => new Date(a.examDate) - new Date(b.examDate)
    );
  }, [examTimeTable]);

  return map(allData, (data, idx) => (
    <Box
      key={idx}
      h="421pt"
      w="595pt"
      border="1px solid"
      borderColor="gray.700"
      borderRadius={6}
      pos="relative"
      bg="white"
      overflow="hidden"
    >
      <Flex
        direction="column"
        w="410pt"
        h="100%"
        style={ROTATE_STYLE}
        justify="space-between"
        pos="absolute"
        top={0}
        left={3}
      >
        <Flex direction="column" h="100%" w="100%" p={2} mt={2}>
          <SchoolHeader title={`Admit Card (${exam?.exam_master.name})`} />

          <Flex p={2} borderBottom="1px solid" borderColor="gray.300" gap={2}>
            {/* Column 1 */}
            <Box w="50%" fontSize="10px">
              {[
                { label: "Roll No.", value: data.rollNo },
                {
                  label: "Student Name",
                  value: data.student_master?.studentName || "N/A",
                },
                {
                  label: "Father's Name",
                  value: data.student_master?.fatherName || "N/A",
                },
                {
                  label: "Mother's Name",
                  value: data.student_master?.motherName || "N/A",
                },
                {
                  label: "DOB",
                  value: dayjs(data.student_master?.dob).format("DD-MM-YYYY"),
                },
              ].map(({ label, value }, i) => (
                <Row key={i} label={label} value={value} />
              ))}
            </Box>

            {/* Column 2 */}
            <Box w="35%" fontSize="10px">
              {[
                { label: "Sr No.", value: data.student_master?.srNo || "N/A" },
                { label: "Class", value: data.class_master?.name || "N/A" },
                { label: "Stream", value: data.stream_master?.name || "N/A" },
                { label: "Section", value: data.section_master?.name || "N/A" },
                { label: "Exam", value: exam?.exam_master?.name || "N/A" },
              ].map(({ label, value }, i) => (
                <Row key={i} label={label} value={value} />
              ))}
            </Box>

            {/* Photo */}
            <Box w="15%">
              {data?.student_master?.photo && (
                <Image
                  h="70px"
                  w="full"
                  objectFit="cover"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                  src={`${URL}${data?.student_master?.photo}`}
                  alt="student"
                />
              )}
            </Box>
          </Flex>

          {/* Timetable */}
          <Box p={2} fontSize="10px">
            <Flex
              wrap="wrap"
              border="1px solid"
              borderColor="gray.300"
              fontWeight="medium"
              borderRadius="md"
              overflow="hidden"
            >
              {/* Table Headings */}
              <Flex
                w="50%"
                bg="gray.100"
                px={2}
                py={1}
                borderRight="1px solid"
                borderBottom="1px solid"
                borderColor="gray.300"
              >
                <Text w="40%" fontWeight="bold">
                  Subject
                </Text>
                <Text w="60%" fontWeight="bold">
                  Date & Time
                </Text>
              </Flex>
              <Flex
                w="50%"
                bg="gray.100"
                px={2}
                py={1}
                borderBottom="1px solid"
                borderColor="gray.300"
              >
                <Text w="40%" fontWeight="bold">
                  Subject
                </Text>
                <Text w="60%" fontWeight="bold">
                  Date & Time
                </Text>
              </Flex>

              {/* Subjects */}
              {sortedTimeTable.map((sub, index) => (
                <SubjectUI
                  key={index}
                  subName={sub.subject_master?.name}
                  time={sub.examDate}
                />
              ))}
            </Flex>

            {/* Signatures */}
            <Flex justify="space-between" align="center" mt={8}>
              <SignatureBlock
                src={
                  schoolData?.schoolData?.examCoordinatorSignature
                    ? `${URL}${schoolData?.schoolData?.examCoordinatorSignature}`
                    : ""
                }
                label="Exam Coordinator Signature"
              />
              <SignatureBlock
                src={
                  schoolData?.schoolData?.principalSignature
                    ? `${URL}${schoolData?.schoolData?.principalSignature}`
                    : ""
                }
                label="Principal Signature"
              />
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </Box>
  ));
};

const Row = ({ label, value }) => (
  <Flex mb="1" align="center" justifyContent="space-between">
    <Text>{label}</Text>
    <Text fontWeight="semibold" px={1}>
      :
    </Text>
    <Text fontWeight="semibold" flex="1">
      {value}
    </Text>
  </Flex>
);

const SubjectUI = ({ subName, time }) => (
  <Flex
    w="50%"
    px={2}
    py={1}
    borderRight="1px solid"
    borderBottom="1px solid"
    borderColor="gray.300"
  >
    <Text w="40%">{subName}</Text>
    <Text w="60%">
      : {dayjs(time).format("DD-MM-YYYY")} {dayjs(time).format("hh:mm A")}
    </Text>
  </Flex>
);
const SignatureBlock = ({ src, label }) => (
  <Box textAlign="center" fontSize="10px">
    {src && <Image src={src} alt={label} height="35px" />}
    <Text mt={1} borderTop="1px solid gray" pt={0.5}>
      {label}
    </Text>
  </Box>
);
