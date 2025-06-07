import CustomInput from "@/common/CustomInput";
import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
import { useAppStore } from "@/store/App";
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
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";

export const AddTeacherNotice = ({
  themeColor,
  sessionMasterId,
  type,
  data,
  closeDrawer,
}) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          orderNo: data.orderNo,
          id: data.id,
        }
      : {
          isClass: "0",
          isStudent: "0",
          date: dayjs().format("YYYY-MM-DD"),
        }
  );

  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val }));
  };

  const {
    addNoticeBoardAction,
    addNoticeBoardStatus,
    updateNoticeBoardAction,
    updateNoticeBoardStatus,
    resetNoticeBoardStatus,
    allNoticeBoards
  } = useAppStore((s) => ({
    addNoticeBoardAction: s.addNoticeBoardAction,
    addNoticeBoardStatus: s.addNoticeBoardStatus,
    updateNoticeBoardAction: s.updateNoticeBoardAction,
    updateNoticeBoardStatus: s.updateNoticeBoardStatus,
    resetNoticeBoardStatus: s.resetNoticeBoardStatus,
    allNoticeBoards :s.allNoticeBoards
  }));

  useEffect(() => {
    if (allNoticeBoards?.length > 0 && !data?.id) {
      const maxOrderNo = Math.max(...allNoticeBoards.map((c) => c.orderNo));
      setInputValue((prev) => ({...prev, orderNo: maxOrderNo + 1 }));
    }
  
    return () => {
      
    }
  }, [allNoticeBoards])
  const inputRef = useRef();
  const labelClick = () => {
    inputRef.current.click();
  };

  const selectedFile = (file) => {
    if (file?.length) {
      setInputValue((pre) => ({ ...pre, file: file[0] }));
    }
  };

  const addNoticeBoard = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateNoticeBoardAction(inputValue);
    } else {
      addNoticeBoardAction({
        sessionMasterId,
        ...inputValue,
      });
    }
  };

  useEffect(() => {
    if (
      addNoticeBoardStatus === STATUS.SUCCESS ||
      updateNoticeBoardStatus === STATUS.SUCCESS
    ) {
      resetNoticeBoardStatus();
      closeDrawer();
    }
  }, [
    addNoticeBoardStatus,
    closeDrawer,
    resetNoticeBoardStatus,
    updateNoticeBoardStatus,
  ]);

  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addNoticeBoard}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Teacher Notice" : "Add Teacher Notice"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"date"}
                name="date"
                label={"Date"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                type={"text"}
                name="subject"
                label={"Subject"}
                inputValue={inputValue}
                autoFocus={true}
                setInputValue={setInputValue}
              />
              <CustomTextarea
                type={"text"}
                name="message"
                label={"Message"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <Flex
                w={"100%"}
                border={"1px solid"}
                borderColor={"gray.200"}
                p={2}
                borderRadius={5}
                onClick={labelClick}
              >
                <Text
                  pr={3}
                  borderRight={"1px solid"}
                  borderColor={"gray.200"}
                  fontWeight={"semibold"}
                >
                  Choose File
                </Text>
                <Text ml={3}>
                  {inputValue?.file?.name
                    ? inputValue.file.name
                    : "Select a file"}
                </Text>
              </Flex>
              <Input
                type="file"
                ref={inputRef}
                display={"none"}
                onChange={(e) => selectedFile(e.target.files)}
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
            <Button size={"sm"} type={"submit"} colorScheme={themeColor}>
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
