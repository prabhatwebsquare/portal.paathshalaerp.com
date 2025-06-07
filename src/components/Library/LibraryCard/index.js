import { PageHeader } from "@/common/PageHeader"
import { Badge, Box, Button, Checkbox, Flex, IconButton, Select, Table, TableContainer, Tag, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react"
import { filter, findIndex, groupBy, intersectionBy, map, uniqBy } from "lodash"
import { useEffect, useMemo, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { useClassSetupStore } from "@/store/classSetup"
import { useStudentStore } from "@/store/studentStore"
import { STATUS } from "@/constant"
import { LoadingContainer } from "@/common/LoadingContainer"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import { CustomSelect } from "@/common/CustomSelect"
import { LibraryCardUI } from "./LibraryCardUI"
import { GrUpdate } from "react-icons/gr"
import { PERMISSIONS } from "@/constant/PermissionConstant"
import { HasPermission } from "@/common/HasPermission"
import { LibraryCardStatus } from "./LibraryCardStatus"
import { CustomTag } from "@/common/CustomTags"
import { IoCheckmarkCircleOutline } from "react-icons/io5"
import { IoMdCheckmarkCircleOutline } from "react-icons/io"
import { MdOutlineCancel } from "react-icons/md"
import dayjs from "dayjs"

export const LibraryCard = ({ themeColor, sessionMasterId }) => {
    const [toggleModal, setToggleModal] = useState(null)
    const [inputValue, setInputValue] = useState({})
    const [selectedStudent, setSelectedStudent] = useState([])
    const school = getLocalStorageItem("user")
    const inputHandler = (name, val) => {
        setInputValue(pre => ({ ...pre, [name]: val }))
    }
    const { getSectionAction, getSectionStatus, allSections } = useClassSetupStore(s => ({
        getSectionAction: s.getSectionAction,
        getSectionStatus: s.getSectionStatus,
        allSections: s.allSections
    }))

    const { getClassSubjectAction, getClassSubjectStatus, allClassSubjects } = useClassSetupStore(s => ({
        getClassSubjectAction: s.getClassSubjectAction,
        getClassSubjectStatus: s.getClassSubjectStatus,
        allClassSubjects: s.allClassSubjects
    }))

    const { getFilterStudentsAction, getFilterStudentsStatus, filterStudents, resetFilterStdStatus } = useStudentStore(s => ({
        getFilterStudentsAction: s.getFilterStudentsAction,
        getFilterStudentsStatus: s.getFilterStudentsStatus,
        filterStudents: s.filterStudents,
        resetFilterStdStatus: s.resetFilterStdStatus
    }))

    useEffect(() => {
        if ((getClassSubjectStatus || 1) === STATUS.NOT_STARTED) {
            getClassSubjectAction()
        }
        if ((getSectionStatus || 1) === STATUS.NOT_STARTED) {
            getSectionAction()
        }
    }, [getClassSubjectAction, getClassSubjectStatus, getSectionAction, getSectionStatus])

    useEffect(() => {
        return () => resetFilterStdStatus()
    }, [resetFilterStdStatus])

    const classes = useMemo(() => {
        return groupBy(allClassSubjects, "classMasterId")
    }, [allClassSubjects])

    const getFilterStudent = (e) => {
        e.preventDefault()
        getFilterStudentsAction({ ...inputValue, sessionMasterId })
    }

    const selectAllStd = () => {
        if (selectedStudent?.length === filterStudents?.length) {
            setSelectedStudent([])
        }
        else {
            setSelectedStudent(map(filterStudents, s => ({ id: s.id })))
        }
    }

    const handleCheck = (id) => {
        if (findIndex(selectedStudent, s => s.id === id) !== -1) {
            setSelectedStudent(filter(selectedStudent, s => s.id !== id))
        }
        else {
            setSelectedStudent([...selectedStudent, { id }])
        }
    }

    const [allPrintProps, setAllPrintProps] = useState(null)
    const printAllRef = useRef(null);

    const handlePrintAllClick = () => {
        const temp = intersectionBy(filterStudents, selectedStudent, "id")
        setAllPrintProps(temp);
    };

    const handleAllPrint = useReactToPrint({
        content: () => printAllRef.current,
        onAfterPrint: () => setAllPrintProps(null),
        onPrintError: () => setAllPrintProps(null),
        pageStyle: `
        @page {
            size: landscape;
          }
        `,
    });

    useEffect(() => {
        if (allPrintProps?.length) {
            handleAllPrint();
        }
    }, [allPrintProps, handleAllPrint]);

    return (
        <Box h={"100%"}>
            <PageHeader heading={"Library Card"} />
            <Box p={5} bg={"white"} h={"90%"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <Flex justify={"space-between"}>
                        <form style={{ width: "60%" }} onSubmit={getFilterStudent}>
                            <Flex pb={3} gap={4}>
                                <CustomSelect size={"sm"} name={"classMasterId"} label={"Select Class"} inputValue={inputValue} setInputValue={setInputValue} data={
                                    map(classes, (d, key) => ({ value: key, name: d?.[0]?.class_master?.name }))
                                } />
                                <CustomSelect size={"sm"} name={"streamMasterId"} label={"Select Stream"} inputValue={inputValue} setInputValue={setInputValue} data={
                                    map(uniqBy(classes?.[inputValue?.classMasterId], "streamMasterId"), (d, index) => ({ value: d.stream_master.id, name: d.stream_master.name }))
                                } />
                                <CustomSelect size={"sm"} name={"sectionMasterId"} label={"Select Section"} inputValue={inputValue} setInputValue={setInputValue} data={
                                    map(allSections, d => ({ value: d.id, name: d.name }))
                                } />
                                <Button type="submit" size={"sm"} colorScheme={themeColor}>Get</Button>
                            </Flex>
                        </form>
                        <Button px={4} size={"sm"} colorScheme={themeColor} isDisabled={selectedStudent?.length ? false : true} onClick={handlePrintAllClick}>Print</Button>
                    </Flex>
                    {(getFilterStudentsStatus || 1) === STATUS.NOT_STARTED ?
                        <Flex justify={"center"} mt={7}><Text>Get Class Student First</Text></Flex>
                        :
                        <LoadingContainer status={getFilterStudentsStatus}>
                            <TableContainer>
                                <Table w="100%" size={"sm"} variant={"simple"}>
                                    <Thead>
                                        <Tr bg="gray.100">
                                            <Th><Checkbox colorScheme={themeColor} isChecked={selectedStudent?.length === filterStudents?.length ? true : false} onChange={selectAllStd} /></Th>
                                            <Th>Sr No.</Th>
                                            <Th>Roll No.</Th>
                                            <Th>Name</Th>
                                            <Th>Father Name</Th>
                                            <Th>Issue Date</Th>
                                            <Th>Status</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {map(filterStudents, (std, index) => {
                                            const isChecked = findIndex(selectedStudent, s => s.id === std.id) !== -1 ? true : false
                                            const reIssued = String(std.libraryCardIssue) === "2"
                                            const issued = String(std.libraryCardIssue) === "1"
                                            return (
                                                <Tr key={index} _hover={{ bg: "gray.50" }}>
                                                    <Td><Checkbox colorScheme={themeColor} isChecked={isChecked} onChange={() => handleCheck(std.id)} /></Td>
                                                    <Td>{std.srNo}</Td>
                                                    <Td>{std.rollNo}</Td>
                                                    <Td>{std.student_master.studentName}</Td>
                                                    <Td>{std.student_master.fatherName}</Td>
                                                    <Td>{std.libraryCardIssueDate ? dayjs(std.libraryCardIssueDate).format("DD-MM-YYYY") : ""}</Td>
                                                    <Td>
                                                        <Flex>
                                                            <CustomTag
                                                                icon={(reIssued || issued) ? <IoMdCheckmarkCircleOutline fontSize={18} /> : <MdOutlineCancel fontSize={18} />}
                                                                colorScheme={reIssued ? "red" : issued ? "green" : "gray"}
                                                                title={reIssued ? "Re-Issued" : issued ? "Issued" : "Not Issue"}
                                                            />
                                                            {(!reIssued) ?
                                                                <Tooltip placement="top" label={"Update Status"}>
                                                                    <IconButton ml={1} size={"xs"} variant={"ghost"} colorScheme={themeColor} onClick={() => setToggleModal(std)} icon={<GrUpdate />} />
                                                                </Tooltip>
                                                                :
                                                                null
                                                            }
                                                        </Flex>
                                                    </Td>
                                                </Tr>
                                            )
                                        })}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </LoadingContainer>
                    }
                </Box>
                {/* <LibraryCardUI allData={intersectionBy(filterStudents, selectedStudent, "id")} school={school?.schoolData} setAllPrintProps={setAllPrintProps} themeColor={themeColor} /> */}
                <Box display={"none"}>
                    {allPrintProps && allPrintProps?.length &&
                        <Box ref={printAllRef}>
                            <LibraryCardUI allData={allPrintProps} school={school?.schoolData} setAllPrintProps={setAllPrintProps} themeColor={themeColor} />
                        </Box>
                    }
                </Box>
                {toggleModal && <LibraryCardStatus data={toggleModal} themeColor={themeColor} closeModal={() => setToggleModal(null)} />}
            </Box>
        </Box >
    )
}