import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Image,
  Grid,
  Icon,
  Text,
  Flex,
} from "@chakra-ui/react";
import { FILE_URL } from "@/services/apis";
import { FaPlay } from "react-icons/fa";

const AlbumModal = ({ isOpen, onClose, data, themeColor, resetData }) => {
  const handleClose = () => {
    onClose(); // Close the modal
    resetData(); // Reset the data
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontWeight={700}>
          Event Name :- {data?.title || "Album"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          className="scrollBar"
          maxH="calc(100vh - 200px)" // Adjust height as needed
          overflowY="auto"
        >
          <Tabs isFitted variant="soft-rounded" colorScheme={themeColor}>
            <TabList mb="1em">
              <Tab>Photos</Tab>
              <Tab>Videos</Tab>
            </TabList>
            <TabPanels>
              {/* Photos Section */}
              <TabPanel>
                <Grid
                  templateColumns="repeat(auto-fill, minmax(120px, 1fr))"
                  gap={4}
                >
                  {data?.album_images?.map((image) => (
                    <Box
                      key={image.id}
                      border="1px solid #e2e2e2"
                      borderRadius="md"
                      overflow="hidden"
                    >
                      <Image
                        src={`${FILE_URL}${image.image}`}
                        alt={`Photo ${image.id}`}
                        objectFit="cover"
                      />
                    </Box>
                  ))}
                </Grid>
              </TabPanel>

              {/* Videos Section */}
              <TabPanel>
                <Grid
                  templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                  gap={4}
                >
                  {data?.album_videos.map((video) => (
                    <Box key={video.id} position="relative">
                      <Box 
                        as="a"
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        display="block"
                        position="relative"
                        width="100%"
                        height="150px"
                        bg="gray.100"
                        borderRadius="md"
                        overflow="hidden"
                      >
                        <Image
                          src={`https://img.youtube.com/vi/${video.url.split('/').pop()?.split('?')[0]}/maxresdefault.jpg`}
                          alt={`Video thumbnail ${video.id}`}
                          fallbackSrc="https://via.placeholder.com/320x180?text=Video+Unavailable"
                          objectFit="cover"
                          width="100%"
                          height="100%"
                        />
                        <Flex
                          position="absolute"
                          top="50%"
                          left="50%"
                          transform="translate(-50%, -50%)"
                          bg="rgba(0,0,0,0.7)"
                          color="white"
                          px={4}
                          py={2}
                          borderRadius="md"
                          alignItems="center"
                          gap={2}
                        >
                          <Icon as={FaPlay} />
                          <Text>Watch on YouTube</Text>
                        </Flex>
                      </Box>
                    </Box>
                  ))}
                </Grid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AlbumModal;
