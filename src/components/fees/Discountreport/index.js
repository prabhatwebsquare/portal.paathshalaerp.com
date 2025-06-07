import { ConfirmAlert } from "@/common/ConfirmationAlert"
import CustomInput from "@/common/CustomInput"
import { CustomSelect } from "@/common/CustomSelect"
import { LoadingContainer } from "@/common/LoadingContainer"
import { NoData } from "@/common/NoData"
import { PageHeader } from "@/common/PageHeader"
import { STATUS } from "@/constant"
import { useClassSetupStore } from "@/store/classSetup"
import { useStdFeesStore } from "@/store/stdFees"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { CheckIcon, CloseIcon } from "@chakra-ui/icons"
import { Badge, Box, Button, Flex, IconButton, Image, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react"
import dayjs from "dayjs"
import { groupBy, map, uniqBy } from "lodash"
import { useEffect, useMemo, useState } from "react"
import { MdCurrencyRupee } from "react-icons/md"

export const DiscountReport = ({ themeColor, sessionMasterId }) => {
    const [inputValue, setInputValue] = useState({ startDate: dayjs().format("YYYY-MM-DD"), endDate: dayjs().format("YYYY-MM-DD") })

    const inputHandler = (name, val) => {
        setInputValue(pre => ({ ...pre, [name]: val }))
    }

    const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } = useClassSetupStore(s => ({
        getClassSubjectAction: s.getClassSubjectAction,
        getClassSubjectStatus: s.getClassSubjectStatus,
        allClassSubjects: s.allClassSubjects
    }))

    const { getDiscountAction, getDiscountStatus, allDiscounts, resetDiscountData } = useStdFeesStore(s => ({
        getDiscountAction: s.getDiscountAction,
        getDiscountStatus: s.getDiscountStatus,
        allDiscounts: s.allDiscounts,
        resetDiscountData: s.resetDiscountData,
    }))

    useEffect(() => {
        if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
            getClassSubjectAction()
        }
        if ((getDiscountStatus || 1) === STATUS.NOT_STARTED) {
            getDiscountAction({
                sessionMasterId,
                feesMode: 1,
                date: dayjs().format("YYYY-MM-DD")
            })
        }
    }, [getDiscountAction, getDiscountStatus, getClassSubjectAction, getClassSubjectStatus, sessionMasterId])

    useEffect(() => {
        return () => resetDiscountData()
    }, [resetDiscountData])

    const classes = useMemo(() => {
        return groupBy(allClassSubjects, "classMasterId")
    }, [allClassSubjects])

    const getReport = (e) => {
        e.preventDefault()
        getDiscountAction({
            ...inputValue,
            feesMode: 1,
            sessionMasterId
        })
    }

    return (
        <Box h="100%">
            <PageHeader heading={"Discount Report"} />
            <Box p={5} bg={"white"} h={"90%"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <form onSubmit={getReport}>
                        <Flex pb={3} gap={4} w={"70%"} mt={2}>
                            <CustomInput size={"sm"} type={"date"} name="startDate" label={"Start Date"} inputValue={inputValue} setInputValue={setInputValue} />
                            <CustomInput size={"sm"} type={"date"} name="endDate" label={"End Date"} inputValue={inputValue} setInputValue={setInputValue} />
                            <CustomSelect size={"sm"} name={"classMasterId"} label={"Select Class"} notRequire={true} inputValue={inputValue} setInputValue={setInputValue} data={
                                   map(classes, (d, key) => ({ value: key, name: d?.[0]?.class_master?.name }))
                                } />
                            <CustomSelect size={"sm"} name={"streamMasterId"} label={"Select Stream"} notRequire={true} inputValue={inputValue} setInputValue={setInputValue} data={
                                   map(uniqBy(classes?.[inputValue?.classMasterId], "streamMasterId"), (d, index) => ({ value: d.stream_master.id, name: d.stream_master.name }))
                                } />
                            <Button type="submit" size={"sm"} colorScheme={themeColor}>Get</Button>
                        </Flex>
                    </form>
                    <LoadingContainer status={getDiscountStatus}>
                        {allDiscounts?.length ?
                            <TableContainer>
                                <Table w="100%" size={"sm"} variant={"simple"}>
                                    <Thead>
                                        <Tr bg="gray.100">
                                            <Th>Receipt No.</Th>
                                            <Th>Sr No.</Th>
                                            <Th>Name</Th>
                                            <Th>Father Name</Th>
                                            <Th>Contact</Th>
                                            <Th>Class</Th>
                                            <Th>Stream</Th>
                                            <Th>Discount</Th>
                                            <Th>Remark</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {map(allDiscounts, disc => (
                                            <Tr _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                                                <Td>{disc.receiptNo}</Td>
                                                <Td>{disc.student_master?.srNo}</Td>
                                                <Td>{disc.student_master?.studentName}</Td>
                                                <Td>{disc.student_master?.fatherName}</Td>
                                                <Td>{disc.student_master?.fatherContact}</Td>
                                                <Td>{disc.class_master?.name}</Td>
                                                <Td>{disc.stream_master?.name}</Td>
                                                <Td><Flex align={"center"} justify={"flex-end"}><MdCurrencyRupee />{disc.totalDiscount}</Flex></Td>
                                                <Td whiteSpace="pre-wrap">{disc.remark}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            :
                            <NoData title={"No Discount Found"} />
                        }
                    </LoadingContainer>
                </Box>
            </Box>
        </Box>
    )
}