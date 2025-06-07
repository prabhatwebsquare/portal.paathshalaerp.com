import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { STATUS } from "@/constant";
import { FILE_URL } from "@/services/apis";
import { useMobileAppStore } from "@/store/MobileApp";
import { useTransportStore } from "@/store/Transport";
import { AddIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Image,
  Input,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

export const AddAlbum = ({
  data,
  closeDrawer,
  themeColor,
  sessionMasterId,
}) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          id: data.id,
          type: data.type,
          sessionMasterId,
        }
      : { sessionMasterId }
  );

  const {
    addAlbumAction,
    addAlbumStatus,
    updateAlbumAction,
    updateAlbumStatus,
    resetStatus,
  } = useMobileAppStore((s) => ({
    addAlbumAction: s.addAlbumAction,
    addAlbumStatus: s.addAlbumStatus,
    updateAlbumAction: s.updateAlbumAction,
    updateAlbumStatus: s.updateAlbumStatus,
    resetStatus: s.resetStatus,
  }));

  const addAlbum = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateAlbumAction(inputValue);
    } else {
      addAlbumAction(inputValue, sessionMasterId);
    }
  };

  useEffect(() => {
    if (
      addAlbumStatus === STATUS.SUCCESS ||
      updateAlbumStatus === STATUS.SUCCESS
    ) {
      resetStatus();
      closeDrawer();
    }
  }, [addAlbumStatus, closeDrawer, resetStatus, updateAlbumStatus]);

  const inputRef = useRef(null);
  const [stdPhoto, setStdPhoto] = useState(null);
  const labelClick = () => {
    inputRef.current.click();
  };

  const selectedFile = (file) => {
    setInputValue((pre) => ({ ...pre, banner: file }));
    setStdPhoto(file);
  };

  return (
    <Drawer isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addAlbum}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Event" : "Add New Event"}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={3}>
              <CustomInput
                type={"text"}
                name="title"
                label={"Event Name"}
                autoFocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomSelect
                size={"sm"}
                name={"type"}
                label={"Select Type"}
                notRequire={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[
                  { name: "Upcoming Event", value: "0" },
                  { name: "Completed Event", value: "1" },
                ]}
              />
              <CustomInput
                type={"date"}
                name="date"
                label={"Event Date  "}
                autoFocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <>
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius={5}
                  p={4}
                  gap={4}
                  w="full"
                  cursor="pointer"
                  onClick={() => inputRef.current?.click()} // Trigger file input
                >
                  {/* Display Banner Image or Placeholder */}
                  {stdPhoto || inputValue?.banner ? (
                    <Image
                      src={
                        stdPhoto
                          ? URL.createObjectURL(stdPhoto)
                          : `${FILE_URL}${inputValue?.banner}`
                      }
                      alt="Uploaded Banner"
                      width="full"
                      height="200px"
                      objectFit="cover"
                      borderRadius={5}
                      border="2px solid"
                      borderColor={`${themeColor}.400`}
                    />
                  ) : (
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      height="200px"
                      width="full"
                      borderRadius={5}
                      border="2px dashed"
                      borderColor="gray.300"
                      bg="gray.50"
                      color="gray.500"
                      textAlign="center"
                    >
                      <Text fontSize="md" fontWeight="medium">
                        Click to Upload Banner
                      </Text>
                      <Text fontSize="sm">
                        Accepted formats: JPG, PNG, JPEG
                      </Text>
                    </Flex>
                  )}
                </Flex>

                <Input
                  ref={inputRef}
                  id="photo"
                  type="file"
                  accept="image/*"
                  display="none"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      selectedFile(file);
                      setStdPhoto(file);
                    }
                  }}
                />
              </>
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
                addAlbumStatus === STATUS.FETCHING ||
                updateAlbumStatus === STATUS.FETCHING
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
