import {
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Icon,
  Box,
  Radio,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  RadioGroup,
  HStack,
  Grid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CustomInput from "@/common/CustomInput";
import { STATUS } from "@/constant";
import { useStdFeesStore } from "@/store/stdFees";
import { useFeesSetupStore } from "@/store/feesSetup";
import { concat, filter, map, sumBy, uniqBy } from "lodash";
import { LoadingContainer } from "@/common/LoadingContainer";
import { MdCurrencyRupee, MdPayment, MdPercent } from "react-icons/md";
import { ErrorAlert } from "@/utils/Helper";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { CustomSelect } from "@/common/CustomSelect";

export const StudentFeesEdit = ({
  data,
  closeDrawer,
  themeColor,
  sessionMasterId,
}) => {
  const [inputValue, setInputValue] = useState({
    isRTE: data.isRTE,
  });

  const [editData, setEditData] = useState(null);
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const {
    isOpen: isModalOpenAdd,
    onOpen: openModalAdd,
    onClose: closeModalAdd,
  } = useDisclosure();
  const {
    getStudentFeesAction,
    getStudentFeesStatus,
    studentFees,
    makeStudentFeesRTEAction,
    makeStudentFeesRTEStatus,
    updateCollectFeesAction,
    updateCollectFeesStatus,
    deleteCollectFeesAction,
    deleteCollectFeesStatus,
    addCollectFeesAction,
    addCollectFeesStatus,
  } = useStdFeesStore((s) => ({
    getStudentFeesAction: s.getStudentFeesAction,
    getStudentFeesStatus: s.getStudentFeesStatus,
    studentFees: s.studentFees,
    resetStudentFee: s.resetStudentFee,
    makeStudentFeesRTEAction: s.makeStudentFeesRTEAction,
    makeStudentFeesRTEStatus: s.makeStudentFeesRTEStatus,
    updateCollectFeesAction: s.updateCollectFeesAction,
    updateCollectFeesStatus: s.updateCollectFeesStatus,
    deleteCollectFeesAction: s.deleteCollectFeesAction,
    deleteCollectFeesStatus: s.deleteCollectFeesStatus,
    addCollectFeesAction: s.addCollectFeesAction,
    addCollectFeesStatus: s.addCollectFeesStatus,
  }));

  useEffect(() => {
    if (data?.id) {
      getStudentFeesAction({
        promotionId: data.id,
        studentMasterId: data.studentMasterId,
        feesMode: 1,
      });
    }
  }, [data, getStudentFeesAction]);

  useEffect(() => {
    if (studentFees?.studentFees?.length) {
      setInputValue({
        selectedFees: map(
          filter(studentFees?.studentFees, (s) => s.fees_type_master?.id === 1),
          "feesNameMasterId"
        ),
        collectedFees: map(
          filter(studentFees?.studentFees, (s) => s.fees_type_master?.id === 1),
          (fee) => ({
            fees: sumBy(fee.fees_collects, "amount"),
            feesNameMasterId: fee.feesNameMasterId,
          })
        ),
      });
    }
  }, [studentFees]);

  const handleEdit = (fee) => {
    setEditData(fee);
    openModal();
  };

  // Delete fee handler
  const handleDelete = async (fee) => {
    await deleteCollectFeesAction({
      promotionId: fee.promotionId,
      sessionMasterId: fee.sessionMasterId,
      studentFeesId: fee.id,
    });
    await getStudentFeesAction({
      promotionId: fee.promotionId,
      studentMasterId: fee.studentMasterId,
      feesMode: 1,
    });
  };

  const saveEdit = async () => {
    if (editData.amount < editData.feesReceived) {
      ErrorAlert("Amount cannot be less than fees received");
      return;
    }
    const data = {
      promotionId: editData.promotionId,
      sessionMasterId: editData.sessionMasterId,
      studentFeesId: editData.id,
      amount: editData.amount,
      isDaily: editData.isDaily,
      isPercent: editData.isPercent,
      lateFees: editData.lateFees,
      dueDate: editData.dueDate,
    };

    await updateCollectFeesAction(data);
    await getStudentFeesAction({
      promotionId: editData.promotionId,
      studentMasterId: editData.studentMasterId,
      feesMode: 1,
    });
    closeModal();
  };
  const saveEditAdd = async () => {
    if (!data?.student_master?.id) {
      ErrorAlert("Student ID is required");
      return;
    }
    if (!data?.sessionMasterId) {
      ErrorAlert("Session ID is required");
      return;
    }
    if (!inputValueAdd?.amount) {
      ErrorAlert("Amount is required");
      return;
    }
    if (inputValueAdd?.isLateFees && !inputValueAdd?.lateFees) {
      ErrorAlert("Late fees amount is required");
      return;
    }
    if (!inputValueAdd?.dueDate) {
      ErrorAlert("Due date is required");
      return;
    }

    const obj = {
      feesNameMasterId : inputValueAdd.feesNameMasterId,
      promotionId: data.student_master.id,
      sessionMasterId: data.sessionMasterId,
      amount: inputValueAdd.amount,
      isDaily: inputValueAdd.isDaily ,
      isPercent: inputValueAdd.isPercent,
      lateFees: inputValueAdd.lateFees ,
      dueDate: inputValueAdd.dueDate,
    }
    await addCollectFeesAction(obj);
    await getStudentFeesAction({
      promotionId: data.student_master.id,
      studentMasterId: data.student_master.id,
      feesMode: 1,
    });
    setInputValueAdd({});
    closeModalAdd();
  };

  const { getFeesNameAction, getFeesNameStatus, allFeesNames } =
    useFeesSetupStore((s) => ({
      getFeesNameAction: s.getFeesNameAction,
      getFeesNameStatus: s.getFeesNameStatus,
      allFeesNames: s.allFeesNames,
    }));
  useEffect(() => {
    if ((getFeesNameStatus || 1) === STATUS.NOT_STARTED) {
      getFeesNameAction();
    }
  }, [getFeesNameAction, getFeesNameStatus]);
  const [inputValueAdd, setInputValueAdd] = useState({});

  const inputHandler = (name, val) => {
    setInputValueAdd((pre) => ({ ...pre, [name]: val }));
  };
  return (
    <Drawer size={"xxl"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Edit Student Fees</DrawerHeader>
        <DrawerBody overflowY={"scroll"} className="scrollBar">
          <Flex justify="space-between" align="center" mb={10}>
            <Checkbox
              my={2}
              isChecked={inputValue.isRTE}
              fontWeight={"semibold"}
              colorScheme={themeColor}
              onChange={(e) =>
                setInputValue((pre) => ({
                  ...pre,
                  isRTE: Number(e.target.checked),
                  selectedFees: [],
                }))
              }
            >
              RTE Apply
            </Checkbox>
            {inputValue.isRTE ? (
              <Button
                size="md"
                colorScheme={themeColor}
                onClick={async () => {
                  await makeStudentFeesRTEAction({
                    promotionId: data.id,
                    sessionMasterId,
                    studentApplyFees: [],
                  });
                  closeDrawer();
                }}
              >
                Apply RTE Fees
              </Button>
            ) : (
              <Button
                size="md"
                colorScheme={themeColor}
                loading={makeStudentFeesRTEStatus === STATUS.FETCHING}
                onClick={() => {
                  setInputValueAdd({});
                  setEditData({}); 
                  openModalAdd(); 
                }}
              >
                Add New Fee
              </Button>
            )}
          </Flex>
          {!inputValue.isRTE && studentFees?.studentFees?.length ? (
            <LoadingContainer status={getStudentFeesStatus}>
              <Table size={"sm"} mt={5}>
                <Thead>
                  <Tr bg="gray.100">
                    <Th>Fees Name</Th>
                    <Th>Fees Type</Th>
                    <Th>Amount</Th>
                    <Th>Late Fees</Th>
                    <Th>Discount</Th>
                    <Th>Received</Th>
                    <Th>Pending Fees</Th>
                    <Th>Due Date</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {studentFees?.studentFees?.map((fee, index) => (
                    <Tr key={fee.id}>
                      <Td>{fee?.fees_name_master?.name}</Td>
                      <Td>{fee?.fees_type_master?.name}</Td>
                      <Td>{fee?.amount}</Td>
                      <Td>{fee?.lateFees || 0}</Td>
                      <Td>{fee?.discountReceived || 0}</Td>
                      <Td>{fee?.feesReceived || 0}</Td>
                      <Td>
                        {fee.totalFees -
                          fee.feesReceived -
                          fee.discountReceived}
                      </Td>
                      <Td>{new Date(fee.dueDate).toLocaleDateString()}</Td>
                      <Td>
                        <Button
                          size="xs"
                          colorScheme={themeColor}
                          onClick={() => handleEdit(fee)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          colorScheme="red"
                          ml={2}
                          loading={deleteCollectFeesStatus === STATUS.FETCHING}
                          onClick={() => handleDelete(fee)}
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </LoadingContainer>
          ) : (
            <Box textAlign="center" p={8}>
              <Icon as={MdPayment} w={16} h={16} color="gray.300" mb={4} />
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="gray.500"
                mb={2}
                style={{
                  animation: "fadeIn 0.8s ease-in-out",
                }}
              >
                No Fees Found
              </Text>
              <Text
                color="gray.400"
                fontSize="md"
                style={{
                  animation: "fadeIn 1s ease-in-out",
                }}
              >
                There are no fees assigned to this student yet
              </Text>
            </Box>
          )}
        </DrawerBody>
      </DrawerContent>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Fee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CustomInput
              mb={3}
              name="name" // This should match the key in your `editData` object
              label="Fees Name"
              disabled={editData?.id}
              inputValue={editData?.fees_name_master} // Pass the entire `editData` object
              setInputValue={(name, value) => {}}
            />
            <CustomInput
              mb={3}
              name="amount"
              label="Fee Amount"
              inputValue={editData || ""} // Correct the property based on `fee` structure
              setInputValue={setEditData}
            />

            <CustomInput
              mb={2}
              name="lateFees"
              label="Late Fees"
              inputValue={editData || ""}
              setInputValue={setEditData}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={saveEdit}
              loading={updateCollectFeesStatus === STATUS.FETCHING}
            >
              Save
            </Button>
            <Button colorScheme="red" ml={3} onClick={closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isModalOpenAdd} onClose={closeModalAdd} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Fee</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
            <Grid gap={2}>
              {/* <Select placeholder="Select Fees Type">
                {map(allFeesNames, (fee) => (
                  <option key={fee.id} value={fee.id}>
                    {fee.name}
                  </option>
                ))}
              </Select> */}
              <CustomSelect
                            // w={"32%"}
                            name={"feesNameMasterId"}
                            label={"Select Fees Type"}
                            inputValue={inputValueAdd}
                            setInputValue={setInputValueAdd}
                            data={map(allFeesNames, (fee) => ({
                              value: fee.id,
                              name: fee.name,
                            }))}
                          />
              <CustomInput
                size={"md"}
                name="amount"
                label="Fee Amount"
                inputValue={inputValueAdd || ""} // Correct the property based on `fee` structure
                setInputValue={setInputValueAdd}
              />
              <CustomInput
                size={"md"}
                type={"date"}
                name="dueDate"
                label={"Select Due Date"}
                inputValue={inputValueAdd}
                setInputValue={setInputValueAdd}
              />
            </Grid>
            <Checkbox
              my={3}
              size={"md"}
              colorScheme={themeColor}
              w="100%"
              defaultChecked={inputValueAdd?.lateFees}
              isChecked={inputValueAdd?.isLateFees}
              onChange={(e) => inputHandler("isLateFees", e.target.checked)}
            >
              <Text fontSize="sm" color="gray.700">
                Late Fees Apply
              </Text>
            </Checkbox>
            {inputValueAdd?.isLateFees ? (
              <>
                <InputGroup size="md">
                  <CustomInput
                    size={"md"}
                    type={"number"}
                    min={1}
                    name="lateFees"
                    label={"Late Fees Amount"}
                    inputValue={inputValueAdd}
                    setInputValue={setInputValueAdd}
                  />
                  <InputRightElement>
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          mr={8}
                          mt={-2}
                          _hover={"none"}
                          variant={"ghost"}
                          leftIcon={
                            inputValueAdd?.isPercent === "1" ? (
                              <MdPercent style={{ marginLeft: 10 }} />
                            ) : (
                              <MdCurrencyRupee style={{ marginLeft: 10 }} />
                            )
                          }
                          rightIcon={
                            <ChevronDownIcon
                              boxSize={5}
                              mr={2}
                              _hover={{ bg: "gray.100" }}
                            />
                          }
                        />
                      </PopoverTrigger>
                      <PopoverContent w="65px">
                        <PopoverBody>
                          <Text
                            px={2}
                            py={1}
                            mt={1}
                            border={"1px solid"}
                            borderColor={"gray.200"}
                            _hover={{
                              bg: `${themeColor}.400`,
                              color: "white",
                            }}
                            onClick={() => inputHandler("isPercent", "0")}
                          >
                            <MdCurrencyRupee />
                          </Text>
                          <Text
                            px={2}
                            py={1}
                            mt={1}
                            border={"1px solid"}
                            borderColor={"gray.200"}
                            _hover={{
                              bg: `${themeColor}.400`,
                              color: "white",
                            }}
                            onClick={() => inputHandler("isPercent", "1")}
                          >
                            <MdPercent />
                          </Text>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </InputRightElement>
                </InputGroup>
                {inputValueAdd?.lateFees ? (
                  <RadioGroup
                    mt={3}
                    size="sm"
                    w="100%"
                    onChange={(e) => inputHandler("isDaily", e)}
                    value={inputValueAdd?.isDaily}
                  >
                    <HStack
                      spacing={2}
                      align="start"
                      bg="gray.50"
                      p={4}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      boxShadow="sm"
                    >
                      <Radio value="1" size="sm" colorScheme={themeColor}>
                        <Text fontSize="sm" color="gray.700">
                          Daily
                        </Text>
                      </Radio>
                      <Radio value="0" size="sm" colorScheme={themeColor}>
                        <Text fontSize="sm" color="gray.700">
                          Monthly
                        </Text>
                      </Radio>
                    </HStack>
                  </RadioGroup>
                ) : null}
              </>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={saveEditAdd}>
              Save
            </Button>
            <Button colorScheme="red" ml={3} onClick={closeModalAdd}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Drawer>
  );
};
