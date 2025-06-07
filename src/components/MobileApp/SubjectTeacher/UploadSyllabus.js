import { UploadFile } from "@/common/UploadFile";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BsUpload } from "react-icons/bs";

export const UploadSyllabus = ({ data, closeModal, themeColor }) => {
  const [inputValue, setInputValue] = useState([{}, {}]);
  const inputRef = useRef(null);

  const labelClick = () => {
    inputRef.current.click();
  };

  const selectedFile = (file) => {
    if (file?.length) {
      setInputValue((pre) => ({ ...pre, file: file[0] }));
    }
  };

  const upload = () => {};
  return (
    <Modal size={"lg"} isOpen={data} isCentered onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Syllabus</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* <Box mb={4} px={4} py={2} border={"1px solid"} borderColor={"gray.200"} borderRadius={10}>
                        <Flex justify={"space-between"} align={"center"}>
                            <Text fontSize={18} fontWeight={"semibold"}>Hindi</Text>
                            <IconButton size={"sm"} variant={"outline"} icon={<BsUpload fontSize={16} />} colorScheme={themeColor} onClick={labelClick} />
                        </Flex>
                        {inputValue?.file ?
                            <Flex borderTop={"1px solid"} borderColor={"gray.200"} >
                                <Image h={"100px"} src="/assets/file.png" alt={"Syllabus"} />
                            </Flex>
                            :
                            null
                        }
                    </Box>
                    <Box mb={4}>
                        <Flex px={4} py={2} justify={"space-between"} align={"center"} border={"1px solid"} borderColor={"gray.200"} borderRadius={10}>
                            <Text fontSize={18} fontWeight={"semibold"}>Hindi</Text>
                            <IconButton size={"sm"} variant={"outline"} icon={<BsUpload fontSize={16} />} colorScheme={themeColor} onClick={labelClick} />
                        </Flex>
                    </Box> */}
          <Flex flexWrap={"wrap"}>
            <UploadFile
              w="50%"
              type={"file"}
              data={{ label: "Hindi", name: "hindi" }}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
            <UploadFile
              w="50%"
              type={"file"}
              data={{ label: "English", name: "English" }}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
          </Flex>
          <Input
            type="file"
            ref={inputRef}
            accept="image/*"
            display={"none"}
            onChange={(e) => selectedFile(e.target.files)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            variant={"outline"}
            colorScheme={"blue"}
            mr={3}
            onClick={closeModal}
          >
            Close
          </Button>
          <Button size="sm" colorScheme={themeColor} onClick={upload}>
            Upload
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
