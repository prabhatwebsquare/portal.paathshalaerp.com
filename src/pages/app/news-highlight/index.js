import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Button,
  Textarea,
  VStack,
  HStack,
  IconButton,
  Text,
  useToast,
  useColorModeValue,
  Input,
  Select,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useMemo, useState } from "react";
import { MainLayout } from "@/layout/MainLayout";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { useClassSetupStore } from "@/store/classSetup";

import "react-datepicker/dist/react-datepicker.css"; // Style for the date picker
import { STATUS } from "@/constant";

const NewsHighlightPage = () => {
  const [newsData, setNewsData] = useState({
    Student: { id: "", text: "", expDate: new Date(), status: "1" },
    Teacher: { id: "", text: "", expDate: new Date(), status: "1" },
  });
  const [currentTab, setCurrentTab] = useState("Student");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
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

  const handleSave = async () => {
    const { id, text, expDate, status } = newsData[currentTab];

    // Validation logic
    if (!text.trim()) {
      toast({
        title: "Error saving news.",
        description: "News text is required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!expDate || isNaN(new Date(expDate).getTime())) {
      toast({
        title: "Error saving news.",
        description: "A valid expiration date is required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!status) {
      toast({
        title: "Error saving news.",
        description: "Status is required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);

    const data = {
      id,
      type: currentTab,
      text,
      expDate,
      status,
      postType: "news",
    };

    try {
      if (id) {
        // Edit existing record
        await addHighlightAction(data); // Assuming this handles both add and edit logic
      } else {
        // Add new record
        const newData = { ...data, id: undefined }; // Ensure `id` is not included for new records
        await addHighlightAction(newData);
      }
      setIsEditing(false);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (addHighlightStatus === STATUS.SUCCESS) {
      setIsEditing(false);
    }
    return () => {};
  }, [addHighlightStatus]);

  useEffect(() => {
    if (currentTab == "Student") {
      setNewsData((prev) => ({
        ...prev,
        Student: {
          id: allHighlight?.id || "",
          text: allHighlight?.text || "",
          expDate: allHighlight?.expDate || "",
          status: allHighlight?.status || "",
        },
      }));
      setNewsData((prev) => ({
        ...prev,
        Teacher: {},
      }));
    } else if (currentTab == "Teacher") {
      setNewsData((prev) => ({
        ...prev,
        Student: {},
      }));
      setNewsData((prev) => ({
        ...prev,
        Teacher: {
          id: Number(allHighlight?.id),
          text: allHighlight?.text || "",
          expDate: allHighlight?.expDate || "",
          status: allHighlight?.status || "",
        },
      }));
    }
    {
    }
  }, [allHighlight]);

  useEffect(() => {
    getHighlightAction({
      type: currentTab,
      postType: "news",
    });
    return () => {};
  }, [currentTab]);

  const handleDelete = (id) => {
    deletehighlightAction(id);
    setNewsData((prev) => ({
      ...prev,
      [currentTab]: { text: "", expDate: "", status: 1 },
    }));
    // setIsEditing(false);
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancle = async () => {
    await getHighlightAction({
      type: currentTab,
      postType: "news",
    });
    setIsEditing(false);
  };

  const handleTabChange = (index) => {
    setCurrentTab(index === 0 ? "Student" : "Teacher");
    setIsEditing(false);
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
          <TabList>
            <Tab>Student News</Tab>
            <Tab>Teacher News</Tab>
          </TabList>

          <TabPanels>
            {["Student", "Teacher"].map((type, index) => (
              <TabPanel key={`${type}-${index}`}>
                <NewsTabContent
                  news={newsData[type]}
                  setNews={(value) =>
                    setNewsData((prev) => ({ ...prev, [type]: value }))
                  }
                  isEditing={isEditing}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  handleCancle={handleCancle}
                  onSave={handleSave}
                  loading={loading}
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

const NewsTabContent = ({
  news,
  setNews,
  isEditing,
  onEdit,
  onDelete,
  onSave,
  loading,
  cardBg,
  placeholderBg,
  themeColor,
  handleCancle,
}) => {
  const formatDate = (isoDate) => {
    return isoDate ? isoDate.split("T")[0] : ""; // Extract only the date part
  };

  return (
    <VStack align="stretch" spacing={4}>
      {news.text && !isEditing ? (
        <Box
          p={4}
          bg={cardBg}
          borderRadius="md"
          border="1px solid"
          borderColor={`${themeColor}.300`}
          shadow="sm"
        >
          <Text fontWeight={400} color={"gray.600"} mb={2}>
            {news.text}
          </Text>
          <Text fontWeight={600} color={"gray.600"}>
            Expiration Date: {new Date(news.expDate).toLocaleDateString()}
          </Text>
          <Text fontWeight={600} color={"gray.600"}>
            Status: {news.status == 0 ? "InActive" : "Active"}
          </Text>
          <HStack justify="flex-end">
            <IconButton
              icon={<EditIcon />}
              onClick={onEdit}
              size="sm"
              colorScheme={themeColor}
              aria-label="Edit News"
            />
            <IconButton
              icon={<DeleteIcon />}
              onClick={() => onDelete(news.id)}
              size="sm"
              colorScheme="red"
              aria-label="Delete News"
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
          onClick={onEdit}
        >
          {isEditing ? (
            <VStack spacing={4}>
              <Textarea
                placeholder="Write your news..."
                value={news.text}
                onChange={(e) => setNews({ ...news, text: e.target.value })} // Preserve other fields
                focusBorderColor={`${themeColor}.500`}
              />
              <Input
                type="date"
                value={formatDate(news.expDate)} // Convert to YYYY-MM-DD format
                onChange={(e) => setNews({ ...news, expDate: e.target.value })}
              />

              <Select
                value={Number(news.status)}
                onChange={(e) => setNews({ ...news, status: e.target.value })} // Preserve other fields
                focusBorderColor={`${themeColor}.500`}
              >
                <option value={""}>Select Status</option>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </Select>
            </VStack>
          ) : (
            <Text textAlign="center" color="gray.500">
              Click to add news...
            </Text>
          )}
        </Box>
      )}

      {isEditing && (
        <Flex justify="flex-end">
          <Button
            colorScheme={themeColor}
            onClick={onSave}
            isLoading={loading}
            disabled={loading}
          >
            Save
          </Button>
          <Button
            ml={2}
            colorScheme="gray"
            onClick={() => {
              handleCancle();
            }}
            disabled={loading}
          >
            Cancel
          </Button>
        </Flex>
      )}
    </VStack>
  );
};

export default NewsHighlightPage;
