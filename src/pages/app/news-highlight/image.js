import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Button,
  VStack,
  HStack,
  IconButton,
  Image,
  Text,
  useToast,
  useColorModeValue,
  Input,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useMemo, useState } from "react";
import { MainLayout } from "@/layout/MainLayout";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { useClassSetupStore } from "@/store/classSetup";
import { STATUS } from "@/constant";
import { FILE_URL } from "@/services/apis";

const NewsImageUploadPage = () => {
  const [imageData, setImageData] = useState({
    Student: { id: "", image: null },
    Teacher: { id: "", image: null },
  });
  const [currentTab, setCurrentTab] = useState("Student");
  const [isUploading, setIsUploading] = useState(false);
  const {
    addHighlightAction,
    allHighlight,
    addHighlightStatus,
    getHighlightAction,
    deletehighlightAction,
    deleteHighlightStatus,
  } = useClassSetupStore((s) => ({
    addHighlightAction: s.addHighlightAction,
    allHighlight: s.allHighlight,
    addHighlightStatus: s.addHighlightStatus,
    getHighlightAction: s.getHighlightAction,
    deletehighlightAction: s.deletehighlightAction,
    deleteHighlightStatus: s.deleteHighlightStatus,
  }));
  const toast = useToast();

  const handleUpload = async (file) => {
    setIsUploading(true);
    setImageData((prev) => ({
      ...prev,
      [currentTab]: { image: URL.createObjectURL(file) },
    }));
    const { id } = imageData[currentTab];
    const data = { id, type: currentTab, image: file, postType: "image" };
    if (id) {
      await addHighlightAction(data);
    } else {
      const newData = { ...data, id: undefined };
      await addHighlightAction(newData);
    }
    getHighlightAction({
      type: currentTab,
      postType: "image",
    });
  };

  useEffect(() => {
    if (addHighlightStatus === STATUS.SUCCESS) {
      setIsUploading(false);
    }
    return () => {};
  }, [addHighlightStatus]);

  useEffect(() => {
    if (currentTab == "Student") {
      setImageData((prev) => ({
        ...prev,
        Student: {
          id: allHighlight?.id || "",
          image: allHighlight?.image,
        },
      }));
      setImageData((prev) => ({
        ...prev,
        Teacher: {},
      }));
    } else if (currentTab == "Teacher") {
      setImageData((prev) => ({
        ...prev,
        Student: {},
      }));
      setImageData((prev) => ({
        ...prev,
        Teacher: {
          id: Number(allHighlight?.id),
          image: allHighlight.image,
        },
      }));
    }
    {
    }
  }, [allHighlight]);

  useEffect(() => {
    getHighlightAction({
      type: currentTab,
      postType: "image",
    });
    return () => {};
  }, [currentTab]);

  const handleDelete = (id) => {
    deletehighlightAction(id);
    setImageData((prev) => ({
      ...prev,
      [currentTab]: { id: "", image: null },
    }));
  };

  const handleTabChange = (index) => {
    setCurrentTab(index === 0 ? "Student" : "Teacher");
  };

  const themeColor = useMemo(() => getLocalStorageItem("themeColor"), []);
  const cardBg = useColorModeValue("white", "gray.700");
  const placeholderBg = useColorModeValue("gray.100", "gray.600");

  return (
    <MainLayout>
      <Box p={4}>
        <Tabs
          onChange={handleTabChange}
          variant="soft-rounded"
          isFitted
          colorScheme={themeColor}
        >
          <TabList mb={10}>
            <Tab>Student</Tab>
            <Tab>Teacher</Tab>
          </TabList>

          <TabPanels>
            {["Student", "Teacher"].map((type) => (
              <TabPanel key={type}>
                <ImageUploadContent
                  image={imageData[type]}
                  onUpload={handleUpload}
                  onDelete={handleDelete}
                  isUploading={isUploading}
                  cardBg={cardBg}
                  placeholderBg={placeholderBg}
                  themeColor={themeColor}
                />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
    </MainLayout>
  );
};

const ImageUploadContent = ({
  image,
  onUpload,
  onDelete,
  isUploading,
  cardBg,
  placeholderBg,
  themeColor,
}) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <VStack align="stretch" spacing={4}>
      {image.image ? (
        <Box
          p={4}
          bg={cardBg}
          borderRadius="lg"
          border="1px solid"
          borderColor={`${themeColor}.300`}
          shadow="lg"
          position="relative"
          overflow="hidden"
          _hover={{
            transform: "scale(1.02)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            shadow: "xl",
          }}
        >
          {/* Decorative Overlay */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="linear-gradient(180deg, transparent 70%, rgba(0,0,0,0.4) 100%)"
            zIndex="1"
            borderRadius="lg"
          />

          <Image
            src={isUploading ? image.image : FILE_URL + image.image}
            alt="Uploaded Preview"
            borderRadius="md"
            maxH="65vh"
            objectFit="cover"
            w="100%"
          />
          <HStack
            position="absolute"
            bottom="4"
            right="4"
            zIndex="2"
            justify="flex-end"
          >
            <IconButton
              icon={<DeleteIcon />}
              onClick={() => onDelete(image.id)}
              size="md"
              bg="rgba(255, 0, 0, 0.8)"
              _hover={{ bg: "red.600" }}
              _active={{ bg: "red.700" }}
              color="white"
              borderRadius="full"
              shadow="md"
              aria-label="Delete Image"
            />
          </HStack>
        </Box>
      ) : (
        <Box
          p={4}
          bg={placeholderBg}
          borderRadius="md"
          border="1px dashed"
          borderColor={`${themeColor}.300`}
          cursor="pointer"
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="150px"
        >
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            opacity="0"
            position="absolute"
            left="0"
            width="100%"
            height="100%"
            cursor="pointer"
          />
          <Text color="gray.500" textAlign="center">
            Click to upload an image...
          </Text>
        </Box>
      )}
    </VStack>
  );
};

export default NewsImageUploadPage;
