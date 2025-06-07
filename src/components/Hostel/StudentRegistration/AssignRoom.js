import { STATUS } from "@/constant";
import { Box, Button, Flex, FormControl, FormLabel, Input, Text, Tooltip } from "@chakra-ui/react"
import dayjs from "dayjs";
import { filter, map } from "lodash"
import { useEffect, useMemo, useState } from "react"
import { FaBed } from "react-icons/fa";

export const AssignRoom = ({ branch, sid, themeColor }) => {
    const [selectedBed, setSelectBed] = useState()
    const [inputValue, setInputValue] = useState()

    // const { getRoomListAction, getRoomListStatus, roomList, bookRoomAction, bookRoomStatus, resetBookRoom } = useRoomStore(s => ({
    //     getRoomListAction: s.getRoomListAction,
    //     getRoomListStatus: s.getRoomListStatus,
    //     roomList: s.roomList,
    //     bookRoomAction: s.bookRoomAction,
    //     bookRoomStatus: s.bookRoomStatus,
    //     resetBookRoom: s.resetBookRoom
    // }))


    // const { filterRequest } = useRegistrationStore(s => ({
    //     filterRequest: s.filterRequest
    // }))

    // useEffect(() => {
    //     if (branch) {
    //         getRoomListAction({
    //             branchId: branch.id,
    //             hostelId: branch.hostelId,
    //             mobileno: branch.contactNo,
    //             status: "string",
    //             attendancetypeid: 0
    //         })
    //     }
    // }, [branch, getRoomListAction])

    // const filteredRoom = useMemo(() => {
    //     const filtered = filter(roomList?.data, room => room.bedlist?.length)
    //     return filtered
    // }, [roomList?.data])

    const handleBed = (bed) => {
        setSelectBed(bed)
        setInputValue({ regdate: dayjs(new Date()).format("YYYY-MM-DD"), monthlyAmt: 6000 })
    }
    // const inputHandler = (name, val) => {
    //     setInputValue(pre => ({ ...pre, [name]: val }))
    // }

    const finish = () => {
        // bookRoomAction({
        //     sid: sid,
        //     roomid: selectedBed.roomId,
        //     bedid: selectedBed.id,
        //     monthlyAmt: inputValue.monthlyAmt,
        //     securityAmt: 0,
        //     regdate: dayjs(inputValue.regdate).format("YYYY-MM-DD"),
        //     branchId: branch.id,
        //     hostelId: branch.hostelId,
        //     leavedate: null
        // })
    }

    // useEffect(() => {
    //     if (bookRoomStatus === STATUS.SUCCESS) {
    //         filterRequest(sid)
    //         resetBookRoom()
    //         close()
    //     }
    // }, [bookRoomStatus, close, filterRequest, resetBookRoom, sid])

    return (
        <Box py={5}>
            {/* {filteredRoom?.length ? */}
            {map(new Array(5), room => (
                <Flex my={3} align={"baseline"}>
                    <Text pr={3} w={"20%"} fontSize={18} fontWeight={"semibold"}>Room No.:  {room?.roomNo}</Text>
                    <Flex w={"80%"} flexWrap={"wrap"}>
                        {map(new Array(3), (bed, index) => (
                            <Flex w={"25%"} mb={2}>
                                <Tooltip label={"Available"} placement="top">
                                    <Flex
                                        align={"center"}
                                        bg={"gray.200"}
                                        px={10} py={1}
                                        flexDir={"column"}
                                        color={"green.500"}
                                        border={"1px solid"}
                                        borderColor={selectedBed?.id === index ? "blue.300" : "gray.200"}
                                        borderRadius={5}
                                        cursor={"pointer"}
                                        _hover={{ bg: "blue.50" }}
                                        onClick={() => handleBed(index)}
                                    >
                                        <Text fontSize={18} fontWeight={"semibold"}>{index+1}</Text>
                                        <FaBed fontSize={28} />
                                    </Flex>
                                </Tooltip>
                            </Flex>
                        ))}
                        {/* {map(room.bedlist, bed => (
                            <Flex w={"25%"} key={bed.id} mb={2}>
                                <Tooltip label={bed.isBookStatus === false ? "Available" : "Not Available"} placement="top">
                                    <Flex
                                        align={"center"}
                                        bg={bed.isBookStatus === true ? "gray.200" : selectedBed?.id === bed.id ? "gray.100" : "white"}
                                        px={10} py={1}
                                        flexDir={"column"}
                                        color={bed.isBookStatus === false ? "green.500" : "red.400"}
                                        border={"1px solid"}
                                        borderColor={selectedBed?.id === bed.id ? "blue.300" : "gray.200"}
                                        borderRadius={5}
                                        cursor={"pointer"}
                                        _hover={{ bg: "blue.50" }}
                                        onClick={() => bed.isBookStatus === false ? handleBed(bed) : null}
                                    >
                                        <Text fontSize={18} fontWeight={"semibold"}>{bed.bedNo}</Text>
                                        <FaBed fontSize={28} />
                                    </Flex>
                                </Tooltip>
                            </Flex>
                        ))} */}
                    </Flex>
                </Flex>
            ))}
            {/* :
                <Text>No Room Created</Text>
            } */}
            <Flex my={4} p={5} flexDir={"column"} justify={"flex-end"} bg={`${themeColor}.100`} borderRadius={10}>
                {selectedBed ?
                    <Flex gap={4}>
                        <FormControl isRequired>
                            <FormLabel>Monthly Amount</FormLabel>
                            <Input size={"sm"} type={"number"} bg={"white"} value={inputValue?.monthlyAmt} focusBorderColor="green.400" onChange={(e) => inputHandler("monthlyAmt", e.target.value)} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Registration Date</FormLabel>
                            <Input size={"sm"} type={"date"} bg={"white"} value={inputValue?.regdate} focusBorderColor="green.400" onChange={(e) => inputHandler("regdate", e.target.value)} />
                        </FormControl>
                    </Flex>
                    :
                    null
                }
                <Button my={4} size={"sm"} colorScheme={themeColor} onClick={finish}  isDisabled={selectedBed ? false : true}>Assign</Button>
            </Flex>
        </Box>
    )
}