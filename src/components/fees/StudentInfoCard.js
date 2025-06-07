import {
  Box,
  Flex,
  Avatar,
  Text,
  Divider,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { format } from "date-fns";

const StudentInfoCard = ({ student, themeColor }) => {
  return (
    <Box borderWidth="1px" borderRadius="md" p={4} bg="gray.50">
      <Flex align="center" gap={6}>
        {/* Avatar */}
        <Avatar
          size="xl"
          bg={`${themeColor}.200`}
          icon={<Text fontSize="2xl">👦</Text>}
        />

        {/* Details */}
        <Grid templateColumns="repeat(2, 1fr)" gap={4} flex={1}>
          {/* Left Column */}
          <GridItem>
            <Flex justify="space-between" mb={2}>
              <Text fontWeight="medium" color="gray.600">Student Name</Text>
              <Text fontWeight="semibold">{student?.studentName || "N/A"}</Text>
            </Flex>
            <Divider />
            <Flex justify="space-between" my={2}>
              <Text fontWeight="medium" color="gray.600">Father's Name</Text>
              <Text fontWeight="semibold">{student?.fatherName || "N/A"}</Text>
            </Flex>
            <Divider />
            <Flex justify="space-between" mt={2}>
              <Text fontWeight="medium" color="gray.600">Mother's Name</Text>
              <Text fontWeight="semibold">{student?.motherName || "N/A"}</Text>
            </Flex>
          </GridItem>

          {/* Right Column */}
          <GridItem>
            <Flex justify="space-between" mb={2}>
              <Text fontWeight="medium" color="gray.600">Admission Number</Text>
              <Text fontWeight="semibold">{student?.admissionNo || "N/A"}</Text>
            </Flex>
            <Divider />
            <Flex justify="space-between" my={2}>
              <Text fontWeight="medium" color="gray.600">Class</Text>
              <Text fontWeight="semibold">
                {student?.class_master?.id || "N/A"} - {student?.class_master?.name || ""}
              </Text>
            </Flex>
            <Divider />
            <Flex justify="space-between" my={2}>
              <Text fontWeight="medium" color="gray.600">Section</Text>
              <Text fontWeight="semibold">{student?.section_master?.name || "N/A"}</Text>
            </Flex>
            <Divider />
            <Flex justify="space-between" mt={2}>
              <Text fontWeight="medium" color="gray.600">Date</Text>
              <Text fontWeight="semibold">{format(new Date(), "d-M-yyyy")}</Text>
            </Flex>
          </GridItem>
        </Grid>
      </Flex>
    </Box>
  );
};

export default StudentInfoCard;
