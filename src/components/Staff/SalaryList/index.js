import CustomInput from "@/common/CustomInput"
import { DeleteButton } from "@/common/DeleteButton"
import { PageHeader } from "@/common/PageHeader"
import { EditIcon } from "@chakra-ui/icons"
import { Box, Button, IconButton, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react"
import { map } from "lodash"
import { useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { getLocalStorageItem } from "@/utils/LocalStorage"
import dayjs from "dayjs"

export const SalaryList = ({ themeColor, sessionMasterId }) => {
    const [inputValue, setInputValue] = useState({})
    const data = getLocalStorageItem("user")

    return (
        <Box h="100%">
            <PageHeader heading={"Salary List"} />
            <Box p={5} bg={"white"} h={"100%"} className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                {/* <LoadingContainer status={getShiftStatus}>
                    {allShifts?.length ? */}
                <TableContainer mt={2}>
                    <Table w="100%" size={"sm"} variant={"simple"}>
                        <Thead>
                            <Tr bg="gray.100">
                                <Th>Emp. Id</Th>
                                <Th>Name</Th>
                                <Th>Contact</Th>
                                <Th>Shift</Th>
                                <Th>PaySlip No</Th>
                                <Th>Paid Date</Th>
                                <Th>Month</Th>
                                <Th>NetPay</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {map(new Array(5), (shift, index) => (
                                <Tr key={shift?.id}>
                                    <Td>{index + 1}</Td>
                                    <Td>{shift?.name || "Ashok"}</Td>
                                    <Td>{shift?.contact || "9876543210"}</Td>
                                    <Td>Shift I</Td>
                                    <Td>1</Td>
                                    <Td>{dayjs().format("DD-MM-YYYY")}</Td>
                                    <Td>{dayjs().format("MMMM YYYY")}</Td>
                                    <Td>50000</Td>
                                    <Td>
                                        {/* <Tooltip placement="top" label="Edit">
                                            <IconButton mr={3} size={"sm"} variant={"ghost"} icon={<EditIcon />} colorScheme={"blue"} />
                                        </Tooltip>
                                        <DeleteButton
                                            description={"Are you sure? Do you want to delete?"}
                                            confirm={() => deleteShift(shift?.id)}
                                            status={deleteShiftStatus}
                                            reset={resetShiftStatus}
                                        /> */}
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                {/* :
                        <NoData title={"No Shift Found"} />
                    }
                </LoadingContainer> */}
            </Box>
        </Box>
    )
}