import { ConfirmAlert } from "@/common/ConfirmationAlert"
import CustomInput from "@/common/CustomInput"
import { LoadingContainer } from "@/common/LoadingContainer"
import { NoData } from "@/common/NoData"
import { PageHeader } from "@/common/PageHeader"
import { STATUS } from "@/constant"
import { useClassSetupStore } from "@/store/classSetup"
import { useStdFeesStore } from "@/store/stdFees"
import { useStudentStore } from "@/store/studentStore"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { CheckIcon, CloseIcon } from "@chakra-ui/icons"
import { Badge, Box, Button, Flex, FormControl, IconButton, Image, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react"
import dayjs from "dayjs"
import { find, findIndex, groupBy, map, uniqBy } from "lodash"
import { useEffect, useMemo, useState } from "react"
import { MdCurrencyRupee } from "react-icons/md";
import CustomArrayInput from "@/common/CustomArrayInput"
import { CustomSelect } from "@/common/CustomSelect"

export const LastYearDue = ({ themeColor, sessionMasterId }) => {
    const [inputValue, setInputValue] = useState({})
    const [dueInputValue, setDueInputValue] = useState([])

    const inputHandler = (name, val) => {
        setInputValue(pre => ({ ...pre, [name]: val }))
    }

    const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } = useClassSetupStore(s => ({
        getClassSubjectAction: s.getClassSubjectAction,
        getClassSubjectStatus: s.getClassSubjectStatus,
        allClassSubjects: s.allClassSubjects
    }))
    const { getSectionAction, getSectionStatus, allSections } = useClassSetupStore(s => ({
        getSectionAction: s.getSectionAction,
        getSectionStatus: s.getSectionStatus,
        allSections: s.allSections
    }))

    const { getOpeningStudAction, getOpeningStudStatus, openingStud, addOpeningStudAction, addOpeningStudStatus, resetOpeningStudStatus } = useStdFeesStore(s => ({
        getOpeningStudAction: s.getOpeningStudAction,
        getOpeningStudStatus: s.getOpeningStudStatus,
        openingStud: s.openingStud,
        addOpeningStudAction: s.addOpeningStudAction,
        addOpeningStudStatus: s.addOpeningStudStatus,
        resetOpeningStudStatus: s.resetOpeningStudStatus
    }))

    useEffect(() => {
        if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
            getClassSubjectAction()
        }
        if ((getSectionStatus || 1) === STATUS.NOT_STARTED) {
            getSectionAction()
        }
    }, [getClassSubjectAction, getClassSubjectStatus, getSectionAction, getSectionStatus, sessionMasterId])

    useEffect(() => {
        return () => resetOpeningStudStatus()
    }, [resetOpeningStudStatus])

    const classes = useMemo(() => {
        return groupBy(allClassSubjects, "classMasterId")
    }, [allClassSubjects])

    const getReport = (e) => {
        e.preventDefault()
        getOpeningStudAction({ ...inputValue, sessionMasterId })
    }

    useEffect(() => {
        setDueInputValue(map(openingStud, std => ({
            promotionId: std.promotionId,
            tuitionOpeningAmount: std.tutitionAmount,
            transportOpeningAmount: std.transportAmount,
            hostelOpeningAmount: std.hostalAmount
        })))
    }, [openingStud])

    const submitData = () => {
        addOpeningStudAction({
            sessionMasterId,
            feesData: dueInputValue
        })
    }

    useEffect(() => {
        if (addOpeningStudStatus === STATUS.SUCCESS) {
            setInputValue({
                classMasterId: "",
                streamMasterId: "",
                sectionMasterId: ""
            })
            resetOpeningStudStatus()
        }
    }, [addOpeningStudStatus, resetOpeningStudStatus])

    return (
        <Box h="100%">
            <PageHeader heading={"Last Year Dues"} />
            <Box p={5} bg={"white"} h={"90%"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <form onSubmit={getReport}>
                        <Flex pb={3} gap={4} w={"50%"} mt={2}>
                            {/* <CustomInput size={"sm"} type={"date"} name="date" label={"Select Date"} inputValue={inputValue} setInputValue={setInputValue} /> */}
                            <CustomSelect size={"sm"} name={"classMasterId"} label={"Select Class"} notRequire={true} inputValue={inputValue} setInputValue={setInputValue} data={
                                map(classes, (d, key) => ({ value: key, name: d?.[0]?.class_master?.name }))
                            } />
                            <CustomSelect size={"sm"} name={"streamMasterId"} label={"Select Stream"} notRequire={true} inputValue={inputValue} setInputValue={setInputValue} data={
                                map(uniqBy(classes?.[inputValue?.classMasterId], "streamMasterId"), (d, index) => ({ value: d.stream_master.id, name: d.stream_master.name }))
                            } />
                            <CustomSelect size={"sm"} name={"sectionMasterId"} label={"Select Section"} inputValue={inputValue} setInputValue={setInputValue} data={
                                map(allSections, d => ({ value: d.id, name: d.name }))
                            } />
                            <Button type="submit" size={"sm"} colorScheme={themeColor}>Get</Button>
                        </Flex>
                    </form>
                    <LoadingContainer status={getOpeningStudStatus}>
                        {openingStud?.length ?
                            <Box>
                                <TableContainer>
                                    <Table w="100%" size={"sm"} variant={"simple"}>
                                        <Thead>
                                            <Tr bg="gray.100">
                                                <Th>Sr No.</Th>
                                                <Th>Name</Th>
                                                <Th>Father Name</Th>
                                                <Th>Contact</Th>
                                                <Th>Tution Fees Opening</Th>
                                                <Th>Transport Fees Opening</Th>
                                                <Th>Hostel Fees Opening</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {map(openingStud, (student) => {
                                                const index = findIndex(dueInputValue, d => d.promotionId === student.promotionId)
                                                const dueData = find(dueInputValue, d => d.promotionId === student.promotionId)
                                                return (
                                                    <Tr _hover={{ bg: "gray.50" }} cursor={"pointer"}>
                                                        <Td>{student?.srNo}</Td>
                                                        <Td>{student?.studentName}</Td>
                                                        <Td>{student?.fatherName}</Td>
                                                        <Td>{student?.fatherContact}</Td>
                                                        <Td style={{ paddingTop: "12px" }}>
                                                            <FormControl isRequired>
                                                                <CustomArrayInput size={"sm"} type={"number"} notRequire={true} index={index} name="tuitionOpeningAmount" label={"Amount"} inputValue={dueData} setInputValue={setDueInputValue} />
                                                            </FormControl>
                                                        </Td>
                                                        <Td style={{ paddingTop: "12px" }}>
                                                            <FormControl isRequired>
                                                                <CustomArrayInput size={"sm"} type={"number"} notRequire={true} index={index} name="transportOpeningAmount" label={"Amount"} inputValue={dueData} setInputValue={setDueInputValue} />
                                                            </FormControl>
                                                        </Td>
                                                        <Td style={{ paddingTop: "12px" }}>
                                                            <FormControl isRequired>
                                                                <CustomArrayInput size={"sm"} type={"number"} notRequire={true} index={index} name="hostelOpeningAmount" label={"Amount"} inputValue={dueData} setInputValue={setDueInputValue} />
                                                            </FormControl>
                                                        </Td>
                                                    </Tr>
                                                )
                                            })}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                                <Flex mt={5} justify={"flex-end"}>
                                    <Button size={"sm"} colorScheme={themeColor} isLoading={addOpeningStudStatus === STATUS.FETCHING} onClick={submitData}>Save</Button>
                                </Flex>
                            </Box>
                            :
                            <NoData title={"No Student Found"} />
                        }
                    </LoadingContainer>
                </Box>
            </Box>
        </Box>
    )
}