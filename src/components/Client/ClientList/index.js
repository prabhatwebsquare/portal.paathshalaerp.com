import CustomInput from "@/common/CustomInput";
import { DeleteButton } from "@/common/DeleteButton";
import { PageHeader } from "@/common/PageHeader";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
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
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { IoEyeOutline } from "react-icons/io5";
import { ClientProfile } from "./ClientProfile";
import { ClientViewPlan } from "./ClientViewPlan";
import { useClientStore } from "@/store/client";
import { STATUS } from "@/constant";
import { CgProfile } from "react-icons/cg";
import { LoadingContainer } from "@/common/LoadingContainer";
import { NoData } from "@/common/NoData";
import { EditClient } from "./EditClient";
import { GrPowerReset } from "react-icons/gr";
import Pagination from "@/common/Pagination";
import { CustomSelect } from "@/common/CustomSelect";
import { ActivateGateway } from "./ActivateGateway";
import { MdOutlinePayment } from "react-icons/md";

export const ClientList = ({ themeColor }) => {
  const [toggleEditDrawer, setToggleEditDrawer] = useState(null);
  const [toggleGateway, setToggleGateway] = useState(null);
  const [toggleViewPlans, setToggleViewPlans] = useState(null);
  const [toggleProfile, setToggleProfile] = useState(null);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState({ search: "", status: 1 });

  const {
    getClientRegAction,
    getClientRegStatus,
    allClientRegs,
    resetGetClientStatus,
    deleteClientRegAction,
    deleteClientRegStatus,
    resetClientRegStatus,
    updateExpiryDateAction,
    updateExpiryDateStatus,
    updateExpiryDate,
  } = useClientStore((s) => ({
    getClientRegAction: s.getClientRegAction,
    getClientRegStatus: s.getClientRegStatus,
    allClientRegs: s.allClientRegs,
    resetGetClientStatus: s.resetGetClientStatus,
    deleteClientRegAction: s.deleteClientRegAction,
    deleteClientRegStatus: s.deleteClientRegStatus,
    resetClientRegStatus: s.resetClientRegStatus,
    updateExpiryDateAction: s.updateExpiryDateAction,
    updateExpiryDateStatus: s.updateExpiryDateStatus,
    updateExpiryDate: s.updateExpiryDate,
  }));

  useEffect(() => {
    if ((getClientRegStatus || 1) === STATUS.NOT_STARTED) {
      getClientRegAction({ page: 1, limit: 10, ...inputValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getClientRegAction, getClientRegStatus]);

  useEffect(() => {
    if (currentPage && limit)
      getClientRegAction({
        page: currentPage,
        limit: parseInt(limit),
        ...inputValue,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, getClientRegAction, limit]);

  const getClients = () => {
    setCurrentPage(1);
    getClientRegAction({ page: 1, limit: 10, ...inputValue });
  };

  const reset = () => {
    setCurrentPage(1);
    setInputValue({ search: "", status: 1 });
    getClientRegAction({ page: 1, limit: 10, search: "", status: 1 });
  };

  useEffect(() => {
    return () => resetGetClientStatus();
  }, [resetGetClientStatus]);

  const deleteClientReg = (id) => {
    deleteClientRegAction(id);
  };

  const [toggleUpdateExpDate, setToggleUpdateExpDate] = useState(null);
  const [newExpDate, setNewExpDate] = useState("");
  const [newAppExpDate, setNewAppExpDate] = useState("");
  const [expDateError, setExpDateError] = useState("");
  const [appExpDateError, setAppExpDateError] = useState("");

  const handleSave = async () => {
    let hasError = false;

    if (!newExpDate) {
      setExpDateError("Expiry date is required.");
      hasError = true;
    } else {
      setExpDateError("");
    }

    if (hasError) return;
  await  updateExpiryDateAction({
      expDate: newExpDate,
      id: toggleUpdateExpDate.id,
    });
    await setNewExpDate("");
    await setNewAppExpDate("");
    await setToggleUpdateExpDate(null);
    getClientRegAction({ page: 1, limit: 10, search: "", status: 1 });
  };
  return (
    <Box h={"100%"}>
      <PageHeader heading={"Orgnization List"} />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <Flex w={"100%"} justify={"space-between"} my={4} align={"center"}>
            <Flex w={"65%"} gap={3}>
              <CustomInput
                w={"40%"}
                size={"sm"}
                type={"text"}
                notRequire={true}
                name="search"
                label={"Search By School Name/Contact"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomSelect
                w={"30%"}
                size={"sm"}
                name={"status"}
                label={"Select Status"}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[
                  { name: "Review", value: "0" },
                  { name: "Active", value: "1" },
                  { name: "Renew", value: "2" },
                  { name: "Deactive", value: "3" },
                ]}
              />
              <Button
                size={"sm"}
                colorScheme={themeColor}
                isDisabled={
                  inputValue?.search || inputValue?.status ? false : true
                }
                onClick={getClients}
              >
                Get
              </Button>
              <Button size={"sm"} leftIcon={<GrPowerReset />} onClick={reset}>
                Reset
              </Button>
            </Flex>
            <Pagination
              totalItems={allClientRegs?.allCount}
              limit={limit}
              setLimit={setLimit}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              themeColor={themeColor}
            />
          </Flex>
          <LoadingContainer status={getClientRegStatus}>
            {allClientRegs?.data?.length ? (
              <TableContainer
                borderRadius="lg"
                boxShadow="md"
                borderWidth={1}
                borderColor="gray.200"
                bg="white"
                overflowX="auto" // Ensures responsiveness for smaller screens
              >
                <Table size="md" variant="simple">
                  <Thead>
                    <Tr bg={`${themeColor}.100`}>
                      <Th
                        color={`${themeColor}.800`}
                        fontSize="sm"
                        fontWeight="bold"
                        py={4}
                        borderBottomWidth={2}
                        borderColor={`${themeColor}.200`}
                        textTransform="uppercase"
                      >
                        S. No.
                      </Th>
                      <Th
                        color={`${themeColor}.800`}
                        fontSize="sm"
                        fontWeight="bold"
                        py={4}
                        borderBottomWidth={2}
                        borderColor={`${themeColor}.200`}
                        textTransform="uppercase"
                      >
                        School/Institute
                      </Th>
                      <Th
                        color={`${themeColor}.800`}
                        fontSize="sm"
                        fontWeight="bold"
                        py={4}
                        borderBottomWidth={2}
                        borderColor={`${themeColor}.200`}
                        textTransform="uppercase"
                      >
                        School Contact
                      </Th>
                      <Th
                        color={`${themeColor}.800`}
                        fontSize="sm"
                        fontWeight="bold"
                        py={4}
                        borderBottomWidth={2}
                        borderColor={`${themeColor}.200`}
                        textTransform="uppercase"
                      >
                        Name
                      </Th>
                      <Th
                        color={`${themeColor}.800`}
                        fontSize="sm"
                        fontWeight="bold"
                        py={4}
                        borderBottomWidth={2}
                        borderColor={`${themeColor}.200`}
                        textTransform="uppercase"
                      >
                        Contact
                      </Th>
                      <Th
                        color={`${themeColor}.800`}
                        fontSize="sm"
                        fontWeight="bold"
                        py={4}
                        borderBottomWidth={2}
                        borderColor={`${themeColor}.200`}
                        textTransform="uppercase"
                      >
                        City
                      </Th>
                      <Th
                        color={`${themeColor}.800`}
                        fontSize="sm"
                        fontWeight="bold"
                        py={4}
                        borderBottomWidth={2}
                        borderColor={`${themeColor}.200`}
                        textTransform="uppercase"
                      >
                        Active Date
                      </Th>
                      <Th
                        color={`${themeColor}.800`}
                        fontSize="sm"
                        fontWeight="bold"
                        py={4}
                        borderBottomWidth={2}
                        borderColor={`${themeColor}.200`}
                        textTransform="uppercase"
                      >
                        Renew Date
                      </Th>
                      <Th
                        color={`${themeColor}.800`}
                        fontSize="sm"
                        fontWeight="bold"
                        py={4}
                        borderBottomWidth={2}
                        borderColor={`${themeColor}.200`}
                        textTransform="uppercase"
                      >
                        Org. Code
                      </Th>
                      <Th
                        color={`${themeColor}.800`}
                        fontSize="sm"
                        fontWeight="bold"
                        py={4}
                        borderBottomWidth={2}
                        borderColor={`${themeColor}.200`}
                        textTransform="uppercase"
                      >
                        Password
                      </Th>
                      <Th
                        color={`${themeColor}.800`}
                        fontSize="sm"
                        fontWeight="bold"
                        py={4}
                        borderBottomWidth={2}
                        borderColor={`${themeColor}.200`}
                        textTransform="uppercase"
                      >
                        Plan Status
                      </Th>
                      <Th
                        color={`${themeColor}.800`}
                        fontSize="sm"
                        fontWeight="bold"
                        py={4}
                        borderBottomWidth={2}
                        borderColor={`${themeColor}.200`}
                        textTransform="uppercase"
                      >
                        App Status
                      </Th>
                      <Th
                        color={`${themeColor}.800`}
                        fontSize="sm"
                        fontWeight="bold"
                        py={4}
                        borderBottomWidth={2}
                        borderColor={`${themeColor}.200`}
                        textTransform="uppercase"
                      >
                        Payment Gateway Status
                      </Th>
                      <Th
                        position="sticky"
                        right="0"
                        zIndex="10"
                        bg={`${themeColor}.100`}
                        color={`${themeColor}.800`}
                        fontSize="sm"
                        fontWeight="bold"
                        py={4}
                        borderBottomWidth={2}
                        borderColor={`${themeColor}.200`}
                        textTransform="uppercase"
                      >
                        Action
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {map(allClientRegs.data, (client, index) => (
                      <Tr
                        key={index}
                        _hover={{
                          bg: `${themeColor}.50`,
                          transition: "all 0.2s",
                        }}
                        cursor="pointer"
                        bg={index % 2 === 0 ? "white" : "gray.50"} // Alternating row colors
                      >
                        <Td py={3} fontSize="sm" color="gray.700">
                          {index + 1}
                        </Td>
                        <Td py={3} fontSize="sm" color="gray.700">
                          <Flex align="center">
                            <Avatar size="xs" mr={2} bg={`${themeColor}.200`} />
                            <Box fontWeight="medium">{client?.schoolName}</Box>
                          </Flex>
                        </Td>
                        <Td py={3} fontSize="sm" color="gray.700">
                          {client?.contactNo}
                        </Td>
                        <Td py={3} fontSize="sm" color="gray.700">
                          {client?.name}
                        </Td>
                        <Td py={3} fontSize="sm" color="gray.700">
                          {client?.mobileNo}
                        </Td>
                        <Td py={3} fontSize="sm" color="gray.700">
                          {client?.district}
                        </Td>
                        <Td py={3} fontSize="sm" color="gray.700">
                          {client?.date
                            ? dayjs(client?.date).format("DD-MM-YYYY")
                            : "-"}
                        </Td>
                        <Td py={3} fontSize="sm" color="gray.700">
                          <Flex align="center">
                            {client?.expDate
                              ? dayjs(client?.expDate).format("DD-MM-YYYY")
                              : "-"}
                            <Tooltip
                              label="Update Expiry Date"
                              aria-label="Update Expiry Date"
                            >
                              <IconButton
                                icon={<EditIcon />}
                                size="sm"
                                ml={2}
                                onClick={() => {
                                  setToggleUpdateExpDate(client);
                                  setNewExpDate(
                                    dayjs(client?.expDate).format("YYYY-MM-DD")
                                  );
                                }}
                                variant="ghost"
                                colorScheme="blue"
                                aria-label="Edit Expiry Date"
                                _hover={{ bg: `${themeColor}.100` }}
                              />
                            </Tooltip>
                          </Flex>
                        </Td>
                        <Td py={3} fontSize="sm" color="gray.700">
                          {client?.schoolCode}
                        </Td>
                        <Td py={3} fontSize="sm" color="gray.700">
                          {client?.authCode || "N/A"}
                        </Td>
                        <Td py={3} fontSize="sm">
                          {client.status === 0 ? (
                            <Badge
                              variant="solid"
                              fontSize={11}
                              fontWeight="medium"
                              colorScheme="yellow"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              Review
                            </Badge>
                          ) : client.status === 1 ? (
                            <Badge
                              variant="solid"
                              fontSize={11}
                              fontWeight="medium"
                              colorScheme="green"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              Active
                            </Badge>
                          ) : client.status === 2 ? (
                            <Badge
                              variant="solid"
                              fontSize={11}
                              fontWeight="medium"
                              colorScheme="orange"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              Renew
                            </Badge>
                          ) : (
                            <Badge
                              variant="solid"
                              fontSize={11}
                              fontWeight="medium"
                              colorScheme="red"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              Deactive
                            </Badge>
                          )}
                        </Td>
                        <Td py={3} fontSize="sm">
                          {client.status === 0 ? (
                            <Badge
                              variant="solid"
                              fontSize={11}
                              fontWeight="medium"
                              colorScheme="yellow"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              Review
                            </Badge>
                          ) : client.status === 1 ? (
                            <Badge
                              variant="solid"
                              fontSize={11}
                              fontWeight="medium"
                              colorScheme="green"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              Active
                            </Badge>
                          ) : client.status === 2 ? (
                            <Badge
                              variant="solid"
                              fontSize={11}
                              fontWeight="medium"
                              colorScheme="orange"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              Renew
                            </Badge>
                          ) : (
                            <Badge
                              variant="solid"
                              fontSize={11}
                              fontWeight="medium"
                              colorScheme="red"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              Deactive
                            </Badge>
                          )}
                        </Td>
                        <Td py={3} fontSize="sm">
                          {client.status === 0 ? (
                            <Badge
                              variant="solid"
                              fontSize={11}
                              fontWeight="medium"
                              colorScheme="yellow"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              Review
                            </Badge>
                          ) : client.status === 1 ? (
                            <Badge
                              variant="solid"
                              fontSize={11}
                              fontWeight="medium"
                              colorScheme="green"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              Active
                            </Badge>
                          ) : client.status === 2 ? (
                            <Badge
                              variant="solid"
                              fontSize={11}
                              fontWeight="medium"
                              colorScheme="orange"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              Renew
                            </Badge>
                          ) : (
                            <Badge
                              variant="solid"
                              fontSize={11}
                              fontWeight="medium"
                              colorScheme="red"
                              px={2}
                              py={1}
                              borderRadius="md"
                            >
                              Deactive
                            </Badge>
                          )}
                        </Td>
                        <Td
                          position="sticky"
                          right="0"
                          zIndex="10"
                          bg={index % 2 === 0 ? "white" : "gray.50"}
                          _hover={{ bg: `${themeColor}.50` }}
                          py={3}
                        >
                          <Flex gap={1} justify="center">
                            <Tooltip placement="top" label="View Plans">
                              <IconButton
                                size="sm"
                                variant="ghost"
                                icon={<IoEyeOutline fontSize={17} />}
                                onClick={() => setToggleViewPlans(client)}
                                colorScheme="blue"
                                _hover={{
                                  bg: `${themeColor}.100`,
                                  color: `${themeColor}.700`,
                                }}
                                transition="all 0.2s"
                              />
                            </Tooltip>
                            <Tooltip placement="top" label="View Profile">
                              <IconButton
                                size="sm"
                                variant="ghost"
                                icon={<CgProfile />}
                                onClick={() => setToggleProfile(client)}
                                colorScheme="green"
                                _hover={{
                                  bg: `${themeColor}.100`,
                                  color: `${themeColor}.700`,
                                }}
                                transition="all 0.2s"
                              />
                            </Tooltip>
                            <Tooltip placement="top" label="Edit">
                              <IconButton
                                size="sm"
                                variant="ghost"
                                icon={<EditIcon />}
                                onClick={() => setToggleEditDrawer(client)}
                                colorScheme="blue"
                                _hover={{
                                  bg: `${themeColor}.100`,
                                  color: `${themeColor}.700`,
                                }}
                                transition="all 0.2s"
                              />
                            </Tooltip>
                            <Tooltip
                              placement="top"
                              label="Activate Payment Gateway"
                            >
                              <IconButton
                                size="sm"
                                variant="ghost"
                                icon={<MdOutlinePayment fontSize={17} />}
                                onClick={() => setToggleGateway(client)}
                                colorScheme="blue"
                                _hover={{
                                  bg: `${themeColor}.100`,
                                  color: `${themeColor}.700`,
                                }}
                                transition="all 0.2s"
                              />
                            </Tooltip>
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <NoData title={"No Client Found"} />
            )}
            {/* Rest of your modal and drawer components remain unchanged */}
            {toggleUpdateExpDate && (
              <Modal
                isOpen={toggleUpdateExpDate}
                onClose={() => setToggleUpdateExpDate(null)}
                isCentered
                motionPreset="slideInBottom"
              >
                <ModalOverlay bg="rgba(0, 0, 0, 0.4)" />
                <ModalContent
                  bg="white"
                  borderRadius="xl"
                  boxShadow="xl"
                  p={4}
                  maxW="md"
                  borderWidth={1}
                  borderColor="gray.100"
                >
                  <ModalHeader
                    fontSize="xl"
                    fontWeight="bold"
                    color="blue.700"
                    textAlign="center"
                    py={3}
                  >
                    Update Expiry Date
                  </ModalHeader>
                  <ModalCloseButton
                    size="lg"
                    color="gray.500"
                    _hover={{ color: "gray.700", bg: "gray.100" }}
                    borderRadius="full"
                  />
                  <ModalBody>
                    <VStack spacing={6}>
                      <FormControl isInvalid={!!expDateError}>
                        <FormLabel
                          fontSize="md"
                          fontWeight="medium"
                          color="gray.700"
                          mb={2}
                        >
                          Select ERP Expiry Date
                        </FormLabel>
                        <Input
                          type="date"
                          value={newExpDate}
                          // min={dayjs().add(1, "day").format("YYYY-MM-DD")}
                          onChange={(e) => {
                            setNewExpDate(e.target.value);
                            if (e.target.value) setExpDateError("");
                          }}
                          size="lg"
                          bg="gray.50"
                          borderColor="gray.300"
                          focusBorderColor="blue.500"
                          borderRadius="md"
                          _hover={{ borderColor: "gray.400" }}
                          transition="all 0.2s"
                          placeholder="Select date"
                        />
                        {expDateError && (
                          <FormErrorMessage
                            mt={2}
                            color="red.500"
                            fontSize="sm"
                          >
                            {expDateError}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </VStack>
                  </ModalBody>
                  <ModalFooter justifyContent="center" pt={6} pb={4}>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      onClick={handleSave}
                      size="lg"
                      px={8}
                      borderRadius="md"
                      boxShadow="sm"
                      _hover={{
                        boxShadow: "md",
                        transform: "translateY(-2px)",
                      }}
                      _active={{ transform: "translateY(0)" }}
                      transition="all 0.2s"
                    >
                      Update
                    </Button>
                    <Button
                      variant="outline"
                      colorScheme="gray"
                      onClick={() => {
                        setToggleUpdateExpDate(null);
                        setNewExpDate("");
                        setNewAppExpDate("");
                      }}
                      size="lg"
                      px={8}
                      borderRadius="md"
                      _hover={{ bg: "gray.100", color: "gray.800" }}
                      transition="all 0.2s"
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            )}
            {toggleViewPlans && (
              <ClientViewPlan
                data={toggleViewPlans}
                closeDrawer={() => setToggleViewPlans(null)}
                themeColor={themeColor}
              />
            )}
            {toggleProfile && (
              <ClientProfile
                data={toggleProfile}
                closeDrawer={() => setToggleProfile(null)}
                themeColor={themeColor}
                isForViewOnly={true}
              />
            )}
          </LoadingContainer>
          {toggleEditDrawer && (
            <EditClient
              data={toggleEditDrawer}
              closeDrawer={() => setToggleEditDrawer(null)}
              themeColor={themeColor}
            />
          )}
          {toggleGateway && (
            <ActivateGateway
              data={toggleGateway}
              closeModal={() => setToggleGateway(null)}
              themeColor={themeColor}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
