import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  FormControl,
  FormLabel,
  Switch,
  VStack,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  SimpleGrid,
  Avatar,
  HStack,
  Box,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { MainLayout } from "@/layout/MainLayout";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import CustomInput from "@/common/CustomInput";
import { PageHeader } from "@/common/PageHeader";
import CustomTextarea from "@/common/CustomTextarea";
import { useTimetableStore } from "@/store/Timetable";
import { FILE_URL } from "@/services/apis";

const TeacherTable = () => {
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "John Doe",
      employeeId: "EMP001",
      address: "123 Street, City",
      gender: "Male",
      dob: "1990-01-01",
      department: "Mathematics",
      designation: "Lecturer",
      experience: 5,
      maritalStatus: "Single",
      isActive: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      employeeId: "EMP002",
      address: "456 Avenue, Town",
      gender: "Female",
      dob: "1992-02-02",
      department: "Science",
      designation: "Professor",
      experience: 8,
      maritalStatus: "Married",
      isActive: false,
    },
  ]);

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  const [currentTeacher, setCurrentTeacher] = useState(null);

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const handleEdit = (teacher = null) => {
    setCurrentTeacher(teacher || {});
    onDrawerOpen();
  };

  const confirmDelete = (teacher) => {
    setTeacherToDelete(teacher);
    onModalOpen();
  };

  const handleDelete = () => {
    setTeachers((prev) => prev.filter((t) => t.id !== teacherToDelete.id));
    onModalClose();
  };

  const toggleStatus = (id) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
  };
  const themeColor = getLocalStorageItem("themeColor") || "blue";
  const [stdPhoto, setStdPhoto] = useState(null);
  const {
    addTeacherRegistrionAction,
    RegisteredTeacher,
    getTeacherRegistrionAction,
    updateTeacherRegistrionAction,
    deleteTimetableMasterAction,
  } = useTimetableStore((s) => ({
    addTeacherRegistrionAction: s.addTeacherRegistrionAction,
    RegisteredTeacher: s.RegisteredTeacher,
    getTeacherRegistrionAction: s.getTeacherRegistrionAction,
    updateTeacherRegistrionAction: s.updateTeacherRegistrionAction,
    deleteTimetableMasterAction: s.deleteTimetableMasterAction,
  }));

  useEffect(() => {
    getTeacherRegistrionAction();
    return () => {};
  }, []);
  const handleSave = async (teacherData) => {
    try {
      if (currentTeacher?.id) {
        await updateTeacherRegistrionAction(teacherData);
        getTeacherRegistrionAction();
        setCurrentTeacher({});
      } else {
        await addTeacherRegistrionAction(teacherData);
        getTeacherRegistrionAction();
        setCurrentTeacher({});
      }
      onDrawerClose();
    } catch (error) {
      console.error("Error during handleAddPeriod:", error);
      ErrorAlert("An error occurred during the operation.");
    }
  };
  return (
    <MainLayout>
      <PageHeader
        heading={"Teacher Registration"}
        extra={
          <Button
            size={"md"}
            colorScheme={themeColor}
            onClick={() => handleEdit([])}
          >
            Add Teacher
          </Button>
        }
      />
      <Flex
        direction="column"
        p={4}
        maxHeight={"90%"}
        overflow={"scroll"}
        overflowX={"hidden"}
      >
        <Table variant="simple" colorScheme={themeColor} interactive>
          <Thead>
            <Tr>
              <Th textAlign={"center"}>S. No.</Th>
              <Th textAlign={"center"}>Name</Th>
              <Th textAlign={"center"}>Employee ID</Th>
              <Th textAlign={"center"}>Address</Th>
              <Th textAlign={"center"}>Status</Th>
              <Th textAlign={"center"}>Actions</Th>
              <Th textAlign={"center"}>Status Change</Th>
            </Tr>
          </Thead>
          <Tbody>
            {RegisteredTeacher?.map((teacher, index) => (
              <Tr key={teacher.id}>
                <Td textAlign={"center"}>{index + 1}</Td>
                <Td textAlign={"center"}>{teacher.name}</Td>
                <Td textAlign={"center"}>{teacher.employeeId}</Td>
                <Td textAlign={"center"}>{teacher.address}</Td>
                <Td textAlign={"center"}>
                  {teacher.isActive ? "Active" : "Inactive"}
                </Td>
                <Td textAlign={"center"}>
                  <IconButton
                    icon={<EditIcon />}
                    onClick={() => handleEdit(teacher)}
                    aria-label="Edit Teacher"
                    mr={2}
                  />
                </Td>
                <Td textAlign={"center"}>
                  {" "}
                  <Button
                    size="sm"
                    onClick={() => toggleStatus(teacher.id)}
                    colorScheme={teacher.isActive ? "red" : "green"}
                  >
                    {teacher.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Drawer
          isOpen={isDrawerOpen}
          placement="right"
          onClose={onDrawerClose}
          size="md"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader color={`${themeColor}.600`}>
              {currentTeacher?.id ? "Edit Teacher" : "Add Teacher"}
            </DrawerHeader>
            <DrawerBody>
              <VStack spacing={4}>
                <FormControl my={3}>
                  <FormLabel color={`${themeColor}.600`} textAlign={"center"}>
                    Profile Picture
                  </FormLabel>
                  <Box
                    position="relative"
                    display="flex"
                    justifyContent="center"
                    w="100%"
                  >
                    <Avatar
                      borderColor={`${themeColor}.600`}
                      borderWidth={"2px"}
                      size="2xl"
                      src={
                        stdPhoto
                          ? URL.createObjectURL(stdPhoto)
                          : `${FILE_URL}${currentTeacher?.photo}`
                      }
                      name={currentTeacher?.name || "Profile Picture"}
                      cursor="pointer"
                      onClick={() => document.getElementById("photo").click()}
                    />
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      display="none"
                      onChange={(e) => {
                        const file = e.target.files;
                        if (file?.length) {
                          setCurrentTeacher((prev) => ({
                            ...prev,
                            photo: file[0],
                          }));
                          setStdPhoto(file[0]);
                        }
                      }}
                    />
                  </Box>
                </FormControl>
                <CustomInput
                  autoFocus={true}
                  size={"md"}
                  type={"text"}
                  name="name"
                  label={"Enter Name"}
                  inputValue={currentTeacher}
                  setInputValue={setCurrentTeacher}
                />
                <CustomInput
                  autoFocus={true}
                  size={"md"}
                  type={"text"}
                  name="employeeId"
                  label={"Enter Employee ID"}
                  inputValue={currentTeacher}
                  setInputValue={setCurrentTeacher}
                />
                <CustomInput
                  autoFocus={true}
                  size={"md"}
                  type={"text"}
                  name="email"
                  label={"Enter Email Id"}
                  inputValue={currentTeacher}
                  setInputValue={setCurrentTeacher}
                />
                <CustomInput
                  autoFocus={true}
                  size={"md"}
                  type={"number"}
                  limit={10}
                  name="mobileNo"
                  label={"Enter Mobile Number"}
                  inputValue={currentTeacher}
                  setInputValue={setCurrentTeacher}
                />
                <FormControl>
                  <Select
                    focusBorderColor={`${themeColor}.500`}
                    value={currentTeacher?.gender || ""}
                    onChange={(e) =>
                      setCurrentTeacher((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
                <CustomTextarea
                  w={"100%"}
                  rows={3}
                  top={"30%"}
                  notRequire={true}
                  type={"text"}
                  name="address"
                  label={"Address"}
                  inputValue={currentTeacher}
                  setInputValue={setCurrentTeacher}
                />
              </VStack>
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onDrawerClose}>
                Cancel
              </Button>
              <Button
                colorScheme={themeColor}
                onClick={() =>
                  handleSave({
                    ...currentTeacher,
                  })
                }
              >
                Save
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Modal isOpen={isModalOpen} onClose={onModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Delete</ModalHeader>
            <ModalBody>
              Are you sure you want to delete teacher{" "}
              <strong>{teacherToDelete?.name}</strong>?
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" mr={3} onClick={onModalClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete}>
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </MainLayout>
  );
};

export default TeacherTable;
