import CustomInput from "@/common/CustomInput";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { STATUS } from "@/constant";
import { useStdFeesStore } from "@/store/stdFees";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { map } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaFemale, FaMale } from "react-icons/fa";
import { PiArrowBendDownLeftBold } from "react-icons/pi";

export const SearchStudent = ({
  data,
  closeModal,
  sessionMasterId,
  themeColor,
}) => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState({});
  const [currIndex, setCurrentIndex] = useState(0);
  const {
    searchLedStudentAction,
    searchLedStudentStatus,
    searchLedStd,
    resetSearch,
  } = useStdFeesStore((s) => ({
    searchLedStudentAction: s.searchLedStudentAction,
    searchLedStudentStatus: s.searchLedStudentStatus,
    searchLedStd: s.searchLedStd,
    resetSearch: s.resetSearch,
  }));

  const handleSearchInput = (val) => {
    setSearchInput({ filters: val });
    if (val?.length >= 1) {
      setCurrentIndex(0);
      searchLedStudentAction({
        sessionMasterId,
        search: val,
      });
    }
  };

  useEffect(() => {
    return () => resetSearch();
  }, [resetSearch]);

  const close = () => {
    resetSearch();
    setSearchInput({ filters: "" });
    closeModal();
  };

  const userProfile = (id) => {
    router.push(`/student/profile?id=${id}`);
    close();
  };

  return (
    <Modal size={"2xl"} isOpen={data} onClose={close}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Box h={searchLedStd?.length ? "70vh" : "fit-content"}>
            <InputGroup bg={"white"} py={2}>
              <InputLeftElement>
                <SearchIcon boxSize={5} mt={7} color="gray.300" />
              </InputLeftElement>
              <Input
                type="text"
                color={"blue.800"}
                variant={"ghost"}
                fontWeight={"bold"}
                placeholder="Search Student"
                value={searchInput.filters}
                onChange={(e) => handleSearchInput(e.target.value)}
              />
              {/* <CustomInput type={"text"} search={true} name="filters" label={"Search Student"} inputValue={searchInput} setInputValue={handleSearchInput} /> */}
            </InputGroup>
            <LoadingContainer status={searchLedStudentStatus}>
              {searchLedStd?.length ? (
                <Box
                  h={searchLedStd?.length ? "80%" : "fit-content"}
                  borderTop={"1px solid"}
                  borderColor={"gray.200"}
                  className="scrollBar"
                  maxH={searchLedStd?.length ? "80%" : "fit-content"}
                  overflowY={"scroll"}
                >
                  {map(searchLedStd, (std, index) => (
                    <Flex
                      mt={3}
                      py={2}
                      px={3}
                      align={"center"}
                      borderRadius={7}
                      cursor={"pointer"}
                      bg={
                        currIndex === index ? `${themeColor}.500` : "gray.100"
                      }
                      color={currIndex === index ? "white" : null}
                      onMouseEnter={() => setCurrentIndex(index)}
                      onClick={() => userProfile(std.promotionId)}
                    >
                      <Avatar
                        mr={3}
                        size={"md"}
                        src={std.student_master.photo}
                      />
                      <Box w={"45%"}>
                        <Text fontWeight={"semibold"}>
                          {std.student_master.studentName}
                        </Text>
                        <Flex>
                          <Text fontSize={13}>
                            {std.class_master.name} - {std.stream_master.name}
                          </Text>
                          <Text ml={3} fontSize={13}>
                            {std.student_master.srNo}
                          </Text>
                        </Flex>
                      </Box>
                      <Box w={"45%"}>
                        <Flex align={"center"}>
                          <FaMale color="#0055FF" />
                          <Text ml={1} fontSize={14} fontWeight={"semibold"}>
                            {std.student_master.fatherName}
                          </Text>
                        </Flex>
                        <Flex align={"center"}>
                          <FaFemale color="#FF15CC" />
                          <Text ml={1} fontSize={14} fontWeight={"semibold"}>
                            {std.student_master.motherName}
                          </Text>
                        </Flex>
                      </Box>
                      <PiArrowBendDownLeftBold />
                    </Flex>
                  ))}
                </Box>
              ) : searchLedStudentStatus === STATUS.SUCCESS ? (
                <NoData title={"No Student Found"} />
              ) : // <Image src="/assets/notfound.json" />
              // <Lottie options={defaultOptions} height={400} width={400} />
              null}
            </LoadingContainer>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
