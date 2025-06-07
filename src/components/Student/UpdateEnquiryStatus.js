import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
import { useStudentStore } from "@/store/studentStore";
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select } from "@chakra-ui/react"
import { useEffect, useState } from "react";

export const EnquiryStatusUpdate = ({ closeModal, data, sessionMasterId, themeColor }) => {

    const [inputValue, setInputValue] = useState({
        id: data.id
    })
    const inputHandler = (name, val) => {
        setInputValue(pre => ({ ...pre, [name]: val }))
    }
    const { editEnquiryAction, editEnquiryStatus, resetAddEnquiry } = useStudentStore(s => ({
        editEnquiryAction: s.editEnquiryAction,
        editEnquiryStatus: s.editEnquiryStatus,
        resetAddEnquiry: s.resetAddEnquiry,
    }))
    const updateStatus = (e) => {
        e.preventDefault()
        editEnquiryAction(inputValue)
    }
    useEffect(() => {
        if (editEnquiryStatus === STATUS.SUCCESS) {
            resetAddEnquiry()
            closeModal()
        }
    }, [closeModal, editEnquiryStatus, resetAddEnquiry])
    return (
        <Modal size={"lg"} isOpen={data} onClose={closeModal}>
            <ModalOverlay />
            <form onSubmit={updateStatus}>
                <ModalContent>
                    <ModalHeader>Update Enquiry Status</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex gap={6} flexWrap={"wrap"}>
                            <Select
                                w={"47%"}
                                size="md"
                                isRequired
                                fontSize={13}
                                fontWeight={"semibold"}
                                focusBorderColor={`${themeColor}.400`}
                                placeholder="Select Enquiry Status"
                                value={inputValue?.status}
                                onChange={(e) => inputHandler("status", e.target.value)}
                            >
                                {data.status === "Pending" ?
                                    <>
                                        <option value={"Converted"}>Converted</option>
                                        <option value={"Rejected"}>Rejected</option>
                                    </>
                                    :
                                    null
                                }
                            </Select>
                            <CustomTextarea type={"text"} notRequire={true} name="remark" label={"Remark"} inputValue={inputValue} setInputValue={setInputValue} />
                        </Flex>
                    </ModalBody>

                    <ModalFooter>
                        <Button size={"sm"} mr={3} onClick={closeModal}>
                            Close
                        </Button>
                        <Button size={"sm"} colorScheme={themeColor} type="submit">Update</Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    )
}