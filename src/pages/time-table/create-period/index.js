import { MainLayout } from "@/layout/MainLayout";
import React, { useEffect, useState } from "react";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useTimetableStore } from "@/store/Timetable";
import { PageHeader } from "@/common/PageHeader";
import moment from "moment";
function Index() {
  const {
    addTimetableMasterAction,
    TimetableMaster,
    getTimetableMasterAction,
    updateTimetableMasterAction,
    deleteTimetableMasterAction,
  } = useTimetableStore((s) => ({
    addTimetableMasterAction: s.addTimetableMasterAction,
    TimetableMaster: s.TimetableMaster,
    getTimetableMasterAction: s.getTimetableMasterAction,
    updateTimetableMasterAction: s.updateTimetableMasterAction,
    deleteTimetableMasterAction: s.deleteTimetableMasterAction,
  }));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [periodData, setPeriodData] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    startTime: "",
    endTime: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPeriod = async () => {
    try {
      if (formData.id) {
        await updateTimetableMasterAction(formData);
        getTimetableMasterAction();
        setFormData({ name: "", startTime: "", endTime: "" });
      } else {
        await addTimetableMasterAction(formData);
        getTimetableMasterAction();
        setFormData({ name: "", startTime: "", endTime: "" });
      }
      onClose();
    } catch (error) {
      console.error("Error during handleAddPeriod:", error);
      ErrorAlert("An error occurred during the operation.");
    }
  };

  const themeColor = getLocalStorageItem("themeColor") || "blue";
  useEffect(() => {
    getTimetableMasterAction();

    return () => {};
  }, []);
  const convertTo12HourFormat = (time24) => {
    return moment(time24, "HH:mm:ss").format("hh:mm A");
  };

  return (
    <MainLayout>
      <PageHeader
        heading={"Create Your Orgnization Period"}
        extra={
          <Button size={"md"} colorScheme={themeColor} onClick={onOpen}>
            Add Period
          </Button>
        }
      />
      <Box p={5}>
        <Table variant="simple" colorScheme={themeColor}>
          <Thead>
            <Tr>
              <Th>S. No.</Th>
              <Th>Period</Th>
              {/* <Th>Start Time</Th>
              <Th>End Time</Th> */}
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {TimetableMaster?.map((period, index) => (
              <Tr key={period?.id} textAlign={"center"}>
                <Td textAlign={"center"}>{index + 1}</Td>
                <Td textAlign={"center"}>
                  {period?.name} ({convertTo12HourFormat(period?.startTime)} -{" "}
                  {convertTo12HourFormat(period?.endTime)})
                </Td>
                <Td textAlign={"center"}>
                  <IconButton
                    icon={<EditIcon />}
                    size="sm"
                    mr={2}
                    aria-label="Edit"
                    onClick={() => {
                      setFormData(period);
                      onOpen();
                    }}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme={themeColor}
                    aria-label="Delete"
                    onClick={() => {
                      deleteTimetableMasterAction(period?.id);
                      getTimetableMasterAction();
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Drawer for Add Period */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>
              {formData.id ? "Edit Period" : " Add New Period"}
            </DrawerHeader>
            <DrawerBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Period Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter period name"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Order ID</FormLabel>
                  <Input
                    type="number"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleInputChange}
                    placeholder="Enter Order Id"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Start Time</FormLabel>
                  <Input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>End Time</FormLabel>
                  <Input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </VStack>
            </DrawerBody>
            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme={themeColor} onClick={handleAddPeriod}>
                {formData.id ? "Update" : " Add"}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Box>
    </MainLayout>
  );
}

export default Index;
