import { FILE_URL } from "@/services/apis";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { Box, Button, Flex, Image, Input, Text } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";

export const UploadFile = ({
  studentPic,
  w,
  type,
  data,
  accept,
  inputValue,
  setInputValue,
  setPicture,
}) => {
  const fileRef = useRef(null);

  const selectFile = () => {
    fileRef.current.click();
  };

  const inputFileHandler = (file) => {
    if (file?.length) {
      setInputValue((pre) => ({ ...pre, [data?.name]: file[0] }));
      if (studentPic) {
        setPicture({
          srNo: data.name,
          photo: file[0],
        });
      }
    }
  };

  const deleteFile = () => {
    setInputValue((pre) => ({ ...pre, [data?.name]: "" }));
  };
  const themeColor = getLocalStorageItem("themeColor") || "blue";
  return (
    <Box mt={0} w={w || "100%"} align="center">
      <Text fontWeight={"semibold"}>{data?.label}</Text>
      {inputValue?.[data?.name] ? (
        <Box
          h={"150px"}
          mt={3}
          w="100%"
          py={3}
          border={"2px dashed"}
          borderColor={`${themeColor}.500`}
          borderRadius={5}
          color={`${themeColor}.500`}
        >
          {type === "file" ? (
            <Image h="70%" src={"/assets/file.png"} alt={data.label} />
          ) : (
            <Image
              h="70%"
              src={
                inputValue?.[data?.name]?.name
                  ? URL.createObjectURL(inputValue?.[data?.name])
                  : `${FILE_URL}${inputValue?.[data?.name]}`
              }
              alt={data.label}
            />
          )}
          <Flex mt={2} justify={"center"} gap={4}>
            <Button size="xs" colorScheme={themeColor} onClick={selectFile}>
              Replace
            </Button>
            <Button size="xs" colorScheme={"red"} onClick={deleteFile}>
              Delete
            </Button>
          </Flex>
        </Box>
      ) : (
        <Box
          h={"150px"}
          mt={3}
          w="100%"
          py={3}
          border={"2px dashed"}
          borderColor={`${themeColor}.500`}
          borderRadius={5}
          color={`${themeColor}.500`}
        >
          <MdOutlineFileUpload fontSize={32} />
          <Button
            mt={2}
            size="xs"
            px={6}
            colorScheme={themeColor}
            onClick={selectFile}
          >
            Browse
          </Button>
          <Text mt={1} fontSize={11} color={"gray.300"}>
            Upload Your File Here
          </Text>
          <Flex mt={2} w="fit-content">
            <Text color="red">*</Text>
            <Text fontSize={11} color={"gray.800"} fontWeight={"semibold"}>
              File supported .png, .jpg & .webp
            </Text>
          </Flex>
        </Box>
      )}
      <Input
        type="file"
        display={"none"}
        accept={accept === "all" ? "" : "image/*"}
        ref={fileRef}
        onChange={(e) => inputFileHandler(e.target.files)}
      />
    </Box>
  );
};
