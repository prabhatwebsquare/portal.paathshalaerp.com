import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Checkbox, Flex, IconButton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { map } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/common/PageHeader";
import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { NoData } from "@/common/NoData";
import { useLibraryStore } from "@/store/Library";
import Barcode from "react-barcode";
import { MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { SchoolHeader } from "@/common/SchoolHeader";

export const StockReport = ({ themeColor, sessionMasterId }) => {

    const printAllRef = useRef(null);
    const handleAllPrint = useReactToPrint({
        content: () => printAllRef.current,
        pageStyle: `
        @page {
            size: landscape;
          }
        `,
    });

    return (
        <Box>
            <PageHeader heading={"Stock Report"} extra={<Button size={"sm"} colorScheme={themeColor} onClick={handleAllPrint}>Print</Button>} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" h={"100%"} maxH={"100%"} overflowY={"scroll"}>
                    <Data />
                    <Box display={"none"}>
                        {/* {allPrintProps && allPrintProps?.length && */}
                        <Box ref={printAllRef} p={5}>
                            <SchoolHeader title={"Stock Report"} />
                            <Data />
                        </Box>
                        {/* } */}
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

const Data = ({ allCurrentStocks }) => {
    return (
        <TableContainer mt={2}>
            < Table w="100%" size={"sm"} variant={"simple"} >
                <Thead>
                    <Tr bg="gray.100">
                        <Th>S.No.</Th>
                        <Th>Item Name</Th>
                        <Th textAlign={"center"}>Stock</Th>
                        <Th textAlign={"center"}>Issued</Th>
                        <Th textAlign={"center"}>Damage</Th>
                        <Th textAlign={"center"}>Available</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {map(new Array(5), (stock, index) => (
                        <Tr key={index}>
                            <Td>{index + 1}</Td>
                            <Td>Beaker</Td>
                            <Td textAlign={"center"}>20</Td>
                            <Td textAlign={"center"}>8</Td>
                            <Td textAlign={"center"}>2</Td>
                            <Td textAlign={"center"} style={{ fontWeight: "bold" }}>10</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table >
        </TableContainer >
    )
}