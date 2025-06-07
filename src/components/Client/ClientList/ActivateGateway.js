import CustomInput from "@/common/CustomInput"
import { STATUS } from "@/constant"
import { useLibraryStore } from "@/store/Library"
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"

export const ActivateGateway = ({ data, closeModal, themeColor }) => {
    const [inputValue, setInputValue] = useState({ isPaymentGatway: 1 })
    const { addPayGateWayAction, addPayGateWayStatus, resetPayGateWayStatus } = useLibraryStore(s => ({
        addPayGateWayAction: s.addPayGateWayAction,
        addPayGateWayStatus: s.addPayGateWayStatus,
        resetPayGateWayStatus: s.resetPayGateWayStatus
    }))

    const sendRequest = (e) => {
        e.preventDefault()
        addPayGateWayAction({
            ...inputValue,
            id: data?.schoolCode
        })
    }

    useEffect(() => {
        if (addPayGateWayStatus === STATUS.SUCCESS) {
            resetPayGateWayStatus()
            closeModal()
        }
    }, [addPayGateWayStatus, closeModal, resetPayGateWayStatus])

    return (
        <Modal isOpen={data} onClose={closeModal}>
            <ModalOverlay />
            <form onSubmit={sendRequest}>
                <ModalContent>
                    <ModalHeader>Activate Payment Gateway</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex w={"100%"} gap={3} flexWrap={"wrap"}>
                            <CustomInput w={"48%"} type={"text"} name="marchantId" label={"Merchant Id"} autoFocus={true} inputValue={inputValue} setInputValue={setInputValue} />
                            <CustomInput w={"48%"} type={"text"} name="username" label={"UserName"} inputValue={inputValue} setInputValue={setInputValue} />
                            <CustomInput w={"48%"} type={"text"} name="password" label={"Password"} inputValue={inputValue} setInputValue={setInputValue} />
                            <CustomInput w={"48%"} type={"text"} name="secretKey" label={"Secret Key"} inputValue={inputValue} setInputValue={setInputValue} />
                        </Flex>
                    </ModalBody>

                    <ModalFooter>
                        <Button size={"sm"} mr={3} onClick={closeModal} variant='outline' colorScheme={"red"}>
                            Close
                        </Button>
                        <Button size={"sm"} type="submit" colorScheme={themeColor} isLoading={addPayGateWayStatus === STATUS.FETCHING}>Activate</Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    )
}