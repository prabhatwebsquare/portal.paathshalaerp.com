import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { STATUS } from "@/constant";
import { useClassSetupStore } from "@/store/classSetup";
import { useStaffStore } from "@/store/StaffStore";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Select,
  VStack,
} from "@chakra-ui/react";
import { groupBy, map, uniqBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";

export const AddClassTeacher = ({ themeColor, data, closeDrawer }) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          id: data.id,
          staffId: data.staffId,
          classMasterId: data.classMasterId,
          streamMasterId: data.streamMasterId,
          sectionMasterId: data.sectionMasterId,
        }
      : {}
  );

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
    getStaffAction,
    getStaffStatus,
    allStaffs,
    addClassTeachAction,
    addClassTeachStatus,
    updateClassTeachAction,
    updateClassTeachStatus,
    resetClassTeachStatus,
  } = useStaffStore((s) => ({
    getStaffAction: s.getStaffAction,
    getStaffStatus: s.getStaffStatus,
    allStaffs: s.allStaffs,
    addClassTeachAction: s.addClassTeachAction,
    addClassTeachStatus: s.addClassTeachStatus,
    updateClassTeachAction: s.updateClassTeachAction,
    updateClassTeachStatus: s.updateClassTeachStatus,
    resetClassTeachStatus: s.resetClassTeachStatus,
  }));

  useEffect(() => {
    if ((getStaffStatus || 1) === STATUS.NOT_STARTED) {
      getStaffAction();
    }
  }, [getStaffAction, getStaffStatus]);

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
    getSectionStatus,
    getSectionAction,
  ]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);

  const addStaff = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateClassTeachAction(inputValue);
    } else {
      addClassTeachAction(inputValue);
    }
  };

  useEffect(() => {
    if (
      addClassTeachStatus === STATUS.SUCCESS ||
      updateClassTeachStatus === STATUS.SUCCESS
    ) {
      resetClassTeachStatus();
      closeDrawer();
    }
  }, [
    addClassTeachStatus,
    closeDrawer,
    resetClassTeachStatus,
    updateClassTeachStatus,
  ]);

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addStaff}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Class Teacher" : "Add Class Teacher"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomSelect
                size={"sm"}
                name={"staffId"}
                label={"Select Staff"}
                notRequire={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(allStaffs, (d) => ({ value: d.id, name: d.name }))}
              />
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
                    value: d.stream_master?.id,
                    name: d.stream_master.name,
                  })
                )}
              />
              <CustomSelect
                size={"sm"}
                name={"sectionMasterId"}
                label={"Select Section"}
                notRequire={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(allSections, (d) => ({ value: d.id, name: d.name }))}
              />
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              size={"sm"}
              variant="outline"
              mr={3}
              colorScheme={"red"}
              onClick={closeDrawer}
            >
              Cancel
            </Button>
            <Button
              size={"sm"}
              type={"submit"}
              isLoading={
                addClassTeachStatus === STATUS.FETCHING ||
                updateClassTeachStatus === STATUS.FETCHING
              }
              colorScheme={themeColor}
            >
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
