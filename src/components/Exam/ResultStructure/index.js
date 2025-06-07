import CustomArrayInput from "@/common/CustomArrayInput"
import { PageHeader } from "@/common/PageHeader"
import { STATUS } from "@/constant"
import { useExamStore } from "@/store/Exam"
import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import { Box, Button, Flex, IconButton, Radio, RadioGroup, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import { cloneDeep, filter, map } from "lodash"
import { useEffect, useState } from "react"

export const ResultStructure = ({ themeColor, sessionMasterId }) => {
    const [scores, setScore] = useState([{}])
    const [value, setValue] = useState("1")

    const { updateResultStrucAction, updateResultStrucStatus, resultStruc, getResultStrucAction, getResultStrucStatus } = useExamStore(s => ({
        updateResultStrucAction: s.updateResultStrucAction,
        updateResultStrucStatus: s.updateResultStrucStatus,
        resultStruc: s.resultStruc,
        getResultStrucAction: s.getResultStrucAction,
        getResultStrucStatus: s.getResultStrucStatus
    }))

    useEffect(() => {
        if ((getResultStrucStatus || 1) === STATUS.NOT_STARTED) {
            getResultStrucAction()
        }
    }, [getResultStrucAction, getResultStrucStatus])

    useEffect(() => {
        if (value === "1" && resultStruc) {
            setScore(resultStruc?.divisionData)
        }
        else {
            setScore(resultStruc?.gradeData)
        }
    }, [resultStruc, value])

    const deleteRow = (index) => {
        const newData = cloneDeep(scores);
        newData.splice(index, 1);
        setScore(newData);
    }

    const saveStructure = (e) => {
        e.preventDefault()
        updateResultStrucAction({
            isDivision: value,
            data: scores
        })
    }
    return (
        <Box>
            <PageHeader heading={"Result Structure"} />
            <Box px={5} py={3} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <RadioGroup onChange={setValue} value={value}>
                        <Stack direction='row'>
                            <Radio value='1'>Division</Radio>
                            <Radio value='0'>Grade</Radio>
                        </Stack>
                    </RadioGroup>
                    <form onSubmit={saveStructure}>
                        <Table mt={3} w="100%" size={"sm"} variant={"simple"}>
                            <Thead>
                                <Tr bg="gray.100">
                                    <Th>{value === "1" ? "Division" : "Grade"}</Th>
                                    <Th>From (%)</Th>
                                    <Th>To (%)</Th>
                                    {value === "1" ?
                                        null
                                        :
                                        <Th>Grade Point</Th>
                                    }
                                    <Th>Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {map(scores, (score, index) => (
                                    <Tr key={index}>
                                        <Td>
                                            <CustomArrayInput type={"text"} index={index} name={"title"} label={value === "1" ? "Division" : "Grade"} inputValue={score} setInputValue={setScore} />
                                        </Td>
                                        <Td>
                                            <CustomArrayInput type={"float"} index={index} name="from" label={"From"} inputValue={score} setInputValue={setScore} />
                                        </Td>
                                        <Td>
                                            <CustomArrayInput type={"float"} index={index} name="to" label={"To"} inputValue={score} setInputValue={setScore} />
                                        </Td>
                                        {value === "1" ?
                                            null
                                            :
                                            <Td>
                                                <CustomArrayInput type={"number"} index={index} name="grade" label={"Grade Point"} inputValue={score} setInputValue={setScore} />
                                            </Td>
                                        }
                                        <Td>
                                            <IconButton size={"sm"} variant={"ghost"} colorScheme={"red"} icon={<DeleteIcon />} onClick={() => deleteRow(index)} />
                                        </Td>
                                    </Tr>
                                ))}
                                <Tr>
                                    <Td colSpan={5} textAlign={"center"}><Button size={"sm"} variant={"ghost"} colorScheme={themeColor} leftIcon={<AddIcon />} onClick={() => setScore(pre => ([...pre, {}]))}>Add More</Button></Td>
                                </Tr>
                            </Tbody>
                        </Table>
                        <Flex mt={5} w={"100%"} justify={"flex-end"}>
                            <Button type="submit" isLoading={updateResultStrucStatus === STATUS.FETCHING} colorScheme={themeColor}>Save</Button>
                        </Flex>
                    </form>
                </Box>
            </Box>
        </Box>
    )
}