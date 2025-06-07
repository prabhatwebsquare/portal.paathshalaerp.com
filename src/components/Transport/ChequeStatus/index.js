import CustomInput from "@/common/CustomInput"
import { PageHeader } from "@/common/PageHeader"
import { STATUS } from "@/constant"
import { useClassSetupStore } from "@/store/classSetup"
import { useStdFeesStore } from "@/store/stdFees"
import { Box, Button, Flex, IconButton, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Select, Table, TableContainer, Tag, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react"
import dayjs from "dayjs"
import { filter, find, groupBy, map, uniqBy } from "lodash"
import { useEffect, useMemo, useState } from "react"
import { MdCurrencyRupee, MdLocalPrintshop } from "react-icons/md"
import { GrUpdate } from "react-icons/gr"
import { useAdditionalSetupStore } from "@/store/additionalSetup"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { LoadingContainer } from "@/common/LoadingContainer"
import { ChequeStatusUpdate } from "@/components/fees/ChequeStatusUpdate"
import { ReceiptDrawer } from "@/components/fees/ReceiptDrawer"
import { NoData } from "@/common/NoData"
import { CustomSelect } from "@/common/CustomSelect"
import { HasPermission } from "@/common/HasPermission"
import { PERMISSIONS } from "@/constant/PermissionConstant"

export const TransportChequeStatus = ({ themeColor, sessionMasterId }) => {
    const [inputValue, setInputValue] = useState({ chequeDate: dayjs().format("YYYY-MM-DD"), chequeStatus: "Collected" })
    const [toggleModal, setToggleModal] = useState(null)
    const [toggleReceiptModal, setToggleReceiptModal] = useState(null)
    const school = useMemo(() => (getLocalStorageItem("user")), [])

    const inputHandler = (name, val) => {
        setInputValue(pre => ({ ...pre, [name]: val }))
    }

    const { getChequeListAction, getChequeListStatus, chequeList,
        getFeesReceiptAction, getFeesReceiptStatus, feeReceiptData, resetFeesReceipt
    } = useStdFeesStore(s => ({
        getChequeListAction: s.getChequeListAction,
        getChequeListStatus: s.getChequeListStatus,
        chequeList: s.chequeList,
        getFeesReceiptAction: s.getFeesReceiptAction,
        getFeesReceiptStatus: s.getFeesReceiptStatus,
        feeReceiptData: s.feeReceiptData,
        resetFeesReceipt: s.resetFeesReceipt
    }))

    const { getBankAction, getBankStatus, allBanks } = useAdditionalSetupStore(s => ({
        getBankAction: s.getBankAction,
        getBankStatus: s.getBankStatus,
        allBanks: s.allBanks
    }))

    useEffect(() => {
        if ((getBankStatus || 1) === STATUS.NOT_STARTED) {
            getBankAction()
        }
    }, [getBankAction, getBankStatus])

    useEffect(() => {
        if ((getChequeListStatus || 1) === STATUS.NOT_STARTED) {
            getChequeListAction({
                sessionMasterId,
                feesMode: 2,
                chequeDate: dayjs().format("YYYY-MM-DD"),
                chequeStatus: "Collected"
            })
        }
    }, [getChequeListAction, getChequeListStatus, sessionMasterId])

    const getChequeData = (e) => {
        e.preventDefault()
        getChequeListAction({
            sessionMasterId,
            feesMode: 2,
            ...inputValue
        })
    }

    const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } = useClassSetupStore(s => ({
        getClassSubjectAction: s.getClassSubjectAction,
        getClassSubjectStatus: s.getClassSubjectStatus,
        allClassSubjects: s.allClassSubjects
    }))

    useEffect(() => {
        if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
            getClassSubjectAction()
        }
    }, [getClassSubjectAction, getClassSubjectStatus])

    const classes = useMemo(() => {
        return groupBy(allClassSubjects, "classMasterId")
    }, [allClassSubjects])

    const streamSec = useMemo(() => {
        return filter(classes?.[inputValue?.classMasterId], c => c.streamMasterId === parseInt(inputValue?.streamMasterId))
    }, [classes, inputValue?.classMasterId, inputValue?.streamMasterId])

    const secSub = useMemo(() => {
        return find(classes?.[inputValue?.classMasterId], c => c.streamMasterId === parseInt(inputValue?.streamMasterId) && c.sectionMasterId === parseInt(inputValue?.sectionMasterId))
    }, [classes, inputValue?.classMasterId, inputValue?.sectionMasterId, inputValue?.streamMasterId])

    const receiptData = (data, promotionId) => {
        getFeesReceiptAction({
            sessionMasterId,
            schoolCode: school?.schoolData?.schoolCode,
            promotionId,
            feesReportId: data?.feesReportId
        })
        setToggleModal(null)
    }
    const resetAllData = () => {
    }

    useEffect(() => {
        if (getFeesReceiptStatus === STATUS.SUCCESS) {
            resetFeesReceipt()
            setToggleReceiptModal(feeReceiptData)
        }
    }, [feeReceiptData, getFeesReceiptStatus, resetFeesReceipt])

    const receiptPrint = (data) => {
        getFeesReceiptAction({
            sessionMasterId,
            schoolCode: school?.schoolData?.schoolCode,
            promotionId: data?.promotionId,
            feesReportId: data?.id
        })
    }
    return (
        <Box h="100%">
            <PageHeader heading={"Cheque Status"} />
            <Box p={5} bg={"white"} h={"90%"}>
                <form onSubmit={getChequeData}>
                    <Flex pb={3} gap={4} w={"80%"}>
                        <Flex w={"110%"}>
                            <CustomInput w={"110%"} type={"date"} size={"sm"} name="chequeDate" label={"Cheque Date"} inputValue={inputValue} setInputValue={setInputValue} />
                        </Flex>
                        {/* <CustomInput type={"name"} size={"sm"} name="search" label={"Cheque Date"} inputValue={inputValue} setInputValue={setInputValue} /> */}
                        {/* <Select
                            size={"sm"}
                            fontSize={13}
                            fontWeight={"semibold"}
                            focusBorderColor={`${themeColor}.400`}
                            placeholder="Select Class"
                            value={inputValue?.classMasterId}
                            onChange={(e) => inputHandler("classMasterId", e.target.value)}
                        >
                            {map(classes, (d, key) => (
                                <option value={key}>{d?.[0]?.class_master?.name}</option>
                            ))}
                        </Select>
                        <Select
                            size={"sm"}
                            fontSize={13}
                            fontWeight={"semibold"}
                            focusBorderColor={`${themeColor}.400`}
                            placeholder="Select Stream"
                            value={inputValue?.streamMasterId}
                            onChange={(e) => inputHandler("streamMasterId", e.target.value)}
                        >
                            {map(uniqBy(classes?.[inputValue?.classMasterId], "streamMasterId"), (d, index) => (
                                <option value={d.stream_master.id}>{d.stream_master.name}</option>
                            ))}
                        </Select>
                        <Select
                            size={"sm"}
                            fontSize={13}
                            fontWeight={"semibold"}
                            focusBorderColor={`${themeColor}.400`}
                            placeholder="Select Section"
                            value={inputValue?.sectionMasterId}
                            onChange={(e) => inputHandler("sectionMasterId", e.target.value)}
                        >
                            {map(uniqBy(streamSec, "sectionMasterId"), (d, index) => (
                                <option value={d.section_master.id}>{d.section_master.name}</option>
                            ))}
                        </Select> */}
                        <CustomSelect size={"sm"} name={"chequeStatus"} label={"Select Status"} notRequire={true} inputValue={inputValue} setInputValue={setInputValue} data={[
                            { name: "Collected", value: "Collected" },
                            { name: "Deposit Into Bank", value: "Deposit Into Bank" },
                            { name: "Cleared", value: "Cleared" },
                            { name: "Bounce", value: "Bounce" },
                            { name: "Cancelled", value: "Cancelled" },
                        ]} />
                        <Button colorScheme={themeColor} size={"sm"} type="submit">Get</Button>
                    </Flex>
                </form>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <LoadingContainer status={getChequeListStatus}>
                        {chequeList?.length ?
                            <TableContainer>
                                <Table w="100%" size={"sm"} variant={"simple"}>
                                    <Thead>
                                        <Tr bg="gray.100">
                                            <Th>Sr No.</Th>
                                            <Th>Name</Th>
                                            <Th>Father Name</Th>
                                            <Th>Contact</Th>
                                            <Th>Class</Th>
                                            <Th>Cheque Bank</Th>
                                            <Th>Cheque Details</Th>
                                            <Th>Amount</Th>
                                            <Th>Status</Th>
                                            <Th>Action</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {map(chequeList, cheq => (
                                            <Tr _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                                                <Td>{cheq.student_master?.srNo}</Td>
                                                <Td>{cheq.student_master?.studentName}</Td>
                                                <Td>{cheq.student_master?.fatherName}</Td>
                                                <Td>{cheq.student_master?.fatherContact}</Td>
                                                <Td>{cheq.class_master?.name} - {cheq.stream_master.name}</Td>
                                                <Td>{cheq.bank}</Td>
                                                <Td>{cheq.chequeNo} / {cheq.chequeDate ? dayjs(cheq.chequeDate).format("DD-MM-YYYY") : ""}</Td>
                                                <Td isNumeric><Flex justify={"flex-end"} align="center"><MdCurrencyRupee />{cheq.totalAmount}</Flex></Td>
                                                <Td>
                                                    {(cheq.chequeStatus === "Collected" || cheq.chequeStatus === "Cancelled") ?
                                                        <Tag colorScheme={cheq.chequeStatus === "Collected" ? "teal" : "red"}>{cheq.chequeStatus}</Tag>
                                                        :
                                                        <Popover placement="left">
                                                            <PopoverTrigger bg={themeColor}>
                                                                <Tag
                                                                    colorScheme={
                                                                        cheq.chequeStatus === "Collected" ? "teal"
                                                                            : cheq.chequeStatus === "Deposit Into Bank" ? "yellow"
                                                                                : cheq.chequeStatus === "Cleared" ? "green"
                                                                                    : "red"
                                                                    }>
                                                                    {cheq.chequeStatus}
                                                                </Tag>
                                                            </PopoverTrigger>
                                                            <PopoverContent bg={`${themeColor}.100`}>
                                                                <PopoverArrow bg={`${themeColor}.100`} />
                                                                <PopoverCloseButton />
                                                                <PopoverHeader>Deposite Bank!</PopoverHeader>
                                                                <PopoverBody>
                                                                    <Box fontSize={14} fontWeight={"semibold"}>
                                                                        <Flex>
                                                                            <Text w={"20%"}>Bank: </Text>
                                                                            <Text ml={2}>{cheq?.bank_master?.name}</Text>
                                                                        </Flex>
                                                                        <Flex mt={1}>
                                                                            <Text w={"20%"}>Acc. No.: </Text>
                                                                            <Text ml={2}>{cheq?.bank_master?.accountNumber}</Text>
                                                                        </Flex>
                                                                    </Box>
                                                                </PopoverBody>
                                                            </PopoverContent>
                                                        </Popover>
                                                    }
                                                    {(cheq.chequeStatus === "Collected" || cheq.chequeStatus === "Deposit Into Bank") ?
                                                        HasPermission(PERMISSIONS.TRANS_CHEQUE_STATUS_EDIT) &&
                                                        <IconButton ml={1} size={"xs"} variant={"ghost"} colorScheme={themeColor} onClick={() => setToggleModal(cheq)} icon={<GrUpdate />} />
                                                        :
                                                        null
                                                    }
                                                </Td>
                                                <Td>
                                                    <Tooltip placement="top" label={"Print Receipt"}>
                                                        <IconButton
                                                            ml={2}
                                                            size="xs"
                                                            variant={"ghost"}
                                                            colorScheme={themeColor}
                                                            icon={<MdLocalPrintshop fontSize={18} />}
                                                            onClick={() => receiptPrint(cheq)}
                                                        />
                                                    </Tooltip>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            :
                            <NoData title={"No Cheque Found"} />
                        }
                    </LoadingContainer>
                    {toggleModal && <ChequeStatusUpdate allBanks={allBanks} data={toggleModal} receiptData={receiptData} sessionMasterId={sessionMasterId} themeColor={themeColor} closeModal={() => setToggleModal(null)} />}
                    {toggleReceiptModal && <ReceiptDrawer themeColor={themeColor} feeReceiptData={feeReceiptData} closeModal={() => setToggleReceiptModal(null)} resetAllData={resetAllData} />}
                </Box>
            </Box>
        </Box>
    )
}