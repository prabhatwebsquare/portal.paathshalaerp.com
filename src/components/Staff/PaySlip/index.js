import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import CustomInput from "@/common/CustomInput";
import { useStaffStore } from "@/store/StaffStore";
import { STATUS } from "@/constant";
import { PageHeader } from "@/common/PageHeader";

export const PaySlip = ({ themeColor, sessionMasterId }) => {
  const [paySlipData, setPaySlipData] = useState([
    {
      name: "",
      contact: "",
      totalDays: "",
      present: "",
      absent: "",
      leaves: "",
      cl: "",
    },
  ]); // Stores input values
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const toast = useToast();

  const { getStaffAction, getStaffStatus, allStaffs } = useStaffStore((s) => ({
    getStaffAction: s.getStaffAction,
    getStaffStatus: s.getStaffStatus,
    allStaffs: s.allStaffs,
  }));

  useEffect(() => {
    if ((getStaffStatus || 1) === STATUS.NOT_STARTED) {
      getStaffAction();
    }
  }, [getStaffAction, getStaffStatus]);

  useEffect(() => {
    if (allStaffs?.length > 0) {
      const initializedData = allStaffs.map((staff) => ({
        id: staff.id,
        name: staff.name,
        contact: staff.contact,
        totalDays: "",
        present: "",
        absent: "",
        leaves: "",
        cl: "",
      }));
      setPaySlipData(initializedData);
    }
  }, [allStaffs]);

  const handleCheckboxChange = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  // Custom function to update input fields
  const updateField = (id, updateFn) => {
    setPaySlipData((prevData) =>
      prevData.map((entry) => (entry.id === id ? updateFn(entry) : entry))
    );
  };

  const handleSave = () => {
    toast({
      title: "Payslip Saved!",
      description: "All payslip data has been saved successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const [inputValue, setInputValue] = useState({});

  return (
    <Box h="100%">
      <PageHeader
        heading={"Pay Slip"}
        extra={
          selectedEmployees.length > 0 && ( // Show button only when at least one checkbox is selected
            <Button size={"sm"} colorScheme={themeColor} onClick={handlePrint}>
              Print Payslip
            </Button>
          )
        }
      />

      <Box p={5} bg={"white"} h={"100%"} maxH={"100%"} overflowY={"scroll"}>
        <form>
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
            <Button
              size={"sm"}
              width={"100px"}
              colorScheme={themeColor}
              type="submit"
            >
              Get
            </Button>
          </Flex>
        </form>

        <TableContainer mt={2}>
          <Table w="100%" size={"sm"} variant={"simple"}>
            <Thead>
              <Tr bg="gray.100">
                <Th>Select</Th>
                <Th>Emp. Id</Th>
                <Th>Name</Th>
                <Th>Contact</Th>
                <Th minW="120px">Total Working Days</Th>
                <Th minW="120px">Present Days</Th>
                <Th minW="120px">Absent Days</Th>
                <Th minW="120px">Total Half Day</Th>
                <Th minW="120px">CL/PL</Th>
              </Tr>
            </Thead>
            <Tbody>
              {paySlipData.map((staff, index) => (
                <Tr key={staff.id}>
                  <Td>
                    <Checkbox
                      isChecked={selectedEmployees.includes(staff.id)}
                      onChange={() => handleCheckboxChange(staff.id)}
                    />
                  </Td>
                  <Td>{index + 1}</Td>
                  <Td>{staff.name}</Td>
                  <Td>{staff.contact}</Td>
                  <Td>
                    <CustomInput
                      type="number"
                      name="totalDays"
                      label="Total Days"
                      inputValue={staff}
                      setInputValue={(updateFn) =>
                        setPaySlipData((prevSchedules) => {
                          const updatedSchedules = [...prevSchedules];
                          updatedSchedules[index] = updateFn(
                            updatedSchedules[index]
                          );
                          return updatedSchedules;
                        })
                      }
                    />
                  </Td>
                  <Td>
                    <CustomInput
                      type="number"
                      name="present"
                      label="Present"
                      inputValue={staff}
                      setInputValue={(updateFn) =>
                        setPaySlipData((prevSchedules) => {
                          const updatedSchedules = [...prevSchedules];
                          updatedSchedules[index] = updateFn(
                            updatedSchedules[index]
                          );
                          return updatedSchedules;
                        })
                      }
                    />
                  </Td>
                  <Td>
                    <CustomInput
                      type="number"
                      name="absent"
                      label="Absent"
                      inputValue={staff}
                      setInputValue={(updateFn) =>
                        setPaySlipData((prevSchedules) => {
                          const updatedSchedules = [...prevSchedules];
                          updatedSchedules[index] = updateFn(
                            updatedSchedules[index]
                          );
                          return updatedSchedules;
                        })
                      }
                    />
                  </Td>
                  <Td>
                    <CustomInput
                      type="number"
                      name="leaves"
                      label="Leaves"
                      inputValue={staff}
                      setInputValue={(updateFn) =>
                        setPaySlipData((prevSchedules) => {
                          const updatedSchedules = [...prevSchedules];
                          updatedSchedules[index] = updateFn(
                            updatedSchedules[index]
                          );
                          return updatedSchedules;
                        })
                      }
                    />
                  </Td>
                  <Td>
                    <CustomInput
                      type="number"
                      name="cl"
                      label="CL/PL"
                      inputValue={staff}
                      setInputValue={(updateFn) =>
                        setPaySlipData((prevSchedules) => {
                          const updatedSchedules = [...prevSchedules];
                          updatedSchedules[index] = updateFn(
                            updatedSchedules[index]
                          );
                          return updatedSchedules;
                        })
                      }
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <Flex mt={4} justifyContent="flex-end">
          <Button colorScheme={themeColor} onClick={handleSave}>
            Save
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};
