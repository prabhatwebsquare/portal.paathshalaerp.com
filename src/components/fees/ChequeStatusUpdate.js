import CustomInput from "@/common/CustomInput"
import { CustomSelect } from "@/common/CustomSelect";
import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
import { useStdFeesStore } from "@/store/stdFees";
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select } from "@chakra-ui/react"
import dayjs from "dayjs"
import { map } from "lodash";
import { use, useEffect, useState } from "react";

export const ChequeStatusUpdate = ({ allBanks, closeModal, data, receiptData, sessionMasterId, themeColor }) => {

    const [inputValue, setInputValue] = useState({
        sessionMasterId,
        feesReportId: data.id,
        chequeId: data.chequeId,
        date: dayjs().format("YYYY-MM-DD")
    })

    const inputHandler = (name, val) => {
        setInputValue(pre => ({ ...pre, [name]: val }))
    }

    const { updateChequeStatusAction, updateChequeStatusStatus, chequeUpdate, resetChequeStatus } = useStdFeesStore(s => ({
        updateChequeStatusAction: s.updateChequeStatusAction,
        updateChequeStatusStatus: s.updateChequeStatusStatus,
        chequeUpdate: s.chequeUpdate,
        resetChequeStatus: s.resetChequeStatus
    }))

    const updateStatus = (e) => {
        e.preventDefault()
        const temp = {
            ...inputValue
        }
        if (inputValue.chequeStatus === "Cleared") {
            temp.feesMode = data.feesMode;
        }
        updateChequeStatusAction(temp)
    }

    useEffect(() => {
        if (updateChequeStatusStatus === STATUS.SUCCESS) {
            resetChequeStatus()
            if (chequeUpdate.chequeStatus === "Cleared") {
                receiptData(chequeUpdate, data.promotionId)
            }
            else {
                closeModal()
            }
        }
    }, [chequeUpdate, closeModal, data.promotionId, receiptData, resetChequeStatus, updateChequeStatusStatus])

    return (
        <Modal size={"lg"} isOpen={data} onClose={closeModal}>
            <ModalOverlay />
            <form onSubmit={updateStatus}>
                <ModalContent>
                    <ModalHeader>Update Cheque Status</ModalHeader>
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
                                placeholder="Select Cheque Status"
                                value={inputValue?.chequeStatus}
                                onChange={(e) => inputHandler("chequeStatus", e.target.value)}
                            >
                                {data.chequeStatus === "Collected" ?
                                    <>
                                        <option value={"Deposit Into Bank"}>Deposit Into Bank</option>
                                        <option value={"Cancelled"}>Cancelled</option>
                                    </>
                                    :
                                    <>
                                        <option value={"Cleared"}>Cleared</option>
                                        <option value={"Bounce"}>Bounce</option>
                                    </>
                                }
                            </Select>
                            {inputValue?.chequeStatus === "Deposit Into Bank" ?
                                     <CustomSelect  w={"47%"} size={"md"} name={"ledgerMasterId"} label={"Select Deposite Bank"} inputValue={inputValue} setInputValue={setInputValue} data={
                                        map(allBanks, bank => ({ value: bank.id, name: bank.name + " - " + bank.accountNumber }))
                                    } />
                                :
                                null
                            }
                            <CustomInput w={"47%"} type={"date"} name="date" label={"Date"} inputValue={inputValue} setInputValue={setInputValue} />
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