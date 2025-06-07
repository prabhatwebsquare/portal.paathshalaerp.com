import React, { useEffect, useMemo, useState } from "react";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { map, concat, find, includes, reject } from "lodash";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import dayjs from "dayjs";

export const AddClassSubject = ({
  data,
  allClassDetails,
  allSubjects,
  closeDrawer,
  reloadData,
}) => {
  const sessionMasterId = useMemo(
    () => getLocalStorageItem("sessionMasterId"),
    []
  );
  const themeColor = getLocalStorageItem("themeColor") || "blue";
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,  
          classMasterId: data.classMasterId,
          streamMasterId: data.streamMasterId,
          sessionMasterId
        }
      : {
      }
  );
  const [subjectsArray, setSubjectsArray] = useState(
    data.assign_class_subjects?.length
      ? map(data.assign_class_subjects, (s) => ({
          subjectMasterId: s.subjectMasterId,
          subjectType: s.subjectType,
          practical: s.practical,
          applyFee: s.feesAmount > 0 ? 1 : 0,
          feesAmount: s.feesAmount || "0",
          dueDate:
            s.practical == 1 ? dayjs(data.dueDate).format("YYYY-MM-DD") : "",
        }))
      : [{ practical: "0", applyFee: "0", feesAmount: "" }]
  );

  const subInput = (name, val, index) => {
    setSubjectsArray((prevState) => {
      const updatedArray = [...prevState];
      updatedArray[index] = {
        ...updatedArray[index],
        [name]: val,
      };
      return updatedArray;
    });
  };

  const deleteSubArray = (index) => {
    const updatedArray = [...subjectsArray];
    updatedArray.splice(index, 1);
    setSubjectsArray(updatedArray);
  };
  const {
    addClassSubjectAction,
    addClassSubjectStatus,
    updateClassSubjectAction,
    updateClassSubjectStatus,
    resetClassSubjectStatus,
  } = useClassSetupStore((s) => ({
    addClassSubjectAction: s.addClassSubjectAction,
    addClassSubjectStatus: s.addClassSubjectStatus,
    updateClassSubjectAction: s.updateClassSubjectAction,
    updateClassSubjectStatus: s.updateClassSubjectStatus,
    resetClassSubjectStatus: s.resetClassSubjectStatus,
  }));

  const submitClassSubject = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateClassSubjectAction({
        ...inputValue,
        subjectData: subjectsArray,
      });
    } else {
      addClassSubjectAction({
        ...inputValue,
        subjectData: subjectsArray,
        sessionMasterId
      });
    }
  };
  useEffect(() => {
    if (
      addClassSubjectStatus === STATUS.SUCCESS ||
      updateClassSubjectStatus === STATUS.SUCCESS
    ) {
      resetClassSubjectStatus();
      reloadData();
      if (data?.id) {
        closeDrawer();
      } else {
        setSubjectsArray([{ practical: "0" }]);
      }
    }
  }, [
    addClassSubjectStatus,
    closeDrawer,
    data?.id,
    reloadData,
    resetClassSubjectStatus,
    updateClassSubjectStatus,
  ]);

  const unSelectedSubjects = useMemo(() => {
    return reject(allSubjects, (sub) =>
      includes(
        map(subjectsArray, (s) => s.subjectMasterId),
        sub.id
      )
    );
  }, [allSubjects, subjectsArray]);

  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={submitClassSubject}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Class Subject" : "Add Class Subject"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              {/* Class Selection */}
              <FormControl>
                <FormLabel>Select Class</FormLabel>
                <Select
                  size="sm"
                  fontsize="xs" // Smaller font size
                  fontWeight="semibold"
                  focusBorderColor={`${themeColor}.400`} // Using blue theme color
                  placeholder="Select Class"
                  value={inputValue.classMasterId || ""}
                  onChange={(e) =>
                    setInputValue((prev) => ({
                      ...prev,
                      classMasterId: parseInt(e.target.value),
                    }))
                  }
                >
                  {map(allClassDetails?.classMaster, (c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Select Stream</FormLabel>
                <Select
                  size="sm"
                  fontsize="xs" // Smaller font size
                  fontWeight="semibold"
                  focusBorderColor={`${themeColor}.400`} // Using blue theme color
                  placeholder="Select stream"
                  value={inputValue.streamMasterId || ""}
                  onChange={(e) =>
                    setInputValue((prev) => ({
                      ...prev,
                      streamMasterId: parseInt(e.target.value),
                    }))
                  }
                >
                  {map(allClassDetails?.streamMaster, (c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Subject Table */}
              <Table mt={3} w="100%" size={"sm"} variant={"simple"}>
                <Thead>
                  <Tr bg="gray.100">
                    <Th>Subject</Th>
                    <Th>Type</Th>
                    <Th>Practical</Th>
                    <Th>Apply Fee</Th>
                    <Th>Fee Amount</Th>
                    <Th>Due Date</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {map(subjectsArray, (sub, index) => (
                    <Tr key={index}>
                      {/* Subject */}
                      <Td>
                        <FormControl isRequired>
                          <Select
                            size="xs"
                            fontsize="xs" // Smaller font size
                            fontWeight="semibold"
                            focusBorderColor={`${themeColor}.400`} // Using blue theme color
                            placeholder="Select Subject"
                            value={sub.subjectMasterId || ""}
                            onChange={(e) =>
                              subInput(
                                "subjectMasterId",
                                parseInt(e.target.value),
                                index
                              )
                            }
                          >
                            {map(
                              concat(
                                find(
                                  allSubjects,
                                  (s) => s.id === sub.subjectMasterId
                                ) || [],
                                unSelectedSubjects
                              ),
                              (c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              )
                            )}
                          </Select>
                        </FormControl>
                      </Td>

                      {/* Subject Type */}
                      <Td>
                        <Select
                          size="xs"
                          fontsize="xs" // Smaller font size
                          fontWeight="semibold"
                          focusBorderColor={`${themeColor}.400`} // Using blue theme color
                          placeholder="Select Type"
                          value={sub.subjectType || ""}
                          onChange={(e) =>
                            subInput("subjectType", e.target.value, index)
                          }
                        >
                          <option value="Compulsary">Compulsary</option>
                          <option value="Optional">Optional</option>
                          <option value="Additional">Additional</option>
                        </Select>
                      </Td>

                      {/* Practical */}
                      <Td>
                        <Select
                          size="xs"
                          fontsize="xs" // Smaller font size
                          fontWeight="semibold"
                          focusBorderColor={`${themeColor}.400`} // Using blue theme color
                          placeholder="Practical"
                          value={sub.practical || "0"}
                          onChange={(e) => {
                            subInput("practical", e.target.value, index);
                            if (Number(e.target.value) === 0) {
                              subInput("applyFee", "0", index);
                              subInput("feesAmount", "", index);
                            }
                          }}
                        >
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </Select>
                      </Td>

                      {/* Apply Fee */}
                      <Td>
                        <Select
                          size="xs"
                          fontsize="xs" // Smaller font size
                          fontWeight="semibold"
                          focusBorderColor={`${themeColor}.400`} // Using blue theme color
                          placeholder="Apply Fee"
                          value={sub.applyFee || "0"}
                          onChange={(e) => {
                            subInput("applyFee", e.target.value, index);
                            if (Number(e.target.value) === 0) {
                              subInput("feesAmount", "", index);
                            }
                          }}
                          disabled={sub.practical !== "1"}
                        >
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </Select>
                      </Td>

                      {/* Fee Amount */}
                      <Td>
                        <Input
                          size="xs"
                          fontsize="xs" // Smaller font size
                          focusBorderColor={`${themeColor}.400`}
                          placeholder="Fee Amount"
                          value={
                            sub.practical !== "1" ||
                            (sub.applyFee !== "1" && !sub.feesAmount)
                              ? "0"
                              : sub.feesAmount
                          }
                          onChange={(e) =>
                            subInput("feesAmount", e.target.value, index)
                          }
                          disabled={
                            Number(sub.practical) !== 1 ||
                            Number(sub.applyFee) !== 1
                          }
                        />
                      </Td>

                      <Td>
                        <Input
                          size="xs"
                          type="date"
                          fontsize="xs" // Smaller font size
                          focusBorderColor={`${themeColor}.400`}
                          placeholder="Due Date"
                          value={sub.dueDate}
                          onChange={(e) =>
                            subInput("dueDate", e.target.value, index)
                          }
                          disabled={
                            Number(sub.practical) !== 1 ||
                            Number(sub.applyFee) !== 1
                          }
                        />
                      </Td>

                      <Td>
                        <IconButton
                          size="xs"
                          variant="ghost"
                          colorScheme="red"
                          icon={<DeleteIcon />}
                          onClick={() => deleteSubArray(index)}
                        />
                      </Td>
                    </Tr>
                  ))}
                  <Tr>
                    <Td colSpan={7} textAlign="center">
                      <Button
                        size="xs"
                        colorScheme={themeColor}
                        leftIcon={<AddIcon />}
                        onClick={() =>
                          setSubjectsArray((prev) => [
                            ...prev,
                            { practical: "0", applyFee: "0", feesAmount: "" },
                          ])
                        }
                      >
                        Add More
                      </Button>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              size="xs"
              variant="outline"
              colorScheme="red"
              mr={3}
              onClick={closeDrawer}
            >
              Cancel
            </Button>
            <Button size="xs" colorScheme={themeColor} type="submit">
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
