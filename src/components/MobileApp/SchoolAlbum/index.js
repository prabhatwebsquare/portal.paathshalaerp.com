import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
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
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { FiClock, FiCheckCircle } from "react-icons/fi";
import React, { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { AddAlbum } from "./AddAlbum";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { HasPermission } from "@/common/HasPermission";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { FILE_URL, MANULLAY_BASE_URL } from "@/services/apis";
import { useMobileAppStore } from "@/store/MobileApp";
import { Tooltip } from "@chakra-ui/react";
import axios from "axios";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import AlbumModal from "./AlbumModal";

export const Album = ({ themeColor, sessionMasterId }) => {
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  const {
    getAlbumAction,
    getAlbumStatus,
    allAlbums,
    albumsData, // API to upload files
    getByIdAlbumAction,
    deleteAlbumAction,
  } = useMobileAppStore((s) => ({
    getAlbumAction: s.getAlbumAction,
    getAlbumStatus: s.getAlbumStatus,
    allAlbums: s.allAlbums,
    albumsData: s.albumsData,
    getByIdAlbumAction: s.getByIdAlbumAction,
    deleteAlbumAction: s.deleteAlbumAction,
  }));

  const openUploadModal = (albumId) => {
    setSelectedAlbumId(albumId);
    setIsUploadModalOpen(true);
  };
  const accessToken = getLocalStorageItem("token");
  const uploadFiles = async () => {
    if (!selectedAlbumId) return;

    setIsUploading(true);
    const headers = {
      "Cache-Control": "no-cache",
      "ngrok-skip-browser-warning": "69420",
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + accessToken,
    };
    try {
      if (uploadType === "photo" && uploadedFiles.length > 0) {
        const formData = new FormData();
        uploadedFiles.forEach((file) => formData.append("images", file));
        formData.append("albumId", selectedAlbumId);
        formData.append("sessionMasterId", sessionMasterId);
        try {
          const response = await axios.post(
            `${MANULLAY_BASE_URL}/institute/eventAlbum/images`,
            formData,
            { headers }
          );
          SuccessAlert(response.data?.message);
        } catch (error) {
          ErrorAlert(error?.message);
        }
      } else if (uploadType === "video" && videoLinks.length > 0) {
        const formData = new FormData();
        videoLinks.forEach((link, index) => {
          formData.append(`url[${index}]`, link); // Appending with index
        });
        formData.append("albumId", selectedAlbumId);
        formData.append("sessionMasterId", sessionMasterId);
        try {
          const response = await axios.post(
            `${MANULLAY_BASE_URL}/institute/eventAlbum/videos`,
            formData,
            { headers }
          );
          SuccessAlert(response.data?.message);
        } catch (error) {
          ErrorAlert(error?.message);
        }
      }
      getAlbumAction({
        sessionMasterId,
      });

      closeUploadModal();
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    getAlbumAction({
      sessionMasterId,
    });

    return () => {};
  }, []);

  const [uploadType, setUploadType] = React.useState("photo"); // Tracks current upload type
  const [uploadedFiles, setUploadedFiles] = React.useState([]); // Tracks uploaded files

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (idx) => {
    setUploadedFiles((prev) => prev.filter((_, index) => index !== idx));
  };

  const isValidYouTubeLink = (link) => {
    const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(link);
  };
  const extractYouTubeVideoId = (link) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be\.com\/(?:watch\?v=|v\/|embed\/|user\/))([a-zA-Z0-9_-]{11})/;
    const match = link.match(regex);
    return match ? match[1] : null;
  };
  const [videoLink, setVideoLink] = React.useState("");
  const [videoLinks, setVideoLinks] = React.useState([]);

  const addYouTubeVideo = () => {
    if (isValidYouTubeLink(videoLink)) {
      setVideoLinks((prev) => [...prev, videoLink]);
      setVideoLink(""); // Clear the input field
    }
  };

  const removeYouTubeVideo = (idx) => {
    setVideoLinks((prev) => prev.filter((_, index) => index !== idx));
  };
  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setUploadedFiles([]);
    setVideoLinks([]);
    setSelectedAlbumId(null);
  };
  const [isOpen, setIsOpen] = useState(false);
  const getById = (id) => {
    getByIdAlbumAction({
      id,
      sessionMasterId,
    });
    setIsOpen(true);
  };

  const [data, setData] = useState(null);

  useEffect(() => {
    setData(albumsData);
    return () => {};
  }, [albumsData]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const resetData = () => {
    setData(null); // Reset data when closing the modal
  };

  const deleteAlbum = (id) => {
    deleteAlbumAction(id);
  };
  const [selectedCategory, setSelectedCategory] = React.useState("0"); // Default to "Upcoming Events"

  return (
    <Box>
      <PageHeader
        heading={"Events"}
        extra={
          HasPermission(PERMISSIONS.SCHOOL_ALBUM_ADD) && (
            <Button
              size={"sm"}
              colorScheme={themeColor}
              onClick={() => setToggleDrawer([])}
            >
              Add Event
            </Button>
          )
        }
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box className="scrollBar" h="100%" maxH="100%" overflowY="auto" p={4}>
          <HStack spacing={6} mb={6} justify="center">
            {/* Upcoming Events Button */}
            <Button
              size="lg"
              borderRadius="full"
              w="200px"
              py={6}
              bg={selectedCategory === "0" ? `${themeColor}.500` : "white"}
              color={selectedCategory === "0" ? "white" : `${themeColor}.500`}
              border="2px solid"
              borderColor={
                selectedCategory === "0" ? `${themeColor}.500` : "gray.300"
              }
              shadow="sm"
              transition="all 0.2s"
              _hover={{
                bg: `${themeColor}.100`,
                color: `${themeColor}.800`,
                shadow: "md",
              }}
              onClick={() => setSelectedCategory("0")}
            >
              Upcoming Events
            </Button>

            {/* Past Events Button */}
            <Button
              size="lg"
              borderRadius="full"
              w="200px"
              py={6}
              bg={selectedCategory === "1" ? `${themeColor}.500` : "white"}
              color={selectedCategory === "1" ? "white" : `${themeColor}.500`}
              border="2px solid"
              borderColor={
                selectedCategory === "1" ? `${themeColor}.500` : "gray.300"
              }
              shadow="sm"
              transition="all 0.2s"
              _hover={{
                bg: `${themeColor}.100`,
                color: `${themeColor}.800`,
                shadow: "md",
              }}
              onClick={() => setSelectedCategory("1")}
            >
              Completed Events
            </Button>
          </HStack>

          {/* Albums Section */}
          <LoadingContainer status={getAlbumStatus}>
            {allAlbums?.length ? (
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
                {allAlbums
                  .filter((album) => album.type.toString() === selectedCategory) // Filter by type
                  .map((album) => (
                    <Box
                      key={album?.id}
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      bg="white"
                      shadow="md"
                      transition="transform 0.3s, box-shadow 0.3s"
                      _hover={{
                        transform: "scale(1.03)",
                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      {/* Album Banner */}
                      <Image
                        src={`${FILE_URL}${album?.banner}`}
                        alt={album?.title || "Album Banner"}
                        w="100%"
                        height="150px"
                        objectFit="cover"
                        onClick={() => getById(album.id)}
                        cursor="pointer"
                        transition="opacity 0.2s"
                        _hover={{ opacity: 0.9 }}
                      />

                      {/* Album Info */}
                      <Box px={4} py={3}>
                        {/* Album Details */}
                        <Box>
                          <Text
                            fontWeight="semibold"
                            fontSize="lg"
                            color="blue.600"
                            noOfLines={1}
                          >
                            {album?.title || "Untitled Album"}
                          </Text>
                          <Text fontSize="sm" color="gray.500" mt={1}>
                            Created At:{" "}
                            {new Date(album?.createdAt).toLocaleDateString() ||
                              "N/A"}
                          </Text>
                        </Box>

                        {/* Action Buttons */}
                        <Box
                          mt={3}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          borderTop="1px solid"
                          borderColor="gray.200"
                          pt={3}
                        >
                          {/* Delete Button */}
                          <Tooltip placement="top" label="Delete this album">
                            <IconButton
                              size="sm"
                              icon={<DeleteIcon />}
                              colorScheme="red"
                              variant="outline"
                              _hover={{ bg: "red.50" }}
                              onClick={() => deleteAlbum(album?.id)}
                            />
                          </Tooltip>

                          {/* Add Media Button */}
                          <Button
                            size="sm"
                            px={5}
                            borderRadius="full"
                            colorScheme={themeColor}
                            variant="solid"
                            transition="background-color 0.3s, color 0.3s"
                            _hover={{
                              color: `${themeColor}.900`,
                              bg: `${themeColor}.100`,
                            }}
                            onClick={() => openUploadModal(album?.id)}
                          >
                            + Add Media
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  ))}
              </SimpleGrid>
            ) : (
              <NoData title="No Album Found" />
            )}
          </LoadingContainer>
        </Box>

        {toggleDrawer && (
          <AddAlbum
            data={toggleDrawer}
            closeDrawer={() => setToggleDrawer(null)}
            themeColor={themeColor}
            sessionMasterId={sessionMasterId}
          />
        )}
        <AlbumModal
          themeColor={themeColor}
          isOpen={isOpen}
          onClose={closeModal}
          resetData={resetData}
          data={data}
        />
        {/* Upload Modal */}
        <Modal isOpen={isUploadModalOpen} onClose={closeUploadModal} size="3xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Upload Photos/Videos</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Selection Option */}
              <Box textAlign="center" mb={6}>
                <Text fontSize="lg" mb={2}>
                  What would you like to upload?
                </Text>
                <Button
                  onClick={() => setUploadType("photo")}
                  colorScheme={uploadType === "photo" ? themeColor : "gray"}
                  mr={3}
                >
                  Photos
                </Button>
                <Button
                  onClick={() => setUploadType("video")}
                  colorScheme={uploadType === "video" ? themeColor : "gray"}
                >
                  Videos
                </Button>
              </Box>

              {/* Upload Section */}
              {uploadType === "photo" && (
                <Box
                  p={4}
                  py={8}
                  border="2px dashed"
                  borderColor="gray.300"
                  borderRadius="lg"
                  textAlign="center"
                >
                  <Text fontSize="md" mb={2}>
                    Drag and drop photos here or click to upload
                  </Text>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    display="none"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    colorScheme={themeColor}
                  >
                    Choose Photos
                  </Button>
                </Box>
              )}

              {uploadType === "video" && (
                <Box>
                  {/* Input for YouTube Video Link */}
                  <Box mb={4}>
                    <Text fontSize="md" mb={2}>
                      Enter YouTube Video Link
                    </Text>
                    <Flex gap={2}>
                      <Input
                        placeholder="Paste YouTube video link here..."
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                      />
                      <Button
                        onClick={addYouTubeVideo}
                        colorScheme={themeColor}
                        disabled={!isValidYouTubeLink(videoLink)}
                      >
                        Add Link
                      </Button>
                    </Flex>
                    {!isValidYouTubeLink(videoLink) && videoLink && (
                      <Text fontSize="sm" color="red.500" mt={2}>
                        Please enter a valid YouTube link.
                      </Text>
                    )}
                  </Box>

                  {/* Display Uploaded Video Links */}
                  {videoLinks.length > 0 && (
                    <Box mt={6}>
                      <Flex wrap="wrap" gap={4}>
                        {videoLinks.map((link, idx) => {
                          const videoId = extractYouTubeVideoId(link); // Get video ID
                          return (
                            <Box
                              key={idx}
                              w="150px"
                              h="100px"
                              border="1px solid"
                              borderColor="gray.200"
                              borderRadius="md"
                              overflow="hidden"
                              position="relative"
                              textAlign="center"
                            >
                              {/* YouTube Thumbnail */}
                              {videoId ? (
                                <Image
                                  src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                  alt="YouTube Thumbnail"
                                  objectFit="cover"
                                  w="100%"
                                  h="100%"
                                />
                              ) : (
                                <Text fontSize="xs" color="gray.600">
                                  Invalid Link
                                </Text>
                              )}
                              {/* Remove Button */}
                              <IconButton
                                size="sm"
                                icon={<DeleteIcon />}
                                colorScheme="red"
                                variant="ghost"
                                position="absolute"
                                top={1}
                                right={1}
                                onClick={() => removeYouTubeVideo(idx)}
                              />
                            </Box>
                          );
                        })}
                      </Flex>
                    </Box>
                  )}
                </Box>
              )}

              <Box mt={6}>
                {uploadType === "photo" && uploadedFiles.length > 0 ? (
                  <Box>
                    <Flex wrap="wrap" gap={4}>
                      {uploadedFiles
                        .filter((file) => file.type.startsWith("image"))
                        .map((file, idx) => (
                          <Box
                            key={idx}
                            w="100px"
                            h="100px"
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="md"
                            overflow="hidden"
                            position="relative"
                          >
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              objectFit="cover"
                              w="100%"
                              h="100%"
                            />
                            <IconButton
                              size="sm"
                              icon={<DeleteIcon />}
                              colorScheme="red"
                              variant="ghost"
                              position="absolute"
                              top={1}
                              right={1}
                              onClick={() => removeFile(idx)}
                            />
                          </Box>
                        ))}
                    </Flex>
                  </Box>
                ) : (
                  <Text></Text>
                )}
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme={themeColor}
                onClick={uploadFiles}
                isLoading={isUploading}
              >
                Upload
              </Button>
              <Button ml={3} onClick={closeUploadModal}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};
