import CustomInput from "@/common/CustomInput"
import { CustomSelect } from "@/common/CustomSelect";
import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
import { useLibraryStore } from "@/store/Library";
import { useStdFeesStore } from "@/store/stdFees";
import { useStudentStore } from "@/store/studentStore";
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select } from "@chakra-ui/react"
import dayjs from "dayjs"
import { map } from "lodash";
import { use, useEffect, useState } from "react";

export const LibraryCardStatus = ({ closeModal, data, themeColor }) => {

    const [inputValue, setInputValue] = useState({
        promotionId: data.id,
        libraryCardIssue: String(data.libraryCardIssue),
        libraryCardIssueDate: data?.libraryCardIssueDate ? dayjs(data.libraryCardIssueDate).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD")
    })

    const { addLibraryCardAction, addLibraryCardStatus, resetLibraryCardStatus } = useStudentStore(s => ({
        addLibraryCardAction: s.addLibraryCardAction,
        addLibraryCardStatus: s.addLibraryCardStatus,
        resetLibraryCardStatus: s.resetLibraryCardStatus
    }))

    const updateStatus = (e) => {
        e.preventDefault()
        addLibraryCardAction(inputValue)
    }

    useEffect(() => {
        if (addLibraryCardStatus === STATUS.SUCCESS) {
            resetLibraryCardStatus()
            closeModal()
        }
    }, [closeModal, resetLibraryCardStatus, addLibraryCardStatus])

    return (
        <Modal size={"lg"} isOpen={data} onClose={closeModal}>
            <ModalOverlay />
            <form onSubmit={updateStatus}>
                <ModalContent>
                    <ModalHeader>Library Card Status</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex gap={6} flexWrap={"wrap"}>
                            <CustomInput w={"47%"} size={"sm"} type={"date"} name="libraryCardIssueDate" label={"Issue Date"} inputValue={inputValue} setInputValue={setInputValue} />
                            <CustomSelect w={"47%"} size={"sm"} name={"libraryCardIssue"} label={"Select Status"} inputValue={inputValue} setInputValue={setInputValue} data={[
                                { name: "Not Issued", value: "0" },
                                { name: "Issued", value: "1" },
                                { name: "ReIssued", value: "2" },
                            ]} />
                        </Flex>
                    </ModalBody>

                    <ModalFooter>
                        <Button size={"sm"} mr={3} onClick={closeModal}>
                            Close
                        </Button>
                        <Button size={"sm"} colorScheme={themeColor} type="submit" isLoading={addLibraryCardStatus === STATUS.FETCHING}>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    )
}