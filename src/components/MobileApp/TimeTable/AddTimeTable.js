import { useEffect, useMemo, useRef, useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Button,
  Input,
  Box,
  Stack,
  Text,
  Icon,
  Flex,
} from "@chakra-ui/react";
import CustomInput from "@/common/CustomInput";
import CustomTextarea from "@/common/CustomTextarea";
import { CustomSelect } from "@/common/CustomSelect";
import { useClassSetupStore } from "@/store/classSetup";
import { groupBy, map, uniqBy } from "lodash";
import { STATUS } from "@/constant";
import { FiFileText, FiUpload } from "react-icons/fi";
import { ErrorAlert } from "@/utils/Helper";

export const AddPopUpAlert = ({
  themeColor,
  data,
  closeDrawer,
  handleAddOrEdit,
}) => {
  const [inputValue, setInputValue] = useState(
    data.id
      ? {
          classMasterId: data.classMasterId,
          file: data.file,
          id: data.id,
          title: data.title,
          streamMasterId: data.streamMasterId,
          description: data.description,
        }
      : {}
  );

  const inputRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (stdPhoto ? !stdPhoto.name : !inputValue?.file) {
      ErrorAlert("Please Upload PDF");
      return;
    }
    handleAddOrEdit(inputValue);
  };
  const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } =
    useClassSetupStore((s) => ({
      getClassSubjectAction: s.getClassSubjectAction,
      getClassSubjectStatus: s.getClassSubjectStatus,
      allClassSubjects: s.allClassSubjects,
    }));
  useEffect(() => {
    if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
      getClassSubjectAction();
    }
  }, [getClassSubjectAction, getClassSubjectStatus]);

  const classes = useMemo(() => {
    return groupBy(allClassSubjects, "classMasterId");
  }, [allClassSubjects]);
  const [stdPhoto, setStdPhoto] = useState(null);
  const selectedFile = (file) => {
    setInputValue((prev) => ({ ...prev, file: file }));
    setStdPhoto(file);
  };
  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {data?.id ? "Edit Time Table" : "Add Time Table"}
        </DrawerHeader>

        <form onSubmit={handleSubmit}>
          <DrawerBody>
            <Stack spacing={3}>
              <CustomInput
                type={"text"}
                name={"title"}
                label={"Title"}
                autoFocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />

              <CustomTextarea
                w={"100%"}
                rows={3}
                type={"text"}
                notRequire={false}
                name="description"
                label={"Description"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomSelect
                notRequire={false}
                size={"md"}
                name={"classMasterId"}
                label={"Select Class"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(classes, (d, key) => ({
                  value: key,
                  name: d?.[0]?.class_master?.name,
                }))}
              />
              <CustomSelect
                size={"md"}
                name={"streamMasterId"}
                label={"Select Stream"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(
                  uniqBy(
                    classes?.[inputValue?.classMasterId],
                    "streamMasterId"
                  ),
                  (d) => ({
                    value: d.stream_master?.id,
                    name: d.stream_master.name,
                  })
                )}
              />
              <Flex
                direction="column"
                align="center"
                justify="center"
                w="100%"
                onClick={() => inputRef.current?.click()}
                p={4}
              >
                {/* Display PDF Info or Placeholder */}
                {stdPhoto || inputValue?.file ? (
                  <Box
                    p={4}
                    bg={`${themeColor}.50`}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={`${themeColor}.300`}
                    textAlign="center"
                    w="100%"
                  >
                    <Icon
                      as={FiFileText}
                      boxSize={12}
                      color={themeColor}
                      mb={3}
                    />
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color={`${themeColor}.600`}
                    >
                      {stdPhoto ? stdPhoto.name : inputValue?.file}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      PDF file uploaded successfully
                    </Text>
                  </Box>
                ) : (
                  <Box
                    p={6}
                    bg="gray.50"
                    borderRadius="md"
                    border="2px dashed"
                    borderColor="gray.300"
                    textAlign="center"
                    _hover={{
                      bg: "gray.100",
                      borderColor: `${themeColor}.400`,
                    }}
                    w="100%" // Ensures the Box takes full width
                  >
                    <Icon
                      as={FiUpload}
                      boxSize={10}
                      color={themeColor}
                      mb={4}
                    />
                    <Text fontSize="lg" fontWeight="medium" color="gray.600">
                      Click to Upload PDF
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      Only PDF files are accepted
                    </Text>
                  </Box>
                )}

                {/* Hidden File Input */}
                <Input
                  ref={inputRef}
                  id="pdf-upload"
                  type="file"
                  display="none"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      selectedFile(file);
                    }
                  }}
                />
              </Flex>
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button size={"sm"} variant="outline" mr={3} onClick={closeDrawer}>
              Cancel
            </Button>
            <Button size={"sm"} type="submit" colorScheme={themeColor}>
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
