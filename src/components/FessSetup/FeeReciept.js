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
  import "react-datepicker/dist/react-datepicker.css"; // Style for the date picker
  import { STATUS } from "@/constant";
import { MainLayout } from "@/layout/MainLayout";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { useClassSetupStore } from "@/store/classSetup";
  

export const FeeReciept  = () => {
    const [newsData, setNewsData] = useState({
      FeeRecieptNotes: { id: "", text: "",  },
      TransportFeeRecieptNotes: { id: "", text: "", },
    });
    const [currentTab, setCurrentTab] = useState("FeeRecieptNotes");
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
      const { id, text,  } = newsData[currentTab];

      if (!text.trim()) {
        toast({
          title: "Error saving news.",
          description: "Reciept text is required.",
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
      if (currentTab == "FeeRecieptNotes") {
        setNewsData((prev) => ({
          ...prev,
          FeeRecieptNotes: {
            id: allHighlight?.id || "",
            text: allHighlight?.text || "",
          },
        }));
        setNewsData((prev) => ({
          ...prev,
          TransportFeeRecieptNotes: {},
        }));
      } else if (currentTab == "TransportFeeRecieptNotes") {
        setNewsData((prev) => ({
          ...prev,
          FeeRecieptNotes: {},
        }));
        setNewsData((prev) => ({
          ...prev,
          TransportFeeRecieptNotes: {
            id: Number(allHighlight?.id),
            text: allHighlight?.text || "",

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
        [currentTab]: { text: "",  },
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
      setCurrentTab(index === 0 ? "FeeRecieptNotes" : "TransportFeeRecieptNotes");
      setIsEditing(false);
    };
    const themeColor = useMemo(() => getLocalStorageItem("themeColor"), []);
    const cardBg = useColorModeValue("white", "gray.700");
    const placeholderBg = useColorModeValue("gray.100", "gray.600");
  
    return (
        <Box p={0}>
          <Tabs
            onChange={handleTabChange}
            variant="soft-rounded"
            isFitted
            colorScheme={themeColor}
          >
            <TabList>
              <Tab>Fee Reciept Notes</Tab>
              <Tab>Tranport Fee Reciept Notes</Tab>
            </TabList>
  
            <TabPanels>
              {["FeeRecieptNotes", "TransportFeeRecieptNotes"].map((type, index) => (
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
            <HStack justify="flex-end">
              <IconButton
                icon={<EditIcon />}
                onClick={onEdit}
                size="sm"
                colorScheme={themeColor}
                aria-label="Edit Reciept"
              />
              <IconButton
                icon={<DeleteIcon />}
                onClick={() => onDelete(news.id)}
                size="sm"
                colorScheme="red"
                aria-label="Delete Reciept"
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
                  placeholder="Write your reciept..."
                  value={news.text}
                  onChange={(e) => setNews({ ...news, text: e.target.value })} // Preserve other fields
                  focusBorderColor={`${themeColor}.500`}
                />
              </VStack>
            ) : (
              <Text textAlign="center" color="gray.500">
                Click to add reciept...
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

  
  
  