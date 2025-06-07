import CustomInput from "@/common/CustomInput";
import { HasPermission } from "@/common/HasPermission";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { PageHeader } from "@/common/PageHeader";
import { STATUS } from "@/constant";
import { PERMISSIONS } from "@/constant/PermissionConstant";
import { useMobileAppStore } from "@/store/MobileApp";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { map } from "lodash";
import { useEffect, useState } from "react";

export const AppActivation = ({ themeColor, sessionMasterId }) => {
  const [toggleModal, setToggleModal] = useState(null);

  const { getAppActivationAction, getAppActivationStatus, allAppActivations } =
    useMobileAppStore((s) => ({
      getAppActivationAction: s.getAppActivationAction,
      getAppActivationStatus: s.getAppActivationStatus,
      allAppActivations: s.allAppActivations,
    }));

  useEffect(() => {
    if ((getAppActivationStatus || 1) === STATUS.NOT_STARTED) {
      getAppActivationAction({ sessionMasterId });
    }
  }, [getAppActivationAction, getAppActivationStatus, sessionMasterId]);

  return (
    <Box h={"100%"}>
      <PageHeader
        heading={"App Activation"}
        extra={
          HasPermission(PERMISSIONS.ACTIVATED_STUDENT_ADD) && (
            <Button
              mt={2}
              size={"sm"}
              colorScheme={themeColor}
              onClick={() => setToggleModal([])}
            >
              App Activation Request
            </Button>
          )
        }
      />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box
          className="scrollBar"
          h={"100%"}
          maxH={"100%"}
          overflowY={"scroll"}
        >
          <LoadingContainer status={getAppActivationStatus}>
            {allAppActivations?.length ? (
              <TableContainer>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Contact</Th>
                      <Th>Activation Count</Th>
                      <Th>Employee Code</Th>
                      <Th>Requested At</Th>
                      {HasPermission(PERMISSIONS.ACTIVATED_STUDENT_EDIT) && (
                        <Th>Action</Th>
                      )}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(allAppActivations, (req) => (
                      <Tr>
                        <Td>{req.name}</Td>
                        <Td>{req.contact}</Td>
                        <Td>{req.studentCount}</Td>
                        <Td>{req.empCode}</Td>

                        <Td>
                          {req.date
                            ? dayjs(req.date).format("DD-MM-YYYY")
                            : null}
                        </Td>
                        {HasPermission(PERMISSIONS.ACTIVATED_STUDENT_EDIT) && (
                          <Td>
                            <Tooltip placement="top" label="Edit">
                              <IconButton
                                mr={3}
                                size={"sm"}
                                variant={"ghost"}
                                icon={<EditIcon />}
                                colorScheme={themeColor}
                                onClick={() => setToggleModal(req)}
                              />
                            </Tooltip>
                          </Td>
                        )}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <Flex flexDir={"column"} align={"center"} p={5}>
                <NoData title={"No Activation Found"} />
                <Button
                  mt={2}
                  size={"sm"}
                  colorScheme={themeColor}
                  onClick={() => setToggleModal([])}
                >
                  App Activation Request
                </Button>
              </Flex>
            )}
          </LoadingContainer>
        </Box>
        {toggleModal && (
          <AppActivationRequest
            data={toggleModal}
            closeModal={() => setToggleModal(null)}
            sessionMasterId={sessionMasterId}
            themeColor={themeColor}
          />
        )}
      </Box>
    </Box>
  );
};

const AppActivationRequest = ({
  data,
  closeModal,
  sessionMasterId,
  themeColor,
}) => {
  const [inputValue, setInputValue] = useState({});

  useEffect(() => {
    if (data?.id) {
      setInputValue({ studentCount: data.studentCount, empCode: data.empCode });
    } else {
      setInputValue({ studentCount: "" });
    }
  }, [data]);

  const user = getLocalStorageItem("user");

  const {
    addAppActivationAction,
    addAppActivationStatus,
    updateAppActivationAction,
    updateAppActivationStatus,
    resetAppActivationStatus,
  } = useMobileAppStore((s) => ({
    addAppActivationAction: s.addAppActivationAction,
    addAppActivationStatus: s.addAppActivationStatus,
    updateAppActivationAction: s.updateAppActivationAction,
    updateAppActivationStatus: s.updateAppActivationStatus,
    resetAppActivationStatus: s.resetAppActivationStatus,
  }));

  const sendRequest = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateAppActivationAction({
        id: data.id,
        sessionMasterId,
        name: user?.userData?.name,
        contact: user?.userData?.mobileNo,
        ...inputValue,
      });
    } else {
      addAppActivationAction({
        sessionMasterId,
        name: user?.userData?.name,
        contact: user?.userData?.mobileNo,
        ...inputValue,
      });
    }
  };

  useEffect(() => {
    if (
      addAppActivationStatus === STATUS.SUCCESS ||
      updateAppActivationStatus === STATUS.SUCCESS
    ) {
      resetAppActivationStatus();
      setInputValue({ studentCount: "" });
      closeModal();
    }
  }, [
    addAppActivationStatus,
    closeModal,
    resetAppActivationStatus,
    updateAppActivationStatus,
  ]);

  return (
    <Modal isOpen={data} onClose={closeModal}>
      <ModalOverlay />
      <form onSubmit={sendRequest}>
        <ModalContent>
          <ModalHeader>App Activation Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Box mb={3} width={"100%"}>
                <CustomInput
                  type={"number"}
                  name="studentCount"
                  label={"Total Activation Count"}
                  autoFocus={true}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
              </Box>

              {/* <CustomInput
                type={"text"}
                name="empCode"
                label={"Enter Employee Id"}
                autoFocus={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
              /> */}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button size={"sm"} mr={3} onClick={closeModal} variant="ghost">
              Close
            </Button>
            <Button
              size={"sm"}
              type="submit"
              colorScheme={themeColor}
              isLoading={
                addAppActivationStatus === STATUS.FETCHING ||
                updateAppActivationStatus === STATUS.FETCHING
              }
            >
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
