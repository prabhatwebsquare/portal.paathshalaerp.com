import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack } from "@chakra-ui/react"
import { useState } from "react"

export const SendPendingSMS = ({ closeModal, data }) => {
    const [value, setValue] = useState()
    return (
        <Modal isOpen={data} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Pending Fees SMS</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <RadioGroup onChange={setValue} value={value}>
                        <Stack direction='row'>
                            <Radio value='sms'>SMS</Radio>
                            <Radio value='email'>Email</Radio>
                            <Radio value='app-notification'>App Notification</Radio>
                        </Stack>
                    </RadioGroup>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={closeModal}>
                        Close
                    </Button>
                    <Button variant='ghost'>Send</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}