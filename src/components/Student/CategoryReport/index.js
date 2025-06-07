import { LoadingContainer } from "@/common/LoadingContainer"
import { NoData } from "@/common/NoData"
import { PageHeader } from "@/common/PageHeader"
import { SchoolHeader } from "@/common/SchoolHeader"
import { STATUS } from "@/constant"
import { useStudentStore } from "@/store/studentStore"
import { Box, Button, Table, TableContainer, Td, Th, Thead, Tr } from "@chakra-ui/react"
import { filter, groupBy, map, sumBy } from "lodash"
import { useEffect, useMemo, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"

export const CategoryReport = ({ sessionMasterId, themeColor }) => {

    const { getCategoryReportAction, getCategoryReportStatus, categoryReports } = useStudentStore(s => ({
        getCategoryReportAction: s.getCategoryReportAction,
        getCategoryReportStatus: s.getCategoryReportStatus,
        categoryReports: s.categoryReports
    }))
    useEffect(() => {
        if ((getCategoryReportStatus || 1) === STATUS.NOT_STARTED) {
            getCategoryReportAction({ sessionMasterId })
        }
    }, [getCategoryReportAction, getCategoryReportStatus, sessionMasterId])

    const classCategory = useMemo(() => {
        return groupBy(categoryReports, "classMasterId")
    }, [categoryReports])

    const [printProps, setPrintProps] = useState(null)
    const printRef = useRef(null);

    const handlePrintClick = (props) => {
        setPrintProps(props);
    };

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        onAfterPrint: () => setPrintProps(null),
        onPrintError: () => setPrintProps(null),
    });

    useEffect(() => {
        if (printProps) {
            handlePrint();
        }
    }, [printProps, handlePrint]);
    return (
        <Box h="100%">
            <PageHeader heading={"Category Report"} extra={<Button colorScheme={themeColor} size={"sm"} isDisabled={categoryReports?.length ? false : true} onClick={() => handlePrintClick(classCategory)}>Print</Button>} />
            <Box p={5} bg={"white"} h={"90%"}>
                <LoadingContainer status={getCategoryReportStatus}>
                    {classCategory ?
                        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                            <TableContainer>
                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Th colSpan={2}>Class</Th>
                                            <Th style={{ textAlign: "center" }}>GENERAL</Th>
                                            <Th style={{ textAlign: "center" }}>OBC</Th>
                                            <Th style={{ textAlign: "center" }}>SC</Th>
                                            <Th style={{ textAlign: "center" }}>ST</Th>
                                            <Th style={{ textAlign: "center" }}>SBC</Th>
                                            <Th style={{ textAlign: "center" }}>AWS</Th>
                                            <Th style={{ textAlign: "center" }}>OTHER</Th>
                                            <Th style={{ textAlign: "center", fontWeight: "bold" }}>Total</Th>
                                        </Tr>
                                    </Thead>
                                    <Thead>
                                        {map(classCategory, (cc, index) => (
                                            map(cc, (category, i) => (
                                                <Tr>
                                                    {i === 0 &&
                                                        <Td style={{ fontWeight: "bold" }} rowSpan={3}>{category.className}</Td>
                                                    }
                                                    <Td style={{ fontWeight: "bold" }}>{category.gender}</Td>
                                                    <Td style={{ textAlign: "center" }}>{category.GENERAL || "-"}</Td>
                                                    <Td style={{ textAlign: "center" }}>{category.OBC || "-"}</Td>
                                                    <Td style={{ textAlign: "center" }}>{category.SC || "-"}</Td>
                                                    <Td style={{ textAlign: "center" }}>{category.ST || "-"}</Td>
                                                    <Td style={{ textAlign: "center" }}>{category.SBC || "-"}</Td>
                                                    <Td style={{ textAlign: "center" }}>{category.AWS || "-"}</Td>
                                                    <Td style={{ textAlign: "center" }}>{category.OTHER || "-"}</Td>
                                                    <Td style={{ backgroundColor: "#EEEEEE", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>{category.GENERAL + category.OBC + category.SC + category.ST + category.SBC + category.AWS + category.OTHER}</Td>
                                                </Tr>
                                            ))
                                        ))}
                                        <Tr style={{ backgroundColor: "gray.100" }}>
                                            <Td style={{ backgroundColor: "#EEEEEE", fontWeight: "bold", fontSize: 14 }} colSpan={2}>Total</Td>
                                            <Td style={{ backgroundColor: "#EEEEEE", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>{sumBy(filter(categoryReports, c => c.gender !== "Total"), "GENERAL")}</Td>
                                            <Td style={{ backgroundColor: "#EEEEEE", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>{sumBy(filter(categoryReports, c => c.gender !== "Total"), "OBC")}</Td>
                                            <Td style={{ backgroundColor: "#EEEEEE", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>{sumBy(filter(categoryReports, c => c.gender !== "Total"), "SC")}</Td>
                                            <Td style={{ backgroundColor: "#EEEEEE", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>{sumBy(filter(categoryReports, c => c.gender !== "Total"), "ST")}</Td>
                                            <Td style={{ backgroundColor: "#EEEEEE", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>{sumBy(filter(categoryReports, c => c.gender !== "Total"), "SBC")}</Td>
                                            <Td style={{ backgroundColor: "#EEEEEE", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>{sumBy(filter(categoryReports, c => c.gender !== "Total"), "AWS")}</Td>
                                            <Td style={{ backgroundColor: "#EEEEEE", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>{sumBy(filter(categoryReports, c => c.gender !== "Total"), "OTHER")}</Td>
                                            <Td style={{ backgroundColor: "#EEEEEE", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>{
                                                sumBy(filter(categoryReports, c => c.gender !== "Total"), "GENERAL") +
                                                sumBy(filter(categoryReports, c => c.gender !== "Total"), "OBC") +
                                                sumBy(filter(categoryReports, c => c.gender !== "Total"), "SC") +
                                                sumBy(filter(categoryReports, c => c.gender !== "Total"), "ST") +
                                                sumBy(filter(categoryReports, c => c.gender !== "Total"), "SBC") +
                                                sumBy(filter(categoryReports, c => c.gender !== "Total"), "AWS") +
                                                sumBy(filter(categoryReports, c => c.gender !== "Total"), "OTHER")
                                            }</Td>
                                        </Tr>
                                    </Thead>
                                </Table>
                            </TableContainer>
                        </Box>
                        :
                        <NoData title={"No Record Found"} />
                    }
                </LoadingContainer>
                <Box display={"none"}>
                    {printProps &&
                        <Box ref={printRef} p={5}>
                            <SchoolHeader title={"Category Report"} />
                            {classCategory ?
                                <Box mt={3}
                                    sx={{
                                        pageBreakBefore: "avoid",
                                        breakBefore: "always"
                                    }}
                                >
                                    <TableContainer>
                                        <Table>
                                            <Thead>
                                                <Tr>
                                                    <Th colSpan={2}>Class</Th>
                                                    <Th style={{ textAlign: "center" }}>GENERAL</Th>
                                                    <Th style={{ textAlign: "center" }}>OBC</Th>
                                                    <Th style={{ textAlign: "center" }}>SC</Th>
                                                    <Th style={{ textAlign: "center" }}>ST</Th>
                                                    <Th style={{ textAlign: "center" }}>SBC</Th>
                                                    <Th style={{ textAlign: "center" }}>AWS</Th>
                                                    <Th style={{ textAlign: "center" }}>OTHER</Th>
                                                    <Th style={{ textAlign: "center", fontWeight: "bold" }}>Total</Th>
                                                </Tr>
                                            </Thead>
                                            <Thead>
                                                {map(classCategory, (cc, index) => (
                                                    map(cc, (category, i) => (
                                                        <Tr>
                                                            {i === 0 &&
                                                                <Td style={{ fontWeight: "bold" }} rowSpan={3}>{category.className}</Td>
                                                            }
                                                            <Td style={{ fontWeight: "bold" }}>{category.gender}</Td>
                                                            <Td style={{ textAlign: "center" }}>{category.GENERAL || "-"}</Td>
                                                            <Td style={{ textAlign: "center" }}>{category.OBC || "-"}</Td>
                                                            <Td style={{ textAlign: "center" }}>{category.SC || "-"}</Td>
                                                            <Td style={{ textAlign: "center" }}>{category.ST || "-"}</Td>
                                                            <Td style={{ textAlign: "center" }}>{category.SBC || "-"}</Td>
                                                            <Td style={{ textAlign: "center" }}>{category.AWS || "-"}</Td>
                                                            <Td style={{ textAlign: "center" }}>{category.OTHER || "-"}</Td>
                                                            <Td style={{ backgroundColor: "#EEEEEE", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>{category.GENERAL + category.OBC + category.SC + category.ST + category.SBC + category.AWS + category.OTHER}</Td>
                                                        </Tr>
                                                    ))
                                                ))}
                                                <Tr style={{ backgroundColor: "gray.100" }}>
                                                    <Td style={{ backgroundColor: "#EEEEEE", fontWeight: "bold", fontSize: 14 }} colSpan={2}>Total</Td>
                                                    <Td style={{ backgroundColor: "#EEEEEE", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>{sumBy(filter(categoryReports, c => c.gender !== "Total"), "GENERAL")}</Td>
                                                    <Td style={{ backgroundColor: "#EEEEEE", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>{sumBy(filter(categoryReports, c => c.gender !== "Total"), "OBC")}</Td>
                                                    <Td style={{ backgroundColor: "#EEEEEE", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>{sumBy(filter(categoryReports, c => c.gender !== "Total"), "SC")}</Td>
                                                    <Td style={{ backgroundColor: "#EEEEEE", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>{sumBy(filter(categoryReports, c => c.gender !== "Total"), "ST")}</Td>
                                                    <Td style={{ backgroundColor: "#EEEEEE", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>{sumBy(filter(categoryReports, c => c.gender !== "Total"), "SBC")}</Td>
                                                    <Td style={{ backgroundColor: "#EEEEEE", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>{sumBy(filter(categoryReports, c => c.gender !== "Total"), "AWS")}</Td>
                                                    <Td style={{ backgroundColor: "#EEEEEE", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>{sumBy(filter(categoryReports, c => c.gender !== "Total"), "OTHER")}</Td>
                                                    <Td style={{ backgroundColor: "#EEEEEE", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>{
                                                        sumBy(filter(categoryReports, c => c.gender !== "Total"), "GENERAL") +
                                                        sumBy(filter(categoryReports, c => c.gender !== "Total"), "OBC") +
                                                        sumBy(filter(categoryReports, c => c.gender !== "Total"), "SC") +
                                                        sumBy(filter(categoryReports, c => c.gender !== "Total"), "ST") +
                                                        sumBy(filter(categoryReports, c => c.gender !== "Total"), "SBC") +
                                                        sumBy(filter(categoryReports, c => c.gender !== "Total"), "AWS") +
                                                        sumBy(filter(categoryReports, c => c.gender !== "Total"), "OTHER")
                                                    }</Td>
                                                </Tr>
                                            </Thead>
                                        </Table>
                                    </TableContainer>
                                </Box>
                                :
                                <NoData title={"No Record Found"} />
                            }
                        </Box>
                    }
                </Box>
            </Box>
        </Box >
    )
}