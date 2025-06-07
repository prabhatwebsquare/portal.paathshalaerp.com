import { createStandaloneToast } from "@chakra-ui/react"

const { toast } = createStandaloneToast()

export function SuccessAlert(message = '') {
    toast({
        title: "SUCCESS",
        description: message,
        status: 'success',
        duration: 4000,
        isClosable: true,
    })
}

export function ErrorAlert(message = '') {
    toast({
        title: "FAILED",
        description: message,
        status: 'error',
        duration: 4000,
        isClosable: true,
    })
}